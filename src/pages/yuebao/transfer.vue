<template>
  <layout :navTitle="code == 'in' ? '余额宝转入' : '余额宝转出'" bgType="bg-main2" :isLottie="false" ref="layoutRef"
    :refresher="true" @onRefresh="handleRefresh">
    <view class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col">
      <view class="flex flex-col" v-if="code == 'out'">
        <view class="flex flex-row items-center justify-between mb-[22rpx] mt-[46rpx]">
          <text class="text-lg leading-6 font-medium text-neutral">转出方式</text>
        </view>

        <view class="flex flex-row items-center justify-center h-[120rpx] bg-wraper rounded-[24rpx]">
          <uv-input class="h-[120rpx]" v-model="outText" type="text" readonly border="0" :placeholderStyle="{
            color: $colors.light,
            fontSize: '30rpx',
          }" fontSize="30rpx" :color="$colors.DEFAULT" />

          <view class="flex flex-row mr-[22rpx]">
            <text class="text-lg mr-[5rpx] font-medium">{{ yuebaoInfo.zong_jin_e }} {{ symbolStore.code }}</text>

            <!-- <view class="flex flex-row items-center"
              ><uv-icon
                size="32rpx"
                :color="$colors.secondary"
                name="arrow-right"
              ></uv-icon
            ></view> -->
          </view>
        </view>

        <view class="flex flex-row items-center justify-between mb-[22rpx] mt-[46rpx]">
          <text class="text-lg leading-6 font-medium text-neutral">转出金额</text>
        </view>

        <view class="flex flex-row items-center justify-center h-[136rpx] input-bg  rounded-[24rpx]">
          <text class="text-2xl ml-[28rpx] font-medium">{{
            symbolStore.symbol
            }}</text>
          <uv-input class="h-[136rpx]" v-model="params.amount" type="digit"
            :placeholder="`最低转出${yuebaoInfo.minduodeli}`" maxlength="9" border="0" :placeholderStyle="{
              color: $colors.secondary,
              fontSize: '38rpx',
            }" fontSize="38rpx" :color="$colors.DEFAULT" />
        </view>

        <!-- 按钮 -->
        <view class="fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx]">
          <wk-button height="80rpx" fontSize="30rpx" borderRadius="80rpx" @submit="prepareSubmit">
            确认转出
          </wk-button>
        </view>
      </view>
      <!-- 转出 -->

      <!-- 转入 -->
      <view class="flex flex-col" v-if="code == 'in'">
        <view class="flex flex-row items-center justify-between mb-[22rpx] mt-[46rpx]">
          <text class="text-lg leading-6 font-medium text-neutral">转入方式</text>
        </view>

        <view class="flex flex-row items-center justify-center h-[120rpx] bg-wraper rounded-[24rpx]">
          <uv-input class="h-[120rpx]" v-model="inText" type="text" readonly border="0" :placeholderStyle="{
            color: $colors.light,
            fontSize: '30rpx',
          }" fontSize="30rpx" :color="$colors.DEFAULT" />

          <view class="flex flex-row mr-[22rpx]">
            <text class="text-neutral text-lg mr-[5rpx] font-medium">{{ yuebaoInfo.txmoney }} {{ symbolStore.code
              }}</text>

            <!-- <view class="flex flex-row items-center"
              ><uv-icon
                size="28rpx"
                :color="$colors.secondary"
                name="arrow-right"
              ></uv-icon
            ></view> -->
          </view>
        </view>

        <view class="flex flex-row items-center justify-between mb-[22rpx] mt-[46rpx]">
          <text class="text-lg leading-6 font-medium text-neutral">转入金额</text>
        </view>

        <view class="flex flex-row items-center justify-center h-[136rpx] input-bg rounded-[24rpx]">
          <text class="text-2xl text-neutral ml-[28rpx]">{{
            symbolStore.symbol
            }}</text>
          <uv-input class="h-[136rpx]" v-model="params.amount" type="digit"
            :placeholder="`最低转入${yuebaoInfo.minduodeli_recharge}`" maxlength="9" border="0" :placeholderStyle="{
              color: $colors.regular,
              fontSize: '40rpx',
            }" fontSize="40rpx" :color="$colors.DEFAULT" />
        </view>
        <view class="flex flex-row items-center justify-end mt-[22rpx]">
          <text class="text-base text-neutral">30天收益 </text>
          <text class="text-base text-neutral-error ml-[10rpx]">{{ profit }} {{ symbolStore.code }}</text>
        </view>

        <!-- 按钮 -->
        <view class="fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx] bg-neutral-bottomBtnBg">
          <wk-button height="80rpx" fontSize="30rpx" borderRadius="80rpx" @submit="prepareSubmit">
            确认转入
          </wk-button>
        </view>
      </view>
      <!-- 转入 -->
    </view>

    <wk-code-input ref="keywordRef" :value="pwdPay" @finish="handleSubmit" />
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { routes } from "@/config/routes";
import { truncateDecimal } from "@/utils/utils";
import {
  getYuebaoInfo as getYuebaoInfoApi,
  transferYuebaoOut as transferYuebaoOutApi,
  transferYuebaoIn as transferYuebaoInApi,
} from "@/api/user";

