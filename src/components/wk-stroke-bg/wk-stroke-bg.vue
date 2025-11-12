<template>
  <view
    :style="{
      background: backgroundStyle,
    }"
    :class="[
      bgColorClass,
      borderClass,
      `rounded-[${props.borderRadius}]`,
      `p-[${paddingSize}]`,
    ]"
  >
    <slot></slot>
  </view>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  size: {
    type: String,
    default: "middle", // small | middle | large
  },
  bgColor: {
    type: String,
    default: "#FFFFFF",
  },
  border: {
    type: String,
    default: "none", // none | thin | thick
  },
  shadow: {
    type: Boolean,
    default: false, // none | thin | thick
  },

  borderRadius: {
    type: String,
    default: "32rpx",
  },
});

const paddingSize = computed(() => {
  switch (props.size) {
    case "small":
      return "24rpx";
    case "middle":
      return "32rpx";
    case "large":
      return "48rpx";
    case "none":
      return "0rpx";
    default:
      return "32rpx";
  }
});

const backgroundStyle = computed(() => {
  if (props.bgColor.startsWith('linear-gradient')) {
    return props.bgColor;
  }
  if (props.bgColor.startsWith('#') || props.bgColor.startsWith('rgb')) {
    return props.bgColor;
  }
  return '';
});

const bgColorClass = computed(() => {
  if (props.bgColor.startsWith('linear-gradient')) {
    return '';
  }
  const color = props.bgColor.startsWith("#")
    ? `bg-[${props.bgColor}]`
    : props.bgColor;
  return color;
});

const borderClass = computed(() => {
  switch (props.border) {
    case "thin":
      return "border border-solid border-white/20";
    case "thick":
      return "border-2 border-solid border-white/20";
    default:
      return "";
  }
});
</script>
