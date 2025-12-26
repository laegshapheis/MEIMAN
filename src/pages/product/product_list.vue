<template>
  <layout
    :isNav="false"
    navTitle=""
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    bgType="bg-product"
    @reachBottom="handleReachBottom"
  >
    <template #exp>
      <!-- 搜索框 - 固定在顶部 -->
      <view class="flex items-center px-[20rpx]">
        <!-- 返回按钮 -->
        <view @click="handleBack" class="flex-shrink-0 mr-[20rpx]">
          <image
            class="w-[80rpx] h-[80rpx]"
            src="/static/images/common/back.svg"
            mode="widthFix"
          />
        </view>
        <!-- 搜索框 -->
        <view
          class="flex-1 h-[104rpx] px-[20rpx]"
          style="
            background-image: url('/static/images/product/input_bg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            background-position: center;
          "
        >
          <uv-search
            v-model="key"
            maxLength="66"
            bgColor="transparent"
            height="104rpx"
            color="#ffffff"
            :placeholderColor="$colors.placeholder"
            searchIconColor="#ffffff60"
            placeholder="搜索产品"
            placeholderStyle="font-size: 24rpx;"
            @search="handleConfirm"
            @clear="handleClear"
            :showAction="false"
            :inputStyle="{
              fontSize: '28rpx',
              backgroundColor: 'transparent',
            }"
          ></uv-search>
        </view>
      </view>
      <!-- Tabs 区域 - 固定在顶部 -->
      <view class="pt-[32rpx] pb-[20rpx]">
        <view class="px-[20rpx]">
          <wk-tabs
            :list="tabs"
            mode="card"
            @change="handleTabChange"
            :defaultIndex="current"
          />
        </view>
        <view class="px-[32rpx] mb-[16rpx] mt-[20rpx]">
          <wk-tabs
            v-if="subTabs.length > 0"
            :list="subTabs"
            mode="button"
            @change="handleSubTabChange"
            :defaultIndex="subCurrent"
            :inactiveStyle="{
              border: 'none',
            }"
          />
        </view>
      </view>
    </template>
    <productList v-if="authStatus == 1" :list="list" @onSubmit="handleSubmit" />
    <!-- 加载状态提示 -->
    <view v-if="list.length > 0" class="flex justify-center py-[32rpx]">
      <text v-if="loading" class="text-neutral-regular text-sm">{{ loadingText }}</text>
      <text v-else-if="loadFinish" class="text-neutral-regular text-sm">没有更多了</text>
      <text v-else class="text-neutral-regular text-sm">上拉加载更多</text>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, watch } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { getProductlistv2, getProducts } from "@/api/product";
import { routes } from "@/config/routes";
import productList from "./components/list/product_list.vue";
import checkNetwork from "@/utils/checkNetWork";
import { useAuth } from '@/hooks/useAuth'
import { navigateBack } from '@/utils/navigation'

