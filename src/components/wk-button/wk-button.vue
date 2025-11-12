<template>
  <view >
    <uv-button
      v-bind="attrs"
      type="primary"
      :customStyle="buttonStyle"
      @click="handleSubmit"
    >
      <slot></slot>
    </uv-button>
  </view>
</template>
<script setup>
import { defineProps, defineEmits, useAttrs, computed } from "vue";
import { neutral } from "@/config/colors";
const attrs = useAttrs();
const props = defineProps({
  size: {
    type: String,
    default: "normal",
    validator: (value) => ["small", "normal", "large"].includes(value),
  },
  height: {
    type: String,
    default: "76rpx",
  },
  fontSize: {
    type: String,
    default: "",
  },
  fontWeight: {
    type: String,
    default: "bold",
  },
  color: {
    type: String,
    default: neutral.buttonTextColor,
  },
  backgroundColor: {
    type: String,
    default: neutral.buttonBg,
  },
  shadow: {
    type: String,
    default: "",
  },
  isShowShadow: {
    type: Boolean,
    default: true,
  },
  plain: {
    type: Boolean,
    default: false,
  },
  borderColor: {
    type: String,
    default: neutral.buttonBorder,
  },
  borderRadius: {
    type: String,
    default: "360rpx",
  },
  buttonStyle: {
    type: Object,
    default: {},
  },
});

const buttonStyle = computed(() => {
  const sizeMap = {
    small: {
      height: "72rpx",
      fontSize: "28rpx",
    },
    normal: {
      height: "92rpx",
      fontSize: "32rpx",
    },
    large: {
      height: "102rpx",
      fontSize: "36rpx",
    },
  };

  const defaultSize = sizeMap[props.size];

  return {
    width: "100%",
    height: props.height || defaultSize.height,
    fontSize: props.fontSize || defaultSize.fontSize,
    color: props.plain ? neutral.theme : props.color,
    background: props.plain ? "transparent" : props.backgroundColor,
    borderRadius: props.borderRadius,
    border: props.plain
      ? `1px solid ${props.backgroundColor}`
      : `1px solid ${props.borderColor}`,
    boxShadow: props.isShowShadow ? props.shadow : "none",
    fontWeight: props.fontWeight,
    ...props.buttonStyle,
  };
});
const emit = defineEmits(["submit"]);
const handleSubmit = () => {
  emit("submit");
};
</script>

<style lang="scss" scoped></style>
