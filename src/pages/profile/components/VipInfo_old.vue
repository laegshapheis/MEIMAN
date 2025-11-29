<template>
  <view
    class="relative z-20 rounded-[32rpx] border-[length: 0rpx] bg-[url('/static/images/profile/vip_bg.png')] bg-no-repeat bg-contain bg-bottom box-border"
  >
    <!-- <image
      src="/static/images/profile/vip_bg.png"
      mode="widthFix"
      class="w-[350rpx] h-[342rpx] absolute top-0 left-0"
    ></image> -->
    <!-- VIP等级 -->
     <view class="overflow-hidden bg-vip-card-bg mx-[8rpx] border border-[length:1rpx] border-solid border-[#FFFFFF] rounded-[32rpx]" style="backdrop-filter: blur(10px);border-top: 1rpx solid rgba(255, 255, 255, 0.26)">
      <image
        src="/static/images/profile/vipCard_icon.png"
        mode="widthFix"
        class="w-[64rpx] h-[48rpx] mb-[35rpx] ml-[34rpx] mt-[27rpx]"
      ></image>
      <view
          class="rounded-b-[24rpx] rounded-r-[0rpx] absolute top-0 right-0 flex flex-row items-center justify-center  ml-[12rpx] text-neutral-regular px-[16rpx] py-[8rpx]"
          style="background: rgba(20, 132, 251, 0.66);border-radius: 0 0 0 12px;backdrop-filter: blur(8px)"
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
        <view class="flex flex-col mb-[10rpx]">
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
      
      <view
        v-if="userInfo.selfnumber > 0"
        class="flex flex-col justify-between flex-1 ml-[24rpx]"
      >
        <view class="flex flex-col mb-[10rpx]">
          <view class="text-base text-[#19316899]">直推人数</view>
          <view class="flex flex-row items-center mt-[10rpx]">
            <text class="text-base text-[#193168] font-bold">{{
              userInfo.number
            }}</text>
            <text class="text-base text-[#252C2F]/30 font-bold"
              >/{{ userInfo.selfnumber }}</text
            >
          </view>
        </view>
        <view class="w-full">
          <uv-line-progress
            height="12rpx"
            :showText="false"
            :percentage="qualifiedProgress"
            inactiveColor="rgba(255,255,255,0.30)"
            activeColor="#2935CC"
          ></uv-line-progress>
        </view>
      </view>
    </view>
    <view class="w-full h-[1rpx] mt-[70rpx]"></view>
    </view>
    <view class="mt-[-35rpx]">
    <!-- 其他菜单 -->
    <view class="flex flex-row justify-center gap-[24rpx] p-[16rpx] rounded-[32rpx]" style="background: #fff;backdrop-filter: blur(10px);">
      <template v-for="item in menus" :key="item.title">
        <view
          class="px-[24rpx] py-[16rpx] rounded-[16rpx] flex-1 bg-[#F9F3E9]"
        >
          <view
            @click="$emit('onNavTo', item)"
            class="flex flex-row items-center justify-between"
          >
            <view class="flex flex-row items-center mr-[20rpx]">
              <image
                :src="item.icon"
                mode="widthFix"
                class="w-[40rpx] h-[40rpx]"
              ></image>
              <text
                class="text-base font-medium ml-[8rpx] text-neutral"
                >{{ item.title }}</text
              >
            </view>
            <uv-icon name="arrow-right" size="23rpx" :color="$colors.DEFAULT"></uv-icon>
          </view>
        </view>
      </template>
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

defineEmits(["onTips", "onNavTo"]);

const menus = computed(() => [
  {
    title: "VIP等级",
    redirect: routes.membershipLevel,
    type: 1,
    desc: props.userInfo.level,
    icon: vipIcons.find((item) => item.id === props.userInfo.levelid)?.icon,
    tip: 9,
  },
  {
    title: "团队等级",
    icon: teamIcons.find((item) => item.id === props.userInfo.teams_levelid)
      ?.icon,
    switch: "team_level_entry_switch",
    redirect: routes.teamLevel,
    type: 1,
    desc: props.userInfo.teams,
  },
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
</style>
