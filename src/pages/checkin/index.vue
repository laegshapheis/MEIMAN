<template>
  <layout navTitle="每日签到" bgType="bg-main4" ref="layoutRef" :refresher="true" :isLottie="false" mode="white"
    @onRefresh="handleRefresh">
    <template v-slot:navRight>
      <view @click="goCheckInRecord"
        class="flex flex-row items-center justify-center bg-[#FFFFFF1A] text-white w-[64rpx] h-[64rpx] rounded-full">
        <image src="/static/images/index/check_icon.png" mode="widthFix" class="w-[42rpx] h-[42rpx]" />
        <!-- <text class="text-base">签到记录</text> -->
      </view>
    </template>
    <!-- 内容区域 => 开始 -->
    <view class="px-page-x pt-page-y pb-[32rpx] relative">
      <!-- <image
        class="w-full h-[150rpx] mb-[60rpx]"
        src="/static/images/index/checkin_title.png"
        mode="widthFix"
      ></image> -->
      <view class="checkin-bg "></view>
      <view class="qd-bg relative z-20">
        <view
          class="flex flex-col items-center rounded-[48rpx] pt-[16rpx] pb-[32rpx] w-[320rpx] h-[320rpx] mx-auto box-border"
          style="
            background-image:url(/static/images/checkin/calendar.png);background-size: 100% 100%; background-repeat: no-repeat; background-position: center;
          ">
          <text class="text-[#020202] text-sm font-medium mt-[122rpx]">已经签到</text>
          <view class="flex flex-row items-end justify-center mt-[8rpx]">
            <text class="text-[#1A4CFF] text-[length:96rpx] leading-[96rpx] font-bold mr-[16rpx]">{{ data.yiqiandao
              }}</text>
            <text class="text-[#1A4CFF] text-base mb-[8rpx] font-medium">天</text>
          </view>

        </view>
        <view class="mt-[32rpx] w-full">
          <view class="w-[260rpx] mx-[auto]">
            <wk-button type="gradient-pure" height="80rpx" @submit="() => signToday()"
              v-if="!isSigned(data.selDay)">立即签到</wk-button>

            <wk-button type="gradient-pure" v-else @submit="() => { }">已签到</wk-button>
          </view>

        </view>
      </view>
      <view class="px-[16rpx] py-[32rpx] rounded-[24rpx] bg-white/10 mt-[52rpx]">
        <view class="text-white text-xl font-semibold  text-center py-[16rpx]">{{ data.date }}</view>
        <view class="text-white/50 text-base mb-[16rpx] text-center">未签到日期可点击对应日历补签</view>
        <view class="relative z-20 qd-tab-box mt-[16rpx]">
          <view class="qd-item-box">
            <view v-for="day in data.days" :key="day" :class="[
              'flex flex-col items-center justify-center p-[8rpx] text-lg py-[0rpx] box-border',
            ]" :style="{ ...getDayStyle(day), height: '104rpx' }" @click="handleDay(day)">
              <!-- <image
              v-if="isSigned(day)"
              class="w-[56rpx] h-[56rpx] mb-[10rpx]"
              src="/static/images/index/qd-xing-xing.svg"
              mode="widthFix"
            ></image>
            <image
              v-else
              class="w-[56rpx] h-[56rpx] mb-[10rpx]"
              src="/static/images/index/star_gray.svg"
              mode="widthFix"
            ></image> -->
              <view :class="[
                'font-bold',
                canResign(day) ? 'text-[#B676FF]' : 'text-white'
              ]">{{ day }}</view>
              <image src="/static/images/index/check.svg" mode="widthFix" class="w-[32rpx] h-[32rpx] mt-[4rpx]"
                v-if="isSigned(day)">
              </image>
              <!-- <image
              src="/static/images/index/buqian.svg"
              mode="widthFix"
              class="w-[48rpx] h-[48rpx]"
              v-if="
                data.finish &&
                day >= data.resign_from_day &&
                day < data.selDay &&
                !isSigned(day) &&
                data.member_resign_switch == 1
              "
            >
              </image> -->
              <text class="text-sm font-bold text-[#B676FF] mt-[0rpx]" v-if="
                data.finish &&
                day >= data.resign_from_day &&
                day < data.selDay &&
                !isSigned(day) &&
                data.member_resign_switch == 1
              ">补签</text>
            </view>
          </view>

        </view>
      </view>
      <view class="mt-[32rpx] bg-[rgba(255,255,255,0.05)] rounded-[32rpx] p-[32rpx]"
        v-if="data.lxqiandao == 0 && data.dayarr.length !== 0">
        <template v-if="data.member_resign_switch == 1">
          <view class="flex flex-row " @click="alertTips"><text
              class="mr-[8rpx] font-medium text-white text-lg">补签规则</text>
            <uv-icon size="32rpx" color="rgba(84, 147, 255, 1)" name="question-circle"></uv-icon>
          </view>
          <!-- <view class="w-full h-[1rpx] bg-[transparent] mt-[16rpx]"></view> -->
          <view class="text-white text-base mt-[32rpx]">
            当前账号累计可以补签{{ data.resign_times }}次(每月最多补签{{
              data.max_resign_times
            }}次)
          </view>
        </template>
      </view>

      <view class="mt-[32rpx] rounded-[32rpx] p-[32rpx] bg-[rgba(255,255,255,0.05)]"
        v-if="data.lxqiandao == 0 && data.dayarr.length !== 0">
        <template v-if="data.member_resign_switch == 1">
          <view class="flex flex-row" @click="alertTips"><text
              class="mr-[8rpx] font-medium text-white text-lg">连续签到奖励</text>
          </view>
          <view class="w-full h-[1rpx] bg-[transparent] mt-[16rpx]"></view>
        </template>

        <scroll-view :scroll-y="true">
          <view class="grid grid-cols-1 gap-[16rpx]">
            <view v-for="(item, index) in data.dayarr" :key="index"
              class="flex flex-row items-start py-[16rpx] px-[24rpx] font-semibold bg-[rgba(255,255,255,0.10)] rounded-[24rpx]">
              <view class="flex flex-row items-center">
                <image src="/static/images/user/qiandao_rewards.svg" mode="widthFix"
                  class="w-[64rpx] h-[64rpx] mr-[16rpx]" />
              </view>
              <view class="w-full">
                <view class="text-[#B676FF] text-base font-medium relative mt-[4rpx]">
                  <text class="text-base">连续签到</text>
                  <view class="absolute top-[-4rpx] right-0">
                    <text class="text-lg">x</text>
                    <text class="text-2xl font-bold ml-[4rpx]">{{ item.days }}</text>
                  </view>
                </view>
                <view class="text-sm flex" v-if="item.sort == 1">
                  <text class="text-white/50 mr-[8rpx]">投资奖励:</text>
                  <text class="text-white">{{ item.reward }} {{ symbolStore.code }} </text>
                </view>
                <view class="text-sm flex" v-if="item.sort == 2">
                  <text class="text-white/50 mr-[8rpx]">股权:</text>
                  <text class="text-white">{{ item.reward }}</text>
                </view>
                <view class="text-sm flex" v-if="item.sort == 3">
                  <text class="text-white/50 mr-[8rpx]">提现奖励:</text>
                  <text class="text-white">{{ item.reward }} {{ symbolStore.code }}</text>
                </view>
                <view class="text-sm flex" v-if="item.sort == 4">
                  <text class="text-white/50 mr-[8rpx]">积分:</text>
                  <text class="text-white">{{ item.reward }}</text>
                </view>
                <view class="text-sm flex" v-if="item.sort == 5">
                  <text class="text-white">{{ item.reward }}</text>
                </view>
                <view class="text-sm flex" v-if="item.sort == 6">
                  <text class="text-white">{{ item.reward }}</text>
                </view>
                <view class="text-sm font-bold ml-[8rpx] text-neutral-theme">
                  <!-- {{ item.sort == 2 ? " 股权" : " " + symbolStore.code }} -->

                  <template v-if="item.additional == 1">
                    <text v-if="item.additional_sort == 5"> + {{ item.additional_sort_name }}</text>
                    <text v-else-if="item.additional_sort == 6"> + {{ item.additional_sort_name }}</text>
                    <text v-else> + {{ item.additional_reward }} {{ item.additional_sort_name }}</text>
                  </template>
                </view>
              </view>
              <!-- <image
                class="w-[40rpx] h-[40rpx] mx-[8rpx]"
                src="/static/images/index/qd-xing-xing.png"
                mode="widthFix"
              ></image> -->
            </view>
          </view>
        </scroll-view>
      </view>

    </view>
    <!-- 签到成功弹窗 -->
    <uv-overlay :show="showModal" class="px-[60rpx] box-border flex flex-col items-center justify-center">
      <view class="flex flex-col relative pt-[222rpx] px-[20rpx] w-[630rpx] h-[710rpx] box-border "
        style="background-image: url(/static/images/checkin/checkin_modal_bg.png);background-size: 100% 100%; background-repeat: no-repeat; background-position: center;">
        <!-- <view class="left-0 w-full flex flex-row justify-center">
          <image class="w-[160rpx] h-[160rpx] absolute top-[-100rpx]" src="/static/images/index/checkin_coin.png"
            mode="widthFix"></image>
        </view> -->
        <view class="flex flex-col items-center justify-center p-[32rpx]">
          <view class="flex flex-col items-center justify-center">
            <text class="text-2xl bg-gradient-checkin bg-clip-text text-transparent font-bold" >签到成功</text>
          </view>
          <view class="flex">
            <text class="text-5xl text-white mt-[10rpx]">{{data.qian_dao_msg}}</text>
          </view>
          <view class="w-[282rpx] h-88rpx mt-[20rpx]">
            <wk-button type="small" height="88rpx" @submit="showModal = false">我知道了 </wk-button>
          </view>
          
        </view>

      </view>
    </uv-overlay>

    <!-- 规则弹出层 -->
    <wk-modal ref="wkPopupRef" title="说明" :showClose="false" borderRadius="32rpx">
      <uv-parse :show-img-menu="false" :content="strings"
        container-style="white-space: pre-wrap;color: #fff;border:none;padding:0;"></uv-parse>
      <view class="flex flex-row justify-center pt-[32rpx] px-[32rpx]">
        <wk-button class="w-full" color="#FFFFFF" @submit="wkPopupRef.close()">
          确认
        </wk-button>
      </view>
    </wk-modal>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { routes } from "@/config/routes";

