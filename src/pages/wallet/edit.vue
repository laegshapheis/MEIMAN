<template>
  <layout :navTitle="navTitle" bgType="bg-main">
    <template v-slot:navRight v-if="code == 'usdt'">
      <view
        class="flex bg-white/10 rounded-full flex-row items-center justify-end px-[16rpx] py-[8rpx] pt-[5rpx]"
        @click="navigateTo(routes.indexGuide)"
      >
        <text class="text-base mr-[2rpx] text-neutral">下载钱包</text>
      </view>
    </template>

    <view
      class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col"
    >
      <!-- 银行卡表单 -->
      <bank-form
        v-if="code == 'bank'"
        v-model:formData="params"
        :cardlist="userInfo.cardlist"
        @openAddressSelect="openAddressSelect"
        ref="bankFormRef"
      />

      <!-- USDT表单 -->
      <usdt-form
        v-if="code == 'usdt'"
        v-model:formData="params"
        :onlineWalletList="onlineWalletList"
        @onGuideClick="navigateTo(routes.indexGuide)"
        ref="usdtFormRef"
      />

      <!-- 支付宝表单 -->
      <alipay-form
        v-if="code == 'alipay'"
        v-model:formData="params"
        @onUploadClick="uploadFile"
        ref="alipayFormRef"
      />

      <!-- 微信表单 -->
      <wechat-form
        v-if="code == 'wechat'"
        v-model:formData="params"
        @onUploadClick="uploadFile"
        ref="wechatFormRef"
      />

      <!-- 按钮 -->
      <view class="py-[16rpx] mt-[32rpx]">
        <wk-button
          type="bg"
          @submit="prepareSubmit"
        >
          立即添加
        </wk-button>
      </view>

      <view v-if="userInfo.istxusdt == 1 || userInfo.iszfb == 1" 
      class="text-base leading-6 mt-[40rpx] mb-[150rpx] bg-white rounded-[24rpx] p-[32rpx]"
      style="border: 1rpx solid #00000020;"
      >
        <CommonTips :content="tips"></CommonTips>
      </view>
    </view>

    <wk-code-input ref="keywordRef" :value="pwdPay" @finish="handleSubmit" />
  </layout>

  <!-- 选择省市区 -->
  <wk-address-picker ref="addressPickerRef" @confirm="handleAddressConfirm" />
  <wk-loading v-if="loading" :loadingText="loadingText" />
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { navigateTo } from "@/utils/navigation";
import { routes } from "@/config/routes";
import CommonTips from "@/components/base/common-tips";
import BankForm from "./components/BankForm.vue";
import UsdtForm from "./components/UsdtForm.vue";
import AlipayForm from "./components/AlipayForm.vue";
import WechatForm from "./components/WechatForm.vue";
import {
  getUserInfo as getUserInfoApi,
  updateAlipay as updateAlipayApi,
  updateBank as updateBankApi,
  updateUsdt as updateUsdtApi,
  updateWechat as updateWechatApi,
} from "@/api/user";
import { uploadFile as uploadFileApi } from "@/api/upload";

const addressPickerRef = ref(null);
const bankFormRef = ref(null);
const usdtFormRef = ref(null);
const alipayFormRef = ref(null);
const wechatFormRef = ref(null);
const keywordRef = ref(null);

const params = ref({});
const tips = ref("");
const code = ref("");
const pwdPay = ref("");
const loading = ref(false);
const loadingText = ref('');
const navTitle = ref('');
const onlineWalletList = ref([
  {
    id: 1,
    title: "TRC20 波场链（Tron）",
  },
]);

const typeOptions = {
  alipay: "添加支付宝",
  wechat: "添加微信",
  bank: "添加银行卡",
  usdt: "添加USDT",
};

onLoad((options) => {
  const { type } = options;
  code.value = type;
  navTitle.value = typeOptions[type];
  getUserInfo();
});

const userInfo = ref({
  cardlist: [],
});

const getUserInfo = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = '加载中...'
  }

  try {
    const result = await getUserInfoApi();

    if (result.status && result.status != 0) {
      loading.value = false;
      return;
    }

    userInfo.value = result;
    tips.value = result.bankcontent;

    params.value.realname = result.realname;
    params.value.bankrealname = result.realname;

    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
};

const openAddressSelect = () => {
  addressPickerRef.value.open();
};

const handleAddressConfirm = (data) => {
  params.value.ssxzStr = `${data[0].name}-${data[1].name}-${data[2].name}`;
};

const prepareSubmit = () => {
  let isValid = false;
  
  switch (code.value) {
    case "bank":
      isValid = bankFormRef.value.validate();
      break;
    case "usdt":
      isValid = usdtFormRef.value.validate();
      break;
    case "alipay":
      isValid = alipayFormRef.value.validate();
      break;
    case "wechat":
      isValid = wechatFormRef.value.validate();
      break;
  }

  if (!isValid) return;

  // 调支付密码
  keywordRef.value.open();
};

const handleSubmit = async (value) => {
  pwdPay.value = value;
  keywordRef.value.close();

  if (!pwdPay.value || pwdPay.value.length < 6) {
    uni.$showToast({
      title: "请输入支付密码",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  params.value.pay_passworld = value;

  loading.value = true;
  loadingText.value = '提交中...'

  let result = {};
  switch (code.value) {
    case "usdt":
      try {
        result = await updateUsdtApi(params.value);
      } catch (e) {
        loading.value = false;
        console.error(e);
      }
      break;
    case "bank":
      try {
        result = await updateBankApi(params.value);
      } catch (e) {
        loading.value = false;
        console.error(e);
      }
      break;
    case "alipay":
      try {
        result = await updateAlipayApi({
          email: params.value.email,
          alipay_qrcode: params.value.upfile,
          pay_passworld: params.value.pay_passworld,
        });
      } catch (e) {
        loading.value = false;
        console.error(e);
      }
      break;
    case "wechat":
      try {
        result = await updateWechatApi({
          weixin_pay_qrcode: params.value.upfile,
          pay_passworld: params.value.pay_passworld,
        });
      } catch (e) {
        loading.value = false;
        console.error(e);
      }
      break;
  }

  loading.value = false;

  if (result.status == 0) {
    uni.$showModal({
      title: "提示",
      showCancel: false,
      content: result.msg,
      success: function (res) {
        if (res.confirm) {
          if (code.value == "usdt") {
            uni.navigateBack({
              // delta : 2,
            });
          } else {
            uni.navigateBack();
          }
        }
      },
    });
    pwdPay.value = "";
  } else if (result.status) {
    uni.$showToast({
      icon: "none",
      title: result.msg,
      duration: 3000,
    });
  }
};

const uploadFile = async () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["camera", "album"],
    success: async (res) => {
      const tempFilePath = res.tempFilePaths[0];

      loading.value = true;
      loadingText.value = "文件上传中...";

      try {
        const result = await uploadFileApi(tempFilePath);

        if (result.status && result.status != 0) {
          loading.value = false;
          uni.$showToast({
            title: result.msg,
            duration: 3000,
            icon: "none",
          });
          return;
        }
        params.value.upfile = result.src;

        loading.value = false;
      } catch (e) {
        loading.value = false;

        uni.$showToast({
          title: "文件上传失败",
          duration: 3000,
          icon: "none",
        });
      }
    },
  });
};
</script>

<style lang="scss" scoped></style>
