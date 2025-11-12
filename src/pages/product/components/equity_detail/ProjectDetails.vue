<template>
  <wk-stroke-bg class="mt-[24rpx] mb-[200rpx]">
    <view class="text-xl font-bold text-neutral mb-[20rpx]">项目详情</view>
    <view class="text-neutral-regular text-base">
      <rich-text :nodes="productview.content"></rich-text>
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