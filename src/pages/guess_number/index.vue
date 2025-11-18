<template>
  <layout
    ref="layoutRef"
    navTitle=""
    bgType="bg-guess-number"
    mode="white"
    :refresher="true"
    @onRefresh="handleRefresh"
    @reachBottom="getPaginationList"
  >
    <template v-slot:navRight>
      <view
        class="flex items-center bg-black/20 px-[20rpx] py-[5rpx] rounded-[100rpx]"
        @click="goToBetRecords"
      >
        <text class="text-base text-white">我的投注</text>
      </view>
    </template>
    <view class="flex flex-col min-h-[calc(100vh-88rpx)] overflow-hidden">
      <!-- 顶部装饰背景 -->
      <view class="relative h-[400rpx] overflow-hidden mt-[-88rpx]">
        <view class="absolute left-0 top-0 w-full h-full">
          <image
            src="/static/images/guess_number/title_bg.png"
            class="absolute left-0 top-0 w-full h-full"
            mode="aspectFit"
          />
        </view>
        <!-- 我的投注卡片 -->
        <view class="absolute bottom-[50rpx] left-0 right-0 mx-[32rpx]">
          <view
            class="bg-white rounded-[100rpx] px-[32rpx] py-[16rpx] flex justify-between items-center"
            style="box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08)"
            @click="goToBetRecords"
          >
            <text class="text-base font-medium text-black">
              我的投注：<text class="text-[#FF6B4A] font-bold"
                >{{ userBetsCount }}场进行中</text
              >
            </text>
            <view class="flex items-center">
              <text class="text-base text-black/90 mr-[8rpx]">查看详情</text>
              <text class="text-black/90 text-lg">›</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 内容区域 -->
      <view
        style="
          border-radius: 20px 20px 0 0;
          border-top: 1px solid #fff;
          background: linear-gradient(
              170deg,
              rgba(255, 254, 181, 0.46) 1.13%,
              rgba(255, 242, 226, 0.46) 7.89%
            ),
            linear-gradient(
              170deg,
              rgba(253, 255, 143, 0.61) 7.1%,
              rgba(255, 255, 255, 0) 29.65%
            ),
            #ffe4c5;
        "
        class="flex flex-col flex-1 content-section relative rounded-t-[40rpx] px-[32rpx] pt-[40rpx]"
      >
        <!-- 标签页 -->
        <view class="tabs-container flex justify-center">
          <view
            class="tabs-wrapper bg-white rounded-[48rpx] p-[8rpx] inline-flex"
            style="box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06)"
          >
            <view
              v-for="(tab, index) in tabs"
              :key="index"
              class="tab-item px-[40rpx] py-[8rpx] rounded-[40rpx] transition-all"
              :class="
                currentTab === tab.value
                  ? 'bg-[#FF4A03] text-white'
                  : 'text-[#666]'
              "
              @click="switchTab(tab.value)"
            >
              <text class="text-base font-medium">{{ tab.label }}</text>
            </view>
          </view>
        </view>

        <!-- 游戏场次列表 -->
        <view class="rounds-list-container mt-[30rpx]">
          <!-- 进行中的场次 -->
          <view
            v-for="round in activeRounds"
            :key="round.id"
            class="round-card bg-white rounded-[24rpx] p-[32rpx] mb-[24rpx]"
            style="box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06)"
          >
            <!-- 期号和状态 -->
            <view class="flex items-center mb-[24rpx]">
              <text class="text-[32rpx] font-bold text-[#333]">{{
                round.session_name
              }}</text>
              <view
                class="ml-[16rpx] status-badge flex items-center bg-[#FFF1EA] rounded-[8rpx] px-[8rpx] py-[4rpx]"
              >
                <text class="text-base font-bold mr-[8rpx] text-[#FF6B4A]">
                  {{ round.multiplier_display }}
                </text>
              </view>
              <view
                class="ml-[16rpx] text-base text-black/90 bg-[#FFF1EA] rounded-[8rpx] px-[8rpx] py-[4rpx]"
              >
                <text class="text-sm font-medium mr-[8rpx] text-[#FF6B4A]">
                  {{ lotteryStatusNames[round.lottery_status] }}
                </text>
              </view>
            </view>

            <!-- 进度条 -->
            <view
              class="progress-bar w-full h-[12rpx] bg-[#E6E6E6] rounded-full overflow-hidden mb-[16rpx]"
            >
              <view
                class="h-full bg-[#FF4610] rounded-full transition-all"
                :style="{
                  width:
                    (round.current_participants / round.total_participants) *
                      100 +
                    '%',
                }"
              ></view>
            </view>

            <!-- 金额信息 -->
            <view class="flex justify-between items-center mb-[24rpx]">
              <text class="text-base text-[#999]"
                >剩余名额
                <text class="text-[#FF4610] font-medium"
                  >{{ round.remaining_participants }}人</text
                ></text
              >
              <text class="text-[24rpx] text-[#FF6B4A] font-medium"
                >{{ round.current_participants }}/{{
                  round.total_participants
                }}</text
              >
            </view>
            <view class="h-[1px] bg-[#FCCDD0] my-[16rpx]"></view>
            <!-- 底部金额和按钮 -->
            <view class="flex justify-between items-center">
              <text class="text-[28rpx] text-[#333] font-medium">{{
                round.participation_amount_display
              }}</text>
              <view
                class="bg-[#FF4A03] px-[34rpx] py-[8rpx] rounded-[48rpx]"
                @click="enterRound(round)"
              >
                <text class="text-base text-white">进入场次</text>
              </view>
            </view>
          </view>

          <view
            v-if="finishedRounds.length > 0"
            class="history-section mt-[16rpx] pb-[32rpx]"
          >
            <view
              v-for="round in finishedRounds"
              :key="'history-' + round.id"
              class="history-item bg-white rounded-[24rpx] p-[32rpx] mb-[24rpx]"
            >
              <view class="flex items-center mb-[16rpx]">
                <text class="text-[28rpx] text-[#333]">{{
                  round.session_name
                }}</text>
                <view
                  class="ml-[16rpx] text-base text-black/90 bg-[#FAF8F6] rounded-[8rpx] px-[8rpx] py-[8rpx]"
                >
                  <text class="text-sm text-[#666]">
                    {{ lotteryStatusNames[round.lottery_status] }}
                  </text>
                </view>
              </view>
              <view class="h-[1px] bg-[#FCCDD0] my-[16rpx]"></view>
              <view class="flex justify-between items-center">
                <text class="text-[28rpx] text-[#FF6B4A] font-medium"
                  >开奖号码</text
                >
                <view
                  v-if="
                    round.winning_numbers && round.winning_numbers.length > 0
                  "
                  class="flex gap-[16rpx]"
                >
                  <view
                    v-for="(num, idx) in round.winning_numbers"
                    :key="idx"
                    class="number-ball w-[48rpx] h-[48rpx] rounded-full bg-gradient-to-b from-[#FF6B4A] to-[#FF4A4A] flex items-center justify-center"
                    style="box-shadow: 0 4rpx 8rpx rgba(255, 74, 74, 0.3)"
                  >
                    <text class="text-base text-white font-bold">{{
                      num
                    }}</text>
                  </view>
                </view>
                <text v-else class="text-[24rpx] text-[#999]"
                  >暂无开奖结果</text
                >
              </view>
            </view>
          </view>
        </view>

        <!-- 加载状态 -->
        <!-- <view v-if="loading && currentPage === 1" class="text-center py-[32rpx]">
          <text class="text-[24rpx] text-[#999]">加载中...</text>
        </view> -->

        <!-- 没有更多 -->
        <!-- <view v-if="loadFinish && rounds.length > 0" class="text-center py-[32rpx]">
          <text class="text-[24rpx] text-[#999]">没有更多了</text>
        </view> -->
      </view>
    </view>
  </layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import { getGameRounds, getGameStats } from "@/api/guess_number";

