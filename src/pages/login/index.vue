<template>
  <layout :isNav="false" bgType="bg-main1">
    <view class="justify-end absolute top-0 right-0 mx-[24rpx] mt-[16rpx]">
      <wk-language-selector plain />
    </view>
    <logo class="mt-[136rpx]" />  
    <wk-stroke-bg mode="img-card" shadow borderRadius="24rpx" class="mx-[32rpx] mt-[48rpx]">
      <view class="flex flex-col justify-center items-center">
        <text class="text-neutral-regular text-3xl font-medium">
          登入你的账号
        </text>
        <text @click="toRegister" class="text-base mt-[16rpx]">
          没有账号？<text class="text-neutral-primary underline">创建账号</text>
        </text>
      </view>
      <view class="box-border mt-[48rpx]">
        <wk-tabs
          v-if="registerMethod == 3"
          mode="pill"
          class="mb-[24rpx]"
          :list="tabs"
          @change="handleTabChange"
          :current="current"
          :scrollable="false"
        />
        <login
          v-if="
            (registerMethod == 3 && current == 0) ||
            (registerMethod == 1 && current == 0)
          "
        />
        <emailLogin
          v-if="
            (registerMethod == 3 && current == 1) ||
            (registerMethod == 2 && current == 0)
          "
        />
      </view>
    </wk-stroke-bg>
  </layout>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import logo from "@/components/base/logo.vue";
import login from "./components/phone.vue";
import emailLogin from "./components/email.vue";
import { usePermissionStore } from "@/stores/permission";
import { routes } from "@/config/routes";
import { islogo } from "@/api/index";
import { getUserInfo } from "@/api/user";

const permissionStore = usePermissionStore();

const registerMethod = ref(0);
const tabs = ref([]);

watch(
  () => registerMethod.value,
  (newVal) => {
    const tabList = [];
    if (newVal == 1 || newVal == 3) {
    tabList.push({
      name: "手机号登录",
      value: 0,
    });
  }
  if (registerMethod.value == 2 || registerMethod.value == 3) {
    tabList.push({
      name: "邮箱账号登录",
      value: tabList.length,
    });
  }
    tabs.value = tabList;
  },
  {
    immediate: true,
  }
);  

const current = ref(0);
const register = ref("0");
const zhucetime = ref("0");
const getStatus = async () => {
  const res = await islogo();
  register.value = res.register;
  zhucetime.value = res.zhucetime;
};
const toRegister = () => {
  if (register.value == "0") {
    uni.$showToast({
      title: "注册开放时间为" + zhucetime.value,
      duration: 5000,
      icon: "none",
    });
    return;
  } else {
    uni.navigateTo({
      url: routes.register + '?type=' + current.value,
    });
  }
};
const handleTabChange = (item) => {
  current.value = item.index;
};

// 检查登录状态
const checkLoginStatus = async () => {
  const token = uni.getStorageSync("app_token");
  if (!token) {
    return false;
  }

  try {
    const res = await getUserInfo();
    if (res && res.status === 0) {
      return true;
    } else {
      uni.removeStorageSync("app_token");
      return false;
    }
  } catch (error) {
    uni.removeStorageSync("app_token");
    return false;
  }
};



onLoad(async () => {
  try {
    // 检查是否已经登录
    const isLoggedIn = await checkLoginStatus();

    if (isLoggedIn) {
      uni.redirectTo({
        url: routes.index,
        fail: () => {
          uni.redirectTo({
            url: routes.index
          });
        }
      });
      return;
    }

    // 未登录，继续显示登录页面
    await permissionStore.fetchPermissions();
    registerMethod.value = permissionStore.permissions.register_method;
    getStatus();
  } finally {
    uni.hideLoading();
  }
});
</script>

<style lang="scss" scoped></style>
