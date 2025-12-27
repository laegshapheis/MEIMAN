<template>
  <view class="relative z-20">
    <wk-input
      v-model="localValue"
      type="text"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :leftIcon="leftIcon"
      @input="handleInput"
      v-bind="$attrs"
    >
      <template v-slot:prefix>
        <image
          v-if="leftIcon"
          class="w-[40rpx] h-[40rpx] mr-[10rpx]"
          :src="leftIcon"
          mode="widthFix"
        />
      </template>
    </wk-input>
    <!-- 邮箱后缀选择弹出层 -->
    <scroll-view
      scroll-x
      v-if="showSuffix && filteredEmailSuffixes.length > 0"
      class="box-border px-[16rpx] py-[30rpx] absolute left-0 right-0 top-[100%] z-50 bg-[#1F197D] rounded-[24rpx] shadow-lg mt-[16rpx]"
    >
      <view class="flex flex-row">
        <view
          v-for="(suffix, index) in filteredEmailSuffixes"
          :key="index"
          class="border border-neutral-modalTextColor border-solid py-[8rpx] px-[16rpx] text-base rounded-full mr-[16rpx] text-neutral-modalTextColor"
          @click="selectSuffix(suffix)"
        >
          {{ suffix }}
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "请输入邮箱",
  },
  maxlength: {
    type: Number,
    default: 30,
  },
  leftIcon: {
    type: String,
    default: "/static/images/base/email.svg",
  },
});

const emit = defineEmits(["update:modelValue"]);

const localValue = ref(props.modelValue);
const showSuffix = ref(false);
// 邮箱后缀列表
const emailSuffixes = [
  "@gmail.com",
  "@qq.com",
  "@163.com",
  "@yahoo.com",
  "@hotmail.com",
  "@outlook.com",
  "@126.com",
  "@foxmail.com",
];
const filteredEmailSuffixes = ref(emailSuffixes);

// 监听外部值变化
watch(
  () => props.modelValue,
  (newVal) => {
    localValue.value = newVal;
  }
);

// // 处理失去焦点
// const handleBlur = () => {
//   showSuffix.value = false;
// };

// 处理输入
const handleInput = (value) => {
  emit("update:modelValue", value);
  const emailParts = value.split("@");
  if (emailParts.length > 1) {
    const domainPart = emailParts[1];
    filteredEmailSuffixes.value = emailSuffixes.filter((suffix) =>
      suffix.includes(domainPart)
    );
    if (filteredEmailSuffixes.value.length === 0) {
      showSuffix.value = false;
    } else {
      showSuffix.value = true;
    }
    if (filteredEmailSuffixes.value.includes(`@${domainPart}`)) {
      showSuffix.value = false;
    }
  } else {
    showSuffix.value = true;
  }
};

// 选择后缀
const selectSuffix = (suffix) => {
  const value = localValue.value;
  const prefix = value.split("@")[0];
  const newValue = prefix + suffix;

  localValue.value = newValue;
  emit("update:modelValue", newValue);
  showSuffix.value = false;
};
</script>

<style lang="scss" scoped></style>
