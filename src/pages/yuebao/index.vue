<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="余额宝"
    bgType="bg-main"
    :isNavLeftBackClick="false"
    @navLeftClick="handelBack"
    @reachBottom="getPaginationList"
  >
    <view
      class="px-page-x pb-page-y mt-[20rpx] box-border w-full flex flex-col"
    >
      <!-- start 顶部汇总信息 -->
      <view
        class="p-[40rpx] box-border flex flex-col justify-start mx-auto w-full mix-blend-screen bg-card2 rounded-[24rpx]"
      >
        <view class="flex flex-col w-full box-border mb-[32rpx]">
          <view class="flex flex-row justify-center mb-[16rpx]">
            <view
              class="p-[24rpx] box-border rounded-[24rpx] flex flex-col justify-between flex-1 card-bg"
            >
              <text class="text-white text-xl font-bold leading-6 mt-[8rpx]"
                >{{ yuebaoInfo.zong_jin_e }}
                <text class="text-sm">{{ symbolStore.code }}</text></text
              >
              <view class="mt-[16rpx] card-bg2">
                <text
                  class="text-sm text-white py-[4rpx]"
                  >余额宝余额</text
                >
              </view>
            </view>
            <view
              class="ml-[16rpx] p-[24rpx] box-border rounded-[24rpx] flex flex-col justify-between flex-1 card-bg"
            >
              <text class="text-white text-xl font-bold leading-6 mt-[8rpx]"
                >{{ yuebaoInfo.fanl_jin_e }}
                <text class="text-sm">{{ symbolStore.code }}</text></text
              >
              <view class="mt-[16rpx] card-bg2">
                <text
                  class="mt-[16rpx] text-sm text-white py-[4rpx]"
                  >累计收益</text
                >
              </view>
            </view>
          </view>

          <view class="flex flex-row justify-center">
            <view
              class="mr-[16rpx] p-[24rpx] box-border rounded-[24rpx] flex flex-col justify-between flex-1 card-bg"
            >
              <text class="text-white text-xl font-bold"
                >{{ yuebaoInfo.txmoney }}
                <text class="text-sm">{{ symbolStore.code }}</text></text
              >
              <view class="mt-[16rpx] card-bg2">
                <text
                  class="mt-[16rpx] text-sm text-white py-[4rpx]"
                  >提现余额</text
                >
              </view>
            </view>
            <view
              class="p-[24rpx] box-border flex flex-col justify-between flex-1 card-bg"
            >
              <text class="text-white text-xl font-bold"
                >{{ yuebaoInfo.wanduodeli }}
                <text class="text-sm">{{ symbolStore.code }}</text></text
              >
              <view class="mt-[16rpx] card-bg2">
                <text
                  class="mt-[16rpx] text-sm text-white py-[4rpx]"
                  >10000{{ symbolStore.unit }}日收益约</text
                >
              </view>
            </view>
          </view>
        </view>

        <!-- start 按钮 -->
        <view class="flex flex-row justify-between">
          <view class="flex-1">
            <wk-button
              borderRadius="24rpx"
              plain
              @submit="navTo(routes.yuebaoTransfer + '?type=in')"
              :buttonStyle="{
                borderRadius: '360rpx',
                background: 'transparent',
                borderColor: '#fff',
              }"
            >
              <view class="flex flex-row items-center justify-center">
                <image
                  src="/static/images/user/yuebao_in.svg"
                  class="w-[40rpx] h-[40rpx] mr-[15rpx]"
                ></image>
                <text class="text-neutral-white">转入</text>
              </view>
            </wk-button>
          </view>

          <view class="flex-1 ml-[24rpx]">
            <wk-button
              borderRadius="24rpx"
              :buttonStyle="{
                borderRadius: '360rpx',
                background: '#ffffff',
              }"
              @submit="navTo(routes.yuebaoTransfer + '?type=out')"
            >
              <view class="flex flex-row items-center justify-center">
                <image
                  src="/static/images/user/yuebao_out.svg"
                  class="w-[40rpx] h-[40rpx] mr-[15rpx]"
                ></image>
                <text class="text-[#06F]">转出</text>
              </view>
            </wk-button>
          </view>
        </view>
        <!-- end 按钮 -->
      </view>
      <!-- end 顶部汇总信息 -->
      <wk-stroke-bg
        class="rounded-[24rpx] flex flex-row justify-between items-center px-[16rpx] py-[8rpx] mt-[24rpx]"
      >
        <view
          class="flex flex-col items-center bg-neutral-theme rounded-[24rpx] p-[16rpx]"
        >
          <text class="text-lg font-bold text-white">
            {{ yuebaoInfo.ratduodeli }}%</text
          >
          <text class="text-sm text-white">余额宝日复利</text>
        </view>
        <view
          @click="goToCalc"
          class="flex flex-col items-center rounded-[8rpx] p-[16rpx]"
        >
          <text class="text-sm text-neutral-theme mb-[8rpx]"
            >查看我的未来收益</text
          >
          <wk-button height="56rpx" fontSize="24rpx" borderRadius="16rpx">
            <view class="flex flex-row items-center justify-center">
              <image
                src="/static/images/user/yuebao_calc.svg"
                class="w-[24rpx] h-[24rpx] mr-[8rpx] mt-[2rpx]"
              ></image>
              <text class="text-white">余额宝复利计算器</text>
            </view>
          </wk-button>
        </view>
      </wk-stroke-bg>
      <view class="text-base leading-6 mt-[40rpx]">
        <CommonTips
          fontSize="28"
          color="#252C2F"
          :content="yuebaoInfo.rule_str"
        ></CommonTips>
      </view>

      <!-- start 明细 -->
      <view class="flex flex-col justify-between mt-[68rpx]">
        <view class="mb-[35rpx]">
          <text class="text-lg font-medium">余额宝明细</text>
        </view>

        <Empty title="暂无记录" v-if="dataList.length == 0" top="30rpx"></Empty>

        <view>
          <wk-stroke-bg
            class="flex flex-col min-h-[126rpx] py-[24rpx] px-[32rpx] mb-[16rpx] rounded-[16rpx]"
            v-for="item in dataList"
            :key="item.id"
          >
            <view class="flex flex-col">
              <view class="flex flex-row justify-between mt-[16rpx]">
                <text class="text-lg text-neutral font-medium">{{item.moneylog_notice}}</text>
                <text class="text-base text-neutral-error">{{item.moneylog_status + "" + item.moneylog_money}}</text>
              </view>

              <view class="flex flex-row justify-between mt-[16rpx]">
                <view class="flex flex-col">
                  <text class="text-sm text-[#252C2F]/50">
                    交易时间
                  </text>
                <text class="text-base text-neutral-regular">{{
                  item.created_at
                }}</text>
              </view>
                <view class="flex flex-col">
                  <text class="text-sm text-[#252C2F]/50"
                    >原有余额</text>
                  <text class="text-neutral">
                      {{item.moneylog_yuanamount}}
                  </text>
                </view>
                <view class="flex flex-col">
                  <text class="text-sm text-[#252C2F]/50">
                    现有余额
                  </text>
                  <text class="text-neutral">
                    {{item.moneylog_houamount}}
                  </text>
                </view>
              </view>
            </view>
          </wk-stroke-bg>
        </view>
      </view>
      <!-- end 明细 -->
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onShow, onReachBottom, onBackPress } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateTo } from "@/utils/navigation";

