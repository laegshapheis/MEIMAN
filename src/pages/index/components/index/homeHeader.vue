<template>
  <view  class="py-[16rpx] flex flex-row items-center justify-between mb-[16rpx]"
  style="padding-top: calc(16rpx + var(--status-bar-height));">
    <image src="/static/images/index/logo.png" class="w-[151.6rpx] h-[48rpx]" mode="widthFix" />
    <view>
      <image @click="handleShopIcon" src="/static/images/index/shoping.svg" class="w-[72rpx] h-[72rpx]" mode="widthFix" />
      <image @click="handleQiandao" src="/static/images/index/qiandao.svg" class="w-[72rpx] h-[72rpx] ml-[16rpx]" mode="widthFix" />
    </view>
    <!-- <wk-language-selector :plain="false"/> -->
  </view>
</template>

<script setup>
import { routes } from '@/config/routes';
import { useAuth } from "@/hooks/useAuth";
const props = defineProps({
  isAuth: {
    type: Boolean,
    default: false,
  },
});
const { checkAuth } = useAuth();
const handleQiandao = () => {
  if (!props.isAuth) {
    checkAuth(true, false);
    return;
  }
  uni.navigateTo({
    url: routes.checkIn,
  });
};
const handleShopIcon = () => {
  if (!props.isAuth) {
    checkAuth(true, false);
    return;
  }
  uni.navigateTo({
    url: routes.storeList,
  });
};
</script>