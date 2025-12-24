<template>
  <layout ref="layoutRef" :refresher="true" @onRefresh="handleRefresh" navTitle="转账记录" bgType="bg-main2"
    :isLottie="false" @reachBottom="getPaginationList">
    <view class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col">
      <!-- start 顶部汇总信息 -->
      <view class="flex flex-row justify-around rounded-[24rpx] w-full mx-auto h-[186rpx] bg-card3">
        <view class="flex flex-col items-center justify-center">
          <text class="text-base text-white">转出成功金额({{ symbolStore.code }})</text>
          <text class="text-2xl font-bold leading-6 text-[40rpx] mt-[16rpx] text-white">{{ chenggong }}</text>
        </view>

        <view class="flex flex-col items-center justify-center">
          <text class="text-base text-white">转出失败金额({{ symbolStore.code }})</text>
          <text class="text-2xl font-bold leading-6 text-[40rpx] mt-[16rpx] text-white">{{ shibai }}</text>
        </view>
      </view>
      <!-- end 顶部汇总信息 -->

      <Empty title="暂无转账记录" v-if="dataList.length == 0" class="mt-[100rpx]"></Empty>

      <!-- start 列表 -->
      <view class="flex flex-col mt-[32rpx]">
        <view class="flex flex-col mb-[24rpx]  bg-black px-[24rpx] py-[48rpx] rounded-[32rpx] shadow-[0_0_16px_0_#266AFF_inset]" v-for="item in dataList" :key="item.id">
          <view
            class="flex flex-row justify-between pb-[24rpx] border-l-0 border-r-0 border-t-0 border-b border-neutral-divider border-solid">
            <text class="text-lg leading-5 font-medium">
              {{
                item.istype == 0
                  ? "转投资余额"
                  : item.istype == 1
                    ? "银行卡提现"
                    : item.istype == 2
                      ? "支付宝提现"
                      : item.istype == 3
                        ? item.memo
                        : item.istype == 4
                          ? "USDT钱包提现"
                          : "未知渠道"
              }}
            </text>
            <text :class="[
              'text-base whitespace-nowrap h-[60rpx] flex items-center px-[16rpx]',
              item.status == 0
                ? 'text-neutral-error'
                : item.status == -1
                  ? 'text-neutral-error'
                  : 'text-neutral-theme',
            ]">{{
                item.status == 0
                  ? "审核中"
                  : item.status == -1
                    ? "已取消"
                    : "成功"
              }}</text>
          </view>

          <view class="flex flex-col mt-[24rpx]">
            <view
              class="flex flex-row text-base leading-5 text-neutral-regular justify-between items-center pb-[16rpx] border-b border-solid border-b-neutral-divider border-x-0 border-t-0">
              <text class="text-neutral-secondary">转出金额：</text>
              <text class="text-neutral-theme">
                {{
                  item.istype == 0
                    ? item.amount + " " + symbolStore.code
                    : item.istype == 1
                      ? item.CNY + " " + symbolStore.code
                      : item.istype == 2
                        ? item.CNY + " " + symbolStore.code
                        : item.istype == 3
                          ? item.amount + " " + symbolStore.code
                          : item.istype == 4
                            ? item.amount + "USDT"
                            : item.amount + " " + symbolStore.code
                }}
              </text>
            </view>

            <view
              class="flex flex-row text-base leading-5 text-neutral-regular py-[16rpx] justify-between items-center">
              <text class="text-neutral-secondary">转出时间：</text>
              <text class="text-neutral-regular">{{ item.created_at }}</text>
            </view>

            <view
              class="flex flex-row text-base leading-5 justify-between items-start py-[16rpx] border-t border-solid border-t-neutral-divider border-x-0 border-b-0"
              v-if="true || item.status == -1">
              <text class="whitespace-nowrap text-neutral-secondary">取消原因：</text>
              <text class="text-neutral-error" v-if="item.status == -1 && item.zhuanuserid > 0">{{ item.reason }}</text>
              <text class="text-neutral-error" v-else>{{ item.memo }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- start 列表 -->
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import Empty from "@/components/base/empty";
import { getTransferList as getTransferListApi } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const cacheTransferRecord = cacheManager.getCache("transferRecord");
const page = ref(1);
const dataList = ref([]);
const layoutRef = ref(null);
const symbolStore = useSymbolStore();
const chenggong = ref(0);
const shibai = ref(0);
const pullType = ref("");
const loadFinish = ref(false);
const loading = ref(false);
const loadingText = ref("");
const lock = ref(false);
onLoad((options) => {
  getLogList();
  if (cacheTransferRecord) {
    handleResList(cacheTransferRecord);
  }
});

const handleRefresh = () => {
  pullType.value = "down";
  loadFinish.value = false;
  page.value = 1;
  getLogList();
};

// 上拉加载
onReachBottom(() => {
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

const handleResList = (result) => {
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

  chenggong.value = result.chenggong;
  shibai.value = result.shibai;

  if (result.list.current_page >= result.list.last_page) {
    loadFinish.value = true;
  }

  console.log("充值列表", result);

  loading.value = false;
};

const getLogList = async (showLoading = true) => {
  if (lock.value) return;
  lock.value = true;
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  const result = await getTransferListApi({
    page: page.value,
    sortid: 1,
  });

  lock.value = false;

  layoutRef.value.complete();

  // 如果是第一页，则缓存数据
  if (page.value == 1) {
    cacheManager.setCache("transferRecord", result);
  }

  handleResList(result);
};
</script>

<style lang="scss" scoped></style>
