<template>
  <layout class="" navTitle="我的密钥" bgType="bg-main">
    <view class="p-[32rpx]">
      <wk-stroke-bg shadow size="large">
        <view class="flex flex-row justify-center mb-[24rpx]">
          <image
            class="w-[196rpx] h-[196rpx]"
            src="/static/images/base/miyao_icon.png"
            mode="scaleToFill"
          />
        </view>
        <view class="text-neutral text-center text-2xl font-semibold">
          <text>您当前的密钥</text>
        </view>
        <view
          class="text-center text-sm mt-[10rpx] mb-[32rpx] text-neutral-regular"
        >
          <text>请复制保存好您的密钥</text>
        </view>

        <view
          class="bg-[#F5F8FD] rounded-[24rpx] h-[144rpx] flex flex-row items-center justify-center mb-[48rpx] px-[32rpx] text-3xl text-black font-bold"
        >
          {{ formatMiyao(mi_bao_str) }}
        </view>
        <wk-button class="mb-[16rpx]" @submit="saveMiYao"> 复制密钥 </wk-button>
        <wk-button
          :isShowShadow="false"
          :color="$colors.theme"
          :buttonStyle="{
            border: '1rpx solid ' + $colors.theme,
            background: 'transparent',
            fontWeight: 'normal',
          }"
          @submit="confirmSaveCode"
        >
          确认已保存密钥
        </wk-button>
      </wk-stroke-bg>
      <view
        style="
          border-radius: var(--margin-small, 12px);
          border: 0.5px solid rgba(42, 135, 124, 0.6);
          background: rgba(255, 255, 255, 0.05);
        "
        class="p-[32rpx] mt-[32rpx] border-[length:1rpx] border-solid border-neutral-theme rounded-[24rpx]"
        bgColor="transparent"
        size="small"
      >
        <wk-common-tip :content="wx_ti_shi"></wk-common-tip>
      </view>
    </view>
    <wk-loading v-if="loading" />
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getmiyao, setmiyao } from "@/api/user";
import { routes } from "@/config/routes";

const mi_bao_str = ref("");
const copy_status = ref(false); // 是否保存了
const wx_ti_shi = ref(
  "注意：\n请妥善保管密钥到本地（包括但不限于纸质文件，收藏夹，备忘录，截图到相册等）密钥仅用于登陆密码的重置，请勿把密钥告知任何人！"
);
const loading = ref(false);
// 生命周期函数
onLoad(() => {
  getMiYao();
});

// 添加格式化显示方法
const formatMiyao = (str) => {
  return str.replace(/(\d{4})(?=\d)/g, "$1 ");
};

// 获取密钥的方法
const getMiYao = async () => {
  const res = await getmiyao();
  mi_bao_str.value = res.miyao || "";
  wx_ti_shi.value = res.wx_ti_shi;
};

// 保存密钥到剪贴板
const saveMiYao = () => {
  let copyText = mi_bao_str.value.toString();
  uni.setClipboardData({
    data: copyText,
    success: function () {
      copy_status.value = true;
    },
  });
};

// 确认保存密钥的方法
const confirmSaveCode = async () => {
  if (!copy_status.value) {
    uni.$showToast({
      title: "请先复制密钥！",
      duration: 3000,
      icon: "none",
    });
    return;
  }

  // 保存逻辑请求
  loading.value = true;
  await setmiyao({ miyao: mi_bao_str.value.toString() });
  loading.value = false;
  // 请求成功后，跳转到验证密钥页面
  uni.navigateTo({
    url: routes.verifyMiYao + "?mi=" + mi_bao_str.value,
  });
};
</script>

<style lang="scss" scoped></style>

