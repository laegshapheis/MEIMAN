<template>
  <layout ref="layoutRef" :refresher="true" @onRefresh="handleRefresh" navTitle="代金券" bgType="bg-main2" :isLottie="false"
    @reachBottom="getPaginationList">
    <view class="px-page-x pb-[30rpx] box-border w-full flex flex-col">
      <wk-tabs :list="tabList" mode="pill" :current="type" :isButton="true" @change="changeType" :scrollable="false" />

      <!-- start 列表-->
      <view class="flex flex-col mt-[24rpx]">
        <view shadow size="small" v-for="item in dataList" :key="item.id"
          class="relative flex flex-col p-[24rpx] mb-[24rpx]  bg-[#202482] rounded-[24rpx]">
          <!-- 第一行：图片+名称+状态按钮 -->
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <!-- 左侧：图片+名称 -->
            <view class="flex flex-row items-center">
              <!-- <image
                  class="w-[68rpx] h-[68rpx] mr-[16rpx]"
                  src="/static/images/profile/profile_vouchers.png"
                  mode="widthFix"
                /> -->
              <text class="text-white font-bold text-base">{{ item.money }} {{ symbolStore.code }}代金券</text>
            </view>

            <!-- 右侧：状态按钮 -->
            <view @click="() => goUse(item)" :style="{
              background:
                item.status == 1
                  ? $colors.buttonBg
                  : 'transparent',
            }" :class="[
                  'px-[24rpx] py-[8rpx] rounded-[16rpx]',
                  item.status == 1
                    ? 'flex flex-row items-center justify-center text-sm text-white font-medium'
                    : 'flex flex-row items-center justify-center text-sm font-medium text-white/60'
                ]">
              <text class="text-base whitespace-nowrap">{{
                tabList[type].name
              }}</text>
            </view>
          </view>

          <view class="w-full h-[1px] bg-neutral-divider mb-[16rpx]"></view>

          <!-- 第二行：描述和时间信息 -->
          <view class="flex flex-col gap-[8rpx]">
            <!-- 使用时间 -->
            <text v-if="item.status == 2" class="text-sm text-white/80">使用时间: {{ item.updated_at }}</text>

            <!-- 领取时间 -->
            <text :class="[
              'text-sm',
              true || item.status == 1
                ? 'text-white/80'
                : 'text-neutral-light',
            ]">领取时间: {{ item.created_at }}</text>

            <!-- 到期时间 -->
            <text :class="[
              'text-sm',
              true || item.status == 1
                ? 'text-white/80'
                : 'text-neutral-light',
            ]">到期时间: {{ item.exptime }}</text>

            <!-- 描述信息 -->
            <text v-if="item.status == 2 && item.content" class="text-sm text-neutral-regular">{{ item.content }}</text>
          </view>
        </view>
      </view>
      <!-- end 列表-->

      <Empty class="mt-[300rpx]" title="暂无代金券" v-if="dataList.length == 0" />
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { routes } from "@/config/routes";
import Empty from "@/components/base/empty";
import { getCouponList as getCouponListApi } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const cacheData = cacheManager.getCache("cashCoupon");
const page = ref(1);
const dataList = ref([]);
const layoutRef = ref(null);
const symbolStore = useSymbolStore();
const loading = ref(false);
const loadingText = ref("");
const tabList = [
  {
    name: "去使用",
    id: 0,
  },
  {
    name: "已使用",
    id: 1,
  },
  {
    name: "已过期",
    id: 2,
  },
];

const pullType = ref("");
const lock = ref(false)
onLoad((options) => {
  if (cacheData) {
    handleList(cacheData);
  }
  getLogList();
});

const handleRefresh = () => {
  pullType.value = "down";
  page.value = 1;
  getLogList();
};

// 上拉加载
onReachBottom(() => {
  getPaginationList();
});

const getPaginationList = () => {
  if (lock.value) return;
  pullType.value = "up";

  page.value++;

  getLogList();
};

const goUse = (item) => {
  if (item.status != 1) return "";

  uni.switchTab({
    url: routes.productList,
  });
};

const handleList = (result) => {
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

  loading.value = false;
};

const getLogList = async (showLoading = true) => {
  if (lock.value) return;
  lock.value = true;
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  const result = await getCouponListApi({
    page: page.value,

    sortid: type.value,
    type: 1,
  });

  lock.value = false;

  if (page.value == 1) {
    cacheManager.setCache("cashCoupon", result);
  }

  layoutRef.value.complete();

  handleList(result);
};

const type = ref(0);
const changeType = (e) => {
  type.value = e.id;

  page.value = 1;

  dataList.value = [];

  getLogList();
};
</script>

<style lang="scss" scoped>
.uni-scroll-view-content>uni-view>uni-view {
  justify-content: space-between !important;
}

:deep .fui-scroll__view {
  justify-content: space-between;
}

:deep #app .uv-tabs__wrapper__nav__line{
  background-image: url('/static/images/coupon/tab_active_bg.png') !important;
  // height: 56rpx !important;
  border:none !important;
}

:deep .uv-tabs{
  background: #1C0D89 !important;
}
</style>