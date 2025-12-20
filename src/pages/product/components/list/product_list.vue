<template>
  <view class="w-full px-[32rpx] box-border" v-if="list.length > 0">
    <wk-stroke-bg
      mode="img-card2-big"
      shadow
      class="rounded-[24rpx] pb-[32rpx] mb-[24rpx]"
      v-for="item in list"
      :key="item.id"
    >
      <view class="relative box-border">
        <!-- 产品信息 -->
        <ProductEquityInfo v-if="item.category_id == 32" :product="item" />
        <ProductInfo v-else :product="item" />
        <!-- 拼团按钮 -->
        <view
          v-if="item.category_id == 57"
          class="grid grid-cols-2 gap-x-[16rpx] mt-[40rpx]"
        >
          <wk-button
            style="
            background: #FFFFFF;"
            height="66rpx"
            :borderColor="$colors.theme"
            :color="$colors.DEFAULT"
            @submit="handleSubmit(item, 'apply')"
            backgroundColor="transparent"
            class="shadow-btn-bg rounded-[24rpx]"
          >
            <view class="flex flex-col items-center">
              <text class="text-base text-neutral-theme">参与拼团</text>
            </view>
            <view class="text-[28rpx]"></view>
          </wk-button>
          <wk-button
            height="66rpx"
            @submit="handleSubmit(item, 'create')"
          >
            <view class="text-base">发起拼团</view>
          </wk-button>
        </view>
        <!-- 立即投资按钮 -->
        <view v-else class="mt-[16rpx]">
          <wk-button 
            @submit="handleSubmit(item)"
            :backgroundColor="btnText(item) === '暂未开放' ? '#F5F8FD' : undefined"
            :color="btnText(item) === '暂未开放' ? 'rgba(37, 44, 47, 0.50)' : undefined"
          >
            {{ btnText(item) }}
          </wk-button>
        </view>
      </view>
    </wk-stroke-bg>
  </view>
  <Empty class="mt-[200rpx]" text="暂无数据" v-else />
</template>
<script setup>
import Empty from "@/components/base/empty.vue";
import ProductEquityInfo from "./ProductEquityInfo.vue";
import ProductInfo from "./ProductInfo.vue";
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: "", // group 拼团
  },
});

const emit = defineEmits(["onSubmit"]);

const handleSubmit = (item, type) => {
  emit("onSubmit", item, type);
};

// 根据项目状态显示按钮文字
const btnText = (item) => {
  // 预售状态
  if (item.presale === 1) {
    return "暂未开放";
  }
  // 已满额状态
  if (item.xmjd === 100) {
    return "配额已满";
  }

  if (item.is_rush_buy === 1) {
    return "立即抢购";
  }
  // 根据不同类别返回按钮文字
  const btnTextMap = {
    32: "立即认购",
  };

  return (
    btnTextMap[item.category_id] ||
    item.huodong_text ||
    item.present_level_text ||
    "立即投资"
  );
};
</script>

<style lang="scss" scoped>
.card-bg {
  border-radius: 16px;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  background: linear-gradient(128deg, #000 29.28%, #161e33 79.47%);
}
</style>
