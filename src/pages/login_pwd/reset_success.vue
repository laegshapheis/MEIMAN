<template>
  <layout navTitle="重置密码" bgType="bg-main1">
    <view class="p-[32rpx]">
      <view class="flex flex-col justify-center items-center mb-[48rpx]">
        <image
          class="w-[184rpx] h-[184rpx] mb-[24rpx]"
          src="/static/images/base/reset_success.png"
          mode="scaleToFill"
        />
        <view class="text-neutral text-xl">重置成功</view>
      </view>
      <wk-stroke-bg shadow>
        <view
          class="text-center px-[16rpx] py-[32rpx] rounded-[24rpx] flex flex-col justify-center items-center bg-[#F5F8FD]"
        >
          <view class="text-neutral-regular text-base">您的临时登录密码</view>
          <view class="flex flex-row justify-center items-center my-[32rpx]">
            <text class="text-4xl text-neutral font-bold">
              {{ mima_str }}
            </text>
          </view>
          <view
            class="h-[64rpx] w-[160rpx] flex flex-row justify-center items-center border border-[#06F]/50 border-solid rounded-full"
          >
            <image
              class="w-[36rpx] h-[36rpx]"
              src="/static/images/base/copy.svg"
              mode="widthFix"
            />
            <text
              class="text-base text-neutral-theme ml-[8rpx] font-medium"
              @click="savemima"
            >
              复制
            </text>
          </view>
        </view>
        <view class="my-[48rpx] text-neutral-regular text-base">
          <view>温馨提示 </view>
          <view>1.点击前往登录 </view>
          <view
            >2.登录成功后请立即使用临时密码修改登录密码(临时密码可长按输入框粘贴)
          </view>
        </view>
        <wk-button @submit="toLogin"> 复制并前往登录 </wk-button>
      </wk-stroke-bg>
    </view>
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";

const mima_str = ref("");
const is_copy = ref(false);
onLoad((options) => {
  mima_str.value = options.mi_ma || "";
});

// 跳转到指定页面
const toLogin = () => {
  savemima(() => {
    if (is_copy.value) {
      uni.navigateTo({
        url: routes.login,
      });
    } else {
      uni.$showToast({
        title: "请先复制临时登录密码",
        icon: "none",
      });
    }
  });
};

// 复制密码到剪贴板
const savemima = (cb) => {
  const copyText = mima_str.value.toString();
  uni.setClipboardData({
    data: copyText,
    success: function () {
      is_copy.value = true;
      cb();
    },
  });
};
</script>

<style lang="scss" scoped></style>
