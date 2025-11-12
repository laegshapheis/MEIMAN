<template>
  <view
    class="mb-[32rpx] mx-auto w-[256rpx] h-[68rpx] flex flex-row items-center justify-center"
    :class="type"
  >
    <text class="text-base font-medium text-white">{{ title }}</text>
  </view>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'default',
  },
});
</script>

<style scoped>
.default {
  border-radius: 0px 0px 8px 8px;
  background: linear-gradient(90deg, #4EB2FE 0%, #0479FE 100%);
}
</style>
