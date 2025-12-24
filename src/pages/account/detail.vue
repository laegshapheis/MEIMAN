<template>
  <layout navTitle="账户详情" bgType="bg-main3" :isLottie="false" ref="layoutRef" :refresher="true"
    @onRefresh="handleRefresh">
    <template v-slot:navRight>
      <view class="flex flex-row items-center justify-center bg-white/10 rounded-full px-[16rpx] py-[8rpx]">
        <text class="text-base text-white" @click="jumpLogs">投资记录</text>
      </view>
    </template>

    <view class="p-[32rpx]">
      <view
        class="min-h-[200rpx] box-border flex flex-row justify-between items-center mb-[35rpx] rounded-[24rpx] bg-card3">
        <template v-for="item in topCardData" :key="item.key">
          <view class="flex flex-col items-center flex-1 flex-basis-0">
            <view class="text-base text-white/60">{{ item.label }}({{ symbolStore.code }})</view>
            <text class="text-2xl font-bold mt-2 whitespace-pre-wrap break-all text-white">{{ item.value }}</text>
          </view>
        </template>
      </view>

      <view class="min-h-[344rpx] box-border flex flex-col justify-between items-center bg-black px-[24rpx] pl-[64rpx] py-[48rpx] rounded-[32rpx] shadow-[0_0_16px_0_#266AFF_inset]">
        <template v-for="(row, index) in detailsData" :key="index">
          <view class="flex flex-row justify-between items-center flex-1 w-full relative">
            <template v-for="item in row" :key="item.key">
              <view class="flex flex-col flex-1 flex-basis-0 w-full" @click="handleItemClick(item)">
                <view class="flex flex-row items-center">
                  <view :class="[
                    'w-[16rpx] h-[16rpx] rounded-[8rpx] ml-[-16rpx] mr-[16rpx]',
                    item.color,
                  ]"></view>
                  <view class="flex flex-row">
                    <text class="text-base text-neutral-regular flex-1 font-medium">{{ item.label }}</text>
                    <uv-icon class="ml-[8rpx]" v-if="item.labelIcon" :name="item.labelIcon" size="13"
                      :color="$colors.regular"></uv-icon>
                  </view>
                </view>
                <view class="flex flex-row items-end mt-[10rpx] ml-[16rpx] leading-6">
                  <text class="text-lg text-neutral whitespace-pre-wrap break-all font-bold">{{ item.value }}</text>
                  <text class="text-sm text-neutral font-bold ml-[8rpx]">{{ item.unit }}</text>
                </view>
              </view>
            </template>
          </view>
          <view v-if="index !== detailsData.length - 1" class="bg-neutral-black/10 w-full h-[1rpx] my-[32rpx]"></view>
        </template>
      </view>

      <commonTips :color="$colors.tips" fontSize="28rpx" :content="data.mark" class="mt-[32rpx] px-[24rpx] leading-6">
      </commonTips>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { getMyAccountInfo } from "@/api/user";
import { routes } from "@/config/routes";
import commonTips from "@/components/base/common-tips.vue";
import { useSymbolStore } from "@/stores/symbolStore";
import { cacheManager } from "@/utils/cacheManager";
const cacheData = cacheManager.getCache("accountDetails");

const symbolStore = useSymbolStore();
const layoutRef = ref(null);
const data = ref({}); // 用于存储 API 返回的所有数据
const loading = ref(false);
const loadingText = ref('');
const topCardData = computed(() => [
  {
    key: "accountAmount",
    label: "投资余额",
    value: data.value.account_touzimoney,
  },
  {
    key: "acountTxmoney",
    label: "提现余额",
    value: data.value.account_txmoney,
  },
]);

const detailsData = computed(() => [
  [
    {
      key: "amount",
      label: "累计投资",
      value: data.value.amount,
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
    },
    {
      key: "zaitou",
      label: "在投金额",
      value: data.value.zaitou,
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
    },
  ],
  [
    {
      key: "withdrawals",
      label: "正在提现",
      value: data.value.withdrawals,
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
    },
    {
      key: "leijitixian",
      label: "累计提现",
      value: data.value.leijitixian,
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
    },
  ],
  [
    {
      key: "Dmoneys",
      label: "待收利息",
      value: data.value.Dmoneys,
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
    },
    {
      key: "Ymoneys",
      label: "已收利息",
      value: data.value.Ymoneys,
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
    },
  ],
  [
    {
      key: "integral",
      label: "可用积分",
      value: data.value.integral,
      color: "bg-[#B676FF]",
      unit: "分",
    },
    {
      key: "integral_used",
      label: "已用积分",
      value: data.value.integral_used,
      color: "bg-[#B676FF]",
      unit: "分",
    },
  ],
  [
    {
      key: "leiji_recharge",
      label: "累计充值",
      value: data.value.leiji_recharge,
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
    },
    {
      key: "leijimoney",
      label: "累计收益",
      value: data.value.leijimoney,
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
    },
  ],
  [
    {
      key: "yuebao",
      label: "余额宝余额",
      value: data.value.yuebao,
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
    },
    {
      key: "dai_kuan",
      label: "余额宝收益",
      value: data.value.yuebao_profit,
      color: "bg-[#B676FF]",
      labelIcon: "arrow-right",
      unit: symbolStore.code,
      onClick: () => {
        uni.navigateTo({
          url: routes.accountRecord + "?type=yuebao_profit",
        });
      },
    },
  ],
  [
    {
      key: "jiangli_amount",
      label: `奖励与收益到投资余额`,
      value: data.value.jiangli_amount,
      labelIcon: "arrow-right",
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
      onClick: () => {
        uni.navigateTo({
          url: routes.accountRecord + "?type=jiangli_amount",
        });
      },
    },
  ],
  [
    {
      key: "jiangli_tixian",
      label: `奖励与收益到提现余额`,
      labelIcon: "arrow-right",
      value: data.value.jiangli_tixian,
      color: "bg-[#B676FF]",
      unit: symbolStore.code,
      onClick: () => {
        uni.navigateTo({
          url: routes.accountRecord + "?type=jiangli_tixian",
        });
      },
    },
  ],
]);

const handleItemClick = (item) => {
  if (item.onClick) {
    item.onClick();
  }
};

const handleRefresh = async () => {
  await getMyInfo();
  layoutRef.value.complete();
};

const jumpLogs = () => {
  uni.navigateTo({
    url: routes.invest,
  });
};

const getMyInfo = async () => {
  loading.value = true;
  loadingText.value = '加载中...'
  const res = await getMyAccountInfo();
  console.log(res);
  data.value = res.data; // 直接使用 API 返回的数据
  loading.value = false;
  cacheManager.setCache("accountDetails", res);
};
onLoad(() => {
  if (cacheData) {
    data.value = cacheData.data;
  }
  getMyInfo();
});
</script>

<style lang="scss" scoped></style>