import { onLoad } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { cacheManager } from "@/utils/cacheManager";

import {
  getCheckInList as getCheckInListApi,
  checkIn as checkInApi,
} from "@/api/index";

const wkPopupRef = ref(null);
const strings = ref("");
const showModal = ref(false);
const loading = ref(false);
const loadingText = ref("加载中...");
const symbolStore = useSymbolStore();

// 数据集
const data = reactive({
  date: "",
  days: [], // 存放当月的天数
  signedDays: [], // 已签到的日期
  selDay: new Date().getDate(), //今天
  qian_dao_msg: "", //签到成功信息
  dayarr: [],
  yiqiandao: 0,
  lxqiandao: 0,
  resign_times: 0,
  resign_from_day: 0,
  finish: false,
  resign_rule: "",
  max_resign_times: 0,
  member_resign_switch: 0,
});

const layoutRef = ref(null);
const handleRefresh = async () => {
  await getList();
  await initCalendar();
  layoutRef.value.complete();
};

onLoad(() => {
  const cacheData = cacheManager.getCache("checkInList");
  if (cacheData) {
    handleCache(cacheData);
  }
  getList();
  initCalendar();
});

const initCalendar = () => {
  const date = new Date();
  data.date = date.getFullYear() + "年" + (date.getMonth() + 1) + "月";
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  data.days = Array.from(
    {
      length: daysInMonth,
    },
    (_, i) => i + 1
  );

  getList();
};

