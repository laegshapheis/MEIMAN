<template>
  <layout 
    ref="layoutRef"
    navTitle="我的投注" 
    bgType="bg-guess-number" 
    mode="white"
    :refresher="true"
    @onRefresh="handleRefresh"
    @reachBottom="getPaginationList"
  >
    <view class="records-page min-h-screen">
      <!-- 统计卡片 -->
      <view class="mx-[32rpx] mt-[32rpx] mb-[24rpx] bg-white rounded-[48rpx] p-[32rpx]" style="box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);">
        <view class="text-center mb-[24rpx]">
          <text class="text-[24rpx] text-[#999] block mb-[16rpx]">累积中奖金额</text>
          <text class="text-3xl font-bold text-[#FF6B4A] block">{{ stats.total_win_amount }} {{ symbolStore.code }}</text>
        </view>
        
        <view class="flex justify-around items-center pt-[0rpx] border-t border-[#F0F0F0]">
          <view class="text-center">
            <text class="text-[#999] text-[24rpx] block mb-[8rpx]">累计参与场次</text>
            <text class="text-[#333] text-[48rpx] font-bold block">{{ stats.total_participation_count }}</text>
          </view>
          <view class="w-[1rpx] h-[80rpx] bg-black/20"></view>
          <view class="text-center">
            <text class="text-[#999] text-[24rpx] block mb-[8rpx]">累积中奖次数</text>
            <text class="text-[#FF6B4A] text-[48rpx] font-bold block">{{ stats.total_win_count }}</text>
          </view>
        </view>
      </view>

      <!-- 记录列表 -->
      <view class="mx-[32rpx] bg-white rounded-[24rpx] px-[32rpx] pt-[32rpx]">
        <view 
          v-for="record in records" 
          :key="record.id"
          class="pb-[24rpx] border-b border-[#F0F0F0]"
        >
          <!-- 标题和状态 -->
          <view class="flex items-center justify-between mb-[24rpx]">
            <view class="flex items-center">
              <text class="text-[28rpx] font-bold text-[#333]">{{ record.session_name }}</text>
              <view 
                class="ml-[16rpx] status-tag px-[16rpx] py-[6rpx] rounded-[4rpx] text-sm"
                :class="getStatusClass(record.is_winner)"
              >
                {{ record.result_text }}
              </view>
            </view>
             <view 
               v-if="record.is_winner != 0" 
               class="bg-[#FF3C28]/90 rounded-full px-[16rpx] py-[8rpx]"
               @click="viewDrawResult(record.id)"
             >
               <text class="text-sm text-white block">查看开奖号码</text>
             </view>
          </view>

          <!-- 投注信息行 -->
          <view class="flex items-center justify-between">
            <view class="flex flex-col items-start">
              <view class="p-[4rpx] number-circle w-[32rpx] h-[32rpx] rounded-full bg-[#FF0004] flex items-center justify-center">
                <text class="text-sm text-white font-bold">{{ record.selected_number }}</text>
              </view>
              <view class="mt-[8rpx]">
                <text class="text-base text-[#999] block">投注数字</text>
              </view>
            </view>

            <view class="text-center">
              <text class="text-base font-bold text-[#333] block">{{ record.bet_amount_display }}</text>
              <text class="text-base text-[#999] block mt-[4rpx]">投注金额</text>
            </view>

            <view class="text-left">
              <view v-if="record.is_winner === 1">
                <text class="text-base font-bold text-[#FF6B4A] block">{{ record.win_amount_display }}</text>
                <text class="text-base text-[#999] block mt-[4rpx]">中奖金额</text>
              </view>
              <view v-else>
                <text class="text-base font-bold text-[#FF6B4A] block">{{ record.multiplier }}x</text>
                <text class="text-base text-[#999] block mt-[4rpx]">中奖倍率</text>
              </view>
            </view>
          </view>

          <!-- 开奖号码 -->
          <view v-if="record.winning_numbers && record.winning_numbers.length > 0" class="flex items-center justify-between mt-[24rpx] pt-[24rpx] border-t border-[#F0F0F0]">
            <text class="text-[24rpx] text-[#999]">开奖号码</text>
            <view class="flex gap-[12rpx]">
              <view
                v-for="(num, idx) in record.winning_numbers"
                :key="idx"
                class="w-[48rpx] h-[48rpx] rounded-full flex items-center justify-center"
                :class="num == record.selected_number ? 'bg-[#FF6B4A]' : 'bg-[#F0F0F0]'"
              >
                <text 
                  class="text-[24rpx] font-bold"
                  :class="num == record.selected_number ? 'text-white' : 'text-[#999]'"
                >
                  {{ num }}
                </text>
              </view>
            </view>
          </view>
          <view v-if="record.id !== records[records.length - 1].id" class="h-[1px] bg-[#F0F0F0] mt-[32rpx]"></view>
        </view>

        <!-- 空状态 -->
        <view v-if="records.length === 0 && !loading" class="text-center py-[120rpx]">
          <text class="text-[28rpx] text-[#999]">暂无投注记录</text>
        </view>

        <!-- 加载状态 -->
        <!-- <view v-if="loading && page === 1" class="text-center py-[32rpx]">
          <text class="text-[24rpx] text-[#999]">加载中...</text>
        </view> -->

        <!-- 没有更多 -->
        <!-- <view v-if="loadFinish && records.length > 0" class="text-center py-[32rpx]">
          <text class="text-[24rpx] text-[#999]">没有更多了</text>
        </view> -->
      </view>
    </view>
  </layout>

  <!-- 开奖结果弹窗 -->
  <view v-if="showDrawModal" class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(0, 0, 0, 0.8);" @click="closeDrawModal">
    <view class="relative w-[600rpx] mt-[200rpx]" @click.stop>
      <!-- 装饰背景图 -->
      <image 
        src="/static/images/guess_number/draw_result_bg.png" 
        class="absolute top-[-300rpx] left-1/2 w-[600rpx] h-[444rpx]"
        style="transform: translateX(-50%);"
        mode="aspectFit"
      />
      
      <!-- 弹窗内容 -->
      <view class="relative bg-[url('/static/images/guess_number/draw_bg.png')] rounded-[32rpx] px-[48rpx] pt-[30rpx] pb-[48rpx]">
        <!-- 标题 -->
        <view class="text-center mb-[32rpx]">
          <text class="text-[40rpx] font-bold text-[#FF3C28]">开奖啦</text>
        </view>

        <!-- 本期开奖号码标题 -->
        <view class="text-center mb-[24rpx]">
          <text class="text-[28rpx] text-[#666]">本期开奖号码</text>
        </view>

        <!-- 开奖号码 -->
        <view v-if="betDetail" class="flex justify-center gap-[24rpx] mb-[32rpx]">
          <view
            v-for="(num, idx) in betDetail.winning_numbers"
            :key="idx"
            class="w-[80rpx] h-[80rpx] rounded-full flex items-center justify-center"
            style="background: url('/static/images/guess_number/number_fill.png') no-repeat center center; background-size: 100% 100%; box-shadow: 0 8rpx 16rpx rgba(255, 74, 74, 0.3);"
          >
            <text class="text-[40rpx] text-white font-bold">{{ num }}</text>
          </view>
        </view>

        <!-- 中奖人数 -->
        <view v-if="betDetail" class="text-center mb-[32rpx]">
          <text class="text-base text-[#999]">共 <text class="text-[#FF3C28] font-bold">{{ betDetail.current_participants }}</text> 人中奖</text>
        </view>

        <!-- 中奖结果 -->
        <view v-if="betDetail && betDetail.is_winner != 0" class="bg-white border border-[#000000]/5 border-solid text-center mb-[40rpx] py-[32rpx] rounded-[24rpx]" :style="betDetail.is_winner === 1 ? 'background: linear-gradient(135deg, #FFF5F5 0%, #FFE8E8 100%)' : 'background: #F5F5F5'">
          <view class="flex flex-col items-center">
            <image src="/static/images/guess_number/win.png" class="w-[60rpx] h-[60rpx]" mode="aspectFit"></image>
            <text class="text-[32rpx] font-bold text-[#FF3C28] mb-[16rpx] mt-[16rpx]">恭喜你！已中奖</text>
            <text class="text-[28rpx] text-[#FF3C28]">获得 {{ betDetail.win_amount_display }}</text>
          </view>
        </view>
        <view v-if="betDetail && betDetail.is_winner == 0" class="flex flex-row items-center justify-center gap-[16rpx] mb-[32rpx]">
          <image src="/static/images/guess_number/no_win.png" class="w-[60rpx] h-[60rpx]" mode="aspectFit"></image>
          <text class="text-[32rpx] font-bold text-[#666]">很遗憾，未中奖</text>
        </view>

        <!-- 继续投注按钮 -->
        <view 
          class="mx-auto absolute bottom-[-44rpx] left-0 right-0 w-[444rpx] h-[88rpx] rounded-full flex items-center justify-center"
          style="border-radius: var(--radius-round, 360px);
