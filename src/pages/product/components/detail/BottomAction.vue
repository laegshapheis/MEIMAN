<template>
  <view
    class="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-center"
  >
    <view
      class="bg-[#06F] py-[16rpx] px-[32rpx] box-border flex flex-col w-full items-center justify-center rounded-t-[48rpx]"
      v-if="productview.ismake == 1 && productview.ismake2 == 1"
      >
      <wk-button
        :isShowShadow="false"
        backgroundColor="transparent"
        borderRadius="720rpx"
        class="flex flex-row w-full h-[100rpx] items-center justify-center text-xl"
        v-if="productview.presale == 0"
      >
        <view class="flex flex-col items-center text-sm justify-center text-[#FFFFFF]">
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
                <text class="text-white text-base ml-[10rpx]">天</text>
              </view>
              <view class="mr-[10rpx] flex flex-row items-center">
                <view
                  class="date-bg font-bold text-lg rounded-[8rpx] w-[52rpx] h-[48rpx] flex items-center justify-center"
                  >{{ timeData.hours }}</view
                >
                <text class="text-white text-3xl font-bold ml-[10rpx]">:</text>
              </view>
              <view class="mr-[10rpx] flex flex-row items-center">
                <view
                  class="date-bg font-bold text-lg rounded-[8rpx] w-[52rpx] h-[48rpx] flex items-center justify-center"
                  >{{ timeData.minutes }}</view
                >
                <text class="text-white text-3xl font-bold ml-[10rpx]">:</text>
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
      </wk-button>
    </view>
    <view v-else class="bg-neutral-bottomBtnBg py-[16rpx] pt-[0] w-full box-border rounded-t-[48rpx] overflow-hidden">
      <view
        class="text-[#000] text-base text-center mb-[10rpx] bg-[#9AEEDE] w-full h-[76rpx]"
        style="line-height: 76rpx;"
        v-if="type == 'apply'"
      >
        参与成功即可奖励投资金额的 {{ productview.joining }}%
      </view>
      <view class="px-[32rpx] pt-[16rpx]">
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
  background: #FFFFFF;
  color: #06F;
}
</style>
