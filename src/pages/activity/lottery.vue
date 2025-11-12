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
        <text class="text-neutral-theme text-base mt-[20rpx]"
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
            style="
              padding: 20rpx;
              box-sizing: border-box;
              width: 750rpx;
              height: 750rpx;
            "
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
                  style="flex-shrink: 0; width: 100%; height: 240rpx"
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
        style="border-radius: 20px;border: 2px solid #FFFFFF;background: rgba(255, 255, 255, 0.10);"
        class="pb-[40rpx] flex flex-col items-center z-20 relative mt-[50rpx] mx-[48rpx] mb-[40rpx]"
      >
        <wk-section-title title="奖品内容" />
        <view v-for="item in prizeList" :key="item.id" class="w-full flex flex-row justify-center leading-6 mb-[10rpx]">
          <view class="text-white w-[250rpx] text-right mr-[20rpx] text-lg">{{ item.name }}:</view>
          <view class="text-white flex-1 text-left text-lg">{{ item.prize || 0 }} {{ symbolStore.code }}</view>
        </view>
      </view>

      <!-- 规则弹窗 -->
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
            <text class="text-[#FFFFFF] text-3xl font-semibold mt-[16rpx]"
              >{{ prizeInfo.prize || 0 }} {{ symbolStore.code }}</text
            >
          </view>
          <view class="mt-[48rpx] w-full">
            <wk-button @click="closePopup"> 开心收下 </wk-button>
          </view>
        </view>
      </wk-modal>
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
        prizeBgColors: ["linear-gradient(21deg, #5493FF 4.25%,  #B676FF 58.07%, #B676FF 97.54%)", "linear-gradient(90deg, #4EB2FE 0%, #0479FE 100%)"],
        borderColor: "#fff",
        fontSize: "32rpx",
        color: "#fff",
      },
      showPopup: false,
      prizeInfo: {},
    };
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
            return;
          }
          const data = res.data || {};
          this.prizeInfo = data;
          this.$refs.dialer.run(data.index);
          this.getLotteryPeizhi();
        })
        .catch((error) => {
          console.error("请求失败", error);
          uni.hideLoading();
        });
    },
    //结束转盘触发
    onDone(index) {
      const prize = this.prizeList[index];
      this.prizeListStar = true;
      this.$refs.modalRef.open();
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
</style>
