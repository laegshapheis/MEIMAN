<template>
  <template v-for="item in bankList" :key="item.id">
    <WalletCard
      icon="/static/images/profile/wallet_unipay_icon.png"
      :title="`${item.bankname} ${realName}`"
      :content="item.bankcode"
      class="mt-[30rpx] bank-bg"
    />
  </template>
  
  <WalletCard
    v-if="canAddMore"
    :is-empty="true"
    icon="/static/images/profile/wallet_unipay_icon.png"
    add-text="添加银行卡"
    @click="$emit('edit')"
    class="mt-[30rpx] bank-bg2"
  />
</template>

<script setup>
import WalletCard from './WalletCard.vue'

defineProps({
  bankList: {
    type: Array,
    default: () => []
  },
  realName: {
    type: String,
    default: ''
  },
  canAddMore: {
    type: Boolean,
    default: false
  }
})

defineEmits(['edit'])
</script> 

<style lang="scss" scoped>
  .bank-bg {  
    border-radius: 12px;
    border: 1px solid #dfe5f9;
    background: url('/static/images/user/wallet_bank_bg_icon.svg') no-repeat right bottom/192rpx 192rpx, linear-gradient(92deg, #fffdf1 1.32%, #fff4cd 97.3%);
  }
  .bank-bg2{
    border-radius: 24px;
    border: 2px dashed rgba(0, 0, 0, 0.10);
    background: #FFFFFF10;
  }
</style>
