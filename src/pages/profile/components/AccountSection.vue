<template>
  <view class="relative flex flex-col rounded-[32rpx] bg-account-section overflow-hidden">
    <!-- 顶部标题和汇率 -->
    <view class="w-full flex flex-row justify-between items-center px-[32rpx] py-[16rpx] box-border h-[84rpx]">
      <view class="flex flex-row items-center">
        <text class="text-white text-md leading-[48rpx] font-semibold">我的账户</text>
        <view class="w-[36rpx] h-[36rpx] flex justify-center items-center ml-[12rpx]" @click="handleShowData">
          <uv-icon v-if="showData" name="eye" color="#fff" size="36rpx"></uv-icon>
          <uv-icon v-else name="eye-off-outline" color="#fff" size="36rpx"></uv-icon>
        </view>
      </view>
      <view class="flex flex-row items-center rounded-[720rpx] px-[16rpx] py-[8rpx]">
        <text class="text-[#5493FF] text-xs leading-[28rpx] font-normal">
          实时汇率：1 {{ symbolStore.value == "CNY" ? "USDT" : "CNY" }} = {{ props.currentRate }} {{ symbolStore.value }}
        </text>
        <image
            @click="handleSwitchRate"
            src="/static/images/profile/switch.svg"
            mode="widthFix"
            class="ml-[16rpx] w-[24rpx] h-[24rpx]"
          ></image>
      </view>
    </view>

    <!-- 主要内容区域 -->
    <view class=" w-full flex flex-1 flex-col">
      <!-- 第一行：可用余额、提现余额 -->
      <view class="w-full flex flex-row border-t-[0.5px] border-b-[0px] border-[rgba(255,255,255,0.2)] border-solid box-border">
        <!-- 可用余额 -->
        <view class="flex-1 flex flex-col justify-center px-[32rpx] py-[16rpx] box-border">
          <view class="flex flex-row items-center">
            <text class="text-white/60 text-sm leading-[36rpx] font-normal">可用余额</text>
            <view class="w-[24rpx] h-[24rpx] flex justify-center items-center ml-[4rpx]" @click="$emit('onTips', 1)">
              <uv-icon size="20rpx" color="rgba(255,255,255,.6)" name="question-circle"></uv-icon>
            </view>
          </view>
          <view class="flex flex-row items-end">
            <text class="text-white text-2xl leading-[48rpx] tracking-[-0.8rpx] font-semibold">
              {{ handleFilterData(userInfo.touzimoney || 0) }}
            </text>
            <text class="text-white text-xs leading-[36rpx] font-medium ml-[4rpx] mb-[2rpx]">{{ symbol }}</text>
          </view>
        </view>
        <!-- 分隔线 -->
        <view class="w-[1rpx] bg-[rgba(12,5,47,1)]"></view>
        <!-- 提现余额 -->
        <view class="flex-1 flex flex-col justify-center px-[32rpx] py-[16rpx] box-border">
          <view class="flex flex-row items-center">
            <text class="text-white/60 text-sm leading-[36rpx] font-normal">提现余额</text>
            <view class="w-[24rpx] h-[24rpx] flex justify-center items-center ml-[4rpx]" @click="$emit('onTips', 2)">
              <uv-icon size="20rpx" color="rgba(255,255,255,.6)" name="question-circle"></uv-icon>
            </view>
          </view>
          <view class="flex flex-row items-end">
            <text class="text-white text-2xl leading-[48rpx] tracking-[-0.8rpx] font-semibold">
              {{ handleFilterData(userInfo.txmoney || 0) }}
            </text>
            <text class="text-white text-xs leading-[36rpx] font-medium ml-[4rpx] mb-[2rpx]">{{ symbol }}</text>
          </view>
        </view>
      </view>

      <!-- 第二行：累计收益、我的积分 -->
      <view class="w-full flex flex-row box-border">
        <!-- 累计收益 -->
        <view class="flex-1 flex flex-col justify-center px-[32rpx] py-[16rpx]">
          <view class="flex flex-row items-center">
            <text class="text-white/60 text-sm leading-[36rpx] font-normal">累计收益</text>
            <view class="w-[24rpx] h-[24rpx] flex justify-center items-center ml-[4rpx]" @click="$emit('onTips', 3)">
              <uv-icon size="20rpx" color="rgba(255,255,255,.6)" name="question-circle"></uv-icon>
            </view>
          </view>
          <view class="flex flex-row items-end">
            <text class="text-white text-2xl leading-[48rpx] tracking-[-0.8rpx] font-semibold">
              {{ handleFilterData(userInfo.leijimoney || 0) }}
            </text>
            <text class="text-white text-xs leading-[36rpx] font-medium ml-[4rpx] mb-[2rpx]">{{ symbol }}</text>
          </view>
        </view>
        <!-- 分隔线 -->
        <view class="w-[1rpx] bg-[rgba(12,5,47,1)]"></view>
        <!-- 任务质押 -->
        <view class="flex-1 flex flex-col justify-center px-[32rpx] py-[16rpx]" v-if="userInfo.lockmoney > 0">
          <view class="flex flex-row items-center">
            <text class="text-white/60 text-sm leading-[36rpx] font-normal">任务质押({{ symbol }})</text>
            <view class="w-[24rpx] h-[24rpx] flex justify-center items-center ml-[4rpx]" @click="$emit('onTips', 999)">
              <uv-icon size="20rpx" color="rgba(255,255,255,.6)" name="question-circle"></uv-icon>
            </view>
          </view>
          <view class="flex flex-row items-end">
            <text class="text-white text-2xl leading-[48rpx] tracking-[-0.8rpx] font-semibold">
              {{ handleFilterData(userInfo.lockmoney || 0)  }}
            </text>
          </view>
        </view>
        <!-- 我的积分 -->
        <view class="flex-1 flex flex-col justify-center px-[32rpx] py-[16rpx]" v-else>
          <view class="flex flex-row items-center">
            <text class="text-white/60 text-sm leading-[36rpx] font-normal">我的积分</text>
            <view class="w-[24rpx] h-[24rpx] flex justify-center items-center ml-[4rpx]" @click="$emit('onTips', 4)">
              <uv-icon size="20rpx" color="rgba(255,255,255,.6)" name="question-circle"></uv-icon>
            </view>
          </view>
          <view class="flex flex-row items-end">
            <text class="text-white text-2xl leading-[48rpx] tracking-[-0.8rpx] font-semibold">
              {{ showData ? (userInfo.integral || 0) : "*****" }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="w-full flex flex-row justify-between items-center px-[0rpx] py-[24rpx] box-border h-[92rpx]  border-t-[0.5px] border-b-[0px] border-[rgba(255,255,255,0.2)] border-solid">
      <view 
        class="flex-1 flex flex-row justify-center items-center"
        @click="$emit('onNavTo', menus[0])"
      >
        <image :src="menus[0].icon_url" mode="widthFix" class="w-[40rpx] h-[40rpx]"></image>
        <text class="text-white text-base font-medium ml-[16rpx]">{{ menus[0].title }}</text>
      </view>
      <view 
        class="flex-1 flex flex-row justify-center items-center"
        @click="$emit('onNavTo', menus[1])"
      >
        <image :src="menus[1].icon_url" mode="widthFix" class="w-[40rpx] h-[40rpx]"></image>
        <text class="text-white text-base font-medium ml-[16rpx]">{{ menus[1].title }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { formatPrice } from "@/utils/utils";
import { useSymbolStore } from "@/stores/symbolStore";
import { routes } from "@/config/routes";

const symbolStore = useSymbolStore();

// 在组件内部定义充值相关菜单
const menus = ref([
  {
    title: "充值",
    icon_url: "/static/images/profile/recharge_menu_icon.svg",
    redirect: routes.recharge,
    realname: 1,
  },
  {
    title: "提现",
    icon_url: "/static/images/profile/withdraw_menu_icon.svg",
    redirect: routes.withdraw,
    realname: 1,
  },
]);

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({}),
  },
  currentRate: {
    type: Number,
    default: 1,
  },
  showData: {
    type: Boolean,
    default: false,
  },
  openCards: {
    type: Number,
    default: 0,
  },
});

defineEmits(["onShowData", "onTips", "onNavTo"]);
const switchRate = ref(true);
const showData = ref(false);

watch(
  () => props.showData,
  (newVal) => {
    showData.value = newVal;
  }
);

const handleSwitchRate = () => {
  switchRate.value = !switchRate.value;
};

const symbol = computed(() => {
  return switchRate.value
    ? symbolStore.code
    : symbolStore.value == "CNY"
      ? "USDT"
      : "CNY";
});

const handleShowData = () => {
  showData.value = !showData.value;
};

const handleFilterData = (data) => {
  if (showData.value) {
    if (switchRate.value) {
      return data;
    } else {
      return formatPrice(
        symbolStore.value == "CNY"
          ? data / props.currentRate
          : data * props.currentRate
      );
    }
  }
  return "*****";
};
</script>

<style lang="scss" scoped>
.bg-account-section{
  background-image: url('/static/images/profile/account/bg.png');
  height: 408rpx;
  width: 100%;
}
</style>
