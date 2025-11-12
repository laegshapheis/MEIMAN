<template>
  <layout navTitle="验证密钥" bgType="bg-main">
    <view class="p-[32rpx]">
      <wk-stroke-bg shadow size="large">
        <view class="flex flex-row justify-center mb-[24rpx]">
          <image
            class="w-[128rpx] h-[128rpx]"
            src="/static/images/base/miyao_icon.png"
            mode="scaleToFill"
          />
        </view>
        <view class="text-neutral text-center text-lg mb-[24rpx] font-semibold">
          <text>粘贴您的密钥以登录</text>
        </view>
        <!-- 密码显示框 -->
        <view
          class="relative rounded-[24rpx] bg-[#F5F8FD] h-[144rpx] flex flex-row items-center justify-center px-[32rpx] mb-[48rpx]"
        >
          <wk-input
            style="background: transparent"
            class="relative z-10 w-full text-center font-bold"
            v-model="str"
            borderWidth="0"
            fontSize="48rpx"
            inputAlign="center"
            @input="handleInput"
            placeholder="长按此处粘贴密钥"
            :placeholder-style="{
              color: $colors.regular,
              fontSize: '32rpx',
              fontWeight: 'normal',
            }"
            @longpress="handleLongPress"
          />
        </view>
        <wk-button @submit="jumpApp"> 登录 </wk-button>
      </wk-stroke-bg>
    </view>
    <wk-modal ref="modal" :showConfirmButton="false" title="联系客服">
      <view class="flex flex-col justify-center w-full">
        <view class="text-center mb-[60rpx] mt-[50rpx]">
          <text class="text-lg text-opacity-80">点击联系在线客服</text>
        </view>
        <view class="flex-1 w-full">
          <wk-button @click="toService"> 在线客服 </wk-button>
        </view>
      </view>
    </wk-modal>
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { setmiyao } from "@/api/user";
import { routes } from "@/config/routes";
const str = ref("");
const oldMiYao = ref(""); // 带过来的参数
const isCopy = ref(false); // 是否进行了粘贴

onLoad(({ mi }) => {
  oldMiYao.value = mi;
});

const modal = ref(null);
const toService = () => {
  uni.reLaunch({
    url: routes.service2,
  });
};
// 跳转处理逻辑
const jumpApp = async () => {
  const res = await setmiyao({
    miyao: str.value.replace(/\s/g, ""),
    sortid: 1,
  });
  uni.hideLoading();

  // 请求成功后的处理
  if (res.status == 0) {
    uni.switchTab({
      url: routes.index,
    });
  } else if (res.status == 2) {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
    modal.value.open();
  } else {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
  }
};

// 添加长按处理函数
const handleLongPress = () => {
  uni.getClipboardData({
    success: function (res) {
      if (oldMiYao.value == res.data) {
        // 格式化粘贴的数据
        let value = res.data.replace(/[^\d]/g, "");
        value = value.slice(0, 16);
        str.value = value.replace(/(.{4})/g, "$1 ").trim();
        isCopy.value = true;
      } else {
        uni.$showModal({
          title: "提示",
          showCancel: false,
          content: "密钥核对错误！请重新保存",
          success: function (res) {
            if (res.confirm) {
              uni.navigateBack();
            }
          },
        });
      }
    },
  });
};

// 处理输入，去除空格后更新原始值
const handleInput = (e) => {
  setTimeout(() => {
    // 1. 只保留数字
    let value = e.replace(/[^\d]/g, "");
    // 2. 限制最大长度为16位
    value = value.slice(0, 16);
    // 3. 每4位添加一个空格
    const formattedValue = value.replace(/(.{4})/g, "$1 ").trim();
    console.log(formattedValue);
    // 4. 更新显示值
    str.value = formattedValue;
  }, 0);
};
</script>

<style lang="scss" scoped></style>

