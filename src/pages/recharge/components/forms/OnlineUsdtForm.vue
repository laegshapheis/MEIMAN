<template>
  <view class="flex flex-col justify-center mt-[38rpx] mb-[62rpx]">
    <view class="text-base leading-6">
      <CommonTips fontSize="28rpx" :content="paymentDesc"></CommonTips>
    </view>

    <view class="flex flex-col items-center justify-between py-[56rpx] w-full h-[320rpx]">
      <view class="flex flex-col items-center justify-center">
        <view class="flex flex-row items-center justify-center">
          <view class="w-[320rpx] h-[320rpx] bg-[#fff] p-[10rpx]">
            <uv-qrcode size="320rpx" ref="qrcode" :value="walletUrl"></uv-qrcode>
          </view>
        </view>
      </view>

      <view class="flex flex-row items-center justify-center w-[598rpx] mt-[24rpx]" @click="handleCopy">
        <text class="text-lg leading-6 font-bold ml-[32rpx] text-neutral-secondary">{{ walletUrl == "重新获取" ? "" : walletUrl }}</text>
      </view>
    </view>

    <view class="mt-[58rpx]">
      <wk-button class="mb-[28rpx]" type="bg" @submit="handleCopy">复制地址</wk-button>
    </view>
  </view>
</template>

<script setup>
import CommonTips from "@/components/base/common-tips"

const props = defineProps({
  paymentDesc: {
    type: String,
    required: true
  },
  walletUrl: {
    type: String,
    required: true
  }
})

const handleCopy = () => {
  uni.setClipboardData({
    data: props.walletUrl,
    success: function () {
      uni.$showToast({
        title: "地址已复制",
        duration: 1500,
        icon: "none",
      })
    },
  })
}
</script> 