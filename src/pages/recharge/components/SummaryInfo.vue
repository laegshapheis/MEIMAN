<template>
  <view
    class="flex flex-row justify-around relative w-full rounded-[24rpx] h-[186rpx] bg-card3"
  >
    <view class="flex flex-col items-center justify-center">
      <text class="text-base text-white/60">投资余额({{ symbolCode }})</text>
      <text class="mt-[16rpx] font-semibold leading-6 text-2xl text-white">{{ zhamount }}</text>
    </view>

    <view class="flex flex-col items-center justify-center">
      <text class="text-base text-white/60">提现余额({{ symbolCode }})</text>
      <text class="mt-[16rpx] font-semibold leading-6 text-2xl text-white">{{ txmoney }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  symbolCode: {
    type: String,
    required: true
  },
  zhamount: {
    type: [String, Number],
    required: true
  },
  txmoney: {
    type: [String, Number], 
    required: true
  }
})
</script> 