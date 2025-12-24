<template>
  <layout ref="layoutRef" navTitle="我要提现" bgType="bg-main2" :isLottie="false" :refresher="true"
    @onRefresh="handleRefresh">
    <template v-slot:navRight>
      <view class="flex flex-row w-full items-center bg-white/10 justify-end rounded-full p-[12rpx]"
        @click="navigateTo(routes.withdrawRecord)">
        <image src="/static/images/recharge/list_search.svg" mode="widthFix" class="w-[32rpx] h-[32rpx]"></image>
      </view>
    </template>

    <view class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col">
      <!-- 余额宝顶部信息 -->
      <YuebaoHeader :isduodeli="userInfo.isduodeli" />

      <!-- 提现表单 -->
      <view class="flex flex-col">
        <!-- 提现方式选择 -->
        <WithdrawMethod v-model:currentMethodIndex="currentMethodIndex" :withdrawMethodList="withdrawMethodList"
          @change="handleChangeWithdrawMethod" />

        <!-- 提现金额输入 -->
        <WithdrawAmount :withdrawInfo="withdrawInfo" :symbol="symbolStore.symbol"
          :currentMethodIndex="currentMethodIndex" :withdrawMethodList="withdrawMethodList" :currentRate="currentRate"
          :tixianzhanghu="userInfo.tixianzhanghu" v-model:amount="params.amount" v-model:usdtamount="params.usdtamount"
          v-model:cnyamount="params.cnyamount" />

        <!-- 提示信息 -->
        <view class="text-base leading-6 mt-[30rpx] mb-[150rpx] rounded-[24rpx] p-[2rpx]"
          style="border: 1rpx solid #00000020;">
          <CommonTips :content="withdrawInfo.wenxintishi"></CommonTips>
        </view>
      </view>
    </view>

    <!-- 底部提交按钮 -->
    <view class="bg-neutral-bottomBtnBg fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx] ">
      <wk-button height="80rpx" fontSize="30rpx" @submit="prepareSubmit">
        申请提现
      </wk-button>
    </view>

    <!-- 常用提现列表 -->
    <contact-list v-model:show="contactListShow" @onSelect="handleContactSelect"></contact-list>
    <wk-code-input ref="keywordRef" :value="pwdPay" @finish="handleSubmit" />
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateTo } from "@/utils/navigation";
import { routes } from "@/config/routes";

// 导入组件
import YuebaoHeader from "./components/YuebaoHeader.vue";
import WithdrawMethod from "./components/WithdrawMethod.vue";
import WithdrawAmount from "./components/WithdrawAmount.vue";
import CommonTips from "@/components/base/common-tips";
import { cacheManager } from "@/utils/cacheManager";

const cacheUserInfo = cacheManager.getCache("withdrawUserInfo");
const cacheWithdraw = cacheManager.getCache("withdraw");
import {
  getUserInfo as getUserInfoApi,
  getWithdraw as getWithdrawApi,
  submitWithdraw as submitWithdrawApi,
} from "@/api/user";

const contactListShow = ref(false);
const pwdPay = ref("");
const keywordRef = ref(null);
const loading = ref(false);
const loadingText = ref("");
const symbolStore = useSymbolStore();
const params = ref({});
const layoutRef = ref(null);

const handleRefresh = async () => {
  await getWithdraw();
  await getUserInfo();
  if (layoutRef.value) {
    layoutRef.value.complete();
  }
};

onShow(() => {
  if (cacheUserInfo) {
    handleResData(cacheUserInfo);
  }
  if (cacheWithdraw) {
    handleResDataWithdraw(cacheWithdraw);
  }
  getUserInfo();
  getWithdraw();
});

const handleContactSelect = (item) => {
  params.value.tname = item.name;
  params.value.zhuanuser = item.account;
};

const currentRate = ref(1);
const userInfo = ref({});
const currentMethodIndex = ref(-1);
const withdrawInfo = ref({});
const withdrawMethodList = ref([]);

