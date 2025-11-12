<template>
  <view
    class="relative overflow-hidden p-[48rpx] bg-card3 rounded-[32rpx]"
  >
    <!-- 背景图 -->
    <!-- <view class="absolute top-0 right-0 w-full h-full">
      <image
        class="absolute top-0 right-0 w-full h-full"
        src="/static/images/equity/card_bg.png"
        mode="aspectFill"
      />
    </view> -->
    <view class="relative z-10 flex flex-col justify-center items-center">
      <view class="flex flex-col flex-1 items-center">
        <view class="text-white/60 text-base mb-[8rpx] flex flex-row items-center">
          <text class="mr-[8rpx]">今日股价({{ symbolStore.code }})</text>
          <uv-icon
            @click="handleOpen(data.nengliangzhi)"
            name="question-circle"
            size="15"
            :color="$colors.white/60"
          ></uv-icon>
        </view>
        <text class="text-white text-3xl font-bold">{{ data.quote || 0 }}</text>
      </view>
      <view
        style="backdrop-filter: blur(12px)"
        class="bg-black/10 rounded-[24rpx] h-[144rpx] w-full grid grid-cols-2 gap-[24rpx] justify-between items-center mt-[24rpx]"
      >
        <view class="flex flex-col flex-1 items-center justify-center">
          <view class="text-white/60 text-base flex flex-row items-center">
            <text class="mr-[8rpx]">股权余额(股)</text>
            <uv-icon
              @click="handleOpen(data.nengliangdou)"
              name="question-circle"
              size="14"
              :color="$colors.white/60"
            ></uv-icon>
          </view>
          <text class="text-2xl text-white font-bold mt-[8rpx]">{{
            data.equity || 0
          }}</text>
        </view>
        <view class="flex flex-col flex-1 items-center justify-center">
          <view class="text-white/60 text-base flex flex-row items-center">
            <text class="mr-[8rpx]">已质押数量(股)</text>
            <uv-icon
              @click="handleOpen(data.yishifang)"
              name="question-circle"
              size="14"
              :color="$colors.white/60"
            ></uv-icon>
          </view>
          <text class="text-2xl text-white font-bold mt-[8rpx]">{{
            data.number || 0
          }}</text>
        </view>
      </view>
    </view>
  </view>
  <wk-modal
    ref="modalRef"
    title="说明"
    :showCancel="false"
    confirmText="我知道了"
    @confirm="modalRef?.close()"
  >
    <text>{{ description }}</text>
  </wk-modal>
</template>

<script setup>
import { ref } from "vue";
import { useSymbolStore } from "@/stores/symbolStore";
import { routes } from "@/config/routes";
const symbolStore = useSymbolStore();

defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const modalRef = ref(null);
const description = ref("");
const handleOpen = (data) => {
  description.value = data;
  modalRef.value.open();
};
const goPageDetail = () => {
  uni.navigateTo({
    url: routes.flowRecord + "?type=2",
  });
};
</script>

<style lang="scss" scoped>
.c-bg {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(22px);
  border-radius: 16rpx;
}
</style>
