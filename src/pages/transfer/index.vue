<template>
  <layout navTitle="我要转账" bgType="bg-main2" :isLottie="false" ref="layoutRef" :refresher="true"
    @onRefresh="handleRefresh">
    <template v-slot:navRight>
      <view class="flex flex-row w-full items-center justify-end bg-white/10 rounded-full p-[12rpx]"
        @click="navigateTo(routes.transferRecord)">
        <image src="/static/images/recharge/list_search.svg" mode="widthFix" class="w-[32rpx] h-[32rpx]"></image>
      </view>
    </template>

    <view class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col">
      <!-- start 顶部汇总信息 -->
      <view class="flex flex-row justify-start mx-auto w-full h-[112rpx] rounded-[24rpx] bg-card3">
        <view class="flex flex-row items-center justify-center w-[100%] px-[28rpx] py-[41rpx] gap-[10rpx]">
          <image class="w-[48rpx] h-[48rpx]" src="/static/images/profile/transfer_card_icon.png" mode="widthFix">
          </image>
          <text class="font-medium text-lg text-white">我的收款账号: {{ userInfo.invicode }}</text>
          <view class="grow flex flex-row justify-end text-white text-base font-medium" @click="copyCode">
            <image src="/static/images/profile/tranfer_copy.png" mode="widthFix" class="w-[32rpx] h-[32rpx]"></image>
          </view>
        </view>
      </view>
      <!-- end 顶部汇总信息 -->

      <!-- start 转账表单 -->
      <view class="flex flex-col mt-[64rpx]">
        <view class="flex flex-row items-center justify-between mb-[22rpx]">
          <text class="text-lg leading-6 font-medium text-neutral">转账信息</text>
          <text class="text-base leading-6 text-neutral" @click="openContact">历史收款人</text>
        </view>

        <view class="flex flex-row items-center justify-center h-[120rpx] input-bg rounded-[24rpx]">
          <uv-input class="h-[120rpx]" v-model="params.tname" type="text" placeholder="请输入会员姓名" :formatter="formatName"
            border="0" :placeholderStyle="{
              color: $colors.secondary,
              fontSize: '32rpx',
              fontWeight: 'normal',
            }" :customStyle="{
                fontWeight: 'bold',
              }" fontSize="32rpx" :color="$colors.DEFAULT" />
        </view>

        <view
          class="flex flex-row items-center justify-center h-[120rpx] mt-[32rpx] input-bg rounded-[24rpx]">
          <uv-input class="h-[120rpx]" v-model="params.zhuanuser" type="number" maxlength="8" placeholder="请输入会员的收款账号"
            border="0" :placeholderStyle="{
              color: $colors.secondary,
              fontSize: '32rpx',
              fontWeight: 'normal',
            }" :customStyle="{
                fontWeight: 'bold',
              }" fontSize="32rpx" :color="$colors.DEFAULT" />
        </view>

        <view class="flex flex-row items-center justify-between mt-[66rpx] mb-[22rpx]">
          <text class="text-lg leading-6 font-medium">请选择接收方式</text>
        </view>

        <view class="flex flex-row items-center h-[120rpx] bg-wraper rounded-[24rpx]">
          <wk-picker style="width: 100%" @change="handleChangeTransferInMethod" rangeKey="title"
            :range="transferInMethodList">
            <view class="flex flex-row justify-between px-[30rpx]">
              <text class="text-lg text-neutral-secondary" v-if="currentInMethodIndex == -1">请选择接收方式</text>
              <text class="text-lg font-bold" v-if="currentInMethodIndex >= 0">{{
                transferInMethodList[currentInMethodIndex].title }}</text>
              <view class="flex flex-row items-center"><uv-icon size="24rpx" name="arrow-right"></uv-icon></view>
            </view>
          </wk-picker>
        </view>
        <!-- 转出方式 -->
        <view class="flex flex-row items-center justify-between mt-[66rpx] mb-[22rpx]">
          <text class="text-lg leading-6 font-medium">请选择转出方式</text>
        </view>

        <view class="flex flex-row items-center h-[120rpx] bg-wraper rounded-[24rpx]">
          <wk-picker class="dkh_btn" style="width: 100%" @change="handleChangeTransferOutMethod" rangeKey="title"
            :range="transferOutMethodList">
            <view class="flex flex-row justify-between px-[30rpx]">
              <text class="text-lg text-neutral-secondary" v-if="currentOutMethodIndex == -1">请选择转出方式</text>
              <text class="text-lg font-bold" v-if="currentOutMethodIndex >= 0">{{
                transferOutMethodList[currentOutMethodIndex].title }}</text>
              <view class="flex flex-row items-center"><uv-icon size="24rpx" name="arrow-right"></uv-icon></view>
            </view>
          </wk-picker>
        </view>

        <view class="flex flex-row items-center justify-between mt-[22rpx]" v-if="+userInfo.tixianzhanghu">
          <text class="text-base leading-6">从 <text class="text-neutral-error">提现余额</text> 转出
            <text class="text-neutral-error">奖励{{ userInfo.tixianzhanghu }}%</text></text>
        </view>

        <!-- 转账金额 -->
        <view class="flex flex-row justify-between mt-[66rpx] mb-[22rpx]">
          <text class="w-[150rpx] text-lg leading-6 font-medium">转账金额</text>
          <text class="text-2xs leading-6 font-medium text-neutral-regular">投资余额 {{ userInfo.amount }} {{
            symbolStore.code
            }}，提现余额
            {{ userInfo.txmoney }} {{ symbolStore.code }}</text>
        </view>

        <view class="flex flex-col input-bg2 p-[32rpx] pb-0">
          <view class="flex flex-row items-center">
            <text class="text-xl text-neutral">{{ symbolStore.symbol }}</text>
            <uv-input v-model="params.zhuanmoney" type="digit" maxlength="7" placeholder="请输入转账金额(对方到账金额)" border="0"
              :placeholderStyle="{
                color: $colors.secondary,
                fontSize: '32rpx',
                fontWeight: 'normal',
              }" :customStyle="{
                  fontWeight: 'bold',
                }" fontSize="36rpx" :color="$colors.DEFAULT" @input="handleZhuanMoneyInput" />
          </view>
          <view class="h-[2rpx] w-full bg-neutral-divider mt-[24rpx]"></view>
          <view class="flex flex-row items-center py-[24rpx] justify-between">
            <text class="text-base text-neutral-theme">1 {{ symbolStore.exchangeUsdtLabel }} = {{ currentRate }}
              CNY</text>
            <text class="text-base text-neutral-theme">
              等值汇率参考
              {{ calcAmount || "0" }}
              {{ symbolStore.value == "USDT" ? "CNY" : "USDT" }}
            </text>
          </view>
        </view>

        <!-- 按钮 -->
        <view class="bg-neutral-bottomBtnBg fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx]">
          <wk-button height="80rpx" fontSize="30rpx" @submit="prepareSubmit">
            申请转账
          </wk-button>
        </view>

        <!-- start 提示 -->
        <view class="flex flex-col justify-between mt-[40rpx] mb-[200rpx]">
          <!-- <view class="mb-[40rpx]">
            <text class="text-lg font-medium">温馨提示：</text>
          </view> -->

          <view class="text-base leading-6">
            <CommonTips :content="userInfo.zhuancontent"></CommonTips>
          </view>
        </view>
        <!-- end 提示 -->
      </view>
      <!-- end 转账表单 -->
    </view>

    <contact-list v-model:show="contactListShow" @onSelect="handleContactSelect"></contact-list>
    <wk-code-input ref="keywordRef" :value="pwdPay" @finish="handleSubmit" />
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, watch } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateTo } from "@/utils/navigation";
import { routes } from "@/config/routes";
import CommonTips from "@/components/base/common-tips";
import { formatPrice } from "@/utils/utils";
import {
  getRecharge as getRechargeApi,
  getUserInfo as getUserInfoApi,
  transfer as transferApi,
} from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const cacheUserInfo = cacheManager.getCache("rechargeUserInfo");
const cacheRecharge = cacheManager.getCache("recharge");

