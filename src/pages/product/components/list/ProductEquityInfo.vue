<template>
  <view class="product-info box-border">
    <!-- 产品图片 -->
    <view class="box-border flex flex-row items-center w-full mb-[24rpx]">
      <view class="w-[192rpx] overflow-hidden mr-[16rpx] rounded-[24rpx] relative" style="aspect-ratio: 16/9;">
              <image
                :src="product.pic"
                style="width: 100%; height: 100%; object-fit: contain; object-position: center;"
              ></image>
     </view>
      <view
        class="ml-[24rpx] flex-1 whitespace-pre-wrap text-lg text-neutral line-clamp-2 font-bold"
      >
        {{ product.title }}
      </view>
    </view>
    <view class="box-border">
      <!-- 标题和利率 -->
      <view class="flex flex-col">
        <!-- <view
        class="flex-1 whitespace-pre-wrap text-xl text-neutral line-clamp-2"
      >
        {{ product.category_name }}
      </view> -->
      </view>
      <!-- 认购价格 -->
      <view
        class="text-base text-neutral-regular mt-[10rpx] flex flex-row items-center justify-between"
      >
        <text class="text-base text-neutral"
          >认购价格: </text
        >
        <text class="text-base text-neutral">{{ product.qtje }} {{ symbolStore.code }}</text>
      </view>
      <!-- 单份数量 -->
      <view
        class="text-base text-neutral-regular mt-[10rpx] flex flex-row items-center justify-between"
      >
        <text class="text-base text-neutral"
          >单份数量: </text
        >
        <text class="text-base text-neutral">{{ product.countequity }} 股</text>
      </view>
      <!-- 总出售量 -->
      <view
        class="text-base text-neutral-regular mt-[10rpx] flex flex-row items-center justify-between"
      >
        
        <text class="text-base text-neutral"
          >总出售量: </text
        >
        <text class="text-base text-neutral">{{ product.xmgm }} 股</text>
      </view>

      <!-- 项目进度 -->
      <view class="my-[16rpx] flex flex-row justify-between items-center">
        <view class="flex-1 flex items-center justify-between box-border">
          <sx-progress-anim :val="product.xmjd + '%'" />
          <text class="ml-[32rpx] font-bold text-base text-neutral-theme"
            >{{ product.xmjd }}%</text
          >
        </view>
      </view>

      <!-- 开放时间 -->
      <view
        v-if="product.presale === 0 && product.ismake == 1"
        class="flex flex-row items-start justify-between mb-[10rpx]"
      >
        <view class="w-[120rpx] text-neutral text-base">开放时间</view>
        <view class="ml-[20rpx]">
          <view class="">
            <text class="text-base text-neutral">{{
              product.endingtime
            }}</text>
          </view>
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
  if (hkfs === 2) return "小时";
  if (hkfs === 5) return "个工作日";
  return "天";
};
</script>
