<template>
  <view
    class="relative gab-[32rpx] flex flex-col items-center bg-white rounded-[32rpx] py-[16rpx] px-[32rpx]"
    style="border: 1px solid #B9DCFF;"
    @click="handleClick"
  >
    <view class="flex items-center justify-center w-[48rpx] h-[48rpx]">
      <image :src="icon" class="w-[48rpx] h-[48rpx]" mode="widthFix" />
    </view>
    <view class="mt-[16rpx] text-neutral-black text-sm" style="font-weight: 600;">{{
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
