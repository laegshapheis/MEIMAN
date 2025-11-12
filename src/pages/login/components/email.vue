<template>
  <view class="pb-[32rpx]">
    <view class="flex flex-col gap-[24rpx]">
      <!-- 邮箱输入框 -->
      <view class="relative z-20">
        <wk-email-input
          v-model="formData.username"
          placeholder="请输入邮箱号"
          style="border: none;"
          bgColor="#FFFFFF"
        />
      </view>
      <!-- 密码输入框 -->
      <view>
        <wk-password-input
          v-model="formData.password"
          placeholder="请输入密码"
          style="border: none;"
          bgColor="#FFFFFF"
        />
      </view>
      <!-- 底部链接 -->
      <view class="flex flex-row w-full items-center justify-end">
        <!-- <view
          class="text-whitetext-base underline"
          @click="jumpToPage(routes.register)"
        >
          注册
        </view> -->
        <text
          class="text-[#010101] text-base underline"
          @click="toPage(routes.forgotEmail + '?email=' + formData.username)"
        >
          重置密码
        </text>
      </view>
      <!-- 登录按钮 -->
      <wk-button class="mt-[8rpx]" size="large" @submit="handleLogin">
        登录
      </wk-button>
    </view>

    <!-- 验证码滑块 -->
    <slider-verify
      :username="formData.username"
      :isShow="sliderVerifyFLag"
      @touchSliderResult="verifyResult"
      ref="verifyElement"
    ></slider-verify>

    <!-- 重置密码弹窗 -->
    <wk-modal
      ref="modal"
      :title="$t('login.resetPasswordTitle')"
      :showConfirmButton="false"
    >
      <view class="flex flex-col justify-center w-full">
        <view class="text-center my-[32rpx]">
          <text class="text-lg text-neutral-regular">{{
            $t("login.chooseResetMethod")
          }}</text>
        </view>
        <view class="flex-1 w-full">
          <wk-button
            class="mb-[28rpx]"
            @click="toPage(routes.forgotEmail + '?email=' + formData.username)"
          >
            {{ $t("login.useKeyReset") }}
          </wk-button>
          <view class="text-center mt-[24rpx]">
            <text
              class="text-neutral-theme text-base underline mb-[28rpx]"
              @click="toPage(routes.service2)"
            >
              {{ $t("login.contactService") }}
            </text>
          </view>
        </view>
      </view>
    </wk-modal>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { usePermissionStore } from "@/stores/permission";
import ValidateUtils from "@/utils/validate2";
import { login, islogo } from "@/api/index";
import { routes } from "@/config/routes";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const { hasPermission } = usePermissionStore();

// 表单数据
const formData = reactive({
  username: uni.getStorageSync("last_login_username") || "",
  password: "",
});

const sliderVerifyFLag = ref(false);
const state = ref("0");
const register = ref("1");
const zhucetime = ref("");
const isLoading = ref(false);
const modal = ref(null);

// 表单验证函数
const validateLoginForm = (data) => {
  if (!data.username || !ValidateUtils.isEmail(data.username)) {
    return $t("login.invalidEmail");
  }
  if (!data.password) {
    return $t("login.inputPassword");
  }
  if (!ValidateUtils.isPasswordValid(data.password)) {
    return $t("login.invalidPassword");
  }
  return null;
};

const handleLogin = () => {
  const error = validateLoginForm(formData);
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

const getStatus = async () => {
  const res = await islogo();
  state.value = res.ispic;
  register.value = res.register;
  zhucetime.value = res.zhucetime;
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
  if (isLoading.value) return;
  try {
    isLoading.value = true;
    const data = {
      username: formData.username,
      password: formData.password,
      lange: uni.getLocale(),
      captcha_id,
      type: 2,
    };

    const res = await login(data);
    if (res.status === 0 && res.token) {
      // 保存用户名到本地存储
      await uni.setStorage({
        key: "last_login_username",
        data: formData.username,
      });
      await uni.setStorage({
        key: "app_token",
        data: res.token,
      });
      uni.switchTab({
        url: routes.index,
      });
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

// 获取上次登录的用户名
const getLastLoginUsername = async () => {
  try {
    const { data: username } = await uni.getStorage({
      key: "last_login_username",
    });
    console.log("username", username);
    if (username) {
      formData.username = username;
    }
  } catch (error) {
    console.log("No last login username found");
  }
};

onMounted(() => {
  getStatus();
  usePermissionStore().fetchPermissions();
  getLastLoginUsername();
});
</script>

<style lang="scss" scoped></style>
