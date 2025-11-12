<template>
  <view
    :class="['flex flex-col items-center justify-center h-full', `mt-[${top}]`]"
  >
    <image
      class="w-[200rpx] h-[200rpx]"
      src="/static/images/empty_icon.png"
      mode="widthFix"
    />

    <view class="flex flex-row justify-center items-center mt-2" :style="{ fontSize, lineHeight: '1.5', textAlign: 'justify', color: color }">
      <text>{{ title }}</text>
    </view>
  </view>
</template>

<script>
import { neutral } from '@/config/colors';
export default {
  props: {
    title: {
      default: "暂无记录",
    },
    color: {
      default: neutral.secondary,
    },
    fontSize: {
      default: "28rpx",
    },
    top : {
      default: "30vh",
    }
  },
};
</script>

<style lang="scss" scoped></style>