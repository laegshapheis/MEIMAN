<template>
  <view class="product-info">
    <!-- 产品图片 -->
    <view class="box-border flex flex-row items-center w-full mb-[24rpx]">
      <view class="w-[268rpx] overflow-hidden mr-[16rpx] rounded-[24rpx] relative" style="aspect-ratio: 16/9;">
              <image
                :src="product.pic"
                style="width: 100%; height: 100%; object-fit: contain; object-position: center;"
              ></image>
     </view>
      <view
        class="ml-[16rpx] flex-1 text-lg text-neutral line-clamp-2 font-bold"
      >
        {{ product.title }}
      </view>
    </view>
    <view class="box-border">
      <view class="flex flex-row items-end justify-between mt-[24rpx]">
        <!-- 项目利率 -->
        <view class="flex flex-col items-start">
          <text class="text-xl font-bold text-neutral-theme mb-[8rpx]"
            >{{ product.jyrsy }}%</text
          >
          <text class="text-sm text-neutral-regular">项目利率</text>
        </view>
        <!-- 项目周期 -->
        <view class="flex flex-col items-start">
          <text class="text-base font-bold text-neutral mb-[8rpx]">
            {{
              product.cycle > 0
                ? product.shijian * product.cycle
                : product.shijian
            }}
          </text>
          <text class="text-neutral-regular text-sm"
            >项目周期 ({{ getDurationUnit(product.hkfs) }})</text
          >
        </view>
        <!-- 投资金额 -->
        <view class="flex flex-col items-start justify-center">
          <text class="text-base font-bold text-neutral mb-[8rpx]">
            {{
              +product.qtje == +product.zgje
                ? product.qtje
                : product.qtje + "-" + product.zgje
            }}
          </text>
          <text class="text-neutral-regular text-sm"
            >投资金额 ({{ symbolStore.code }})</text
          >
        </view>
      </view>
      <view class="w-full h-[1px] bg-neutral-black/10 my-[16rpx]"></view>
      <view class="relative">
        <view
          class="flex-1 flex items-center justify-between box-border mt-[24rpx]"
        >
          <sx-progress-anim :val="product.xmjd + '%'" />
          <text class="ml-[24rpx] font-bold text-base text-neutral-theme"
            >{{ product.xmjd }}%</text
          >
        </view>
      </view>
      <view class="flex flex-col mt-[24rpx] py-[16rpx]">
        <!-- 分红方式 -->
        <view class="flex flex-row items-center">
          <uv-icon name="checkmark-circle-fill" size="30rpx" color="#B676FF" class="mr-[8rpx]" />
          <text class="text-sm text-neutral-regular mr-[16rpx]">投资模式:</text>
          <text class="text-sm text-neutral-regular">{{ product.dividend_method }}</text>
        </view>
        <!-- 开放时间 -->
        <view
          v-if="product.presale === 0 && product.ismake == 1"
          class="flex flex-row items-center mt-[10rpx]"
        >
          <uv-icon name="checkmark-circle-fill" size="30rpx" color="#B676FF" class="mr-[8rpx]" />
          <text class="text-sm text-neutral-regular mr-[16rpx]">开放时间:</text>
          <text class="text-sm text-neutral-regular">{{ product.endingtime }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { useSymbolStore } from "@/stores/symbolStore";
const symbolStore = useSymbolStore();

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const getDurationUnit = (hkfs) => {
  if ([1, 3, 4, 7].includes(hkfs)) return "天";
  if (hkfs === 2 || hkfs === 8) return "小时";
  if (hkfs === 5) return "个工作日";
  return "天";
};
</script>
