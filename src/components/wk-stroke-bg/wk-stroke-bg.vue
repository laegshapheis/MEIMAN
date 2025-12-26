<template>
  <view
    class="wk-stroke-bg"
    :class="[borderClass, sizeClass, radiusClass]"
    :style="containerStyle"
  >
    <slot></slot>
  </view>
</template>

<script>
const MODE_PRESETS = {
  dark: {
    bgImage: "",
    bgColor: "#010101",
    borderWidth: "1rpx",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  glass: {
    bgImage: "",
    bgColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: "1rpx",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "glass-dark": {
    bgImage: "",
    bgColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: "1rpx",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  light: {
    bgImage: "",
    bgColor: "#FFFFFF",
    borderWidth: "1rpx",
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  transparent: {
    bgImage: "",
    bgColor: "transparent",
    borderWidth: "0",
    borderColor: "transparent",
  },
  gradient: {
    bgImage: "",
    bgColor: "linear-gradient(135deg, rgba(182, 118, 255, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)",
    borderWidth: "1rpx",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "gradient-blue": {
    bgImage: "",
    bgColor: "linear-gradient(135deg, rgba(41, 157, 246, 0.2) 0%, rgba(0, 102, 255, 0.1) 100%)",
    borderWidth: "1rpx",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "gradient-gold": {
    bgImage: "",
    bgColor: "linear-gradient(135deg, rgba(245, 209, 122, 0.3) 0%, rgba(212, 168, 75, 0.2) 100%)",
    borderWidth: "1rpx",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "img-card": {
    bgImage: "/static/images/component/card/card.png",
    bgColor: "",
    borderWidth: "0",
    borderColor: "transparent",
  },
  "img-card-big": {
    bgImage: "/static/images/component/card/cardBig.png",
    bgColor: "",
    borderWidth: "0",
    borderColor: "transparent",
  },
  "img-card2": {
    bgImage: "/static/images/component/card/card2.png",
    bgColor: "",
    borderWidth: "0",
    borderColor: "transparent",
  },
  "img-card2-big": {
    bgImage: "/static/images/component/card/card2Big.png",
    bgColor: "",
    borderWidth: "0",
    borderColor: "transparent",
  },
  "img-card3": {
    bgImage: "/static/images/component/card/card3.png",
    bgColor: "",
    borderWidth: "0",
    borderColor: "transparent",
  },
  "img-card3-big": {
    bgImage: "/static/images/component/card/card3Big.png",
    bgColor: "",
    borderWidth: "0",
    borderColor: "transparent",
  },
  "img-card4": {
    bgImage: "/static/images/component/card/card4.png",
    bgColor: "",
    borderWidth: "0",
    borderColor: "transparent",
  },
  "img-card5": {
    bgImage: "/static/images/component/card/card5.png",
    bgColor: "",
    borderWidth: "0",
    borderColor: "transparent",
  },
};

const SIZE_PRESETS = {
  none: "0",
  small: "16rpx",
  medium: "24rpx",
  normal: "32rpx",
  large: "48rpx",
};

export { MODE_PRESETS, SIZE_PRESETS };
</script>

<script setup>
import { computed } from "vue";

const props = defineProps({
  mode: {
    type: String,
    default: "img-card3",
    validator: (v) => Object.keys(MODE_PRESETS).includes(v),
  },
  size: {
    type: String,
    default: "normal",
    validator: (v) => Object.keys(SIZE_PRESETS).includes(v),
  },
  border: {
    type: String,
    default: "none",
    validator: (v) => ["none", "thin", "thick"].includes(v),
  },
  shadow: {
    type: Boolean,
    default: false,
  },
  borderRadius: {
    type: String,
    default: "32rpx",
  },
  bgColor: {
    type: String,
    default: "",
  },
  bgImage: {
    type: String,
    default: "",
  },
  bgSize: {
    type: String,
    default: "100% 100%",
  },
  bgPosition: {
    type: String,
    default: "center",
  },
  customStyle: {
    type: Object,
    default: () => ({}),
  },
});

const currentPreset = computed(() => MODE_PRESETS[props.mode] || MODE_PRESETS.default);

const computedBgImage = computed(() => props.bgImage || currentPreset.value.bgImage || "");
const computedBgColor = computed(() => props.bgColor || currentPreset.value.bgColor || "transparent");

const sizeClass = computed(() => {
  const map = {
    none: "p-0",
    small: "p-[16rpx]",
    medium: "p-[24rpx]",
    normal: "p-[32rpx]",
    large: "p-[48rpx]",
  };
  return map[props.size] || map.normal;
});

const radiusClass = computed(() => `rounded-[${props.borderRadius}]`);

const borderClass = computed(() => {
  if (props.border === "thin") return "border border-solid border-white/20";
  if (props.border === "thick") return "border-2 border-solid border-white/20";
  return "";
});

const containerStyle = computed(() => {
  const style = {};

  if (computedBgImage.value) {
    style.backgroundImage = `url(${computedBgImage.value})`;
    style.backgroundSize = props.bgSize;
    style.backgroundPosition = props.bgPosition;
    style.backgroundRepeat = "no-repeat";
  } else if (computedBgColor.value) {
    style.background = computedBgColor.value;
  }

  if (props.shadow) {
    style.boxShadow = "0 8rpx 32rpx rgba(0, 0, 0, 0.3)";
  }

  return { ...style, ...props.customStyle };
});
</script>

<style lang="scss" scoped>
.wk-stroke-bg {
  box-sizing: border-box;
}
</style>
