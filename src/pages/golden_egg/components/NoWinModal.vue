<template>
  <view
    v-if="show"
    class="fixed inset-0 z-[999] flex items-center justify-center"
    @click.self="() => {}"
  >
    <!-- 遮罩层 -->
    <view class="absolute inset-0 bg-black/60"></view>

    <!-- 弹窗内容 -->
    <view class="relative w-[600rpx] bg-white rounded-[48rpx] overflow-hidden animate-fade-in">
      <!-- 标题和描述 -->
      <view class="pt-[48rpx] pb-0 px-[48rpx]">
        <view class="text-[48rpx] font-medium text-[#ff6135] text-center mb-[16rpx]">
          谢谢参与！
        </view>
        <view class="text-[32rpx] text-black text-center">
          很遗憾，差一点就中奖了
        </view>
      </view>

      <!-- 图片区域 -->
      <view class="px-[48rpx] py-[32rpx] flex justify-center">
        <image
          src="/static/images/golden_egg/no_win.png"
          class="w-[252rpx] h-[252rpx]"
          mode="aspectFit"
        />
      </view>

      <!-- 按钮区域 -->
      <view class="pb-[40rpx] px-[40rpx]">
        <view
          class="w-full h-[88rpx] bg-gradient-to-r from-[#FE3355] to-[#FF643B] rounded-[720rpx] flex items-center justify-center"
          @click="handleContinue"
        >
          <text class="text-white text-[30rpx] font-semibold">继续尝试</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['continue']);

const handleContinue = () => {
  emit('continue');
};
</script>

<style lang="scss" scoped>
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>