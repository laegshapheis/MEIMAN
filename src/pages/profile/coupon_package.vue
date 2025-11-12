<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="券包"
    bgType="bg-main"
    @reachBottom="getPaginationList"
  >
    <view class="px-page-x pb-[30rpx] box-border w-full flex flex-col w-full">
      <!-- 主标签页：代金券、加息券、VIP体验券 -->
      <wk-tabs
        :list="mainTabList"
        :current="mainType"
        :isButton="false"
        @change="changeMainType"
        :scrollable="false"
        :activeStyle="{
          color: $colors.theme,
        }"
        class="w-full"
      />

      <!-- 子标签页：去使用、已使用、已过期 -->
      <wk-tabs
        :list="subTabList"
        :current="subType"
        :isButton="true"
        @change="changeSubType"
        :scrollable="true"
        class="mt-[10rpx]"
      />

      <!-- 代金券内容 -->
      <view v-if="mainType === 0" class="flex flex-col mt-[10rpx]">
        <wk-stroke-bg
          shadow
          size="small"
          v-for="item in cashCouponList"
          :key="item.id"
          class="relative flex flex-col p-[24rpx] mb-[24rpx]"
        >
          <!-- 第一行：图片+名称+状态按钮 -->
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <!-- 左侧：图片+名称 -->
            <view class="flex flex-row items-center">
              <image
                class="w-[68rpx] h-[68rpx] mr-[16rpx]"
                src="/static/images/profile/profile_vouchers.png"
                mode="widthFix"
              />
              <text class="text-neutral-white font-bold text-base">{{ item.money }} {{ symbolStore.code }}代金券</text>
            </view>
            
            <!-- 右侧：状态按钮 -->
            <view
              @click="() => goUseCashCoupon(item)"
              :style="{
                background:
                  item.status == 1
                  ? $colors.buttonBg
                  : '#2A877C33',
              }"
              :class="[
                'px-[24rpx] py-[8rpx] rounded-[16rpx]',
                item.status == 1
                  ? 'flex flex-row items-center justify-center text-sm text-white font-medium'
                  : 'flex flex-row items-center justify-center text-sm font-medium text-neutral-regular'
              ]"
            >
              <text class="text-base whitespace-nowrap">{{
                subTabList[subType].name
              }}</text>
            </view>
          </view>
          
          <view class="w-full h-[1px] bg-neutral-divider mb-[16rpx]"></view>
          
          <!-- 第二行：描述和时间信息 -->
          <view class="flex flex-col gap-[8rpx]">
            <!-- 使用时间 -->
            <text
              v-if="item.status == 2"
              class="text-sm text-neutral-regular"
            >使用时间: {{ item.updated_at }}</text>
            
            <!-- 领取时间 -->
            <text
              :class="[
                'text-sm',
                true || item.status == 1
                  ? 'text-neutral-regular'
                  : 'text-neutral-light',
              ]"
            >领取时间: {{ item.created_at }}</text>
            
            <!-- 到期时间 -->
            <text
              :class="[
                'text-sm',
                true || item.status == 1
                  ? 'text-neutral-regular'
                  : 'text-neutral-light',
              ]"
            >到期时间: {{ item.exptime }}</text>
            
            <!-- 描述信息 -->
            <text
              v-if="item.status == 2 && item.content"
              class="text-sm text-neutral-regular"
            >{{ item.content }}</text>
          </view>
        </wk-stroke-bg>
        
        <Empty class="mt-[300rpx]" title="暂无代金券" v-if="cashCouponList.length == 0" />
      </view>

      <!-- 加息券内容 -->
      <view v-if="mainType === 1" class="flex flex-col mt-[10rpx]">
        <wk-stroke-bg
          shadow
          size="small"
          v-for="item in rateCouponList"
          :key="item.id"
          class="relative flex flex-col p-[24rpx] mb-[24rpx]"
        >
          <!-- 第一行：图片+名称+状态按钮 -->
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <!-- 左侧：图片+名称 -->
            <view class="flex flex-row items-center">
              <image
                class="w-[68rpx] h-[68rpx] mr-[16rpx]"
                src="/static/images/profile/interest_rate_coupons.png"
                mode="widthFix"
              />
              <text class="text-neutral-white font-bold text-base">{{ item.name }}</text>
            </view>
            
            <!-- 右侧：状态按钮 -->
            <view
              @click="() => goUseRateCoupon(item, 1)"
              :style="{
                background:
                  item.status == 1
                  ? $colors.buttonBg
                  : '#2A877C33'
              }"
              :class="[
                'px-[24rpx] py-[8rpx] rounded-[16rpx]',
                item.status == 1
                  ? 'flex flex-row items-center justify-center text-sm text-white font-medium'
                  : 'flex flex-row items-center justify-center text-sm font-medium text-neutral-regular'
              ]"
            >
              <text class="text-base whitespace-nowrap">{{
                subTabList[subType].name
              }}</text>
            </view>
          </view>
          
          <view class="w-full h-[1px] bg-neutral-divider mb-[16rpx]"></view>
          
          <!-- 第二行：描述和时间信息 -->
          <view class="flex flex-col gap-[8rpx]">
            <!-- 使用时间 -->
            <text
              v-if="item.status == 2"
              class="text-sm text-neutral-regular"
            >使用时间: {{ item.updated_at }}</text>
            
            <!-- 领取时间 -->
            <text
              :class="[
                'text-sm',
                true || item.status == 1
                  ? 'text-neutral-regular'
                  : 'text-neutral-light',
              ]"
            >领取时间: {{ item.created_at }}</text>
            
            <!-- 到期时间 -->
            <text
              :class="[
                'text-sm',
                true || item.status == 1
                  ? 'text-neutral-regular'
                  : 'text-neutral-light',
              ]"
            >到期时间: {{ item.exptime }}</text>
            
            <!-- 描述信息 -->
            <text
              v-if="item.status == 2 && item.content"
              class="text-sm text-neutral-regular"
            >{{ item.content }}</text>
          </view>
        </wk-stroke-bg>
        
        <Empty class="mt-[300rpx]" title="暂无加息券" v-if="rateCouponList.length == 0" />
      </view>

      <!-- VIP体验券内容 -->
      <view v-if="mainType === 2" class="flex flex-col mt-[10rpx]">
        <wk-stroke-bg
          shadow
          size="small"
          v-for="item in vipCouponList"
          :key="item.id"
          class="relative flex flex-col p-[24rpx] mb-[24rpx]"
        >
          <!-- 即将过期标签 -->
          <view
            class="absolute top-0 left-0 z-10 px-[12rpx] rounded-br-[16rpx] rounded-tl-[16rpx]"
            style="background: #B676FF"
            v-if="item.status === 1 && isExpiringSoon(item.exptime)"
          >
            <text class="text-xs text-white">将过期</text>
          </view>

          <!-- 第一行：图片+名称+状态按钮 -->
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <!-- 左侧：图片+名称 -->
            <view class="flex flex-row items-center">
              <image
                class="w-[68rpx] h-[68rpx] mr-[16rpx]"
                src="/static/images/profile/tiyan_vip.png"
                mode="widthFix"
              />
              <text class="text-neutral-white font-bold text-base">{{ item.name }}</text>
            </view>
            
            <!-- 右侧：状态按钮 -->
            <view
              @click="() => item.status === 1 ? handleActivate(item) : null"
              :style="{
                background:
                  item.status == 1
                  ? $colors.buttonBg
                  : '#2A877C33',
              }"
              :class="[
                'px-[24rpx] py-[8rpx] rounded-[16rpx]',
                item.status == 1
                  ? 'flex flex-row items-center justify-center text-sm text-white font-medium'
                  : 'flex flex-row items-center justify-center text-sm font-medium text-neutral-regular'
              ]"
            >
              <text class="text-base whitespace-nowrap">{{
                item.status === 1 ? '激活' : 
                (item.status === 0 || item.status === 2) ? '已使用' : 
                item.status === 3 ? '已过期' : '未知状态'
              }}</text>
            </view>
          </view>
          <view class="w-full h-[1px] bg-neutral-divider mb-[16rpx]"></view>
          <!-- 第二行：描述和时间信息 -->
          <view class="flex flex-col gap-[8rpx]">
            <!-- 平台说明 -->
            <text v-if="item.content" class="text-sm text-neutral-regular">{{item.content}}</text>
            
            <!-- 使用时间 -->
            <text
              v-if="item.status === 0 || item.status === 2"
              class="text-sm text-neutral-regular"
            >使用时间: {{ formatDateTime(item.updated_at) }}</text>
            
            <!-- 过期时间 -->
            <text
              v-if="item.status === 1 || item.status === 3"
              class="text-sm text-neutral-regular"
            >过期时间: {{ formatDateTime(item.exptime) }}</text>
          </view>
        </wk-stroke-bg>
        
        <Empty class="mt-[300rpx]" title="暂无VIP体验券" v-if="vipCouponList.length == 0" />
      </view>
    </view>

    <!-- 加载状态 -->
    <wk-loading v-if="loading" :loadingText="loadingText" />

    <!-- VIP体验券激活确认弹框 -->
    <wk-modal ref="activateModalRef" title="确认激活" :showClose="false" v-if="mainType === 2">
      <view class="flex flex-col items-center px-[16rpx]">
        <text class="text-white text-base text-left mb-[40rpx]">
          确认现在激活VIP体验券吗?激活将会立刻享受VIP权益
        </text>
        
        <view class="flex flex-col w-full gap-[16rpx]">
          <wk-button
            @submit="confirmActivate"
            :loading="activating"
          >
            确认激活
          </wk-button>
          
          <view
            @click="cancelActivate"
            class="w-full py-[12rpx] text-center"
          >
            <text class="text-neutral-theme text-base">取消</text>
          </view>
        </view>
      </view>
    </wk-modal>
  </layout>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { routes } from "@/config/routes";
