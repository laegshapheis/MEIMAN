<template>
    <layout navTitle="重置支付密码"  bgType="bg-main"> 
      <view class="p-[32rpx]">
        <view v-if="old_pass_s == 0">
          <view class="px-0 pt-[16rpx]">
            <view class="text-base mb-[12rpx] text-neutral-regular">邮箱号</view>
            <view 
          class="flex flex-row items-center justify-between">
        
          <wk-email-input
            leftIcon=""
            v-model="formData.email_mask"
            placeholder="请输入邮箱"
            size="small"
            readonly
            :borderColor="$colors.inputBorder"
            :bgColor="$colors.inputBg"
            class="w-full"
          />
        </view>

            <view class="flex flex-row items-center mb-[12rpx] mt-[24rpx] justify-between">
              <text class="text-base text-neutral-regular">验证码</text>
              <text
                class="text-neutral-regular text-base cursor-pointer"
                @click="sendEmailCode"
                v-if="countdown === 0"
                >发送验证码</text>
              <text class="text-neutral text-base" v-else>{{ countdown }}秒后重新发送</text>
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
            size="small"
            :borderColor="$colors.inputBorder"
            :bgColor="$colors.inputBg"
          ></wk-input>
        </view>
          </view>
          <view class="fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx]">
            <wk-button
              @submit="verifyEmail"
            >
              {{cz_str == true ? '验证中...' : '确定'}}
            </wk-button>
          </view>
        </view>
        <view v-else>
          <view class="text-center mt-[58rpx]">
            <view v-if="old_pass_s == 1" class="">
              <text>请输入新的支付密码！</text>
              <uv-code-input class="mt-[58rpx]" space="5" v-model="new_pass" :maxlength="6" :focus="true" borderColor="none" :dot="true" color="#fff" size="95rpx" @finish="keyConfirm"></uv-code-input>
            </view>
            <view v-if="old_pass_s == 2" class="">
              <text>请再次输入新的支付密码！</text>
              <uv-code-input class="mt-[58rpx]" space="5" v-model="new_pass_firm" :maxlength="6" :focus="true" borderColor="none" :dot="true" color="#fff" size="95rpx" @finish="keyConfirm"></uv-code-input>
            </view>
          </view>
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
  import { ref, reactive } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { updatePaypwd } from '@/api/user';
  import { sendEmail as sendEmailCodeApi, verifyEmail as verifyEmailApi } from '@/api/index';
  import validate from '@/utils/validate';
  import { useI18n } from "vue-i18n";
  import { routes } from '@/config/routes';

  const { t: $t } = useI18n();
  const old_pass = ref(""); // 密钥
  const new_pass = ref(""); // 新支付密码
  const new_pass_firm = ref(""); // 用于确认对比
  const old_pass_s = ref(0); // 修改流程步骤
  const type = ref("");
  const cz_str = ref(false); // 是否进行验证中
  const loading = ref(false);
  const loadingText = ref('');
  const countdown = ref(0);
  let timer = null;
  const modal = ref(null);
  const errorMsg = ref("");
  // 表单数据
  const formData = reactive({
    email: uni.getStorageSync("last_login_username") || "",
    email_mask: uni.getStorageSync("mobile") || "",
    code: "",
  });
  
  onLoad((option) => {
    type.value = option.code;
  });

  // 联系客服
  const jumpWork = () => {
    uni.switchTab({
      url: routes.service,
    });
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
  
    try {
      loading.value = true;
      const res = await sendEmailCodeApi({
        from: "paypwd",
        email: formData.email,
        type: "reset_paypwd",
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
  
  const verifyEmail = async () => {
    if (!formData.code) {
      uni.$showToast({
        title: "请输入验证码",
        duration: 3000,
        icon: "none",
      });
      return;
    }
  
    cz_str.value = true;
    try {
      const res = await verifyEmailApi({
        email: formData.email,
        code: formData.code,
        from: "paypwd",
      });
      console.log(res);
      if (res.status == 0) {
        old_pass_s.value = 1;
      }
      if (res.status == 2) {
        errorMsg.value = res.msg;
        modal.value.open();
        return;
      }
      uni.$showToast({
        icon: "none",
        title: res.msg,
        duration: 3000,
    });
    } catch (error) {
      console.error("请求失败", error);
    } finally {
      cz_str.value = false;
      loading.value = false;
    }
  };
  
  const keyConfirm = async () => {
    if (old_pass_s.value == 1) {
      old_pass_s.value = 2;
      return;
    }
    if (old_pass_s.value == 2) {
      if (new_pass.value !== new_pass_firm.value) {
        uni.$showModal({
          title: "安全提示",
          content: "两次密码输入不正确，请重新输入！",
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              old_pass_s.value = 1;
              new_pass.value = "";
              new_pass_firm.value = "";
            }
          },
        });
        return;
      }
      loading.value = true;
      loadingText.value = '修改中...'
      try {
        const res = await updatePaypwd({
          pass: old_pass.value,
          newpass: new_pass.value,
          renewpass: new_pass_firm.value,
          type : 2,
          code: formData.code,
        });
        if (res.status != 0 ) {
          uni.$showToast({
            icon: "none",
            title: res.msg,
            duration: 3000,
          });
        } else {
          uni.$showModal({
            title: "提示",
            showCancel: false,
            content: res.msg,
            success: function (res) {
              if (res.confirm) {
                uni.navigateBack();
              }
            },
          });
        }
        loading.value = false;
        old_pass_s.value = 0;
        new_pass.value = "";
        new_pass_firm.value = "";
      } catch (error) {
        console.error("请求失败", error);
        loading.value = false;
      }
    }
  };
  
  </script>
  
  <style scoped lang="scss">
  ::v-deep {
    .uv-code-input {
      display: flex;
      justify-content: center;
    }
    .uv-code-input__item {
      border: 1rpx solid rgba(0, 0, 0, 0.10);
      border-radius: 16rpx;
      background-color: rgba(255, 255, 255, 0.10);
    }
  }
  </style>