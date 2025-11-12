<template>
  <view
    class="rounded-[32rpx] border-[length: 1rpx] border border-solid border-[#FFFFFF]/20 bg-account-section"
  >
    <!-- 账户信息 -->
    <view>
      <view
        class="px-[32rpx] py-[24rpx]"
      >
        <view class="flex flex-row items-center justify-between w-full">
          <text class="text-lg mr-[16rpx] text-white">我的账户</text>
          <view @click="handleShowData">
            <uv-icon
              v-if="showData"
              name="eye"
              color="#fff"
              size="38rpx"
            ></uv-icon>
            <uv-icon
              v-else
              name="eye-off-outline"
              color="#fff"
              size="38rpx"
            ></uv-icon>
          </view>
        </view>
      </view>
      <view class="w-full h-[1rpx] bg-[#FFF]/20"></view>
      <!-- 汇率信息 -->
       <view style="backdrop-filter: blur(8px);background: rgba(0, 0, 0, 0.50);">
        <view
        v-if="openCards > 0"
        class="px-[32rpx] py-[16rpx] relative flex flex-row items-center justify-center text-base text-[#9AEEDE]"
      >
        <view class="flex flex-row justify-center items-center">
          <text>实时汇率</text>
          <text class="ml-[16rpx]"
            >1 {{ symbolStore.exchangeUsdtLabel }} = {{ currentRate }} CNY</text
          >
          <image
            @click="handleSwitchRate"
            src="/static/images/profile/switch.svg"
            mode="widthFix"
            class="ml-[16rpx] w-[24rpx] h-[24rpx]"
          ></image>
        </view>
      </view>

      <view class="w-full h-[1rpx] bg-[#FFF]/20"></view>

      <!-- 账户信息 -->
      <view class="relative">
        <view class="gap-[8rpx] break-all">
          <view class="grid grid-flow-row-dense grid-cols-2 ">
            <!-- 投资余额 -->
            <view
              class=" flex flex-col py-[24rpx] min-w-[250rpx] box-border pl-[32rpx]"
            >
              <view
                class="flex flex-row items-center"
                @click="$emit('onTips', 0)"
              >
                <text class="text-sm text-white mb-[4rpx]">可用余额({{ symbol }})</text>
                <text class="ml-[5rpx]"
                  ><uv-icon
                    size="24rpx"
                    color="rgba(255, 255, 255, 0.60)"
                    name="question-circle"
                  ></uv-icon
                ></text>
              </view>
              <view class="text-2xl font-semibold text-white">
                <text>{{ handleFilterData(userInfo.touzimoney) }}</text>
              </view>
            </view>
            <!-- 提现余额 -->
            <view
              class="pl-[32rpx] flex flex-col py-[24rpx] min-w-[250rpx] box-border"
            >
              <view
                class="flex flex-row items-center"
                @click="$emit('onTips', 1)"
              >
                <text class="text-sm text-white mb-[4rpx]">提现余额({{ symbol }})</text>
                <text class="ml-[5rpx]"
                  ><uv-icon
                    size="24rpx"
                    color="rgba(255, 255, 255, 0.60)"
                    name="question-circle"
                  ></uv-icon
                ></text>
              </view>
              <view class="text-2xl font-semibold text-white">
                <text>{{ handleFilterData(userInfo.txmoney) }}</text>
              </view>
            </view>
          </view>
        <view class="grid grid-flow-row-dense grid-cols-2">
            <!-- 累计收益 -->
            <view
              class="pl-[32rpx] flex flex-col py-[24rpx] min-w-[250rpx] box-border"
            >
              <view
                class="flex flex-row items-center"
                @click="$emit('onTips', 4)"
              >
                <text class="text-sm text-white mb-[4rpx]">累计收益({{ symbol }})</text>
                <text class="text-sm ml-[5rpx]"
                  ><uv-icon
                    size="24rpx"
                    color="rgba(255, 255, 255, 0.60)"
                    name="question-circle"
                  ></uv-icon
                ></text>
              </view>
              <view class="text-2xl font-semibold text-white">
                <text>{{ handleFilterData(userInfo.leijimoney) }}</text>
              </view>
            </view>
            <!-- 任务质押 -->
            <view
              class="pl-[32rpx] flex flex-col py-[24rpx] min-w-[250rpx] box-border"
              v-if="userInfo.lockmoney > 0"
            >
              <view
                class="flex flex-row items-center"
                @click="$emit('onTips', 999)"
              >
                <text class="text-sm text-white mb-[4rpx]">任务质押({{ symbol }})</text>
                <text class="ml-[5rpx]"
                  ><uv-icon
                    size="24rpx"
                    color="rgba(255, 255, 255, 0.60)"
                    name="question-circle"
                  ></uv-icon
                ></text>
              </view>
              <view class="text-2xl font-semibold break-all text-white">
                <text>{{ handleFilterData(userInfo.lockmoney) }}</text>
              </view>
            </view>
            <!-- 我的积分 -->
            <view
              v-else
              class="pl-[32rpx] flex flex-col py-[24rpx] min-w-[250rpx] box-border"
            >
              <view
                class="flex flex-row items-center"
                @click="$emit('onTips', 5)"
              >
                <text class="text-sm text-white mb-[4rpx]">我的积分</text>
                <text class="ml-[5rpx]"
                  ><uv-icon
                    size="24rpx"
                    color="rgba(255, 255, 255, 0.60)"
                    name="question-circle"
                  ></uv-icon
                ></text>
              </view>
              <view class="text-2xl font-semibold text-white">
                <text v-if="showData">{{ userInfo.integral }}</text>
                <text v-else>*****</text>
              </view>
            </view>
          </view>
          <view class="w-full h-[1rpx] bg-[#FFF]/20"></view>
        </view>
      </view>
       </view>
      
    </view>
    <!-- 充值菜单 -->
    <view class="rounded-[8rpx] grid grid-cols-2 gap-[16rpx] p-[24rpx]">
      <template v-for="item in menus" :key="item.icon_url">
        <view
          @click="$emit('onNavTo', item)"
          class="flex flex-row justify-center items-center"
          v-if="!item.switch || (item.switch && userInfo[item.switch])"
        >
          <image
            class="w-[40rpx] h-[40rpx] relative z-0"
            :src="item.icon_url"
            mode="widthFix"
          ></image>
          <text
            class="text-white font-medium relative z-1 text-base ml-[16rpx]"
            >{{ item.title }}</text
          >
        </view>
      </template>
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

<style lang="scss" scoped></style>
