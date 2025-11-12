<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="在线充值"
    bgType="bg-main"
  >
    <template v-slot:navRight>
      <view
        class="flex flex-row w-full items-center bg-white/10 justify-end rounded-full p-[12rpx]"
        @click="navigateTo(routes.rechargeRecord)"
      >
        <image
          src="@/static/images/user/list_search.svg"
          mode="widthFix"
          class="w-[32rpx] h-[32rpx]"
        ></image>
      </view>
    </template>

    <view
      class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col"
    >
      <!-- 顶部汇总信息 -->
      <SummaryInfo
        :symbol-code="symbolStore.code"
        :zhamount="rechargeInfo.zhamount"
        :txmoney="rechargeInfo.txmoney"
      />

      <!-- 汇率换算 -->
      <ExchangeRate
        :rate="currentRate"
        v-model:usdt-value="USDTInput"
        v-model:cny-value="CNYInput"
      />

      <!-- 充值方式选择 -->
      <PaymentMethod
        :payments="rechargeInfo.Payments"
        :wycznr="wycznr"
        :recharge_must_bind_wallet="rechargeInfo.recharge_must_bind_wallet"
        :isusdt="rechargeInfo.isusdt"
        @change="handleChangeMethod"
      />

      <!-- 在线客服充值 -->
      <view
        class="flex flex-col items-content justify-center"
        v-if="currentMethodCode == 'kehuchong'"
      >
        <text class="text-base text-neutral mt-[30rpx]">{{
          rechargeInfo.Payments[currentMethodIndex].pay_desc
        }}</text>

        <view
          class="px-[32rpx] py-[16rpx] fixed bottom-0 left-0 right-0 bg-neutral-bottomBtnBg"
        >
          <wk-button @submit="switchTab(routes.service)">
            在线客服充值
          </wk-button>
        </view>
      </view>
      <!-- 支付宝、微信、银行卡充值 -->
      <CommonForm
        v-if="
          currentMethodCode == 'zxweixin' ||
          currentMethodCode == 'zxalipay' ||
          currentMethodCode == 'zxpay'
        "
        :rate="currentRate"
        :min-amount="rechargeInfo.Payments[currentMethodIndex].minmoney"
        :max-amount="rechargeInfo.Payments[currentMethodIndex].maxmoney"
        @submit="handleSubmit"
      />
      <!-- USDT人工充值 -->
      <UsdtManualForm
        v-if="currentMethodCode == 'UsdtPay'"
        :rate="currentRate"
        :payment-desc="rechargeInfo.Payments[currentMethodIndex].pay_desc"
        :need-usdt-order="rechargeInfo.usdtorder == 1"
        :need-pay-pic="rechargeInfo.paypic == 1"
        :min-amount="rechargeInfo.Payments[currentMethodIndex].minmoney"
        :max-amount="rechargeInfo.Payments[currentMethodIndex].maxmoney"
        :uploadedImageUrl="params.upfile"
        :fkname="params.fkname"
        :recharge_need_wallet_switch="rechargeInfo.recharge_need_wallet_switch"
        @submit="handleSubmit"
        @show-contact-list="handleContactList"
        @upload="uploadFile"
      />

      <!-- 银联人工充值 -->
      <ChinaPayForm
        v-if="currentMethodCode == 'ChinaPay'"
        :rate="currentRate"
        :payment-desc="rechargeInfo.Payments[currentMethodIndex].pay_desc"
        :need-pay-pic="rechargeInfo.paypic == 1"
        :min-amount="rechargeInfo.Payments[currentMethodIndex].minmoney"
        :max-amount="rechargeInfo.Payments[currentMethodIndex].maxmoney"
        :uploadedImageUrl="params.upfile"
        :fkname="params.fkname"
        @submit="handleSubmit"
        @show-contact-list="handleContactList"
        @upload="uploadFile"
      />

      <!-- USDT在线充值 -->
      <OnlineUsdtForm
        v-if="currentMethodCode == 'zxusdt'"
        :payment-desc="rechargeInfo.Payments[currentMethodIndex].pay_desc"
        :wallet-url="walletUrl"
      />

      <!-- 底部提示 -->
      <view class="flex flex-col justify-between mb-[150rpx]">
        <view class="mt-[40rpx]">
          <CommonTips
            :content="rechargeInfo.tishi"
          ></CommonTips>
        </view>
      </view>
    </view>
    <!-- 历史联系人列表 -->
    <contact-list
      :type="contactListType"
      :title="contactListTitle"
      :value="contactListValue"
      :label="contactListLabel"
      v-model:show="contactListShow"
      @onSelect="handleContactSelect"
    ></contact-list>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { onLoad, onShow, onPullDownRefresh } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateTo, switchTab } from "@/utils/navigation";