import Empty from "@/components/base/empty";
import { getCouponList as getCouponListApi } from "@/api/user";
import { requestApi } from "@/utils/request";
import { cacheManager } from "@/utils/cacheManager";

// 主标签页：代金券、加息券、VIP体验券
const mainTabList = [
  {
    name: "代金券",
    id: 0,
  },
  {
    name: "加息券",
    id: 1,
  },
  {
    name: "VIP体验券",
    id: 2,
  },
];

// 子标签页：去使用、已使用、已过期
const subTabList = [
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

const mainType = ref(0); // 主标签页类型
const subType = ref(0); // 子标签页类型
const page = ref(1);
const loading = ref(false);
const loadingText = ref("");
const layoutRef = ref(null);
const activateModalRef = ref(null);
const symbolStore = useSymbolStore();
const activating = ref(false);
const currentCoupon = ref(null);

// 数据列表
const cashCouponList = ref([]);
const rateCouponList = ref([]);
const vipCouponList = ref([]);

const pullType = ref("");
const lock = ref(false);

// 缓存数据
const cashCouponCache = cacheManager.getCache("cashCoupon");
const rateCouponCache = cacheManager.getCache("rateCoupon");
const vipCouponCache = cacheManager.getCache("vipExperienceCoupon");

onLoad((options) => {
  // 加载缓存数据
  if (cashCouponCache) {
    handleCashCouponList(cashCouponCache);
  }
  if (rateCouponCache) {
    handleRateCouponList(rateCouponCache);
  }
  if (vipCouponCache) {
    handleVipCouponList(vipCouponCache);
  }
  
  // 加载当前类型的数据
  getCurrentTypeData();
});

const handleRefresh = () => {
  pullType.value = "down";
  page.value = 1;
  getCurrentTypeData();
};

// 上拉加载
onReachBottom(() => {
  getPaginationList();
});

const getPaginationList = () => {
  if (lock.value) return;
  pullType.value = "up";
  page.value++;
  getCurrentTypeData();
};

// 切换主标签页
const changeMainType = (e) => {
  mainType.value = e.id;
  subType.value = 0; // 重置子标签页
  page.value = 1;
  getCurrentTypeData();
};

// 切换子标签页
const changeSubType = (e) => {
  subType.value = e.id;
  page.value = 1;
  getCurrentTypeData();
};

// 获取当前类型的数据
const getCurrentTypeData = async () => {
  if (mainType.value === 0) {
    await getCashCouponList();
  } else if (mainType.value === 1) {
    await getRateCouponList();
  } else if (mainType.value === 2) {
    await getVipCouponList();
  }
};

// 代金券相关方法
const getCashCouponList = async (showLoading = true) => {
  if (lock.value) return;
  lock.value = true;
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  try {
    const result = await getCouponListApi({
      page: page.value,
      sortid: subType.value,
      type: 1,
    });

    if (page.value == 1) {
      cacheManager.setCache("cashCoupon", result);
    }

    layoutRef.value.complete();
    handleCashCouponList(result);
  } catch (error) {
    uni.$showToast({
      title: "加载失败，请重试",
      duration: 2000,
      icon: "none",
    });
  } finally {
    lock.value = false;
  }
};

const handleCashCouponList = (result) => {
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
    cashCouponList.value = [];
  }

  if (result.list.total > cashCouponList.value.length) {
    cashCouponList.value = cashCouponList.value.concat(result.list.data);
  }

  loading.value = false;
};

