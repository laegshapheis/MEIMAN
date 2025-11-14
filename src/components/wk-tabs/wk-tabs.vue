<template>
  <view>
    <!-- 常规模式 -->
    <uv-tabs
      v-if="!isButton"
      :customStyle="customStyle"
      :itemStyle="itemStyle"
      :lineColor="lineColor"
      :lineHeight="lineHeight"
      :lineFullWidth="lineFullWidth"
      :list="list"
      :activeColor="activeColor"
      :showBottomBorder="false"
      :bottomBorderColor="bottomBorderColor"
      :inactiveColor="inactiveColor"
      :activeStyle="{
        fontSize: '32rpx',
        color: '#FFFFFF',
        fontWeight: '600',
        ...props.activeStyle,
      }"
      :inactiveStyle="{
        fontSize: '32rpx',
        color: 'rgba(37, 44, 47, 0.75)',
        ...props.inactiveStyle,
      }"
      :current="current"
      @change="handleChange"
      v-bind="attrs"
    >
    </uv-tabs>

    <!-- 按钮模式 -->
    <uv-tabs
      v-else
      class="button-mode"
      :itemStyle="buttonItemStyle"
      lineColor="transparent"
      :activeStyle="computedActiveStyle"
      :inactiveStyle="computedInactiveStyle"
      :list="list"
      :current="current"
      @change="handleChange"
      v-bind="attrs"
    >
    </uv-tabs>
  </view>
</template>

<script setup>
import { ref, computed, watch, useAttrs, getCurrentInstance } from "vue";
const current = ref(0);
const attrs = useAttrs();
const props = defineProps({
  bottomBorderColor: {
    type: String,
    default: '#010101',
  },
  itemStyle: {
    type: Object,
    default: () => ({
      fontSize: "32rpx",
      height: "76rpx",
      minWidth: "150rpx",
    }),
  },
  defaultIndex: {
    type: Number,
    default: 0,
  },
  list: {
    type: Array,
    default: () => [],
  },
  // 是否使用按钮模式
  isButton: {
    type: Boolean,
    default: false,
  },
  // 常规模式的样式配置
  customStyle: {
    type: Object,
    default: () => ({
      fontSize: "32rpx",
      fontWeight: "semibold",
    }),
  },
  lineColor: {
    type: String,
    default: '#010101',
  },
  lineHeight: {
    type: String,
    default: "76rpx",
  },
  lineFullWidth: {
    type: Boolean,
    default: true,
  },
  activeColor: {
    type: String,
    default: "#252628",
  },
  inactiveColor: {
    type: String,
    default: "rgba(37, 44, 47, 0.75)",
  },
  // 按钮模式激活状态样式
  activeStyle: {
    type: Object,
    default: () => ({}),
  },
  // 按钮模式未激活状态样式
  inactiveStyle: {
    type: Object,
    default: () => ({}),
  },
});

const { proxy } = getCurrentInstance();
const $colors = proxy.$colors;

const emit = defineEmits(["change"]);

const handleChange = (item) => {
  const index = props.list.findIndex((i) => i.id === item.id);
  current.value = index;
  emit("change", item, index);
};
watch(
  () => props.defaultIndex,
  (newVal) => {
    current.value = newVal;
  },
  { immediate: true }
);
// 计算按钮模式激活状态的样式
const computedActiveStyle = computed(() => ({
  padding: "8rpx 24rpx",
  borderRadius: "100rpx",
  fontSize: "28rpx",
  color: "#fff",
  // border: "4rpx solid #252628",
  fontWeight: "bold",
  backgroundColor: "#06F",
  ...props.activeStyle,
}));

// 计算按钮模式未激活状态的样式
const computedInactiveStyle = computed(() => ({
  borderRadius: "100rpx",
  padding: "8rpx 24rpx",
  fontSize: "28rpx",
  color: "#252C2F",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  border: "1px solid #00000010",
  ...props.inactiveStyle,
}));

const buttonItemStyle = computed(() => ({
  padding: "0 8rpx",
  ...props.itemStyle,
  minWidth: "auto",
}));
</script>
<style lang="scss" scoped>
:deep(.uv-tabs__wrapper__nav__item) {
  z-index: 10;
}
:deep(.uv-tabs__wrapper__nav__line) {
  height: 100%;
  border-radius: 0;
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
}
:deep(.uv-tabs__wrapper__nav) {
  border-bottom: 2px solid #010101;
}

:deep(.button-mode .uv-tabs__wrapper__nav) {
  border-bottom: none;
}
</style>