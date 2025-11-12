<template>
  <layout
    :isNav="false"
    ref="layoutRef"
    :refresher="false"
    bgType="bg-main2"
  >
  <view
    class="relative gap-[34rpx] flex flex-col w-full relative"
  >
    <image class="w-[604rpx] ml-[-15rpx] mt-[26rpx]" src="/static/images/services/service_title.png" mode="widthFix" />
    <view class="w-[90%] rounded-[8rpx] m-[auto]" v-for="(item, index) in functionList" :key="index">
      <image class="w-full" :src="item.icon" mode="widthFix" @click="navTo(item.type)"/>
    </view>
  </view>
  </layout>
</template>

<script setup>
import { navigateTo } from "@/utils/navigation";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";

const { authStatus, checkAuth } = useAuth();

const functionList = [
  {
    icon: "/static/images/services/service_1.png",
    type: 1
  },
  {
   icon: "/static/images/services/service_2.png",
    type: 2
  },
  {
    icon: "/static/images/services/service_3.png",
    type: 3
  },
  {
    icon: "/static/images/services/service_4.png",
    type: 4
  },
];

const navTo = (type) => {
  if (authStatus.value !== 1 && type !== 4) {
    checkAuth(true, false);
    return;
  }
  switch (type) {
    case 1:
    navigateTo(routes.checkIn)
      break;
    case 2:
    navigateTo(routes.storeList)
      break;
    case 3:
      navigateTo(routes.lottery)
        break;
    case 4:
      uni.switchTab({
        url: routes.service,
      });
        break;
    default:
      break;
  }
};
</script>

<style lang="scss" scoped></style>