<template>
  <layout
    navTitle="盲盒抽奖"
    bgType="bg-task"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <template #navRight>
      <view @click="handleDocument" class="text-neutral-theme">
        中奖记录
      </view>
    </template>
    <view class="px-[32rpx] pt-[50vh] box-border w-full flex flex-col relative h-full justify-center items-center">
            <view @click="handleDrawBox" class="flex flex-col justify-center items-center w-[374rpx] h-[64rpx] py-[16rpx] px-[64rpx] rounded-[400rpx]" 
              style="background: linear-gradient(21deg, #5493FF 4.25%, #B676FF 58.07%, #B676FF 97.54%)">
              <text class="text-white text-base font-medium">盲盒抽奖</text>
            </view>

            <view class="flex flex-col justify-center items-center w-[374rpx] h-[64rpx] py-[16rpx] px-[64rpx] rounded-[400rpx] mt-[16rpx]" >
              <text class="text-[#B676FF] text-base font-medium">可抽奖{{ remain_count }}次</text>

              <view class="flex flex-row items-center justify-center mt-[10rpx]" @click="handleLotteryRecord">
                <text class="text-neutral-theme text-sm">查看获取记录 </text>
                <uv-icon name="arrow-right" size="12" :color="$colors.theme" class="ml-[8rpx]" />
              </view>

            </view>
            <view class="rule-bg">
              <view class="rule_box">
                <!-- <view class="rule_box_title">抽奖规则</view> -->
                <text class="rule_box_content">{{ ruleStr }}</text>
              </view>
            </view>

    </view>

    <!-- 中奖弹框 -->
    <wk-modal
      title=""
      :showClose="false"
      ref="modalRef"
      size="large"
    >
      <view class="w-full h-full flex flex-col items-center" @click.stop>
        <image
          class="w-[240rpx] h-[240rpx] mt-[68rpx]"
          src="/static/images/activity/lottery_modal.png"
          mode="scaleToFill"
        />
        <view class="flex flex-col items-center mt-[48rpx]">
          <text class="text-[#FFFFFF] text-3xl font-semibold"
            >恭喜您抽到{{ prizeInfo.name }}</text
          >
        </view>
        <view class="mt-[48rpx] w-full">
          <wk-button @click="closePopup"> 开心收下 </wk-button>
        </view>
      </view>
    </wk-modal>
  </layout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { Navigation } from "@/uni_modules/zebra-swiper/modules";
import { getBoxListApi, drawBoxApi } from "@/api/task";
import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";

const layoutRef = ref(null);
const modalRef = ref(null);
const ruleStr = ref("");
const remain_count = ref(0);
const symbolStore = useSymbolStore();
const prizeInfo = ref({});

const handleDocument = () => {
  uni.navigateTo({
    url: '/pages/task/record'
  });
};

// 关闭弹框
const closePopup = () => {
  modalRef.value.close();
};

// 处理盲盒抽奖
const handleDrawBox = async () => {
  if (remain_count.value <= 0) {
    uni.showToast({
      title: '抽奖次数不足',
      icon: 'none'
    });
    return;
  }

  try {
    uni.showLoading({
      title: '抽奖中...',
      mask: true
    });

    const res = await drawBoxApi();
    console.log(res);
    if (res.status === 0) {
      // 抽奖成功，更新页面数据
      remain_count.value = res.data.remain_count;
      
      // 如果中奖了，显示弹框
      if (res.data.win_status === 1) {
        prizeInfo.value = {
          name: res.data.name,
          prize: res.data.prize || 0
        };
        modalRef.value.open();
      } else if (res.data.win_status === 0) {
        // 未中奖
        uni.showToast({
          title: '很遗憾，未中奖',
          icon: 'none'
        });
      } else {
        // 其他状态
        uni.showToast({
          title: res.data.msg || '抽奖结果异常',
          icon: 'none'
        });
      }
    } else {
      uni.showToast({
        title: res.msg || '抽奖失败',
        icon: 'none'
      });
    }
  } catch (error) {
    console.error('抽奖失败:', error);
    uni.showToast({
      title: '抽奖失败，请重试',
      icon: 'none'
    });
  } finally {
    uni.hideLoading();
  }
};

// 获取盲盒列表
const getBoxList = async () => {
  try {
    const res = await getBoxListApi();
    console.log(res.boxes_rules);
    ruleStr.value = res.boxes_rules;
    remain_count.value = res.remain_count;
  } catch (error) {
    console.error('获取盲盒列表失败:', error);
    throw error; // 重新抛出错误，让调用方处理
  }
};

// 刷新页面数据
const handleRefresh = async () => {
  try {
    await getBoxList();
  } catch (error) {
    console.error('刷新数据失败:', error);
  } finally {
    // 结束刷新状态
    layoutRef.value.complete();
  }
};

onShow(() => {
  getBoxList();
});

const handleLotteryRecord = () => {
  uni.navigateTo({
    url: routes.taskLotteryRecord,
  });
};
</script>

<style lang="scss">
.rule-bg {
  width: 100%;
  margin: 0 32rpx;
  margin-top: 44rpx;
  padding-bottom: 24rpx;
}
.rule_box {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 32rpx 48rpx;
  margin: auto;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 24rpx;
  background: transparent;
  border: 3rpx solid #B7C6FF20;
  .rule_box_title {
    color: theme('colors.neutral.theme');
    display: inline-block;
    // margin: 0px auto;
    font-size: 32rpx;

    font-weight: 600;
    line-height: 1;
    
    // background: #E5CCFF;
    border-radius: 32rpx;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    // padding: 16rpx 116rpx;
    // color: #252C2F;

    padding: 24rpx 0rpx;
  }
  .rule_box_content {
    // margin-top: 40rpx;
    display: block;
    font-size: 28rpx;
    line-height: 1.6;
    padding-bottom: 20rpx;
  }
}
</style>
