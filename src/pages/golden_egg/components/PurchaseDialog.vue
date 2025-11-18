<template>
  <view
    v-if="show"
    class="fixed inset-0 z-[9999] flex items-center justify-center"
    @click.self="close"
  >
    <!-- 遮罩层 -->
    <view class="absolute inset-0 bg-black/60"></view>

    <!-- 弹窗容器 - 包含对话框和关闭按钮 -->
    <view class="relative flex flex-col items-center">
      <!-- 弹窗内容 -->
      <view class="w-[600rpx] bg-white rounded-[48rpx] overflow-hidden animate-fade-in">
        <!-- 标题 -->
        <view class="pt-[48rpx] px-[32rpx] pb-0">
          <text class="text-[32rpx] font-medium text-[#010101] text-center block">
            购买{{ hammerName }}
          </text>
        </view>

        <!-- 锤子展示和价格 -->
        <view class="px-[48rpx] py-[16rpx] flex flex-col items-center gap-[16rpx]">
          <!-- 锤子图标 -->
          <view class="w-[160rpx] h-[160rpx] bg-gradient-to-b from-[#f5edf5] to-[#f6e8f6] rounded-[16rpx] flex items-center justify-center">
            <image :src="hammerIcon" class="w-[120rpx] h-[120rpx]" mode="aspectFit" />
          </view>

          <!-- 价格 -->
          <view class="flex items-baseline gap-[4rpx] text-[#e66d1c]">
            <text class="text-[40rpx] font-bold">{{ price }}</text>
            <text class="text-[24rpx] font-bold">{{ symbolStore.code || 'USD' }}</text>
          </view>
        </view>

        <!-- 数量选择器 -->
        <view class="px-[16rpx] py-[32rpx] flex justify-center">
          <view class="flex items-center gap-[16rpx]">
            <!-- 减少按钮 -->
            <view
              class="w-[60rpx] h-[60rpx] bg-[#f3f5fc] rounded-full flex items-center justify-center"
              :class="quantity <= 1 ? 'opacity-50' : ''"
              @click="decreaseQuantity"
            >
              <view class="w-[28rpx] h-[4rpx] bg-[#02020266] rounded-[4rpx]"></view>
            </view>

            <!-- 数量显示 -->
            <view class="w-[96rpx] text-center">
              <text class="text-[40rpx] font-medium text-black">{{ quantity }}</text>
            </view>

            <!-- 增加按钮 -->
            <view
              class="w-[60rpx] h-[60rpx] bg-[#f3f5fc] rounded-full flex items-center justify-center"
              @click="increaseQuantity"
            >
              <view class="relative w-[28rpx] h-[28rpx]">
                <view class="absolute top-1/2 left-0 w-full h-[4rpx] bg-[#02020266] rounded-[4rpx] -translate-y-1/2"></view>
                <view class="absolute left-1/2 top-0 h-full w-[4rpx] bg-[#02020266] rounded-[4rpx] -translate-x-1/2"></view>
              </view>
            </view>
          </view>
        </view>

        <!-- 购买按钮和余额显示 -->
        <view class="px-[32rpx] pb-[32rpx]">
          <!-- 余额充足时显示购买按钮 -->
          <view
            v-if="isBalanceSufficient"
            class="flex items-center justify-center w-full h-[88rpx] bg-[#FE3355] rounded-[720rpx] text-center text-[30rpx] font-bold text-white"
            @click="confirmPurchase"
          >
            立即购买
          </view>

          <!-- 余额不足时显示充值按钮 -->
          <view
            v-else
            class="flex items-center justify-center w-full h-[88rpx] bg-[#FE3355] rounded-[720rpx] text-center text-[30rpx] font-bold text-white"
            @click="handleRecharge"
          >
            余额不足，去充值
          </view>

          <!-- 余额和总价显示 -->
          <view class="text-center mt-[16rpx]">
            <view>
              <text class="text-[24rpx] text-[#02020266]">
                我的余额：{{ userBalance }} {{ symbolStore.code || 'USD' }}
              </text>
            </view>
            <!-- 显示总价，余额不足时用红色提示 -->
            <view class="mt-[8rpx]">
              <text class="text-[24rpx]" :class="isBalanceSufficient ? 'text-[#02020266]' : 'text-[#FF3355]'">
                总价：{{ totalPrice }} {{ symbolStore.code || 'USD' }}
              </text>
              <text v-if="!isBalanceSufficient" class="text-[24rpx] text-[#FF3355] ml-[8rpx]">
                (余额不足)
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部关闭按钮 - 独立于弹窗内容，显示在下方 -->
      <view class="mt-[40rpx]">
        <view
          class="w-[80rpx] h-[80rpx] bg-white/80 rounded-full flex items-center justify-center border-2 border-white/40"
          @click="close"
        >
          <text class="text-black text-2xl leading-none">×</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useSymbolStore } from "@/stores/symbolStore";

const symbolStore = useSymbolStore();

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  hammerName: {
    type: String,
    required: true
  },
  hammerIcon: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userBalance: {
    type: Number,
    required: true
  },
  initialQuantity: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['close', 'confirm', 'recharge']);

const quantity = ref(props.initialQuantity);

// 监听show属性，重置数量
watch(() => props.show, (newVal) => {
  if (newVal) {
    quantity.value = props.initialQuantity;
  }
});

const totalPrice = computed(() => {
  return props.price * quantity.value;
});

const isBalanceSufficient = computed(() => {
  return props.userBalance >= totalPrice.value;
});

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const increaseQuantity = () => {
  quantity.value++;
};

const close = () => {
  emit('close');
};

const confirmPurchase = () => {
  emit('confirm', {
    quantity: quantity.value,
    totalPrice: totalPrice.value
  });
};

const handleRecharge = () => {
  emit('recharge');
};
</script>

<style lang="scss" scoped>
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>