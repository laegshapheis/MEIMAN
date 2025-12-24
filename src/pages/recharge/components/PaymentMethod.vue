<template>
  <view class="flex flex-col mt-[64rpx]">
    <view class="flex flex-row items-center justify-between">
      <text class="text-lg font-medium text-neutral">请选择充值方式</text>
    </view>

    <view class="flex flex-row items-center bg-wraper  mt-[21rpx] h-[144rpx]">
      <wk-picker
        class="dkh_btn"
        style="width: 100%"
        @change="handleChange"
        rangeKey="pay_name"
        :range="payments"
      >
        <view class="flex flex-row justify-between px-[30rpx]">
          <text class="text-lg text-white" v-if="currentIndex == -1">请先选择充值方式</text>
          <text class="text-lg font-semibold text-neutral" v-if="currentIndex >= 0">{{ payments[currentIndex].pay_name }}</text>
          <view class="flex flex-row items-center">
            <uv-icon size="32rpx" color="#fff" name="arrow-right"></uv-icon>
          </view>
        </view>
      </wk-picker>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  payments: {
    type: Array,
    required: true
  },
  wycznr: {
    type: String,
    default: ''
  },
  recharge_must_bind_wallet: {
    type: Number,
    default: 0
  },
  isusdt: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['change'])
const currentIndex = ref(-1)

const handleChange = (e) => {
  const value = props.payments[e.detail.value] || {}
  
  // 银联人工充值
  if (value?.pay_code == "ChinaPay" && value?.wyczkg == 1) {
    uni.$showModal({
      title: "",
      content: props.wycznr,
      showCancel: false,
    })
  }

  if (
    props.recharge_must_bind_wallet == 1 &&
    props.isusdt == 0 &&
    ["zxusdt", "UsdtPay"].includes(props.payments[e.detail.value].pay_code)
  ) {
    uni.$showModal({
      title: "提示",
      content: "为了您的资金安全，请先绑定USDT提现地址",
      showCancel: true,
      success: function (resx) {
        if (resx.confirm) {
          uni.navigateTo({
            url: '/pages/user/wallet',
          })
        }
      },
    })
    return false
  }

  currentIndex.value = e.detail.value
  emit('change', {
    index: e.detail.value,
    method: props.payments[e.detail.value]
  })
}
</script> 
<style lang="scss" scoped>
.bg-wraper{
  background-image: url('@/static/images/recharge/rate_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>