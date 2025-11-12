<template>
  <view class="flex flex-row items-center w-full justify-center bg-[#9AEEDE] rounded-[48rpx] py-[16rpx]">
    <view class="text-black text-sm mr-[12rpx]">拼团倒计时</view>
    <view
      class="w-[48rpx] h-[48rpx] box-border flex items-center justify-center text-[#9AEEDE] rounded-[8rpx] px-[8rpx] py-[4rpx] text-base mr-[16rpx] c-bg"
      >{{ days }}</view
    >
    <view class="text-black text-base mr-[12rpx]">天</view>
    <view
      class="w-[48rpx] h-[48rpx] box-border flex items-center justify-center text-[#9AEEDE] rounded-[8rpx] px-[8rpx] py-[4rpx] text-base mr-[12rpx] c-bg"
      >{{ hours }}</view
    >
    <view class="text-black text-lg mr-[12rpx]">:</view>
    <view
      class="w-[48rpx] h-[48rpx] box-border flex items-center justify-center text-[#9AEEDE] rounded-[8rpx] px-[8rpx] py-[4rpx] text-base mr-[12rpx] c-bg"
      >{{ minutes }}</view
    >
    <view class="text-black text-lg mr-[12rpx]">:</view>
    <view
      class="w-[48rpx] h-[48rpx] box-border flex items-center justify-center text-[#9AEEDE] rounded-[8rpx] px-[8rpx] py-[4rpx] text-base c-bg"
      >{{ seconds }}</view
    >
  </view>
</template>

<script>
export default {
  props: {
    updatedAt: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      timer: null,
    };
  },
  mounted() {
    this.startCountdown();
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    startCountdown() {
      this.updateCountdown();
      this.timer = setInterval(() => {
        this.updateCountdown();
      }, 1000);
    },
    updateCountdown() {
      const endTime = new Date(this.updatedAt).getTime() / 1000;
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = endTime - now;

      if (timeLeft <= 0) {
        this.days = "00";
        this.hours = "00";
        this.minutes = "00";
        this.seconds = "00";
        clearInterval(this.timer);
        return;
      }

      this.days = Math.floor(timeLeft / (60 * 60 * 24))
        .toString()
        .padStart(2, "0");
      this.hours = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60))
        .toString()
        .padStart(2, "0");
      this.minutes = Math.floor((timeLeft % (60 * 60)) / 60)
        .toString()
        .padStart(2, "0");
      this.seconds = Math.floor(timeLeft % 60)
        .toString()
        .padStart(2, "0");
    },
  },
};
</script>

<style lang="scss" scoped>
.c-bg {
  border-radius: 8rpx;
  border: 2rpx solid #000;
  background: #010101;
  font-weight: 700;
  font-size: 32rpx;
}
</style>
