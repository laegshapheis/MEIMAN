<template>
   <view class="mb-[32rpx] last:mb-0">
      <view class="rounded-[24rpx] bg-white/10">
        <!-- 标题行：左侧标题，右侧当前统计 -->
        <view class="flex flex-row items-center justify-between mb-[16rpx] bg-white/10 px-[32rpx] py-[16rpx] rounded-t-[24rpx]">
          <text class="text-xl font-bold text-white">{{ title }}</text>
          <view class="flex flex-row items-center">
            <text class="text-sm text-white/70 mr-[8rpx]">当前统计</text>
            <text class="text-xl font-bold gradient-text">{{ currentValue }}</text>
            <text class="text-xl font-bold gradient-text ml-[4rpx]">{{ unit }}</text>
          </view>
        </view>
        <!-- 分隔线 -->
        <!-- <view class="h-[1px] bg-[#E0C2A0]/15 mb-[16rpx]"></view> -->
        <!-- 升级要求行 -->
        <view class="flex flex-row items-center justify-between mb-[16rpx] px-[32rpx] py-[16rpx]">
          <text class="text-sm text-white/70">升级要求({{unit}})</text>
          <text class="text-xl font-bold gradient-text">{{ levelReq }}</text>
        </view>
        <!-- 分隔线 -->
        <view class="h-[1px] bg-[#E0C2A0]/15 mb-[16rpx]"></view>
        <!-- 升级差距行 -->
        <view class="flex flex-row items-center justify-between px-[32rpx] py-[16rpx]">
          <text class="text-sm text-white/70">升级差距({{unit}})</text>
          <text class="text-xl font-bold gradient-text">{{ levelGap }}</text>
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