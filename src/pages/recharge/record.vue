<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="充值记录"
    bgType="bg-main"
    @reachBottom="getPaginationList"
  >
  <template v-slot:navRight>
      <view class="flex flex-row w-full items-center justify-end">
        <wk-picker
          mode="date"
          :value="timeDate ? timeDate : Number(new Date())"
          :minDate="startDate"
          :maxDate="endDate"
          @change="handleChangeDate"
        >
          <view> 
            <image
              v-if="time_date == 0"
              src="/static/images/user/date_icon_black.svg"
              class="w-[32rpx] h-[32rpx] bg-white/10 rounded-full p-[12rpx]"
            ></image>
            <text v-else class="text-base text-neutral">{{ time_date }}</text>
          </view>
        </wk-picker>
        <view v-if="time_date != 0" class="" @click="handleResetDate">
          <uv-icon
            name="close-circle"
            size="30rpx"
            :color="$colors.regular"
          ></uv-icon>
        </view>
      </view>
    </template>
    <view
      class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col"
    >
      <view
        class="flex flex-row justify-around rounded-[24rpx] h-[186rpx] bg-card3"
      >
        <view class="flex flex-col items-center justify-center">
          <text class="text-base text-white/60"
            >充值成功({{ symbolStore.code }})</text
          >
          <text
            class="font-semibold leading-6 text-2xl mt-[16rpx] text-white"
            >{{ chenggong }}</text
          >
        </view>

        <view class="flex flex-col items-center justify-center">
          <text class="text-base text-white/60"
            >充值失败({{ symbolStore.code }})</text
          >
          <text
            class="font-semibold leading-6 text-2xl mt-[16rpx] text-white"
            >{{ shibai }}</text
          >
        </view>
      </view>
      <view class="flex flex-col mt-[22rpx]">
        <wk-stroke-bg
          size="small"
          class="flex flex-col mb-[24rpx]"
          v-for="item in dataList"
          :key="item.id"
        >
          <view
            class="flex flex-row justify-between items-center pb-[24rpx] border-b border-solid border-b-neutral-divider border-x-0 border-t-0"
          >
            <text class="text-lg leading-5 font-medium text-neutral">{{
              item.paymentid == 11 ? item.reason : item.type
            }}</text>
            <text
              :class="['text-base px-[8rpx] pt-[5rpx] pb-[8rpx] rounded-[8rpx]',
                item.status == 0
                  ? 'text-neutral-error '
                  : item.status == -1
                  ? 'text-neutral-error'
                  : 'text-neutral-theme',
              ]"
              >{{
                item.status == 0
                  ? "审核中"
                  : item.status == -1
                  ? "已取消"
                  : "成功"
              }}</text
            >
          </view>

          <view class="flex flex-col mt-[24rpx] text-neutral-regular">
            <view class="flex flex-row text-base leading-5">
              <text>充值金额：</text>
              <text>
                <!-- 银联充值 -->
                <template
                  v-if="
                    +item.paymentid == 3 ||
                    +item.paymentid == 4 ||
                    +item.paymentid == 5
                  "
                >
                  {{ symbolStore.value == "USDT" ? item.CNY : item.amount }} CNY
                </template>
                <template
                  v-else-if="
                    +item.paymentid == 6 ||
                    +item.paymentid == 13 ||
                    +item.paymentid == 15
                  "
                >
                  {{
                    symbolStore.value == "USDT" ? item.amount : item.CNY
                  }}
                  USDT
                </template>
                <template v-else
                  >{{ item.amount }} {{ symbolStore.code }}
                </template>
              </text>
            </view>

            <view class="flex flex-row text-base leading-5">
              <text>到账金额：</text>
              <text class="text-neutral-theme"
                >{{ item.amount }} {{ symbolStore.code }}</text
              >
            </view>

            <view class="flex flex-row text-base leading-5">
              <text>充值时间：</text>
              <text>{{ item.created_at }}</text>
            </view>

            <view class="flex flex-row text-base leading-5">
              <text>订单编号：</text>
              <text>{{ item.ordernumber }}</text>
            </view>

            <view
              class="flex flex-row text-base leading-5"
              v-if="item.status == -1"
            >
              <text class="whitespace-nowrap">取消原因：</text>
              <text class="text-neutral-error">{{ item.reason }}</text>
            </view>
          </view>
        </wk-stroke-bg>
      </view>
      <Empty v-if="dataList.length == 0"></Empty>
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
import { navigateTo } from "@/utils/navigation";

import CommonTips from "@/components/base/common-tips";
import Empty from "@/components/base/empty";

import { formatPrice } from "@/utils/utils";

import { getRechargeLog as getRechargeLogApi } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";


const page = ref(1);
const dataList = ref([]);

const layoutRef = ref(null);

const symbolStore = useSymbolStore();

const loading = ref(false);
const loadingText = ref("");

const chenggong = ref(0);
const shibai = ref(0);

const pullType = ref("");
const lock = ref(false)
const loadFinish = ref(false);
onLoad((options) => {
  getLogList();
  const cacheRechargeRecord = cacheManager.getCache("rechargeRecord");
  if (cacheRechargeRecord) {
    handleResList(cacheRechargeRecord);
  }
});
const timeDate = ref(0);
const time_date = ref(0);
const startDate = computed(() => {
  return getDate("start");
});

const endDate = computed(() => {
  return getDate("end");
});

const getDate = (type) => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (type === "start") {
    year = year - 30;
  } else if (type === "end") {
    year = year + 80;
  }
  month = month > 9 ? month : "0" + month;
  day = day > 9 ? day : "0" + day;
  return `${year}-${month}-${day}`;
};
const handleResetDate = () => {
  timeDate.value = 0;
  time_date.value = 0;
  page.value = 1;
  getLogList();
};
const handleChangeDate = (e) => {
  timeDate.value = e.detail.value;
  time_date.value = e.detail.value;
  loadFinish.value = false;
  page.value = 1;
  getLogList();
};
const handleRefresh = () => {
  pullType.value = "down";
  loadFinish.value = false;
  page.value = 1;
  getLogList();
};

const getPaginationList = () => {
  if (loadFinish.value) return;
  if (lock.value) return ;
  pullType.value = "up";
  console.log("up");
  page.value++;
  getLogList();
};

const handleResList = (result) => {
  if (result.status && result.status != 0) {
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
}
const getLogList = async (showLoading = true) => {
  if (lock.value) return ;
  lock.value = true;
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  const result = await getRechargeLogApi({
    page: page.value,
    times: timeDate.value,
  });
  lock.value = false;
  if (page.value == 1) {
    cacheManager.setCache("rechargeRecord", result);
  }
  layoutRef.value.complete();
  handleResList(result);
};
</script>

<style lang="scss" scoped></style>