import { routes } from "@/config/routes";
import CommonTips from "@/components/base/common-tips";
import {
  getRecharge as getRechargeApi,
  submitRecharge as submitRechargeApi,
  getUsdtInfo as getUsdtInfoApi,
} from "@/api/user";
import { uploadFile as uploadFileApi } from "@/api/upload";
import SummaryInfo from "./components/SummaryInfo.vue";
import ExchangeRate from "./components/ExchangeRate.vue";
import PaymentMethod from "./components/PaymentMethod.vue";
import UsdtManualForm from "./components/forms/UsdtManualForm.vue";
import ChinaPayForm from "./components/forms/ChinaPayForm.vue";
import OnlineUsdtForm from "./components/forms/OnlineUsdtForm.vue";
import CommonForm from "./components/forms/common_form.vue";
import { cacheManager } from "@/utils/cacheManager";
import { usePermissionStore } from "@/stores/permission";

const { getPermissions } = usePermissionStore();

const cacheData = cacheManager.getCache("recharge");
const cacheUsdtInfo = cacheManager.getCache("rechargeUsdtInfo");
const symbolStore = useSymbolStore();
const CNYInput = ref(1);
const USDTInput = ref(1);
const contactListShow = ref(false);
const layoutRef = ref(null);
const rechargeInfo = ref({
  tishi: "",
  Payments: [],
});
const userid = ref("");
const wycznr = ref("");
const loading = ref(false);
const loadingText = ref("");
const currentMethodIndex = ref(-1);
const currentMethodCode = ref("");
const currentRate = ref(1);
const walletUrl = ref("");
const params = ref({});
const contactListType = ref(0);
const contactListTitle = ref("");
const contactListValue = ref("");
const contactListLabel = ref("");
const domain = computed(() => {
  return getPermissions.domain_url;
});

onShow(() => {
  if (cacheData) {
    handleResData(cacheData);
  }
  if (cacheUsdtInfo) {
    handleResUsdtInfo(cacheUsdtInfo);
  }
  getRecharge(false);
  getUsdtInfo();
});

const handleContactList = (type) => {
  contactListType.value = type;
  contactListShow.value = true;
  if (type == 1) {
    contactListTitle.value = "历史付款地址";
    contactListValue.value = "付款地址";
    contactListLabel.value = "";
  }
  if (type == 2) {
    contactListTitle.value = "历史付款人";
    contactListValue.value = "";
    contactListLabel.value = "姓名";
  }
};

const handleContactSelect = (item) => {
  params.value.fkname = contactListType.value == 1 ? item.account : item.name;
};

const handleRefresh = () => {
  getRecharge();
  getUsdtInfo();
};

const getRecharge = async (showLoading = false) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }
  const result = await getRechargeApi();
  cacheManager.setCache("recharge", result);
  layoutRef.value.complete();
  handleResData(result);
};

const handleResData = (result) => {
  if (result.status && result.status != 0) {
    loading.value = false;
    return;
  }
  console.log(result);
  rechargeInfo.value = result;
  currentRate.value = result.CNYUSD;
  CNYInput.value = result.CNYUSD;
  wycznr.value = result.wycznr;
  userid.value = result.userid;

  if (result.exchange_rate_status != 1) {
    uni.$showToast({
      title: "汇率转换异常！请联系在线客服处理",
      duration: 3000,
      icon: "none",
    });
  }

  loading.value = false;
};

const getUsdtInfo = async () => {
  loading.value = true;
  loadingText.value = "加载中...";
  try {
    const result = await getUsdtInfoApi();
    cacheManager.setCache("rechargeUsdtInfo", result);
    handleResUsdtInfo(result);
  } catch (e) {
    loading.value = false;
  }
};

const handleResUsdtInfo = (result) => {
  walletUrl.value = result.msg;
  loading.value = false;
};

const handleChangeMethod = (data) => {
  params.value = {};
  currentMethodIndex.value = data.index;
  currentMethodCode.value = data.method.pay_code;
  params.value.paymentid = data.method.id;
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

const handleSubmit = async (formData) => {
  if (
    currentMethodCode.value == "zxweixin" ||
    currentMethodCode.value == "zxalipay" ||
    currentMethodCode.value == "zxpay"
  ) {
    let openPayUrl =
      domain.value +
      "/order.html?amount=" +
      formData.amount +
      "&productId=" +
      params.value.paymentid +
      "&userid=" +
      userid.value;
    // #ifdef APP-PLUS
    plus.runtime.openURL(openPayUrl);
    // #endif
    // #ifdef H5
    window.open(openPayUrl);
    // #endif
    return false;
  }

  if (rechargeInfo.value.exchange_rate_status != 1) {
    uni.$showToast({
      title: "汇率转换异常！请联系在线客服处理",
      duration: 3000,
      icon: "none",
    });
    return;
  }

  loading.value = true;
  loadingText.value = "正在提交...";

  try {
    const result = await submitRechargeApi({
      ...params.value,
      ...formData,
    });

    if (result.status && result.status != 0) {
      loading.value = false;
      uni.$showToast({
        title: result.msg,
        duration: 3000,
        icon: "none",
      });
      return;
    }

    loading.value = false;
    uni.$showModal({
      title: "提示",
      showCancel: false,
      content: result.msg,
      success: function (res) {
        if (res.confirm) {
          uni.navigateTo({
            url: routes.rechargeRecord,
          });
        }
      },
    });
  } catch (e) {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
