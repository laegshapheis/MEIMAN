<template>
  <view class="flex flex-col flex-2 justify-between">
    <view
      @click="handleInviteFriend"
      class="h-[96rpx] box-border content-box invite-box flex items-center bg-pink-50 px-[32rpx] py-[16rpx] rounded-lg"
    >
      <view class="rounded-full flex items-center justify-center mr-2">
        <image
          class="w-[48rpx] h-[48rpx]"
          src="/static/images/index/invite_friend.svg"
        ></image>
      </view>
      <text class="text-[#8E4226] text-sm font-bold">邀请好友</text>
    </view>
    <view
      @click="handleServiceOnline"  
      class="h-[96rpx] box-border content-box service-box flex items-center bg-green-50 px-[32rpx] py-[16rpx] rounded-lg"
    >
      <view class="rounded-full flex items-center justify-center mr-2">
        <image
          class="w-[48rpx] h-[48rpx]"
          src="/static/images/index/service_online.svg"
        ></image>
      </view>
      <text class="text-[#147F16] text-sm font-bold">在线客服</text>
    </view>
  </view>
</template>

<script setup>
import { routes } from '@/config/routes';
const handleInviteFriend = () => {
  uni.navigateTo({
    url: routes.inviteIndex,
  });
};
const handleServiceOnline = () => {
  uni.switchTab({
    url: routes.service,
  });
};
</script>

<style scoped>
.content-box {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.invite-box {
  background-image: url("/static/images/index/invite_friend_bg.png");
}
.service-box {
  background-image: url("/static/images/index/service_online_bg.png");
}
</style>
