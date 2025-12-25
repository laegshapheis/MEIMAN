<template>
  <view v-if="productview.id" class="">
    <view v-if="productview.video_url" class="w-full mb-[24rpx]" style="aspect-ratio: 2/1;">
      <VideoCard ref="videoCardRef" :videoUrl="productview.video_url" :posterUrl="productview.pic"/>
    </view>
    <view class="px-[32rpx] box-border">
    <!-- 产品信息 -->
    <ProductDetailInfo :productview="productview"/>
    <!-- 投资相关 -->
    <ProductSections :data="data"/>
    <!-- 奖励规则 -->
    <RewardRules
      v-if="type == 'apply' || type == 'create'"
      :type="type"
      :productview="productview"
      :rule-list="rule_list"
    />
    <!-- 收益说明 -->
    <IncomeDescription
      :productview="productview"
    />

    <!-- 项目详情 -->
    <ProjectDetails
      :productview="productview"
    />

    <!-- 底部操作栏 -->
    <BottomAction
      :productview="productview"
      :type="type"
      :btn-text="btnText"
      @submit="handleSubmit"
      @finish="onTimeFinish"
    />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, defineExpose } from "vue";
import { routes } from "@/config/routes";
import RewardRules from './RewardRules.vue'
import ProductDetailInfo from './ProductDetailInfo.vue'
import ProductSections from './product-sections.vue'
import IncomeDescription from './IncomeDescription.vue'
import ProjectDetails from './ProjectDetails.vue'
import BottomAction from './BottomAction.vue'
import VideoCard from './video_card.vue'

const tabList = ref([
  {
    name: "项目详情",
    value: "detail",
  },
  {
    name: "产品介绍",
    value: "introduce",
  },
  {
    name: "收益说明",
    value: "income",
  },
]);
const tabCurrent = ref("detail");
const onTabsChange = (item) => {
  tabCurrent.value = item.value;
};
const videoCardRef = ref(null);
const handleScroll = () => {
  if (videoCardRef.value) {
    videoCardRef.value.pauseVideo();
  }
};

const emit = defineEmits(["onSubmit", "onTimeFinish"]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: "", // apply 参与拼团, create 发起拼团
  },
  btnText: {
    type: String,
    default: "",
  },
});
const productview = computed(() => props.data.productview || {});
const btnText = computed(() => {
  // 通用按钮提示
  if (productview.value.xmjd >= 100) {
    return "项目已投满";
  }
  if (productview.value.presale == 1) {
    return "暂未开放";
  }
  // 自定义外部按钮文字
  return props.btnText || "";
});
const rule_list = computed(() => {
  const groupcbl = productview.value.groupcbl;
  if (!groupcbl) {
    return [];
  }
  const obj = JSON.parse(groupcbl);
  return Object.keys(obj).map((key) => obj[key]);
});
const onTimeFinish = () => {
  emit("onTimeFinish");
};
const handleSubmit = () => {
  // 通用业务
  const productView = productview.value || {};
  if (productView.xmjd >= 100) {
    return;
  }
  if (productView.category_id == 101) {
    uni.navigateTo({
      url: routes.membershipLevel,
    });
    return;
  }
  if (productView.presale === 1) {
    uni.$showToast({
      title: "暂未开放",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  // 页面专有点击处理
  emit("onSubmit");
};
defineExpose({
  handleScroll,
});
</script>

<style lang="scss" scoped></style>
