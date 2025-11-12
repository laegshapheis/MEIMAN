<template>
  <layout
    ref="layoutRef"
    navTitle="认购详情"
    bgType="bg-main"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <productDetail
      :data="dataSource"
      :btnText="btnText"
      @onSubmit="handleSubmit"
      @onTimeFinish="onTimeFinish"
    />
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import productDetail from "./components/equity_detail/product_detail.vue";
import { getDetailsV2 } from "@/api/product";
import { routes } from "@/config/routes";
import { cacheManager } from "@/utils/cacheManager";
// 定义数据
const product_id = ref(""); // 产品ID
const dataSource = reactive({}); // 产品详情对象
const loading = ref(false);
const loadingText = ref('');
onLoad(({ id }) => {
  product_id.value = id;
  const cache = cacheManager.getCache('productDetail' + product_id.value)
  if (cache) {
    handleGetDetails(cache)
  } 
    getDetails()
});
const isTimeFinish = ref(false);
const onTimeFinish = () => {
  if (isTimeFinish.value) {
    return;
  }
  isTimeFinish.value = true;
  getDetails();
};
const btnText = computed(() => {
  return "立即认购";
});
const layoutRef = ref(null);
const handleRefresh = async () => {
  await getDetails();
  layoutRef.value.complete();
};
const handleSubmit = () => {
  
};

const handleGetDetails = (res) => {
  if (res.status == 0) {
    Object.assign(dataSource, res);
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
  loading.value = false;
}
const getDetails = async () => {
  loading.value = true;
  loadingText.value = '加载中...'
  const res = await getDetailsV2({ id: product_id.value });
  cacheManager.setCache('productDetail' + product_id.value, res)
  handleGetDetails(res)
};
</script>
<style lang="scss"></style>