import { routes } from "@/config/routes";

import CommonTips from "@/components/base/common-tips";
import Empty from "@/components/base/empty";

import {
  getYuebaoInfo as getYuebaoInfoApi,
  getYuebaoLog as getYuebaoLogApi,
} from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const cacheYuebaoInfo = cacheManager.getCache("yuebaoInfo");
const cacheYuebaoLog = cacheManager.getCache("yuebaoLog");
const symbolStore = useSymbolStore();
const layoutRef = ref(null);
const loading = ref(false);
const loadingText = ref("");
const pullType = ref("");
const loadFinish = ref(false);
const lock = ref(false);
onLoad((options) => {});
onBackPress((event) => {
  if (event.from == "backbutton") {
    handelBack();
    return true;
  }
  return false;
});
onShow(() => {
  pullType.value = "down";
  page.value = 1;
  getLogList();
  getYuebaoInfo();
  if (cacheYuebaoInfo) {
    handleResYuebaoInfo(cacheYuebaoInfo);
  }
  if (cacheYuebaoLog) {
    handleResLogList(cacheYuebaoLog);
  }
});

const goToCalc = () => {
  navigateTo(routes.yuebaoCalc);
};

const handleRefresh = () => {
  pullType.value = "down";
  page.value = 1;
  getLogList();
  getYuebaoInfo();
};

const handelBack = () => {
  uni.switchTab({
    url: routes.profile,
  });
};

// 上拉加载
onReachBottom(() => {
  if (loadFinish.value) return;
  getPaginationList();
});

const getPaginationList = () => {
  if (loadFinish.value) return;
  if (lock.value) return;
  pullType.value = "up";

  console.log("up");

  page.value++;

  getLogList();
};

const navTo = (url) => {
  navigateTo(url);
};

const yuebaoInfo = ref({});

const handleResYuebaoInfo = (result) => {
  if (result.status != 0) {
    loading.value = false;
    return;
  }

  yuebaoInfo.value = result.data;

  console.log("余额宝", result);

  loading.value = false;
};

const getYuebaoInfo = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  try {
    const result = await getYuebaoInfoApi();
    cacheManager.setCache("yuebaoInfo", result);
    handleResYuebaoInfo(result);
  } catch (e) {
    loading.value = false;
    console.error("获取余额宝信息失败", e);
  }
};

const page = ref(1);
const dataList = ref([]);

const handleResLogList = (result) => {
  if (result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });

    return;
  }

  if (pullType.value == "down" || page.value == 1) {
    dataList.value = [];
  }

  if (result.list.total > dataList.value.length) {
    dataList.value = dataList.value.concat(result.list.data);
  }

  if (result.list.current_page >= result.list.last_page) {
    loadFinish.value = true;
  }

  console.log("余额宝列表", result);

  loading.value = false;
};

const getLogList = async (showLoading = true) => {
  if (lock.value) return;
  lock.value = true;
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  const result = await getYuebaoLogApi({
    page: page.value,
    sortid: 5,
    id: "all",
  });
  lock.value = false;
  if (page.value == 1) {
    cacheManager.setCache("yuebaoLog", result);
  }
  handleResLogList(result);
  layoutRef.value.complete();
};
</script>

<style lang="scss" scoped>
.card-bg {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.1);
}
.card-bg2 {
  display: inline-block;
  width: fit-content;
  padding: 4rpx 12rpx;
  border: 0.5px solid rgba(255, 255, 255, 0.20);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
}
</style>
