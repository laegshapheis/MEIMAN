<template>
  <view class="flex flex-row items-center justify-between px-[32rpx] gap-[32rpx] mt-[32rpx]">
    <view
      @click="goInvite"
      class="h-[128rpx] flex-grow box-border content-box invite-box flex items-center bg-recharge-topBg px-[32rpx] py-[16rpx] rounded-[8rpx]"
    >
      <view class="rounded-full flex items-center justify-center mr-2">
        <image
          class="w-[80rpx] h-[80rpx]"
          src="/static/images/index/invite_friend.svg"
        ></image>
      </view>
      <text class="text-neutral-theme text-sm font-bold">邀请好友</text>
    </view>
    
    <view
      @click="goCheckIn"  
      class="h-[128rpx] flex-grow box-border content-box service-box flex items-center bg-recharge-topBg px-[32rpx] py-[16rpx] rounded-[8rpx]"
    >
      <view class="rounded-full flex items-center justify-center mr-2">
        <image
          class="w-[80rpx] h-[80rpx]"
          src="/static/images/index/sign_icon.svg"
        ></image>
      </view>
      <text class="text-neutral-theme text-sm font-bold">每日签到</text>
    </view>
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
    url: routes.inviteIndex,
  });
};

const goCheckIn = async () => {
  if (authStatus.value !== 1) {
    const stat = await checkAuth()
    if (stat !== 1) {
      return
    }
  }
  uni.navigateTo({
    url: routes.checkIn,
  });
};
</script>

<style scoped lang="scss">
</style>
