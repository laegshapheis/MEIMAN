<template>
  <view class="center-icon relative" :style="{ width: width, height: height }">
    <image
      class="absolute w-full h-full animate-rotate-bg"
      src="/static/lottie/centerIcon/bg.png"
      mode="aspectFit"
    />

    <image
      class="absolute w-full h-full animate-rotate-clockwise"
      src="/static/lottie/centerIcon/waihuan.png"
      mode="aspectFit"
    />

    <image
      class="absolute w-full h-full animate-rotate-counter-clockwise"
      src="/static/lottie/centerIcon/neihuan.png"
      mode="aspectFit"
    />

    <image
      class="absolute w-full h-full breathing-light"
      src="/static/lottie/centerIcon/huxiden.png"
      mode="aspectFit"
    />
    <image
      class="absolute w-full h-full"
      src="/static/lottie/centerIcon/gg.png"
      mode="aspectFit"
    />

    <slot></slot>
  </view>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: "200rpx",
  },
  height: {
    type: String,
    default: "200rpx",
  },
});
</script>

<style>
.center-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes rotateClockwise {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rotateCounterClockwise {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes rotateBg {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes breathe {
  0% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.8);
  }
}

.animate-rotate-clockwise {
  animation: rotateClockwise 4s linear infinite;
}

.animate-rotate-counter-clockwise {
  animation: rotateCounterClockwise 4s linear infinite;
}

.animate-rotate-bg {
  animation: rotateBg 4s linear infinite;
}

.breathing-light {
  animation: breathe 3s ease-in-out infinite;
}
</style>
