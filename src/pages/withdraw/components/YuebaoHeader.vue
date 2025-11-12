<template>
  <view
    v-if="isduodeli"
    class="mb-[64rpx] flex flex-row justify-start mx-auto w-full h-[112rpx] rounded-[16rpx]"
  >
    <view
      class="flex flex-row items-center justify-around w-[100%] px-[28rpx] text-white rounded-[24rpx] bg-card3"
    >
      <image
        class="w-[44rpx] h-[44rpx] mr-[12rpx]"
        src="/static/images/profile/yuebao_top_lit_bg.png"
        mode="widthFix"
      ></image>
      <text class="text-white font-medium text-[30rpx]">余额宝</text>
      <view
        class="grow flex flex-row justify-end text-lg"
        @click="handleNavigate"
      >
        <text class="text-white text-[30rpx] font-medium text-right">闲置资金再添利</text>
        <view class="flex flex-row items-center ml-[5rpx]"
          ><uv-icon size="30rpx" :color="$colors.theme" name="arrow-right"></uv-icon
        ></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { routes } from "@/config/routes";
import { navigateTo } from "@/utils/navigation";

defineProps({
  isduodeli: {
    type: Number,
    default: 0
  }
});

const handleNavigate = () => {
  navigateTo(routes.yuebao);
};
</script> 