border: 3px solid #FFFD6C;
background: linear-gradient(90deg, #FF4B00 0%, #FE1E78 100%);"
          @click="continueBet"
        >
          <text class="text-[32rpx] text-white font-bold">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getGameStats, getMyBets, getBetDetail } from "@/api/guess_number";
import { useSymbolStore } from "@/stores/symbolStore";
import { routes } from "@/config/routes";

const symbolStore = useSymbolStore();

const layoutRef = ref(null);
const loading = ref(false);
const loadFinish = ref(false);
const pullType = ref("");

const page = ref(1);
const pageSize = ref(15);

const stats = ref({
  total_win_amount: '0.00',
  total_participation_count: 0,
  total_win_count: 0,
});

const records = ref([]);

// 弹窗相关
const showDrawModal = ref(false);
const betDetail = ref(null);
const detailLoading = ref(false);

onLoad(() => {
  init();
});

const init = async () => {
  await Promise.all([
    loadStats(),
    getRecords(),
  ]);
};

// 下拉刷新
const handleRefresh = async () => {
  pullType.value = "down";
  loadFinish.value = false;
  page.value = 1;
  await Promise.all([
    loadStats(),
    getRecords(),
  ]);
  layoutRef.value.complete();
};

// 上拉加载
const getPaginationList = () => {
  if (loadFinish.value) return;
  pullType.value = "up";
  page.value++;
  getRecords();
};

