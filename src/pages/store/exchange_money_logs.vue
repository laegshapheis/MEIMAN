<template>
  <layout
    ref="layoutRef"
    navTitle="兑换记录"
    bgType="bg-main"
    
    @reachBottom="onReachBottom"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <view class="px-[32rpx] mt-[24rpx]">
      <view class="flex-1" v-if="list.length > 0">
        <view
          class="exchange-card min-h-[300rpx] box-border mb-[24rpx] p-[32rpx]"
          v-for="(item) in list"
          :key="item.id"
        >
          <view class="carki_m">
            <view class="flex text-neutral text-lg mb-[10rpx] flex-row justify-between items-center">
              <text>{{ item.moneylog_notice }}</text>
              <text
                class="text-2xl font-bold"
                :class="
                  item.moneylog_status === '+'
                    ? 'text-[#B676FF]'
                    : 'text-[#B676FF]'
                "
                >{{ item.moneylog_status + "" + item.moneylog_money }}</text
              >
            </view>
            <view>
              <text class="text-neutral-secondary text-base">{{
                item.created_at
              }}</text>
            </view>
            <view class="bg-neutral-divider my-[16rpx] h-[1rpx]"></view>
            <view class="px-[24rpx] py-[16rpx] flex flex-col justify-between rounded-[24rpx]">
              <view class="flex flex-row justify-between">
                <view class="text-neutral-regular text-base">原有积分</view>
                <view class="text-neutral text-lg font-bold py-[8rpx]">{{
                  item.moneylog_yuanamount
                }}</view>
              </view>
              <view class="bg-neutral-divider my-[16rpx] h-[1rpx]"></view>
              <view class="flex flex-row justify-between">
                <view class="text-neutral-regular text-base">现有积分</view>
                <view class="text-neutral text-lg font-bold py-[8rpx]">{{
                  item.moneylog_houamount
                }}</view>
              </view>
            </view>
          </view>
          <!-- <view class="bg-neutral-divider my-[32rpx] h-[1rpx]"></view> -->

        </view>
      </view>
      <Empty title="暂无数据" v-else />
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script>
import Empty from "@/components/base/empty.vue";
export default {
  components: {
    Empty,
  },
  data() {
    return {
      loading: false,
      loadingText: '',
      shibai: "",
      list: [],
      t_total: "",
      value: "",
      sortid: 0,
      idx_x: -1,
      range_ar: [
        "资金明细",
        "能量豆明细",
        "积分明细",
        "奖券明细",
        "余额宝明细",
        "签到明细",
      ],
      range: {
        资金明细: 1,
        能量豆明细: 2,
        积分明细: 3,
        奖券明细: 4,
        余额宝明细: 5,
        签到明细: 7,
      },
      t_current_page: 1,
      t_last_page: "",
      time_date: 0, //日期
      is_cz: "", //在做什么
    };
  },
  onLoad(option) {
    this.getLogList(0);
  },
  methods: {
    handleRefresh() {
      this.list = [];
      this.t_current_page = 1;
      this.getLogList();
    },
    onReachBottom() {
      if (this.loading) return ;
      this.is_cz = "上拉加载";
      this.t_current_page++;
      this.getLogList();
    },
    getLogList() {
      let ths = this;
      if (this.loading) return ;
      this.loading = true;
      this.loadingText = '加载中...'
      this.$requestApi({
        url: "/api/user/shouyi",
        method: "POST",
        data: {
          id: "all",
          page: ths.t_current_page, //页码
          sortid: 3, //类型
          times: 0, //时间
          type: 1,
        },
      }).then((res) => {
        this.loading = false;
        if (res.isequity === 0 && ths.range_ar.includes("能量豆明细")) {
          ths.range_ar.splice(1, 1);
        }
        if (
          ths.is_cz == "下拉刷新" ||
          ths.is_cz == "切换类型" ||
          ths.is_cz == "切换时间"
        ) {
          ths.list = [];
        }
        ths.list = ths.list.concat(res.list.data);

        (ths.t_total = res.list.total),
          (ths.t_last_page = res.list.last_page),
          this.loading = false;
          ths.$refs.layoutRef.complete();
      });
    },
  },
};
</script>
<style scoped lang="scss">
.item-bg {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.line-bg {
  background: linear-gradient(90deg, #0358ad 0%, #1DC86F 50%, #0358ad 100%);
}

.exchange-card {
  border-radius: var(--radius-card-l, 16px);
  background: #000;
  box-shadow: 0 0 16px 0 #266AFF inset;
}
</style>
