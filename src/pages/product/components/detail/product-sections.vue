<template>
  <wk-stroke-bg shadow class="mt-[24rpx]" v-if="hasContent" mode="img-card3-big">
    <view class="mb-[20rpx]">
      <image src="/static/images/product/touzixiangguan.png" class="w-full" mode="widthFix"/>
    </view>
    <template v-for="section in sections" :key="section.title">
      <view
        class="flex flex-col items-start w-full py-[24rpx] border-0 border-solid border-b border-neutral-divider"
        v-if="data[section.key] && data[section.key].length > 0"
      >
        <view class="text-base text-neutral-theme font-semibold flex flex-row items-center">
          <view class="w-[6rpx] h-[28rpx] bg-neutral-theme mr-[8rpx]"></view>{{
          section.title
        }}</view>
        <view class="flex flex-col ml-[10rpx] w-full flex-1 flex-wrap">
          <view v-for="(val, index) in data[section.key]" :key="val" class="flex flex-row items-start">
            <text v-if="!section.noIndex" :class="[
                'text-base mr-[10rpx] leading-6',
                section.color ||'text-neutral',
              ]">{{ index + 1 }}. </text>
            <text
              :class="[
                'text-base leading-6',
                section.color || 'text-neutral',
              ]"
              >{{ val }}</text
            >
          </view>
        </view>
      </view>
    </template>
  </wk-stroke-bg>
</template>

<script setup>
import { computed, ref, watch } from "vue";
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const sections = [
  { title: "投资注意", key: "attention_tag_list", color: "text-neutral-error" },
  { title: "投资要求", key: "demand_tag_list" },
  { title: "特殊福利", key: "special_tag_list" },
  { title: "支持使用", key: "supportuse" },
  { title: "投资赠送", key: "investgift" },
  { title: "推广奖励", key: "allreward" },
  { title: "补充说明", key: "jiangli_remark", color: "text-neutral-error", noIndex: true },
  { title: "发起要求", key: "group_demand_tag_list" },
];
const modalContent = ref("");
const modalRef = ref(null);
const handleClick = () => {
  modalContent.value = props.data.productview.jiangli_remark;
  modalRef.value.open();
};

watch(
  () => props.data.productview,
  (newVal) => {
    props.data.jiangli_remark = newVal.jiangli_remark
      ? [newVal.jiangli_remark]
      : [];
  },
  { immediate: true, deep: true }
);
const hasContent = computed(() => {
  return sections.some(
    (section) => props.data[section.key] && props.data[section.key].length > 0
  );
});
</script>
