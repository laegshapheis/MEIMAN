<template>
  <wk-stroke-bg shadow class="mt-[24rpx]" v-if="productview.show_shouyi_shuoming == 1">
    <view class="flex flex-row items-center justify-between mb-[20rpx]">
      <text class="text-xl font-bold text-neutral ">收益说明</text>
      <view class="py-[8rpx] px-[16rpx] rounded-full flex flex-row items-center justify-center bg-[#121E3E]" @click="goCalc">
        <image src="/static/images/profile/calc_icon.png" class="w-[24rpx] h-[24rpx]"/>
        <text class="text-neutral-theme text-base"></text>
      </view>
    </view>
    <view class="flex flex-col">
        <view class="flex flex-row items-center text-neutral-theme text-base mb-[10rpx] font-bold" 
          >
          <view class="w-[6rpx] h-[28rpx] bg-neutral-theme mr-[8rpx]"></view>
          结息时间</view
        >
        <view class="text-neutral-regular text-base"
          >{{ productview.settlement }}
        </view>
      </view>
      <view class="flex flex-col mt-[20rpx]">
        <view class="flex flex-row items-center text-neutral-theme text-base mb-[10rpx] font-bold"
          >
          <view class="w-[6rpx] h-[28rpx] bg-neutral-theme mr-[8rpx]"></view>
          收益期限</view
        >
        <view class="text-neutral-regular text-base">
          {{ productview.profit_term }}
        </view>
      </view>
    <view class="flex flex-row items-center text-neutral-theme text-base mb-[10rpx] font-bold mt-[20rpx]">
      <view class="w-[6rpx] h-[28rpx] bg-neutral-theme mr-[8rpx]"></view>
      计算参考</view>
    <view class="text-neutral-regular text-base" style="line-height: 1.4">
      {{ productview.text_6 }}
    </view>
    <view class="flex flex-row items-center text-neutral-theme text-base mb-[10rpx] mt-[20rpx] font-bold">
      <view class="w-[6rpx] h-[28rpx] bg-neutral-theme mr-[8rpx]"></view>
      详细说明</view>
    <view class="text-neutral-regular text-base p-str-28 line-14h">
      {{ productview.text_7 }}
    </view>
  </wk-stroke-bg>
  <!-- 特别说明 -->
  <wk-stroke-bg class="my-[24rpx]" v-if="productview.specialbenefits">
      <view class="" v-if="productview.specialbenefits">
          <rich-text
            class="text-[#9AEEDE] text-base"
            :nodes="productview.specialbenefits"
          />
        </view>
    </wk-stroke-bg>
</template>

<script setup>
import {routes} from "@/config/routes";
defineProps({
  productview: {
    type: Object,
    required: true
  }
})

const goCalc = () => {
  uni.navigateTo({
    url: routes.calc
  })
}
</script> 