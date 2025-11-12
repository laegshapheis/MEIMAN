<template>
  <view class="relative flex flex-col px-[32rpx]">
    <view class="grid grid-cols-1">
      <template v-for="item in list" :key="item.title">
        <view
          @click="goToPath(item.path, item.type)"
          v-if="item.isShow"
          class="relative flex flex-col items-center justify-center mb-[8rpx]"
        >
          <view class="w-full h-[240rpx] aspect-video flex items-center justify-center">
            <image
              :src="item.icon"
              class="w-full full"
              mode="widthFix"
            />
          </view>
          <!-- <view class="flex flex-col items-center justify-center mt-[24rpx]">
            <text class="relative z-10 text-lg text-neutral">{{
            item.title
          }}</text>
          <text class="relative z-10 text-sm text-neutral">{{
            item.desc
          }}</text>
          </view> -->
        </view>
      </template>
    </view>
  </view>
</template>

<script setup>
import { routes } from "@/config/routes";
import { ref, computed } from "vue";
import { useAuth } from '@/hooks/useAuth'
const props = defineProps({
  isschool: {
    type: Number,
    default: 0,
  },
});
const { authStatus, checkAuth } = useAuth()

const goToPath = async (path, type = "navigateTo") => {
  if (authStatus.value !== 1) {
    const stat = await checkAuth()
    if (stat !== 1) {
      return
    }
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
const list = computed(() => [
  {
    title: "知识学堂",
    icon: "/static/images/index/guide_home.png",
    path: routes.indexGuide,
    isShow: props.isschool == 1,
  },
  {
    title: "产品严选",
    icon: "/static/images/index/product_home.png",
    path: routes.productList,
    type: "switchTab",
    isShow: true,
  },
  {
    title: "幸运转盘",
    icon: "/static/images/index/lottery_home.png",
    path: routes.lottery,
    isShow: true,
  },
]);
</script>

<style lang="scss" scoped>
</style>
