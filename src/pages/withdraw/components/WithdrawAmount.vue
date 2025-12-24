<template>
  <view class="flex flex-col">
    <view class="flex flex-row items-center justify-between mb-[22rpx]">
      <text class="text-lg leading-6 font-medium text-neutral">提现金额</text>
      <text class="text-base leading-6 text-neutral">提现余额 {{ withdrawInfo.tixinmoney }} {{ symbolStore.code }}</text>
    </view>

    <view class="flex flex-row items-center justify-center h-[120rpx] input-bg rounded-[24rpx]">
      <text class="text-2xl ml-[32rpx]">{{ symbol }}</text>
      <uv-input class="h-[120rpx]" v-model="amount" type="digit" placeholder="请输入提现金额" border="0" maxlength="10"
        @change="handleAmountChange" :placeholderStyle="{
          color: $colors.secondary,
          fontSize: '32rpx',
          fontWeight: 'normal',
        }" fontSize="36rpx" :customStyle="{
          fontWeight: 'bold',
        }" :color="$colors.DEFAULT" />
    </view>

    <!-- USDT钱包提现 (cardid==4) -->
    <view class="flex flex-col" v-if="
      currentMethodIndex >= 0 &&
      withdrawMethodList[currentMethodIndex].cardid == 4
    ">
      <!-- USDT转USDT情况 -->
      <template v-if="symbolStore.value == 'USDT'">
        <view class="flex flex-row items-center justify-between mt-[10rpx]">
          <text v-if="withdrawInfo.tixian_usdt_fee == 0" class="text-base leading-6 font-medium text-neutral-theme">实际到账
            {{ usdtAmount || 0 }} USDT</text>
        </view>
        <view v-if="withdrawInfo.tixian_usdt_fee > 0"
          class="flex flex-row items-center flex-wrap text-base leading-6 font-medium text-neutral-theme mt-[8rpx]">
          <view class="flex flex-row items-center">
            <text class="text-neutral mr-[10rpx]">提现手续费</text>
            <text class="text-neutral-error mr-[20rpx]">{{ withdrawInfo.tixian_usdt_fee || 0 }} USDT</text>
          </view>
          <view class="flex flex-row items-center">
            <text class="text-neutral mr-[10rpx]">实际到账</text>
            <text class="text-neutral-error">{{
              usdtAmount - withdrawInfo.tixian_usdt_fee > 0
                ? formatPrice(usdtAmount - withdrawInfo.tixian_usdt_fee)
                : 0
            }}
              USDT</text>
          </view>
        </view>
      </template>

      <!-- CNY转USDT情况 -->
      <template v-else-if="symbolStore.value == 'CNY'">
        <view class="flex flex-row items-center justify-between mt-[10rpx]">
          <text class="text-base leading-6 font-medium text-neutral-theme">{{ currentRate }} CNY = 1 USDT</text>
          <text v-if="withdrawInfo.tixian_usdt_fee == 0" class="text-base leading-6 font-medium text-neutral-theme">实际到账
            {{ usdtAmount || 0 }} USDT</text>
        </view>
        <!-- CNY转USDT有手续费情况 -->
        <view v-if="withdrawInfo.tixian_usdt_fee > 0"
          class="flex flex-row items-center flex-wrap text-base leading-6 font-medium text-neutral-error mt-[10rpx]">
          <view class="flex flex-row items-center">
            <text class="text-neutral mr-[10rpx]">提现手续费</text>
            <text class="text-neutral-theme mr-[20rpx]">{{ withdrawInfo.tixian_usdt_fee || 0 }} USDT</text>
          </view>
          <view class="flex flex-row items-center">
            <text class="text-neutral mr-[10rpx]">实际到账</text>
            <text class="text-neutral-theme">{{
              usdtAmount - withdrawInfo.tixian_usdt_fee > 0
                ? formatPrice(usdtAmount - withdrawInfo.tixian_usdt_fee)
                : 0
            }}
              USDT</text>
          </view>
        </view>
      </template>
    </view>

    <!-- 其他微信，支付宝，银行卡提现方式  -->
    <view class="flex flex-col" v-else-if="
      currentMethodIndex >= 0 &&
      withdrawMethodList[currentMethodIndex].cardid != 0
    ">
      <!-- USDT转CNY情况 -->
      <template v-if="symbolStore.value == 'USDT'">
        <view class="flex flex-row items-center justify-between mt-[10rpx]">
          <text class="text-base leading-6 font-medium text-neutral-theme">1 {{ symbolStore.exchangeUsdtLabel }} = {{
            currentRate }} CNY</text>
          <text v-if="withdrawInfo.tixian_cny_fee == 0" class="text-base leading-6 font-medium text-neutral-theme">实际到账
            {{ cnyAmount || 0 }} CNY</text>
        </view>
        <!-- USDT转CNY有手续费情况 -->
        <view v-if="+withdrawInfo.tixian_cny_fee != 0"
          class="flex flex-row items-center flex-wrap text-base leading-6 font-medium text-neutral-error mt-[10rpx]">
          <view class="flex flex-row items-center">
            <text class="text-neutral mr-[10rpx]">提现手续费</text>
            <text class="text-neutral-theme mr-[20rpx]">{{ withdrawInfo.tixian_cny_fee }}%
              {{
                formatPrice((cnyAmount * withdrawInfo.tixian_cny_fee) / 100)
              }}
              CNY</text>
          </view>
          <view class="flex flex-row items-center">
            <text class="text-neutral mr-[10rpx]">实际到账</text>
            <text class="text-neutral-theme">{{
              formatPrice(
                cnyAmount -
                formatPrice((cnyAmount * withdrawInfo.tixian_cny_fee) / 100)
              )
            }}
              CNY</text>
          </view>
        </view>
      </template>

      <!-- CNY转CNY情况 -->
      <template v-else-if="symbolStore.value == 'CNY'">
        <!-- CNY转CNY有手续费情况 -->
        <view v-if="+withdrawInfo.tixian_cny_fee != 0"
          class="flex flex-row items-center flex-wrap text-base leading-6 font-medium text-neutral-error mt-[10rpx]">
          <view class="flex flex-row items-center">
            <text class="text-neutral mr-[10rpx]">提现手续费</text>
            <text class="text-neutral-theme mr-[20rpx]">{{ withdrawInfo.tixian_cny_fee }}%
              {{
                formatPrice((cnyAmount * withdrawInfo.tixian_cny_fee) / 100)
              }}
              CNY</text>
          </view>
          <view class="flex flex-row items-center">
            <text class="text-neutral mr-[10rpx]">实际到账</text>
            <text class="text-neutral-theme">{{
              formatPrice(
                cnyAmount -
                formatPrice((cnyAmount * withdrawInfo.tixian_cny_fee) / 100)
              )
            }}
              CNY</text>
          </view>
        </view>
        <!-- CNY转CNY无手续费情况 -->
        <view v-if="withdrawInfo.tixian_cny_fee == 0" class="flex flex-row items-center mt-[10rpx]">
          <text class="text-base leading-6 font-medium text-neutral-theme">实际到账 {{ cnyAmount || 0 }} CNY</text>
        </view>
      </template>
    </view>
    <!-- 提现投资余额 -->
    <view v-else-if="
      currentMethodIndex >= 0 &&
      withdrawMethodList[currentMethodIndex].cardid == 0
    ">
    </view>

    <view class="flex flex-row items-center justify-between mt-[10rpx]" v-if="+tixianzhanghu">
      <text class="text-base leading-6 font-medium">提现到 <text class="text-neutral-theme">投资余额</text> 继续投资
        <text class="text-neutral-theme">奖励{{ tixianzhanghu }}%</text></text>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import { formatPrice } from "@/utils/utils";
