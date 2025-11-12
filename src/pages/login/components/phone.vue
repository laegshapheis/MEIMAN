<template>
  <view class="pb-[32rpx]">
    <CommonForm
      :fields="loginFormConfig.fields"
      :submitButtonText="loginFormConfig.submitButtonText"
      @submit="handleLogin"
    >
      <template v-slot:formBottom>
        <view class="flex flex-row w-full items-center justify-end">
          <!-- <view class="text-whitetext-base underline" @click="jumpToPage(routes.register, 1)">
            注册
          </view> -->
          <text
            class="text-[#010101] text-base underline"
            @click="jumpToPage(routes.forgot)"
            >重置密码</text
          >
        </view>
      </template>
    </CommonForm>
    <!-- 验证码滑块 -->
    <slider-verify
      :username="mobile"
      :isShow="sliderVerifyFLag"
      @touchSliderResult="verifyResult"
      ref="verifyElement"
    ></slider-verify>
    <wk-modal ref="modal" title="忘记登录密码" :showConfirmButton="false">
      <view class="flex flex-col justify-center w-full">
        <view class="text-center mb-[60rpx] mt-[50rpx]">
          <text class="text-lg text-neutral-regular"
            >请选择修改登录密码方式</text
          >
        </view>
        <view class="flex-1 w-full">
          <wk-button
            v-if="hasPermission('miyao_switch')"
            class="mb-[28rpx]"
            @click="toPage(routes.forgot)"
          >
            使用密钥重置
          </wk-button>
          <view class="text-center mt-[24rpx]">
            <text
              class="text-neutral-theme text-base underline"
              @click="toPage(routes.service2)"
            >
              联系在线客服
            </text>
          </view>
        </view>
      </view>
    </wk-modal>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import CommonForm from "@/components/base/common-form.vue";
import { usePermissionStore } from "@/stores/permission";
import ValidateUtils from "@/utils/validate";
import { login } from "@/api/index";
import { routes } from "@/config/routes";
import { cacheManager } from "@/utils/cacheManager";

const { hasPermission } = usePermissionStore();
// 移动表单配置到组件外
const loginFormConfig = {
  fields: [
    {
      name: "username",
      type: "number",
      inputType: "tel",
      placeholder: "请输入手机号",
      icon: "/static/images/base/phone.svg",
      maxlength: 20,
      regexp: /^[^\d]/g,
    },
    {
      name: "password",
      type: "password",
      placeholder: "请输入登录密码",
      icon: "/static/images/base/password.svg",
      maxlength: 16,
      regexp: /[\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g,
    },
  ],
  submitButtonText: "登录",
};

const mobile = ref("");
const password = ref("");
const sliderVerifyFLag = ref(false);
const isLoading = ref(false);
const modal = ref(null);
const area_code = ref("");
// 表单验证函数
const validateLoginForm = (data) => {
  if (!data.code) {
    return "请选择区号";
  }
  if (!data.username) {
    return "请输入手机号码";
  }
  if (!data.password) {
    return "请输入登录密码";
  }
  if (!ValidateUtils.isPasswordValid(data.password)) {
    return "密码格式错误，请重新输入";
  }
  return null;
};

const handleLogin = (data) => {
  mobile.value = data.username;
  password.value = data.password;
  area_code.value = data.code;
  const error = validateLoginForm(data);
  if (error) {
    uni.$showToast({
      title: error,
      duration: 3000,
      icon: "none",
    });
    return;
  }

  if (hasPermission("captcha_switch")) {
    sliderVerifyFLag.value = true;
  } else {
    confirmLogin();
  }
};

const toPage = (url) => {
  uni.navigateTo({
    url: url,
  });
};

const jumpToPage = (url) => {
  // 密钥功能关闭，忘记密码跳转到联系客服
  if (!hasPermission("miyao_switch")) {
    uni.navigateTo({
      url: routes.service2,
    });
    return;
  }
  uni.navigateTo({
    url: url + "?type=0",
  });
};

const verifyResult = async (res, data) => {
  sliderVerifyFLag.value = false;
  if (res) {
    confirmLogin(data);
  } else {
    if (data) {
      uni.$showToast({
        title: data || "验证失败",
        duration: 3000,
        icon: "none",
      });
    }
  }
};

const confirmLogin = async (captcha_id) => {
  try {
    isLoading.value = true;
    const data = {
      username: mobile.value,
      password: password.value,
      lange: uni.getLocale(),
      captcha_id,
      area_code: area_code.value,
    };

    const res = await login(data);
    if (res.status === 0 && res.token) {
      await uni.setStorage({
        key: "app_token",
        data: res.token,
      });
      // 清除所有接口数据缓存
      cacheManager.clearAllCache();
      if (res.save_mi_yao === 1) {
        uni.switchTab({
          url: routes.index,
        });
      } else {
        uni.redirectTo({
          url: routes.miYao,
        });
      }
    } else if (res.status === 2) {
      uni.$showToast({
        title: res.msg,
        duration: 3000,
        icon: "none",
      });
      modal.value.open();
    } else {
      throw new Error(res.msg || "网络连接失败");
    }
  } catch (error) {
    uni.$showToast({
      title: error.message || "网络连接失败",
      duration: 3000,
      icon: "none",
    });
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  usePermissionStore().fetchPermissions();
});
</script>

<style lang="scss" scoped></style>
