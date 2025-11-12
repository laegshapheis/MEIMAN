<template>
  <layout navTitle="重置登录密码" bgType="bg-main3">
    <!-- <template #navRight>
      <wk-language-selector color="#252C2F" plain />
    </template> -->
    <view class="flex flex-col mt-[64rpx]">
      <!-- <logo class="my-[48rpx]"/> -->
      <view class="px-[32rpx]">
        <CommonForm
          class="mb-[16rpx]"
          :fields="fields"
          :submitButtonText="formConfig.submitButtonText"
          @submit="subForgot"
        >
        </CommonForm>
        <wk-button v-if="isshow == 1" @submit="jumpWork" type="bg">
          联系在线客服
        </wk-button>
        <view v-if="is_success" class="mb-[16rpx]">
          <view class="flex flex-row justify-between items-center my-[20rpx]">
            <text class="">临时密码: {{ mima_str }}</text>
            <text
              class="p-[10rpx] bg-neutral-theme text-sm rounded-[10rpx] text-black"
              @click="savemima"
              >复制密码</text
            >
          </view>
          <text class="text-base"
            >成功登录后请立即到"个人中心"-”资料修改”处设置新的登陆密码,如有疑问请联系在线客服!</text
          >
          <wk-button @submit="jumpToPage('login')" class="mt-[30rpx]">
            立即登录
          </wk-button>
        </view>
      </view>
    </view>

    <!-- 验证码滑块 -->
    <slider-verify
      :username="mobile"
      :isShow="sliderVerifyFLag"
      @touchSliderResult="verifyResult"
      ref="verifyElement"
    ></slider-verify>
    <wk-loading v-if="loading" />
  </layout>
</template>

<script setup>
import logo from "@/components/base/logo.vue";
import CommonForm from "@/components/base/common-form.vue";
import { usePermissionStore } from "@/stores/permission";
import { ref, computed, watch } from "vue";
import { forgotPassword } from "@/api/index";
import validate from "@/utils/validate";
import { routes } from "@/config/routes";
import { storeToRefs } from "pinia";
const { hasPermission } = usePermissionStore();
const { permissions } = storeToRefs(usePermissionStore());
const phoneRegex = /^[^\d]/g;
const commonRegex = /[^\d]/g;
const fields = computed(() => [
  {
    inputType: 'tel',
    name: "mobile",
    type: "number",
    placeholder: "请输入手机号",
    icon: "/static/images/base/phone.svg",
    maxlength: 20,
    regexp: phoneRegex,
  },
  {
    name: "mobile_2",
    type: "number",
    inputType: "tel",
    placeholder: "请再次输入手机号",
    icon: "/static/images/base/phone.svg",
    maxlength: 20,
    regexp: phoneRegex,
  },
  {
    inputHidden: !(permissions.value.miyao_switch == 1),
    name: "miyao",
    type: "number",
    placeholder: "请输入12位密钥",
    icon: "/static/images/base/miyao.svg",
    maxlength: 12,
    regexp: commonRegex,
  },
]);
const formConfig = {
  submitButtonText: "重置登录密码",
};
const issms_val = ref("");
const issms_state = ref(0);
const mobile = ref("");
const n_ckey = ref("");
const mobile_2 = ref("");
const isshow = ref("0");
const miyao = ref("");
const is_success = ref(false);
const mima_str = ref("");
const sliderVerifyFLag = ref(false); // 滑块验证
const loading = ref(false);
const area_code = ref("");
// 滑块验证结果回调函数
const verifyResult = (res, data) => {
  sliderVerifyFLag.value = false;
  if (res) {
    console.warn("验证通过");
    confirmForgot(data);
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

const jumpToPage = (url) => {
  uni.redirectTo({
    url: url,
  });
};
// 确认重置
const confirmForgot = async (captcha_id) => {
  loading.value = true;
  const res = await forgotPassword({
    username: mobile.value,
    mobile: mobile_2.value,
    code: issms_val.value,
    captcha_id,
    ckey: n_ckey.value,
    miyao: miyao.value,
    lange: uni.getLocale(),
    area_code: area_code.value,
  });
  if (res.status == 0) {
    uni.navigateTo({
      url:
        routes.zhaoHuiSuccess + `?mi_ma=${res.mima}&tel=${mobile.value}&type=1`,
    });
    loading.value = false;
  } else if (res.status == 2) {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
      success() {
        loading.value = false;
        isshow.value = 1;
      },
    });
  } else {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
      success() {
        loading.value = false;
      },
    });
  }
};

const savemima = () => {
  let copyText = mima_str.value.toString();
  uni.setClipboardData({
    data: copyText,
    success: function () {},
  });
};
// 验证手机号码匹配规则
const verifyTel = (phoneNumber) => {
  const regex = /^1[3456789]\d{9}$/;
  return regex.test(phoneNumber);
};

// 提交重置请求
const subForgot = (data) => {
  mobile.value = data.mobile;
  mobile_2.value = data.mobile_2;
  miyao.value = data.miyao;
  area_code.value = data.code;
  if (!area_code.value) {
    uni.$showToast({
      title: "请选择区号",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (!mobile.value) {
    uni.$showToast({
      title: "请输入手机号码",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (mobile.value !== mobile_2.value && issms_state.value !== 1) {
    uni.$showToast({
      title: "请确认两次手机号码输入正确",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (hasPermission("miyao_switch")) {
    if (miyao.value === "") {
      uni.$showToast({
        title: "请输入密钥",
        duration: 3000,
        icon: "none",
      });
      return false;
    }
    if (!validate.isMiyaoValid(miyao.value)) {
      uni.$showToast({
        title: "密钥格式不正确，请重新输入！",
        duration: 3000,
        icon: "none",
      });
      return;
    }
  }
  // 判断是否需要验证码
  if (hasPermission("captcha_switch")) {
    sliderVerifyFLag.value = true;
  } else {
    confirmForgot();
  }
};

// 跳转到服务页
const jumpWork = () => {
  uni.navigateTo({
    url: routes.service2,
  });
};
</script>

<style lang="scss" scoped></style>
