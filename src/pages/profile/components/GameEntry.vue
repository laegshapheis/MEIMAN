<template>
  <view class="mt-[32rpx]">
    <wk-stroke-bg 
      borderRadius="32rpx"
      size="none"
    >
      <view class="flex flex-row justify-between p-[32rpx]">
        <view class="flex flex-col items-center" @click="handleGameClick(routes.goldenEggIndex)">
          <view class="w-[160rpx] h-[160rpx] flex items-center justify-center mb-[16rpx]">
            <image
              class="w-[160rpx] h-[160rpx]"
              src="/static/images/user/egg_icon.png"
              mode="aspectFit"
            />
          </view>
          <text class="text-neutral text-base">砸金蛋</text>
        </view>
        
        <view class="flex flex-col items-center" @click="handleGameClick(routes.lottery)">
          <view class="w-[160rpx] h-[160rpx] flex items-center justify-center mb-[16rpx]">
            <image
              class="w-[160rpx] h-[160rpx]"
              src="/static/images/user/luck_icon.png"
              mode="aspectFit"
            />
          </view>
          <text class="text-neutral text-base">幸运转盘</text>
        </view>
        
        <view class="flex flex-col items-center" @click="handleGameClick(routes.guessNumber)">
          <view class="w-[160rpx] h-[160rpx] flex items-center justify-center mb-[16rpx]">
            <image
              class="w-[160rpx] h-[160rpx]"
              src="/static/images/user/guess_icon.png"
              mode="aspectFit"
            />
          </view>
          <text class="text-neutral text-base">猜数字</text>
        </view>
      </view>
    </wk-stroke-bg>
  </view>
</template>

<script setup>
import { routes } from "@/config/routes";
import { navigateTo } from "@/utils/navigation";

const props = defineProps({
  userInfo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['onRealname']);

const handleGameClick = (route) => {
  if (props.userInfo.isreal != 1) {
    emit('onRealname');
    return;
  }
  navigateTo(route);
};
</script>

<style lang="scss" scoped>
</style>

