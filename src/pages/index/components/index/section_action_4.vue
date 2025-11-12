<template>
  <view class="relative flex flex-col mt-[32rpx]">
    <view class="flex flex-row items-center flex-1 gap-[24rpx] flex-shrink-0">
      <view
        v-for="item in rightList"
        :key="item"
        @click="goToPath(item.path, item.type)"
        class="h-[192rpx] w-[224rpx] item-bg flex flex-col py-[16rpx] justify-center items-center rounded-[24rpx]"
        style="border: 1px solid rgba(255, 255, 255, 0.05);background: rgba(255, 255, 255, 0.05);backdrop-filter: blur(8px);"
      >
        <image :src="item.icon" class="w-[96rpx] h-[96rpx]" mode="heightFix" />
        <view class="text-[#FFFFFF] text-center mt-[16rpx]">
          <text class="font-[400] text-base" style="line-height: 44rpx;">{{ item.title }}</text>
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
    title: "学堂",
    icon: "/static/images/index/guide_home.png",
    path: routes.indexGuide,
    type: "navigateTo",
  },
  {
    title: "产品严选",
    icon: "/static/images/index/product_home.png",
    path: routes.productList,
    type: "switchTab",
  },
  {
    title: "幸运转盘",
    icon: "/static/images/index/qiandao_home.png",
    path: routes.lottery,
    type: "navigateTo",
  },
]);
</script>
