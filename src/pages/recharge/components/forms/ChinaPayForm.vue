<template>
  <view class="flex flex-col justify-center mt-[38rpx]">
    <view class="text-base leading-6">
      <CommonTips :content="paymentDesc"></CommonTips>
    </view>

    <view class="flex flex-row items-center justify-between mt-[66rpx] mb-[23rpx]">
      <text class="text-neutral text-lg leading-6 font-medium">充值金额</text>
    </view>

    <view :class="['flex flex-col bg-neutral-inputBg rounded-[24rpx] px-[32rpx]', symbolStore.value == 'USDT' ? 'pb-[24rpx]' : '']">
      <view :class="['flex flex-row items-center justify-center h-[120rpx]', symbolStore.value == 'USDT' ? 'border-0 border-b border-solid border-neutral-divider' : '']">
        <text class="text-2xl font-bold">¥</text>
        <uv-input
          class="h-[120rpx]"
          v-model="formData.amount"
          type="digit"
          maxlength="9"
          placeholder="请输入人民币转账金额"
          border="0"
          :placeholderStyle="{
            color: $colors.secondary,
            fontSize: '32rpx',
            fontWeight: 'normal',
          }"
          :customStyle="{
            fontWeight: 'bold',
          }"
          fontSize="36rpx"
          :color="$colors.DEFAULT"
        />
      </view>

      <view class="flex flex-row items-center justify-between mt-[16rpx] text-neutral-theme" v-if="symbolStore.value == 'USDT'">
        <text class="text-base font-medium">1 {{ symbolStore.code }} = {{ rate }} CNY</text>
        <text class="text-base">实际到账 {{ formData.amount ? formatPrice((formData.amount * 100) / (rate * 100)) : 0 }} {{ symbolStore.code }}</text>
      </view>
    </view>

    <view class="flex flex-row items-center justify-between mt-[66rpx] mb-[23rpx]">
      <text class="text-lg leading-6 font-medium">付款人姓名</text>
      <text class="text-base text-neutral" @click="$emit('showContactList', 2)">历史付款人</text>
    </view>

    <view class="flex flex-row items-center justify-center h-[120rpx] bg-neutral-inputBg rounded-[24rpx]">
      <uv-input
        class="h-[120rpx]"
        v-model="formData.fkname" 
        type="text"
        :formatter="formatName"
        placeholder="请输入付款人姓名"
        border="0"
        :placeholderStyle="{
          color: $colors.secondary,
          fontSize: '32rpx',
          fontWeight: 'normal',
        }"
        :customStyle="{
          padding: '0 32rpx',
          fontWeight: 'bold',
        }"
        fontSize="32rpx"
        :color="$colors.DEFAULT"
      />
    </view>

    <view class="flex flex-row items-center justify-center w-[100%] mt-[40rpx] mb-[10rpx]" v-if="needPayPic">
      <view class="flex flex-col items-start justify-center w-[100%]" @click="handleUpload">
        <image class="w-full h-[150rpx] mb-[15rpx]" :src="formData.upfile" mode="widthFix" v-if="formData.upfile"></image>

        <view class="flex flex-col items-center justify-center w-[208rpx] h-[208rpx] bg-neutral-inputBg rounded-[24rpx]" v-if="!formData.upfile">
          <text><uv-icon size="50rpx" :color="$colors.DEFAULT" name="plus"></uv-icon></text>
          <text class="text-base leading-6 font-medium text-neutral mt-[20rpx]">添加转账截图</text>
        </view>
      </view>
    </view>

    <view class="fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx] bg-neutral-bottomBtnBg">
      <wk-button type="bg" @submit="handleSubmit">提交</wk-button>
    </view>
  </view>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { formatPrice } from "@/utils/utils"
import CommonTips from "@/components/base/common-tips"
import { useSymbolStore } from "@/stores/symbolStore";

const symbolStore = useSymbolStore();
const props = defineProps({
  rate: {
    type: Number,
    required: true
  },
  paymentDesc: {
    type: String,
    required: true
  },
  needPayPic: {
    type: Boolean,
    default: false
  },
  minAmount: {
    type: Number,
    required: true
  },
  maxAmount: {
    type: Number,
    required: true
  },
  uploadedImageUrl: {
    type: String,
    default: ''
  },
  fkname: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'showContactList', 'upload'])

const formData = reactive({
  amount: '',
  fkname: '',
  upfile: ''
})

watch(() => props.uploadedImageUrl, (newUrl) => {
  if (newUrl) {
    formData.upfile = newUrl;
  }
});

watch(() => props.fkname, (newFkname) => {
  if (newFkname) {
    formData.fkname = newFkname;
  }
});

const formatName = (val) => {
  return val.replace(/[^\u4e00-\u9fa5]/g, "")
}

const handleUpload = () => {
  emit('upload')
}

const checkRange = (value, min, max) => {
  if (value < min || value > max) {
    uni.$showToast({
      title: `数值必须在 ${min} 到 ${max} 之间`,
      icon: "none",
    })
    return false
  }
  return true
}

const handleSubmit = () => {
  if (!formData.amount) {
    uni.$showToast({
      title: "请输入充值金额",
      duration: 3000,
      icon: "none",
    })
    return
  }

  if (!checkRange(formData.amount, props.minAmount, props.maxAmount)) {
    uni.$showToast({
      title: `最低充值${props.minAmount} CNY，最高充值${props.maxAmount} CNY，请重新输入`,
      duration: 3000,
      icon: "none",
    })
    return false
  }

  if (!formData.fkname) {
    uni.$showToast({
      title: "请输入付款人姓名",
      duration: 3000,
      icon: "none",
    })
    return
  }

  if (!formData.upfile && props.needPayPic) {
    uni.$showToast({
      title: "没有上传凭证，请上传凭证",
      duration: 3000,
      icon: "none",
    })
    return
  }

  formData.usdt = formatPrice(formData.amount / props.rate)
  emit('submit', formData)
}
</script> 