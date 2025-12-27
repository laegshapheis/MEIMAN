<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    :navTitle="title"
    bgType="bg-main"
    @onScroll="handleScroll"
  >
  <!-- 视频卡片 -->
    <video-card
        ref="videoCardRef"
        v-if="isVideo == 1"
        :videoUrl="videoUrl"
        :posterUrl="posterUrl"
        class="my-[32rpx]"
      />
    <view
      class="px-[32rpx] pt-[28rpx] pb-[30rpx] box-border w-full flex flex-col"
    >
      
      
      <view class="flex flex-col">
        <view class="flex items-center justify-center mb-[24rpx]">
          <text class="text-xl font-medium">最新公告</text>
        </view>
        <view
          v-for="(item, index) in dataList"
          :key="index"
          @click="navTo(item)"
          class="news-item flex flex-row items-start mb-[24rpx] relative"
        >
          <view class="flex flex-col">
            <view
              class="w-[96rpx] h-[96rpx] "
            >
              <image
                class="w-[100%] h-[100%] rounded-full"
                src="/static/images/news_logo.png"
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
        </view>
      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import { getNewsList as getNewsListApi, getIndexData } from "@/api/index";
import Empty from "@/components/base/empty";
import { useI18n } from "vue-i18n";
const { t: $t } = useI18n();
import { cacheManager } from "@/utils/cacheManager";
import videoCard from "@/pages/index/components/index/video_card.vue";

const cacheNewsList = cacheManager.getCache("newsList");

const page = ref(1);
const dataList = ref([]);
const layoutRef = ref(null);
const pullType = ref("");
const id = ref(54);
const title = ref($t("news.title"));
const loading = ref(false);
const isVideo = ref(0);
const videoUrl = ref("");
const posterUrl = ref("");
const videoCardRef = ref(null);

onLoad((options) => {
  id.value = options.id;
  if (options.title) title.value = decodeURIComponent(options.title);
  if (cacheNewsList) {
    handleResList(cacheNewsList);
  }
  getVideoData();
  getList();
});

const handleRefresh = () => {
  pullType.value = "down";
  page.value = 1;
  getVideoData();
  if (videoCardRef.value) {
    videoCardRef.value.pauseVideo();
  }
  getList();
};

const handleScroll = () => {
  if (videoCardRef.value) {
    videoCardRef.value.pauseVideo();
  }
};

const getVideoData = () => {
  getIndexData().then((res) => {
    isVideo.value = res.isvideo;
    videoUrl.value = res.videourl;
    posterUrl.value = res.voidpic;
  });
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

<style lang="scss" scoped>
.news-item {
  border-radius: var(--radius-card-xl, 24px);
  border: 0.5px solid #5255FF;
  background: radial-gradient(29.86% 44.56% at 2.69% 0%, rgba(41, 244, 255, 0.33) 0%, rgba(35, 189, 255, 0.00) 100%), radial-gradient(74.52% 105.46% at 16.43% -5.45%, rgba(35, 189, 255, 0.41) 0%, rgba(35, 189, 255, 0.00) 100%), radial-gradient(80.68% 149.35% at 2.97% 6.36%, rgba(0, 89, 255, 0.69) 0%, rgba(26, 0, 137, 0.00) 100%), radial-gradient(100% 100% at 50% 0%, #1A0089 0%, #120058 70.06%, #15006B 100%);
  padding: 24rpx;
  box-sizing: border-box;
}
</style>
