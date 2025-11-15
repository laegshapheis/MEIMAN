<template>
  <view class="flex flex-col mt-[64rpx]">
    <view class="flex flex-row items-center justify-between">
      <text class="text-lg font-medium text-neutral">外币汇率换算</text>
    </view>

    <view class="flex flex-col justify-center mt-[21rpx] px-[32rpx] py-[24rpx] rounded-[48rpx] 
    bg-white">
      <view class="flex flex-row items-center justify-end grow-1 bg-black/5 rounded-full">
        <uv-input
          maxlength="8"
          class="mx-[16rpx] rounded-[32rpx] w-[40%] h-[80rpx] font-bold"
          v-model="USDTInput"
          type="number"
          placeholder="请输入"
          border="none"
          :customStyle="{ borderRadius: '32rpx', paddingLeft: '32rpx' }"
          :placeholderStyle="{
            color: $colors.secondary,
            fontSize: '30rpx',
          }"
          fontSize="30rpx"
          @change="handleUSDTChange"
          inputAlign="left"
          :color="$colors.DEFAULT"
        />
        <view class="flex flex-row items-center gap-[8rpx] bg-white rounded-[32rpx] px-[16rpx] py-[8rpx] text-neutral mr-[16rpx]">
          <image class="w-[32rpx] h-[32rpx]" src="/static/images/profile/usdt_icon.png" mode="widthFix" />
          <text class="text-base">{{ symbolStore.exchangeUsdtLabel }}</text>
        </view>
      </view>

      <view class="flex flex-row items-center justify-center mx-[10rpx] w-full my-[-12rpx]">
        <image src="/static/images/user/exchange_icon.svg" mode="widthFix" class="w-[64rpx] h-[64rpx]" />
      </view>

      <view class="flex flex-row items-center justify-start grow-1 bg-black/5 rounded-[16rpx]">
        <uv-input
          maxlength="8"
          class="mx-[16rpx] rounded-[360rpx] w-[40%] h-[80rpx] font-bold"
          v-model="CNYInput"
          type="number"
          placeholder="请输入"
          border="none"
          :customStyle="{ borderRadius: '32rpx', paddingLeft: '32rpx' }"
          :placeholderStyle="{
            color: $colors.secondary,
            fontSize: '30rpx',
          }"
          fontSize="30rpx"
          :color="$colors.DEFAULT"
          @change="handleCNYChange"
          inputAlign="left"
        />
        
        <view class="flex flex-row items-center gap-[8rpx] bg-white rounded-[32rpx] px-[16rpx] py-[8rpx] text-neutral mr-[16rpx]">
          <image class="w-[32rpx] h-[32rpx]" src="/static/images/profile/cny_icon.png" mode="widthFix" />
          <text class="text-base">CNY</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import { formatPrice } from "@/utils/utils"
import { useSymbolStore } from '@/stores/symbolStore';

const symbolStore = useSymbolStore();

const props = defineProps({
  rate: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['update:usdtValue', 'update:cnyValue'])

const USDTInput = ref(1)
const CNYInput = ref(1)

const handleUSDTChange = (value) => {
  value = value || 0
  const calc = formatPrice((value * 100 * props.rate) / 100)
  CNYInput.value = calc
  emit('update:usdtValue', value)
  emit('update:cnyValue', calc)
}

const handleCNYChange = (value) => {
  value = value || 0
  const calc = formatPrice(value / props.rate)
  USDTInput.value = calc
  emit('update:usdtValue', calc)
  emit('update:cnyValue', value)
}

watch(() => props.rate, (newRate) => {
  handleUSDTChange(USDTInput.value)
}, { immediate: true })
</script> 