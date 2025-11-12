<template>
  <view  class="py-[16rpx] flex flex-row items-center justify-between fixed top-0 left-0 right-0 z-10"
  style="background: linear-gradient(180deg, #011531 0%, #011B3D 100%); padding-top: calc(16rpx + var(--status-bar-height));">
    <image src="/static/images/index/logo.png" class="w-[214rpx] h-[74rpx]" mode="widthFix" />
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