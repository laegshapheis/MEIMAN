<template>
  <layout navTitle="集卡抽奖" bgType="bg-main">
    <template #navRight>
      <view @click="goToLotteryRecord" class="flex items-center">
        <text class="text-base ml-[8rpx]">抽奖记录</text>
      </view>
    </template>
    <view class="chou_jiang_box">
      <!-- 活动标题 -->
      <view class="activity-title">
        <view style="position: relative">
          <image
            style="width: 432rpx"
            src="@/static/images/activity/lottery_title.png"
            mode="widthFix"
          ></image>
        </view>
        <text class="text-[#36CBFF] text-base mt-[20rpx]"
          >可抽奖{{ lottery_num }}次</text
        >
      </view>
      <view class="xing_yun_a">
        <view
          style="
            position: relative;
            box-sizing: border-box;
            margin-bottom: 80rpx;
            width: 100%;
            margin: 48rpx auto;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10;
          "
        >
          <image
            src="/static/images/activity/lottery_z_bg.png"
            mode="widthFix"
            class="lottery-bg-image"
            :style="bgImageStyle"
          ></image>
          
          <!-- 滚动抽奖 -->
          <view class="chou_jiang_kl">
            <l-dialer
              size="530rpx"
              :prizeList="prizeList"
              :styleOpt="styleOpt"
              @done="onDone"
              ref="dialer"
              :pointerStyle="{
                width: '240rpx',
                height: '240rpx',
              }"
            >
              <template #pointer>
                <image
                  @click="click_chou_jiang"
                  style="flex-shrink: 0; width: 100%; height: 240rpx; margin-top: -10px;"
                  src="/static/images/activity/lottery_btn.png"
                  mode="aspectFit"
                ></image>
              </template>
            </l-dialer>
          </view>
        </view>
        <view class="mt-[-180rpx] px-[32rpx] w-full h-full">
          <image
            class="w-full h-full"
            src="/static/images/activity/lottery_d.png"
            mode="widthFix"
          />
        </view>
      </view>
      <view
        style="border-radius: 20px;border: 2px solid #FFFFFF;background: linear-gradient(180deg, #0611A1 0%, #1252FF 100%)"
        class="pb-[40rpx] flex flex-col items-center z-20 relative mt-[50rpx] mx-[48rpx] mb-[40rpx]"
      >
        <wk-section-title title="奖品内容" />
        <view v-for="item in prizeList" :key="item.id" class="w-full flex flex-row justify-center leading-6 mb-[10rpx]">
          <view class="text-white w-[250rpx] text-right mr-[20rpx] text-lg">{{ item.name }}:</view>
          <view class="text-white flex-1 text-left text-lg">{{ item.prize || 0 }} {{ symbolStore.code }}</view>
        </view>
      </view>

      <!-- 规则弹窗 -->
      <uv-modal
        title=""
        ref="modalRef"
        :bgColor="'transparent'"
        :closeOnClickOverlay="false"
        :showConfirmButton="false"
        :borderRadius="'24rpx'"
        width="750rpx"
      >
        <view class="lottery-modal-content" @click.stop>
          <view class="lottery-modal-text-content">
            <text class="lottery-modal-title">恭喜您抽到{{ prizeInfo.name }}</text>
            <text class="lottery-modal-prize">{{ prizeInfo.prize || 0 }} {{ symbolStore.code }}</text>
            <text class="lottery-modal-desc">奖励已入账到您的余额</text>
          </view>
          <view class="lottery-modal-button-wrapper">
            <view class="lottery-modal-button" @click="closePopup">
              <text class="lottery-modal-button-text">开心收下</text>
            </view>
          </view>
        </view>
      </uv-modal>
    </view>
  </layout>
</template>

<script>
import { useSymbolStore } from "@/stores/symbolStore";

