<template>
  <view class="pb-[32rpx]">
    <view class="flex flex-col gap-[24rpx]">
      <!-- 邮箱输入框 -->
      <view class="z-20 relative">
        <wk-email-input
          v-model="formData.email"
          style="border: none;border-radius: 32rpx;"
          :placeholder="$t('register.inputEmail')"
        />
      </view>

      <!-- 密码输入框 -->
      <view>
        <wk-password-input
          style="border: none;border-radius: 32rpx;"
          v-model="formData.password"
          :placeholder="$t('register.inputPassword')"
        />
      </view>

      <!-- 确认密码输入框 -->
      <view>
        <wk-password-input
          style="border: none;border-radius: 32rpx;"
          v-model="formData.confirmPassword"
          :placeholder="$t('register.reInputPassword')"
        />
      </view>

       <!-- 邀请码 -->
       <view>
        <wk-input
          v-model="formData.yaoqingren"
          style="border: none;border-radius: 32rpx;"
          maxlength="8"
          @input="handleInputInviteCode"
          :placeholder="$t('register.inputInviteCode')"
        >
          <template #prefix>
            <image src="/static/images/base/invite.svg" class="w-[40rpx] h-[40rpx] mr-[10rpx]"/>
          </template>
      </wk-input>
      </view>
      <!-- 注册按钮 -->
      <wk-button
        @submit="handleRegister"
      >
        {{ $t("register.registerBtn") }}
      </wk-button>
      <!-- 用户协议 -->
      <view class="flex flex-row w-full items-center justify-center mt-[16rpx]">
        <view class="flex flex-row items-center justify-center">
          <uv-checkbox-group v-model="userAgreement">
              <uv-checkbox :activeColor="$colors.theme" name="1" label="" size="13"></uv-checkbox>
          </uv-checkbox-group>
          <view class="text-sm flex flex-row items-center justify-center text-neutral-regular">
            <text>阅读并同意</text>
            <text @click.stop="openxy(1)" class="text-neutral-theme underline">{{ $t("register.userAgreement") }}</text>
            <text>和</text>
            <text @click.stop="openxy(2)" class="text-neutral-theme underline">{{ $t("register.privacyPolicy") }}</text>
          </view>
        </view>
      </view>

      <!-- 底部链接 -->
      <!-- <view
        class="text-neutral-regular text-base underline text-center mt-[8rpx]"
        @click="toPage(routes.login)"
      >
        {{ $t("register.hasAccount") }} {{ $t("register.goToLogin") }}
      </view> -->
    </view>

    <!-- 验证码滑块 -->
    <slider-verify
      :username="formData.email"
      :isShow="sliderVerifyFLag"
      @touchSliderResult="verifyResult"
      ref="verifyElement"
    ></slider-verify>
    <!-- 规则弹出层 -->
    <wk-modal ref="wkPopupRef" :title="popuptitle">
      <uv-parse
        :show-img-menu="false"
        space="nbsp"
        style="white-space: pre-wrap"
        :content="strings"
      ></uv-parse>
    </wk-modal>
    <wk-loading v-if="loading" />
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import ValidateUtils, { regexPatterns } from "@/utils/validate2";
import { register, getDanye } from "@/api/index";
import { routes } from "@/config/routes";
import { useI18n } from "vue-i18n";
import { usePermissionStore } from "@/stores/permission";
import { useRegisterStore } from "@/stores/registerStore";

const disallowedPasswords = ref([
  "aa123123", "aa123456", "aa168168", "aa123321", "aa112233",
  "aa000000", "aa111111", "aa222222", "aa333333", "qaz123123",
  "qaz123321", "qaz168168", "qwe168168", "qwe123123", "qwe123321",
  "a1234567", "a12345678", "a123456789", "asd168168", "asd123123",
  "asd123321", "asd112233", "asd123456", "zxc123123", "zxc123456",
  "zxc123321", "zxc168168"
]);
const { t: $t } = useI18n();
const { hasPermission } = usePermissionStore();
const registerStore = useRegisterStore();

const userAgreement = ref([]);
// 表单数据
const formData = reactive({
  email: "",
  password: "",
  confirmPassword: "",
  yaoqingren: ""
});

const sliderVerifyFLag = ref(false);
const isLoading = ref(false);
const loading = ref(false);
const strings = ref(null);
const popuptitle = ref("");
const wkPopupRef = ref(null);
const loadingFlag = ref(false);

// 表单验证函数
const validateRegisterForm = (data) => {
  if (!data.email) {
    return $t("register.inputEmail");
  }
  if (!ValidateUtils.isEmail(data.email)) {
    return $t("register.invalidEmail");
  }
  if (!data.password) {
    return $t("register.inputPassword");
  }
  if (!ValidateUtils.isPasswordValid(data.password)) {
    return $t("register.invalidPassword");
  }
  if (disallowedPasswords.value.includes(data.password)) {
    return '您的密码过于简单，请重新输入';
  }
  if (!data.confirmPassword) {
    return $t("register.reInputPassword");
  }
  if (data.password !== data.confirmPassword) {
    return $t("register.passwordNotMatch");
  }
  if (data.yaoqingren.length < 7) {
    return '请输入正确的邀请码';
  }
  if (userAgreement.value.indexOf("1") == -1) {
    return '请勾选同意用户协议与隐私政策';
  }
  return null;
};

const handleInputInviteCode = (value) => {
  setTimeout(() => {
    formData.yaoqingren = value.replace(regexPatterns.noSpecialCharacters, '');
  }, 0);
};

const handleRegister = () => {
  const error = validateRegisterForm(formData);
  if (error) {
    uni.$showToast({
      title: error,
      duration: 3000,
      icon: "none",
    });
    return;
  }
  // 判断是否需要图形验证码
  if (hasPermission('captcha_switch')) {
    sliderVerifyFLag.value = true;
  } else {
    confirmRegister();
  }
};

const verifyResult = async (res, captcha_id) => {
  sliderVerifyFLag.value = false;
  if (res) {
    confirmRegister(captcha_id);
  } else {
    if (captcha_id) {
      uni.$showToast({
        title: captcha_id || "验证失败",
        duration: 3000,
        icon: "none",
      });
    }
  }
};

const confirmRegister = async (captcha_id) => {
  if (loading.value) return;
  loading.value = true;
  const data = {
    email: formData.email,
    password: formData.password,
    captcha_id,
    yaoqingren: formData.yaoqingren,
    lange: uni.getLocale(),
    type: 2
  };
  await registerStore.setRegisterData(data);
  uni.navigateTo({
    url: routes.emailCode
  });
  loading.value = false;
};

const toPage = (url) => {
  uni.navigateTo({
    url: url
  });
};

const openxy = async (type) => {
  if (loading.value) return;
  loading.value = true;
  const res = await getDanye({ id: type == 1 ? 61 : 62 });
  popuptitle.value = res.title;
  strings.value = res.article.ccontent;
  wkPopupRef.value.open();
  loading.value = false;
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
</style>
