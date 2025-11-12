<template>
  <view class="flex flex-col px-[0rpx] py-[0rpx]">
    <view class="flex flex-row items-center justify-between mb-[10rpx]">
      <text class="text-base text-neutral leading-6 font-medium">支付宝姓名</text>
    </view>

    <view class="flex flex-row items-center justify-center h-[112rpx] bg-neutral-inputBg border-[length:1rpx] border-neutral-divider border-solid rounded-[24rpx]">
      <uv-input
        class="h-[96rpx]"
        v-model="formData.realname"
        type="text"
        readonly
        border="0"
        :placeholderStyle="{
          color: $colors.placeholder,
          fontSize: '28rpx',
          fontWeight: 'normal',
        }"
        :customStyle="{
          padding: '0 32rpx',
          fontWeight: 'bold',
        }"
        fontSize="28rpx"
        :color="$colors.DEFAULT"
      />
    </view>

    <view class="flex flex-row items-center justify-between mb-[10rpx] mt-[24rpx]">
      <text class="text-base text-neutral leading-6 font-medium">支付宝账号</text>
    </view>

    <view class="flex flex-row items-center justify-center h-[112rpx] bg-neutral-inputBg border-[length:1rpx] border-neutral-divider border-solid rounded-[24rpx]">
      <uv-input
        class="h-[96rpx]"
        v-model="formData.email"
        type="text"
        placeholder="请输入支付宝账号"
        maxlength="30"
        @input="formatEmail"
        border="0"
        :placeholderStyle="{
          color: $colors.placeholder,
          fontSize: '28rpx',
          fontWeight: 'normal',
        }"
        :customStyle="{
          padding: '0 32rpx',
          fontWeight: 'bold',
        }"
        fontSize="28rpx"
        :color="$colors.DEFAULT"
      />
    </view>

    <view class="flex flex-row items-center justify-between mb-[10rpx] mt-[24rpx]">
      <view class="flex flex-row items-center">
        <text class="text-base text-neutral leading-6 font-medium">支付宝收款码</text>
        <text class="text-sm text-neutral-error ml-[5rpx]">*</text>
      </view>
    </view>

    <view class="flex flex-row items-center">
      <view class="w-full flex flex-col items-start justify-center" @click="$emit('onUploadClick')">
        <image
          class="w-full h-[208rpx] mb-[15rpx]"
          :src="formData.upfile"
          mode="widthFix"
          v-if="formData.upfile"
        ></image>

        <view
          class="flex flex-col items-center justify-center w-[208rpx] h-[208rpx] bg-neutral-inputBg border-[length:1rpx] border-neutral-divider border-solid rounded-[24rpx]"
          v-if="!formData.upfile"
        >
          <text>
            <uv-icon size="50rpx" :color="$colors.secondary" name="plus"></uv-icon>
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import ValidateUtils from "@/utils/validate";

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:formData', 'onUploadClick']);

const formatEmail = (email) => {
  setTimeout(() => {
    emit('update:formData', {
      ...props.formData,
      email: email.replace(/[^a-zA-Z0-9@._]/g, "").slice(0, 30)
    });
  }, 10);
};

const validate = () => {
  if (!props.formData.email) {
    uni.$showToast({
      title: "请输入支付宝帐号",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (!ValidateUtils.isAlipayAccount(props.formData.email)) {
    uni.$showToast({
      title: "支付宝账号格式错误",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (!props.formData.upfile) {
    uni.$showToast({
      title: "请上传支付宝收款码",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  return true;
};

defineExpose({
  validate
});
</script> 