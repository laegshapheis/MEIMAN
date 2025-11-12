<template>
  <layout
    ref="layoutRef"
    navTitle="投资详情"
    bgType="bg-main"
    :refresher="true"
    @onRefresh="handleRefresh"
    @onScroll="handleScroll"
  >
    <productDetail
      ref="productDetailRef"
      :data="dataSource"
      :btnText="btnText"
      @onSubmit="handleSubmit"
      @onTimeFinish="onTimeFinish"
    />
    <!-- <wk-loading v-if="loading" :loadingText="loadingText" /> -->
  </layout>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import productDetail from "./components/detail/product_detail.vue";
import { getDetailsV2 } from "@/api/product";
import { routes } from "@/config/routes";
import { cacheManager } from "@/utils/cacheManager";
// 定义数据
const product_id = ref(""); // 产品ID
const dataSource = reactive({}); // 产品详情对象
const productview = computed(() => dataSource.productview || {});
const loading = ref(false);
const loadingText = ref('');
const productDetailRef = ref(null);
onLoad(({ id }) => {
  product_id.value = id;
  const cacheData = cacheManager.getCache('productDetail' + product_id.value)
  if (cacheData) {
    handleCache(cacheData)
  }
  getDetails();
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
  if (
    productview.value.invite_min_count > 0 &&
    !dataSource.reach_invite_min_count
  ) {
    return `新增一级有效人数起始计算时间：${productview.value.huodong_start_at}`;
  }

  if (productview.value.is_rush_buy === 1) {
    return '立即抢购'
  }
  
  return productview.value.present_level_text || productview.value.huodong_text || "立即投资";
});
const layoutRef = ref(null);
const handleRefresh = async () => {
  await getDetails();
  layoutRef.value.complete();
};
const handleSubmit = () => {
  if (
    productview.value.invite_min_count > 0 &&
    !dataSource.reach_invite_min_count
  ) {
    uni.$showModal({
      title: "提示",
      showCancel: false,
      content: `抱歉！您的一级会员必须在 ${productview.value.huodong_start_at} 之后首次投资的才算有效，每新增${productview.value.invite_min_count}人即可再投资1次`,
      success: () => {},
    });

    return;
  }
  if (productview.value.present_level_text) {
    uni.$showToast({
      title: productview.value.present_level_text,
      icon: "none",
      duration: 3000,
    });
    return;
  }
  if (productview.value.huodong_text) {
    uni.$showToast({
      title: productview.value.huodong_text,
      icon: "none",
      duration: 3000,
    });
    return;
  }
  if (productview.value.required_product_text) {
    uni.$showModal({
      showCancel: false,
      content: productview.value.required_product_text,
      success: () => {},
    });
    return;
  }
  uni.navigateTo({
    url: routes.productBuy + "?id=" + productview.value.id,
  });
};
const handleCache = (res) => {
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
  console.log(res);
  cacheManager.setCache('productDetail' + product_id.value, res)
  handleCache(res)
};
const handleScroll = () => {
  if (productDetailRef.value) {
    productDetailRef.value.handleScroll();
  }
};
</script>
<style lang="scss"></style>
