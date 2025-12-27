<template>
  <layout
    ref="layoutRef"
    navTitle="拼团详情"
    bgType="bg-main"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <template #navRight>
      <view @click="showModal" class="flex flex-row items-center px-[16rpx] py-[8rpx] pt-[5rpx]">
        <!-- <uv-icon name="error-circle" color="#010101" size="12"></uv-icon> -->
        <text class="text-white text-sm whitespace-nowrap ml-[5rpx]">拼团规则</text>
      </view>
    </template>
    <!-- 拼团规则 -->
    <wk-modal ref="modalRef" title="拼团规则">
      <text>{{ dataSource.grouprules }}</text>
    </wk-modal>
    <productDetail
      :data="dataSource"
      :type="type"
      @onSubmit="handleSubmit"
      :btnText="btnText"
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
const modalRef = ref(null); // 拼团规则弹窗
const dataSource = reactive({}); // 产品详情对象
const type = ref(""); // 类型
onLoad((options) => {
  type.value = options.type;
  product_id.value = options.id;
  const cacheData = cacheManager.getCache('productGroupDetail' + product_id.value)
  if (cacheData) {
    handleCache(cacheData)
  }
  getDetails();
});
const layoutRef = ref(null);
const loading = ref(false);
const loadingText = ref('');
const handleRefresh = async () => {
  await getDetails();
  layoutRef.value.complete();
};
const btnText = computed(() => {
  if (type.value == "apply") {
    return "参与拼团";
  } else {
    return "发起拼团";
  }
});
const showModal = () => {
  modalRef.value.open();
};
const handleSubmit = () => {
  uni.navigateTo({
    url: `${routes.pinTuanBuy}?id=${product_id.value}&type=${type.value}`,
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
  cacheManager.setCache('productGroupDetail' + product_id.value, res);
  handleCache(res);
};
</script>
<style lang="scss"></style>

