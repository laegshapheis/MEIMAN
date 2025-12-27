<template>
  <layout
    ref="layoutRef"
    navTitle="兑换记录"
    bgType="bg-main"
    @reachBottom="handleReachBottom"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <template v-slot:navRight>
      <view class="flex flex-row items-center rounded-full px-[16rpx] py-[8rpx]">
        <uv-icon name="error-circle" color="#000" size="12"></uv-icon>
        <text class="ml-[5rpx] text-sm text-black" @click="showTips"
          >规则</text
        >
      </view>
    </template>
    <view class="px-[32rpx] pb-[32rpx]">
      <view>
        <template v-if="list.length !== 0">
          <wk-stroke-bg shadow borderRadius="24rpx"
          mode="img-card3-big"
            class="p-[32rpx] flex flex-col mt-[24rpx]"
            v-for="(item, idx) in list"
            :key="idx"
          >
            <view class="pb-[24rpx] flex flex-row justify-between items-center">
              <text class="text-base text-neutral-regular"
                >时间：{{ item.created_at }}</text
              >
              <view
                :class="[
                  'text-base',
                  item.status === 1 ? 'text-neutral-theme' : '',
                  item.status === 0 ? 'text-neutral-regular' : '',
                  item.status === -1 ? 'text-neutral-error' : '',
                ]"
              >
                {{
                  item.status == 0
                    ? "等待处理"
                    : item.status == 1
                    ? "兑换成功"
                    : "兑换失败"
                }}
              </view>
            </view>
            <view class="w-full h-[1rpx] bg-neutral-divider mt-[8rpx]"></view>
            <view class="py-[24rpx] flex flex-row">
              <image
                class="w-[168rpx] h-[168rpx] rounded-[16rpx] mr-[20rpx]"
                :src="item.image"
                mode="aspectFill"
              ></image>
              <view class="flex flex-col justify-between flex-1">
                <text class="text-base text-neutral">
                  {{ item.productname }}
                </text>
                <view class="flex flex-row w-full justify-between items-center">
                  <text
                    class="text-2xl flex flex-row items-center justify-between"
                  >
                    <text
                      class="text-neutral mr-[5rpx] font-semibold text-3xl"
                      >{{ item.integral }}</text
                    >
                    <text class="text-base">积分</text>
                  </text>
                  <text class="text-neutral-regular text-sm mt-[10rpx]"
                    >x{{ item.number }}</text
                  >
                </view>
              </view>
            </view>
            <view class="w-full h-[1rpx] bg-neutral-divider mt-[8rpx]"></view>
            <view class="text-right py-[24rpx]">
              共{{ item.number }}件，合计：{{ item.integral }}积分
            </view>
            <view
              class="bg-[#fff] text-neutral-error text-sm p-[24rpx] rounded-[8rpx]"
              v-if="item.status == -1"
            >
              失败原因：{{ item.memo }}
            </view>
            <view
              class="p-[24rpx] rounded-[8rpx] text-neutral text-base"
              v-if="item.status == 1"
            >
              <view class="flex flex-row items-center text-neutral-regular">
                <text>物流信息：</text>
                <text>{{ item.ExpressOrder }}</text>
              </view>
              <view class="flex flex-row items-center mt-[10rpx]">
                <view
                  class="flex flex-row items-center mr-[10rpx] text-neutral-regular"
                >
                  <text>物流单号：</text>
                  <text>{{ item.ExpressName }}</text></view
                >
                <image
                  @click="copy_wldh(item)"
                  src="/static/images/store/copy.svg"
                  mode="widthFix"
                  class="w-[32rpx] h-[32rpx]"
                ></image>
              </view>
            </view>
            <template v-if="item.status == 0">
              <view
                class="flex flex-col mb-[16rpx] p-[24rpx] rounded-[16rpx] text-neutral text-base"
              >
                <view class="flex flex-row">
                  <view
                    class="flex-shrink-0 text-neutral-regular w-[150rpx] text-base"
                    >收货信息:</view
                  >
                  <view class="text-neutral-regular text-base"
                    >{{ item.name }} {{ item.phone }} {{ item.location }}
                    {{ item.shouhuodizhi }}</view
                  >
                </view>
              </view>
              <view class="flex flex-row justify-end">
                <view
                  @click="goAddress(item.id)"
                  class="w-[150rpx] py-[10rpx] text-center text-sm text-neutral-theme"
                  >更换地址</view
                >
              </view>
            </template>
          </wk-stroke-bg>
        </template>
        <Empty title="暂无数据" v-else />
      </view>
    </view>
    <wk-modal ref="wkPopupRef" title="规则说明">
      <uv-parse
        container-style="white-space: pre-wrap"
        :content="rules"
      ></uv-parse>
    </wk-modal>
    <wk-code-input ref="keywordRef" :value="paypwd" @finish="handleConfirm" />
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import Empty from "@/components/base/empty";
import { routes } from "@/config/routes";
import {
  updateExchangeAddress,
  getExchangelog as getExchangeLogApi,
} from "@/api/index";
import { cacheManager } from "@/utils/cacheManager";
// 响应式状态
const loading = ref(false);
const loadingText = ref("");
const rules = ref("");
const integral = ref(0);
const list = ref([]);
const t_current_page = ref(1);
const paypwd = ref("");
const id = ref("");
const address_id = ref("");
const sid = ref(null);
const lock = ref(false)
// 组件引用
const layoutRef = ref(null);
const wkPopupRef = ref(null);
const keywordRef = ref(null);
const cacheData = cacheManager.getCache("exchangeLogs");

