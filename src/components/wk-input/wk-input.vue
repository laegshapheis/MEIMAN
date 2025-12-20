<template>
  <view 
    class="wk-input box-border w-full overflow-hidden"
    :class="[sizeClass]"
    :style="containerStyle"
  >
    <uv-input
      class="w-full box-border h-[55rpx]"
      v-model="modelValue"
      :type="inputType"
      :placeholder="placeholder"
      :password="inputType === 'password'"
      :border="0"
      :placeholderStyle="placeholderStyles"
      :fontSize="currentSize.fontSize"
      :color="computedColor"
      @input="handleInput"
      v-bind="attrs"
    >
      <template v-slot:prefix>
        <slot name="prefix" />
      </template>
      <template v-slot:suffix>
        <view v-if="type === 'password'" @click="handleShowPassword">
          <uv-icon
            :color="iconColor"
            v-if="!showPassword"
            class="w-[40rpx] h-[40rpx] ml-[10rpx]"
            name="eye"
            size="35rpx"
          />
          <uv-icon
            v-else
            :color="iconColor"
            size="35rpx"
            class="w-[40rpx] h-[40rpx] ml-[10rpx]"
            name="eye-off-outline"
          />
        </view>
        <slot name="suffix" />
      </template>
    </uv-input>
  </view>
</template>

<script>
import { neutral } from "@/config/colors";

const MODE_PRESETS = {
  default: {
    bgColor: neutral.inputBg,
    color: "#010101",
    placeholderColor: "rgba(0, 0, 0, 0.4)",
    borderWidth: "1rpx",
    borderColor: neutral.inputBorder,
    borderRadius: "16rpx",
    iconColor: "#252C2F50",
  },
  dark: {
    bgColor: "#010101",
    color: "#FFFFFF",
    placeholderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: "1rpx",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "16rpx",
    iconColor: "rgba(255, 255, 255, 0.5)",
  },
  transparent: {
    bgColor: "transparent",
    color: "#FFFFFF",
    placeholderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: "0",
    borderColor: "transparent",
    borderRadius: "16rpx",
    iconColor: "rgba(255, 255, 255, 0.5)",
  },
  glass: {
    bgColor: "rgba(255, 255, 255, 0.1)",
    color: "#FFFFFF",
    placeholderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: "1rpx",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "16rpx",
    iconColor: "rgba(255, 255, 255, 0.5)",
  },
  outline: {
    bgColor: "transparent",
    color: "#010101",
    placeholderColor: "rgba(0, 0, 0, 0.4)",
    borderWidth: "1rpx",
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "16rpx",
    iconColor: "#252C2F50",
  },
  "outline-light": {
    bgColor: "transparent",
    color: "#FFFFFF",
    placeholderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: "1rpx",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: "16rpx",
    iconColor: "rgba(255, 255, 255, 0.5)",
  },
  filled: {
    bgColor: "rgba(0, 0, 0, 0.05)",
    color: "#010101",
    placeholderColor: "rgba(0, 0, 0, 0.4)",
    borderWidth: "0",
    borderColor: "transparent",
    borderRadius: "16rpx",
    iconColor: "#252C2F50",
  },
  "filled-dark": {
    bgColor: "rgba(255, 255, 255, 0.1)",
    color: "#FFFFFF",
    placeholderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: "0",
    borderColor: "transparent",
    borderRadius: "16rpx",
    iconColor: "rgba(255, 255, 255, 0.5)",
  },
  rounded: {
    bgColor: neutral.inputBg,
    color: "#010101",
    placeholderColor: "rgba(0, 0, 0, 0.4)",
    borderWidth: "1rpx",
    borderColor: neutral.inputBorder,
    borderRadius: "100rpx",
    iconColor: "#252C2F50",
  },
  "rounded-dark": {
    bgColor: "#010101",
    color: "#FFFFFF",
    placeholderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: "1rpx",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "100rpx",
    iconColor: "rgba(255, 255, 255, 0.5)",
  },
  "img-primary": {
    bgImage: "/static/images/index/input_primary.png",
    color: "#FFFFFF",
    placeholderColor: "rgba(255, 255, 255, 0.5)",
    borderColor: "transparent",
    iconColor: "rgba(255, 255, 255, 1)",
  }
};

