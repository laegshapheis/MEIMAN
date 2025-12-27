<template>
  <view
    class="fixed bottom-0 left-0 right-0 flex flex-col items-center justify-center"
  >
    <view
      class="bg-[#FFFFFF]/80 py-[16rpx] px-[32rpx] box-border flex flex-col w-full items-center justify-center"
      v-if="productview.ismake == 1 && productview.ismake2 == 1"
    >
      <wk-button
        class="text-black flex flex-row w-full h-full items-center justify-center text-xl"
        v-if="productview.presale == 0"
      >
        开放时间
        <uv-count-down
          :customStyle="{
            color: $colors.DEFAULT,
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
                class="date-bg font-bold text-lg rounded-[8rpx] w-[52rpx] h-[48rpx] flex items-center justify-center text-black"
                >{{ timeData.days }}</view
              >
              <text class="text-black text-xl ml-[10rpx]">天</text>
            </view>
            <view class="mr-[10rpx] flex flex-row items-center">
              <view
                class="date-bg font-bold text-lg rounded-[8rpx] w-[52rpx] h-[48rpx] flex items-center justify-center text-black"
                >{{ timeData.hours }}</view
              >
              <text class="text-black text-3xl font-bold ml-[10rpx]">:</text>
            </view>
            <view class="mr-[10rpx] flex flex-row items-center">
              <view
                class="date-bg font-bold text-lg rounded-[8rpx] w-[52rpx] h-[48rpx] flex items-center justify-center text-black"
                >{{ timeData.minutes }}</view
              >
              <text class="text-black text-3xl font-bold ml-[10rpx]">:</text>
            </view>
            <view class="mr-[10rpx] flex flex-row items-center">
              <view
                class="date-bg font-bold text-lg rounded-[8rpx] w-[52rpx] h-[48rpx] flex items-center justify-center text-black"
                >{{ timeData.seconds }}</view
              >
            </view>
          </view>
        </uv-count-down>
      </wk-button>
    </view>
    <view v-else class="py-[16rpx] px-[32rpx] w-full box-border" :style="{ background: neutral.bottomBtnBg }">
      <wk-button
        @submit="$emit('submit')"
        :fontSize="btnText && btnText.length > 20 ? '24rpx' : '30rpx'"
        class="w-full"
      >
        {{ btnText }}
      </wk-button>
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
  border: 1px solid #ffcc90;
  background: linear-gradient(180deg, #e3a425 0%, #ffd47e 100%);
}
</style>
