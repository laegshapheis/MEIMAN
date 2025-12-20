<template>
  <view class="pb-[32rpx]">
    <CommonForm :fields="rgFormConfig.fields" :submitButtonText="rgFormConfig.submitButtonText" @submit="handleRegister">
    </CommonForm>
    <view class="flex flex-row w-full items-center justify-center mt-[32rpx]">
        <view class="flex flex-row items-center justify-center">
          <uv-checkbox-group v-model="yhxy">
              <uv-checkbox name="1" label="" size="13" :activeColor="$colors.theme"></uv-checkbox>
          </uv-checkbox-group>
          <view class="text-sm flex flex-row items-center justify-center text-neutral">
            <text>阅读并同意</text>
            <text @click.stop="openxy(1)" class="text-neutral-theme underline">《用户服务协议》</text>
            <text>和</text>
            <text @click.stop="openxy(2)" class="text-neutral-theme underline">《隐私政策》 </text>
          </view>
        </view>
      </view>
    <!-- <view class="flex flex-row w-full items-center justify-center mt-[32rpx]">
      <text class="text-neutral-regular text-base">已有账号？</text>
      <text class="text-neutral-regular text-base" @click="toPage('login')">去登录</text>
    </view> -->
   <!-- 验证码滑块 -->
   <slider-verify
    :username="mobile"
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
import CommonForm from '@/components/base/common-form.vue';
import { usePermissionStore } from '@/stores/permission';
import { ref, onMounted } from 'vue';
import {register, getDanye } from '@/api/index';
import { routes } from '@/config/routes';
const { hasPermission } = usePermissionStore();
const phoneRegex = /^[^\d]/g;
const commonRegex = /[\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g;
const rgFormConfig = {
  fields: [
    { name: 'mobile', inputType: 'tel', type: 'number', placeholder: '请输入手机号', icon: '/static/images/base/phone.svg', maxlength: 20, regexp: phoneRegex },
    { name: 'mobile_2', inputType: 'tel', type: 'number', placeholder: '请再次输入手机号', icon: '/static/images/base/phone.svg', maxlength: 20, regexp: phoneRegex },
    { name: 'password', type: 'password', placeholder: '请输入密码', icon: '/static/images/base/password.svg', maxlength: 16, regexp: commonRegex },
    { name: 'password_new', type: 'password', placeholder: '请重输密码', icon: '/static/images/base/password.svg', maxlength: 16, regexp: commonRegex },
    { name: 'invitation_code', type: 'text', placeholder: '请输入邀请码(必填)', icon: '/static/images/base/invite.svg', maxlength: 8, regexp: commonRegex },
  ],
  submitButtonText: '注册',
};

const mobile = ref("");
const mobile_2 = ref("");
const password = ref("");
const password_new = ref("");
const invitation_code = ref("");
const issms_val = ref("");
const issms_state = ref(0); // 默认不开启
const n_ckey = ref("");
const sliderVerifyFLag = ref(false); // 滑块验证
const disallowedPasswords = ref([
  "aa123123", "aa123456", "aa168168", "aa123321", "aa112233",
  "aa000000", "aa111111", "aa222222", "aa333333", "qaz123123",
  "qaz123321", "qaz168168", "qwe168168", "qwe123123", "qwe123321",
  "a1234567", "a12345678", "a123456789", "asd168168", "asd123123",
  "asd123321", "asd112233", "asd123456", "zxc123123", "zxc123456",
  "zxc123321", "zxc168168"
]);
const loading = ref(false)
const strings = ref(null);
const popuptitle = ref("");
const yhxy = ref([]);
const wkPopupRef = ref(null);
const loadingFlag = ref(false);
const area_code = ref("");
const openxy = async (type) => {
  if (loadingFlag.value) return;
  loadingFlag.value = true;
  const res = await getDanye({ id: type == 1 ? 61 : 62 });
  popuptitle.value = res.title;
  strings.value = res.article.ccontent;
  wkPopupRef.value.open();
  loadingFlag.value = false;
};

// 滑块验证结果回调函数
const verifyResult = async (res, data) => {
  sliderVerifyFLag.value = false;
  if (res) {
    confirmRegister(data);
  } else {
    if (data) {
      uni.$showToast({
        title: data || "验证失败",
      duration: 3000,
        icon: "none",
      });
    }
    console.error("验证失败");
  }
};

const toPage = (url) => {
  uni.redirectTo({
    url: url,
  });
};

const confirmRegister = async (captcha_id) => {
  loading.value = true;
  const res = await register({
    area_code: area_code.value,
    phone: mobile.value, // 手机号
    password: password.value, // 密码
    captcha_id, // 图形验证码
    ckey: n_ckey.value, // 图形验证码令牌
    yaoqingren: invitation_code.value, // 邀请码
    code: issms_val.value, // 短信验证码
    clientid: uni.getStorageSync("clientid"),
    lange: uni.getLocale(), // 语言
  });
  loading.value = false;
    if (res.status == 0) {
      uni.setStorage({
        key: "app_token",
        data: res.token,
        success() {
          if (hasPermission('miyao_switch')) {
            uni.redirectTo({
              url: routes.miYao,
            });
          } else {
            uni.redirectTo({
              url: routes.index,
            });
          }
        },
      });
    } else {
      uni.$showToast({
        title: res.msg,
        duration: 3000,
        icon: "none",
      });
    }
};
const isPasswordValid = (password) => {
    // 8-16位，支持字母数字混合或字母数字+符号，不允许空格和中文
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{}|;':",./<>?]{8,16}$/;
    return regex.test(password) && !/[\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/.test(password);
};

// 验证手机号码匹配规则
const verifyTel = (phoneNumber) => {
  const regex = /^[^\d]{1,20}$/;
  return regex.test(phoneNumber);
};

const handleRegister = (data) => {
  mobile.value = data.mobile || '';
  mobile_2.value = data.mobile_2 || '';
  password.value = data.password || '';
  password_new.value = data.password_new || '';
  invitation_code.value = data.invitation_code || '';
  area_code.value = data.code || '';
  if (!area_code.value) {
    uni.$showToast({
      title: "请选择区号",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (mobile.value === "") {
    uni.$showToast({
      title: "请输入手机号码",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  // if (!verifyTel(mobile.value)) {
  //   uni.$showToast({
  //     title: "请输入正确的手机号码",
  //     duration: 3000,
  //     icon: "none",
  //   });
  //   return;
  // }
  console.log(mobile.value, mobile_2.value);
  if (mobile.value !== mobile_2.value && issms_state.value !== 1) {
    uni.$showToast({
      title: "请确认两次手机号码输入正确",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (password.value === "") {
    uni.$showToast({
      title: '登录密码8~16位字符，且包含字母和数字，可包含符号',
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (!isPasswordValid(password.value)) {
    uni.$showToast({
      title: "确认密码8~16位字符，且包含字母及数字的组合，可包含符号",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (disallowedPasswords.value.includes(password.value)) {
    uni.$showToast({
      title: "您的密码过于简单，请重新输入",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (password.value !== password_new.value) {
    uni.$showToast({
      title: "请确认两次密码输入正确",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (password.value.length < 8 || password.value.length > 16) {
    uni.$showToast({
      title: '登录密码8~16位字符，且包含字母和数字，可包含符号',
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (invitation_code.value.length < 7) {
    uni.$showToast({
      title: '请输入正确的邀请码',
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (yhxy.value.indexOf('1') === -1) {
    uni.$showToast({
      title: "请勾选同意用户协议与隐私政策",
      duration: 3000,
      icon: "none",
    });
    return;
  }
  loading.value = false;
  // 判断是否需要验证码
  if (hasPermission('captcha_switch')) {
    sliderVerifyFLag.value = true;
  } else {
    confirmRegister();
  }
};

onMounted(() => {
});
</script>

<style lang="scss" scoped>
</style>
