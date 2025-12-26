<template>
  <view class="mb-[16rpx] last:mb-0">
    <view class="rounded-[24rpx]  bg-black rounded-[32rpx] shadow-[0_0_16px_0_#266AFF_inset]">
      <view class="flex items-center justify-center px-[32rpx] py-[24rpx] text-base text-white font-semibold">{{ title
        }}</view>
      <!-- 标题行：左侧标题，右侧当前统计 -->

      <!-- 分隔线 -->
      <!-- <view class="h-[1px] bg-[#E0C2A0]/15 mb-[16rpx]"></view> -->
      <!-- 升级要求行 -->
      <view class="flex flex-row items-center justify-between border-white/15 border-solid border-b-[0.5px] border-t-[0.5px] border-l-0 border-r-0">
        <view class="flex flex-col items-start justify-between px-[32rpx] py-[16rpx] flex-1">
          <text class="text-base text-white mb-[8rpx]">升级要求({{ unit }})</text>
          <text class="text-lg font-bold text-[#5493FF]">{{ levelReq }}</text>
        </view>
        <!-- 升级差距行 -->
        <view class="flex flex-col items-start justify-between px-[32rpx] py-[16rpx] flex-1">
          <text class="text-base text-white mb-[8rpx]">升级差距({{ unit }})</text>
          <text class="text-lg font-bold text-[#5493FF]">{{ levelGap }}</text>
        </view>
      </view>
      <view class="flex flex-row items-center justify-center px-[32rpx] py-[24rpx]">
        <text class="text-base text-white mr-[8rpx]">当前统计</text>
        <text class="text-lg font-bold text-[#5493FF]">{{ currentValue }}</text>
        <text class="text-lg font-bold text-[#5493FF] ml-[4rpx]">{{ unit }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: String,
  unit: String,
  levelReq: String,
  levelGap: String,
  currentValue: String,
});
</script>

<style lang='scss' scoped>
.vip-title {
  color: #000;
}

.gradient-text {
  background: linear-gradient(110deg, #FFF 6.48%, #FFDABD 83.04%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>