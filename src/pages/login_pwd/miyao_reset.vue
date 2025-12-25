<template>
  <layout navTitle="重置登录密码" bgType="bg-main2" :isLottie="false">
    <view class="p-[32rpx]">
      <view>
        <view>
          <view class="mb-[10rpx] text-base text-neutral/80 font-medium">密钥</view>
          <view class="flex flex-row items-center justify-between">
            <wk-input @input="(val) => passKey(val, 'a')" v-model="old_password" maxlength="12" type="number"
              style="border: none;border-radius: 24rpx;background-color: #202337;" color="#fff" mode="none" placeholder="请输入12位密钥" placeholderColor="rgba(255,255,255,0.8)"></wk-input>
          </view>
        </view>
        <view class="mt-[24rpx]">
          <view class="mb-[10rpx] text-base text-neutral/80 font-medium">新的密码</view>
          <view class="flex flex-row items-center justify-between">
            <wk-input @input="(val) => passKey(val, 'b')" v-model="new_password" type="password"
              style="border: none;border-radius: 24rpx;background-color: #202337;" color="#fff" mode="none" maxlength="16" placeholder="请输入新登录密码" placeholderColor="rgba(255,255,255,0.8)"></wk-input>
          </view>
        </view>
        <view class="mt-[24rpx]">
          <view class="mb-[10rpx] text-base text-neutral/80 font-medium">确认密码</view>
          <view class="flex flex-row items-center justify-between">
            <wk-input @input="(val) => passKey(val, 'c')" v-model="password" type="password"
              style="border: none;border-radius: 24rpx;background-color: #202337;" color="#fff" mode="none" maxlength="16" placeholder="请输入确认密码" placeholderColor="rgba(255,255,255,0.8)"></wk-input>
          </view>
        </view>
      </view>
      <view class="fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx]">
        <wk-button height="80rpx" fontSize="30rpx" @submit="setNewPassword"> 完成修改 </wk-button>
      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import validate from "@/utils/validate";
import { updatePassword } from "@/api/user";
import { routes } from "@/config/routes";

const old_password = ref("");
const new_password = ref("");
const password = ref("");
const loading = ref(false);
const loadingText = ref("");
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

// 清除其他字符串，只允许输入数字、字母
const passKey = (value, type) => {
  const sid = setTimeout(() => {
    if (type === "a") {
      old_password.value = value.match(/[0-9]{0,12}/)[0];
    }
    if (type === "b") {
      new_password.value = value.replace(/[\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g, "");
    }
    if (type === "c") {
      password.value = value.replace(/[\s\u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]/g, "");
    }
    clearTimeout(sid);
  }, 0);
};

// 设置新密码
const setNewPassword = async () => {
  if (old_password.value === "" || !validate.isMiyaoValid(old_password.value)) {
    uni.$showToast({
      title: "密钥不能为空或格式不正确",
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
  console.log(password.value);
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
      pass: old_password.value,
      newpass: new_password.value,
      renewpass: password.value,
      type: 1,
    });
    loading.value = false;

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
    loading.value = false;
    console.error(error);
  }
};

// 退出登录
const quitLogin = () => {
  uni.removeStorageSync("app_token");
  uni.redirectTo({
    url: routes.login,
  });
};

onLoad(() => { });
</script>

<style lang="scss" scoped></style>
