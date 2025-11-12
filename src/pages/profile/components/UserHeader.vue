<template>
  <view class="relative flex flex-col">
    <!-- <image
      src="/static/images/user/h_bg.png"
      mode="widthFix"
      class="w-full h-[200rpx] absolute top-[-88rpx]"
    ></image> -->
    <view class="relative z-10 flex flex-row items-center py-[32rpx]">
      <image
        class="flex-shrink-0 w-[128rpx] h-[128rpx] rounded-full"
        src="/static/images/user/logo.png"
        mode="widthFix"
      ></image>
      <view class="grow flex flex-col ml-[20rpx] mt-[8rpx]">
        <view class="flex flex-row items-center font-bold">
          <text class="text-[30rpx] text-white">{{
            showData ? (userInfo.isreal ? userInfo.realname : "未实名") : "***"
          }}</text>
          <text v-if="userInfo.show_mobile_switch && showData" class="max-w-[330rpx] truncate ml-[12rpx] text-lg text-white/80">{{
            userInfo.mobile
          }}</text>
          <view @click="handleShowData" class="ml-[12rpx]">
            <uv-icon
              v-if="showData"
              name="eye"
              color="#fff"
              size="38rpx"
            ></uv-icon>
            <uv-icon
              v-else
              name="eye-off-outline"
              color="#fff"
              size="38rpx"
            ></uv-icon>
          </view>
        </view>
        <view class="mt-[8rpx] flex flex-row items-center min-w-[125rpx]">
          <text
            class="pr-[16rpx] leading-5 text-center rounded-[16rpx] text-sm text-white whitespace-nowrap"
            >ID:{{ showData ? userInfo.invicode : maskInviteCode(userInfo.invicode) }}</text
          >
          
        </view>
        <view
            class="flex flex-row items-center"
            @click="$emit('onTips', 2)"
            v-if="openCards > 0 && userInfo.become_agent_switch == 1"
          >
          <view class="flex flex-row items-center rounded-[108rpx] bg-black/10 py-[4rpx] px-[8rpx]">
            <text
              class="mr-[4rpx] text-sm leading-5 text-white/80 whitespace-nowrap"
              >{{ userInfo.agentname }}</text
            >
            <uv-icon
              size="24rpx"
              color="#9AEEDE"
              name="question-circle"
            ></uv-icon>
          </view>
            
            <view
                v-if="openCards > 0"
                class="flex flex-row items-center ml-[10rpx] rounded-[108rpx] bg-black/10 py-[4rpx] px-[8rpx]"
                @click="$emit('onTips', 10)"
              >
                <text
                  class="mr-[4rpx] text-sm leading-5 text-white/80 whitespace-nowrap"
                  >{{ userInfo.teams }}</text
                >
                <uv-icon
                  size="24rpx"
                  color="#9AEEDE"
                  name="question-circle"
                ></uv-icon>
            </view>
          </view>
      </view>
      <!-- <view
        @click="$emit('onCheckIn')"
        class="flex flex-row items-center rounded-full z-20"
      >
        <image
          class="w-[70rpx] h-[70rpx] rounded-[8rpx]"
          src="/static/images/profile/check_icon.svg"
          mode="widthFix"
        ></image>
      </view> -->
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  },
  openCards: {
    type: Number,
    default: 0
  }
})
const showData = ref(false);
const handleShowData = () => {
  showData.value = !showData.value;
};

// 脱敏显示邀请码
const maskInviteCode = (code) => {
  if (!code) return '***';
  if (code.length <= 4) return '***';
  return code.substring(0, 2) + '***' + code.substring(code.length - 2);
};
defineEmits(['onTips', 'onCheckIn'])
</script> 