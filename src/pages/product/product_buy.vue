<template>
  <layout
    navTitle="我要投资"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    bgType="bg-main"
  >
    <productBuy :productId="id" ref="productBuyRef" />
  </layout>
</template>
<script setup>
import { ref } from "vue";
import productBuy from "./components/buy/product_buy.vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
const id = ref("");
const productBuyRef = ref(null);
const layoutRef = ref(null);
onLoad((options) => {
  id.value = options.id;
});
onShow(() => {
  if (productBuyRef.value) {
    productBuyRef.value.getDetails();
  }
});
const handleRefresh = async () => {
  if (productBuyRef.value) {
    await productBuyRef.value.getDetails();
    layoutRef.value.complete();
  }
};
</script>
