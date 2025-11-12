<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="签到记录"
    bgType="bg-main4"
    mode="white"
    @reachBottom="getPaginationList"
  >
    <view
      class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col"
    >
      <Empty title="暂无相关记录" v-if="dataList.length == 0"></Empty>
      <!-- start 列表 -->
      <view class="flex flex-col mb-[48rpx]">
        <wk-stroke-bg
          class="rounded-[8rpx] flex flex-col min-h-[200rpx] p-[32rpx] mb-[24rpx] relative"
          v-for="item in dataList"
          bgColor="#201A11E5"
          style="border: 1px solid rgba(255, 255, 255, 0.30);border-radius: 24rpx;"
          :key="item.id"
        >
          <view class="flex flex-col">
            <view class="flex flex-row justify-between mt-[16rpx]">
              <text class="text-lg text-white font-medium">{{ item.moneylog_notice }}</text>
              <text class="text-2xl font-semibold linegradient_text">{{
                  item.moneylog_status + "" + item.moneylog_money
                }}</text> 
            </view>
            
            <view class="flex flex-row justify-between mt-[16rpx]">
              <text class="text-base text-white/50">{{
                item.created_at
              }}</text>
              
            </view>
          </view>
          <!-- 股权 -->
          <template v-if="item.danwei == '股'">
            <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

            <view class="flex flex-row justify-between items-center leading-5">
              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">原有股权</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_yuanamount
                }}</text>
              </view>

              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">现有股权</text>
                <text class="text-lg font-bold mt-[8rpx]  text-white">{{
                  item.moneylog_houamount
                }}</text>
                
              </view>
            </view>
          </template>

          <!-- 积分 -->
          <template v-else-if="item.danwei == '分'">
              <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

            <view class="flex flex-row justify-between items-center leading-5">
              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">原有积分</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_yuanamount
                }}</text>
                
              </view>

              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">现有积分</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_houamount
                }}</text>
                
              </view>
            </view>
          </template>

          <!-- 贷款 -->
          <template v-else-if="item.danwei == '款'">
            <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

            <view class="flex flex-row justify-between items-center leading-5">
              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">原有贷款额度</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_yuanamount
                }}</text>
              </view>

              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">现有贷款额度</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_houamount
                }}</text>
              </view>
            </view>
          </template>

          <!-- 推广奖励 -->
          <template v-else-if="item.danwei == '金'">
            <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

            <view class="flex flex-row justify-between items-center leading-5">
              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">原有推广奖励</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_yuanamount
                }}</text>
                
              </view>

              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">现有推广奖励</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_houamount
                }}</text>
                
              </view>
            </view>

            <template v-if="item.isext == 1">
              <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

              <view
                class="flex flex-row justify-between items-center leading-5"
              >
                <view class="flex flex-col items-start">
                  <text class="text-base text-neutral-light">{{
                    item.moneylog_ext.split("_")[0] +
                    "：" +
                    item.moneylog_ext.split("_")[1]
                  }}</text>
                  <text class="text-lg font-bold mt-[8rpx]">{{
                    "基础收益：" + item.moneylog_ext.split("_")[2]
                  }}</text>
                </view>
              </view>
            </template>
          </template>

          <!-- 投资 -->
          <template v-else-if="item.danwei == '元'">
            <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

            <view class="flex flex-row justify-between items-center leading-5">
              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">原有投资金额</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_yuanamount
                }}</text>
              </view>

              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">现有投资金额</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_houamount
                }}</text>
              </view>
            </view>

            <template v-if="item.isext == 1">
              <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

              <view
                class="flex flex-row justify-between items-center leading-5"
              >
                <view class="flex flex-col items-start">
                  <text class="text-lg font-bold mt-[8rpx]">{{
                    "基础收益：" + item.moneylog_ext.split("_")[2]
                  }}</text>
                  <text class="text-base">{{
                    item.moneylog_ext.split("_")[0] +
                    "：" +
                    item.moneylog_ext.split("_")[1]
                  }}</text>
                </view>
              </view>
            </template>
          </template>

          <!-- 投资 -->
          <template v-else-if="item.danwei == '现'">
            <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

            <view class="flex flex-row justify-between items-center leading-5">
              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">原有提现金额</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_yuanamount
                }}</text>
              </view>

              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">现有提现金额</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_houamount
                }}</text>
              </view>
            </view>

            <template v-if="item.isext == 1">
              <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

              <view
                class="flex flex-row justify-between items-center leading-5"
              >
                <view class="flex flex-col items-start">
                  <text class="text-base text-neutral-regular">{{
                    item.moneylog_ext.split("_")[0] +
                    "：" +
                    item.moneylog_ext.split("_")[1]
                  }}</text>
                  <text class="text-lg font-bold mt-[8rpx]">{{
                    "基础收益：" + item.moneylog_ext.split("_")[2]
                  }}</text>
                </view>
              </view>
            </template>

            <template
              v-if="item.isext == 1 && item.moneylog_ext.split('_').length > 2"
            >
            <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

              <view
                class="flex flex-row justify-between items-center leading-5"
              >
                <view class="flex flex-col items-start">
                  <text class="text-base text-neutral-regular">{{
                    item.moneylog_ext.split("_")[1].split(":")[0] +
                    "：" +
                    item.moneylog_ext.split("_")[1].split(":")[1]
                  }}</text>
                  <text class="text-lg font-bold mt-[8rpx]"></text>
                </view>
              </view>
            </template>
          </template>

          <!-- 投资 -->
          <template v-else-if="item.danwei == '利'">
            <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

            <view class="flex flex-row justify-between items-center leading-5">
              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">原有提现金额</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_yuanamount
                }}</text>
              </view>

              <view class="flex flex-col items-start">
                <text class="text-base text-white/50">现有提现金额</text>
                <text class="text-lg font-bold mt-[8rpx] text-white">{{
                  item.moneylog_houamount
                }}</text>
              </view>
            </view>

            <template v-if="item.isext == 1">
              <view class="w-full h-[1rpx] bg-neutral-divider flex flex-row my-[16rpx]"></view>

              <view
                class="flex flex-row justify-between items-center leading-5"
              >
                <view class="flex flex-col items-start">
                  <text class="text-base text-neutral-regular">{{
                    item.moneylog_ext.split("_")[0] +
                    "：" +
                    item.moneylog_ext.split("_")[1]
                  }}</text>
                  <text class="text-lg font-bold mt-[8rpx]">{{
                    "基础收益：" + item.moneylog_ext.split("_")[2]
                  }}</text>
                  
                </view>
              </view>
            </template>
          </template>
        </wk-stroke-bg>
      </view>
      <!-- end 列表 -->
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import {
  onLoad,
  onShow,
  onReachBottom,
  onPullDownRefresh,
} from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateTo } from "@/utils/navigation";

