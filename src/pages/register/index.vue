<template>
    <layout navTitle="创建账号" bgType="bg-main">
      <!-- <template #navRight>
        <wk-language-selector color="#252C2F" plain />
      </template> -->
      <!-- <logo class="mt-[48rpx]"/> -->
       <wk-stroke-bg mode="img-card-big" class="mx-[32rpx] mt-[48rpx]">
        <view class="flex flex-col justify-center items-center px-[32rpx]">
          <text class="text-white text-2xl">
            欢迎创建你的账号
          </text>
          <text @click="toLogin" class="text-base mt-[16rpx] text-neutral-secondary">
            已有账号？<text class="text-neutral-theme text-base underline">去登录</text>
          </text>
        </view>
        <view class="box-border mt-[24rpx]">
          <wk-tabs
            v-if="registerMethod == 3"
            :list="tabs"
            mode="pill"
            @change="handleTabChange"
            :current="current"
            :scrollable="false"
          />
          <register
            class="mt-[24rpx]"
            v-if="
              (registerMethod == 3 && current == 0) ||
              (registerMethod == 1 && current == 0)
            "
          />
          <emailRegister
            class="mt-[24rpx]"
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
  import logo from "@/components/base/logo.vue";
  import register from "./components/phone.vue";
  import emailRegister from "./components/email.vue";
  import { routes } from "@/config/routes";
  import { onLoad } from "@dcloudio/uni-app";
  import { usePermissionStore } from "@/stores/permission";
  
  const permissionStore = usePermissionStore();
  
  const registerMethod = ref(0);
  const tabs = ref([]);
  
  watch(
    () => registerMethod.value,
    (newVal) => {
      const tabList = [];
      if (newVal == 1 || newVal == 3) {
        tabList.push({
          name: "手机号注册",
          value: 0,
        });
      }
      if (registerMethod.value == 2 || registerMethod.value == 3) {
        tabList.push({
          name: "邮箱账号注册",
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
  
  const handleTabChange = (item) => {
    current.value = item.index;
  };
  
  onLoad(async ({type}) => {
    await permissionStore.fetchPermissions();
    registerMethod.value = permissionStore.permissions.register_method;
    current.value = type || 0;
  });
  
  const toLogin = () => {
    uni.navigateTo({
      url: routes.login,
    });
  };
  </script>
  
  <style lang="scss" scoped></style>
  