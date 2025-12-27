<template>
  <wk-stroke-bg shadow class="my-[24rpx]" mode="img-card3-big">
    <view class="text-xl font-bold text-neutral mb-[20rpx]">奖励规则</view>
    <view v-if="type == 'apply'" class="text-neutral-regular text-base">
      拼团成功奖励投资金额的<text class="text-neutral-theme ml-[10rpx] text-base"
        >{{ productview.joining }}%</text
      >
    </view>
    <view v-if="type == 'create'" class="flex flex-col">
      <view
        v-for="item in ruleList"
        :key="item.id"
        class="mb-[30rpx] flex flex-row items-center justify-between border-[length:1rpx] border-solid border-neutral-divider border-b-0 border-l-0 border-r-0 pt-[20rpx]"
      >
        <view class="">
          <view class="text-neutral text-lg">
            <text>参与人数</text>
            <text class="text-neutral-theme mx-[10rpx]"
              >{{ item.minnumber }}-{{ item.maxnumber }} </text
            >
            <text>人</text>
          </view>
          <view>
            <text class="text-neutral-regular text-base">奖励团员总投资金额的</text>
            <text class="text-neutral-theme ml-[10rpx]">{{ item.init }}%</text>
          </view>
        </view>
        <image
          src="/static/images/product/tuan_user.png"
          mode="widthFix"
          class="w-[160rpx]"
        />
      </view>
    </view>
  </wk-stroke-bg>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true,
  },
  productview: {
    type: Object,
    required: true,
  },
  ruleList: {
    type: Array,
    required: true,
  },
});
</script>