const SIZE_PRESETS = {
  small: { padding: "16rpx", fontSize: "24rpx", height: "72rpx" },
  medium: { padding: "24rpx", fontSize: "28rpx", height: "96rpx" },
  large: { padding: "32rpx", fontSize: "32rpx", height: "102rpx" },
};

export { MODE_PRESETS, SIZE_PRESETS };
</script>

<script setup>
import { defineProps, useAttrs, ref, defineEmits, computed, watch } from 'vue';
import { neutral } from "@/config/colors";

const attrs = useAttrs();

const props = defineProps({
  mode: {
    type: String,
    default: "img-primary",
    validator: (v) => Object.keys(MODE_PRESETS).includes(v),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (v) => Object.keys(SIZE_PRESETS).includes(v),
  },
  value: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  bgColor: {
    type: String,
    default: '',
  },
  bgImage: {
    type: String,
    default: '',
  },
  bgSize: {
    type: String,
    default: 'contain',
  },
  bgPosition: {
    type: String,
    default: 'center',
  },
  color: {
    type: String,
    default: '',
  },
  placeholderColor: {
    type: String,
    default: '',
  },
  borderWidth: {
    type: String,
    default: '',
  },
  borderColor: {
    type: String,
    default: '',
  },
  borderRadius: {
    type: String,
    default: '',
  },
  customStyle: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['input', 'update:value']);

const currentPreset = computed(() => MODE_PRESETS[props.mode] || MODE_PRESETS.default);
const currentSize = computed(() => SIZE_PRESETS[props.size] || SIZE_PRESETS.medium);

const isImageMode = computed(() => props.mode.startsWith('img-') || props.bgImage);

const computedBgImage = computed(() => props.bgImage || currentPreset.value.bgImage || '');
const computedBgColor = computed(() => props.bgColor || currentPreset.value.bgColor || 'transparent');
const computedColor = computed(() => props.color || currentPreset.value.color);
const computedPlaceholderColor = computed(() => props.placeholderColor || currentPreset.value.placeholderColor);
const computedBorderWidth = computed(() => props.borderWidth || currentPreset.value.borderWidth);
const computedBorderColor = computed(() => props.borderColor || currentPreset.value.borderColor);
const computedBorderRadius = computed(() => props.borderRadius || currentPreset.value.borderRadius);
const iconColor = computed(() => currentPreset.value.iconColor);

const sizeClass = computed(() => {
  const map = {
    small: 'p-[16rpx]',
    medium: 'p-[24rpx]',
    large: 'p-[32rpx]',
  };
  return map[props.size] || map.medium;
});

const containerStyle = computed(() => {
  const style = {
    borderWidth: computedBorderWidth.value,
    borderColor: computedBorderColor.value,
    borderStyle: 'solid',
    borderRadius: computedBorderRadius.value,
  };

  if (computedBgImage.value) {
    style.background = `url(${computedBgImage.value}) ${props.bgPosition}/${props.bgSize} no-repeat`;
  } else {
    style.background = computedBgColor.value;
  }

  return { ...style, ...props.customStyle };
});

const placeholderStyles = computed(() => ({
  color: computedPlaceholderColor.value,
  fontSize: currentSize.value.fontSize,
}));

const modelValue = ref(props.value);
const inputType = ref(props.type);
const showPassword = ref(false);

watch(() => props.value, (newVal) => {
  modelValue.value = newVal;
});

const handleInput = (value) => {
  emits('input', value);
  emits('update:value', value);
};

const handleShowPassword = () => {
  showPassword.value = !showPassword.value;
  inputType.value = showPassword.value ? 'text' : 'password';
};
</script>

<style lang="scss" scoped>
.wk-input {
  :deep(.uv-input) {
    padding: 0 !important;
  }
}
</style>
