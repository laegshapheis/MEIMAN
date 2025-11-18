<template>
  <layout
    ref="layoutRef"
    navTitle="获奖记录"
    bgType="bg-main1"
    :refresher="true"
    @onRefresh="handleRefresh"
    @reachBottom="getPaginationList"
  >
    <template v-slot:exp>
      <view class="px-[32rpx]">
        <!-- 类型筛选 -->
        <wk-tabs
          :list="rewardTypes"
          :current="currentTypeIndex"
          :isButton="true"
          @change="handleTypeChange"
          :scrollable="true"
        />
      </view>
    </template>
    <view class="px-[32rpx]">
      <!-- 中奖记录列表 -->
      <view class="w-full box-border mt-[24rpx]">
        <wk-stroke-bg
          v-for="(item, index) in recordList"
          :key="index"
          class="flex flex-row items-center mb-[24rpx]"
          bgColor="#171717"
        >
          <view
            class="w-[106rpx] h-[128rpx] flex justify-center items-center mr-[20rpx] rounded-[8rpx]"
          >
            <image
              class="w-full h-auto rounded-[8rpx]"
              :src="item.reward_img"
              mode="widthFix"
            ></image>
          </view>
          <view class="flex-1 flex flex-col">
            <text class="text-[28rpx] text-white mb-[8rpx] font-medium">{{
              item.reward_name
            }}</text>
            <text class="text-sm text-neutral-regular mt-[8rpx]">{{
              item.created_at
            }}</text>
          </view>
        </wk-stroke-bg>
        <Empty
          v-if="!loading && recordList.length === 0"
          class="mt-[300rpx]"
        ></Empty>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading && page === 1" class="text-center py-[32rpx]">
        <text class="text-base text-neutral-regular">加载中...</text>
      </view>

      <!-- 没有更多 -->
      <view
        v-if="loadFinish && recordList.length > 0"
        class="text-center py-[32rpx]"
      >
        <text class="text-base text-neutral-regular">没有更多了</text>
      </view>
    </view>
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import Empty from "@/components/base/empty";
import { getGoldenEggRecords, getGoldenEggRewardTypes } from "@/api/golden_egg";

const layoutRef = ref(null);
const recordList = ref([]);
const rewardTypes = ref([{ name: "全部", id: 0, value: "" }]);
const currentTypeIndex = ref(0);
const page = ref(1);
const pagesize = ref(10);
const loading = ref(false);
const loadFinish = ref(false);
const pullType = ref("");
const currentType = ref("");

onLoad(() => {
  getRewardTypeList();
  getRecords();
});

// 下拉刷新
const handleRefresh = () => {
  pullType.value = "down";
  loadFinish.value = false;
  page.value = 1;
  getRecords();
};

// 上拉加载
const getPaginationList = () => {
  if (loadFinish.value) return;
  pullType.value = "up";
  page.value++;
  getRecords();
};

const getRewardTypeList = async () => {
  try {
    const res = await getGoldenEggRewardTypes();
    if (res.status != 0) {
      uni.$showToast({
        title: res.msg,
        icon: "none",
      });
      return;
    }
    console.log("res", res);
    if (res.status === 0 && res.data) {
      const types = res.data.list.map((item, index) => ({
        name: item.name || item.label,
        id: index + 1,
        value: item.value || item.type,
      }));
      rewardTypes.value = [{ name: "全部", id: 0, value: "" }, ...types];
    }
  } catch (error) {
    console.error("获取奖品类型失败:", error);
  }
};

const handleTypeChange = (item, index) => {
  currentType.value = item.value;
  currentTypeIndex.value = index;
  pullType.value = "down";
  loadFinish.value = false;
  page.value = 1;
  recordList.value = [];
  getRecords();
};

const getRecords = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    const params = {
      page: page.value,
      pagesize: pagesize.value,
    };

    if (currentType.value) {
      params.reward_type = currentType.value;
    }

    const res = await getGoldenEggRecords(params);
    console.log("res", res);

    if (res.status != 0) {
      uni.$showToast({
        title: res.msg || "获取记录失败",
        icon: "none",
      });
      loading.value = false;
      return;
    }

    // 处理下拉刷新或第一页时清空列表
    if (pullType.value === "down" || page.value === 1) {
      recordList.value = [];
    }

    const list = res.data.list || [];
    const pagination = res.data.pagination || {};

    // 追加数据
    if (pagination.total > recordList.value.length) {
      recordList.value = recordList.value.concat(list);
    }

    // 判断是否加载完成
    const currentPage = parseInt(pagination.page) || 1;
    const totalPage = parseInt(pagination.total_page) || 1;
    if (currentPage >= totalPage) {
      loadFinish.value = true;
    }
  } catch (error) {
    console.error("获取记录失败:", error);
    uni.showToast({
      title: "获取记录失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
    // 通知 layout 组件刷新完成
    if (layoutRef.value) {
      layoutRef.value.complete();
    }
  }
};
</script>
