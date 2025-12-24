<template>
  <layout ref="layoutRef" :refresher="true" @onRefresh="handleRefresh" navTitle="交易明细" bgType="bg-main1"
    :isLottie="false" @reachBottom="getPaginationList">
    <template v-slot:navRight>
      <view class="flex flex-row w-full items-center justify-end">
        <wk-picker mode="date" :value="timeDate ? timeDate : Number(new Date())" :minDate="startDate" :maxDate="endDate"
          @change="handleChangeDate">
          <view>
            <view v-if="time_date == 0" class="flex items-center justify-center rounded-full">
              <image src="/static/images/user/date_icon.svg" class="w-[64rpx] h-[64rpx]"></image>
            </view>
            <text v-else class="text-base text-neutral">{{ time_date }}</text>
          </view>
        </wk-picker>
        <view v-if="time_date != 0" class="" @click="handleResetDate">
          <uv-icon name="close-circle" size="30rpx" :color="$colors.regular"></uv-icon>
        </view>
      </view>
    </template>
    <template v-slot:exp>
      <view class="mx-[32rpx] mt-[10rpx] mb-[10rpx]">
        <wk-tabs :isButton="true" :list="tabList" @change="handleChangeTab" :current="currentIndex" :customStyle="{
          background: 'transparent',
        }" :inactiveStyle="{
            border: '1px solid #ffffff20',
            padding: '12rpx 32rpx',
            backgroundColor: 'transparent',
            borderRadius: '360rpx',
            color: '#ffffff60',
          }" />
      </view>
    </template>
    <view class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col">
      <!-- start 标签选项 -->

      <!-- end 标签选项 -->

      <Empty title="暂无相关记录" v-if="dataList.length == 0" :color="$colors.regular"></Empty>

      <!-- start 列表 -->
      <view class="flex flex-col">
        <view class="flex flex-col min-h-[100rpx] mb-[24rpx] bg-black p-[32rpx] rounded-[32rpx] shadow-[0_0_16px_0_#266AFF_inset]" v-for="item in dataList" :key="item.id">
          <view class="flex flex-col">
            <text class="text-xl font-semibold break-all">{{item.moneylog_notice}}</text>
            <view class="flex flex-row justify-between items-center mt-[16rpx]">
              <text class="text-base text-white/80">{{item.created_at}}</text>
              <text :class="[
                'text-2xl font-semibold',
                item.moneylog_status == '-'
                  ? 'text-neutral-error'
                  : 'text-neutral-theme',
              ]">{{ item.moneylog_status + "" + item.moneylog_money }}</text>
            </view>
          </view>

          <template v-if="item.yuan_title">
            <view class="flex flex-row my-[12rpx] h-[1rpx] bg-white/25"></view>

            <view class="flex flex-row justify-start items-center leading-5 border pt-[16rpx]">
              <view class="flex flex-col min-w-[50%]">
                <text class="text-2xl font-semibold text-neutral">{{
                  item.moneylog_yuanamount
                  }}</text>
                <text class="text-sm text-white/80 mt-[4rpx]">{{
                  item.yuan_title
                  }}</text>
              </view>

              <view class="flex flex-col">
                <text class="text-2xl font-bold text-neutral">{{
                  item.moneylog_houamount
                  }}</text>
                <text class="text-sm text-white/80 mt-[4rpx]">{{
                  item.hou_title
                  }}</text>
              </view>
            </view>
          </template>

          <template v-for="(extItemList, extIndex) in chunk(item.ext_item_list, 2)" :key="`ext-row-${extIndex}`">
            <view class="flex flex-row justify-start items-center leading-5 py-[16rpx]">
              <view :class="[
                'flex',
                'flex-col',
                extItemIndex == 0 ? 'min-w-[50%]' : '',
              ]" v-for="(extItem, extItemIndex) in extItemList" :key="`ext-clo-${extItem.id}`">
                <text class="text-lg font-semibold text-neutral-theme">{{
                  extItem.value
                  }}</text>
                <text class="text-sm text-neutral-regular">{{
                  extItem.title
                  }}</text>
              </view>
            </view>
          </template>
        </view>
      </view>
      <!-- end 列表 -->
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateTo } from "@/utils/navigation";

