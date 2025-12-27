<template>
  <wk-stroke-bg class="mt-[24rpx]" mode="img-card3-big">
    <!-- 添加购买数量部分 -->
    <view class="flex items-center justify-between">
      <view class="text-lg font-medium text-neutral">认购份数</view>
      <view class="flex flex-row items-center justify-between rounded-[16rpx]">
        <view class="flex items-center justify-center bg-black/10 rounded-full w-[60rpx] h-[60rpx]" @click="calculate('-')">
          <uv-icon name="minus" size="16" color="#FFFFFF"></uv-icon>
        </view>
        <input type="number" min="1" maxlength="10"  class="mx-[10rpx] text-neutral text-2xl font-semibold w-[130rpx] text-center" v-model="quantity" @input="handleInput" />
        <view class="flex items-center justify-center bg-black/10 rounded-full w-[60rpx] h-[60rpx]" @click="calculate('+')">
          <uv-icon name="plus" size="16" color="#FFFFFF"></uv-icon>
        </view>
      </view>
    </view>
    <view class="flex flex-col bg-neutral-primaryAssist rounded-[16rpx] p-[24rpx] mt-[24rpx]">
      <view class="flex flex-row items-center justify-between">
        <text class="text-neutral text-base">单份数量</text>
        <text class="text-neutral text-base">{{ totalNum }} 股</text>
      </view>
      <view class="flex flex-row items-center justify-between mt-[16rpx]">
        <text class="text-neutral text-base">认购总价</text>
        <text class="text-neutral text-base">{{ totalPrice }} {{ symbolStore.code }}</text>
      </view>
    </view>
  </wk-stroke-bg>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSymbolStore } from "@/stores/symbolStore";

const symbolStore = useSymbolStore()
const props = defineProps({
  productview: {
    type: Object,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:quantity'])

const quantity = ref(props.quantity)

const totalPrice = computed(() => {
  return (quantity.value * props.productview.qtje).toFixed(2)
})

const totalNum = computed(() => {
  return (quantity.value * props.productview.countequity)
})

const handleInput = (e) => {
  const value = e.detail.value
  if (value > 0) {
    setTimeout(() => {
      quantity.value = value
      emit('update:quantity', quantity.value)
    }, 0)
  } else {
    setTimeout(() => {
      quantity.value = 1
      emit('update:quantity', quantity.value)
    }, 0)
  }
}

const calculate = (type) => {
  if (type === '-' && quantity.value > 1) {
    quantity.value--
    emit('update:quantity', quantity.value)
  } else if (type === '+') {
    if ((quantity.value + 1) * props.productview.qtje <= props.productview.zgje) {
      quantity.value++
      emit('update:quantity', quantity.value)
    } else {
      uni.showToast({
        title: '已达最高数量',
        duration: 3000,
        icon: 'none'
      })
    }
  }
}
</script> 