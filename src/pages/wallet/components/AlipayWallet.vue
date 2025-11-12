<template>
  <WalletCard
    v-if="isEmpty"
    :is-empty="true"
    icon="/static/images/profile/wallet_alipay_icon.png"
    add-text="添加支付宝"
    @click="$emit('edit')"
    class="alipay-bg2"
  />
  <WalletCard
    v-else
    icon="/static/images/profile/wallet_alipay_icon.png"
    :title="realName"
    :content="account"
    class="alipay-bg"
  />
</template>

<script setup>
import WalletCard from "./WalletCard.vue";

defineProps({
  isEmpty: {
    type: Boolean,
    default: true,
  },
  realName: {
    type: String,
    default: "",
  },
  account: {
    type: String,
    default: "",
  },
});

defineEmits(["edit"]);
</script>

<style lang="scss" scoped>
.alipay-bg {
  border-radius: 12px;
  border: 1px solid #dfe5f9;
  background: url("/static/images/user/wallet_alipay_bg_icon.svg") no-repeat
      right bottom/192rpx 192rpx,
    linear-gradient(92deg, #f1f5ff 1.32%, #d0e4ff 97.3%);
}
.alipay-bg2{
    border-radius: 24px;
    border: 2px dashed rgba(0, 0, 0, 0.10);
    background: #FFFFFF10;
  }
</style>
