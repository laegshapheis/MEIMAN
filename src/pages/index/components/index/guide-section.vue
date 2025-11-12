<template>
  <view class="flex flex-row items-center justify-between px-[32rpx] gap-[20rpx]">
    <wk-stroke-bg
      @click="goInvite"
      class="flex-1 h-[112rpx] flex-grow box-border content-box invite-box flex items-center bg-recharge-topBg rounded-[24rpx]"
    >
      <view class="rounded-full flex items-center justify-center mr-2">
        <image
          class="w-[80rpx] h-[80rpx]"
          src="/static/images/index/guide_icon.png"
        ></image>
      </view>
      <view class="flex flex-col items-start gap-1">
        <text class="text-neutral-theme text-sm font-bold">学堂</text>
        <text class="text-neutral-theme text-xs">伴你财富成长</text>
      </view>
    </wk-stroke-bg>
    
    <wk-stroke-bg
      @click="goCheckIn"  
      class="flex-1 h-[112rpx] flex-grow box-border content-box service-box flex items-center bg-recharge-topBg rounded-[24rpx]"
    >
      <view class="rounded-full flex items-center justify-center mr-2">
        <image
          class="w-[80rpx] h-[80rpx]"
          src="/static/images/index/play.png"
        ></image>
      </view>
      <view class="flex flex-col items-start gap-1">
        <text class="text-neutral-theme text-sm font-bold">直播</text>
        <text class="text-neutral-theme text-xs">疯狂来袭</text>
      </view>
    </wk-stroke-bg>
  </view>
</template>

<script setup>
import { useAuth } from '@/hooks/useAuth'
import { routes } from "@/config/routes";
const { authStatus, checkAuth } = useAuth()

const props = defineProps({ 
  isAuth: {
    type: Boolean,
    default: false,
  },
});
const goInvite = async () => {
  if (authStatus.value !== 1) {
    const stat = await checkAuth()
    if (stat !== 1) {
      return
    }
  }
  uni.navigateTo({
    url: routes.indexGuide,
  });
};

const goCheckIn = async () => {
  uni.$showToast({
    title: '暂未开放！敬请期待',
    icon: 'none',
  });
  return;
  if (authStatus.value !== 1) {
    const stat = await checkAuth()
    if (stat !== 1) {
      return
    }
  }
  uni.navigateTo({
    url: routes.zhibo,
  });
};
</script>

<style scoped lang="scss">
</style>