const goUseCashCoupon = (item) => {
  if (item.status != 1) return "";
  uni.switchTab({
    url: routes.productList,
  });
};

// 加息券相关方法
const getRateCouponList = async (showLoading = true) => {
  if (lock.value) return;
  lock.value = true;
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  try {
    const result = await getCouponListApi({
      page: page.value,
      sortid: subType.value,
      type: 2,
    });

    if (page.value == 1) {
      cacheManager.setCache("rateCoupon", result);
    }

    layoutRef.value.complete();
    handleRateCouponList(result);
  } catch (error) {
    uni.$showToast({
      title: "加载失败，请重试",
      duration: 2000,
      icon: "none",
    });
  } finally {
    lock.value = false;
  }
};

const handleRateCouponList = (result) => {
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
    rateCouponList.value = [];
  }

  if (result.list.total > rateCouponList.value.length) {
    rateCouponList.value = rateCouponList.value.concat(result.list.data);
  }

  loading.value = false;
};

const goUseRateCoupon = (item, type) => {
  if (item.status != 1) return "";
  if (type == 1) {
    uni.switchTab({
      url: routes.productList,
    });
  } else {
    uni.navigateTo({ url: routes.rateTransfer + "?id=" + item.id + "&name=" + item.name});
  }
};

// VIP体验券相关方法
const getVipCouponList = async (showLoading = true) => {
  if (lock.value) return;
  lock.value = true;
  
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }

  try {
    const result = await requestApi({
      url: "/api/user/couponlogs",
      method: "POST",
      data: {
        page: page.value,
        type: 5,
        sortid: subType.value,
      }
    });

    if (page.value == 1) {
      cacheManager.setCache("vipExperienceCoupon", result);
    }

    layoutRef.value.complete();
    handleVipCouponList(result);
  } catch (error) {
    uni.$showToast({
      title: "加载失败，请重试",
      duration: 2000,
      icon: "none",
    });
  } finally {
    lock.value = false;
  }
};