import { useSymbolStore } from "@/stores/symbolStore";

const symbolStore = useSymbolStore();

const props = defineProps({
  withdrawInfo: {
    type: Object,
    default: () => ({}),
  },
  symbol: {
    type: String,
    default: "",
  },
  currentMethodIndex: {
    type: Number,
    default: -1,
  },
  withdrawMethodList: {
    type: Array,
    default: () => [],
  },
  currentRate: {
    type: Number,
    default: 1,
  },
  tixianzhanghu: {
    type: [String, Number],
    default: 0,
  },
});

const emit = defineEmits(["update:amount", "update:cnyamount", "update:usdtamount"]);

const amount = ref("");
const cnyAmount = ref("");
const usdtAmount = ref("");

watch(
  () => amount.value,
  (newVal) => {
    emit("update:amount", newVal);
  }
);

watch(
  () => cnyAmount.value,
  (newVal) => {
    emit("update:cnyamount", newVal);
  }
);

watch(
  () => usdtAmount.value,
  (newVal) => {
    emit("update:usdtamount", newVal);
  }
);
const handleAmountChange = (e) => {
  if (e === "") {
    cnyAmount.value = "";
    usdtAmount.value = "";
    return;
  }

  if (symbolStore.value == "USDT") {
    // USDT转CNY，计算等值的CNY金额
    cnyAmount.value = formatPrice((e * 100 * props.currentRate) / 100);
    // USDT转USDT，usdtAmount等于输入金额
    usdtAmount.value = e;
  } else {
    // CNY转USDT，计算等值的USDT金额
    usdtAmount.value = formatPrice((e * 100) / (props.currentRate * 100));
    // CNY转CNY，cnyAmount等于输入金额
    cnyAmount.value = e;
  }
  amount.value = e;
};
</script>
