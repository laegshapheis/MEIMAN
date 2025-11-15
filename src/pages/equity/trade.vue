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
      <view @click="handleNavigate('order')" class="flex flex-row items-center bg-white/10 rounded-full px-[24rpx] py-[8rpx]">
        <text class="text-base text-neutral">我的订单</text>
      </view>
    </template>
    <view class="px-[32rpx] pt-[28rpx]">
      <view
        class="py-[60rpx] mb-[20rpx] rounded-[32rpx] bg-card3"
      >
        <!-- 账户信息卡片 -->
        <view class="rounded-[8rpx] flex justify-between items-center">
          <view class="flex flex-col items-center flex-1">
            <text class="text-neutral-white text-base"
              >投资余额({{ symbolStore.code }})</text
            >
            <text class="text-white text-2xl font-bold mt-[10rpx]">{{
              balance
            }}</text>
          </view>
          <view class="flex flex-col items-center flex-1">
            <text class="text-neutral-white text-base">我的股权(个)</text>
            <text class="text-white text-2xl font-bold mt-[10rpx]">{{
              equity
            }}</text>
          </view>
        </view>
      </view>
      <!-- 功能按钮 -->
      <view class="w-full flex flex-row justify-center items-center mt-[16rpx]">
        <view
          class="w-full h-[80rpx] bg-[transparent] border-neutral-theme border-[length:1rpx] border-solid rounded-full flex flex-row items-center justify-center"
          @click="handleNavigate('transfer')"
        >
          <text
            class="text-neutral-theme text-base font-medium"
            >我要转让</text
          >
        </view>
      </view>

      <!-- 交易列表 -->
      <view v-if="list.length > 0" class="mt-[32rpx]">
        <wk-stroke-bg
          v-for="(item, index) in list"
          :key="index"
          class="border-b border-neutral pb-[36rpx] mb-[24rpx]"
        >
          <!-- 订单信息 -->
          <view class="mb-[12rpx] flex flex-row items-center">
            <image src="/static/images/user/logo.png" class="w-[48rpx] h-[48rpx] rounded-full mr-[10rpx]"></image>
            <text class="text-neutral text-base">{{ item.username }}</text>
          </view>
          <view class="mb-[12rpx]">
            <text class="text-neutral-regular text-base mr-[10rpx]"
              >股权交易ID
            </text>
            <text class="text-neutral text-base">{{ item.bianhao }}</text>
          </view>
          <!-- <view class="mb-[12rpx]">
            <text class="text-neutral-regular text-base mr-[10rpx]">数量 </text>
            <text class="text-neutral text-base">{{ item.number }} 个</text>
          </view> -->
          <!-- <view class="mb-[12rpx]">
            <text class="text-neutral-regular text-base mr-[10rpx]">单价 </text>
            <text class="text-neutral text-base"
              >{{ item.buyprice }} {{ symbolStore.code }}</text
            >
          </view> -->
          <view class="mb-[12rpx]">
            <text class="text-neutral-regular text-base mr-[10rpx]">总价 </text>
            <text class="text-neutral text-base"
              >{{ item.buyprice * item.number }} {{ symbolStore.code }}</text
            >
          </view>
          <!-- <view class="mb-[12rpx]">
            <text class="text-neutral-regular text-base mr-[10rpx]"
              >手续费
            </text>
            <text class="text-neutral text-base"
              >{{ item.extmoney }} {{ symbolStore.code }} ({{
                item.feetip
              }})</text
            >
          </view> -->
          <view class="mt-[12rpx]">
            <text class="text-neutral-regular text-base mr-[10rpx]"
              >挂单时间
            </text>
            <text class="text-neutral text-base">{{ item.selltime }}</text>
          </view>
          <view class="w-full h-[2rpx] bg-neutral-divider my-[32rpx]"></view>
          <view
            class="flex flex-row items-center justify-between"
          >
            <view class="flex flex-col items-start justify-end">
              <text class="text-neutral text-lg font-bold mb-[12rpx]">
                {{ item.buyprice }}
              </text>
              <text class="text-base text-neutral-regular"
                >金额({{ symbolStore.code }})</text
              >
            </view>
            <view class="flex flex-col items-start">
              <text class="text-neutral text-lg font-bold mb-[12rpx]">{{
                item.number || 0
              }}</text>
              <text class="text-base text-neutral-regular">数量(个)</text>
            </view>
            <view class="flex flex-col items-start">
              <text class="text-neutral text-lg font-bold mb-[12rpx]"
                >{{ item.extmoney }} {{ symbolStore.code }}</text
              >
              <text class="text-base text-neutral-regular">{{
                item.feetip
              }}</text>
            </view>
          </view>
          <wk-button
            height="77rpx"
            v-if="item.show == 1"
            class="mt-[40rpx]"
            @submit="handleBuy(item)"
          >
            购买
          </wk-button>
        </wk-stroke-bg>
      </view>

      <!-- 空状态 -->
      <Empty v-else />

      <!-- Loading -->
      <!-- <wk-loading v-if="loading" :loadingText="loadingText" /> -->

      <!-- 支付密码弹窗 -->
      <wk-code-input
        ref="keywordRef"
        :value="payPassword"
        @finish="handlePasswordComplete"
      >
        <template #content>
          <text class="text-neutral-regular text-lg pt-[16rpx]"
            >总价格：{{ tradePrice }} {{ symbolStore.code }}</text
          >
        </template>
      </wk-code-input>
    </view>
  </layout>
