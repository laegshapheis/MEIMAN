<template>
  <layout navTitle="兑换记录" bgType="bg-main">
    <view class="px-[32rpx]">
      <!-- 兑换记录列表 -->
      <view class="exchange-list">
        <wk-stroke-bg
          v-for="(item, index) in exchangeRecords"
          :key="index"
          class="flex flex-row items-center mb-[24rpx]"
        >
          <view class="exchange-gift">
            <image
              src="@/static/images/activity/gift.png"
              mode="widthFix"
            ></image>
          </view>
          <view class="exchange-info">
            <text class="exchange-title">{{ item.moneylog_notice }}</text>
            <text class="exchange-time">{{ item.created_at }}</text>
          </view>
        </wk-stroke-bg> 
        <Empty v-if="exchangeRecords.length === 0" class="mt-[300rpx]"></Empty>
      </view>
    </view>
  </layout>
</template>

<script>
import Empty from "@/components/base/empty";
export default {
  components: {
    Empty,
  },
  data() {
    return {
      exchangeRecords: [],
      page: 1,
    };
  },
  onShow() {
    this.getExchangeRecords();
  },
  onReachBottom() {
    this.page++;
    this.getExchangeRecords();
  },
  onPullDownRefresh() {
    this.page = 1;
    this.getExchangeRecords();
  },
  methods: {
    goToActivity() {
      uni.navigateBack();
    },
    goToCardRecord() {
      uni.navigateTo({
        url: "/pages/activity/card-record",
      });
    },
    getExchangeRecords() {
      this.$requestApi({
        url: "/api/v2/fucards/fucardexchange",
        method: "post",
        data: {
          page: this.page,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.status == 0) {
            if (this.page === 1) {
              this.exchangeRecords = res.data || [];
            } else {
              this.exchangeRecords = [...this.exchangeRecords, ...res.data];
            }
          } else {
            uni.showToast({
              title: res.msg || "获取兑换记录失败",
              icon: "none",
            });
          }
          uni.stopPullDownRefresh();
        })
        .catch(() => {
          uni.showToast({
            title: "获取兑换记录失败",
            icon: "none",
          });
          uni.stopPullDownRefresh();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.exchange-list {
  width: 100%;
  box-sizing: border-box;
  margin-top: 28rpx;
}

.exchange-gift {
  width: 106rpx;
  height: 128rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
}

.exchange-gift image {
  width: 100%;
  height: auto;
}

.exchange-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.exchange-title {
  font-size: 28rpx;
  color: #fff;
  margin-bottom: 10rpx;
}

.exchange-time {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

</style>