const layoutRef = ref(null);
const loading = ref(false);

const tabs = ref([
  { label: "单数场", value: "1" },
  { label: "双数场", value: "2" },
  { label: "三数场", value: "3" },
]);

const lotteryStatusNames = {
  1: "未开始",
  2: "进行中",
  3: "已结束",
};

const currentTab = ref("1");
const userBetsCount = ref(0);
const rounds = ref([]);

const currentPage = ref(1);
const pageSize = ref(10);
const loadFinish = ref(false);
const pullType = ref("");

// 初始化数据
const init = async () => {
  currentPage.value = 1;
  loadFinish.value = false;
  rounds.value = [];

  try {
    await Promise.all([loadGameStats(), loadGameRounds()]);
  } catch (error) {
    console.error("初始化失败", error);
  }
};

// 下拉刷新
const handleRefresh = async () => {
  pullType.value = "down";
  loadFinish.value = false;
  currentPage.value = 1;
  await Promise.all([loadGameStats(), loadGameRounds()]);
  if (layoutRef.value) {
    layoutRef.value.complete();
  }
};

// 加载统计数据
const loadGameStats = async () => {
  try {
    const res = await getGameStats();
    if (res.status !== 0) {
      uni.$showToast({
        title: res.message,
        icon: "none",
      });
      return;
    }
    if (res.status === 0 && res.data) {
      userBetsCount.value = res.data.in_progress_count || 0;
    }
  } catch (error) {
    console.error("加载统计数据失败", error);
  }
};

