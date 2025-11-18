<template>
  <layout
    :navTitle="session.session_name || '场次详情'"
    bgType="bg-guess-number"
    mode="white"
  >
    <template v-slot:navRight>
      <view
        class="flex items-center bg-black/20 px-[20rpx] py-[5rpx] rounded-[100rpx]"
        @click="goToMyBets"
      >
        <text class="text-base text-white">我的投注</text>
      </view>
    </template>

    <view class="detail-page min-h-screen">
      <!-- 顶部信息卡片 -->
      <view
        class="info-card mx-[32rpx] mt-[32rpx] mb-[24rpx] bg-white rounded-[48rpx] p-[32rpx]"
        style="box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08)"
      >
        <view class="flex justify-between items-center mb-[24rpx]">
          <view class="text-center">
            <text class="text-sm text-black/90 block mb-[8rpx]">参与金额</text>
            <text class="text-[40rpx] font-bold text-[#333] block">{{
              session.participation_amount_display
            }}</text>
          </view>
          <view class="text-center">
            <text class="text-sm text-black/90 block mb-[8rpx]">中奖倍率</text>
            <text class="text-[40rpx] font-bold text-[#FF6B4A] block">{{
              session.multiplier_display
            }}</text>
          </view>
          <view class="text-center">
            <text class="text-sm text-black/90 block mb-[8rpx]">剩余名额</text>
            <text class="text-[40rpx] font-bold text-[#FF6B4A] block">{{
              session.remaining_participants
            }}</text>
          </view>
        </view>

        <view
          class="progress-bar w-full h-[12rpx] bg-[#E6E6E6] rounded-full overflow-hidden mb-[16rpx]"
        >
          <view
            class="h-full bg-[#FF4610] rounded-full transition-all"
            :style="{ width: session.current_participants / session.total_participants * 100 + '%' }"
            style="box-shadow: 0 4rpx 8rpx rgba(255, 74, 74, 0.3)"
          ></view>
        </view>
        <view class="flex justify-between items-center">
          <text class="text-base text-black/90"
            >参与进度：
            <text class="text-[#FF6B4A] font-medium">{{
              session.current_participants
            }}</text
            >/{{ session.total_participants }}人</text
          >
          <text class="text-base text-black/90"
            >还差{{
              (100 - session.current_participants / session.total_participants * 100).toFixed(0)
            }}%可开奖</text
          >
        </view>
      </view>

      <!-- 投注区域 -->
      <view class="bet-area mx-[32rpx] mb-[24rpx]">
        <!-- 已完成投注状态 -->
        <view
          v-if="session.is_bet === 1"
          class="bg-[url('/static/images/guess_number/draw_bg.png')] bg-no-repeat bg-center bg-cover rounded-[48rpx] p-[48rpx] text-center"
        >
          <text class="text-[32rpx] font-bold text-[#333] block mb-[24rpx]"
            >你已完成下注</text
          >
          <view class="bg-[#fff] w-fit mx-auto text-[#FF4610] py-[10rpx] px-[40rpx] rounded-[100rpx] mb-[40rpx] text-center text-base font-medium"
            >参与人数达{{ session.total_participants }}人立即开奖！</view
          >

          <!-- 选中的数字显示 -->
          <view
            class="selected-number mx-auto mb-[32rpx] flex justify-center gap-[16rpx]"
          >
            <view
              class="w-[120rpx] h-[120rpx] rounded-full flex items-center justify-center"
              style="
                background: url('/static/images/guess_number/number_fill.png') no-repeat center center;
                background-size: 100% 100%;
              "
            >
              <text class="text-3xl text-white font-bold">{{
                session.selected_number
              }}</text>
            </view>
          </view>

          <!-- 中奖结果 -->
          <view v-if="session.lottery_status === 3">
            <view v-if="session.is_winner === 1" class="mt-[32rpx]">
              <text
                class="text-[32rpx] font-bold text-[#FF6B4A] block mb-[16rpx]"
                >恭喜中奖！</text
              >
              <text class="text-[24rpx] text-[#666] block"
                >中奖金额：{{ session.win_amount }}USDT</text
              >
            </view>
            <view v-else class="mt-[32rpx]">
              <text class="text-[28rpx] text-[#999] block">未中奖</text>
            </view>

            <!-- 开奖号码 -->
            <view
              v-if="
                session.winning_numbers && session.winning_numbers.length > 0
              "
              class="mt-[32rpx]"
            >
              <text class="text-[24rpx] text-[#999] block mb-[16rpx]"
                >开奖号码</text
              >
              <view class="flex justify-center gap-[12rpx]">
                <view
                  v-for="(num, idx) in session.winning_numbers"
                  :key="idx"
                  class="w-[80rpx] h-[80rpx] rounded-full flex items-center justify-center"
                  :class="
                    num == session.selected_number
                      ? 'bg-[#FF6B4A]'
                      : 'bg-[#F0F0F0]'
                  "
                >
                  <text
                    class="text-[36rpx] font-bold"
                    :class="
                      num == session.selected_number
                        ? 'text-white'
                        : 'text-[#999]'
                    "
                  >
                    {{ num }}
                  </text>
                </view>
              </view>
            </view>
          </view>
          <text v-else class="text-[28rpx] text-[#999] block">请等待开奖</text>
        </view>

        <!-- 选择数字状态 -->
        <view
          style="
            border-radius: 24px;
            border-top: 1px solid #fff;
            background: linear-gradient(180deg, #fcffe1 0%, #fff 23.86%);
          "
          v-else
          class="bet-card rounded-[24rpx] p-[32rpx]"
        >
          <view
            class="bg-[#FFF0EB] w-fit mx-auto text-[#FF4610] py-[10rpx] px-[40rpx] rounded-[100rpx] mb-[40rpx] text-center text-base font-medium"
          >
            参与人数达{{ session.total_participants }}人立即开奖！
          </view>

          <!-- 已选数字展示区域 -->
          <view
            class="selected-display flex justify-center items-center gap-[24rpx] mb-[40rpx]"
          >
            <view
              v-for="(item, index) in maxSelectCount"
              :key="index"
              class="select-slot"
            >
              <view
                v-if="selectedNumbers[index] !== undefined"
                class="relative w-[160rpx] h-[160rpx] rounded-full flex items-center justify-center"
              >
                <image
                  src="/static/images/guess_number/number_fill.png"
                  class="absolute top-0 left-0 w-full h-full"
                  mode="aspectFit"
                ></image>
                <text class="relative z-10 text-4xl text-white font-bold">{{
                  selectedNumbers[index]
                }}</text>
              </view>
              <view
                v-else
                class="w-[160rpx] h-[160rpx] rounded-full flex flex-col items-center justify-center"
              >
                <image
                  src="/static/images/guess_number/number_bg.png"
                  class="w-full h-full"
                  mode="aspectFit"
                ></image>
              </view>
            </view>
          </view>

          <text class="text-sm text-[#FF4610] block mb-[32rpx] text-center"
            >点击选择你的幸运数字</text
          >

          <!-- 数字选择网格 - 显示投注统计 -->
          <view class="grid grid-cols-5 gap-[20rpx] justify-items-center">
            <view
              v-for="stat in numberStats"
              :key="stat.number"
              class="relative w-[96rpx] h-[96rpx] rounded-[100rpx] transition-all duration-300"
              :style="
                isNumberSelected(stat.number)
                  ? 'border-radius: 90px; border: 1.096px solid #FFDFC5; background: linear-gradient(162deg, #FF0F2B 18.35%, #FF5A09 51.01%, #FF9334 87.76%);box-shadow: 0 2.74px 2.192px 0 rgba(255, 214, 161, 0.52) inset;'
                  : 'background: linear-gradient(162deg, #FFF 10.56%, #FDF0B7 53.24%, #FDF1B9 87.76%);border: 1px solid #FFE17B;'
              "
              @click="toggleNumber(stat.number)"
            >
              <view class="flex items-center justify-center h-full text-center">
                <text
                  class="text-2xl font-bold block"
                  :class="
                    isNumberSelected(stat.number) ? 'text-white' : 'text-[#333]'
                  "
                >
                  {{ stat.number }}
                </text>
              </view>
              <view
                v-if="isNumberSelected(stat.number)"
                class="absolute top-[0rpx] right-[0rpx] w-[28rpx] h-[28rpx] rounded-full bg-white flex items-center justify-center"
              >
                <image
                  src="/static/images/guess_number/number_selected.png"
                  class="w-full h-full"
                  mode="aspectFit"
                ></image>
              </view>
            </view>
          </view>

          <!-- 提交按钮 -->
          <view
            class="mx-auto w-[400rpx] h-[96rpx] rounded-[48rpx] flex items-center justify-center transition-all duration-300 mt-[48rpx]"
            :class="canSubmit ? '' : 'opacity-50'"
            style="
              border-radius: var(--radius-round, 360px);
              border: 3px solid #fffd6c;
              background: linear-gradient(90deg, #ff4b00 0%, #fe1e78 100%);
            "
            @click="handleSubmit"
          >
            <text class="text-[32rpx] text-white font-bold">提交数字</text>
          </view>
        </view>
      </view>

      <!-- 游戏介绍 -->
      <view
        v-if="intro"
        class="rules-section mx-[32rpx] mb-[40rpx] bg-[#FFF5E6] rounded-[48rpx] p-[32rpx]"
      >
        <text
          class="text-[24rpx] text-[#666] leading-[40rpx] whitespace-pre-wrap"
          >{{ intro }}</text
        >
      </view>
    </view>

    <!-- 支付密码输入框 -->
    <wk-code-input
      ref="payPasswordRef"
      :value="payPassword"
      title="请输入支付密码"
      @finish="handlePayPasswordFinish"
      @cancel="handlePayPasswordCancel"
    />

    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import { getRoundDetail, placeBet } from "@/api/guess_number";

const loading = ref(false);
const loadingText = ref("加载中...");

const roundId = ref("");
const session = ref({});
const numberStats = ref([]);
const intro = ref("");

const selectedNumbers = ref([]);
const payPasswordRef = ref(null);
const payPassword = ref("");

const maxSelectCount = computed(() => {
  return 1;
});

const canSubmit = computed(() => {
  return (
    selectedNumbers.value.length === 1 &&
    session.value.can_participate === 1
  );
});

const isNumberSelected = (num) => {
  return selectedNumbers.value.includes(num);
};

const toggleNumber = (num) => {
  if (session.value.can_participate !== 1) {
    uni.$showToast({
      title: "当前场次不可参与",
      icon: "none",
    });
    return;
  }

  const index = selectedNumbers.value.indexOf(num);

  if (index > -1) {
    selectedNumbers.value.splice(index, 1);
  } else {
    if (selectedNumbers.value.length >= 1) {
      selectedNumbers.value = [num];
    } else {
      selectedNumbers.value.push(num);
    }
  }
};

const handleSubmit = () => {
  if (!canSubmit.value) {
    if (session.value.can_participate !== 1) {
      uni.$showToast({
        title: "当前场次不可参与",
        icon: "none",
      });
      return;
    }
    uni.$showToast({
      title: "请选择1个数字",
      icon: "none",
    });
    return;
  }

  if (payPasswordRef.value) {
    payPassword.value = "";
    payPasswordRef.value.open();
  }
};

const handlePayPasswordFinish = async (password) => {
  if (!password || password.length < 6) {
    uni.$showToast({
      title: "请输入6位支付密码",
      icon: "none",
    });
    return;
  }

  payPassword.value = password;
  payPasswordRef.value.close();

  loading.value = true;
  loadingText.value = "投注中...";

  try {
    const res = await placeBet({
      id: roundId.value,
      selected_number: selectedNumbers.value[0],
      pwdPay: password,
    });

    if (res.status !== 0) {
      uni.$showToast({
        title: res.msg || "投注失败",
        icon: "none",
      });
      return;
    }

    uni.$showToast({
      title: "投注成功",
      icon: "success",
    });

    setTimeout(() => {
      selectedNumbers.value = [];
      loadDetail();
    }, 1500);
  } catch (error) {
    console.error("投注失败", error);
    uni.$showToast({
      title: error.msg || "投注失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};

const handlePayPasswordCancel = () => {
  payPassword.value = "";
};

const goToMyBets = () => {
  uni.navigateTo({
    url: routes.guessNumberRecords,
  });
};

const loadDetail = async () => {
  loading.value = true;
  loadingText.value = "加载中...";

  try {
    const res = await getRoundDetail({
      id: roundId.value,
    });

    if (res.status !== 0) {
      uni.$showToast({
        title: res.msg || "加载失败",
        icon: "none",
      });
      return;
    }

    if (res.data) {
      session.value = res.data.session || {};
      numberStats.value = res.data.number_stats || [];
      intro.value = res.data.intro || "";
    }
  } catch (error) {
    console.error("加载详情失败", error);
    uni.$showToast({
      title: "加载失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};

onLoad((options) => {
  if (options.id) {
    roundId.value = options.id;
    loadDetail();
  }
});

onShow(() => {
  if (roundId.value) {
    loadDetail();
  }
});
</script>