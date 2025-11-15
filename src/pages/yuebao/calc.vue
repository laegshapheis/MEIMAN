<template>
  <layout navTitle="余额宝复利计算器" bgType="bg-main">
    <view class="p-[32rpx] box-border w-full flex flex-col">
      <view class="flex flex-col" bgColor="transparent">
        <view class="flex flex-row items-center justify-between mb-[22rpx]">
          <text class="text-base leading-6 font-medium">余额宝金额</text>
        </view>

        <view
          class="flex flex-row items-center justify-center h-[96rpx] bg-neutral-inputBg rounded-[24rpx]"
        >
          <uv-input
            class="h-[96rpx]"
            maxlength="7"
            v-model="amount"
            type="digit"
            placeholder="请输入余额宝金额"
            border="0"
            :placeholderStyle="{
              color: $colors.secondary,
              fontSize: '32rpx',
            }"
            fontSize="32rpx"
            :color="$colors.DEFAULT"
            @input="handleAmountInput"
          />

          <text class="text-base text-neutral-secondary mr-[28rpx]">{{
            symbolStore.symbol
          }}</text>
        </view>
        <view class="flex flex-row">
          <view class="mr-[16rpx]">
            <view
              class="flex flex-row items-center justify-between mb-[22rpx] mt-[46rpx]"
            >
              <text class="text-base leading-6 font-medium">利率</text>
            </view>

            <view
              class="flex flex-row items-center justify-center h-[96rpx] bg-neutral-inputBg rounded-[24rpx]"
            >
              <uv-input
                class="h-[96rpx]"
                v-model="rate"
                type="digit"
                placeholder="请输入利率"
                border="0"
                :placeholderStyle="{
                  color: $colors.secondary,
                  fontSize: '32rpx',
                }"
                fontSize="32rpx"
                :color="$colors.DEFAULT"
                @input="handleRateInput"
              />

              <text class="text-base text-neutral-secondary mr-[28rpx]">%</text>
            </view>
          </view>
          <view>
            <view
              class="flex flex-row items-center justify-between mb-[22rpx] mt-[46rpx]"
            >
              <text class="text-base leading-6 font-medium">时间</text>
            </view>

            <view
              class="flex flex-row items-center justify-center h-[96rpx] bg-neutral-inputBg rounded-[24rpx]"
            >
              <uv-input
                class="h-[96rpx]"
                v-model="days"
                type="number"
                maxlength="3"
                placeholder="请输入时间"
                border="0"
                :placeholderStyle="{
                  color: $colors.secondary,
                  fontSize: '32rpx',
                }"
                fontSize="32rpx"
                :color="$colors.DEFAULT"
                @input="handleDaysInput"
              />

              <text class="text-base text-neutral-secondary mr-[28rpx]"
                >天</text
              >
            </view>
          </view>
        </view>
        <view class="mt-[46rpx] py-[16rpx]">
          <wk-button type="bg" @submit="calc">
            计算收益
          </wk-button>
        </view>
      </view>
      
      <!-- 结果弹窗 -->
      <uv-popup
        ref="resultPopup"
        type="bottom"
        bgColor="transparent"
        :safeAreaInsetBottom="true"
      >
        <view class="flex flex-col bg-white rounded-t-[40rpx]">
          <view class="flex flex-row justify-end pr-[32rpx] pt-[32rpx] flex-shrink-0">
            <view @click="closeResultPopup" class="w-[40rpx] h-[40rpx] flex items-center justify-center">
              <image src="/static/images/close_icon.svg" class="w-[40rpx] h-[40rpx]" mode="aspectFit"></image>
            </view>
          </view>
          
          <scroll-view 
            scroll-y 
            :enable-back-to-top="true"
            :style="{ height: '800rpx', maxHeight: '800rpx' }"
          >
            <view class="pb-[32rpx]">
              <wk-stroke-bg class="flex flex-col" v-if="result.list.length > 0">
                <view class="flex flex-col">
                  <view class="flex flex-row justify-between bg-neutral-theme rounded-[24rpx] px-[32rpx] py-[16rpx]">
                    <text class="text-lg text-white">总计本息</text>
                    <text class="text-lg text-white font-bold">{{
                      result.total_interest
                    }} {{ symbolStore.symbol }}</text>
                  </view>

                  <view class="mt-[32rpx] flex flex-row justify-center">
                    <text class="text-base text-neutral-secondary"
                      >计算结果仅供参考！以实际结果为准</text
                    >
                  </view>
                  
                  <view
                    class="grid grid-cols-4 justify-center items-center mt-[24rpx] gap-4 py-[20rpx] text-base border-solid border border-neutral-divider rounded-t-[24rpx] px-[32rpx] bg-[#F3F5FC]"
                  >
                    <text class="text-left">收款日期</text>
                    <text class="text-center">收回本金</text>
                    <text class="text-center">收回利息</text>
                    <text class="text-center">剩余本金</text>
                  </view>

                  <view
                    class="grid grid-cols-4 gap-4 py-[32rpx] text-base text-neutral-regular justify-center items-start border-solid border border-[length:1rpx] border-neutral-divider border-b-0 px-[32rpx]"
                    v-for="(item, index) in result.list"
                    :key="index"
                    :style="{borderBottomLeftRadius: index === result.list.length - 1 ? '24rpx' : '0rpx', borderBottomRightRadius: index === result.list.length - 1 ? '24rpx' : '0rpx', backgroundColor: index === result.list.length - 1 ? '#F3F5FC' : 'transparent'}"
                  >
                    <text class="text-left whitespace-nowrap">{{
                      item.date
                    }}</text>
                    <text class="text-center">{{ item.return_amount }}</text>
                    <text class="text-center">{{ item.interest }}</text>
                    <text class="text-right">{{ item.amount }}</text>
                  </view>
                </view>
              </wk-stroke-bg>
            </view>
          </scroll-view>
        </view>
      </uv-popup>
    </view>
  </layout>
