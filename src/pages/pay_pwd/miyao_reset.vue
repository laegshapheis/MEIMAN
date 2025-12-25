<template>
    <layout navTitle="重置支付密码" bgType="bg-main2" :isLottie="false"> 
      <view class="p-[32rpx]">
        <view v-if="old_pass_s == 0">
          <view>
            <view class="mb-[10rpx] text-base text-neutral-regular/80 font-medium ml-[24rpx]">密钥</view>
            <view 
          class="flex flex-row items-center justify-between">
        
          <wk-input
            @input="passKey"
            v-model="old_pass"
            maxlength="12"
            type="number"
            placeholder="请输入12位密钥"
            :borderColor="$colors.inputBorder"
            :bgColor="$colors.inputBg"
          ></wk-input>
        </view>
          </view>
          <view class="fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx]">
            <wk-button
              height="80rpx"
              @submit="verifyMiyao"
            >
              {{cz_str == true ? '核验中...' : '确定'}}
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
      <wk-loading v-if="loading" :loadingText="loadingText" />
    </layout>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { updatePaypwd } from '@/api/user';
  import validate from '@/utils/validate';
  import { getmiyao } from '@/api/user';
  const old_pass = ref(""); // 密钥
  const new_pass = ref(""); // 新支付密码
  const new_pass_firm = ref(""); // 用于确认对比
  const old_pass_s = ref(0); // 修改流程步骤
  const type = ref("");
  const cz_str = ref(false); // 是否进行验证中
  const loading = ref(false);
  const loadingText = ref('');
  onLoad((option) => {
    type.value = option.code;
  });
  
  // 清除其他字符串，只允许输入数字、字母
  const passKey = (value) => {
    setTimeout(() => {
      old_pass.value = value.match(/[0-9]{0,12}/)[0];
    }, 100);
  };
  
  const verifyMiyao = async () => {
    cz_str.value = true;
    if (old_pass.value === "") {
      uni.$showToast({ title: "请输入密钥", duration: 3000, icon: "none" });
      cz_str.value = false;
      return false;
    }
    if (!validate.isMiyaoValid(old_pass.value)) {
      uni.$showToast({
        title: "密钥格式不正确，请重新输入！",
        duration: 3000,
        icon: "none",
      });
      cz_str.value = false;
      return false;
    }
  
    try {
      const res = await getmiyao({
        miyao: old_pass.value,
        sortid: 2,
      });
      cz_str.value = false;
      loading.value = false;
  
      if (res.status != 0 ) {
        uni.$showToast({
          icon: "none",
          title: res.msg,
          duration: 3000,
        });
      } else {
        uni.$showToast({
          icon: "none",
          title: res.msg,
          duration: 3000,
        });
        old_pass_s.value = 1;
  
      }
    } catch (error) {
      console.error("请求失败", error);
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
          type : 1,
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
      border-radius: 24rpx;
      background-color: rgba(255, 255, 255, 0.10);
    }
  }
  </style>