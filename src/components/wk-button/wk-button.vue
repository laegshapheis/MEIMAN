<template>
  <view class="wk-button-wrapper">
    <uv-button
      v-bind="attrs"
      :type="uvType"
      :customStyle="computedStyle"
      :loading="loading"
      :disabled="disabled"
      @click="handleClick"
    >
      <slot></slot>
    </uv-button>
  </view>
</template>

<script>
import { neutral } from "@/config/colors";

const TYPE_PRESETS = {
  primary: {
    background: neutral.theme,
    color: "#fff",
    border: "transparent",
    shadow: "0 4rpx 12rpx rgba(182, 118, 255, 0.3)",
  },
  secondary: {
    background: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    border: "rgba(255, 255, 255, 0.3)",
    shadow: "none",
  },
  success: {
    background: "#10B981",
    color: "#fff",
    border: "transparent",
    shadow: "0 4rpx 12rpx rgba(16, 185, 129, 0.3)",
  },
  warning: {
    background: "#F59E0B",
    color: "#fff",
    border: "transparent",
    shadow: "0 4rpx 12rpx rgba(245, 158, 11, 0.3)",
  },
  danger: {
    background: "#EF4444",
    color: "#fff",
    border: "transparent",
    shadow: "0 4rpx 12rpx rgba(239, 68, 68, 0.3)",
  },
  info: {
    background: "#299DF6",
    color: "#fff",
    border: "transparent",
    shadow: "0 4rpx 12rpx rgba(41, 157, 246, 0.3)",
  },
  dark: {
    background: "#010101",
    color: "#fff",
    border: "rgba(255, 255, 255, 0.2)",
    shadow: "none",
  },
  light: {
    background: "#FFFFFF",
    color: "#010101",
    border: "rgba(0, 0, 0, 0.1)",
    shadow: "0 4rpx 12rpx rgba(0, 0, 0, 0.08)",
  },
  gradient: {
    background: "linear-gradient(135deg, #B676FF 0%, #8B5CF6 100%)",
    color: "#fff",
    border: "transparent",
    shadow: "0 4rpx 16rpx rgba(182, 118, 255, 0.4)",
  },
  "gradient-blue": {
    background: "linear-gradient(135deg, #299DF6 0%, #0066FF 100%)",
    color: "#fff",
    border: "transparent",
    shadow: "0 4rpx 16rpx rgba(41, 157, 246, 0.4)",
  },
  "gradient-gold": {
    background: "linear-gradient(135deg, #F5D17A 0%, #D4A84B 100%)",
    color: "#1A1A1A",
    border: "transparent",
    shadow: "0 4rpx 16rpx rgba(212, 168, 75, 0.4)",
  },
  "gradient-green": {
    background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    color: "#fff",
    border: "transparent",
    shadow: "0 4rpx 16rpx rgba(16, 185, 129, 0.4)",
  },
  "gradient-orange": {
    background: "linear-gradient(135deg, #FB923C 0%, #EA580C 100%)",
    color: "#fff",
    border: "transparent",
    shadow: "0 4rpx 16rpx rgba(234, 88, 12, 0.4)",
  },
  "gradient-pure":{
    background: "linear-gradient(270deg, #AD6EFF 0%, #1A4CFF 95.42%)",
    color: "#fff",
    border: "transparent",
  },
  "img-primary": {
    bgImage: "/static/images/index/btn_primary.png",
    color: "#fff",
    border: "transparent",
    shadow: "none",
  },
  "large":{
    bgImage: "/static/images/component/button/btn_large.png",
    color: "#fff",
    border: "transparent",
    shadow: "none",
  },
  "medium":{
    bgImage: "/static/images/component/button/btn_medium.png",
    color: "#fff",
    border: "transparent",
    shadow: "none",
  },
  "small":{
    bgImage: "/static/images/component/button/btn_small.png",
    color: "#fff",
    border: "transparent",
    shadow: "none",
  },
  "img-bg": {
    bgImage: "/static/images/yuebao/btn_bg.png",
    color: "#fff",
    border: "transparent",
    shadow: "none",
  },
  "img-bg2": {
    bgImage: "/static/images/yuebao/btn_bg2.png",
    color: "#fff",
    border: "transparent",
    shadow: "none",
  },
  "img-bg3": {
    bgImage: "/static/images/component/button/btn_tuiguang.png",
    color: "#000",
    border: "transparent",
    shadow: "none",
    height: "60rpx",
  },
  "plain_1": {
    border: "#BD6EFF",
    background: "transparent",
    color: "#FFFFFF60",
    boxShadow: "none",
    height: "60rpx",
  },
  "gradient-lottery-use": {
    background: "linear-gradient(103deg, rgba(166, 51, 255, 0.40) 11.94%, rgba(23, 15, 255, 0.40) 94.55%), radial-gradient(56.68% 65.59% at 18.1% 100%, rgba(31, 25, 101, 0.30) 0%, rgba(31, 25, 101, 0.00) 100%), radial-gradient(28.23% 54.58% at 64.44% 0%, rgba(78, 69, 173, 0.31) 0%, rgba(31, 22, 144, 0.00) 100%), linear-gradient(246deg, rgba(154, 103, 255, 0.48) 10.85%, rgba(72, 62, 210, 0.00) 53.28%), radial-gradient(86.14% 83.15% at 73.06% 100%, #31FFF5 0%, rgba(13, 85, 255, 0.00) 100%), radial-gradient(54% 53.14% at 5.17% 18.33%, rgba(198, 52, 255, 0.66) 0%, rgba(198, 52, 255, 0.00) 100%), linear-gradient(110deg, rgba(127, 23, 170, 0.80) 3.96%, rgba(127, 23, 170, 0.00) 75.08%), radial-gradient(167.64% 95.42% at 50% 119.58%, #0042D0 0%, rgba(2, 64, 199, 0.00) 60.69%), linear-gradient(90deg, #281964 0%, #1E228E 88.36%)",
    color: "#fff",
  },

  "gradient-lottery": {
    background: "linear-gradient(90deg, #A7FFFF 0%, #FFCCF9 100%)",
    color: "#000000",
    border: "#FFF",
    // shadow: "0 4rpx 16rpx rgba(234, 88, 12, 0.4)",
  },

};

