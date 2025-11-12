<template>
  <layout
		ref="layoutRef"
		mode="black"
    navTitle="合同详情"
    bgType="bg-white"
    :isNavLeftBackClick="false"
    @navLeftClick="handelBack"
  >
    <!-- 内容区域 => 开始 -->
    <view class="px-[40rpx] mt-[32rpx] pb-[40rpx]">
      <rich-text :nodes="content"></rich-text>
      <view class="text-black text-lg font-bold mt-[40rpx] mb-[24rpx]">签名</view>
      <view
        class="h-[344rpx] w-[686rpx] bg-black/10 rounded-[16rpx] flex items-center justify-center"
        @click="goElectronicSignature"
      >
        <text v-if="img_stv" class="text-black/70 text-lg">点击签名</text>
        <image :src="qm_url" v-else class="w-full h-full rotate-[-90deg]" mode="heightFix"></image>
      </view>
      <wk-button @submit="handleSubmit" class="mt-[40rpx]">确认提交</wk-button>
    </view>
  </layout>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onReady, onBackPress } from '@dcloudio/uni-app';
import { routes } from '@/config/routes';
import { previewContract } from '@/api/product';
import { cacheManager } from '@/utils/cacheManager';

const layoutRef = ref(null);
const qm_url = ref('');
const img_stv = ref(true);
const loadBS = ref(true); //载入式
const content = ref('');
const sign_img = ref('');


onBackPress((event) => {
  if (event.from == 'backbutton') {
    handelBack();
    return true;
  }
  return false;
});
// 页面加载
onLoad((option) => {
  if (option.params) {
    const data = JSON.parse(option.params);
    const cacheContractInfo = cacheManager.getCache("productAgreementTouzhi" + data.idPay);
    if (cacheContractInfo) {
      content.value = cacheContractInfo.content;
    }
    articleDetails(option.params);
  }
  uni.$on("sign", (data) => {
    if (data) {
      console.log(data);
      sign_img.value = data;
      img_stv.value = false;
      qm_url.value = data;
    }
  });
});

// 跳转到电子签名页面
const goElectronicSignature = () => {
  uni.navigateTo({
    url: routes.electronicSignature,
  });
};

// 返回处理
const handelBack = () => {
  console.log(layoutRef.value);
  uni.$showModal({
    title: "提示",
    content: "投资前请先签名！",
    showCancel: true,
    cancelColor: "#999",
    success(res) {
      if (res.cancel) {
        uni.navigateBack();
      }
      if (res.confirm) {
        layoutRef.value.scrollToBottom();
      }
    },
  });
};

// 提交处理
const handleSubmit = () => {
  if (sign_img.value === "") {
    uni.$showToast({
      title: "请签名后确认提交",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  uni.$emit("onSign", sign_img.value);
  uni.navigateBack();
};

// 获取文章详情
const articleDetails = async (data) => {
  const params = JSON.parse(data);
  const res = await previewContract({
    ...params,
  });
  loadBS.value = false;
  if (res.status == 0) {
    cacheManager.setCache("productAgreementTouzhi" + params.idPay, res);
    content.value = res.content;
  }
};
</script>

<style lang="scss" scoped>

</style>
