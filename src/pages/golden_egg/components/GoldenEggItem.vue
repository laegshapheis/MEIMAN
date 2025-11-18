<template>
  <view class="w-[230rpx] h-[230rpx] relative flex items-center justify-center">
    <!-- 金蛋本体 -->
    <view
      class="w-full h-full relative transition-transform duration-300"
      :class="isSmashed ? 'pointer-events-none' : ''"
    >
      <!-- 未砸破的金蛋 -->
      <view v-if="!isSmashed" class="w-full h-full relative flex items-center justify-center">
        <!-- 选中光环效果 -->
        <view v-if="isSelected" class="absolute inset-0 rounded-full bg-gradient-radial from-[#FFD700] to-transparent opacity-30 scale-150 animate-pulse"></view>
        <!-- 金蛋图片 -->
        <image
          src="/static/images/golden_egg/egg_default.png"
          class="w-[220rpx] h-[220rpx] relative z-10"
          mode="aspectFit"
        />
      </view>

      <!-- 已砸破的状态 -->
      <view v-else class="w-full h-full relative flex items-center justify-center">
        <!-- 破碎的金蛋图片 -->
        <image
          src="/static/images/golden_egg/egg_broken.png"
          class="w-[220rpx] h-[220rpx]"
          mode="aspectFit"
        />

        <!-- 奖品显示 -->
        <view v-if="prize" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-prizeAppear">
          <view class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80rpx] h-[80rpx] bg-gradient-radial from-[#FFD70099] to-transparent animate-glow"></view>
          <image
            v-if="prize.icon"
            :src="prize.icon"
            class="w-[60rpx] h-[60rpx] relative z-10"
            mode="aspectFit"
          />
          <view v-else class="text-[24rpx] font-bold text-[#FE3355] text-center relative z-10 whitespace-nowrap">
            {{ prize.value }}
          </view>
        </view>
      </view>

      <!-- 砸蛋动画效果 -->
      <view v-if="isAnimating" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <view class="w-[100rpx] h-[100rpx] bg-gradient-radial from-white/80 to-transparent animate-hammerHit"></view>
        <view class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <view
            v-for="i in 8"
            :key="i"
            class="absolute w-[30rpx] h-[30rpx]"
            :style="{
              animationDelay: `${i * 0.05}s`,
              transform: `rotate(${i * 45}deg)`
            }"
          >
            <view class="w-full h-full bg-[#FFD700] clip-path-star animate-starBurst"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
  isSmashed: {
    type: Boolean,
    default: false,
  },
  isAnimating: {
    type: Boolean,
    default: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
  prize: {
    type: Object,
    default: null,
  },
});
</script>

<style lang="scss" scoped>
// 自定义动画使用项目风格
@keyframes prizeAppear {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.3; }
}

@keyframes starBurst {
  0% {
    transform: translateY(0) scale(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-50rpx) scale(1);
    opacity: 0;
  }
}

.animate-prizeAppear {
  animation: prizeAppear 0.5s ease 0.3s forwards;
  opacity: 0;
}

.animate-glow {
  animation: glow 2s ease infinite;
}

.animate-hammerHit {
  animation: hammerHit 0.3s ease;
}

.animate-starBurst {
  animation: starBurst 0.8s ease forwards;
}

.clip-path-star {
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}
</style>