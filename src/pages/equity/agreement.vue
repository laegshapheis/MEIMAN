<template>
  <layout
    ref="layoutRef"
    mode="black"
    navTitle="质押合约"
    bgType="bg-white"
    :isNavLeftBackClick="false"
    @navLeftClick="handelBack"
  >
    <view class="text-black px-[40rpx] mt-[32rpx] pb-[80rpx]">
      <rich-text :nodes="content"></rich-text>
      <template v-if="isSign">
      <view class="text-xl font-bold mt-[66rpx] mb-[24rpx]">签名</view>
      <view
        class="h-[344rpx] w-[686rpx] bg-black/10 rounded-[16rpx] flex items-center justify-center"
        @click="goElectronicSignature"
      >
        <text v-if="img_stv" class="text-black/60 text-lg font-bold"
          >点击签名</text
        >
        <image
          :src="qm_url"
          v-else
          class="w-full h-full rotate-[-90deg]"
          mode="heightFix"
        ></image>
        </view>
        <wk-button @submit="handleSubmit" class="mt-[40rpx]">确认提交</wk-button>
      </template>
    </view>
    <wk-loading v-if="loading"></wk-loading>
  </layout>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onUnload, onBackPress } from '@dcloudio/uni-app';
import { routes } from "@/config/routes";
import { getContractInfoApi, previewContractApi } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const layoutRef = ref(null);
const qm_url = ref('');
const img_stv = ref(true);
const content = ref('');
const sign_img = ref('');
const isSign = ref(false);
const amount = ref('');
const loading = ref(false);
// 获取页面参数
const query = defineProps({
  params: {
    type: String,
    default: ''
  }
});

onBackPress((event) => {
  if (event.from == 'backbutton') {
    handelBack();
    return true;
  }
  return false;
});
onLoad((options) => {
  isSign.value = options.isSign;
  if (options.id) {
    const contract_info = cacheManager.getCache("contract_info" + options.id);
    if (contract_info) { 
      content.value = contract_info.content;
    }
    articleDetails(options.id);
  } else {
    const contract_info_number = cacheManager.getCache("contract_info_number");
    if (contract_info_number) {
      content.value = contract_info_number.content;
    }
    amount.value = options.amount;
    previewContract();
  }
  // 监听签名事件
  uni.$on("sign", (data) => {
    if (data) {
      console.log(data);
      sign_img.value = data;
      img_stv.value = false;
      qm_url.value = data;
    }
  });
});

onUnload(() => {
  // 移除事件监听，避免内存泄漏
  uni.$off('sign');
});

// 跳转到电子签名页面
const goElectronicSignature = () => {
  uni.navigateTo({
    url: routes.electronicSignature,
  });
};

// 处理返回按钮点击
const handelBack = () => {
  if (!isSign.value) {
    uni.navigateBack();
    return;
  }
  uni.$showModal({
    title: "提示",
    content: "质押前请先签名！",
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

// 获取详情
const articleDetails = async (id) => {
  loading.value = true;
  const res = await getContractInfoApi(id);
  if (res.status == 0) {
    cacheManager.setCache("contract_info" + id, res.data);
    content.value = res.data.content;
  }
  loading.value = false;
};

// 预览合约
const previewContract = async () => {
  loading.value = true;
  const res = await previewContractApi({ number: amount.value });
  if (res.status == 0) {
    cacheManager.setCache("contract_info_number", res.data);
    content.value = res.data.content;
  }
  loading.value = false;
};
</script>

<style lang="scss" scoped></style>
