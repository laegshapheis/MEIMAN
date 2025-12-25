<template>
  <layout navTitle="我的密钥" bgType="bg-main2" :isLottie="false">
    <view class="p-[32rpx]">
      <view class="card">
        <view class="flex flex-row justify-center mb-[24rpx]">
          <image class="w-[184rpx] h-[184rpx]" src="/static/images/base/miyao_icon.png" mode="scaleToFill" />
        </view>
        <view class="text-neutral text-center text-xl font-semibold mb-[16rpx]">
          <text>请妥善保存您的密钥</text>
        </view>
        <!-- <view class="text-center text-sm mt-[10rpx] mb-[32rpx] text-neutral-regular">
          <text>请复制保存好您的密钥</text>
        </view> -->

        <view
          class="bg-[#0C052F] rounded-[24rpx] h-[112rpx]  flex flex-row items-center justify-center mb-[32rpx] px-[32rpx] text-3xl text-white font-bold">
          {{ formatMiyao(mi_bao_str) }}
        </view>
        <wk-button height="80rpx" class="mb-[16rpx]" @submit="saveMiYao">复制密钥</wk-button>
        <wk-button height="80rpx" @submit="confirmSaveCode">确认已保存密钥</wk-button>
      </view>
      <view style="
          border: 0.5px solid rgba(42, 135, 124, 0.6);
        " class="bg-[#0C052F] p-[32rpx] mt-[32rpx] border-[length:1rpx] border-solid border-neutral-theme rounded-[48rpx]"
        bgColor="transparent" size="small">
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

<style lang="scss" scoped>
  .card{
    background-image: url('@/static/images/miyao/card_bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    padding:66rpx 32rpx;
    border-radius: 24rpx;
    box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }
</style>
