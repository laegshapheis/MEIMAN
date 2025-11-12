<template>
  <wk-stroke-bg shadow class="mt-[24rpx] mb-[200rpx]" >
    <view class="text-xl font-bold text-neutral mb-[20rpx]">项目详情</view>
    <view class="text-neutral-theme text-base">
      <uv-parse
        space="nbsp"
        class="uni-rich-text"
        style="white-space: pre-wrap"
        :content="productview.content"
      ></uv-parse>
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