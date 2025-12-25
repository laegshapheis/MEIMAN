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
          class="grid grid-cols-2 gap-x-[16rpx] mt-[16rpx]"
        >
          <wk-button
            @submit="handleSubmit(item, 'apply')"
            :customStyle="{
              background: 'url(/static/images/product/pintuan_btn1.png) center/100% 100% no-repeat'
            }"
          >
              参与拼团
          </wk-button>
          <wk-button
            @submit="handleSubmit(item, 'create')"
            :customStyle="{
              background: 'url(/static/images/product/pintuan_btn2.png) center/100% 100% no-repeat'
            }"
          >
              发起拼团
          </wk-button>
        </view>
        <!-- 立即投资按钮 -->
        <view v-else class="mt-[16rpx]">
          <wk-button 
            @submit="handleSubmit(item)"
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

// 确保 grid 中的按钮高度一致
.grid > :deep(.wk-button-wrapper) {
  display: block;
}

// 确保所有按钮使用相同的高度（wk-button 默认 small size 是 72rpx）
:deep(.wk-button-wrapper .uv-button) {
  height: 72rpx !important;
  // 确保背景图片正确填充按钮高度
  background-size: 100% 100% !important;
}
</style>
