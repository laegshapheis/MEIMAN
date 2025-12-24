<template>
  <view class="flex flex-col justify-center mt-[38rpx] mb-[33rpx]">
    <view class="text-base leading-6">
      <CommonTips fontSize="24rpx" :content="paymentDesc"></CommonTips>
    </view>

    <view class="flex flex-row items-center justify-between mt-[66rpx] mb-[23rpx]">
      <text class="text-lg leading-6 font-medium">充值金额</text>
    </view>

    <view
      :class="['flex flex-col input-bg2 rounded-[24rpx] px-[32rpx]', symbolStore.value == 'CNY' ? 'pb-[24rpx]' : '']">
      <view
        :class="['flex flex-row items-center justify-center h-[120rpx]', symbolStore.value == 'CNY' ? 'border-0 border-b border-solid border-neutral-divider' : '']">
        <text class="text-2xl font-bold">$</text>
        <uv-input class="h-[120rpx]" v-model="formData.amount" type="digit" maxlength="9" placeholder="请输入充值金额"
          border="0" :placeholderStyle="{
            color: $colors.secondary,
            fontSize: '32rpx',
            fontWeight: 'normal',
          }" :customStyle="{
            fontWeight: 'bold',
          }" fontSize="36rpx" :color="$colors.DEFAULT" />
      </view>

      <view v-if="symbolStore.value == 'CNY'"
        class="flex flex-row items-center justify-between mt-[16rpx] text-neutral-theme">
        <text class="text-base font-medium">1 USDT = {{ rate }} CNY</text>
        <text class="text-base">实际到账 {{ symbolStore.value == "USDT" ? formData.amount ? formData.amount : 0 :
          calcRateUSDT(formData.amount, true) }} {{ symbolStore.code }}</text>
      </view>
    </view>

    <view class="flex flex-row items-center justify-between mt-[66rpx] mb-[23rpx]">
      <text class="text-lg leading-6 font-medium">付款信息</text>
    </view>

    <view class="flex flex-row items-center bg-wraper mt-[21rpx] rounded-[24rpx] h-[124rpx]">
      <wk-picker class="dkh_btn" style="width: 100%" @change="handleChangeWallet" rangeKey="title" :range="walletList">
        <view class="flex flex-row justify-between px-[30rpx]">
          <text class="text-lg text-white" v-if="currentWalletIndex == -1">请选择付款协议</text>
          <text class="text-lg font-semibold text-neutral" v-if="currentWalletIndex >= 0">{{
            walletList[currentWalletIndex].title }}</text>
          <view class="flex flex-row items-center">
            <uv-icon size="32rpx" color="#fff" name="arrow-right"></uv-icon>
          </view>
        </view>
      </wk-picker>
    </view>

    <view v-if="recharge_need_wallet_switch == 1"
      class="flex flex-row items-center justify-center h-[120rpx] input-bg rounded-[24rpx] mt-[28rpx]">
      <uv-textarea height="120rpx" v-model="formData.fkname" @input="inputUsdtAddress" :autoHeight="true"
        placeholder="请输入付款钱包地址(请勿填写充值地址)" border="none" :customStyle="{ background: 'transparent', padding: '0 32rpx' }"
        :textStyle="{
          color: $colors.DEFAULT,
          fontSize: '32rpx',
          fontWeight: 'bold',
        }" :placeholderStyle="{
          color: $colors.secondary,
          fontSize: '32rpx',
          fontWeight: 'normal',
        }" />
    </view>

    <view v-if="recharge_need_wallet_switch == 1" class="flex flex-row items-center justify-between mt-[18rpx]">
      <text class="text-base text-neutral-theme" @click="$emit('showContactList', 1)">历史付款地址</text>
      <text class="text-base text-neutral-theme" @click="navigateTo(routes.indexGuide)">如何获取付款钱包地址？</text>
    </view>

    <template v-if="needUsdtOrder">
      <view class="flex flex-row items-center justify-between mt-[20rpx] mb-[23rpx]">
        <text class="text-lg leading-6 font-medium">交易号</text>
      </view>

      <view class="flex flex-row items-center justify-center min-h-[120rpx] bg-neutral-inputBg rounded-[24rpx]">
        <uv-textarea v-model="formData.fkcontent" type="text" placeholder="输入TxHash TXID 哈希值 交易哈希" border="0"
          :placeholderStyle="{
            color: $colors.secondary,
            fontSize: '32rpx',
          }" fontSize="32rpx" :color="$colors.DEFAULT" :autoHeight="true" :customStyle="{
            backgroundColor: 'transparent',
          }" :textStyle="{
            fontSize: '32rpx',
            color: $colors.DEFAULT,
          }" />
      </view>
    </template>

    <view class="flex flex-row items-center justify-center w-[100%] mt-[33rpx] mb-[23rpx]" v-if="needPayPic">
      <view class="flex flex-col items-start justify-center w-[100%]" @click="handleUpload">
        <image class="w-full h-[150rpx] mb-[15rpx]" :src="formData.upfile" mode="widthFix" v-if="formData.upfile">
        </image>

        <view class="flex flex-col items-center justify-center w-[208rpx] h-[208rpx] input-bg rounded-[24rpx]"
          v-if="!formData.upfile">
          <text><uv-icon size="50rpx" :color="$colors.DEFAULT" name="plus"></uv-icon></text>
          <text class="text-base leading-6 font-medium text-neutral mt-[20rpx]">添加转账截图</text>
        </view>
      </view>
    </view>

    <view class="z-50 fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx] bg-neutral-bottomBtnBg">
      <wk-button height="80rpx" fontSize="30rpx" @submit="handleSubmit">提交</wk-button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { navigateTo } from "@/utils/navigation"