export default {
  data() {
    return {
      symbolStore: useSymbolStore(),
      slid_idx: 0,
      rul_1_text: "", //大转盘规则
      prizeListStar: true, //是否能抽奖
      // 奖品列表
      prizeList: [], //大转盘活参数列表
      lottery_num: 0, //抽奖次数
      show_kl: false,
      content_typ: "",
      styleOpt: {
        prizeBgColors: ["transparent", "transparent"],
        borderColor: "transparent",
        fontSize: "32rpx",
        color: "#fff",
      },
      showPopup: false,
      prizeInfo: {},
      isRotating: false, // 转盘是否正在转动
      bgRotateAngle: 0, // 背景旋转角度
      bgRotateTransition: "", // 背景旋转过渡
      bgStartRotateDegree: 0, // 背景起始旋转角度
    };
  },
  computed: {
    bgImageStyle() {
      return `
        padding: 20rpx;
        box-sizing: border-box;
        width: 750rpx;
        height: 750rpx;
        transform: rotate(${this.bgRotateAngle}deg);
        transition: ${this.bgRotateTransition};
        transform-origin: center center;
      `;
    },
  },
  onLoad() {
    this.getLotteryPeizhi(); //大转盘配置
  },
  methods: {
    goToLotteryRecord() {
      uni.navigateTo({
        url: "/pages/activity/exchange_record",
      });
    },
    closePopup() {
      this.$refs.modalRef.close();
    },
    onClick_l() {
      this.show_kl = false;
    },
    //开始抽奖
    click_chou_jiang() {
      let ths = this;
      if (this.prizeListStar == false) {
        return;
      }
      this.prizeListStar = false;
      this.$requestApi({
        url: "/api/v2/fucards/draw",
        method: "POST",
      })
        .then((res) => {
          ths.prizeListStar = true;
          if (res.status != 0) {
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 3000,
            });
            // 如果请求失败，确保停止背景旋转
            this.stopBgRotation();
            return;
          }
          const data = res.data || {};
          this.prizeInfo = data;
          // 同时开始转动背景和转盘，确保完全同步
          this.startBgRotation(data.index);
          this.$refs.dialer.run(data.index);
          this.getLotteryPeizhi();
        })
        .catch((error) => {
          console.error("请求失败", error);
          uni.hideLoading();
          // 请求失败时停止背景旋转
          this.stopBgRotation();
          ths.prizeListStar = true;
        });
    },
    //结束转盘触发
    onDone(index) {
      const prize = this.prizeList[index];
      this.prizeListStar = true;
      // 停止背景旋转
      this.stopBgRotation();
      this.$refs.modalRef.open();
    },
    // 开始背景旋转（与转盘同步）
    startBgRotation(index) {
      if (!this.prizeList || this.prizeList.length === 0) {
        return;
      }
      this.isRotating = true;
      const duration = 3; // 与转盘默认 duration 相同
      const turns = 10; // 与转盘默认 turns 相同
      const length = this.prizeList.length;
      
      // 使用与转盘完全相同的旋转角度计算逻辑
      const rotateAngle =
        this.bgStartRotateDegree +
        turns * 360 +
        360 -
        (180 / length + (360 / length) * index) -
        (this.bgStartRotateDegree % 360);
      
      this.bgStartRotateDegree = rotateAngle;
      this.bgRotateAngle = rotateAngle;
      // 使用与转盘完全相同的过渡时间和缓动函数
      this.bgRotateTransition = `transform ${duration}s cubic-bezier(0.250, 0.460, 0.455, 0.995)`;
    },
    // 停止背景旋转
    stopBgRotation() {
      this.isRotating = false;
      // 保持当前角度，不重置
    },
    // 转盘抽奖配置
    getLotteryPeizhi() {
      let ths = this;
      uni.showLoading({
        title: "加载中",
        mask: true,
      });
      this.$requestApi({
        url: "/api/v2/fucards/getLotteryConfig",
        method: "get",
      })
        .then((res) => {
          if (res.status != 0) {
            uni.showToast({
              title: res.msg,
              icon: "none",
            });
            return;
          }
          const data = res.data || {};
          const list = data.list || [];
          this.lottery_num = data.remain_count || 0;

          const linarr = list.map((item) => ({
            id: item.id,
            img: item.img,
            name: item.name,
            prize: item.prize,
          }));
          this.prizeList = linarr;
          uni.hideLoading();
        })
        .catch((error) => {
          console.error("请求失败", error);
          uni.hideLoading();
          // 处理错误情况
        });
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  width: 100%;
  min-height: 100vh;
}

