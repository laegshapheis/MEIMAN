<template>
  <layout navTitle="邮箱验证码" bgType="bg-main">
    <template #navRight>
      <text
        v-if="countdown <= 0"
        @click="resendCode"
        class="text-base text-neutral"
        >重新发送</text
      >
    </template>
    <view class="p-[32rpx]">
      <view class="flex flex-col mb-[32rpx] text-center">
        <text class="mb-[8rpx] text-base text-neutral">验证码已发送到</text>
        <text class="text-neutral text-lg">{{ email }}</text>
      </view>

      <view class="flex justify-center px-5">
        <uv-code-input
          v-model="code"
          :maxlength="6"
          :bold="true"
          mode="box"
          size="46"
          focus
          :color="$colors.DEFAULT"
          borderColor="rgba(0, 0, 0, 0.10)" 
          :space="10"
          @change="onChange"
        />
      </view>

      <view class="mt-[48rpx] flex flex-col text-center">
        <text
          v-if="countdown > 0"
          class="text-base text-neutral font-bold"
          > <text class="text-neutral-theme mr-1">{{ countdown }}</text>秒后可重新发送</text
        >
        <text class="text-neutral text-base mt-[16rpx]"
          >没有收到验证码？还可重新发送验证码 <text class="text-neutral-theme font-bold text-base">{{ remain_times }}</text> 次</text
        >
      </view>

      <view class="fixed bottom-0 left-0 right-0 bg-neutral-bottomBtnBg px-[32rpx] py-[16rpx]">
        <wk-button @submit="onSubmit">确认</wk-button>
      </view>
      <view 
      v-if="email_captcha_tips" class="text-neutral-regular p-[32rpx] border border-solid border-neutral-theme mt-8 rounded-[32rpx] text-base leading-normal">
        <text>{{ email_captcha_tips }}</text>
      </view>
    </view>
    <wk-loading v-if="loading" />
    <!-- 联系客服弹窗 -->
    <wk-modal ref="modal" :showConfirmButton="false">
      <view class="flex flex-col justify-center w-full">
        <view class="flex-1 w-full">
          <wk-button class="mb-[28rpx]" @submit="toPage(routes.service2)">
            {{ $t("login.contactService") }}
          </wk-button>
        </view>
      </view>
    </wk-modal>
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useRegisterStore } from "@/stores/registerStore";
import { register, sendEmail as sendEmailApi } from "@/api/index";
import { routes } from "@/config/routes";
import { usePermissionStore } from "@/stores/permission";
const { hasPermission } = usePermissionStore();
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

const registerStore = useRegisterStore();
registerStore.loadFromStorage();

const email = ref(registerStore.email);
const code = ref("");
const email_captcha_tips = ref("");
const remain_times = ref(0);
const countdown = ref(0);
let timer = null;
const loading = ref(false);
const modal = ref(null);
const captcha = ref(null);
const toPage = (url) => {
  uni.navigateTo({
    url: url,
  });
};
const onSubmit = () => {
  if (code.value.length !== 6) {
    uni.$showToast({
      title: "请输入6位验证码",
      duration: 3000,
      icon: "none",
    });
    return;
  }
  onFinish(code.value);
};
const onFinish = async (value) => {
  const registerData = registerStore.$state;
  if (loading.value) return;
  loading.value = true;
  const res = await register({
    email: registerData.email,
    password: registerData.password,
    captcha_id: registerData.captcha_id,
    ckey: registerData.ckey,
    code: value,
    yaoqingren: registerData.yaoqingren,
    clientid: uni.getStorageSync("clientid"),
    lange: uni.getLocale(),
    type: 2,
  });
  loading.value = false;
  if (res.status == 0) {
    uni.setStorage({
      key: "last_login_username",
      data: email.value,
    });
    uni.setStorage({
      key: "app_token",
      data: res.token,
      success() {
        uni.redirectTo({
          url: routes.index,
        });
      },
    });
    registerStore.clearRegisterData();
  } else {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
    if (res.status == 2) {
      modal.value && modal.value.open();
    }
  }
};

const onChange = (value) => {
  code.value = value;
};

const sendEmail = async () => {
  if (loading.value) return;
  loading.value = true;
  const res = await sendEmailApi({
    from: "register",
    email: registerStore.email,
  });
  loading.value = false;
  if (res.status == 0) {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
    code.value = "";
    email_captcha_tips.value = res.email_captcha_tips;
    remain_times.value = res.remain_times;
    captcha.value = res.captcha;
    startCountdown();
    if (captcha.value) {
      code.value = captcha.value;
      onSubmit();
    }
  } else if (res.status == 1) {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
    countdown.value = 0;
  } else if (res.status == 2) {
    setTimeout(() => {
      modal.value && modal.value.open();
    }, 0);
  }
};
const startCountdown = () => {
  clearInterval(timer);
  countdown.value = 60;
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

const resendCode = () => {
  if (countdown.value === 0) {
    sendEmail();
  }
};

onLoad(() => {
  // 如果没有注册数据，返回注册页
  if (!registerStore.email && !registerStore.mobile) {
    uni.redirectTo({
      url: routes.register,
    });
  }
  sendEmail();
});
</script>

<style lang="scss" scoped>
::v-deep .uv-code-input__item {
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: #fff;
}
</style>
