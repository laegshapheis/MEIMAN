<template>
  <WalletCard
    v-if="isEmpty"
    :is-empty="true"
    icon="/static/images/profile/wallet_usdt_icon.svg"
    add-text="添加USDT钱包地址"
    @click="$emit('edit')"
    class="usdt-bg2"
  />
  <WalletCard
    v-else
    icon="/static/images/profile/wallet_usdt_icon.svg"
    :title="usdtChain"
    :content="usdtAddress"
    class="usdt-bg"
  />
</template>

<script setup>
import WalletCard from './WalletCard.vue'

defineProps({
  isEmpty: {
    type: Boolean,
    default: true
  },
  usdtChain: {
    type: String,
    default: ''
  },
  usdtAddress: {
    type: String,
    default: ''
  }
})

defineEmits(['edit'])
</script> 

<style lang="scss" scoped>
  .usdt-bg {
    border-radius: 12px;
    border: 1px solid #DFE5F9;
    background: url('/static/images/user/wallet_usdt_bg_icon.svg') no-repeat right bottom/192rpx 192rpx, linear-gradient(92deg, #F1F5FF 1.32%, #D8E2FF 97.3%);
  }
  .usdt-bg2{
    border-radius: 24px;
    border: 2px dashed rgba(0, 0, 0, 0.10);
    background: #FFFFFF10;
  }
</style>
