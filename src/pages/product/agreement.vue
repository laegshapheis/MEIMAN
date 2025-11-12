<template>
  <layout
    ref="layoutRef"
    :refresher="false"
    navTitle="合同详情"
    mode="black"
    bgType="bg-grey-light"
    :isNavLeftBackClick="false"
    @navLeftClick="handelBack"
  >
    <view class="px-page-x py-page-y">
      <!-- 内容区域 => 开始 -->
      <view v-if="!loadBS">
        <view class="">
          <rich-text :nodes="content"></rich-text>
        </view>
        <view class="hr-m"></view>
        <template v-if="isSign == 1">
          <view class="qian-m-title">签名</view>
          <view class="hr-m"></view>
          <view
            class="bai-ban rounded-[16rpx] bg-black/10"
            @click="navigateToSignPage"
          >
            <image :src="qm_url" v-if="!img_stv" class="qm_img"></image>
            <text v-else class="text-neutral-primary text-base">点击签名</text>
          </view>

          <wk-button
            class="mt-[28rpx]"
            color="#fff"
            type="bg"
            @submit="handleSubmit"
            height="102rpx"
            >确认提交</wk-button
          >

          <wk-code-input
            ref="keywordRef"
            :value="pay_password"
            @finish="keyConfirm"
          />
        </template>
      </view>
      <wk-loading v-if="loading" :loadingText="loadingText" />
    </view>
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onUnload, onBackPress } from "@dcloudio/uni-app";
import { getContractInfo } from "@/api/user";
import { signContract } from "@/api/product";
import { routes } from "@/config/routes";
import { cacheManager } from "@/utils/cacheManager";

// 响应式数据
const qm_url = ref("");
const img_stv = ref(true);
const loadBS = ref(true); //载入式
const loadRE = ref(false); //请求式
const content = ref("");
const sign_img = ref("");
const isSign = ref(0);
const pay_password = ref("");
const loading = ref(false);
const loadingText = ref("");
const id = ref("");

// 模板引用
const layoutRef = ref(null);
const keywordRef = ref(null);

// 方法
const handelBack = () => {
  if (isSign.value == 0) {
    uni.navigateBack();
  } else {
    uni.$showModal({
      title: "提示",
      content: "请补签合同！",
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
  }
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
  keywordRef.value.open();
};

const keyConfirm = (password) => {
  pay_password.value = password;
  if (pay_password.value.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      duration: 3000,
      icon: "none",
    });
    return;
  }
  onSubmitSign();
  keywordRef.value.close();
};

const onSubmitSign = async () => {
  const res = await signContract({
    pwdPay: pay_password.value,
    contract_id: id.value,
    sign_img: sign_img.value,
  });
  if (res.status == 0) {
    uni.$showToast({
      title: "补签成功",
      duration: 3000,
    });
    uni.$emit("onSign");
    uni.navigateBack();
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
};

const handleCacheContractInfo = (res) => {
  loadBS.value = false;
  if (res.status == 0) {
    const data = res.data || {};
    id.value = data.ProBuy.id;
    sign_img.value = data.ProBuy.sign_img;
    content.value = data.content;
  }
  loading.value = false;
};

const articleDetails = async (contractId) => {
  loading.value = true;
  loadingText.value = "加载中...";
  const res = await getContractInfo(contractId);
  cacheManager.setCache("productAgreement" + contractId, res);
  handleCacheContractInfo(res);
};

const navigateToSignPage = () => {
  uni.navigateTo({
    url: routes.dianZiQianMing,
    animationType: "pop-in",
  });
};

onBackPress((event) => {
  if (event.from == 'backbutton') {
    handelBack();
    return true;
  }
  return false;
});
// 生命周期钩子
onLoad((options) => {
  const cacheContractInfo = cacheManager.getCache("productAgreement" + options.id);
  if (cacheContractInfo) {
    handleCacheContractInfo(cacheContractInfo);
  }
  articleDetails(options.id);
  isSign.value = options.isSign || 0;
  uni.$on("sign", (data) => {
    if (data) {
      sign_img.value = data;
      img_stv.value = false;
      qm_url.value = data;
    }
  });
});

onUnload(() => {
  uni.$off("sign");
});
</script>

<style lang="scss">
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
      .var-n {
      }
      .dfn-n {
        font-weight: bold;
      }
      .time-n {
      }
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
    .var {
    }
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
