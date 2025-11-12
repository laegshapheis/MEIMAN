<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="提现记录"
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
              src="/static/images/user/date_icon.svg"
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
      <!-- start 顶部汇总信息 -->
      <view
        class="flex flex-row justify-around rounded-[24rpx] h-[186rpx] bg-card3"
      >
        <view class="flex flex-col items-center justify-center">
          <text class="text-base text-white/60"
            >提现成功({{ symbolStore.code }})</text
          >
          <text
            class="font-semibold leading-6 text-xl mt-[16rpx] text-white"
            >{{ chenggong || 0 }}</text
          >
        </view>

        <view class="flex flex-col items-center justify-center">
          <text class="text-base text-white/60"
            >提现失败({{ symbolStore.code }})</text
          >
          <text
            class="font-semibold leading-6 text-xl mt-[16rpx] text-white"
            >{{ shibai || 0 }}</text
          >
        </view>
      </view>
      <!-- end 顶部汇总信息 -->

      <Empty class="mt-[300rpx]" title="暂无提现记录" v-if="dataList.length == 0"></Empty>

      <!-- start 列表 -->
      <view class="flex flex-col mt-[32rpx]">
        <wk-stroke-bg
          class="flex flex-col mb-[24rpx]"
          v-for="item in dataList"
          :key="item.id"
        >
          <view
            class="flex flex-row justify-between items-center pb-[24rpx] border-b border-solid border-b-neutral-divider border-x-0 border-t-0"
          >
            <text class="text-lg leading-6 flex-1 truncate">
              {{
                item.istype == 0
                  ? "提现余额划转可用余额"
                  : item.istype == 1
                  ? "银行卡提现"
                  : item.istype == 2
                  ? "支付宝提现"
                  : item.istype == 3
                  ? item.memo
                  : item.istype == 4
                  ? "USDT钱包提现"
                  : item.istype == 6
                  ? "微信提现"
                  : "未知渠道"
              }}
            </text>
            <text
              :class="['text-base px-[8rpx] pt-[5rpx] pb-[8rpx]',
                item.status == 0
                  ? 'text-neutral'
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
            <view class="flex flex-row text-base leading-6">
              <text>提现金额：</text>
              <text>
                {{
                  (item.amount * 100 + item.fee * 100) / 100 +
                  ` ${symbolStore.code}`
                }}
              </text>
            </view>
            <view
              v-if="item.istype !== 0 && item.istype !== 3"
              class="flex flex-row text-base leading-6"
            >
              <text>提现手续费：</text>
              <text v-if="symbolStore.value == 'USDT'">
                {{
                  item.istype == 4 ? item.fee + " USDT" : item.feeCNY + " CNY"
                }}
              </text>
              <text v-else>
                {{
                  item.istype == 4 ? item.feeCNY + " USDT" : item.fee + " CNY"
                }}
              </text>
            </view>

            <view class="flex flex-row text-base leading-6">
              <text>到账金额：</text>
              <!-- istype 0 提现余额划转可用余额 4 USDT钱包提现 3 zz -->
              <text class="text-neutral-theme">
                {{ handleGetAmount(item) }}
              </text>
            </view>

            <view class="flex flex-row text-base leading-6">
              <text>提现时间：</text>
              <text>{{ item.created_at }}</text>
            </view>

            <view class="flex flex-row text-base leading-6">
              <text>订单编号：</text>
              <text>{{ item.id }}</text>
            </view>

            <view
              class="flex flex-row text-base leading-6"
              v-if="item.status == -1"
            >
              <text class="whitespace-nowrap">取消原因：</text>
              <text
                class="text-neutral-error"
                v-if="item.status == -1 && item.zhuanuserid > 0"
                >{{ item.reason }}</text
              >
              <text class="text-neutral-error" v-else>{{ item.memo }}</text>
            </view>
          </view>
        </wk-stroke-bg>
      </view>
      <!-- start 列表 -->
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
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
import { getTransferList as getTransferListApi } from "@/api/user";
import { usePermissionStore } from "@/stores/permission";
import { cacheManager } from "@/utils/cacheManager";

const cacheWithdrawRecord = cacheManager.getCache("withdrawRecord");

const permissionStore = usePermissionStore();
const page = ref(1);
const dataList = ref([]);

const symbolStore = useSymbolStore();

const chenggong = ref(0);
const shibai = ref(0);

const pullType = ref("");

const layoutRef = ref(null);

const loadFinish = ref(false);

const loading = ref(false);
const loadingText = ref("");
const lock = ref(false);
onLoad((options) => {
  getLogList();
  if (cacheWithdrawRecord) {
    handleResList(cacheWithdrawRecord);
  }
});

const currentRate = computed(() => {
  return permissionStore.permissions.CNYUSDT;
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
const handleGetAmount = (item) => {
  if (symbolStore.value == "USDT") {
    // 银行卡提现 支付宝提现 微信提现
    if (item.istype == 1 || item.istype == 2 || item.istype == 6) {
      return item.CNY + " CNY";
    }
  } else {
    // USDT钱包提现
    if (item.istype == 4) {
      return item.CNY + ` USDT`;
    }
  }

  return item.amount + ` ${symbolStore.code}`;
};

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
    times: timeDate.value,
  });
  lock.value = false;
  layoutRef.value.complete();
  handleResList(result);
  // 如果是第一页，则缓存数据
  if (page.value == 1) {
    cacheManager.setCache("withdrawRecord", result);
  }
};
</script>

<style lang="scss" scoped></style>
