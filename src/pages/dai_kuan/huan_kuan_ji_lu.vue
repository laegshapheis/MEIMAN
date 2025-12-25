<template>
  <layout ref="layoutRef" navTitle="还款记录" :refresher="true" bgType="bg-main1" :isLottie="false" @onRefresh="handleRefresh">
    <!-- 内容区域 => 开始 -->
    <view class="px-[32rpx] mt-[28rpx]">
      <view v-for="item in list" class="flex flex-row justify-between mb-[24rpx] bg-black p-[32rpx] rounded-[32rpx] shadow-[0_0_16px_0_#266AFF_inset]" :key="item.id">
        <view class="flex flex-row justify-between mr-[24rpx]">
          <view class="flex flex-row items-center justify-center w-[48rpx] h-[48rpx]">
            <image src="/static/images/user/huankuan_record_icon.svg" mode="widthFix" class="w-full h-full"></image>
          </view>
        </view>

        <view class="flex flex-col flex-grow justify-between">
          <view class="flex flex-row justify-between mb-[12rpx]">
            <view class="text-neutral text-lg">还款</view>
            <view class="text-neutral text-lg font-bold ml-[12rpx]">{{ item.number }} {{ symbolStore.code }}</view>
          </view>
          <view class="flex flex-col pt-[12rpx] border-t-[0.5px] border-r-0 border-b-0 border-l-0 border-solid border-white/25">
            <view class="flex flex-row items-center justify-between text-neutral-secondary text-xs">
              <text>还款编号</text>
              <text>{{ item.bianhao }}</text>

            </view>
            <view class="flex flex-row items-center justify-between text-neutral-secondary text-xs">
              <text>还款时间</text>
              <text>{{ item.updated_at }}</text>

            </view>
          </view>
        </view>
      </view>
      <Empty class="mt-[300rpx]" v-if="list.length == 0" :color="$colors.regular" />
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script>
import Empty from "@/components/base/empty.vue";
import { useSymbolStore } from "@/stores/symbolStore";

export default {
  components: {
    Empty,
  },
  data() {
    return {
      list: [],
      t_total: "",
      t_current_page: 1,
      t_last_page: "",
      ht_img: "",
      symbolStore: useSymbolStore(),
      loading: false,
      loadingText: "",
    };
  },
  onLoad() {
    this.getOldmoneyLog();
  },
  methods: {
    handleRefresh() {
      this.getOldmoneyLog();
    },
    jumpInfo(obj) {
      uni.navigateTo({
        url: "daikuan_show?id=" + obj.id,
      });
    },
    nex_last_info(type) {
      if (type == "-" && this.t_current_page > 1) {
        this.t_current_page--;
        this.getOldmoneyLog();
      }
      if (type == "+" && this.t_current_page < this.t_last_page) {
        this.t_current_page++;
        this.getOldmoneyLog();
      }
    },
    getOldmoneyLog() {
      let ths = this;
      this.loading = true;
      this.loadingText = "加载中...";
      this.$requestApi({
        url: "/api/user/daikuanlogs",
        method: "POST",
        data: {
          status: 0,
        },
      }).then((res) => {
        ths.list = res.list.data;
        ths.t_total = res.list.total;
        ths.t_current_page = res.list.current_page;
        ths.t_current_page = res.list.current_page;
        ths.t_last_page = res.list.last_page;
        this.loading = false;
        ths.$refs.layoutRef.complete();
      });
    },
  },
};
</script>

<style lang="scss">
.slef_32 {
  box-sizing: border-box;
  padding: 24rpx 28rpx 1rpx;
}

// 装饰部分
.b-k-1,
.b-k-2,
.b-k-3,
.b-k-4 {
  position: absolute;
  width: 28rpx;
  height: 28rpx;
  border: 6rpx solid #000000;
}

.b-k-1,
.b-k-4 {
  left: -6rpx;
  border-right: none;
}

.b-k-1,
.b-k-2 {
  top: -6rpx;
  border-bottom: none;
}

.b-k-2,
.b-k-3 {
  right: -6rpx;
  border-left: none;
}

.b-k-3,
.b-k-4 {
  bottom: -6rpx;
  border-top: none;
}

.item-card {
  position: relative;
  padding: 32rpx;
  line-height: 1.4;
  margin-bottom: 32rpx;

  .title-status {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 32rpx;
      color: #fff;
    }

    .status {
      font-size: 28rpx;
      color: #000000;
    }
  }

  .line-tips {
    display: flex;
    margin-top: 24rpx;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    justify-content: space-between;

    .var {
      color: #95caff;
    }

    .dfn {
      font-weight: bold;
    }

    .status {
      font-size: 28rpx;
      color: #000000;
    }
  }

  .tips-s {
    margin-top: 12rpx;
    color: #95caff;
    font-size: 28rpx;
  }

  .info-box-x {
    margin-top: 32rpx;

    .hr-x {
      height: 2rpx;
      background-image: linear-gradient(to right,
          rgba(3, 88, 173, 1),
          rgba(7, 254, 239, 1),
          rgba(3, 88, 173, 1));
    }

    .line-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      font-size: 28rpx;
      padding: 24rpx 0;
      padding-left: 24rpx;

      .leftb {}

      .top {
        font-weight: bold;
        font-size: 32rpx;
      }

      .bot {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .other-btn {
    color: #000000;
    font-size: 28rpx;
    margin-top: 32rpx;
    text-align: center;
  }
}
</style>