const handleCache = (result) => {
  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });

    return;
  }

  const arr = result.msg.map((item) => parseInt(item, 10));
  data.signedDays = arr;
  data.resign_from_day = result.resign_from_day;
  data.dayarr = result.rewards;
  data.lxqiandao = result.lxqiandao;
  data.yiqiandao = result.days;
  data.resign_times = result.resign_times;
  data.finish = true;
  data.resign_rule = result.resign_rule;
  data.max_resign_times = result.max_resign_times;
  data.member_resign_switch = result.member_resign_switch;
  console.log(result);
  loading.value = false;
};
const getList = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }
  const result = await getCheckInListApi({});
  cacheManager.setCache("checkInList", result);
  handleCache(result);
};

const goCheckInRecord = () => {
  uni.navigateTo({ url: routes.checkInRecord });
};

const isSigned = (day) => {
  return data.signedDays.includes(day);
};

const canResign = (day) => {
  return (
    data.finish &&
    day >= data.resign_from_day &&
    day < data.selDay &&
    !isSigned(day) &&
    data.member_resign_switch == 1
  );
};

const getDayStyle = (day) => {
  if (isSigned(day)) {
    // 已签到样式
    return {
      borderRadius: 'var(--radius-card-m, 12px)',
      // border: '1px solid var(--color-text-default-disabled, rgba(37, 44, 47, 0.30))',
      background: 'linear-gradient(180deg, #214CBD 4.03%, #1C0D89 51.09%, #6E23A6 100%)',
      boxShadow: '0 4px 4px 0 rgba(255, 255, 255, 0.25) inset',
    };
  } else if (
    data.finish &&
    day >= data.resign_from_day &&
    day < data.selDay &&
    !isSigned(day) &&
    data.member_resign_switch == 1
  ) {
    // 补签样式
    return {
      borderRadius: 'var(--radius-card-m, 12px)',
      border: '1px dashed #B676FF',
      background: '#1F197D',
    };
  } else {
    // 未签到样式
    return {
      borderRadius: 'var(--radius-card-m, 12px)',
      background: 'rgba(0, 0, 0, 0.20)',
    };
  }
};

