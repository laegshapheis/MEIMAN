<template>
  <view class="mt-[32rpx] flex flex-col justify-between bg-black px-[24rpx] py-[48rpx] rounded-[32rpx] shadow-[0_0_16px_0_#266AFF_inset]">
    <view class="text-neutral text-xl text-center">
      <text>安全中心</text>
    </view>
    <!-- <view class="w-full h-[0rpx] bg-black my-[24rpx]"></view> -->
    <view class="p-[16rpx] grid grid-flow-row-dense grid-cols-4 gap-x-[40rpx]">
      <template v-for="item in menus" :key="item.icon_url">
        <view class="flex flex-col justify-center items-center relative"
          v-if="!item.switch || (item.switch && userInfo[item.switch])" @click="$emit('onNavTo', item)">
          <view class="flex items-center justify-center w-[160rpx] mt-[32rpx]">
            <view class="flex items-center w-[96rpx] h-[96rpx] justify-center rounded-[24rpx] icon_bg">
              <image class="w-[48rpx] h-[48rpx]" :src="item.icon_url" mode="widthFix"></image>
            </view>
          </view>
          <text class="text-base leading-6 mt-[12rpx] text-neutral">{{
            item.title
            }}</text>
          <view v-if="item.key == 'app_version' && appNewVersion"
            class="absolute top-[25rpx] right-[5rpx] rounded-[10rpx] w-[10rpx] h-[10rpx] bg-[#ff0000]"></view>


        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { routes } from "@/config/routes";
import { ref } from "vue";

// 在组件内部定义安全中心菜单
const menus = ref([
  {
    title: "登录密码",
    icon_url: "/static/images/profile/icon_v2/mima_icon.svg",
    key: "passwd",
  },
  {
    title: "支付密码",
    icon_url: "/static/images/profile/icon_v2/zhifu_icon.svg",
    key: "pay_passwd",
  },
  {
    title: "实名认证",
    icon_url: "/static/images/profile/icon_v2/shiming_icon.svg",
    redirect: routes.certification,
    key: "realname",
  },
  {
    title: "提现管理",
    realname: 1,
    icon_url: "/static/images/profile/icon_v2/tixian_icon.svg",
    redirect: routes.wallet,
  },
  {
    title: "收货地址",
    icon_url: "/static/images/profile/icon_v2/address_icon.svg",
    redirect: routes.address + "?isChoice=1",
  },
  {
    title: "查看密钥",
    icon_url: "/static/images/profile/icon_v2/miyao_icon.svg",
    redirect: routes.passwordKey,
    key: "view_miyao",
    switch: "view_miyao_switch",
  },
  {
    title: "版本更新",
    key: "app_version",
    icon_url: "/static/images/profile/icon_v2/upgrade_icon.svg",
  },
  {
    title: "退出登录",
    key: "logout",
    icon_url: "/static/images/profile/icon_v2/logout_icon.svg",
  },
]);

defineProps({
  userInfo: {
    type: Object,
    default: () => ({}),
  },
  appNewVersion: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["onNavTo"]);
</script>

<style scoped>
  .icon_bg{
  background-image: url('/static/images/profile/icon_v2/icon_bg.png');
  background-size: 100% 100%;
}
.gradient-border-container {
  position: relative;
}

.gradient-border-container::before {
  content: '';
  position: absolute;
  top: -1rpx;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24rpx;
  padding: 2rpx;
  background: linear-gradient(to bottom, #7CC2FF 0%, #7CC2FF00 100%);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: xor;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  z-index: -1;
}
</style>
