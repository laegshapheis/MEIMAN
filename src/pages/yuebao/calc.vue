<template>
  <layout navTitle="余额宝复利计算器" bgType="bg-main2" :isLottie="false">
    <view class="p-[32rpx] box-border w-full flex flex-col">
      <view class="flex flex-col bg-[#1F197D] p-[32rpx] rounded-[24rpx]">
        <view
          class="flex items-center py-[34rpx] border-solid border-[rgba(255,255,255,0.25)] border-b-[0.5px] border-t-0 border-l-0 border-r-0">
          <view class="flex flex-row items-center justify-between">
            <text class="text-base leading-6 font-medium">余额宝金额({{ symbolStore.symbol }})</text>
          </view>
          <view class="flex flex-row items-center justify-center h-[44rpx] flex-1">
            <uv-input class="h-[44rpx]" inputAlign="right" maxlength="7" v-model="amount" type="digit"
              placeholder="请输入余额宝金额" border="0" :placeholderStyle="{
                color: $colors.secondary,
                fontSize: '28rpx',
              }" fontSize="28rpx" :color="$colors.DEFAULT" @input="handleAmountInput" />
          </view>
        </view>
        <view
          class="flex items-center py-[34rpx] border-solid border-[rgba(255,255,255,0.25)] border-b-[0.5px] border-t-0 border-l-0 border-r-0">
          <view class="flex flex-row items-center">
            <text class="text-base leading-6 font-medium">利率(%)</text>
          </view>
          <view class="flex flex-row items-center justify-center h-[44rpx] flex-1">
            <uv-input class="h-[44rpx]" inputAlign="right" v-model="rate" type="digit" placeholder="请输入利率" border="0" :placeholderStyle="{
              color: $colors.secondary,
              fontSize: '28rpx',
            }" fontSize="28rpx" :color="$colors.DEFAULT" @input="handleRateInput" />
          </view>
        </view>
        <view
          class="flex items-center py-[34rpx] border-solid border-[rgba(255,255,255,0.25)] border-b-[0.5px] border-t-0 border-l-0 border-r-0">
          <view class="flex flex-row items-center">
              <text class="text-base leading-6 font-medium">时间(天)</text>
            </view>

            <view class="flex flex-row items-center justify-center h-[44rpx] flex-1">
              <uv-input class="h-[44rpx]" inputAlign="right" v-model="days" type="number" maxlength="3" placeholder="请输入时间" border="0"
                :placeholderStyle="{
                  color: $colors.secondary,
                  fontSize: '28rpx',
                }" fontSize="28rpx" :color="$colors.DEFAULT" @input="handleDaysInput" />

            </view>
        </view>

       
        <view class="mt-[46rpx] py-[16rpx]">
          <wk-button height="80rpx" fontSize="32rpx" borderRadius="80rpx" @submit="calc">
            计算收益
          </wk-button>
        </view>
      </view>

      <!-- 结果弹窗 -->
      <uv-popup ref="resultPopup" type="bottom" bgColor="transparent" :safeAreaInsetBottom="true">
        <view class="flex flex-col bg-[rgba(31,25,125,1)] overflow-hidden rounded-t-[24rpx]" v-if="result.list.length > 0">
          <!-- 总计本息区域 -->
          <view
            class="w-full border-b border-[rgba(71,81,84,0.2)] border-solid border-[0.5px] box-border flex flex-col items-center py-[26rpx]">
            <view class="flex flex-col justify-center items-center">
              <text class="text-white text-lg leading-[44rpx] font-medium text-center">总计本息</text>
              <text class="text-white text-xl leading-[48rpx] font-bold text-center mt-[8rpx]">
                {{ result.total_interest }} {{ symbolStore.symbol }}
              </text>
            </view>
          </view>
          <scroll-view scroll-y class="w-full flex flex-col" :style="{ maxHeight: '800rpx' }">
            <!-- 表格区域 -->
            <view class="w-full box-border flex flex-col items-center px-[32rpx]">
              <view class="w-full box-border  overflow-hidden rounded-[32rpx] bg-[rgba(18,30,62,1)] flex flex-col">
                <!-- 表头 -->
                <view
                  class="w-full box-border overflow-hidden border-[rgba(255,255,255,0.25)] border-solid border-b-[0.5px] border-t-0 border-l-0 border-r-0 box-border flex flex-row justify-end items-center px-[32rpx] py-[22rpx]">
                  <view class="w-full flex flex-row justify-start items-center">
                    <text class="w-[155.5rpx] text-white text-[30rpx] leading-[48rpx] font-normal text-left">收款日期</text>
                    <text
                      class="w-[155.5rpx] text-white text-[30rpx] leading-[48rpx] font-normal text-center">收回本金</text>
                    <text
                      class="w-[155.5rpx] text-white text-[30rpx] leading-[48rpx] font-normal text-center">收回利息</text>
                    <text
                      class="w-[155.5rpx] text-white text-[30rpx] leading-[48rpx] font-normal text-right">剩余本金</text>
                  </view>
                </view>

                <!-- 数据行 -->
                <view
                  class="w-full overflow-hidden border-[rgba(12,5,47,1)] border-solid border-b-[0.5px] border-t-0 border-l-0 border-r-0 box-border flex flex-row items-center px-[32rpx] py-[22rpx]"
                  v-for="(item, index) in result.list" :key="index">
                  <view class="w-full flex flex-row justify-start items-center">
                    <text
                      class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-left whitespace-nowrap">{{
                        item.date
                      }}</text>
                    <text class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-center">{{
                      item.return_amount }}</text>
                    <text class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-center">{{
                      item.interest }}</text>
                    <text class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-right">{{
                      item.amount }}</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 提示文字 -->
            <view class="w-full flex flex-row justify-center items-center py-[16rpx]">
              <text class="text-[#B676FF] text-sm leading-[36rpx] font-normal">计算结果仅供参考！投资收益以真实数据为准</text>
            </view>
          </scroll-view>

          <!-- 按钮区域 -->
          <view class="w-full flex flex-col items-center">
            <view class="w-full box-border flex flex-col items-center py-[16rpx] px-[64rpx]">
              <wk-button height="80rpx" fontSize="30rpx" @submit="closeResultPopup">我知道了</wk-button>
            </view>
          </view>
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