const signToday = async (sign_at) => {
  console.log(sign_at);
  const params = {};
  if (sign_at) {
    params.sign_at = sign_at;
  }

  loading.value = true;
  loadingText.value = "签到中...";

  try {
    const result = await checkInApi(params);
    console.log(result);
    loading.value = false;

    if (result.status && result.status != 0) {
      uni.$showToast({
        title: result.msg,
        duration: 3000,
        icon: "none",
      });

      return;
    }

    // 签到成功
    data.qian_dao_msg = result.msg;
    showModal.value = true;

    getList();
  } catch (e) {
    console.error("请求失败", error);
    loading.value = false;
  }
};

const handleDay = (day) => {
  console.log(day);
  if (day >= data.resign_from_day && day < data.selDay && !isSigned(day)) {
    signToday(day);
  }
};

const alertTips = () => {
  strings.value = data.resign_rule;
  wkPopupRef.value.open();
};
</script>

<style lang="scss">
.checkin-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 750rpx;
  height: 454rpx;
  background-image: url(/static/images/checkin/bg.png);
  background-size: 100% 100%;
  // background-position: center;
  background-repeat: no-repeat;
}

.qd-bg {
  // background-image: url(/static/images/index/qd_bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
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
    color: #0748a6;
    font-size: 24rpx;
  }
}

.slef_40 {
  box-sizing: border-box;
  padding: 40rpx 40rpx 40rpx;
}

.head-qd {
  width: 100%;
  height: 112rpx;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;

  // background-image: url(/static/images/index/checkin_top.png);
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 36rpx;
    line-height: 1;
    position: absolute;
    bottom: 32rpx;
    left: 24rpx;

    .value {
      color: #2699dc;
      margin: 0 16rpx;
      font-weight: bold;
    }

    .span {
      color: #fff;
    }
  }
}

.qd-tab-box {
  width: 100%;
  border-bottom-left-radius: 32rpx;
  border-bottom-right-radius: 32rpx;

  .qd-item-box {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 10rpx;

    .item-day {
      line-height: 1;
      padding: 16rpx 0;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 32rpx;

      .xing-xing {
        width: 40rpx;
        height: 40rpx;
        margin-bottom: 16rpx;
      }

      .da-gou {
        width: 40rpx;
        height: 40rpx;
      }

      .num {
        color: #252c2f;
      }

      .str {
        color: #252c2f;
      }
    }

    .yq {
      background-color: #87e7b6;
    }
  }

  .qd-btn-x {
    width: 620rpx;
    height: 104rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    margin: auto;
    font-size: 36rpx;
    margin-top: 32rpx;
    background-size: 100% 100%;
  }

  .qd-rule-title {
    font-size: 32rpx;
    margin-top: 32rpx;
    padding-left: 25rpx;
  }

  .qd-rule-content {
    font-size: 28rpx;
    color: #fff;
    padding: 24rpx;
  }
}

.lx-bo {
  border-radius: 32rpx;
  margin-top: 64rpx;
  padding: 32rpx 32rpx 48rpx;

  .qd-btn-x {
    font-size: 32rpx;
    margin-bottom: 24rpx;
  }

  .qd-scroll-lx {
    white-space: nowrap;

    .itemx {
      margin-right: 32rpx;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-size: 26rpx;
      line-height: 1;

      .xing-xing {
        width: 48rpx;
        height: 48rpx;
        margin-bottom: 12rpx;
      }

      .star1 {
        color: #fff;
        margin-top: 24rpx;
        line-height: 36rpx;
      }

      .star2 {
        margin-top: 12rpx;
        color: #fff;
        line-height: 36rpx;
      }
    }
  }
}

.modal {
  position: relative;
  position: absolute;
  left: 50%;
  top: 50%;
  min-height: 500rpx;
  transform: translate(-50%, -50%);
}
</style>
