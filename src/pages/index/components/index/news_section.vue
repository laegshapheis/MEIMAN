<template>
  <view class="mt-[16rpx]">
    <view class="flex justify-between items-center mb-[32rpx]">
      <text class="text-neutral-black text-2xl">新闻资讯</text> 
      <view class="flex items-center gap-1" @click="goToNewsList">
        <image src="/static/images/index/index_right.svg" class="w-[48rpx] h-[48rpx]" mode="widthFix"></image>
      </view>
    </view>
    
    <view v-if="!newsList?.length" class="flex flex-col items-center justify-center py-4">
      <image src="/static/images/user/empty.png" class="w-[200rpx] h-[200rpx] mb-2" />
      <text class="text-neutral text-sm">暂无资讯</text>
    </view>
    <view v-else class="flex flex-col mb-[24rpx]">
      <wk-stroke-bg 
        size="small"
        bgColor="#FFFFFF"
        @click="goToNewsDetail(item.id)"
        borderRadius="24rpx" 
        v-for="item in newsList" 
        :key="item.id" 
        class="mb-[16rpx] px-[24rpx]">
        <view class="flex flex-row justify-start items-center relative">
          <image :src="item.image" class="w-[240rpx] h-[240rpx] rounded-[24rpx] flex-shrink-0" mode="widthfix" style="aspect-ratio: 30/17;"></image>
          <view class="flex flex-col ml-[24rpx] flex-1 min-w-0">
            <text class="text-base font-bold text-neutral-black line-clamp-2 break-all">{{ item.title }}</text>
            <text class="text-neutral-secondary text-sm mt-[16rpx]">{{ item.created_at }}</text>
          </view>
          <view class="rounded-full bg-[#000000] absolute right-0 bottom-0 flex items-center justify-center pl-[32rpx] pr-[16rpx] py-[8rpx]" @click="goToProductDetail(item.id)">
                    <text class="text-sm text-white">去投资</text>
                    <uv-icon name="arrow-right" size="10" color="#FFFFFF" class="ml-[8rpx]"></uv-icon>
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
