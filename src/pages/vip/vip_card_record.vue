<template>
  <layout
    ref="layoutRef"
    navTitle="购卡记录"
    
    :refresher="true"
    bgType="bg-grey"
    @onRefresh="handleRefresh"
  >
    <!-- 内容区域 => 开始 -->
    <view class="px-[32rpx] mt-[28rpx]">
      <wk-stroke-bg
        v-for="item in list"
        class="flex flex-row justify-between mb-[24rpx]"
        :key="item.id"
      >
        <view class="flex flex-col flex-grow justify-between">
          <view class="flex flex-row justify-between">
            <view class="text-neutral text-base">购买了{{ item.name }}</view>
            <view class="text-neutral text-lg font-bold"
              >{{ item.price }} {{ symbolStore.code }}</view
            >
          </view>
          <view class="flex flex-col py-[24rpx] pb-[16rpx]">
            <text class="text-neutral-regular text-base"
              >购卡时间：{{ item.createtime }}</text
            >
            <text class="text-neutral-regular text-base mt-[16rpx]"
              >到期时间：{{ item.expire_at }}</text
            >
          </view>
        </view>
      </wk-stroke-bg>
      <Empty
        class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        v-if="list.length == 0"
        :color="$colors.regular"
      />
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script>
import Empty from "@/components/base/empty.vue";
import { useSymbolStore } from "@/stores/symbolStore";
import { cacheManager } from "@/utils/cacheManager";
import { getVipCardOrderList } from "@/api/user";
export default {
  components: {
    Empty,
  },
  data() {
    return {
      list: [],
      symbolStore: useSymbolStore(),
      loading: false,
      loadingText: "",
    };
  },
  onLoad() {
    const cache = cacheManager.getCache("vipCardRecord");
    if (cache) {
      this.handleCache(cache);
    }
    this.getList();
  },
  methods: {
    handleRefresh() {
      this.getList();
    },
    handleCache(res) {
      this.list = res.list || [];
    },
    async getList() {
      try {
        let ths = this;
        this.loading = true;
        this.loadingText = "加载中...";
        const res = await getVipCardOrderList();
        console.log(res);
        if (res.status != 0) {
          uni.$showToast({
            title: res.msg,
            duration: 3000,
            icon: "none",
          });
          return;
        }
        cacheManager.setCache("vipCardRecord", res);
        this.handleCache(res);
        this.loading = false;
        ths.$refs.layoutRef.complete();
      } catch (error) {
        console.error("获取购卡记录失败", error);
        this.loading = false;
        ths.$refs.layoutRef.complete();
      }
    },
  },
};
</script>

<style lang="scss"></style>
