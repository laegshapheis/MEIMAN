<template>
  <layout
    ref="layoutRef"
    navTitle="交易大厅"
    bgType="bg-main"
    :refresher="true"
    @onRefresh="handleRefresh"
    :isNavLeftBackClick="false"
    @navLeftClick="handleBack"
  >
    <template #navRight>
      <view
        @click="goPageDetail"
        class="flex flex-row items-center text-base bg-white/10 rounded-full px-[24rpx] py-[8rpx] text-neutral"
      >
        明细
        <!-- <image
          src="/static/images/user/list_search.svg"
          class="w-[48rpx] h-[48rpx]"
        /> -->
      </view>
    </template>

    <view class="px-[32rpx] pt-[28rpx]">
      <equity-card :data="data" />
      <!-- 功能按钮区域 -->
      <view class="grid grid-cols-1 mt-[32rpx] gap-[16rpx]">
        <view
          v-for="(item, index) in buttonItems"
          :key="index"
          class="col-span-1"
          @click="handleNavigate(item)"
        >
        <view v-if="index != 0"
          class="w-full h-[1rpx] bg-black/10"></view>
          <view
            class="box-border w-full p-[16rpx] flex flex-row items-center justify-between"
          >
            <view class="w-full flex flex-row items-center">
              <view
                class="w-[96rpx] h-[96rpx] mr-[32rpx] flex flex-row items-center justify-center rounded-full bg-white"
              >
                <image
                  :src="item.icon"
                  class="w-[48rpx] h-[48rpx]"
                  mode="aspectFit"
                />
              </view>
              <text class="text-neutral text-lg">{{ item.label }}</text>
            </view>
            <uv-icon name="arrow-right" :color="$colors.DEFAULT" size="14"></uv-icon>
          </view>
        </view>
      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { routes } from "@/config/routes";
import { onShow, onBackPress } from "@dcloudio/uni-app";
import EquityCard from "./components/equity-card.vue";
import { getEquityInfo as getEquityInfoApi } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const layoutRef = ref(null);
const modalRef = ref(null);
const loading = ref(false);
const loadingText = ref("加载中...");
const description = ref("");
const data = ref({});

const buttonItems = [
  {
    type: "purchase",
    icon: "/static/images/equity/purchase.svg",
    label: "购买",
    switch: true,
    route: routes.productList,
    tabType: 32,
  },
  {
    type: "release",
    icon: "/static/images/equity/release.svg",
    label: "质押",
    route: routes.equityRelease,
    auth: 'pledge_switch',
  },
  {
    type: "contract",
    icon: "/static/images/equity/contract.svg",
    label: "合约",
    route: routes.equityContract,
  },
  {
    type: "trade",
    icon: "/static/images/equity/trade.svg",
    label: "交易",
    route: routes.equityTrade,
  },
];
const goPageDetail = () => {
  uni.navigateTo({
    url: routes.flowRecord + "?type=2",
  });
};
const handleCache = (result) => {
  console.log(result);
  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      icon: "none",
    });
    return;
  }
  data.value = result;
  description.value = result.nengliangdou;
  loading.value = false;
};
const handleBack = () => {
  uni.switchTab({
    url: routes.profile,
  });
};

// 获取股权信息
const getEquityInfo = async () => {
  loading.value = true;
  try {
    const result = await getEquityInfoApi();
    cacheManager.setCache("equityInfo", result);
    handleCache(result);
    layoutRef.value?.complete();
  } catch (error) {
    loading.value = false;
    layoutRef.value?.complete();
  }
};

// 显示说明弹窗
const showDescription = () => {
  modalRef.value?.open();
};

// 处理刷新
const handleRefresh = () => {
  getEquityInfo();
};

// 处理导航
const handleNavigate = (item) => {
  if (data.value[item.auth] == 0) {
    uni.$showToast({
      title: "暂未开放！敬请期待",
      icon: "none",
    });
    return;
  }
  
  if (item.switch) {
    uni.setStorageSync("switchTabData", {
      tabType: item.tabType,
    });
    uni.switchTab({
      url: item.route,
    });
  } else {
    uni.navigateTo({
      url: item.route,
    });
  }
};

onBackPress((event) => {
  if (event.from == "backbutton") {
    handleBack();
    return true;
  }
  return false;
});
// 页面加载时获取数据
onShow(() => {
  const equityInfo = cacheManager.getCache("equityInfo");
  if (equityInfo) {
    handleCache(equityInfo);
  }
  getEquityInfo();
});
</script>