import { routes } from "@/config/routes"
import { formatPrice } from "@/utils/utils"
import ValidateUtils from "@/utils/validate"
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
  needUsdtOrder: {
    type: Boolean,
    default: false
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
  },
  recharge_need_wallet_switch: {
    type: Boolean,
    default: 0
  }
})

const emit = defineEmits(['submit', 'showContactList', 'upload'])

const formData = reactive({
  amount: '',
  fkname: '',
  fkcontent: '',
  upfile: '',
  usdtlian: ''
})

const currentWalletIndex = ref(-1)
const walletList = ref([
  {
    id: 1,
    title: "TRC20 波场链（Tron）",
  },
])

const calcRateUSDT = (value, justReturn = false) => {
  value = value || 0
  const calc = formatPrice((value * 100 * props.rate) / 100)
  return calc
}

const handleChangeWallet = (e) => {
  currentWalletIndex.value = e.detail.value
  formData.usdtlian = walletList.value[e.detail.value].id
}

const inputUsdtAddress = () => {
  const regex = /^T[A-Za-z0-9]*$/

  setTimeout(() => {
    if (!regex.test(formData.fkname)) {
      formData.fkname = ""
    } else if (formData.fkname.length > 34) {
      formData.fkname = formData.fkname.slice(0, 34)
    }
  }, 10)
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
      title: `最低充值${props.minAmount} USDT，最高充值${props.maxAmount} USDT，请重新输入`,
      duration: 3000,
      icon: "none",
    })
    return
  }

  if (!formData.usdtlian) {
    uni.$showToast({
      title: "请选择付款协议",
      duration: 3000,
      icon: "none",
    })
    return
  }

  if (props.recharge_need_wallet_switch == 1 && !formData.fkname) {
    uni.$showToast({
      title: "请输入付款地址",
      duration: 3000,
      icon: "none",
    })
    return
  }

  if (props.recharge_need_wallet_switch == 1 && !ValidateUtils.isValidWalletAddress(formData.fkname, walletList.value[currentWalletIndex.value].title)) {
    uni.$showToast({
      title: "付款地址格式错误！",
      duration: 3000,
      icon: "none",
    })
    return
  }

  if (!formData.fkcontent && props.needUsdtOrder) {
    uni.$showToast({
      title: "请输入交易号",
      duration: 3000,
      icon: "none",
    })
    return
  }

  if (!ValidateUtils.isValidTxHash(formData.fkcontent) && props.needUsdtOrder) {
    uni.$showToast({
      title: "交易号/哈希值/TXID/TxHash格式错误！",
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

  emit('submit', formData)
}

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

</script>
