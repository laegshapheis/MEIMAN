<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    :navTitle="title"
    bgType="bg-main"
  >
    <view
      class="px-[32rpx] pt-[28rpx] pb-[30rpx] box-border w-full flex flex-col"
    >
      <view class="flex flex-col">
        <wk-stroke-bg
          shadow
          size="small"
          v-for="(item, index) in dataList"
          :key="index"
          @click="navTo(item)"
          class="flex flex-row items-center mb-[24rpx] relative"
        >
          <view class="flex flex-row">
            <view
              class="flex flex-col items-center justify-center w-[140rpx] h-[140rpx] bg-[length:100%_100%] bg-no-repeat"
            >
              <image
                class="w-[100%] h-[100%] rounded-[16rpx]"
                :src="item.image"
                mode="aspectFit"
              ></image>
            </view>
          </view>

          <view
            class="flex flex-col items-start justify-between min-h-[100rpx] ml-[20rpx]"
          >
            <text class="text-base font-medium line-clamp-3 break-all">{{
              item.title
            }}</text>
            <text class="text-sm text-neutral-regular">{{
              item.created_at
            }}</text>
          </view>
        </wk-stroke-bg>
      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import { getNewsList as getNewsListApi } from "@/api/index";
import Empty from "@/components/base/empty";
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();
import { cacheManager } from "@/utils/cacheManager";

const cacheNewsList = cacheManager.getCache("newsList");

const page = ref(1);
const dataList = ref([]);
const layoutRef = ref(null);
const pullType = ref("");
const id = ref(54);
const title = ref($t("news.title"));
const loading = ref(false);

onLoad((options) => {
  id.value = options.id;
  if (options.title) title.value = decodeURIComponent(options.title);
  if (cacheNewsList) {
    handleResList(cacheNewsList);
  }
  getList();
});

const handleRefresh = () => {
  pullType.value = "down";
  page.value = 1;
  getList();
};

// 上拉加载
onReachBottom(() => {
  getPaginationList();
});

const getPaginationList = () => {
  pullType.value = "up";
  page.value++;
  getList();
};

const handleResList = (result) => {
  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });
    return;
  }

  if (pullType.value == "down" || page.value == 1) {
    dataList.value = [];
  }

  dataList.value = result.articlescategory;
  loading.value = false;
};

const getList = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
  }

  const result = await getNewsListApi({
    sortid: id.value,
    page: page.value,
  });

  layoutRef.value.complete();

  if (page.value == 1) {
    cacheManager.setCache("newsList", result);
  }

  handleResList(result);
};

const navTo = (item) => {
  let title = item.title;
  if (id.value == 54) {
    title = $t("news.newsDetail");
  }
  if (id.value == 65) {
    title = $t("news.noticeDetail");
  }
  uni.navigateTo({
    url: `${routes.newsDetail}?id=${item.id}&title=${encodeURIComponent(
      title
    )}`,
  });
};
</script>

<style lang="scss" scoped></style>
