<template>
  <wk-tabs
    :class="className"
    :itemStyle="{
      padding: '10rpx',
      ...itemStyle
    }"
    :activeStyle="{
      padding: '0 24rpx',
      height: '60rpx',
      width: '100%',
      lineHeight: '60rpx',
      borderRadius: '16rpx',
      border: 'none',
      background: $colors.theme,
      backgroundClip: 'none',
      WebkitBackgroundClip: 'none',
      WebkitTextFillColor: 'none',
      color: '#000',
      fontSize: '32rpx',
      textAlign: 'center',
      fontWeight: '400',
      ...activeStyle
    }"
    :inactiveStyle="{
      padding: '0 8rpx',
      height: '60rpx',
      width: '100%',
      lineHeight: '60rpx',
      borderRadius: '0rpx',
      borderColor: '#fff',
      border: 'none',
      backgroundColor: 'transparent',
      color: $colors.regular,
      fontSize: '32rpx',
      textAlign: 'center',
      ...inactiveStyle
    }"
    :list="list"
    :isButton="true"
    :scrollable="scrollable"
    @change="handleChange"
    :current="current"
  />
</template>

<script setup>
const props = defineProps({
  // 当前选中项
  current: {
    type: Number,
    default: 0
  },
  // 是否为按钮样式
  isButton: {
    type: Boolean,
    default: true
  },
  // 外部类名
  className: {
    type: String,
    default: 'bg-white/10 rounded-[8rpx] border border-black/10 border-solid'
  },
  // tab列表数据
  list: {
    type: Array,
    default: () => []
  },
  // 是否可滚动
  scrollable: {
    type: Boolean,
    default: true
  },
  // item样式
  itemStyle: {
    type: Object,
    default: () => ({})
  },
  // 激活样式
  activeStyle: {
    type: Object,
    default: () => ({})
  },
  // 未激活样式
  inactiveStyle: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['change'])

// tab切换事件
const handleChange = (item) => {
  emit('change', item)
}
</script>

<style lang="scss" scoped>
</style>
