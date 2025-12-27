<template>
  <layout
    :isNav="isShowGroup"
    navTitle="任务中心"
    :isNavLeftBackClick="false"
    @navLeftClick="handleBack"
    :isLottie="false"
  >
  <scroll-view
    class="bg-black fixed inset-0 flex flex-col items-center h-full w-full"
    scroll-y
  >
  <view class="relative w-full h-[1630rpx] overflow-hidden z-10">
      <c-lottie
        style="transform: translate3d(0, 0, 0); will-change: transform"
        class="absolute inset-0"
        renderer="svg"
        :data="lottieData"
        :loop="true"
        :autoPlay="true"
        ref="lottieRef"
        width="100%"
        height="1634rpx"
      ></c-lottie>
      <c-lottie
        style="transform: translate3d(0, 0, 0); will-change: transform"
        class="absolute bottom-[10rpx] left-10"
        renderer="svg"
        :data="centerStar"
        :loop="true"
        :autoPlay="true"
        ref="lottieRefCenterStar"
        width="100%"
        height="500rpx"
      ></c-lottie>
    </view>
    <view
      class="absolute z-10 flex flex-col items-center justify-center w-full h-full top-[var(--status-bar-height)]"
    >
      <template v-if="!isShowGroup">
        <view
          v-for="item in menuItems"
          :key="item.title"
          :class="[
            'flex flex-col items-center absolute z-50',
            item.positionClass,
          ]"
          @click="handleMenuClick(item)"
        >
          <view
            class="relative w-[204rpx] h-[204rpx] flex flex-col items-center justify-center"
          >
            <image
              :src="item.icon"
              class="absolute z-10 w-[144rpx] h-[144rpx]"
              mode="widthFix"
            ></image>
            <c-lottie
              style="transform: translate3d(0, 0, 0); will-change: transform"
              class="absolute inset-0"
              renderer="svg"
              :data="homeItemBg"
              :loop="true"
              :autoPlay="false"
              width="204rpx"
              height="204rpx"
            ></c-lottie>
          </view>
          <view class="relative mt-[-30rpx]">
            <c-lottie
              style="transform: translate3d(0, 0, 0); will-change: transform"
              renderer="svg"
              :data="homeItemBtn"
              :loop="true"
              :autoPlay="false"
              width="238rpx"
              height="54rpx"
            ></c-lottie>
            <text class="absolute inset-0 flex items-center justify-center font-medium text-base bar-text">{{
              item.title
            }}</text>
          </view>
        </view>
      </template>
      <!-- 任务中心 -->
      <template v-else>
        <view
          v-for="item in groupMenuItems"
          :key="item.title"
          :class="[
            'flex flex-col items-center absolute z-50',
            item.positionClass,
          ]"
          @click="handleMenuClick(item)"
        >
          <view
            class="relative w-[204rpx] h-[204rpx] flex flex-col items-center justify-center"
          >
            <image
              :src="item.icon"
              class="absolute z-10 w-[144rpx] h-[144rpx]"
              mode="widthFix"
            ></image>
            <c-lottie
              style="transform: translate3d(0, 0, 0); will-change: transform"
              class="absolute inset-0"
              renderer="svg"
              :data="homeItemBg"
              :loop="true"
              :autoPlay="true"
              width="204rpx"
              height="204rpx"
            ></c-lottie>
          </view>
          <view class="relative mt-[-30rpx]">
            <c-lottie
              style="transform: translate3d(0, 0, 0); will-change: transform"
              renderer="svg"
              :data="homeItemBtn"
              :loop="true"
              :autoPlay="true"
              width="238rpx"
              height="54rpx"
            ></c-lottie>
            <text class="absolute inset-0 flex items-center justify-center font-medium text-base bar-text">{{
              item.title
            }}</text>
          </view>
        </view>
      </template>
    </view>
  </scroll-view>
    <wk-modal ref="wkPopupRef" title="公告">
      <uv-parse
        :content="noticeText"
        container-style="white-space: pre-wrap"
      ></uv-parse>
    </wk-modal>
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { routes } from "@/config/routes";
import lottieData from "@/static/lottie/home_easy.json";
import centerStar from "@/static/lottie/centerStar.json";
import homeItemBg from "@/static/lottie/homeItemBg.json";
import homeItemBtn from "@/static/lottie/homeItemBtn.json";
import { getIndexData } from "@/api/index";
import { onShow, onHide, onUnload } from "@dcloudio/uni-app";
import { useAuth } from "@/hooks/useAuth";
import { useLottie } from "@/hooks/useLottie";
useLottie();
const lottieRef = ref(null);
const lottieRefCenterStar = ref(null);
const isNav = ref(false);
const isShowGroup = ref(false);
const menuItems = ref([
  {
    isAuth: true,
    icon: "/static/images/home/icon-1.png",
    title: "产品中心",
    path: routes.productList,
    positionClass: "top-[360rpx] left-1/2 transform -translate-x-1/2 animate-top-in",
  },
  {
    isAuth: true,
    icon: "/static/images/home/icon-7.png",
    title: "任务中心",
    type: "group",
    positionClass: "top-[650rpx] left-[0rpx] animate-left-in",
  },
  {
    isAuth: true,
    icon: "/static/images/home/icon-4.png",
    title: "关于美满",
    path: routes.about,
    positionClass: "top-[650rpx] right-[0rpx] animate-right-in",
  },
  {
    icon: "/static/images/home/icon-4.png",
    title: "新闻资讯",
    path: routes.newsList,
    positionClass: "top-[920rpx] left-[100rpx] animate-bottom-left-in",
  },
  {
    icon: "/static/images/home/icon-3.png",
    title: "个人中心",
    path: routes.profile,
    positionClass: "top-[920rpx] right-[100rpx] animate-bottom-right-in",
  },
]);

