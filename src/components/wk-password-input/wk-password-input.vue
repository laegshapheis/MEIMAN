<template>
  <view class="relative z-0">
    <wk-input
      v-model="inputValue"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :leftIcon="leftIcon"
      @input="handleInput"
      suffixColor="white"
      v-bind="$attrs"
    >
      <template v-slot:prefix>
        <image
          v-if="leftIcon"
          :src="leftIcon"
          class="w-[40rpx] h-[40rpx] mr-[10rpx]"
          mode="widthFix"
        />
      </template>
    </wk-input>
    <view> </view>
  </view>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { regexPatterns } from "@/utils/validate2";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "请输入密码",
  },
  maxlength: {
    type: Number,
    default: 16,
  },
  leftIcon: {
    type: String,
    default: "/static/images/base/password.svg",
  },
});

const emit = defineEmits(["update:modelValue"]);

const inputValue = ref(props.modelValue);
const showPassword = ref(false);

const type = computed(() => {
  return showPassword.value ? "text" : "password";
});
// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    inputValue.value = newVal;
  }
);

// 处理输入
const handleInput = (value) => {
  setTimeout(() => {
    const inputValue = value.replace(regexPatterns.passwordFilter, "");
    emit("update:modelValue", inputValue);
  }, 0);
};
</script>

<style lang="scss" scoped></style>