// 加载游戏场次
const loadGameRounds = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    const res = await getGameRounds({
      page: String(currentPage.value),
      pagesize: String(pageSize.value),
      lottery_type: currentTab.value,
    });

    if (res.status !== 0) {
      uni.$showToast({
        title: res.message || "加载失败",
        icon: "none",
      });
      loading.value = false;
      return;
    }

    console.log(res);

    // 处理下拉刷新或第一页时清空列表
    if (pullType.value === "down" || currentPage.value === 1) {
      rounds.value = [];
    }

    const list = res.data?.list || [];

    // 追加数据
    if (list.length > 0) {
      rounds.value = [...rounds.value, ...list];
    }

    // 判断是否加载完成
    if (res.data?.pagination) {
      const { page: currentPageNum, total_page } = res.data.pagination;
      loadFinish.value = parseInt(currentPageNum) >= parseInt(total_page);
    } else {
      loadFinish.value = list.length < pageSize.value;
    }
  } catch (error) {
    console.error("加载游戏场次失败", error);
    if (pullType.value === "down" || currentPage.value === 1) {
      rounds.value = [];
    }
  } finally {
    loading.value = false;
    // 通知 layout 组件加载完成
    if (layoutRef.value) {
      layoutRef.value.complete();
    }
  }
};

// 进行中的场次
const activeRounds = computed(() => {
  return rounds.value.filter(
    (round) => round.lottery_status === 1 || round.lottery_status === 2
  );
});

// 已结束的场次
const finishedRounds = computed(() => {
  return rounds.value.filter((round) => round.lottery_status === 3);
});

// 切换标签
const switchTab = (value) => {
  currentTab.value = value;
  pullType.value = "down";
  loadFinish.value = false;
  currentPage.value = 1;
  rounds.value = [];
  loadGameRounds();
};

// 上拉加载
const getPaginationList = () => {
  if (loadFinish.value) return;
  pullType.value = "up";
  currentPage.value++;
  loadGameRounds();
};

// 进入场次
const enterRound = (round) => {
  if (round.can_participate !== 1) {
    uni.$showToast({
      title: "当前场次不可参与",
      icon: "none",
    });
    return;
  }

  uni.navigateTo({
    url: `${routes.guessNumberDetail}?id=${round.id}&type=${currentTab.value}`,
  });
};

// 查看投注记录
const goToBetRecords = () => {
  uni.navigateTo({
    url: routes.guessNumberRecords,
  });
};

onShow(() => {
  init();
});
</script>

<style lang="scss" scoped></style>
