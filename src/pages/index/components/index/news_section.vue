<template>
  <view class="mt-[16rpx]">
    <view class="flex justify-between items-center mb-[32rpx]">
      <text class="text-neutral-white font-bold text-xl">新闻资讯</text> 
      <view class="flex items-center gap-1" @click="goToNewsList">
        <image src="/static/images/index/index_right.svg" class="w-[96rpx] h-[96rpx]" mode="widthFix"></image>
      </view>
    </view>
    
    <view v-if="!newsList?.length" class="flex flex-col items-center justify-center py-4">
      <image src="/static/images/user/empty.png" class="w-[200rpx] h-[200rpx] mb-2" />
      <text class="text-neutral text-sm">暂无资讯</text>
    </view>
    <view v-else class="flex flex-col mb-[24rpx]">
      <wk-stroke-bg 
        size="small"
        bgColor="transparent"
        @click="goToNewsDetail(item.id)"
        borderRadius="24rpx" 
        v-for="item in newsList" 
        :key="item.id" 
        class="mb-[16rpx] px-[24rpx] bg-[#00000025]">
        <view class="flex flex-row justify-start items-center">
          <image :src="item.image" class="w-[192rpx] h-[144rpx] rounded-[16rpx] flex-shrink-0" mode="widthfix" style="aspect-ratio: 16/9;"></image>
          <view class="flex flex-col ml-[24rpx] flex-1 min-w-0">
            <text class="text-base font-bold text-neutral-white line-clamp-2 break-all">{{ item.title }}</text>
            <text class="text-neutral-white/60 text-sm mt-[16rpx]">{{ item.created_at }}</text>
          </view>
        </view>
      </wk-stroke-bg>
    </view>
  </view>
</template> 

<script setup>
import { routes } from "@/config/routes";

defineProps({
  newsList: {
    type: Array,
    default: [],
  },
});

const goToNewsList = () => {
  uni.navigateTo({
    url: routes.newsList + `?id=54&title=${encodeURIComponent("新闻列表")}`,
  });
};

const goToNewsDetail = (id) => {
  uni.navigateTo({
    url: `${routes.newsDetail}?id=${id}&title=${encodeURIComponent(
      "新闻资讯"
    )}`,
  });
};
</script>

<style lang="scss" scoped>
.pd-bg {
  background-size: 100% 100%;
  background-color: #dffce9;
}

.news-card {
  position: relative;
  overflow: hidden;
  min-height: 240rpx;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #00000025;
    z-index: 1;
  }
  
  > view {
    position: relative;
    z-index: 2;
    min-height: 240rpx;
  }
}
</style>