const page = ref(1); // 当前页码
const key = ref(""); // 搜索关键词
const layoutRef = ref(null);
const list = ref([]); // 列表数据
const tabs = ref([]);
const subTabs = ref([]);
const currentItem = ref({});
const subCurrentItem = ref({});
const current = ref(0);
const subCurrent = ref(0);
const loading = ref(false);
const loadingText = ref('');
const loadFinish = ref(false); // 是否加载完成
const pullType = ref(""); // 拉取类型：down-下拉刷新，up-上拉加载
const isInitialized = ref(false); // 是否已经初始化过
const { authStatus, checkAuth } = useAuth()
onShow(async () => {
  // 检查可用域名
  checkNetwork({
    onFailure: () => {
      uni.switchTab({
        url: routes.service,
      });
    },
    onSuccess: async () => {
      // 如果未实名认证，则进行认证
      if (authStatus.value !== 1) {
        await checkAuth()
        if (authStatus.value == 1) {
          // 认证成功后需要重新初始化
          init();
        }
      } else {
        // 只有未初始化过时才初始化
        if (!isInitialized.value) {
          init();
        }
      }
    },
  });
});
const init = async (type = '') => {
  // 只有在tabs为空或需要刷新时才获取产品分类
  if (tabs.value.length === 0 || type === 'refresh') {
    await getProductsTabs();
  }
  
  // 处理从缓存中获取的tab类型
  const tabType = uni.getStorageSync('switchTabData')?.tabType;
  if (tabType) {
    const index = tabs.value.findIndex(item => item.id == tabType);
    if (index !== -1) {
      current.value = index;
      currentItem.value = tabs.value[index];
      const category = currentItem.value.NextCategoryList || [];
      if (category.length > 0) {
      subTabs.value = [{
        id: 'all',
          name: '全部',
        }, ...category] || [];
      } else {
        subTabs.value = [];
      }
      subCurrentItem.value = subTabs.value[0] || {};
      subCurrent.value = 0;
    }
    uni.removeStorageSync('switchTabData');
  }
  
  // 初始化时重置分页状态
  if (type !== 'refresh') {
    page.value = 1;
    loadFinish.value = false;
    pullType.value = "down";
  }
  
  // 获取产品列表
  getProductlist();
  
  // 标记已经初始化过
  isInitialized.value = true;
}
// 切换tab
const handleTabChange = (item, index) => {
  page.value = 1;
  loadFinish.value = false;
  pullType.value = "down";
  current.value = index;
  currentItem.value = item;
  const category = item.NextCategoryList || [];
  if (category.length > 0) {
    subTabs.value = [{
      id: 'all',
      name: '全部',
    }, ...category] || [];
  } else {
    subTabs.value = [];
  }
  subCurrentItem.value = subTabs.value[0] || {};
  subCurrent.value = 0;
  getProductlist();
};
const handleSubTabChange = (item, index) => {
  page.value = 1;
  loadFinish.value = false;
  pullType.value = "down";
  subCurrent.value = index;
  subCurrentItem.value = item;
  getProductlist();
};
const handleSubmit = (item, type = "") => {
  // 如果是股权项目，则跳转到股权详情
  if (item.category_id == 32) {
    uni.navigateTo({
      url: `${routes.equityDetail}?id=${item.id}`,
    });
    return;
  }
  if (!type) {
    uni.navigateTo({
      url: `${routes.productDetail}?id=${item.id}`,
    });
  } else {
    uni.navigateTo({
      url: `${routes.pinTuanDetail}?id=${item.id}&type=${type}`,
    });
  }
};
// 搜索确认
const handleConfirm = (value) => {
  key.value = value;
  page.value = 1;
  loadFinish.value = false;
  pullType.value = "down";
  getProductlist();
};
// 清除搜索
const handleClear = () => {
  key.value = "";
  page.value = 1;
  loadFinish.value = false;
  pullType.value = "down";
  getProductlist();
};
// 返回按钮
const handleBack = () => {
  navigateBack();
};
// 刷新列表
const handleRefresh = async  () => {
  current.value = 0;
  subCurrent.value = 0;
  currentItem.value = {};
  subCurrentItem.value = {};
  page.value = 1;
  loadFinish.value = false;
  pullType.value = "down";
  // 刷新时重置初始化状态，确保能够重新获取数据
  isInitialized.value = false;
  await init('refresh');
  layoutRef.value.complete();
};

// 获取产品列表分类
const getProductsTabs = async () => {
  const res = await getProducts();
  console.log('res',res)
  tabs.value = res.ProductsCategory;
  const category = res.ProductsCategory[0]?.NextCategoryList || [];
  if (category.length > 0) {
    subTabs.value = [{
      id: 'all',
      name: '全部',
    }, ...category] || [];
  } else {
    subTabs.value = [];
  }
  current.value = 0;
  subCurrent.value = 0;
  currentItem.value = res.ProductsCategory[0] || {};
  subCurrentItem.value = subTabs.value[0] || {};
};
// 获取产品列表
const getProductlist = async () => {
  loading.value = true;
  loadingText.value = '加载中...'

  const res = await getProductlistv2({
    BID: currentItem.value.id,
    id: subCurrentItem.value.id == 'all' ? '' : (subCurrentItem.value.id || currentItem.value.id),
    key: key.value,
    page: page.value,
    pagesize: 5,
  });
  console.log('res',res)
  if (res.status == 0) {
    const listData = res.list || {};
    const data = listData.data || [];
    
    // 处理分页数据
    if (pullType.value == "down" || page.value == 1) {
      list.value = [...data];
    } else {
      list.value = [...list.value, ...data];
    }
    
    // 判断是否还有更多数据
    if (listData.current_page >= listData.last_page || data.length === 0) {
      loadFinish.value = true;
    }
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
  loading.value = false;
};
const handleReachBottom = () => {
  if (loadFinish.value || loading.value) return;
  pullType.value = "up";
  page.value++;
  console.log('page',page.value)
  getProductlist();
};
</script>

<style lang="scss" scoped></style>