const groupMenuItems = ref([
  {
    icon: "/static/images/home/icon-10.png",
    title: "答题奖励",
    path: routes.dailyQuiz,
    positionClass: "top-[360rpx] left-1/2 transform -translate-x-1/2 animate-top-in",
  },
  {
    icon: "/static/images/home/icon-2.png",
    title: "任务奖励",
    path: '',
    positionClass: "top-[650rpx] left-[0rpx] animate-left-in",
  },
  {
    icon: "/static/images/home/icon-6.png",
    title: "每日签到",
    path: routes.checkIn,
    positionClass: "top-[650rpx] right-[0rpx] animate-right-in",
  },
]);

const wkPopupRef = ref(null);
const noticeText = ref("");
const noticeTitle = ref("");
const displayValue = ref(0);
const { authStatus, checkAuth } = useAuth();

const getIndexInfo = async () => {
  const res = await getIndexData();
  console.log(res);
  noticeText.value = res.gonggao?.ccontent;
  noticeTitle.value = res.gonggao?.title;
  // 显示公告
  if (!isShowGroup.value) {
    showGonggao(res);
  }
};
const showGonggao = (res) => {
  if (res.isggao !== 1) return;
  const gonggaoData = uni.getStorageSync("gonggao") || {};
  const appToken = uni.getStorageSync("app_token");
  const newGonggao = {
    token: appToken,
    id: res.gonggao.id,
    count: 1,
  };

  if (
    !gonggaoData.token ||
    gonggaoData.token !== appToken ||
    gonggaoData.id !== res.gonggao.id ||
    gonggaoData.count < res.gonggao.pop_count
  ) {
    wkPopupRef.value.open();
    // 只有在token和id都相同时才增加count
    if (gonggaoData.token === appToken && gonggaoData.id === res.gonggao.id) {
      newGonggao.count = gonggaoData.count + 1;
    }
    uni.setStorageSync("gonggao", newGonggao);
  }
};
const handleBack = () => {
  isShowGroup.value = false;
};
// 点击事件处理函数
const handleMenuClick = async (item) => {
  if (item.isAuth && authStatus.value != 1) {
    await checkAuth(false);
    return;
  }
  if (item.type === "group") {
    isShowGroup.value = true;
  } else {
    uni.navigateTo({
      url: item.path,
    });
  }
};

onShow(() => {
  getIndexInfo();
  if (authStatus.value != 1) {
    checkAuth(false, false);
  }
  if (lottieRefCenterStar.value) {
    lottieRefCenterStar.value.call("play");
  }
  if (lottieRef.value) {
    lottieRef.value.call("play");
  }
});

onHide(() => {
  if (lottieRef.value) {
    lottieRef.value.call("pause");
  }
  if (lottieRefCenterStar.value) {
    lottieRefCenterStar.value.call("pause");
  }
});

onUnload(() => {
  console.log("home onUnload");
  if (lottieRef.value) {
    lottieRef.value.call("destroy");
    lottieRef.value = null;
  }
  if (lottieRefCenterStar.value) {
    lottieRefCenterStar.value.call("destroy");
    lottieRefCenterStar.value = null;
  }
});
</script>

<style>
@keyframes leftIn {
  from {
    opacity: 0;
    transform: translateX(-200rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes topIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-200rpx);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes rightIn {
  from {
    opacity: 0;
    transform: translateX(200rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bottomLeftIn {
  from {
    opacity: 0;
    transform: translateX(-200rpx) translateY(200rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}

@keyframes bottomRightIn {
  from {
    opacity: 0;
    transform: translateX(200rpx) translateY(200rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}

@keyframes centerCircleIn {
  from {
    opacity: 0;
    transform: scale(0.3);
    z-index: -1;
  }
  to {
    opacity: 1;
    transform: scale(1);
    z-index: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.center-circle {
  animation: centerCircleIn 0.5s ease-out forwards;
}

.animate-left-in {
  animation: leftIn 0.5s ease-out forwards;
}

.animate-top-in {
  animation: topIn 0.5s ease-out forwards;
}

.animate-right-in {
  animation: rightIn 0.5s ease-out forwards;
}

.animate-bottom-left-in {
  animation: bottomLeftIn 0.5s ease-out forwards;
}

.animate-bottom-right-in {
  animation: bottomRightIn 0.5s ease-out forwards;
}

.animate-spin {
  animation: spin 5s linear infinite;
}

.bar-text {
  background: linear-gradient(0deg, #d9c0ff 0%, #fff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
