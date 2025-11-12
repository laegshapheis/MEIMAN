<template>
  <view class="flex flex-col mb-[30rpx]">
    <view class="flex flex-row items-center justify-between mb-[22rpx]">
      <text class="text-lg leading-6 font-medium text-neutral">选择提现方式</text>
      <text
        class="text-base leading-6 text-neutral"
        @click="handleNavigateToWallet"
        >绑定提现资料</text
      >
    </view>

    <view
        class="flex flex-row items-center h-[120rpx] bg-neutral-inputBg rounded-[24rpx]"
    >
      <wk-picker
        style="width: 100%"
        @change="handleChange"
        rangeKey="text"
        :range="withdrawMethodList"
      >
        <view class="flex flex-row justify-between px-[30rpx]">
          <text
            class="text-lg text-neutral-secondary"
            v-if="currentMethodIndex == -1"
            >请先选择提现方式</text
          >
          <text
            class="text-lg font-semibold text-neutral"
            v-if="currentMethodIndex >= 0"
            >{{ withdrawMethodList[currentMethodIndex].text }}</text
          >
          <view class="flex flex-row items-center"
            ><uv-icon
              size="32rpx"
              :color="$colors.secondary"
              name="arrow-right"
            ></uv-icon
          ></view>
        </view>
      </wk-picker>
    </view>
  </view>
</template>

<script setup>
import { routes } from "@/config/routes";
import { navigateTo } from "@/utils/navigation";

const props = defineProps({
  withdrawMethodList: {
    type: Array,
    default: () => []
  },
  currentMethodIndex: {
    type: Number,
    default: -1
  }
});

const emit = defineEmits(['update:currentMethodIndex', 'change']);

const handleChange = (e) => {
  emit('update:currentMethodIndex', e.detail.value);
  emit('change', e);
};

const handleNavigateToWallet = () => {
  navigateTo(routes.wallet);
};
</script> 