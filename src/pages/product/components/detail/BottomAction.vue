<template>
  <view
    class="fixed -bottom-[16rpx] left-0 right-0 flex flex-col items-center justify-center"
  >
    <view
      class="py-[16rpx] px-[32rpx] box-border flex flex-col w-full items-center justify-center"
      v-if="productview.ismake == 1 && productview.ismake2 == 1"
      :style="{ background: neutral.bottomBtnBg }"
      >
      <view
        class="flex flex-row w-full h-[100rpx] items-center justify-center bg-transparent rounded-[720rpx]"
        v-if="productview.presale == 0"
      >
        <view class="flex flex-col items-center text-sm justify-center text-[#0C052F]">
          开放倒计时
          <uv-count-down
            :customStyle="{
              color: '#000',
            }"
            @change="onChange"
            @finish="onFinish"
            :time="
              new Date(productview.endingtime).getTime() - new Date().getTime()
            "
          >
            <view class="flex flex-row ml-[15rpx]">
              <view class="mr-[10rpx] flex flex-row items-center">
                <view
                  class="date-bg font-bold text-lg rounded-[8rpx] w-[52rpx] h-[48rpx] flex items-center justify-center"
                  >{{ timeData.days }}</view
                >
                <text class="text-[#0C052F] text-base ml-[10rpx]">天</text>
              </view>
              <view class="mr-[10rpx] flex flex-row items-center">
                <view
                  class="date-bg font-bold text-lg rounded-[8rpx] w-[52rpx] h-[48rpx] flex items-center justify-center"
                  >{{ timeData.hours }}</view
                >
                <text class="text-[#0C052F] text-3xl font-bold ml-[10rpx]">:</text>
              </view>
              <view class="mr-[10rpx] flex flex-row items-center">
                <view
                  class="date-bg font-bold text-lg rounded-[8rpx] w-[52rpx] h-[48rpx] flex items-center justify-center"
                  >{{ timeData.minutes }}</view
                >
                <text class="text-[#0C052F] text-3xl font-bold ml-[10rpx]">:</text>
              </view>
              <view class="mr-[10rpx] flex flex-row items-center">
                <view
                  class="date-bg font-bold text-lg rounded-[8rpx] w-[52rpx] h-[48rpx] flex items-center justify-center"
                  >{{ timeData.seconds }}</view
                >
              </view>
            </view>
          </uv-count-down>
        </view>
      </view>
    </view>
    <view v-else class="py-[16rpx] pt-[0] w-full box-border overflow-hidden">
      <view
        class="text-white text-base text-center bg-[#B676FF] w-full h-[76rpx]"
        style="line-height: 76rpx;"
        v-if="type == 'apply'"
      >
        参与成功即可奖励投资金额的 {{ productview.joining }}%
      </view>
      <view class="px-[32rpx] py-[16rpx]" :style="{ background: neutral.bottomBtnBg }">
        <wk-button
          @submit="$emit('submit')"
          :fontSize="btnText && btnText.length > 20 ? '24rpx' : '32rpx'"
          class="w-full"
          :backgroundColor="btnText === '暂未开放' ? '#F5F8FD' : undefined"
          :color="btnText === '暂未开放' ? 'rgba(37, 44, 47, 0.50)' : undefined"
        >
          {{ btnText }}
        </wk-button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { neutral } from "@/config/colors";

const timeData = ref({});
defineProps({
  productview: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: "",
  },
  btnText: {
    type: String,
    default: "",
  },
});
const emit = defineEmits(["change", "submit", "finish"]);

const onChange = (e) => {
  timeData.value = e;
  emit("change", e);
};
const onFinish = () => {
  emit("finish");
};
</script>

<style scoped>
.date-bg {
  /* border: 1px solid #000; */
  background: #0C052F;
  color: #5493FF;
}
</style>
