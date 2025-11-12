<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="中奖记录"
    bgType="bg-main"
    
    @reachBottom="getPaginationList"
  >
    <view class="px-page-x py-page-y">
      <view class="flex flex-row w-full mb-[32rpx]">
        <wk-tabs
          :list="typeList"
          :isButton="true"
          @change="changeType"
        ></wk-tabs>
      </view>

      <view class="pb-[100rpx] box-border w-full flex flex-col">
        <!-- 内容区域 => 开始 -->
        <view>
          <wk-stroke-bg
            size="small"
            v-for="item in dataList"
            :key="item.id"
            class="mb-[16rpx] rounded-[16rpx]"
          >
            <view class="flex flex-row items-center justify-start">
              <image
                class="w-[138rpx] h-[138rpx] rounded-[8rpx] bg-white/10 mr-[24rpx]"
                :src="item.image"
                mode="widthFix"
              ></image>
              <view class="flex flex-col">
                <view class="text-lg text-neutral">{{ item.prize_name }}</view>
                <view class="text-base text-neutral-regular mt-[12rpx]">{{
                  item.created_at
                }}</view>
              </view>
            </view>
          </wk-stroke-bg>
        </view>
        <!-- 内容区域 => 结束 -->
        <Empty class="mt-[300rpx]" v-if="dataList.length == 0" :color="$colors.regular"></Empty>
      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import Empty from "@/components/base/empty";
import {
  getLotteryLogList as getLogListApi,
  getLotteryRecordTypeList,
} from "@/api/index";
import { cacheManager } from "@/utils/cacheManager";

const cacheLogList = cacheManager.getCache("lotteryRecord");
const cacheTypeList = cacheManager.getCache("lotteryRecordType");
const page = ref(1);
const dataList = ref([]);
const layoutRef = ref(null);
const pullType = ref("");
const type = ref("");
const loadFinish = ref(false);
const loading = ref(false);
const loadingText = ref("");

onShow(() => {
  if (cacheLogList) {
    handleGetLogList(cacheLogList);
  }
  if (cacheTypeList) {
    handleGetLotteryRecordTypeList(cacheTypeList);
  }
  getLogList();
  getLotteryRecordTypeListInfo();
});

const handleRefresh = () => {
  pullType.value = "down";
  loadFinish.value = false;
  page.value = 1;
  getLogList();
};

const typeList = ref([]);

const handleGetLotteryRecordTypeList = async (result) => {
  if (result.status && result.status != 0) {
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });
    return;
  }
  typeList.value = result.data || [];
};
const getLotteryRecordTypeListInfo = async () => {
  const result = await getLotteryRecordTypeList();
  cacheManager.setCache("lotteryRecordType", result);
  handleGetLotteryRecordTypeList(result);
};

const getPaginationList = () => {
  if (loadFinish.value) return;
  pullType.value = "up";
  page.value++;
  getLogList();
};

const handleGetLogList = async (result) => {
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
  loading.value = false;
};
const getLogList = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
  }

  const result = await getLogListApi({
    type: type.value,
    page: page.value,
  });
  if (page.value == 1) {
    cacheManager.setCache("lotteryRecord", result);
  }
  layoutRef.value.complete();
  handleGetLogList(result);
};

const changeType = (item, index) => {
  type.value = item.id;
  page.value = 1;
  dataList.value = [];
  getLogList();
};
</script>

<style lang="scss">
.container-bg {
  background: linear-gradient(180deg, #2293fd 0%, #81d2ee 17.8%);
}
.right-menu {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .icon {
    width: 48rpx;
    height: 48rpx;
  }
  .str {
    color: #000000;
    font-size: 24rpx;
  }
}
.slef_32 {
  box-sizing: border-box;
  padding: 24rpx 28rpx 1rpx;
}
// 装饰部分
.b-k-1,
.b-k-2,
.b-k-3,
.b-k-4 {
  position: absolute;
  width: 28rpx;
  height: 28rpx;
  border: 6rpx solid #000000;
}
.b-k-1,
.b-k-4 {
  left: -6rpx;
  border-right: none;
}
.b-k-1,
.b-k-2 {
  top: -6rpx;
  border-bottom: none;
}
.b-k-2,
.b-k-3 {
  right: -6rpx;
  border-left: none;
}
.b-k-3,
.b-k-4 {
  bottom: -6rpx;
  border-top: none;
}

.item-card {
  position: relative;
  padding: 32rpx;
  line-height: 1.4;
  background-color: #003972;
  background-image: linear-gradient(270deg, #00366c, #005bb5);
  border: 1px solid #000000;
  margin-bottom: 32rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .title-status {
    .title {
      font-size: 32rpx;
      color: #fff;
    }

    .status {
      margin-top: 12rpx;
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  .line-tips {
    margin-right: 24rpx;
    .icon {
      width: 128rpx;
      height: 128rpx;
    }
    .var {
    }
    .dfn {
      font-weight: bold;
    }
  }
  .tips-s {
    margin-top: 12rpx;
    color: #b8dbff;
    font-size: 28rpx;
  }
  .info-box-x {
    margin-top: 32rpx;
    .hr-x {
      height: 2rpx;
      background-image: linear-gradient(
        to right,
        rgba(3, 88, 173, 1),
        rgba(7, 254, 239, 1),
        rgba(3, 88, 173, 1)
      );
    }
    .line-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      font-size: 28rpx;
      padding: 24rpx 0;
      padding-left: 24rpx;
      .leftb {
      }
      .top {
        font-weight: bold;
        font-size: 32rpx;
      }
      .bot {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  .other-btn {
    color: #000000;
    font-size: 28rpx;
    margin-top: 32rpx;
    text-align: center;
  }
}

.uni-scroll-view-content > uni-view > uni-view {
  justify-content: space-between !important;
}

:deep .fui-scroll__view {
  justify-content: space-between;
}
</style>
