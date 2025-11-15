<template>
    <layout navTitle="重置登录密码" bgType="bg-main" >
      <view class="px-[32rpx]">
        <view class="px-0 pt-[16rpx]" bgColor="">
          <view>
            
            <!-- 邮箱输入框 -->
            <view class="text-base mb-[12rpx] text-neutral">邮箱号</view>
            <view 
              class="flex flex-row items-center justify-between">
            
              <wk-email-input
                leftIcon=""
                v-model="formData.email_mask"
                placeholder="请输入邮箱"
                style="border: none;border-radius: 720rpx;"
                readonly
                class="w-full"
              />
            </view>
  
            <!-- 验证码输入框 -->
            <view
              class="flex flex-row items-center mb-[12rpx] mt-[24rpx] justify-between"
            >
              <text class="text-base text-neutral">验证码</text>
              <text
                class="text-neutral-regular text-base cursor-pointer"
                @click="sendEmailCode"
                v-if="countdown === 0"
                >发送验证码</text
              >
              <text class="text-neutral text-base" v-else
                >{{ countdown }}秒后重新发送</text
              >
            </view>
            <view 
          class="flex flex-row items-center justify-between">
        
          <wk-input
            class="flex-1"
            v-model="formData.code"
            type="number"
            placeholder="请输入验证码"
            :maxlength="6"
            leftIcon="/static/images/base/verify.svg"
            style="border: none;border-radius: 720rpx;"
          />
        </view>
          </view>
          <view class="mt-[24rpx]">
            <view class="mb-[10rpx] text-base text-neutral font-medium"
              >新的密码</view
            >
            <view 
          class="flex flex-row items-center justify-between">
        
          <wk-input
            type="password"
            @input="(val) => passKey(val, 'b')"
            v-model="new_password"
            maxlength="16"
            leftIcon=""
            placeholder="请输入新登录密码"
            style="border: none;border-radius: 720rpx;"
          ></wk-input>
        </view>
          </view>
          <view class="mt-[24rpx]">
            <view class="mb-[10rpx] text-base text-neutral font-medium"
              >确认密码</view
            >
            <view 
          class="flex flex-row items-center justify-between">
        
          <wk-input
            type="password"
            @input="(val) => passKey(val, 'c')"
            v-model="password"
            maxlength="16"
            placeholder="请输入确认密码"
            leftIcon=""
            style="border: none;border-radius: 720rpx;"
          ></wk-input>
        </view>
          </view>
        </view>
        <view
          class="fixed bottom-0 left-0 right-0 bg-neutral-bottomBtnBg px-[32rpx] py-[16rpx]"
        >
          <wk-button @submit="setNewPassword"> 完成修改 </wk-button>
        </view>
      </view>
      <!-- 联系客服弹窗 -->
      <wk-modal ref="modal" :showConfirmButton="false">
        <view class="flex flex-col justify-center w-full">
          <view class="flex-1 w-full">
            <text class="text-base mb-[28rpx]">{{ errorMsg }}</text>
            <wk-button class="mb-[28rpx] mt-[28rpx]" @submit="jumpWork">
              {{ $t("login.contactService") }}
            </wk-button>
          </view>
        </view>
      </wk-modal>
      <wk-loading v-if="loading" :loadingText="loadingText" />
    </layout>
  </template>
  
  <script setup>
  import { ref, reactive } from "vue";
  import { routes } from "@/config/routes";
  import { updatePassword } from "@/api/user";
  import { sendEmail as sendEmailCodeApi } from "@/api/index";
  import validate from "@/utils/validate";
  import { useI18n } from "vue-i18n";
  
  const { t: $t } = useI18n();
  // 表单数据
  const formData = reactive({
    email: uni.getStorageSync("last_login_username") || "",
    email_mask: uni.getStorageSync("mobile") || "",
    code: "",
  });
  
  const new_password = ref("");
  const password = ref("");
  const loading = ref(false);
  const loadingText = ref("");
  const countdown = ref(0);
  const modal = ref(null);
  const errorMsg = ref("");
  let timer = null;
  
  const disallowedPasswords = reactive([
    "aa123123",
    "aa123456",
    "aa168168",
    "aa123321",
    "aa112233",
    "aa000000",
    "aa111111",
    "aa222222",
    "aa333333",
    "qaz123123",
    "qaz123321",
    "qaz168168",
    "qwe168168",
    "qwe123123",
    "qwe123321",
    "a1234567",
    "a12345678",
    "a123456789",
    "asd168168",
    "asd123123",
    "asd123321",
    "asd112233",
    "asd123456",
    "zxc123123",
    "zxc123456",
    "zxc123321",
    "zxc168168",
  ]);
  
  // 清除空格和中文，允许输入数字、字母和符号
  const passKey = (value, type) => {
    const sid = setTimeout(() => {
      if (type === "b") {
        new_password.value = value.replace(/[\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g, "");
      }
      if (type === "c") {
        password.value = value.replace(/[\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g, "");
      }
      clearTimeout(sid);
    }, 0);
  };
  
  // 开始倒计时
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
  
  // 发送邮箱验证码
  const sendEmailCode = async () => {
    if (countdown.value > 0) return;
  
    if (!formData.email) {
      uni.$showToast({
        title: "请输入邮箱",
        duration: 3000,
        icon: "none",
      });
      return;
    }
  
    if (!validate.isEmail(formData.email)) {
      uni.$showToast({
        title: "请输入正确的邮箱",
        duration: 3000,
        icon: "none",
      });
      return;
    }
  
    try {
      loading.value = true;
      const res = await sendEmailCodeApi({
        email: formData.email,
        from: "password",
        type: "reset_password",
      });
      loading.value = false;
      if (res.status === 0) {
        uni.$showToast({
          title: res.msg || "验证码发送成功",
          duration: 3000,
          icon: "none",
        });
        formData.code = "";
        startCountdown();
      } else {
        throw new Error(res.msg || "发送失败");
      }
    } catch (error) {
      uni.$showToast({
        title: error.message,
        duration: 3000,
        icon: "none",
      });
    }
  };
  
  // 联系客服
  const jumpWork = () => {
    uni.switchTab({
      url: routes.service,
    });
  };
  
  // 设置新密码
  const setNewPassword = async () => {
    if (!formData.code) {
      uni.$showToast({
        title: "请输入验证码",
        duration: 3000,
        icon: "none",
      });
      return;
    }
  
    if (new_password.value === "") {
      uni.$showToast({
        title: "请输入新登陆密码",
        duration: 3000,
        icon: "none",
      });
      return;
    }
    if (!validate.isPasswordValid(new_password.value)) {
      uni.$showToast({
        title: "新登录密码为8-16位字符，且包含字母和数字，可包含符号",
        duration: 3000,
        icon: "none",
      });
      return false;
    }
  
    if (password.value === "") {
      uni.$showToast({
        title: "请输入确认密码",
        duration: 3000,
        icon: "none",
      });
      return;
    }
    if (!validate.isPasswordValid(password.value)) {
      uni.$showToast({
        title: "确认密码8-16位字符，且包含字母及数字的组合，可包含符号",
        duration: 3000,
        icon: "none",
      });
      return false;
    }
  
    if (disallowedPasswords.includes(password.value)) {
      uni.$showToast({
        title: "您的密码过于简单，请重新输入",
        duration: 3000,
        icon: "none",
      });
      return false;
    }
  
    if (password.value !== new_password.value) {
      uni.$showToast({
        title: "新密码和确认密码不一致，请重新输入",
        duration: 3000,
        icon: "none",
      });
      return false;
    }
  
    loading.value = true;
    loadingText.value = "修改中...";
  
    try {
      const res = await updatePassword({
        pass: formData.email,
        code: formData.code,
        newpass: new_password.value,
        renewpass: password.value,
        type: 2,
      });
  
      console.log(res);
      if (res.status == 2) {
        errorMsg.value = res.msg;
        modal.value.open();
        return;
      }
      if (res.status != 0) {
        uni.$showToast({
          icon: "none",
          title: res.msg,
          duration: 3000,
        });
      }
  
      if (res.status == 0) {
        uni.$showModal({
          title: "提示",
          showCancel: false,
          content: res.msg,
          success: function (res) {
            if (res.confirm) {
              quitLogin();
            }
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };
  
  // 退出登录
  const quitLogin = () => {
    uni.removeStorageSync("app_token");
    uni.redirectTo({
      url: routes.login,
    });
  };
  </script>
  
  <style lang="scss" scoped></style>
  