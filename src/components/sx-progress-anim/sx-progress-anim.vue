<template>
  <view class="progress-wrap">
    <view 
      style="background: #00000010"
      class="progress-box"
    >
      <view
        class="progress-item-bg"
        :style="{
          width: val,
          background: 'linear-gradient(270deg, #06F -8.49%, #9AEEDE 100%)'
        }"
      ></view>
      
    </view>
    <view
        class="progress-dot"
        :style="{
          left: `calc(${val} - 9px / 2)`
        }"
      ></view>
  </view>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  val: {
    type: String,
    default: "0%",
  },
});
</script>

<style lang="scss">
@keyframes moveAndFade1 {
  0% {
    left: -100%; /* 从左侧外部开始 */
    opacity: 1;
    z-index: 2;
  }
  50% {
    left: 0; /* 移动到左侧边缘 */
    opacity: 0.8;
  }
  75% {
    left: 0; /* 移动到右侧边缘 */
    opacity: 0.5;
    z-index: 1;
  }
  100% {
    left: 0; /* 保持在右侧 */
    opacity: 0; /* 完全淡出 */
    z-index: 1;
  }
}
.progress-wrap {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  .progress-box {
    width: 100%;
    height: 18rpx;
    border-radius: 20rpx;
    overflow: hidden;
    position: relative;
    padding-right: 16rpx;
  }
  .progress-item-bg,
  .progress-item-anim {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    // border-radius: 32rpx;
  }
  .progress-item-anim {
    // box-shadow: inset 0rpx 2rpx 8rpx #ffffff;
    background: linear-gradient(270deg,  #2935CC -8.49%, #98EDFB 100%);
  }
  .progress-s {
    animation-delay: 1s;
    left: -100%;
  }
  .progress-dot {
    position: absolute;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: #9AEEDE;
    border: 4px solid #ffffff;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }
}
</style>