const handleVipCouponList = (result) => {
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
    vipCouponList.value = [];
  }

  if (result.list.total > vipCouponList.value.length) {
    vipCouponList.value = vipCouponList.value.concat(result.list.data);
  }

  loading.value = false;
};

// 处理激活按钮点击
const handleActivate = (item) => {
  currentCoupon.value = item;
  activateModalRef.value.open();
};

// 确认激活
const confirmActivate = async () => {
  if (!currentCoupon.value) return;
  
  activating.value = true;
  try {
    const result = await requestApi({
      url: "/api/v2/coupon/useVipTrialCoupon",
      method: "POST",
      data: {
        id: currentCoupon.value.id
      }
    });

    if (result.status === 0) {
      // 激活成功，立即刷新列表数据
      vipCouponList.value = [];
      page.value = 1;
      cacheManager.clearCache("vipExperienceCoupon");
      lock.value = false;
      pullType.value = "down";
      
      // 刷新数据
      try {
        const refreshResult = await requestApi({
          url: "/api/user/couponlogs",
          method: "POST",
          data: {
            type: 5,
            sortid: subType.value,
          }
        });
        
        if (refreshResult.status === 0 && refreshResult.list && refreshResult.list.data) {
          vipCouponList.value = refreshResult.list.data;
        }
      } catch (refreshError) {
        // 刷新失败，保持数据为空
      }
      
      // 显示成功提示
      uni.$showToast({
        title: result.msg,
        duration: 2000,
        icon: "success",
      });
      
      // 关闭弹窗和loading
      activating.value = false;
      activateModalRef.value.close();
      currentCoupon.value = null;
    } else {
      uni.$showToast({
        title: result.msg,
        duration: 2000,
        icon: "none",
      });
      activating.value = false;
      activateModalRef.value.close();
      currentCoupon.value = null;
    }
  } catch (error) {
    uni.$showToast({
      title: "激活失败，请重试",
      duration: 2000,
      icon: "none",
    });
    activating.value = false;
    activateModalRef.value.close();
    currentCoupon.value = null;
  }
};

// 取消激活
const cancelActivate = () => {
  activateModalRef.value.close();
  currentCoupon.value = null;
};

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
};

// 判断是否即将过期（24小时内）
const isExpiringSoon = (expTime) => {
  if (!expTime) return false;
  const now = new Date();
  const exp = new Date(expTime);
  const diff = exp.getTime() - now.getTime();
  return diff > 0 && diff <= 24 * 60 * 60 * 1000; // 24小时内
};
</script>

<style lang="scss" scoped>
.uni-scroll-view-content > uni-view > uni-view {
  justify-content: space-between !important;
}

:deep .fui-scroll__view {
  justify-content: space-between;
}
</style>
