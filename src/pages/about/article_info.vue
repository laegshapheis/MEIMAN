<template>
  <layout :navTitle="currentArticle.title" bgType="bg-[#F5F8FD]" >
    <view
      class="px-[32rpx] pt-[24rpx] pb-[30rpx] box-border w-full flex flex-col"
    >
      <view class="article_box text-base" v-if="currentArticle.article.ccontent">
        <uv-parse
          :show-img-menu="false"
          :content="currentArticle.article.ccontent"
          container-style="white-space: pre-wrap"
        ></uv-parse>
      </view>
    </view>
    <wk-loading v-if="loading" />
  </layout>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import {
  onLoad,
  onShow,
  onReachBottom,
  onPullDownRefresh,
  onUnload,
} from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateTo } from "@/utils/navigation";
import { setImageWidth } from "@/utils/utils";
import { useArticleStore } from "@/stores/articleStore";

import CommonTips from "@/components/base/common-tips";
import Empty from "@/components/base/empty";

import { formatPrice } from "@/utils/utils";

import { getPageDetails as getPageDetailsApi } from "@/api/index";

const loading = ref(false);
const articleStore = useArticleStore();

const id = ref(0);
const type = ref('');

const currentArticle = computed(() => {
  return articleStore.getArticleDetails(type.value);
});

// 检查缓存是否过期
const isCacheExpired = (updateTime) => {
  const CACHE_EXPIRE_TIME = 30 * 60 * 1000; // 30分钟
  return Date.now() - updateTime > CACHE_EXPIRE_TIME;
};

onLoad((options) => {
  id.value = options.id;
  // 直接使用传入的type作为缓存key
  type.value = options.id || '';
  
  // 清理过期缓存
  articleStore.clearExpiredCache();
  
  const cache = currentArticle.value;
  // 如果没有缓存数据或缓存已过期，显示加载状态
  if (!cache.article.ccontent || isCacheExpired(cache.updateTime)) {
    getDetails(true);
  } else {
    // 有缓存数据且未过期，后台刷新
    getDetails(false);
  }
});

const getDetails = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
  }

  try {
    const result = await getPageDetailsApi({
      id: id.value,
    });
    console.log(result);
    if (result.status && result.status != 0) {
      loading.value = false;
      uni.$showToast({
        title: result.msg,
        duration: 3000,
        icon: "none",
      });
      return;
    }

    // #ifdef APP-PLUS
    result.article.ccontent = setImageWidth(result.article.ccontent);
    // #endif

    if (type.value) {
      articleStore.setArticleDetails(result, type.value);
    }

    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};

// 定期清理过期缓存
let clearCacheTimer;
onMounted(() => {
  clearCacheTimer = setInterval(() => {
    articleStore.clearExpiredCache();
  }, 5 * 60 * 1000); // 每5分钟检查一次
});

onUnload(() => {
  // 清除定时器
  if (clearCacheTimer) {
    clearInterval(clearCacheTimer);
  }
});
</script>

<style lang="scss" scoped>
.article_box {
  box-sizing: border-box;
  position: relative;
}
</style>
