<template>
  <WalletCard
    v-if="isEmpty"
    :is-empty="true"
    icon="/static/images/profile/wallet_wechat_icon.svg"
    add-text="添加微信收款"
    @click="$emit('edit')"
    class="wechat-bg2"
  />
  <WalletCard
    v-else
    icon="/static/images/profile/wallet_wechat_icon.svg"
    :title="realName"
    :content="account"
    class="wechat-bg"
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
.wechat-bg {
  border-radius: 12px;
  border: 1px solid #dfe5f9;
  background: url("/static/images/user/wallet_wechat_bg_icon.svg") no-repeat
      right bottom/192rpx 192rpx,
    linear-gradient(92deg, #f3fff1 1.32%, #daffcd 97.3%);
}
.wechat-bg2{
    border-radius: 24px;
    border: 2px dashed rgba(0, 0, 0, 0.10);
    background: #FFFFFF10;
  }
</style>