</template>

<script setup>
import { ref, nextTick } from "vue"; 
import { useSymbolStore } from "@/stores/symbolStore";
import { yuebaoCalc } from "@/api/user";

const symbolStore = useSymbolStore();
const amount = ref("");
const rate = ref("");
const days = ref("");
const resultPopup = ref(null);
const result = ref({
  list: [],
});

const handleAmountInput = (val) => {
  setTimeout(() => {
    amount.value = parseInt(val);
  }, 0);
};

const handleDaysInput = (val) => {
  setTimeout(() => {
    days.value = parseInt(val);
  }, 0);
};

const handleRateInput = (val) => {
  let rateVal = val;
  if (val.includes('.')) {
    const parts = val.split('.');
    if (parts[1].length > 2) {
      rateVal = parts[0] + '.' + parts[1].slice(0, 2);
    }
  }
  const numVal = parseFloat(val);
  if (numVal > 30) {
    rateVal = 30;
  }
  setTimeout(() => {
    rate.value = rateVal;
  }, 0);
};

const closeResultPopup = () => {
  if (resultPopup.value) {
    resultPopup.value.close();
  }
};

const calc = async () => {
  if (!amount.value) {
    return uni.$showToast({
      title: "请输入余额宝金额",
      duration: 3000,
      icon: "none",
    });
  }

  if (!rate.value) {
    return uni.$showToast({
      title: "请输入利率",
      duration: 3000,
      icon: "none",
    });
  }

  const rateNum = parseFloat(rate.value);
  if (rateNum < 0.01 || rateNum > 30) {
    return uni.$showToast({
      title: "利率必须在0.01%到30%之间",
      duration: 3000,
      icon: "none",
    });
  }

  if (!days.value) {
    return uni.$showToast({
      title: "请输入时间",
      duration: 3000,
      icon: "none",
    });
  }

  let data = {
    amount: amount.value,
    rate: rate.value,
    days: days.value,
  };

  const res = await yuebaoCalc(data);
  if (res.status == 0) {
    result.value = res.data;
    // 打开结果弹窗
    if (resultPopup.value) {
      resultPopup.value.open("bottom");
    }
  } else {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
  }
};
</script>
