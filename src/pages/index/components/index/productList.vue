<template>
  <!-- <wk-stroke-bg class="mb-[16rpx] rounded-[24rpx]" bgColor="transparent"> -->
    <view
      class="relative box-border flex flex-row items-center justify-between pb-[32rpx] px-[32rpx]"
    >
      <text class="text-2xl text-neutral-black">产品严选</text>
      <view @click="goToProductList" class="flex flex-row items-center leading-6">
        <!-- <text class="text-base text-[#B676FF] font-medium mr-[6rpx]"
          >查看全部</text
        >
        <uv-icon
          name="arrow-right"
          size="14"
          color="#B676FF"
        ></uv-icon> -->
        <image src="/static/images/index/index_right.svg" class="w-[48rpx] h-[48rpx]" mode="widthFix"></image>
      </view>
    </view>
    <view class="w-full">
      <view class="flex flex-col gap-[20rpx] box-border px-[32rpx]">
        <view
          v-for="item in list"
          :key="item.id"
          class="w-full px-[24rpx] py-[24rpx] box-border rounded-[24rpx] gradient-border"
        >
          <!-- First row: Title -->
          <view class="mb-[8rpx] flex flex-row items-center gap-[20rpx]">
            <!-- Image -->
            <view class="w-[240rpx] h-[136rpx] overflow-hidden rounded-[24rpx] relative bg-white"
            :style="{ aspectRatio: '30/17' }">
              <image
                :src="item.pic"
                class="w-full"
                mode="widthFix"
              ></image>
            </view>
            <text class="text-neutral-black" style="font-size: 30rpx; font-weight: 500; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical;">
              {{ item.title }}
            </text>
          </view>

          <!-- Second row: Subtitle -->
          <!-- <view class="mb-[24rpx]">
            <text class="text-sm text-gray-300">{{ item.category_name }}</text>
          </view> -->
          <view class="w-full bg-[#F5F8FD] pt-[16rpx] mt-[40rpx] rounded-[32rpx]">
              <!-- Third row: Key metrics -->
              <view class="flex flex-row justify-between items-center px-[36rpx] mb-[20rpx] text-neutral-black">
                <!-- Investment days -->
                <view class="flex flex-col items-center">
                  <text class="text-sm text-neutral-secondary">
                      投资天数
                  </text>
                  <text class="text-2xl font-bold mb-[4rpx]">
                    {{ item.shijian * item.cycle }} 
                    <text class="text-sm">{{ item.hkfs == 2 ? "小时" : "天" }}</text>
                  </text>
                </view>

                <!-- Minimum investment amount -->
                <view class="flex flex-col items-center">
                  <text class="text-sm text-neutral-secondary">起投金额</text>
                  <text :class="getAmountFontSize(item.qtje)" class="font-bold mb-[4rpx]">
                    {{ item.qtje == item.zgje ? item.qtje : item.qtje }}
                    <text class="text-sm">{{ symbolStore.code }}</text>
                  </text>
                </view>

                <view class="flex flex-col items-center">
                  <text class="text-sm text-neutral-secondary">日利率</text>
                  <text class="text-2xl font-bold mb-[4rpx]">
                    {{ item.jyrsy }}
                    <text class="text-sm">%</text>
                  </text>
                </view>
              </view>

              <!-- Fourth row: Image and CTA button -->
                <!-- CTA button -->
                <view class="rounded-full bg-[#000000] flex items-center justify-center px-[32rpx] py-[16rpx]" @click="goToProductDetail(item.id)">
                    <text class="text-sm text-white">去投资</text>
                    <uv-icon name="arrow-right" size="10" color="#FFFFFF" class="ml-[8rpx]"></uv-icon>
                </view>
          </view>
        </view>
      </view>
    </view>
  <!-- </wk-stroke-bg> -->
</template>

<script setup>
import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";
import { useAuth } from "@/hooks/useAuth";

const symbolStore = useSymbolStore();
const { authStatus, checkAuth } = useAuth();
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

// 初始化时打印list
console.log('Product list initialized:', props.list);

// 根据数值大小返回字体大小类
const getAmountFontSize = (amount) => {
  if (!amount && amount !== 0) return 'text-2xl';
  const numStr = String(amount);
  const numLength = numStr.replace(/[.,]/g, '').length; // 移除小数点和逗号后计算长度
  
  // 根据数字长度返回不同的字体大小
  if (numLength <= 4) {
    return 'text-2xl'; // 1-4位数：32px
  } else if (numLength <= 6) {
    return 'text-xl'; // 5-6位数：24px
  } else if (numLength <= 8) {
    return 'text-lg'; // 7-8位数：20px
  } else {
    return 'text-base'; // 9位数以上：16px
  }
};

const goToProductList = async () => {
  if (authStatus.value !== 1) {
    const stat = await checkAuth();
    if (stat !== 1) {
      return;
    }
  }
  uni.switchTab({
    url: routes.productList,
  });
};
const goToProductDetail = async (id) => {
  if (authStatus.value !== 1) {
    const stat = await checkAuth();
    if (stat !== 1) {
      return;
    }
  }
  uni.navigateTo({
    url: `${routes.productDetail}?id=${id}`,
  });
};
</script>

<style lang="scss" scoped>
.pd-bg {
  background-size: 100% 100%;
  border-radius: var(--radius-card-m, 12px);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  background: radial-gradient(
    141.16% 100% at 7% 0%,
    #4364c3 0%,
    #010045 44.89%
  );
  box-shadow: 0px 0px 16px 0px rgba(63, 72, 92, 0.8) inset;
}

.gradient-border {
  border-radius: 32rpx;
  border: 1px solid  rgba(255, 255, 255, 0.30);
  background: #FFFFFF;
  backdrop-filter: blur(12px)
}
</style>
