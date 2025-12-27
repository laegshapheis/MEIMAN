<template>
  <view
    class="bg-black fixed inset-0 z-100 w-full h-full flex flex-col items-center justify-center"
  >
    <c-lottie
      style="transform: translate3d(0, 0, 0); will-change: transform"
      renderer="svg"
      class="absolute inset-0 m-auto"
      :isOnChange="true"
      ref="cLottieRef"
      :autoPlay="true"
      :data="lottieData"
      @LoopComplete="handleImageLoaded"
      width="750prx"
      height="1640rpx"
      :loop="false"
    ></c-lottie>
    <!-- <image class="w-full h-full absolute inset-0" mode="aspectFill" src="/static/images/index/launch.png"></image> -->
    <view
      style="top: 200rpx; border-radius: 32rpx;"
      class="relative z-10 flex flex-col items-center justify-center w-[320rpx] h-[320rpx]"
    >
      <uv-loading-icon size="24" color="#fff"></uv-loading-icon>
      <!-- <text class="text-base text-white mt-[50rpx]">网络环境安全检测中...</text> -->
      <!-- <text class="text-base text-white mt-[20rpx]">{{ count }}s</text> -->
    </view>
  </view>
</template>

<script setup>
import lottieData from "@/static/lottie/launch.json";
import { ref } from "vue";
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import useNetwork from "@/hooks/useNetwork";
import config from "@/config/index";
import { logger } from "@/utils/logger";
const { apiUrlList, jsonUrlList } = config;
const isApiAvailable = ref(false);
const isCheckNetworkFinish = ref(false);
const count = ref(15);
const cLottieRef = ref(null);
const finished = ref(false);
const { checkNetwork } = useNetwork({
  apiUrlList,
  jsonUrlList,
  onSuccess: (url, logs) => {
    isApiAvailable.value = true;
    isCheckNetworkFinish.value = true;
    handleImageLoaded();
    logs && logger(JSON.stringify(logs), "info");
  },
  onFailure: (type, logs) => {
    if (type != 0) {
      isApiAvailable.value = false;
      isCheckNetworkFinish.value = true;
      handleImageLoaded();
      logs && logger(JSON.stringify(logs), "info");
    } else {
      setTimeout(() => {
        checkNetwork();
      }, 1000);
    }
  },
});
const handleImageLoaded = () => {
  if (isCheckNetworkFinish.value) {
    if (isApiAvailable.value) {
      goHome();
      finished.value = true;
    } else {
      uni.navigateTo({
        url: routes.service2,
      });
    }
  }
};

const goHome = () => {
  uni.getStorage({
    key: "app_token",
    success: function (res) {
      uni.reLaunch({
        url: routes.home,
      });
    },
    fail: function (res) {
      uni.reLaunch({
        url: routes.login,
      });
    },
  });
};

const startCountdown = () => {
  count.value = 15;
  const timer = setInterval(() => {
    count.value--;
    if (count.value < 0) {
      clearInterval(timer);
      if (!finished.value) {
        startCountdown();
      }
    }
  }, 1000);
};

onLoad(() => {
  // checkNetwork()
  // startCountdown()
});

onUnload(() => {
  console.log("onUnload");
  if (cLottieRef.value) {
    cLottieRef.value.call("destroy");
    cLottieRef.value = null;
  }
});
</script>
