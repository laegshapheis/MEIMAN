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
        <view class="text-2xl font-medium text-[#FE3355] text-center mb-[16rpx]">
          恭喜中奖！
        </view>
        <view class="text-xl font-bold text-black text-center">
          {{ prize.name }}
        </view>
      </view>

      <!-- 图片区域 -->
      <view class="px-[48rpx] py-[32rpx] flex justify-center">
        <image
          :src="prize.image || prize.icon"
          class="w-[252rpx] h-[252rpx]"
          mode="aspectFit"
        />
      </view>

      <!-- 按钮区域 -->
      <view class="pb-[40rpx] px-[40rpx] flex gap-[24rpx]">
        <view
          class="flex-1 h-[88rpx] bg-gradient-to-r from-[#FE3355] to-[#FF643B] rounded-[720rpx] flex items-center justify-center"
          @click="handleContinue"
        >
          <text class="text-white text-[30rpx] font-semibold">继续砸蛋</text>
        </view>
        <view
          class="flex-1 h-[88rpx] bg-[#F5F5F5] rounded-[720rpx] flex items-center justify-center"
          @click="handleCheckPrize"
        >
          <text class="text-[#333] text-[30rpx] font-semibold">查看奖品</text>
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
  },
  prize: {
    type: Object,
    default: () => ({
      name: '',
      value: '',
      icon: '',
      image: ''
    })
  }
});

const emit = defineEmits(['continue', 'checkPrize']);

const handleContinue = () => {
  emit('continue');
};

const handleCheckPrize = () => {
  emit('checkPrize');
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