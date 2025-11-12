<template>
  <view 
  class="box-border rounded-[16rpx] w-full overflow-hidden"
    :class="[
      size === 'large' ? 'p-[32rpx]' : size === 'small' ? 'p-[16rpx]' : 'p-[24rpx]'
    ]"
    :style="{  background: bgColor, borderWidth: borderWidth, borderColor: borderColor, borderStyle: 'solid' }">
    <uv-input
      class="w-full box-border h-[55rpx]"
      v-model="modelValue"
      :type="inputType"
      :placeholder="placeholder"
      :password="inputType === 'password'"
      :border="0"
      :placeholderStyle="{ 
        color: placeholderColor, 
        fontSize: size === 'large' ? '32rpx' : size === 'small' ? '24rpx' : '28rpx' 
      }"
      :fontSize="size === 'large' ? '32rpx' : size === 'small' ? '24rpx' : '28rpx'"
      :color="color"
      @input="(value) => handleInput(value)"
      v-bind="attrs"
    >
    <template v-slot:prefix>
      <slot name="prefix" />
    </template>
    <template v-slot:suffix>
      <view v-if="type === 'password'" @click="handleShowPassword">
        <uv-icon
          :color="$colors.DEFAULT"
          v-if="!showPassword"
          class="w-[40rpx] h-[40rpx] ml-[10rpx]"
          name="eye"
          size="35rpx"
          mode="scaleToFill"
        />
        <uv-icon
          v-else
          :color="$colors.DEFAULT"
          size="35rpx"
          class="w-[40rpx] h-[40rpx] ml-[10rpx]"
          name="eye-off-outline"
          mode="scaleToFill"
        />
      </view>
      </template>
    </uv-input>
  </view>
</template>
<script setup>
import { defineProps, useAttrs, ref, defineEmits } from 'vue';
import { neutral } from "@/config/colors";
const attrs = useAttrs();
const props = defineProps({
  bgColor: {
    type: String,
    default: neutral.inputBg,
  },
  color: {
    type: String,
    default: neutral.DEFAULT,
  },
  placeholderColor: {
    type: String,
    default: neutral.placeholder,
  },
  value: {
    type: String,
    default: '',
  },
  label: {
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
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  borderWidth: {
    type: String,
    default: '1rpx',
  },
  borderColor: {
    type: String,
    default: neutral.inputBorder,
  },
});
const inputType = ref(props.type);
const emits = defineEmits(['input']);
const modelValue = ref(props.value);
const showPassword = ref(false);
const handleInput = (value) => {
  emits('input', value);
};
const handleShowPassword = () => {
  showPassword.value = !showPassword.value;
  inputType.value = showPassword.value ? 'text' : 'password';
};
</script>
<style scoped lang="scss">
::v-deep {
  .uv-input {
    padding: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
</style>