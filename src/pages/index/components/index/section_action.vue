<template>
  <view class="relative flex flex-col">
    <view class="flex flex-row justify-between h-[320rpx] gap-[32rpx]">
      <view
        @click="goToPath(routes.lottery)"
        class="box-border py-[24rpx] left-item-bg flex-1 flex-shrink-0 relative flex flex-col items-center h-full"
      >
        <image src="/static/images/index/invite_entry.png" class="flex-shrink-0 w-[96rpx] h-[120rpx]" mode="widthFix" />
        <view
          class="flex flex-col items-center justify-center w-full h-full mt-[24rpx]"
        >
          <text class="font-semibold text-base text-neutral">幸运大抽奖</text>
          <view
            class="flex items-center justify-center w-[88rpx] h-[56rpx] border border-white/20 border-solid text-sm text-neutral mt-[16rpx] rounded-full"
            >
            <uv-icon name="arrow-rightward" size="32rpx" :color="$colors.theme" />
            </view
          >
        </view>
      </view>
      <view class="flex flex-col items-center flex-1 gap-[24rpx] flex-shrink-0">
        <view
          v-for="item in rightList"
          :key="item"
          @click="goToPath(item.path, item.type)"
          class="px-[24rpx] h-[145rpx] item-bg box-border w-full flex flex-row relative items-center"
        >
          <image :src="item.icon" class="w-[96rpx] h-[96rpx] mr-[24rpx]" mode="widthFix" />
          <text class="font-semibold text-base text-neutral">{{ item.title }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { routes } from "@/config/routes";
import { ref, defineProps } from "vue";
import { useAuth } from "@/hooks/useAuth";

const props = defineProps({
  isAuth: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array,
    default: [],
  },
});
const { checkAuth } = useAuth();

const goToPath = (path, type = "navigateTo") => {
  console.log(props.isAuth, 3333);
  if (!props.isAuth) {
    checkAuth(true, false);
    return;
  }
  if (type === "switchTab") {
    uni.switchTab({
      url: path,
    });
  } else {
    uni.navigateTo({
      url: path,
    });
  }
};
const rightList = ref([
  {
    title: "邀请好友",
    icon: "/static/images/index/invite_icon.png",
    path: routes.inviteIndex,
  },
  {
    title: "每日签到",
    icon: "/static/images/index/sign_in_icon.png",
    path: routes.checkIn,
  },
]);
</script>

<style lang="scss" scoped>
.left-item-bg {
  border-radius: 24rpx;
  // border-top: 1px solid rgba(255, 255, 255, 0);
  background: linear-gradient(180deg, #72CBFF 0%, #216BE2 100%);
  // box-shadow: 0px 0px 8px 0px #489b6a inset;
}
.item-bg {
  border-radius: 24rpx;
  border: 0.5px solid #12478D;
  background: linear-gradient(115deg, #3C75D0 20.66%, #12478D 68.11%);
}
</style>
