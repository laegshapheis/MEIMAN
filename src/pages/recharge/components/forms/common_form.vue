<template>
  <view class="flex flex-col justify-center mt-[38rpx]">
    <view class="flex flex-row items-center justify-between mt-[24rpx] mb-[23rpx]">
      <text class="text-lg leading-6 font-medium text-neutral">充值金额</text>
    </view>

    <view :class="['flex flex-col bg-[#FFFFFF] rounded-[24rpx] px-[32rpx]', symbolStore.value == 'USDT' ? 'pb-[24rpx]' : '']">
      <view :class="['flex flex-row items-center justify-center h-[120rpx]', symbolStore.value == 'USDT' ? 'border-0 border-b border-solid border-neutral-divider' : '']">
        <text class="text-2xl font-bold">¥</text>
        <uv-input
          class="h-[120rpx]"
          v-model="formData.amount"
          type="digit"
          maxlength="9"
          placeholder="请输入充值金额"
          border="0"
          :placeholderStyle="{
            color: $colors.secondary,
            fontSize: '32rpx',
            fontWeight: 'normal',
          }"
          :customStyle="{
            fontWeight: 'bold',
          }"
          fontSize="36rpx"
          :color="$colors.DEFAULT"
        />
      </view>

      <view class="flex flex-row items-center justify-between mt-[16rpx] text-neutral-theme" v-if="symbolStore.value == 'USDT'">
        <text class="text-base font-medium">1 {{ symbolStore.code }} = {{ rate }} CNY</text>
        <text class="text-base">实际到账 {{ formData.amount ? formatPrice((formData.amount * 100) / (rate * 100)) : 0 }} {{ symbolStore.code }}</text>
      </view>
    </view>
    <view class="fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx] bg-neutral-bottomBtnBg">
      <wk-button type="bg" @submit="handleSubmit">提交</wk-button>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import { formatPrice } from "@/utils/utils"
import { useSymbolStore } from "@/stores/symbolStore";

const symbolStore = useSymbolStore();
const props = defineProps({
  rate: {
    type: Number,
    required: true
  },
  minAmount: {
    type: Number,
    required: true
  },
  maxAmount: {
    type: Number,
    required: true
  },
})

const emit = defineEmits(['submit'])

const formData = reactive({
  amount: '',
})

const checkRange = (value, min, max) => {
  if (value < min || value > max) {
    uni.$showToast({
      title: `数值必须在 ${min} 到 ${max} 之间`,
      icon: "none",
    })
    return false
  }
  return true
}

const handleSubmit = () => {
  if (!formData.amount) {
    uni.$showToast({
      title: "请输入充值金额",
      duration: 3000,
      icon: "none",
    })
    return
  }

  if (!checkRange(formData.amount, props.minAmount, props.maxAmount)) {
    uni.$showToast({
      title: `最低充值${props.minAmount} CNY，最高充值${props.maxAmount} CNY，请重新输入`,
      duration: 3000,
      icon: "none",
    })
    return false
  }

  formData.usdt = formatPrice(formData.amount / props.rate)
  emit('submit', formData)
}
</script> 