<template>
  <view class="h-[208rpx] content-box flex-1 p-[32rpx] box-border rounded-[12rpx]" @click="handleClick">
    <view class="flex flex-col justify-between">
      <view>
        <text class="text-[#8D5C11] font-bold text-2xl">幸运大抽奖</text>
        <text class="text-[#8D5C11] text-base block">好运连连</text>
      </view>
      <view class="flex flex-row items-center mt-[14rpx]">
        <text class="text-[#FA9404] text-base">去抽奖</text>
        <image class="w-[48rpx] h-[48rpx] ml-[16rpx]" src="/static/images/index/luck_draw_arrow.svg"></image>
      </view>
    </view>
  </view>
</template>
<script setup>
import { routes } from '@/config/routes';
const props = defineProps({
  dataList: {
    type: Array,
    default: [],
  },
});
const handleClick = () => {
  uni.navigateTo({
    url: routes.lottery,
  });
};
</script>

<style scoped>
.content-box {
  background-image: url("/static/images/index/luck_draw_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