const SIZE_PRESETS = {
  mini: { height: "56rpx", fontSize: "24rpx", padding: "0 24rpx" },
  small: { height: "72rpx", fontSize: "28rpx", padding: "0 32rpx" },
  normal: { height: "88rpx", fontSize: "32rpx", padding: "0 40rpx" },
  large: { height: "102rpx", fontSize: "36rpx", padding: "0 48rpx" },
};

export { TYPE_PRESETS, SIZE_PRESETS };
</script>

<script setup>
import { defineProps, defineEmits, useAttrs, computed } from "vue";
import { neutral } from "@/config/colors";

const attrs = useAttrs();

const props = defineProps({
  type: {
    type: String,
    default: "img-primary",
    validator: (v) => Object.keys(TYPE_PRESETS).includes(v),
  },
  size: {
    type: String,
    default: "small",
    validator: (v) => Object.keys(SIZE_PRESETS).includes(v),
  },
  variant: {
    type: String,
    default: "solid",
    validator: (v) => ["solid", "outline", "ghost", "text"].includes(v),
  },
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "",
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
    default: "",
  },
  background: {
    type: String,
    default: "",
  },
  borderColor: {
    type: String,
    default: "",
  },
  borderRadius: {
    type: String,
    default: "360rpx",
  },
  shadow: {
    type: String,
    default: "",
  },
  showShadow: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  customStyle: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["click", "submit"]);

const uvType = computed(() => {
  if (["primary", "success", "warning", "danger", "info"].includes(props.type)) {
    return props.type;
  }
  return "primary";
});

const currentPreset = computed(() => TYPE_PRESETS[props.type] || TYPE_PRESETS.primary);
const currentSize = computed(() => SIZE_PRESETS[props.size] || SIZE_PRESETS.normal);

const isImageType = computed(() => props.type.startsWith("img-"));

const computedStyle = computed(() => {
  const preset = currentPreset.value;
  const size = currentSize.value;

  let background = props.background || preset.background || "transparent";
  let textColor = props.color || preset.color;
  let borderStyle = `1px solid ${props.borderColor || preset.border}`;

  if (props.variant === "outline" && !isImageType.value) {
    textColor = props.color || preset.background;
    background = "transparent";
    borderStyle = `1px solid ${props.borderColor || preset.background}`;
  } else if (props.variant === "ghost" && !isImageType.value) {
    textColor = props.color || preset.background;
    background = `${preset.background}15`;
    borderStyle = "none";
  } else if (props.variant === "text" && !isImageType.value) {
    textColor = props.color || preset.background;
    background = "transparent";
    borderStyle = "none";
  }

  const style = {
    width: props.width,
    height: props.height || size.height,
    fontSize: props.fontSize || size.fontSize,
    fontWeight: props.fontWeight,
    color: textColor,
    borderRadius: props.borderRadius,
    border: borderStyle,
    boxShadow: props.showShadow ? (props.shadow || preset.shadow) : "none",
    opacity: props.disabled ? 0.6 : 1,
  };

  if (preset.bgImage) {
    style.background = `url(${preset.bgImage}) center/100% no-repeat`;
  } else {
    style.background = background;
  }

  return { ...style, ...props.customStyle };
});

const handleClick = () => {
  if (props.disabled || props.loading) return;
  emit("click");
  emit("submit");
};
</script>

<style lang="scss" scoped>
.wk-button-wrapper {
  display: inline-block;
  width: 100%;
}
</style>