const loadStats = async () => {
  try {
    const res = await getGameStats();
    if (res.status !== 0) {
      uni.$showToast({
        title: res.msg || '加载失败',
        icon: "none",
      });
      return;
    }
    
    if (res.data) {
      stats.value = {
        total_win_amount: res.data.total_win_amount || '0.00',
        total_participation_count: res.data.total_participation_count || 0,
        total_win_count: res.data.total_win_count || 0,
      };
    }
  } catch (error) {
    console.error("加载统计数据失败", error);
  }
};

const getRecords = async () => {
  if (loading.value) return;

  loading.value = true;
  try {
    const res = await getMyBets({
      page: String(page.value),
      pagesize: String(pageSize.value),
    });
    console.log(res);
    if (res.status !== 0) {
      uni.$showToast({
        title: res.msg || '加载失败',
        icon: "none",
      });
      return;
    }
    
    if (res.data && res.data.list) {
      if (pullType.value === "down" || page.value === 1) {
        records.value = res.data.list;
      } else {
        records.value = [...records.value, ...res.data.list];
      }
      
      // 判断是否还有更多数据
      if (res.data.pagination) {
        const { page: currentPage, total_page } = res.data.pagination;
        loadFinish.value = parseInt(currentPage) >= parseInt(total_page);
      } else {
        loadFinish.value = res.data.list.length < pageSize.value;
      }
    } else {
      if (pullType.value === "down" || page.value === 1) {
        records.value = [];
      }
      loadFinish.value = true;
    }
  } catch (error) {
    console.error("加载记录失败", error);
    if (pullType.value === "down" || page.value === 1) {
      records.value = [];
    }
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (color) => {
  const classMap = {
    0: 'bg-[#EDFFF0] text-[#4AA10C]',
    1: 'bg-[#EFEFEF] text-black/50',
    2: 'bg-[#FFF1EA] text-[##FF4610]',
  };
  return classMap[color] || 'bg-[#F5F5F5] text-[#999]';
};

// 查看开奖详情
const viewDrawResult = async (betId) => {
  detailLoading.value = true;
  try {
    const res = await getBetDetail({
      bet_id: String(betId)
    });

    if (res.status !== 0) {
      uni.$showToast({
        title: res.msg || '加载失败',
        icon: "none",
      });
      return;
    }

    if (res.data) {
      betDetail.value = res.data;
      showDrawModal.value = true;
    }
  } catch (error) {
    console.error("加载详情失败", error);
    uni.$showToast({
      title: "加载失败",
      icon: "none",
    });
  } finally {
    detailLoading.value = false;
  }
};

// 关闭弹窗
const closeDrawModal = () => {
  showDrawModal.value = false;
  betDetail.value = null;
};

const continueBet = () => {
  closeDrawModal();
};
</script>

<style lang="scss" scoped></style>
