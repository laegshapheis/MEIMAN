<template>
  <view class="lever_wxts" :style="mt0 ? 'margin-top: 0;' : ''">
    <view class="info" style="padding: 0; padding-top: 0">
      <text
        :style="{ boxSizing: 'border-box', fontSize, lineHeight: '1.5', textAlign: 'justify', color: color }"
        >{{ content }}</text
      >
    </view>
  </view>
</template>

<script>
import { neutral } from '@/config/colors';
export default {
  props: {
    title: {
      default: "温馨提示",
    },
    content: {
      default: "",
    },
    mt0: {
      default: false,
    },
    color: {
      default: neutral.regular
    },
    fontSize: {
      default: "28rpx",
    },
  },
};
</script>

<style lang="scss" scoped></style>