const symbolStore = useSymbolStore();
// 支付密码
const pwdPay = ref("");
const keywordRef = ref(null);

const loading = ref(false);
const loadingText = ref('');

const inText = ref("提现余额");
const outText = ref("余额宝余额");

const params = ref({});
const code = ref("");
const layoutRef = ref(null);
const handleRefresh = async () => {
  await getYuebaoInfo();
  layoutRef.value.complete();
};

const profit = computed(() => {
  const amount = params.value.amount || 0;
  const ratduodeli = yuebaoInfo.value.ratduodeli || 0;
  // 计算30天复利总收益
  const total =
    truncateDecimal(amount * Math.pow(1 + ratduodeli / 100, 30) - amount, 2) * 1;
  return total;
});
onLoad((options) => {
  const { type } = options;
  code.value = type;
  getYuebaoInfo();
});

onShow(() => { });

const yuebaoInfo = ref({
  minduodeli: 0,
  zong_jin_e: 0,
  minduodeli_recharge: 0,
});
const getYuebaoInfo = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = '加载中...'
  }

  try {
    const result = await getYuebaoInfoApi();

    if (result.status && result.status != 0) {
      loading.value = false;
      return;
    }

    // userInfo.value = result;

    yuebaoInfo.value = result.data;

    console.log("余额宝", result);

    loading.value = false;
  } catch (e) {
    loading.value = false;
    console.error("获取余额宝信息失败", e);
  }
};

const prepareCheck = () => {
  const amount = params.value.amount;

  if (code.value == "in") {
    if (!amount) {
      uni.$showToast({
        title: "请输转入金额！",
        duration: 3000,
        icon: "none",
      });
      return false;
    }

    if (+amount < +yuebaoInfo.value.minduodeli_recharge) {
      uni.$showToast({
        title:
          "最低转入 " +
          yuebaoInfo.value.minduodeli_recharge +
          " " +
          symbolStore.code,
        duration: 3000,
        icon: "none",
      });

      return false;
    }
  } else {
    if (!amount) {
      uni.$showToast({
        title: "请输转出金额！",
        duration: 3000,
        icon: "none",
      });

      return false;
    }

    if (+amount < +yuebaoInfo.value.minduodeli) {
      uni.$showToast({
        title:
          "最低转出 " + yuebaoInfo.value.minduodeli + " " + symbolStore.code,
        duration: 3000,
        icon: "none",
      });

      return false;
    }
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

  if (!pwdPay.value || pwdPay.value.length < 6) {
    uni.$showToast({
      title: "请输入支付密码",
      duration: 3000,
      icon: "none",
    });

    return false;
  }

  params.value.pay_passworld = value;
  params.value.money = params.value.amount;

  loading.value = true;
  loadingText.value = '提交中...'

  let result = null;
  try {
    if (code.value == "in") {
      result = await transferYuebaoInApi(params.value);
    } else {
      result = await transferYuebaoOutApi(params.value);
    }

    if (result.status == 0) {
      uni.$showModal({
        title: "提示",
        showCancel: false,
        content: code.value == "in" ? "转入成功" : "转出成功",
        success: function (res) {
          if (res.confirm) {
            uni.navigateTo({
              url: routes.yuebao,
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
