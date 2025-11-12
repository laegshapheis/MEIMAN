<template>
  <layout navTitle="集卡活动" bgType="bg-main">
    <view class="pb-[60rpx]">
      <!-- 活动标题 -->
      <view class="activity-title">
        <view style="position: relative">
          <image
            style="width: 400rpx; height: 44rpx"
            src="@/static/images/activity/title.png"
            mode="widthFix"
          ></image>
        </view>
        <text class="text-neutral-theme text-lg mt-[16rpx]">{{ title }}</text>
      </view>

      <!-- 记录按钮区 -->
      <view
        class="py-[32rpx] gap-[32rpx] flex flex-row justify-center items-center"
      >
        <view
          style="
            border-radius: 360px;
            background: linear-gradient(90deg, #4EB2FE 0%, #0479FE 100%);
          "
          class="px-[24rpx] flex flex-row justify-center items-center py-[8rpx]"
          @click="goToRules"
        >
          <image
            class="w-[32rpx] h-[32rpx] mr-[5rpx]"
            src="@/static/images/activity/card_record.svg"
            mode="widthFix"
          ></image>
          <text class="text-white text-sm">集卡规则</text>
        </view>
        <view
          style="
            border-radius: 360px;
            background: linear-gradient(90deg, #4EB2FE 0%, #0479FE 100%);
          "
          class="px-[24rpx] flex flex-row justify-center items-center py-[8rpx]"
          @click="goToCardRecord"
        >
          <image
            class="w-[32rpx] h-[32rpx] mr-[5rpx]"
            src="@/static/images/activity/card_record.svg"
            mode="widthFix"
          ></image>
          <text class="text-white text-sm">集卡记录</text>
        </view>
        <view
          style="
            border-radius: 360px;
            background: linear-gradient(90deg, #4EB2FE 0%, #0479FE 100%);
          "
          class="px-[24rpx] flex flex-row justify-center items-center py-[8rpx]"
          @click="goToExchangeRecord"
        >
          <image
            class="w-[32rpx] h-[32rpx] mr-[5rpx]"
            src="@/static/images/activity/Gift.svg"
            mode="widthFix"
          ></image>
          <text class="text-white text-sm">兑换记录</text>
        </view>
      </view>

      <view style="position: relative">
        <!-- 卡片区域 -->
        <z-swiper
          ref="mySwiper"
          grabCursor
          slidesPerView="auto"
          centeredSlides
          :spaceBetween="-20"
          style="height: 822rpx"
          v-model="cards"
          @slideChange="onChange"
        >
          <z-swiper-item
            v-for="(item, index) in cards"
            :key="index"
            :custom-style="{ width: '566rpx', height: '822rpx' }"
          >
            <view class="flex justify-center items-center">
              <image
                class="w-[566rpx] h-[822rpx]"
                :class="[
                  index === activeIndex ? 'active-card' : 'inactive-card',
                ]"
                :src="item.image"
                mode="aspectFit"
              >
              </image>
            </view>
          </z-swiper-item>
        </z-swiper>
        <!-- <view class="flex justify-center items-center">
          <image
            v-if="cards.length > 0"
            style="position: absolute; width: 610rpx; bottom: -200rpx"
            src="@/static/images/activity/di.png"
            mode="widthFix"
          />
        </view> -->
      </view>
      <!-- 抽奖 -->
      <view class="flex justify-center items-center">
        <wk-button class="w-[362rpx] h-[72rpx] my-1" backgroundColor="linear-gradient(21deg, #003DA0 4.25%, #8A5BFF 58.07%, #8A5BFF 97.54%)" @click="goToLottery">
          <text class="text-white text-base">{{ fucard_mode_type == 1 ? '已集齐四卡 去抽奖' : '集齐四卡 去抽奖' }}</text>
        </wk-button>
      </view>
      <!-- 小卡片 -->
      <view class="flex flex-row justify-center items-center gap-[24rpx] mt-[32rpx]">
        <view
          class="small-card"
          v-for="(item, index) in cards"
          :key="index"
          @click="navigateToCard(index)"
        >
          <image
            class="small-card-image"
            :src="item.icon"
            mode="aspectFill"
          ></image>
          <view
            class="card-count-badge"
            v-if="item.user_count && item.user_count > 0"
          >
            <text>{{ item.user_count }}</text>
          </view>
          <view class="text-neutral-theme text-sm mt-[8rpx] text-center">
            <text>{{ item.name }}</text>
          </view>
        </view>
      </view>
    </view>
  </layout>
</template>

<script>
import { getCardListApi } from "@/api/activity";
import { routes } from "@/config/routes";
export default {
  data() {
    return {
      cards: [],
      title: "",
      activeIndex: 0,
      fucard_mode_type: 0,
    };
  },
  onShow() {
    this.getCardList();
  },
  methods: {
    goToLottery() {
      uni.navigateTo({
        url: "/pages/activity/lottery",
      });
    },
    onChange(swiper) {
      this.activeIndex = swiper.activeIndex;
    },
    goToCardRecord() {
      uni.navigateTo({
        url: routes.activityCardRecord,
      });
    },
    goToExchangeRecord() {
      uni.navigateTo({
        url: routes.activityExchangeRecord,
      });
    },
    goToRules() {
      uni.navigateTo({
        url: routes.activityRules,
      });
    },
    buyProduct() {
      uni.switchTab({ url: "/pages/invest/invest" });
    },
    getCardList() {
      getCardListApi().then((res) => {
        console.log('card list', res);
        if (res.status == 0) {
          this.cards = res.data;
          this.title = res.fucard_title;
          this.fucard_mode_type = res.fucard_mode_type;
        } else {
          uni.showToast({
            title: res.msg,
            icon: "none",
          });
        }
      });
    },
    navigateToCard(index) {
      this.$refs.mySwiper.swiper.slideTo(index);
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  width: 100%;
  min-height: 100vh;
  background-color: #000;
}

.active-card {
  transform: scale(1);
  opacity: 1;
}

.inactive-card {
  transform: scale(0.7);
  opacity: 0.5;
}

.activity-title {
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-text {
  font-size: 38rpx;
  color: #fff;
  font-weight: bold;
}

.subtitle-text {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #5effda;
}

.record-btns {
  position: absolute;
  right: 0;
  top: 0rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.record-btn {
  height: 60rpx;
  width: 144rpx;
  padding-left: 5rpx;
  color: #6dd59f;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16rpx;
  border-radius: 360px 0px 0px 360px;
  border: 0.5px solid #21f9c3;
  background: var(
    --,
    linear-gradient(
      270deg,
      rgba(32, 249, 254, 0.24) 0%,
      rgba(32, 249, 254, 0) 50.04%,
      rgba(32, 249, 254, 0.24) 100%
    )
  );
}

.record-btn text {
  color: #37ebe8;
  font-size: 24rpx;
}

.record-btn.active {
  background-color: rgba(255, 255, 255, 0.3);
}

.record-btn.active text {
  color: #fff;
}

.cards-container {
  min-height: 500rpx;
  margin-top: 30rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cards-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
  gap: 24rpx;
}

.card-item {
  width: 180rpx;
  height: 230rpx;
  position: relative;
}

.card-inner {
  background: linear-gradient(to bottom right, #e8c6ff, #c8a0ff);
  border-radius: 100rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 0 15rpx rgba(255, 255, 255, 0.5);
}

.card-item.inactive .card-inner {
  filter: grayscale(100%);
  background: linear-gradient(to bottom right, #d9d9d9, #a0a0a0);
}

.card-text {
  font-size: 70rpx;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.card-count {
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: 10rpx;
  font-size: 24rpx;
  color: #693fb7;
}

.buy-btn-container {
  margin-top: 30rpx;
  margin-bottom: 100rpx;
  width: 100%;
  display: flex;
  justify-content: center;
}



.small-cards-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 20rpx 30rpx;
  gap: 24rpx;
}

.small-card {
  position: relative;
  border-radius: 12rpx;
  transition: all 0.3s;
}

.small-card:active {
  transform: scale(0.95);
}

.small-card-image {
  width: 112rpx;
  height: 112rpx;
}

.card-count-badge {
  position: absolute;
  top: -10rpx;
  min-width: 36rpx;
  height: 36rpx;
  right: -10rpx;
  background-color: #ff4d4f;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 360px;
  border: 0.5px solid #f6d875;
  background: linear-gradient(0deg, #ff8a33 0%, #ff4a4a 51.8%), #ff4a4a;
  background-blend-mode: soft-light, normal, normal;
}

.card-name {
  color: #30f4ea;
  font-size: 26rpx;
  text-align: center;
  margin-top: 5rpx;
}
.card-count-badge text {
  color: #fff;
  font-size: 22rpx;
  font-weight: bold;
}
</style>