const contactListShow = ref(false); // 联系人列表弹窗
// 支付密码
const pwdPay = ref("");
const keywordRef = ref(null);
const symbolStore = useSymbolStore();
const calcAmount = ref(0);
const layoutRef = ref(null);
const loading = ref(false);
const loadingText = ref("");
const handleRefresh = async () => {
  await getRecharge();
  layoutRef.value.complete();
};
const openContact = () => {
  contactListShow.value = true;
};
const formatName = (val) => {
  return val.replace(/[^\u4e00-\u9fa5\u00B7]/g, "");
};
const params = ref({});
onShow(() => {
  if (cacheUserInfo) {
    handleResUserInfo(cacheUserInfo);
  }
  if (cacheRecharge) {
    handleResData(cacheRecharge);
  }
  getRecharge();
  getUserInfo();
});
const handleClickTransferOutMethod = () => {
  if (currentInMethodIndex.value == -1) {
    uni.$showToast({
      title: "请先选择接收方式",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
};

const handleZhuanMoneyInput = (val) => {
  if (symbolStore.value == "USDT") {
    calcAmount.value = formatPrice(val * currentRate.value);
  } else {
    calcAmount.value = formatPrice((val * 100) / (currentRate.value * 100));
  }
};

const handleContactSelect = (item) => {
  params.value.tname = item.name;
  params.value.zhuanuser = item.account;
};

const currentRate = ref(1); //汇率
const rechargeInfo = ref({
  Payments: [],
});
const userInfo = ref({}); // 用户资料

const transferInMethodList = ref([]); // 接收方式
const transferOutMethodList = ref([]); // 转出方式

const currentInMethodIndex = ref(-1); // 当前接收方式
const currentOutMethodIndex = ref(-1); // 当前转出方式
const handleResData = (result) => {
  if (result.status && result.status != 0) {
    loading.value = false;
    return;
  }

  rechargeInfo.value = result;
  currentRate.value = result.CNYUSD;

  console.log("充值", result);
  const inList = [];
  if (result.accept_tz == 1) {
    inList.push({
      title: "转到对方的投资余额",
      id: 1,
    });
  }

  if (result.accept_tx == 1) {
    inList.push({
      title: "转到对方的提现余额(此操作无任何奖励)",
      id: 2,
    });
  }

  transferInMethodList.value = inList;

  const outList = [];
  if (result.send_tz == 1) {
    outList.push({
      title: "从投资余额转出",
      id: 1,
    });
  }
  if (result.send_tx == 1) {
    outList.push({
      title: "从提现余额转出",
      id: 2,
    });
  }
  transferOutMethodList.value = outList;
  console.log("充值", result);

  loading.value = false;
};
const getRecharge = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  try {
    const result = await getRechargeApi();
    cacheManager.setCache("recharge", result);
    handleResData(result);
  } catch (e) {
    loading.value = false;
    console.error("获取充值信息失败", e);
  }
};

const handleResUserInfo = (result) => {
  if (result.status && result.status != 0) {
    loading.value = false;
    return;
  }
  userInfo.value = result;
  console.log("用户", result);
  loading.value = false;
};
const getUserInfo = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }
  const result = await getUserInfoApi();
  cacheManager.setCache("rechargeUserInfo", result);
  handleResUserInfo(result);
};

