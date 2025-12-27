<template>
  <wk-stroke-bg shadow class="mt-[24rpx] mb-[200rpx]" mode="img-card3-big">
    <view class="mb-[20rpx]">
      <image src="/static/images/product/chanpinjieshao.png" class="w-full" mode="widthFix"/>
    </view>
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