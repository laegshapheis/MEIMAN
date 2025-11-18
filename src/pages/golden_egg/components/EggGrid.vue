<template>
  <!-- 金蛋网格容器 - 绝对定位覆盖在游戏背景板上 -->
  <view class="mx-auto absolute inset-0 w-[700rpx] h-[700rpx]">
    <!-- 每个金蛋独立定位 -->
    <view
      v-for="(position, index) in eggPositions"
      :key="index"
      class="absolute w-[100rpx] h-[60rpx] flex items-end justify-center"
      :style="{
        top: position.top,
        left: position.left
      }"
      @click="selectEgg(index)"
    >
      <golden-egg
        :index="index"
        :isSmashed="eggs[index] ? eggs[index].isSmashed : false"
        :isAnimating="currentSmashingIndex === index"
        :prize="eggs[index] ? eggs[index].prize : null"
        :isSelected="selectedEggIndex === index"
      />
      <!-- 锤子显示在选中的金蛋上方 -->
      <image
        v-if="selectedEggIndex === index && eggs[index] && !eggs[index].isSmashed"
        :src="hammerImage"
        class="absolute -top-[140rpx] left-[50rpx] w-[140rpx] h-[140rpx] z-10 rotate-[0deg]"
        :class="currentSmashingIndex === index ? 'animate-hammer-hit' : ''"
        style="transform-origin: bottom right;"
        mode="aspectFit"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import GoldenEgg from './GoldenEggItem.vue';

const props = defineProps({
  eggs: {
    type: Array,
    required: true
  },
  selectedEggIndex: {
    type: Number,
    default: -1
  },
  currentSmashingIndex: {
    type: Number,
    default: -1
  },
  hammerImage: {
    type: String,
    required: true
  },
  // 可选：自定义每个金蛋的位置
  customPositions: {
    type: Array,
    default: null
  }
});

const emit = defineEmits(['selectEgg']);

// 定义每个金蛋的位置（相对于游戏板）
// 可以通过props传入自定义位置，或使用默认位置
const eggPositions = computed(() => {
  if (props.customPositions && props.customPositions.length === 6) {
    return props.customPositions;
  }

  return [
    // 上层左边金蛋
    {
      top: '230rpx',
      left: '90rpx'
    },
    // 上层中间金蛋
    {
      top: '230rpx',
      left: '300rpx'
    },
    // 上层右边金蛋
    {
      top: '230rpx',
      left: '510rpx'
    },
    // 下层左边金蛋
    {
      top: '515rpx',
      left: '90rpx'
    },
    // 下层中间金蛋
    {
      top: '515rpx',
      left: '300rpx'
    },
    // 下层右边金蛋
    {
      top: '515rpx',
      left: '510rpx'
    }
  ];
});

const selectEgg = (index) => {
  emit('selectEgg', index);
};
</script>

<style lang="scss" scoped>
.animate-hammer-hit {
  animation: hammerHit 0.6s ease;
  transform-origin: bottom right;
}

@keyframes hammerHit {
  0% {
    transform: rotate(30deg);
    transform-origin: bottom right;
  }
  30% {
    transform: rotate(45deg);
    transform-origin: bottom right;
  }
  50% {
    transform: rotate(-30deg);
    transform-origin: bottom right;
  }
  70% {
    transform: rotate(-10deg);
    transform-origin: bottom right;
  }
  100% {
    transform: rotate(30deg);
    transform-origin: bottom right;
  }
}
</style>