import CommonTips from "@/components/base/common-tips";
import Empty from "@/components/base/empty";

import { formatPrice } from "@/utils/utils";
import { usePermissionStore } from "@/stores/permission";
const { hasPermission } = usePermissionStore();

import { getLogList as getLogListApi } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const time_date = ref(0);
const currentIndex = ref(0);
const layoutRef = ref(null);
const tabList = computed(() => {
  const list = [
    {
      name: "全部",
      type: 0,
    },
    {
      name: "资金明细",
      type: 1,
    },
    {
      name: "积分明细",
      type: 3,
    },

    {
      name: "奖券明细",
      type: 4,
    },

    {
      name: "余额宝明细",
      type: 5,
    },
    {
      name: "签到明细",
      type: 7,
    },
  ];
  if (hasPermission("isequity")) {
    list.push({
      name: "股权明细",
      type: 2,
    });
  }
  return list;
});

const page = ref(1);
const dataList = ref([]);
const type = ref(0);
const pullType = ref("");
const loadFinish = ref(false);
const loading = ref(false);
const loadingText = ref("");
const cacheLogList = cacheManager.getCache("flowRecord");
const lock = ref(false);

onLoad((options) => {
  if (cacheLogList) {
    handleResLogList(cacheLogList);
  }

  setTimeout(() => {
    if (options.type) {
      const tabIndex = tabList.value.findIndex((item) => {
        if (item.type == options.type) {
          return true;
        }
        return false;
      });
      if (tabIndex !== -1) {
        currentIndex.value = tabIndex;
        type.value = parseInt(options.type);
      }
      console.log(tabIndex);
    }
    getLogList();
  }, 100);
});

const handleRefresh = () => {
  loadFinish.value = false;
  pullType.value = "down";
  page.value = 1;
  getLogList();
};

const getPaginationList = () => {
  if (loadFinish.value) return;
  if (lock.value) return;
  pullType.value = "up";
  console.log("up");
  page.value++;
  getLogList();
};
const handleResLogList = (result) => {
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

  if (result.list.current_page >= result.list.last_page) {
    loadFinish.value = true;
  }

  console.log(result.list);

  loading.value = false;
};
const getLogList = async () => {
  if (lock.value) return;
  lock.value = true;
  if (loading.value) return;
  loading.value = true;
  loadingText.value = "加载中...";

  const result = await getLogListApi({
    id: "all",
    page: page.value,
    sortid: type.value,
    times: timeDate.value,
  });
  lock.value = false;
  if (page.value == 1) {
    cacheManager.setCache("flowRecord", result);
  }
  handleResLogList(result);
  layoutRef.value.complete();
};
const timeDate = ref(0);
const handleChangeDate = (e) => {
  timeDate.value = e.detail.value;
  time_date.value = e.detail.value;
  loadFinish.value = false;
  page.value = 1;
  getLogList();
};

const handleChangeTab = (e) => {
  currentIndex.value = e.index;
  type.value = e.type;
  loadFinish.value = false;
  page.value = 1;
  getLogList();
};

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
const chunk = (a, n) =>
  [...Array(Math.ceil(a.length / n))].map((_, i) => a.slice(n * i, n + n * i));
</script>

<style lang="scss" scoped>
:deep .fui-tabs__text {
  font-size: 28rpx;
}

:deep .fui-tabs__active .fui-tabs__text {
  color: #fff !important;

  font-size: 28rpx;
}

:deep .fui-tabs__item {
  background: #fff;
  border-radius: 360rpx;

  color: #4d585b;
}

:deep .fui-tabs__active {
  // background-color: #fff;

  background: theme("colors.neutral.theme");
  border-radius: 360rpx;
}

// .uv-tabs {

:deep(.uv-tabs__wrapper__nav) {
  border-radius: 100rpx;
  border: none !important;
  background: transparent !important;
  backdrop-filter: blur(4px);
}

:deep(.uv-tabs__wrapper__nav__line) {
  background: url("/static/images/common/btn_bg.png") center/cover no-repeat !important;
}

// }</style>
