<template>
  <view class="box-border">
    <view class="w-full overflow-hidden mr-[16rpx] rounded-[48rpx] relative" style="aspect-ratio: 16/9;">
              <image
                :src="productview.pic"
                style="width: 100%; height: 100%; object-fit: contain; object-position: center;"
              ></image>
     </view>

    <wk-stroke-bg shadow class="mt-[24rpx]">
      <view>
        <view
            class="flex-1 whitespace-pre-wrap text-lg text-neutral line-clamp-2 font-bold"
          >
            {{ productview.title }}
          </view>
          <!-- 项目周期和进度 -->
          <view
            class="w-full flex items-center justify-between my-[16rpx] box-border"
          >
            <sx-progress-anim :val="productview.xmjd + '%'" />
            <text class="ml-[20rpx] font-bold text-[32rpx] text-neutral-theme"
              >{{ productview.xmjd }}%</text
            >
          </view>
          <view class="bg-[#F5F8FD] rounded-[16rpx] p-[16rpx]">
            <view v-for="(item, index) in productInfoList" :key="index" class="flex flex-row justify-between mt-[6rpx]">
              <view class="flex-shrink-0 w-[120rpx] text-neutral text-base mr-[10rpx] leading-6">{{ item.label }}</view>
              <view>
                <text :class="['text-base leading-6', item.color ? item.color : 'text-neutral']">{{ item.value }}</text>
                <text v-if="item.suffix" :class="['text-base leading-6', item.color ? item.color : 'text-neutral']">{{ item.suffix }}</text>
              </view>
            </view>
          </view>
      </view>
    </wk-stroke-bg>   
  </view>
  <!-- 标题和利率 -->
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
  // {
  //   label: '投资总额',
  //   value: props.productview.xmgm,
  //   suffix: ` ${symbolStore.code}`
  // },
  {
    label: '项目利率',
    value: props.productview.jyrsy,
    suffix: '%'
  },
  {
    label: '投资金额',
    value: +props.productview.qtje === +props.productview.zgje 
      ? props.productview.qtje 
      : `${props.productview.qtje}-${props.productview.zgje}`,
    suffix: ` ${symbolStore.code}`
  },
  {
    label: '项目周期',
    value: props.productview.text_5
  },
  {
    label: '投资模式',
    value: props.productview.dividend_method
  },
  {
    label: '投资次数',
    value: props.productview.bugunmber,
    suffix: ' 次',
    color: 'text-neutral-theme'
  },
  {
    label: '担保机构',
    value: props.productview.bljg
  },
  ...(props.productview.presale === 0 && props.productview.ismake == 1 ? [{
    label: '开放时间',
    value: props.productview.endingtime,
  }] : []),
]);
</script>
