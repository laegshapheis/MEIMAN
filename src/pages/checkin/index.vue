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
      <view
        class="mx-[32rpx] z-10 absolute top-[60rpx] left-[66rpx] checkin-bg flex flex-row items-center justify-center">
      </view>
      <view class="qd-bg pt-[48rpx] relative z-20">
        <view class="flex flex-col items-center rounded-[48rpx] p-[32rpx] w-[436rpx] h-[456rpx] mx-auto box-border" style="
            background-image:url(/static/images/checkin/calendar.png);background-size: 100% 100%; background-repeat: no-repeat; background-position: center;
          ">
          <text class="text-black text-base font-medium">已经签到</text>
          <view class="flex flex-row items-end justify-center mt-[8rpx]">
            <text class="text-black text-[length:96rpx] font-bold mr-[16rpx]">{{
              data.yiqiandao
              }}</text>
            <text class="text-black text-base mb-[16rpx]">天</text>
          </view>
          <view class="mt-[16rpx] w-full">
            <wk-button class="" backgroundColor="transparent"
              style="background: linear-gradient(93deg, #AE91FC 2.34%, #636EFF 58.39%, #2BBFF1 112.31%);border-radius: 48rpx;"
              color="#FFFFFF" @submit="() => signToday()" v-if="!isSigned(data.selDay)">立即签到</wk-button>

            <wk-button v-else style="background: rgba(0, 0, 0, 0.20);border-radius: 48rpx;"
              backgroundColor="transparent" color="rgba(255, 255, 255, 0.60)" @submit="() => { }">已签到</wk-button>
          </view>
        </view>
      </view>
      <view class="text-black text-xl font-semibold mt-[52rpx] text-center">{{
        data.date
        }}</view>
      <view class="text-[#868B90] text-base mt-[16rpx] text-center">未签到日期可点击对应日历补签</view>
      <view class="relative z-20 qd-tab-box mt-[16rpx]">
        <view class="qd-item-box">
          <view v-for="day in data.days" :key="day" :class="[
            'flex flex-col items-center justify-center p-[8rpx] text-lg py-[0rpx]',
          ]" :style="{ ...getDayStyle(day), height: '112rpx' }" @click="handleDay(day)">
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
            <view :class="['text-black font-bold']">{{ day }}</view>
            <image src="/static/images/index/check.svg" mode="widthFix" class="w-[24rpx] h-[24rpx] mt-[4rpx]"
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
            <text class="text-sm font-bold text-[#E53935]" v-if="
              data.finish &&
              day >= data.resign_from_day &&
              day < data.selDay &&
              !isSigned(day) &&
              data.member_resign_switch == 1
            ">补签</text>
          </view>
        </view>

      </view>

      <view class="mt-[32rpx] bg-white rounded-[24rpx] p-[24rpx]"
        v-if="data.lxqiandao == 0 && data.dayarr.length !== 0">
        <template v-if="data.member_resign_switch == 1">
          <view class="flex flex-row" @click="alertTips"><text
              class="mr-[8rpx] font-medium text-black text-lg">补签规则</text>
            <uv-icon size="32rpx" color="#6E7B89" name="question-circle"></uv-icon>
          </view>
          <view class="w-full h-[1rpx] bg-[transparent] mt-[16rpx]"></view>
          <view class="text-[#6E7B89] text-base mt-[16rpx]">
            当前账号累计可以补签{{ data.resign_times }}次(每月最多补签{{
              data.max_resign_times
            }}次)
          </view>
        </template>
      </view>

      <view class="mt-[32rpx] rounded-[24rpx] py-[24rpx] bg-white"
        v-if="data.lxqiandao == 0 && data.dayarr.length !== 0">
        <template v-if="data.member_resign_switch == 1">
          <view class="flex flex-row px-[24rpx]" @click="alertTips"><text
              class="mr-[8rpx] font-medium text-black text-lg">连续签到奖励</text>
          </view>
          <view class="w-full h-[1rpx] bg-[transparent] mt-[16rpx]"></view>
        </template>

        <scroll-view :scroll-y="true">
          <view class="grid grid-cols-1 gap-[16rpx]">
            <view v-for="(item, index) in data.dayarr" :key="index"
              class="flex flex-row items-center pl-[24rpx] py-[16rpx] mx-[16rpx] font-semibold"
              style="border-bottom: 1rpx solid rgba(255, 255, 255, 0.40);">
              <view class="flex flex-row items-center">
                <image src="/static/images/user/qiandao_rewards.svg" mode="widthFix"
                  class="w-[48rpx] h-[48rpx] mr-[16rpx]" />
              </view>
              <view>
                <view class="text-black text-sm font-medium">连签 {{ item.days }} 天</view>
                <view class="text-sm font-bold ml-[8rpx] text-neutral-theme">
                  <text v-if="item.sort == 1">+{{ item.reward }} {{ symbolStore.code }} 投资奖励</text>
                  <text v-if="item.sort == 2">+{{ item.reward }} 股权</text>
                  <text v-if="item.sort == 3">+{{ item.reward }} {{ symbolStore.code }} 提现奖励</text>
                  <text v-if="item.sort == 4">+{{ item.reward }} 积分</text>
                  <text v-if="item.sort == 5">+{{ item.sort_name }}</text>
                  <text v-if="item.sort == 6">+{{ item.sort_name }}</text>
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
      <view class="flex flex-col relative bg-[#050505] rounded-[48rpx] p-[48rpx] w-full box-border"
        style="background: linear-gradient(144deg, rgba(224, 213, 255, 0.50) 5.38%, rgba(212, 247, 255, 0.50) 90.45%), linear-gradient(180deg, #F4ECFF 0%, #FFF 51.44%, #D6EEFF 95.67%)">
        <view class="left-0 w-full flex flex-row justify-center">
          <image class="w-[160rpx] h-[160rpx] absolute top-[-100rpx]" src="/static/images/index/checkin_coin.png"
            mode="widthFix"></image>
        </view>
        <view class="flex flex-col items-center justify-center mt-[40rpx] mb-[40rpx]">
          <text class="text-2xl text-black">签到成功</text>
          <text class="text-2xl text-[#FF6135] mt-[10rpx]">{{
            data.qian_dao_msg
            }}</text>
        </view>
        <wk-button @submit="showModal = false"
          backgroundColor="linear-gradient(90deg, #AE91FC 0%, #636EFF 49.52%, #2BBFF1 96.63%)"
          style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(110deg, #7D5A44 6.48%, #D5AD8D 83.04%);border-radius: 48rpx;">
          我知道了 </wk-button>
      </view>
    </uv-overlay>

    <!-- 规则弹出层 -->
    <wk-modal ref="wkPopupRef" title="说明" :showClose="false" borderRadius="32rpx">
      <uv-parse :show-img-menu="false" :content="strings"
        container-style="white-space: pre-wrap;color: #010101;border:none;padding:0;"></uv-parse>
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
      border: '1px solid var(--color-text-default-disabled, rgba(37, 44, 47, 0.30))',
      background: 'linear-gradient(180deg, #FBF3FF 0%, #EBF5FD 100%)',
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
      border: '1px dashed #E53935',
      background: 'rgba(255, 255, 255, 0.50)',
    };
  } else {
    // 未签到样式
    return {
      borderRadius: 'var(--radius-card-m, 12px)',
      background: 'rgba(0, 0, 0, 0.10)',
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
  width: 484rpx;
  height: 364rpx;
  background-image: url(/static/images/index/checkin_bg.png);
  background-size: 100% 100%;
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
