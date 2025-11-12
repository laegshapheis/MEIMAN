<template>
  <view
    class="relative gab-[16rpx] rounded-[8rpx] flex flex-col items-center"
    @click="handleClick"
  >
    <view class="flex items-center justify-center rounded-full w-[112rpx] h-[112rpx]"
    style="background: #195295">
      <image class="w-[48rpx] h-[48rpx]" :src="icon" mode="widthFix" />
    </view>
    <view class="mt-[16rpx] text-neutral-white text-sm" style="font-weight: 600;">{{
      title
    }}</view>
  </view>
</template>

<script setup>
const props = defineProps({
  icon: String,
  title: String,
  desc: String,
  path: String,
  redirect: String,
});

const handleClick = () => {
  if (props.redirect) {
    // #ifdef APP-PLUS
    plus.runtime.openURL(props.redirect);
    // #endif
    // #ifdef H5
    window.open(props.redirect);
    // #endif
  } else {
    uni.navigateTo({
      url: props.path,
    });
  }
};
</script>
