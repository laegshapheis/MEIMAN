<template>
  <view class="grid grid-cols-4 gap-[24rpx] mt-[16rpx] text-white">
    <template v-for="item in menus" :key="item.icon_url">
      <view
        v-if="!item.switch || (item.switch && userInfo[item.switch])"
        class="relative flex flex-col items-center gap-[10rpx] py-[24rpx] rounded-[16rpx]"
        @click="$emit('onNavTo', item)"
      >
        <view>
          <image
            class="w-[112rpx] h-[112rpx]"
            :src="item.icon_url"
            mode="widthFix"
          />
        </view>
        <text class="text-white text-sm font-medium">{{ item.title }}</text>
      </view>
    </template>
  </view>
  <!-- 股权 -->
  <view
    v-if="isequity == 1"
    class="mt-[24rpx] rounded-[32rpx] bg-[#1A283D] flex flex-row justify-between 
    flex-grow items-center px-[24rpx] pl-[40rpx] h-[112rpx]"
    @click="goDetailHandle"
  >
    <view class="flex flex-row justify-center items-center">
      <image
        src="/static/images/profile/equity_center_icon.svg"
        class="w-[48rpx] h-[48rpx] mr-[10rpx]"
        mode="widthFix"
      />
      <text class="relative z-10 text-base font-medium text-white"
        >股权中心</text
      >
    </view>
    <view class="text-base flex flex-row items-center">
      <view class="text-white flex-shrink-0 text-base mr-[8rpx]"
        >今日股价:
      </view>
      <view
        class="text-[#FF050E] font-medium mt-[4rpx] flex-shrink-0 text-base"
        >{{ userInfo.quote }}</view
      >
      <image
        class="mt-[10rpx] w-[12rpx] h-[12rpx] ml-[8rpx]"
        src="/static/images/profile/gujia_r.svg"
        mode="widthFix"
      />
      <image
        class="w-[52rpx] h-[52rpx] ml-[8rpx]"
        src="/static/images/profile/gujia_i.svg"
        mode="widthFix"
      />
    </view>
  </view>

  <!-- 奖励 -->
   <!-- <view class="flex flex-row gap-[24rpx]">
    <view
      v-if="permissionStore.getPermission('task_module_switch')"
      style="
        border-radius: 12px;
        background: linear-gradient(46deg,#5493FF 30%, #B676FF 75.25%);
      "
      class="mt-[24rpx] relative overflow-hidden flex flex-row justify-between flex-grow items-center gap-[15rpx] px-[24rpx] pl-[40rpx] rounded-[16rpx] h-[112rpx]"
      @click="goTaskRewardsHandle"
    >
      <view class="flex flex-row justify-center items-center">
        <image 
          class="w-[38rpx] h-[38rpx] mr-[20rpx]"
          src="/static/images/profile/global_award.svg"
          mode="widthFix"
        />
        <text class="relative z-10 text-base font-medium text-white"
          >创世分红</text
        >
      </view>
      <view class="text-base flex flex-row items-center">
        <image
          class="w-[112rpx] h-[112rpx]"
          src="/static/images/profile/task_award.svg"
          mode="widthFix"
        />
      </view>
    </view>
   </view> -->
  
</template>

<script setup>
import { routes } from "@/config/routes";
import { ref } from "vue";
import { navigateTo } from "@/utils/navigation";

// 在组件内部定义投资和团队菜单
const menus = ref([
  {
    title: "转账",
    icon_url: "/static/images/profile/zhuan_menu_icon.svg",
    switch: "openzhuan",
    redirect: routes.transfer,
  },
  {
    title: "余额宝",
    icon_url: "/static/images/profile/yuebao_menu_icon.svg",
    switch: "isduodeli",
    redirect: routes.yuebao,
  },
  {
    title: "我的投资",
    icon_url: "/static/images/profile/my_product.svg",
    redirect: routes.invest,
  },
  {
    title: "我的团队",
    icon_url: "/static/images/profile/promo_icon.svg",
    redirect: routes.promoRecord,
  },
]);

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({}),
  },
  isequity: {
    type: Number,
    default: 0,
  },
  permissionStore: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(["onNavTo"]);

const goDetailHandle = () => {
  if (props.isequity == 1) {
    navigateTo(routes.equity);
  } else {
    uni.$showToast({
      title: "暂未开放，敬请期待",
      duration: 3000,
      icon: "none",
    });
  }
};

// 任务奖励点击处理
const goTaskRewardsHandle = () => {
  if (props.permissionStore.getPermission('task_module_switch') == 1) {
    navigateTo(routes.taskRewards);
  } else {
    uni.$showToast({
      title: "暂未开放，敬请期待",
      duration: 3000,
      icon: "none",
    });
  }
};

// 分红奖励点击处理
const goDividendRewardsHandle = () => {
  if (props.isequity == 1) {
    navigateTo(routes.taskRewards);
  } else {
    uni.$showToast({
      title: "暂未开放，敬请期待",
      duration: 3000,
      icon: "none",
    });
  }
};
</script>

<style lang="scss" scoped>
.section-bg {
  border: 2rpx solid rgba(255, 255, 255, 0.74);
  background: linear-gradient(97deg, #2fc39c -1.05%, #1fac1f 138.11%);
}
.q-bg {
  border: 2rpx solid rgba(255, 255, 255, 0.74);
  background: linear-gradient(90deg, #14cc95 0%, #00afda 100%);
}
</style>