// 生命周期钩子
onLoad(() => {
  if (cacheData) {
    handleCache(cacheData);
  }
  getEexchangelog();
});

// 方法
const handleConfirm = async (pwd) => {
  paypwd.value = pwd;
  if (paypwd.value.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      duration: 3000,
      icon: "none",
    });
    return;
  }
  loading.value = true;
  loadingText.value = "";
  const res = await updateExchangeAddress({
    paypwd: paypwd.value,
    id: id.value,
    address_id: address_id.value,
  });
  loading.value = false;
  if (res.status == 0) {
    keywordRef.value.close();
    handleRefresh();
  } else {
    uni.$showToast({
      title: res.msg,
      duration: 3000,
      icon: "none",
    });
    keywordRef.value.close();
  }
  uni.$off("selectedAddress", () => {});
};

const goAddress = (itemId) => {
  id.value = itemId;
  uni.navigateTo({
    url: routes.address,
  });
  uni.$on("selectedAddress", (data) => {
    if (sid.value) {
      clearTimeout(sid.value);
    }
    sid.value = setTimeout(() => {
      if (keywordRef.value) {
        keywordRef.value.open();
        address_id.value = data.id;
      }
    }, 300);
  });
};

// 上拉加载
const handleRefresh = () => {
  list.value = [];
  t_current_page.value = 1;
  getEexchangelog();
};

const handleReachBottom = () => {
  if (loading.value) return ;
  t_current_page.value++;
  getEexchangelog();
};

const showTips = () => {
  wkPopupRef.value.open();
};

// 返回
const bankJump = () => {
  uni.navigateBack();
};

const copy_wldh = (obj) => {
  let str = obj.ExpressName.toString();
  uni.setClipboardData({
    data: str,
    success: function () {
      uni.$showToast({
        title: "单号已复制",
        duration: 3000,
      });
    },
  });
};

const handleCache = (res) => {
  rules.value = res.rules;
  integral.value = res.integral;
  if (res.list.data.length == 0) {
    loading.value = false;
  } else {
    if (t_current_page.value == 1) {
      list.value = res.list.data;
    } else {
      if (res.list.total > list.value.length) {
        list.value = list.value.concat(res.list.data);
      }
    }
    loading.value = false;
  }
};
const getEexchangelog = () => {
  if (lock.value) return ;
  lock.value = true;
  loading.value = true;
  loadingText.value = "加载中...";
  getExchangeLogApi({
    page: t_current_page.value,
  })
    .then((res) => {
      lock.value = false;
      if (t_current_page.value == 1) {
        cacheManager.setCache("exchangeLogs", res);
      }
      handleCache(res);
    })
    .finally(() => {
      lock.value = false;
      loading.value = false;
      layoutRef.value.complete();
    });
};
</script>