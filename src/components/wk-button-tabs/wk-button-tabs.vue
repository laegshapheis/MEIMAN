<template>
  <view class="p-[2rpx]" style="border-radius: 360rpx;border: 1px solid rgba(255, 255, 255, 0.25);">
    <uv-tabs
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
      borderRadius: '360rpx',
      border: '2px solid rgba(255, 255, 255, 0.50)',
      background: '#1930FF',
      boxShadow: '0 12px 12px 2px rgba(41, 157, 246, 0.59) inset',
      color: '#fff',
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
      color: regularColor,
      fontSize: '32rpx',
      textAlign: 'center',
      ...inactiveStyle
    }"
    :list="list"
    :scrollable="scrollable"
    :lineColor="'transparent'"
    :lineHeight="0"
    :lineWidth="0"
    :showBottomBorder="false"
    @change="handleChange"
    :current="current"
  />
  </view>
  
</template>

<script setup>
import { neutral } from '@/config/colors'

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
    default: ''
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

// 获取常规字体颜色
const regularColor = neutral.regular

// tab切换事件
const handleChange = (item) => {
  emit('change', item)
}
</script>

<style lang="scss" scoped>
</style>
