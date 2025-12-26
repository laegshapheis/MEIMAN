<template>
  <wk-stroke-bg mode="img-card3-big">
    <!-- 标题和利率 -->
    <view
      class="flex-1 whitespace-pre-wrap text-lg text-neutral line-clamp-2 font-bold"
    >
      {{ productview.title }}
    </view>
    <!-- 项目周期和进度 -->
    <view
      class="w-full flex items-center justify-between mt-[16rpx] box-border"
    >
      <sx-progress-anim :val="productview.xmjd + '%'" />
      <text class="ml-[20rpx] font-bold text-base text-neutral-theme"
        >{{ productview.xmjd }}%</text
      >
    </view>
    <view 
      class="p-[24rpx] mt-[16rpx] rounded-[16rpx] bg-neutral-primaryAssist"
    >
      <view v-for="(item, index) in productInfoList" :key="index" class="flex flex-row items-center justify-between">
        <view class=" text-neutral text-base mr-[10rpx] leading-6">{{ item.label }}</view>
        <view>
          <text :class="['text-base font-medium leading-6', item.color ? item.color : 'text-neutral']">{{ item.value }}</text>
          <text v-if="item.suffix" :class="['text-base font-medium leading-6']">{{ item.suffix }}</text>
        </view>
      </view>
    </view>
  </wk-stroke-bg>   
</template>

<script setup>
import { computed } from 'vue';
import { useSymbolStore } from "@/stores/symbolStore";

const symbolStore = useSymbolStore();

const props = defineProps({
  productview: {
    type: Object,
    required: true,
  },
});
const productInfoList = computed(() => [
  {
    label: '认购价格',
    value: props.productview.qtje,
    suffix: ` ${symbolStore.code}`
  },
  {
    label: '单份数量',
    value: props.productview.countequity,
    suffix: ' 股'
  },
  {
    label: '总出售量',
    value: props.productview.xmgm,
    suffix: ' 股'
  },
  ...(props.productview.presale === 0 && props.productview.ismake == 1 ? [{
    label: '开放时间',
    value: props.productview.endingtime,
  }] : []),
]);
</script>