import CommonTips from "@/components/base/common-tips";
import Empty from "@/components/base/empty";

import { formatPrice } from "@/utils/utils";

import { getLogList as getLogListApi } from "@/api/user";

const page = ref(1);
const dataList = ref([]);

const layoutRef = ref(null);

const symbolStore = useSymbolStore();

const pullType = ref("");

const loadFinish = ref(false);

const loading = ref(false);
const loadingText = ref('加载中...')

const lock = ref(false)

onLoad((options) => {
  getLogList();
});

const handleRefresh = () => {
  pullType.value = "down";
  loadFinish.value = false;
  page.value = 1;
  getLogList();
};

// 上拉加载
onReachBottom(() => {
  if (loadFinish.value) return;

  getPaginationList();
});

const getPaginationList = () => {
  if (loadFinish.value) return;
  if (lock.value) return ;
  pullType.value = "up";

  console.log("up");

  page.value++;

  getLogList();
};

const getLogList = async (showLoading = true) => {
  if (lock.value) return ;
  lock.value = true;
  if (showLoading) {
    loading.value = true;
    loadingText.value = '加载中...'
  }

  const result = await getLogListApi({
    page: page.value,
    id: "all",
    sortid: 7, //类型
    times: 0, //时间
  });

  lock.value = false;
  uni.stopPullDownRefresh();
  layoutRef.value.complete();
  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });

    return;
  }

  if (pullType.value == "down") {
    dataList.value = [];
  }

  dataList.value = dataList.value.concat(result.list.data);

  if (result.list.current_page >= result.list.last_page) {
    loadFinish.value = true;
  }

  console.log("充值列表", result);

  loading.value = false;
};
</script>

<style lang="scss">
.linegradient_text{
  background: linear-gradient(110deg, #FFF 6.48%, #FFDABD 83.04%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>