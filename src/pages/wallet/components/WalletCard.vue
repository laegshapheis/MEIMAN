<template>
  <view
    class="flex flex-col justify-center w-full h-[192rpx] rounded-[24rpx]"
     :class="isEmpty? 'items-center': 'items-start'"
     :style="isEmpty? '': 'border: 1px solid #FFFFFF80'"
    @click="$emit('click')"
  >
    <template v-if="isEmpty">
      <view class="flex flex-row items-center justify-center bg-white/50 py-[16rpx] px-[24rpx] rounded-[360rpx]">
        <image
          class="w-[48rpx] h-[48rpx] mr-[24rpx]"
          :src="icon"
        />
        <text class="text-base font-medium text-black">{{ addText }}</text>
      </view>
    </template>
    <template v-else>
      <view class="flex flex-row items-center ml-[48rpx] leading-6 mb-[14rpx]">
        <image
          class="w-[48rpx] h-[48rpx] mr-[8rpx]"
          :src="icon"
        />
        <text class="text-base font-medium text-black">{{ title }}</text>
      </view>
      <view class="ml-[48rpx] mt-[20rpx]">
        <text class="text-2xl font-bold text-black">{{ content }}</text>
      </view>
    </template>
  </view>
</template>

<script setup>
defineProps({
  isEmpty: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    required: true
  },
  addText: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])
</script> 