const copyCode = () => {
  uni.setClipboardData({
    data: userInfo.value.invicode,
    success: function () {
      uni.$showToast({
        title: "复制成功",
        icon: "none",
        duration: 3000,
      });
    },
  });
};

const handleChangeTransferInMethod = (e, item) => {
  currentInMethodIndex.value = e.detail.value;
  params.value.zhuanid = transferInMethodList.value[e.detail.value].id;
};

const handleChangeTransferOutMethod = (e) => {
  currentOutMethodIndex.value = e.detail.value;
  params.value.cardid =
    transferOutMethodList.value[currentOutMethodIndex.value].id;
};

const prepareCheck = () => {
  if (!params.value.tname) {
    uni.$showToast({
      title: "请输入会员姓名",
      duration: 3000,
      icon: "none",
    });

    return false;
  }

  const reg_name = /^[\u4E00-\u9FA5\u00B7]{2,15}$/;
  if (!reg_name.test(params.value.tname)) {
    uni.$showToast({
      title: "姓名不为空或格式不对",
      duration: 3000,
      icon: "none",
    });

    return false;
  }

  if (!params.value.zhuanuser) {
    uni.$showToast({
      title: "请输入收款账号",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (params.value.zhuanuser.length < 6) {
    uni.$showToast({
      title: "收款账号限制6～8位",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (currentInMethodIndex.value == -1) {
    uni.$showToast({
      title: "请选择接收方式",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  let amount = params.value.zhuanmoney;
  if (!amount) {
    uni.$showToast({
      title: "请输入转账金额",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  amount = parseFloat(amount);

  if (amount < Math.abs(userInfo.value.mixzhuan)) {
    uni.$showToast({
      title: "最低转账金额" + userInfo.value.mixzhuan + " " + symbolStore.code,
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (amount > Math.abs(userInfo.value.amount) && params.value.cardid == 1) {
    uni.$showToast({
      title:
        "转账金额不能大于投资余额" +
        userInfo.value.amount +
        " " +
        symbolStore.code,
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (amount > Math.abs(userInfo.value.txmoney) && params.value.cardid == 2) {
    uni.$showToast({
      title:
        "转账金额不能大于提现金额" +
        userInfo.value.txmoney +
        " " +
        symbolStore.code,
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (currentOutMethodIndex.value == -1) {
    uni.$showToast({
      title: "请选择转出方式",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  return true;
};

const prepareSubmit = () => {
  if (!prepareCheck()) return false;

  // 调支付密码
  keywordRef.value.open();
};

const handleSubmit = async (value) => {
  pwdPay.value = value;
  keywordRef.value.close();

  if (!prepareCheck()) return false;

  console.log(pwdPay.value);

  if (!pwdPay.value || pwdPay.value.length < 6) {
    uni.$showToast({
      title: "请输入支付密码",
      duration: 3000,
      icon: "none",
    });

    return false;
  }

  params.value.paypwd = value;

  loading.value = true;
  loadingText.value = "转账提交中...";

  try {
    const result = await transferApi(params.value);
    if (result.status == 0) {
      uni.$showModal({
        title: "提示",
        showCancel: false,
        content: result.msg,
        success: function (res) {
          if (res.confirm) {
            uni.navigateTo({
              url: routes.transferRecord,
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
    loading.value = false;
  } catch (e) {
    loading.value = false;
    console.error(e);
  }
};
</script>

<style lang="scss" scoped></style>