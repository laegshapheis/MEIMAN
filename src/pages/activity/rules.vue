<template>
  <layout navTitle="集卡规则" bgType="bg-main">
    <view class="pb-[60rpx]">
      <!-- 规则内容 -->
      <view class="rules-container">
        <view class="rules-overlay">
            <text class="rules-text">{{ rules }}</text>
        </view>
      </view>
    </view>
  </layout>
</template>

<script>
import { getCardListApi } from "@/api/activity";

export default {
  data() {
    return {
      rules: "",
    };
  },
  onShow() {
    this.getCardRules();
  },
  methods: {
    getCardRules() {
      getCardListApi().then((res) => {
        console.log(res);
        if (res.status == 0) {
          this.rules = res.fucard_rules;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
page {
  width: 100%;
  min-height: 100vh;
  background-color: #000;
}

.rules-container {
  padding: 40rpx;
  display: flex;
  justify-content: center;
}

.rules-overlay {
  padding: 40rpx;
  width: 100%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 24rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10rpx);
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.rules-title {
  padding: 40rpx 40rpx 20rpx;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}

.rules-content {
  padding: 30rpx 40rpx 40rpx;
}

.rules-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: #ffffff;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
  white-space: pre-line;
}
</style>
