<template>
  <view class="flex flex-col justify-start items-center mt-[64rpx]">
    <view class="w-full box-border flex flex-row items-center px-[8rpx]">
      <text class="text-white text-[32rpx] leading-[44rpx] font-medium">外币汇率换算</text>
    </view>

    <view class="w-full rounded-[24rpx] box-border flex flex-row items-center py-[16rpx] relative mt-[21rpx]">
      <!-- 背景图片 -->
      <view class="flex justify-start items-center w-full h-[144rpx] bg-wraper rounded-[24rpx] px-[32rpx] box-border">
        <!-- 左侧：USDT -->
        <view class="w-[40rpx] h-[40rpx]">
          <image src="/static/images/recharge/usdt_icon.png" mode="widthFix" class="w-[40rpx] h-[40px]"></image>
        </view>
        <view class="w-[151rpx] rounded-[16rpx] box-border bg-[rgba(12,5,47,1)] flex h-[80rpx] flex-row justify-center items-center ml-[12rpx]">
          <uv-input
            maxlength="8"
            class="w-full font-bold"
            v-model="USDTInput"
            type="number"
            placeholder="1"
            border="none"
            :customStyle="{ borderRadius: '16rpx', textAlign: 'center' }"
            :placeholderStyle="{
              color: '#fff',
              fontSize: '32rpx',
            }"
            fontSize="32rpx"
            @change="handleUSDTChange"
            inputAlign="center"
            color="#fff"
          />
        </view>
        <text class="ml-[12rpx] text-white text-[30rpx] leading-[48rpx] font-normal">{{ symbolStore.exchangeUsdtLabel }}</text>
        
        <!-- 等号 -->
        <view class="w-[42rpx] h-[42rpx] overflow-hidden box-border ml-[12rpx] flex justify-end items-center">
          <text class="mr-[10rpx] text-white text-[30rpx] leading-[48rpx] font-normal">=</text>
        </view>
        
        <!-- 右侧：CNY -->
        <view class="w-[40rpx] h-[40rpx]  ml-[12rpx]">
          <image src="/static/images/recharge/cny_icon.png" mode="widthFix" class="w-[40rpx] h-[40rpx]"></image>
        </view>
        <view class="w-[151rpx] rounded-[16rpx] box-border bg-[rgba(12,5,47,1)] flex h-[80rpx] flex-row justify-center items-center ml-[12rpx]">
          <uv-input
            maxlength="8"
            class="w-full font-bold"
            v-model="CNYInput"
            type="number"
            placeholder="7.4"
            border="none"
            :customStyle="{ borderRadius: '16rpx', textAlign: 'center' }"
            :placeholderStyle="{
              color: '#fff',
              fontSize: '32rpx',
            }"
            fontSize="32rpx"
            color="#fff"
            @change="handleCNYChange"
            inputAlign="center"
          />
        </view>
        <text class="ml-[12rpx] text-white text-[30rpx] leading-[48rpx] font-normal">CNY</text>
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

<style lang="scss" scoped>
.bg-wraper{
  background-image: url('@/static/images/recharge/rate_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>