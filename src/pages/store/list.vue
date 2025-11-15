<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="积分商城"
    bgType="bg-main"
    @reachBottom="onReachBottom"
  >
    <template v-slot:navRight>
      <view class="flex flex-row items-center rounded-full px-[16rpx] py-[8rpx]">
        <!-- <uv-icon name="error-circle" color="#fff" size="12"></uv-icon> -->
        <text class="text-sm text-black ml-[5rpx]" @click="jumpLogs">兑换记录</text>
        <view> </view>
      </view>
    </template>
    <view
      v-if="authStatus == 1"
      class="absolute top-0 left-0 right-0 bottom-0 flex flex-col h-full mt-[24rpx]"
    >
      <view class="flex flex-col px-[32rpx]">
        <!-- <view class="flex flex-row justify-between items-center">
          <view class="flex flex-row items-center">
            <image
              src="/static/images/store/jifen_icon.svg"
              mode="widthFix"
              class="w-[48rpx] h-[48rpx]"
            ></image>
            <text class="ml-[10rpx] text-5xl text-white font-medium">{{
              integral
            }}</text>
          </view>
          <image
            class="w-[152rpx] h-[160rpx]"
            src="/static/images/store/icon.png"
            mode="scaleToFill"
          />
        </view> -->

        <view class="flex flex-row items-center justify-between py-[32rpx]">
            <!-- <text class="text-lg font-medium mb-[10rpx] text-neutral">当前积分</text> -->
            <view class="flex flex-row items-center">
              <image
                    src="/static/images/store/jifen_icon.svg"
                    mode="widthFix"
                    class="w-[48rpx] h-[48rpx]"
                  ></image>
              <text class="text-6xl text-neutral-theme font-bold">{{ integral }}</text>
            </view>

            <image 
              src="/static/images/store/icon.png"
              mode="widthFix"
              class="w-[152rpx] h-[160rpx]"
            />
        </view>
        <view
          v-if="IsPoint == 1"
          class="bg-[#FFFFFF] rounded-[32rpx] p-[24rpx] mb-[32rpx] flex flex-row justify-between items-center"
        >
          <view class="flex flex-row items-center">
            <image
              class="w-[80rpx] h-[80rpx] mr-[24rpx]"
              src="/static/images/store/icon_cash.png"
              mode="scaleToFill"
            ></image>
            <view class="flex flex-col">
              <view class="flex flex-row items-center leading-6">
                <text class="text-xl font-medium mb-[10rpx] text-neutral"
                  >积分兑换现金</text
                >
                <!-- <view class="flex flex-row items-center ml-[10rpx]">
                  <image
                    src="/static/images/store/jifen_icon.svg"
                    mode="widthFix"
                    class="w-[32rpx] h-[32rpx]"
                  ></image>
                  <text class="ml-[10rpx] text-lg text-neutral font-medium">{{
                    integral
                  }}</text>
                </view> -->
              </view>
              <text class="text-sm text-neutral-secondary"
                >Points redemption cash</text
              >
            </view>
          </view>
          <wk-button
            class="w-[160rpx] h-[72rpx] flex items-center justify-center"
            @click="jumpExchange"
          >
            <text class="text-white text-base">去兑换</text>
          </wk-button>
        </view>
      </view>
      <view class="flex-1 w-full rounded-t-[32rpx] px-[32rpx] box-border bg-white">
        <view class="flex flex-row items-center py-[24rpx]">
          <wk-tabs
            @change="changefenlei"
            :list="tabs"
            :isButton="true"
          ></wk-tabs>
        </view>
        <view
          class="grid grid-cols-2 gap-[32rpx] pb-[32rpx]"
          v-if="shopList.length > 0"
        >
          <view v-for="item in shopList" :key="item.id">
            <view
              @click="jumpProduct(item)"
              class="rounded-[16rpx] overflow-hidden"
            >
              <image
                class="w-full h-[331rpx] bg-black/10 rounded-[16rpx] overflow-hidden"
                :src="item.image"
                mode="aspectFit"
              ></image>
              <view
                class="w-full px-[16rpx] py-[16rpx] box-border flex flex-col justify-between"
              >
                <text class="text-lg font-medium line-clamp-1 w-full text-neutral mb-[16rpx]">{{
                  item.title
                }}</text>
                <view class="flex flex-row items-center w-full">
                  <text class="text-neutral-theme text-2xl font-medium">{{
                    item.integral
                  }}</text>
                  <text
                    class="text-neutral-theme text-sm ml-[10rpx] mt-[8rpx] font-medium"
                    >积分</text
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
        <Empty top="100rpx" title="暂无数据" v-else />
      </view>
    </view>
    <wk-loading v-if="loading" />
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import Empty from "@/components/base/empty";
import {
  getCategory as getCategoryApi,
  getJifenList as getJifenListApi,
  getExchangelog as getExchangelogApi,
} from "@/api/index";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import { cacheManager } from "@/utils/cacheManager";
const cacheData = cacheManager.getCache("storeList");
const cacheCategory = cacheManager.getCache("storeCategory");
const integral = ref(0); // 积分
const shopList = ref([]); // 商城列表
const page = ref(1); // 页码
const cz = ref(""); // 当前操作
const load_data = ref(false);
const tabs = ref([]);
const type = ref(0);
const sortid = ref(null);
const load_data_status = ref(2);
const IsPoint = ref(0);
const layoutRef = ref(null);
const { authStatus, checkAuth } = useAuth();
const loading = ref(false);
const loadingText = ref("");
const jumpExchange = () => {
  uni.navigateTo({
    url: routes.exchangeMoney,
  });
};