.reward_box {
  height: 62rpx;
  background-image: url("/static/images/activity/reward_title_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  font-size: 32rpx;
  color: #fff;
  justify-content: center;
  margin: 0 48rpx;
}

.reward_title {
  font-size: 32rpx;
  color: #00f6ff;
  justify-content: center;
}

.reward_item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.reward_item_text {
  font-size: 32rpx;
  color: #0affff;
  justify-content: center;
}

.reward_list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid #0affff;
  background: #0b1925;
  padding: 24rpx;
}

.activity-title {
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.subtitle-text {
  margin-top: 24rpx;
  font-size: 32rpx;
  color: #5effda;
}
.title-text {
  font-size: 38rpx;
  color: #fff;
  font-weight: bold;
}
.c-theme {
  color: #fff;
}
.card-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.popup-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
}

.popup-btn {
  position: absolute;
  bottom: 100rpx;
  height: 100rpx;
  width: 480rpx;
  background: url("/static/images/activity/lottery_btn_bg.png") no-repeat center
    center;
  background-size: 100% 100%;
}

.popup-content {
  position: relative;
  max-width: 650rpx;
  display: flex;
  padding-top: 250rpx;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  height: 890rpx;
  background-size: 100% 100%;
}

.popup-close {
  position: absolute;
  top: 0rpx;
  right: 100rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.popup-card-title {
  margin-top: 50rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.popup-card-title-text {
  font-size: 48rpx;
  background: linear-gradient(98deg, #fff 15.51%, #84eec4 115.42%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 40rpx;
}

.popup-card {
  width: 480rpx;
  height: 600rpx;
  margin-bottom: 40rpx;
  position: relative;
  transform: scale(0.8);
  opacity: 0;
  transition: all 0.3s ease;
}

.popup-card-show {
  transform: scale(1);
  opacity: 1;
}
.xing_yun_a {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .wid_img_top {
    display: block;
    width: 100%;
  }
}


.chou_jiang_kl {
  position: absolute;
  top: 0rpx;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chou_jiang_btn {
  width: 230rpx;
  height: 230rpx;
  display: block;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  margin-top: -380rpx;
}

.rulex_box_k {
  padding: 20rpx;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10rpx;
  margin: 0 20rpx;
}

.title_rulex {
  font-size: 32rpx;
  color: #fff;
  text-align: center;
  margin-bottom: 10rpx;
}

.rule_1 {
  width: 100%;
  color: #fff;
  font-size: 28rpx;
  line-height: 1.5;
}

.lottery-bg-image {
  transform-origin: center center;
}

.lottery-modal-content {
  position: relative;
  width: 100%;
  min-height: 800rpx;
  background-image: url("/static/images/activity/lottery_modal_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  box-sizing: border-box;
}

.lottery-modal-text-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 240rpx;
  margin-bottom: 40rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  box-sizing: border-box;
  width: fit-content;
  width: calc(100% - 96rpx);
  padding: 40rpx 0;
}

.lottery-modal-title {
  font-size: 48rpx;
  font-weight: 600;
  color: #000000;
  text-align: center;
  margin-bottom: 32rpx;
  line-height: 1.4;
}

.lottery-modal-prize {
  font-size: 56rpx;
  font-weight: 700;
  color: #FF397B;
  text-align: center;
  margin-bottom: 24rpx;
  line-height: 1.2;
}

.lottery-modal-desc {
  color: #171717;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}

.lottery-modal-button-wrapper {
  padding-bottom: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: calc(100% - 96rpx);
}

.lottery-modal-button {
  width: 100%;
  height: 88rpx;
  border-radius: 44rpx;
  border: 1px solid #FFF;
  background: linear-gradient(90deg, #A7FFFF 0%, #FFCCF9 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.lottery-modal-button-text {
  font-size: 36rpx;
  font-weight: 500;
  color: #000000;
}
</style>
