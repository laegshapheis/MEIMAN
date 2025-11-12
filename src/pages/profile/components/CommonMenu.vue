<template>
  <view class="mt-[32rpx] flex flex-col justify-between bg-[#1A283D] 
  border border-[length:1rpx] border-solid border-[#FFFFFF]/20 rounded-[32rpx]">
    <view class="text-white text-xl px-[32rpx] py-[24rpx]" style="border-bottom: 1rpx solid #FFFFFF20;">
      <text>常用功能</text>
    </view>
    <view
      class="p-[16rpx] grid grid-flow-row-dense grid-cols-4 gap-x-[40rpx]"
    >
      <template v-for="item in menus" :key="item.icon_url">
        <view
          class="flex flex-col justify-center items-center"
          v-if="
            (!item.switch || (item.switch && userInfo[item.switch]))
          "
          @click="$emit('onNavTo', item)"
        >
          <view
            class="flex items-center justify-center w-[160rpx] mt-[32rpx]"
          >
          <view class="flex items-center w-[108rpx] h-[108rpx] justify-center rounded-full bg-[#FFFFFF]/5">
          <image
              class="w-[48rpx] h-[48rpx]"
              :src="item.icon_url"
              mode="widthFix"
            ></image>
          </view>
          </view>
          <text class="text-base leading-6 mt-[12rpx] text-white">{{
            item.title
          }}</text>
        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { routes } from "@/config/routes";
import { computed } from "vue";
const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({}),
  },
});
// 在组件内部定义常用功能菜单
const menus = computed(() => [
  {
    title: "账户详情",
    icon_url: "/static/images/profile/icon_v2/account_icon.svg",
    redirect: routes.accountDetails,
  },
  {
    title: "交易明细",
    icon_url: "/static/images/profile/icon_v2/zijing_icon.svg",
    redirect: routes.flowRecord,
  },
  {
    title: "投资制度",
    icon_url: "/static/images/profile/icon_v2/touzizhidu_icon.svg",
    redirect: routes.articleView + "?links=zhidu",
  },
  {
    title: "计算器",
    icon_url: "/static/images/profile/icon_v2/calc_icon.svg",
    redirect: routes.calc,
  },
  {
    title: "邀请好友",
    icon_url: "/static/images/profile/icon_v2/invite_icon.svg",
    redirect: routes.inviteIndex,
  },
  {
    title: "拼团记录",
    icon_url: "/static/images/profile/icon_v2/group_icon.svg",
    switch: "isgroup",
    redirect: routes.pinTuanJiLu,
  },
  {
    title: "无忧易贷",
    icon_url: "/static/images/profile/icon_v2/daikuan_icon.svg",
    switch: "isdaikuan",
    redirect: "/pages/dai_kuan/dai_kuan",
  },
  {
    title: "积分商城",
    icon_url: "/static/images/profile/icon_v2/market_icon.svg",
    switch: "market_switch",
    redirect: routes.storeList,
    // redirect: routes.exchangeLottery,
    key: "market",
  },

  // {
  //   title: "平台赠品",
  //   icon_url: "/static/images/profile/icon_v2/pingtaizengpin_icon.svg",
  //   switch: "market_switch",
  //   // redirect: routes.storeList,
  //   redirect: routes.exchangeLogs,
  //   key: "market",
  // },
  {
    title: "加息券",
    icon_url: "/static/images/profile/icon_v2/rate_coupon_icon.svg",
    redirect: routes.rateCoupon,
    switch: "coupon_switch",
  },
  {
    title: "代金券",
    icon_url: "/static/images/profile/icon_v2/cash_coupon_icon.svg",
    redirect: routes.cashCoupon,
    switch: "coupon_switch",
  },
  // {
  //   title: "VIP体验券",
  //   icon_url: "/static/images/profile/icon_v2/vip_experience_icon.svg",
  //   redirect: routes.vipExperienceCoupon,
  //   switch: "vip_coupon_switch",
  // },
  // {
  //   title: "常见问题",
  //   icon_url: "/static/images/profile/icon_v2/question_icon.svg",
  //   redirect: routes.articleInfo + "?id=1024",
  // },
  // {
  //   title: "券包",
  //   icon_url: "/static/images/profile/icon_v2/quanbao_icon.svg",
  //   redirect: routes.couponPackage,
  //   switch: "coupon_switch",
  // },
  {
    title: "知识学堂",
    icon_url: "/static/images/profile/icon_v2/xuetan_icon.svg",
    redirect: routes.indexGuide,
    switch: "isschool_switch",
  },
  // {
  //   title: "盲盒",
  //   icon_url: "/static/images/profile/icon_v2/box_icon.svg",
  //   redirect: routes.taskIndex,
  //   switch: "boxes_switch",
  // },
  {
    title: "幸运转盘",
    icon_url: "/static/images/profile/icon_v2/lucky_icon.svg",
    redirect: routes.lottery,
    switch: "lottery_switch",
  },
  {
    title: "任务奖励",
    icon_url: "/static/images/profile/icon_v2/task_reward_icon.svg",
    redirect: routes.taskRewards,
    switch: "task_module_switch",
  },
]);

defineEmits(["onNavTo"]);
</script>

<style scoped>
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