const handleRefresh = async () => {
  loading.value = true;
  loadingText.value = "加载中...";
  page.value = 1;
  cz.value = "下拉刷新";
  await getJifen(); // 加载商品
  await getEexchangelog(); // 加载积分
  layoutRef.value.complete();
};

// 上拉加载
const onReachBottom = () => {
  if (loading.value) return ;
  cz.value = "上拉加载";
  page.value++; // 增加页码
  getJifen(); // 请求列表，自动叠加旧数据
};

onShow(() => {
  // 如果未实名认证，则进行认证
  if (authStatus.value !== 1) {
    checkAuth();
  }
});
onLoad(() => {
  page.value = 1;
  if (cacheData) {
    handleList(cacheData);
  }
  if (cacheCategory) {
    handleCategory(cacheCategory);
  }
  getCategory(); // 获取新闻分类
  getEexchangelog(); // 获取积分
});
// 获取分类
const handleCategory = (res) => {
  tabs.value = [
    {
      name: "全部",
      id: 0,
    },
  ];
  if (res.list.length > 0) {
    tabs.value = [
      ...tabs.value,
      ...res.list.map((item) => {
        return {
          name: item.name,
          id: item.id,
        };
      }),
    ];
    getJifen(); // 加载商品分类下的商品
  }
};

const getCategory = async () => {
  const res = await getCategoryApi({
    sortid: 3,
  });
  cacheManager.setCache("storeCategory", res);
  handleCategory(res);
};

// 切换分类
const changefenlei = (res) => {
  console.log(res);
  page.value = 1;
  type.value = res.index;
  sortid.value = res.id;
  getJifen();
};

// 获取用户积分
const getEexchangelog = async () => {
  const res = await getExchangelogApi({});
  console.log(res);
  integral.value = res.integral;
  loading.value = false;
};

const handleList = (res) => {
  load_data_status.value = 3;
  if (page.value == 1) {
    shopList.value = [];
  }
  if (res.list.total > shopList.value.length) {
    shopList.value = shopList.value.concat(res.list.data);
  }
  IsPoint.value = res.IsPoint;
};
// 获取商品列表
const getJifen = async () => {
  if (loading.value) return ;
  load_data_status.value = 2;
  loading.value = true;
  const res = await getJifenListApi({
    page: page.value,
    sortid: sortid.value || null,
  });
  if (page.value == 1) {
    cacheManager.setCache("storeList", res);
  }
  handleList(res);
  loading.value = false;
};

// 跳转到兑换记录
const jumpLogs = () => {
  uni.navigateTo({
    url: routes.exchangeLogs,
  });
};

// 跳转到商品详情页
const jumpProduct = (item) => {
  uni.navigateTo({
    url:
      routes.exchangeProductDetail +
      "?id=" +
      item.id +
      "&ji_fen=" +
      integral.value,
  });
};
</script>

<style scoped lang="scss"></style>
