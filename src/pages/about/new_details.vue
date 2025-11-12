<template>
  <layout :navTitle="title || details.title" bgType="bg-main" >  
    <view class="px-[32rpx] pt-[24rpx] pb-[30rpx] box-border w-full flex flex-col">
        <view
          v-if="details.content"
          class="flex flex-row px-[10rpx] relative leading-6 text-base">
          <view class="article_box text-base w-full">
            <uv-parse :show-img-menu="false" :content="details.content" container-style="white-space: pre-wrap"></uv-parse>
          </view>
        </view>
    </view>
    <wk-loading v-if="loading" />
  </layout>
</template>

<script setup>

import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { setImageWidth } from "@/utils/utils"
import { getNewsDetails as getNewsDetailsApi } from "@/api/index";
import { cacheManager } from "@/utils/cacheManager";

const id = ref(0)
const loading = ref(false)
const details = ref({})
const title = ref('')
onLoad((options) => {
  title.value = options.title ? decodeURIComponent(options.title) : ''
  id.value = options.id
  const cacheData = cacheManager.getCache("newsDetails" + id.value);
  if (cacheData) {
    details.value = cacheData.article;
  }
  getDetails();
});


const getDetails = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
  }

  try {
  const result = await getNewsDetailsApi({
    id: id.value
  });
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
  result.article.content = setImageWidth(result.article.content);
  // #endif

  details.value = result.article
  cacheManager.setCache("newsDetails" + id.value, result);

  loading.value = false;
 } catch (e) {
    loading.value = false;
 }
}


</script>

<style lang="scss" scoped>
.article_box {
  box-sizing: border-box;
  min-height: calc(100vh - var(--status-bar-height) - 88rpx);
  position: relative;
  img {
    width: 100%;
    object-fit: fill;
  }
}
</style>