const handleResDataWithdraw = (result) => {
  if (result.status && result.status != 0) {
    loading.value = false;
    return;
  }

  withdrawInfo.value = result;
  currentRate.value = result.TXCNYUSD;

  if (result.exchange_rate_status != 1) {
    uni.$showToast({
      title: "汇率转换异常！请联系在线客服处理",
      duration: 3000,
      icon: "none",
    });
  }

  const methodList = [
    {
      text: "提现到投资余额(等同于充值)",
      cardid: "0",
    },
  ];

  if (result.istxusdt == 1 && result.isusdt == 1) {
    methodList.push({
      text: result.usdtlian + " " + result.usdtadr,
      cardid: 4,
      type: "usdt钱包",
    });
  }

  if (result.isbank == 1 && result.isuserbank == 1) {
    const bankList = result.bank_list || [];
    bankList.forEach((item) => {
      methodList.push({
        text: item.bankname + " " + item.bankcode,
        cardid: 1,
        bankid: item.id,
        type: "银行卡",
      });
    });
  }

  if (result.iszfb == 1 && result.isalipay == 1) {
    methodList.push({
      text: "支付宝 " + result.email,
      cardid: 2,
      type: "支付宝",
    });
  }

  if (result.weixin_switch == 1 && result.is_weixin_pay == 1) {
    console.log(result)
    methodList.push({
      text: "微信 " + result.realname,
      cardid: 6,
      type: "微信",
    });
  }

  withdrawMethodList.value = methodList;
  loading.value = false;
};

const getWithdraw = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  try {
    const result = await getWithdrawApi();
    cacheManager.setCache("withdraw", result);
    handleResDataWithdraw(result);
  } catch (e) {
    loading.value = false;
    console.error("获取充值信息失败", e);
  }
};

const getUserInfo = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }
  try {
    const result = await getUserInfoApi();
    cacheManager.setCache("withdrawUserInfo", result);
    handleResData(result);
  } catch (e) {
    loading.value = false;
    console.error("获取用户信息失败", e);
  }
};

const handleResData = (result) => {
  if (result.status && result.status != 0) {
    loading.value = false;
    return;
  }
  userInfo.value = result;
  loading.value = false;
};

const handleChangeWithdrawMethod = (e) => {
  params.value.bankid = withdrawMethodList.value[e.detail.value].bankid;
  params.value.cardid = withdrawMethodList.value[e.detail.value].cardid;
};

const prepareCheck = () => {
  if (withdrawInfo.value.exchange_rate_status != 1) {
    uni.$showToast({
      title: "汇率转换异常！请联系在线客服处理",
      duration: 3000,
      icon: "none",
    });
    return;
  }

  if (currentMethodIndex.value == -1) {
    uni.$showToast({
      title: "请选择提现方式",
      duration: 3000,
      icon: "none",
    });
    return;
  }

  if (!params.value.amount) {
    uni.$showToast({
      title: "请输入提现金额",
      duration: 3000,
      icon: "none",
    });
    return;
  }

  return true;
};

const prepareSubmit = () => {
  if (!prepareCheck()) return false;
  keywordRef.value.open();
};

const handleSubmit = async (value) => {
  pwdPay.value = value;
  keywordRef.value.close();

  if (!prepareCheck()) return false;

  if (!pwdPay.value || pwdPay.value.length < 6) {
    uni.$showToast({
      title: "请输入支付密码",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  params.value.paypwd = value;
  params.value.amount = params.value.cnyamount;
  loading.value = true;
  loadingText.value = "提交中...";

  try {
    const result = await submitWithdrawApi({
      ...params.value,
      cnyamount: symbolStore.value == 'CNY' ? params.value.usdtamount : params.value.cnyamount,
      usdtamount: symbolStore.value == 'CNY' ? params.value.cnyamount : params.value.usdtamount,
    });

    loading.value = false;
    if (result.status == 0) {
      uni.$showModal({
        title: "提示",
        showCancel: false,
        content: result.msg,
        success: function (res) {
          if (res.confirm) {
            uni.navigateTo({
              url: routes.withdrawRecord,
            });
          }
        },
      });

      pwdPay.value = "";
    } else {
      uni.$showToast({
        icon: "none",
        title: result.msg,
        duration: 3000,
      });
    }
  } catch (e) {
    loading.value = false;
    console.error(e);
  }
};
</script>

<style lang="scss" scoped></style>
