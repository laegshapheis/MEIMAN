<template>
  <view class="relative z-20 rounded-[32rpx] vip-card-border-wrapper">
    <view
      class="relative rounded-[32rpx] bg-vip-card-bg border-[length: 0rpx] bg-no-repeat bg-contain bg-bottom box-border vip-card-inner"
    >
      <!-- <image
        src="/static/images/profile/vip_bg.png"
        mode="widthFix"
        class="w-[350rpx] h-[342rpx] absolute top-0 left-0"
      ></image> -->
      <!-- VIP等级 -->
       <view class="overflow-hidden pb-[32rpx] mx-[8rpx]">
      
      <view class="flex flex-row items-center mb-[35rpx] mt-[36rpx]">
        <image
          src="/static/images/profile/vipCard_icon.png"
          mode="widthFix"
          class="w-[80rpx] h-[32rpx] ml-[34rpx]"
        ></image>
        <!-- 查看会员详情按钮 -->
        <view
            class="bg-white/50 rounded-full px-[24rpx] py-[8rpx] self-start pt-[0rpx] ml-[8rpx]"
            @click="handleNavToMembershipLevel"
          >
            <text class="text-[#193168] text-sm">查看等级详情</text>
        </view>
      </view>
        
      <view
          class="absolute top-0 right-0 flex flex-row items-center justify-center  ml-[12rpx] text-neutral-regular px-[16rpx] py-[8rpx]"
          style="background: rgba(20, 132, 251, 0.66);border-radius: 0 12px 0 12px;backdrop-filter: blur(8px)"
          @click="$emit('onTips', 9)"
        >
          <image
            src="/static/images/profile/vip_icon.svg"
            mode="widthFix"
            class="w-[32rpx] h-[32rpx]"
          ></image>
          <text class="text-white text-sm font-medium mx-[8rpx]">{{
            userInfo.level
          }}</text>
          <uv-icon size="24rpx" color="#fff" name="question-circle"></uv-icon>
      </view>
    <!-- 成长值 -->
    <view
      class=" px-[34rpx] box-border rounded-[8rpx] flex flex-row justify-between"
    >
      <view class="flex flex-col justify-between flex-[2]">
        <view class="flex flex-row items-center justify-between mb-[10rpx]">
          <!-- <image
            src="/static/images/profile/vip_growth.png"
            mode="widthFix"
            class="w-[80rpx] h-[27rpx] absolute top-[32rpx] left-[32rpx]"
          ></image> -->
          <view class="text-base text-[#19316899]">会员成长值</view>
          <view class="flex flex-row items-center mt-[10rpx]">
            <text class="text-base text-[#193168] font-bold">{{
              userInfo.buymoney
            }}</text>
            <text class="text-base text-[#252C2F]/30 font-bold"
              >/{{ userInfo.serlfmoney }}</text
            >
          </view>
        </view>
        <view class="w-full">
          <uv-line-progress
            height="12rpx"
            :showText="false"
            :percentage="growthProgress"
            inactiveColor="rgba(255,255,255,0.30)"
            activeColor="#2935CC"
          ></uv-line-progress>
        </view>
      </view>
    </view>
    </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from "vue";
import { routes } from "@/config/routes";
import { vipIcons, teamIcons } from "@/pages/vip/data";

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(["onTips"]);

// 导航到会员等级页面
const handleNavToMembershipLevel = () => {
  uni.navigateTo({
    url: routes.membershipLevel
  });
};

const menus = computed(() => [
  {
    title: "VIP等级",
    redirect: routes.membershipLevel,
    type: 1,
    desc: props.userInfo.level,
    icon: vipIcons.find((item) => item.id === props.userInfo.levelid)?.icon,
    tip: 9,
  },
  // {
  //   title: "团队等级",
  //   icon: teamIcons.find((item) => item.id === props.userInfo.teams_levelid)
  //     ?.icon,
  //   switch: "team_level_entry_switch",
  //   redirect: routes.teamLevel,
  //   type: 1,
  //   desc: props.userInfo.teams,
  // },
]);

const growthProgress = computed(() => {
  const { buymoney, serlfmoney } = props.userInfo;
  if (!serlfmoney) return 0;
  return Math.min((buymoney / serlfmoney) * 100, 100);
});

const qualifiedProgress = computed(() => {
  const { number, selfnumber } = props.userInfo;
  if (!selfnumber) return 0;
  return Math.min((number / selfnumber) * 100, 100);
});
</script>

<style lang="scss" scoped>
.vip-level-bg {
  background: linear-gradient(90deg, #ebd0b1 0%, #d0a36e 100%);
}

.vip-card-border-wrapper {
  padding: 4rpx;
  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, #DAF1FF 100%);
}

.vip-card-inner {
  width: 100%;
  height: 100%;
}
</style>
