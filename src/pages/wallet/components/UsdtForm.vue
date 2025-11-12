<template>
  <view class="flex flex-col px-[0rpx] py-[0rpx]">
    <view class="flex flex-row items-center justify-between mb-[10rpx]">
      <text class="text-base text-neutral leading-6 font-medium">地址类型</text>
    </view>

    <view class="flex flex-row items-center h-[112rpx] bg-neutral-inputBg border-[length:1rpx] border-neutral-divider border-solid rounded-[24rpx]">
      <wk-picker
        style="width: 100%"
        @change="handleChangeMethod"
        rangeKey="title"
        :range="onlineWalletList"
      >
        <view class="flex flex-row justify-between px-[30rpx]">
          <text class="text-base text-neutral-placeholder" v-if="currentMethodIndex == -1">请选择地址类型</text>
          <text class="text-lg font-semibold text-neutral" v-if="currentMethodIndex >= 0">{{ onlineWalletList[currentMethodIndex].title }}</text>
          <view class="flex flex-row items-center">
            <uv-icon size="24rpx" :color="$colors.placeholder" name="arrow-right"></uv-icon>
          </view>
        </view>
      </wk-picker>
    </view>

    <view class="flex flex-row items-center justify-between mb-[10rpx] mt-[24rpx]">
      <text class="text-base text-neutral leading-6 font-medium">USDT 地址</text>
    </view>

    <view class="flex flex-row items-center justify-center min-h-[112rpx] bg-neutral-inputBg border-[length:1rpx] border-neutral-divider border-solid rounded-[24rpx]">
      <uv-textarea
        v-model="formData.usdtadr"
        type="text"
        :autoHeight="true"
        placeholder="请输入收款钱包地址"
        @input="inputUsdtAddress"
        :customStyle="{
          backgroundColor: 'transparent',
          fontSize: '28rpx',
          color: $colors.DEFAULT,
          paddingLeft: '32rpx',
          paddingRight: '32rpx',
        }"
        border="0"
        :textStyle="{
          color: $colors.DEFAULT,
          fontSize: '28rpx',
          fontWeight: 'bold',
        }"
        :placeholderStyle="{
          color: $colors.placeholder,
          fontSize: '24rpx',
          fontWeight: 'normal',
        }"
      />
    </view>
    <text class="text-base text-neutral underline mt-[24rpx] text-right" @click="$emit('onGuideClick')">如何获取USDT收款钱包地址？</text>
  </view>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  onlineWalletList: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['update:formData', 'onGuideClick']);

const currentMethodIndex = ref(-1);

const handleChangeMethod = (e) => {
  currentMethodIndex.value = e.detail.value;
  if (currentMethodIndex.value >= 0) {
    emit('update:formData', { 
      ...props.formData, 
      usdtlian: props.onlineWalletList[e.detail.value].id 
    });
  }
};

const inputUsdtAddress = (address) => {
  const regex = /^T[A-Za-z0-9]*$/;

  setTimeout(() => {
    if (!regex.test(address)) {
      emit('update:formData', { ...props.formData, usdtadr: '' });
    } else if (address.length > 34) {
      emit('update:formData', { ...props.formData, usdtadr: address.slice(0, 34) });
    }
  }, 10);
};

const validate = () => {
  if (!props.formData.usdtlian) {
    uni.$showToast({
      title: "请选择USDT链",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  const usdtAddress = props.formData.usdtadr;
  if (!usdtAddress) {
    uni.$showToast({
      title: "请输入钱包地址",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (props.formData.usdtlian == "1") {
    if (usdtAddress.substr(0, 1) == "T" || usdtAddress.substr(0, 1) == "t") {
      if (usdtAddress.length < 34 || usdtAddress.length > 40) {
        uni.$showToast({
          title: "请绑定正确的收款地址",
          duration: 3000,
          icon: "none",
        });
        return false;
      }
    } else {
      uni.$showToast({
        title: "请绑定正确的收款地址",
        duration: 3000,
        icon: "none",
      });
      return false;
    }
  } else {
    if (usdtAddress.substr(0, 2) == "0X" || usdtAddress.substr(0, 2) == "0x") {
      if (props.formData.usdtlian == 3) {
        if (usdtAddress.length !== 42) {
          uni.$showToast({
            title: "请绑定正确的收款地址",
            duration: 3000,
            icon: "none",
          });
          return false;
        }
      } else if (usdtAddress.length < 34 || usdtAddress.length > 42) {
        uni.$showToast({
          title: "请绑定正确的收款地址",
          duration: 3000,
          icon: "none",
        });
        return false;
      }
    } else {
      uni.$showToast({
        title: "请绑定正确的收款地址",
        duration: 3000,
        icon: "none",
      });
      return false;
    }
  }

  return true;
};

defineExpose({
  validate
});
</script> 