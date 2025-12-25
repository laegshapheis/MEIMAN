<template>
  <layout ref="layoutRef" mode="black" navTitle="合同详情" bgType="bg-white" :isLottie="false" :isNavLeftBackClick="false"
    @navLeftClick="handelBack">
    <!-- 内容区域 => 开始 -->
    <view class="px-[32rpx]">
      <rich-text :nodes="content"></rich-text>
    </view>
    <view class="text-neutral text-xl font-bold mt-[28rpx] mb-[28rpx] px-[32rpx]">签名</view>
    <view class="w-[686rpx] h-[344rpx] bg-black/10 rounded-[8rpx] mx-[32rpx] flex items-center justify-center"
      @click="$navigateWithAnim('/pages/other_view/dian_zi_qian_ming')">
      <image :src="qm_url" v-if="!img_stv" class="w-full h-full rotate-[-90deg]" mode="heightFix"></image>
      <text v-else class="text-black/80 text-lg">点击签名</text>
    </view>
    <view class="px-[32rpx] my-[40rpx]">
      <wk-button @submit="handleSubmit" fontSize="lg" height="80rpx">确认提交</wk-button>
    </view>
    <wk-code-input ref="keywordRef" :value="pwdPay" @finish="handleFinish" />
    <wk-loading v-if="loading" />
  </layout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  getDaikuanContractInfo as getDaikuanContractInfoApi,
  signContract as signContractApi,
  previewDaikuanContractApi,
} from "@/api/user";
import { onLoad, onUnload, onBackPress } from "@dcloudio/uni-app";
import { cacheManager } from "@/utils/cacheManager";
const layoutRef = ref(null);
const keywordRef = ref(null);
const qm_url = ref("");
const img_stv = ref(true);
const content = ref("");
const sign_img = ref("");
const id = ref("");
const pwdPay = ref("");
const contract_id = ref("");
const loading = ref(false);

onBackPress((event) => {
  if (event.from == 'backbutton') {
    handelBack();
    return true;
  }
  return false;
});
onLoad(({ money = "", id: contractId = "" }) => {
  if (money) {
    const cacheDetails = cacheManager.getCache("daikuanContractInfoMoney");
    if (cacheDetails) {
      content.value = cacheDetails.data.content;
    }
    articleDetails(money);
  }
  if (contractId) {
    id.value = contractId;
    const cacheDetails = cacheManager.getCache("daikuanContractInfoById" + contractId);
    if (cacheDetails) {
      content.value = cacheDetails.data.content;
      contract_id.value = cacheDetails.data.id;
    }
    articleDetailsById(contractId);
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

onUnload(() => {
  uni.$off("sign");
});

const handelBack = () => {
  uni.$showModal({
    title: "提示",
    content: id.value ? "请补签合同！" : "贷款前请先签名！",
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

const handleFinish = (payPassword) => {
  if (payPassword.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  pwdPay.value = payPassword;
  loading.value = true;
  signContractApi({
    contract_id: contract_id.value,
    sign_img: sign_img.value,
    pwdPay: pwdPay.value,
  }).then((res) => {
    console.log(res);
    if (res.status == 0) {
      uni.$showToast({
        title: "补签成功",
        icon: "none",
        duration: 3000,
      });
      uni.$emit("onSign", sign_img.value);
      uni.navigateBack();
    } else {
      uni.$showToast({
        title: res.msg,
        icon: "none",
        duration: 3000,
      });
    }
    loading.value = false;
  });
};

const handleSubmit = () => {
  if (sign_img.value === "") {
    uni.$showToast({
      title: "请签名后确认提交",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  if (id.value) {
    keywordRef.value.open();
  } else {
    uni.$emit("onSign", sign_img.value);
    uni.navigateBack();
  }
};

const articleDetails = async (money) => {
  loading.value = true;
  const params = {
    money,
  };
  const res = await previewDaikuanContractApi(params);
  cacheManager.setCache("daikuanContractInfoMoney", res);
  if (res.status == 0) {
    content.value = res.data.content;
  }
  loading.value = false;
};

const articleDetailsById = async (contractId) => {
  loading.value = true;
  const params = {
    contract_no: contractId,
  };
  getDaikuanContractInfoApi(params).then((res) => {
    if (res.status == 0) {
      cacheManager.setCache("daikuanContractInfoById" + contractId, res);
      content.value = res.data.content;
      contract_id.value = res.data.id;
    }
    loading.value = false;
  });
};
</script>

<style lang="scss" scoped>
page {
  background-color: #f0f3f5;
}

.xs-bg-box {
  background-image: none !important;
  background-color: #f0f3f5;
}

.slef_32 {
  box-sizing: border-box;
  padding: 24rpx 32rpx 48rpx;
}

.hr-m {
  height: 24rpx;
}

.hr-x {
  height: 48rpx;
}

.he_tong_box {
  color: #252c2f;
  line-height: 1.4;
  position: relative;
  box-sizing: border-box;
  padding: 32rpx;
  background-color: #fff;
  border: 2rpx solid #000000;

  .title {
    font-size: 44rpx;
    text-align: center;
    margin-top: 32rpx;
  }

  .tou-zi-id {
    text-align: center;
    margin-top: 48rpx;
    color: #4d585b;
    font-size: 28rpx;
    margin-bottom: 24rpx;
  }

  .tab-box-k {
    background-color: #f0f3f5;
    padding: 32rpx 32rpx 1rpx;

    .line-x {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24rpx;
      font-size: 32rpx;

      .var-n {}

      .dfn-n {
        font-weight: bold;
      }

      .time-n {}
    }
  }

  .h-1-x {
    font-weight: bold;
    font-size: 32rpx;
  }

  .hr-m {
    height: 24rpx;
  }

  .span-box {
    font-size: 32rpx;

    .var {}

    .bold {
      font-weight: bold;
    }
  }

  .hr-x {
    height: 48rpx;
  }

  .le-str-x {
    font-size: 32rpx;
  }

  .re-str-x {
    text-align: right;
    font-size: 32rpx;
  }

  .b-k-1,
  .b-k-2,
  .b-k-3,
  .b-k-4 {
    position: absolute;
    width: 42rpx;
    height: 42rpx;
    border: 6rpx solid #000000;
  }

  .b-k-1,
  .b-k-4 {
    left: -6rpx;
    border-right: none;
  }

  .b-k-1,
  .b-k-2 {
    top: -6rpx;
    border-bottom: none;
  }

  .b-k-2,
  .b-k-3 {
    right: -6rpx;
    border-left: none;
  }

  .b-k-3,
  .b-k-4 {
    bottom: -6rpx;
    border-top: none;
  }
}

.qian-m-title {
  color: #252c2f;
  font-size: 32rpx;
}

.bai-ban {
  border: 2rpx solid #000000;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 344rpx;
  width: 686rpx;
  box-sizing: border-box;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  .icon {
    width: 260rpx;
    height: 80rpx;
  }

  .qm_img {
    transform: rotate(-90deg);
    width: 344rpx;
    height: 686rpx;
    /* background-color: aquamarine; */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.copy-btn {
  margin-top: 32rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 102rpx;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-size: 36rpx;
  font-weight: bold;
}
</style>