</template>

<script setup>
import { ref } from "vue";
import {
  onLoad,
  onPullDownRefresh,
  onReachBottom,
  onShow,
  onBackPress,
} from "@dcloudio/uni-app";
import { getTradeList, getTradeInfo, submitTrade } from "@/api/user";
import Empty from "@/components/base/empty.vue";
import { useSymbolStore } from "@/stores/symbolStore";
import { routes } from "@/config/routes";
import { cacheManager } from "@/utils/cacheManager";
const symbolStore = useSymbolStore();

const loading = ref(false);
const loadingText = ref("加载中...");
const list = ref([]);
const balance = ref("0.00");
const equity = ref(0);
const page = ref(1);
const refreshType = ref("");
const keywordRef = ref(null);
const payPassword = ref("");
const tradeId = ref("");
const tradePrice = ref("");
const isRealname = ref(0);
const layoutRef = ref(null);
const handleRefresh = () => {
  page.value = 1;
  getList();
};

const handleBack = () => {
  uni.navigateTo({
    url: routes.equity,
  });
};
const handleCache = (result) => {
  if (result.status === 0) {
    if (page.value == 1) {
      list.value = result.list.data;
    } else {
      if (result.list.total > result.list.data.length) {
        list.value = [...list.value, ...result.list.data];
      }
    }
    balance.value = result.k_tz_jin_e;
    equity.value = result.nld_number;
    isRealname.value = result.isrealname;
  } else {
    uni.$showToast({
      title: result.msg,
      icon: "none",
    });
  }
};
// 获取交易列表
const getList = async () => {
  loading.value = true;
  try {
    const result = await getTradeList({
      page: page.value,
      sort: 1,
    });
    console.log(result);
    if (page.value == 1) {
      cacheManager.setCache("equityInfoTrade", result);
    }
    handleCache(result);
  } catch (error) {
    console.error("获取交易列表失败:", error);
  } finally {
    loading.value = false;
    layoutRef.value?.complete();
  }
};

// 处理导航
const handleNavigate = (type) => {
  if (type === "order") {
    uni.navigateTo({
      url: routes.equityOrder,
    });
  } else if (type === "transfer") {
    uni.navigateTo({
      url: `${routes.equityPurchase}?nld_number=${equity.value}`, // 转让
    });
  }
};

// 处理购买
const handleBuy = async (item) => {
  if (isRealname.value === 0) {
    uni.$showToast({
      title: "请先进行实名认证",
      icon: "none",
    });
    return;
  }

  loading.value = true;
  try {
    const result = await getTradeInfo({
      id: item.id,
    });
    console.log(result);
    tradeId.value = item.id;
    tradePrice.value = result.data.totle.toFixed(2);
    keywordRef.value?.open();
  } catch (error) {
    console.error("获取交易信息失败:", error);
  } finally {
    loading.value = false;
  }
};

// 处理支付密码完成
const handlePasswordComplete = async (password) => {
  if (password.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码",
      icon: "none",
    });
    return;
  }

  loading.value = true;
  loadingText.value = "交易中...";

  try {
    const result = await submitTrade({
      id: tradeId.value,
      password: password,
    });

    if (result.status === 1) {
      uni.$showToast({
        title: result.msg,
        icon: "none",
      });
    } else if (result.status === 0) {
      uni.$showModal({
        title: "提示",
        content: result.msg,
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            refreshType.value = "init";
            page.value = 1;
            getList();
          }
        },
      });
    }
  } catch (error) {
    console.error("交易失败:", error);
    uni.$showToast({
      title: "交易失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
    keywordRef.value?.close();
    payPassword.value = "";
  }
};

// 下拉刷新
onPullDownRefresh(() => {
  refreshType.value = "down";
  page.value = 1;
  getList();
});

// 上拉加载
onReachBottom(() => {
  refreshType.value = "up";
  page.value++;
  getList();
});

onBackPress((event) => {
  if (event.from == "backbutton") {
    handleBack();
    return true;
  }
  return false;
});
onShow(() => {
  refreshType.value = "init";
  const equityInfo = cacheManager.getCache("equityInfoTrade");
  if (equityInfo) {
    handleCache(equityInfo);
  }
  getList();
});
</script>

<style lang="scss" scoped></style>
