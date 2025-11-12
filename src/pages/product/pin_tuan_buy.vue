<template>
	<layout ref="layoutRef" navTitle="我要投资" bgType="bg-main" :refresher="true" @onRefresh="handleRefresh">
    <template #navRight>
      <view @click="handleRuleShow" class="bg-white/20 flex flex-row items-center rounded-full px-[16rpx] py-[8rpx] pt-[5rpx]">
        <!-- <uv-icon name="error-circle" color="#010101" size="12"></uv-icon> -->
        <text class="text-black text-sm ml-[5rpx]">拼团规则</text>
      </view>
    </template>
		<productBuy ref="productBuyRef" :productId="id" :type="type" @onSubmit="handleSubmit"/>
	</layout>
</template>
<script setup>
import { ref } from 'vue';
import productBuy from './components/buy/product_buy.vue'
import { onLoad, onShow } from '@dcloudio/uni-app';
const id = ref('');
const type = ref("");
const productBuyRef = ref(null);
const layoutRef = ref(null);
onLoad((options) => {
  id.value = options.id;
  type.value = options.type;
});
onShow(() => {
  if (productBuyRef.value) {
    productBuyRef.value.getDetails();
  }
});
const handleRuleShow = () => {
  if (productBuyRef.value) {
    productBuyRef.value.handleRuleShow();
  }
};
const handleSubmit = () => {};
const handleRefresh = async () => {
  if (productBuyRef.value) {
    await productBuyRef.value.getDetails();
  }
  if (layoutRef.value) {
    layoutRef.value.complete();
  }
};
</script>
