<template>
  <view
    v-if="show"
    class="fixed inset-0 z-[998] flex items-end justify-center"
    @click.self="close"
  >
    <!-- 遮罩层 -->
    <view class="absolute inset-0 bg-black/60"></view>

    <!-- 弹窗内容 -->
    <view class="relative bg-gradient-to-b from-[#d8b9ff] to-[#f3f3f2] rounded-t-[24rpx] pb-[20rpx] pt-[40rpx] px-[30rpx] w-full animate-slide-up">
      <!-- 关闭按钮 -->
      <view class="absolute right-[36rpx] top-[20rpx] w-[60rpx] h-[60rpx] bg-black/20 rounded-full flex items-center justify-center" @click="close">
        <text class="text-white text-[40rpx]">×</text>
      </view>

      <!-- 标题 -->
      <view class="text-[52rpx] font-bold text-black text-center mb-[60rpx]">
        <!-- 能量中心 -->
      </view>

      <!-- 顶部信息区域 -->
      <view class="flex gap-[16rpx] mb-[12rpx] px-[30rpx]">
        <!-- 我的余额 -->
        <view class="bg-white rounded-[24rpx] p-[16rpx] w-[200rpx] flex-shrink-0 flex flex-col items-start justify-between">
          <text class="block mb-[8rpx] text-sm" style="color: #02020266;">我的余额 ({{ symbolStore.code || '' }})</text>
          <text class="text-[40rpx] font-bold text-[#fe3355] block break-all">{{ userBalance }}</text>
          <view class="flex items-center gap-[4rpx] mt-[8rpx]" @click="handleRecharge">
            <text class="text-sm text-[#fe3355]">去充值</text>
            <text class="text-[#fe3355] text-xl">›</text>
          </view>
        </view>

        <!-- 我的道具 -->
        <view class="bg-white rounded-[24rpx] p-[16rpx] flex-1 overflow-hidden">
          <text class="text-sm text-[#02020266] block mb-[12rpx]">我的道具</text>
          <scroll-view scroll-x :show-scrollbar="false" style="height: 132rpx; width: 100%;">
            <view style="display: inline-flex; gap: 12rpx;">
              <!-- 已拥有的锤子 -->
              <view
                v-for="hammer in myHammers"
                :key="hammer.type"
                class="w-[122rpx] h-[122rpx] bg-gradient-to-b from-[#f5edf5] to-[#f6e8f6] rounded-[16rpx] relative flex-shrink-0"
                :class="currentHammerType === hammer.type ? 'border-1 border-[#ffad4a] border-solid' : ''"
                @click="selectHammer(hammer.type)"
              >
                <image :src="hammer.icon" class="w-[90rpx] h-[90rpx] absolute top-[16rpx] left-[21rpx]" mode="aspectFit" />
                <view class="absolute top-0 right-0 bg-[#ffad4a] px-[8rpx] rounded-bl-[8rpx] rounded-tr-[8rpx]">
                  <text class="text-[20rpx] text-black">x{{ hammer.count }}</text>
                </view>
                <view v-if="currentHammerType === hammer.type" class="absolute bottom-0 left-0 right-0 bg-[#ffc075] rounded-b-[8rpx] py-[4rpx]">
                  <text class="text-sm text-black text-center block">{{ hammer.name }}</text>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>

      <!-- 锤子商店列表 -->
      <scroll-view scroll-y :show-scrollbar="false" style="max-height: 700rpx;">
        <view class="space-y-[12rpx] px-[30rpx]">
          <template v-for="hammer in hammerList" :key="hammer.id">
            <view
              v-if="hammer.status == 1"
              class="bg-white rounded-[24rpx] p-[24rpx] flex items-center mb-[12rpx]"
            >
              <view class="w-[134rpx] h-[134rpx] bg-gradient-to-b from-[#f5edf5] to-[#f6e8f6] rounded-[16rpx] flex items-center justify-center">
                <image :src="hammer.img || getDefaultHammerImage(hammer.type)" class="w-[90rpx] h-[90rpx]" mode="aspectFit" />
              </view>
              <view class="flex-1 ml-[24rpx]">
                <text class="text-[32rpx] font-semibold text-black block">{{ hammer.name }}</text>
                <view class="bg-[#fff1b9] inline-block px-[8rpx] py-[2rpx] rounded-[4rpx] mt-[12rpx]">
                  <text class="text-sm text-[#954105]">{{ hammer.describe || hammer.description || '' }}</text>
                </view>
                <view class="flex items-center mt-[12rpx]">
                  <image src="/static/images/golden_egg/coin.png" class="w-[28rpx] h-[26rpx]" />
                  <text class="text-sm font-semibold text-[#954105] ml-[4rpx]">{{ hammer.price }} {{ symbolStore.code || '' }}</text>
                </view>
              </view>
              <view
                v-if="hammer.type !== 'basic'"
                class="px-[24rpx] py-[8rpx] bg-[#FE3355] rounded-[40rpx] flex items-center justify-center"
                @click.stop="buyHammer(hammer.type)"
              >
                <text class="text-base font-semibold text-white">立即加购</text>
              </view>
            </view>
          </template>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { useSymbolStore } from "@/stores/symbolStore";

const symbolStore = useSymbolStore();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  userBalance: {
    type: Number,
    required: true
  },
  myHammers: {
    type: Array,
    required: true
  },
  hammerList: {
    type: Array,
    default: () => []
  },
  currentHammerType: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close', 'selectHammer', 'buyHammer', 'recharge']);

const close = () => {
  emit('close');
};

const selectHammer = (type) => {
  emit('selectHammer', type);
};

const buyHammer = (type) => {
  emit('buyHammer', type);
};

const handleRecharge = () => {
  emit('recharge');
};

// 获取默认锤子图片
const getDefaultHammerImage = (type) => {
  const defaultImages = {
    basic: '/static/images/golden_egg/hammer_basic.png',
    silver: '/static/images/golden_egg/hammer_advanced.png',
    gold: '/static/images/golden_egg/hammer.png'
  };
  return defaultImages[type] || '/static/images/golden_egg/hammer_basic.png';
};
</script>

<style lang="scss" scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>