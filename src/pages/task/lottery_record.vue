<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="获得盲盒抽奖次数记录"
    bgType="bg-main"
  >
    <view
      class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col"
    >
      <view class="flex flex-col mt-[22rpx]">
        <wk-stroke-bg
          size="small"
          class="flex flex-col mb-[24rpx]"
          v-for="item in dataList"
          :key="item.id"
        >
          <view class="flex flex-col text-white/75 gap-[10rpx]">
            <view class="flex flex-row text-lg leading-5">
              <text class="text-white">{{ item.box_name }}</text>
            </view>
            <view class="flex flex-row text-base leading-5">
              <text>{{ item.remark }}</text>
            </view>
            <view class="flex flex-row text-sm leading-5">
              <text>{{ item.created_at }}</text>
            </view>
          </view>
        </wk-stroke-bg>
      </view>
      <Empty class="mt-[300rpx]" v-if="dataList.length == 0"></Empty>
      <!-- start 列表 -->
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import {
  onLoad,
} from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import Empty from "@/components/base/empty";
import { getFreeBoxLotteryRecordApi as getBoxRecordApi } from "@/api/task";
import { cacheManager } from "@/utils/cacheManager";
import { useLottie } from '@/hooks/useLottie'
useLottie()
const dataList = ref([]);
const layoutRef = ref(null);
const symbolStore = useSymbolStore();
const loading = ref(false);
const loadingText = ref("");
const pullType = ref("");

const loadFinish = ref(false);
onLoad((options) => {
  const cacheRechargeRecord = cacheManager.getCache("taskLotteryRecord");
  if (cacheRechargeRecord) {
    handleResList(cacheRechargeRecord);
  }
  getLogList();
});

const handleRefresh = () => {
  getLogList();
};


const handleResList = (result) => {
  dataList.value = result.data || [];
  loading.value = false;
}
const getLogList = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  const result = await getBoxRecordApi();
  layoutRef.value.complete();
  if (result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });
    return;
  }
  cacheManager.setCache("taskRecord", result);
  handleResList(result);
};
</script>

<style lang="scss" scoped></style>
