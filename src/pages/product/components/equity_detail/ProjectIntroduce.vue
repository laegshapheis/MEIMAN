<template>
  <wk-stroke-bg class="mt-[24rpx]">
    <view class="text-xl font-bold text-neutral mb-[20rpx]">产品介绍</view>
    <view class="text-neutral-regular text-base">
      <view class="flex items-center">
        <text class="text-neutral-regular text-base">总出售量</text>
        <text class="ml-[16rpx] text-neutral-regular">{{ productview.xmgm }}</text>
      </view>
      <view class="flex items-center mt-[16rpx]">
        <text class="text-neutral-regular text-base">担保机构</text>
        <text class="ml-[16rpx] text-neutral-regular">{{ productview.bljg }}</text>
      </view>
    </view>
  </wk-stroke-bg>
</template>

<script setup>
defineProps({
  productview: {
    type: Object,
    required: true
  }
})
</script> 