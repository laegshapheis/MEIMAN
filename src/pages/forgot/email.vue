<template>
  <layout navTitle="邮箱验证码" bgType="bg-main3">
    <template #navRight>
      <view class="rounded-full px-[24rpx] py-[8rpx]">
      <text
        v-if="countdown <= 0"
        @click="resendCode"
        class="text-base text-neutral"
        >重新发送</text
      >
    </view>
    </template>
    <view class="p-[32rpx]">
      <!-- <text class="text-2xl text-neutral font-semibold mb-[32rpx]"> 邮箱验证码</text> -->
      <view class="flex flex-row items-center mb-[32rpx] mt-[16rpx] justify-center">
        <text class="mr-[10rpx] text-base">验证码已发送到</text>
        <text class="text-lg font-bold">{{ email }}</text>
      </view>

      <view class="flex justify-center">
        <uv-code-input
          v-model="code"
          :maxlength="6"
          :bold="true"
          mode="box"
          size="46"
          :color="$colors.DEFAULT"
          focus
          :space="8"
          borderColor="rgba(0, 0, 0, 0.10)"
          @change="onChange"
        />
      </view>

      <view class="text-center mt-[48rpx] flex flex-col items-center">
        <text
          v-if="countdown > 0"
          class="text-base text-neutral font-bold"
          >{{ countdown }}秒后可重新发送</text
        >
        <text class="text-neutral text-base mt-[12rpx]"
          >没有收到验证码？还可重新发送验证码  <text class="text-neutral-theme font-bold">{{ remain_times }}</text> 次</text
        >
      </view>

      <view class="fixed bottom-0 left-0 right-0 bg-neutral-bottomBtnBg px-[32rpx] py-[16rpx]">
        <wk-button @submit="onSubmit">确认</wk-button>
      </view>
      <view 
      v-if="email_captcha_tips" class="p-[32rpx] bg-[#FFFFFF] text-[#252C2F] mt-8 rounded-[32rpx] text-base leading-normal">
        <text>{{ email_captcha_tips }}</text>
      </view>
    </view>
    <wk-loading v-if="loading" loading-text="发送中..." />
    <!-- 联系客服弹窗 -->
    <wk-modal ref="modal" :showConfirmButton="false">
      <view class="flex flex-col justify-center w-full">
        <view class="flex-1 w-full">
          <text>{{ errorMsg }}</text>
        </view>
        <view class="flex-1 w-full">
          <wk-button class="mt-[28rpx]" @submit="toPage(routes.service2)">
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
import { sendEmail as sendEmailApi, forgotPassword } from "@/api/index";
import { routes } from "@/config/routes";
import { usePermissionStore } from "@/stores/permission";
const { hasPermission } = usePermissionStore();
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

const email = ref("");
const code = ref("");
const email_captcha_tips = ref("");
const remain_times = ref(0);
const countdown = ref(0);
let timer = null;
const loading = ref(false);
const modal = ref(null);
const errorMsg = ref("");
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
  loading.value = true;
  try {
    const res = await forgotPassword({
      username: email.value,
      code: value,
      lange: uni.getLocale(),
      type: 2,
    });
    if (res.status == 0) {
      uni.redirectTo({
        url: routes.zhaoHuiSuccess + `?mi_ma=${res.mima}&tel=${email.value}&type=1`,
      });
    } else if (res.status == 2) {
      errorMsg.value = res.msg;
      modal.value.open();
    } else {
      throw new Error(res.msg || "重置失败");
    }
  } catch (error) {
    uni.$showToast({
      title: error.message,
      duration: 3000,
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};

const onChange = (value) => {
  code.value = value;
};

const sendEmail = async () => {
  if (loading.value) return;
  loading.value = true;
  const res = await sendEmailApi({
    from: "forgot",
    email: email.value,
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
    startCountdown();
  } else if (res.status == 1) {
    if (res.email_captcha_tips) email_captcha_tips.value = res.email_captcha_tips;
    if (res.remain_times) remain_times.value = res.remain_times;
    
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
    countdown.value = 0;
  } else if (res.status == 2) {
    errorMsg.value = res.msg;

    if (res.email_captcha_tips) email_captcha_tips.value = res.email_captcha_tips;
    if (res.remain_times) remain_times.value = res.remain_times;

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

onLoad((options) => {
  email.value = options.email || "";
  sendEmail();
});
</script>

<style lang="scss" scoped>
::v-deep .uv-code-input__item {
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.10);
}
</style>
