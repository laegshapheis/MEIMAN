<template>
    <view 
    class="bg-grey fixed inset-0 z-100 w-full h-full flex flex-col items-center justify-center">
      <image class="w-full h-full absolute inset-0" mode="aspectFill" src="/static/images/index/launch.png"></image>
      <view class="mt-[200rpx] bg-black/50 relative z-10 flex flex-col items-center justify-center w-[320rpx] h-[320rpx] rounded-[16rpx]">
        <uv-loading-icon size="24" color="#fff"></uv-loading-icon>
        <text class="text-base text-white mt-[20rpx]">网络环境安全检测中...</text>
        <text class="text-base text-white mt-[20rpx]">{{ count }}s</text>
    </view>
    </view>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { onLoad } from "@dcloudio/uni-app";
  import { routes } from "@/config/routes";
  import useNetwork from "@/hooks/useNetwork";
  import config from "@/config/index";
  import { logger } from "@/utils/logger";
  const { apiUrlList, jsonUrlList } = config;
  const isApiAvailable = ref(false)
  const isCheckNetworkFinish= ref(false)
  const count = ref(15)
  const finished = ref(false);
  const { checkNetwork } = useNetwork({
    apiUrlList,
    jsonUrlList,
    onSuccess: (url, logs) => {
      isApiAvailable.value = true
      isCheckNetworkFinish.value = true
      handleImageLoaded()
      logs && logger(JSON.stringify(logs), "info");
    },
    onFailure: (type, logs) => {
      if (type != 0) {
        isApiAvailable.value = false
        isCheckNetworkFinish.value = true
        handleImageLoaded()
        logs && logger(JSON.stringify(logs), "info");
      } else {
        setTimeout(() => {
          checkNetwork()
        }, 1000);
      }
    }
  });
  
  const handleImageLoaded = () => {
    if (isCheckNetworkFinish.value) {
      if (isApiAvailable.value) {
        goHome()
        finished.value = true;
      } else {
        uni.navigateTo({
          url: routes.service2
        })
      }
    }
  }
  
  const goHome = () => {
      uni.getStorage({
      key: "app_token",
      success: function (res) {
        uni.switchTab({
          url: routes.index
        })
      },
      fail: function (res) {
        uni.redirectTo({
          url :routes.login
        })
      }
    });
  };
  
  // Simple countdown logic - only for display
  const startCountdown = () => {
    count.value = 15;
    const timer = setInterval(() => {
      count.value--
      if (count.value < 0) {
        clearInterval(timer)
        if (!finished.value) {
          startCountdown()
        }
      }
    }, 1000)
  }
  
  onLoad(() => {
    checkNetwork()
    startCountdown()
  })
  </script>
  
  