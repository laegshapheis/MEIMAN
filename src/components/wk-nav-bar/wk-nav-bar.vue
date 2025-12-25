<template>
  <uv-navbar :fixed="false" class="relative z-50" :title="title" :bgColor="background" :titleStyle="{color, fontSize, fontWeight: '600'}" @leftClick="handleLeftClick" @rightClick="handleRightClick">
    <!-- 自定义左侧返回 -->
    <template v-slot:left>
      <slot name="left"/>
    </template>
    <!-- 自定义中间内容 -->
    <template v-slot:center>
      <slot name="center">
        <text
          class="uv-line-1 uv-navbar__content__title"
          :style="[{
            width: '400rpx',
            flex: '0 1 auto'
          }, {color, fontSize, fontWeight: '600'}]"
        >{{ title }}</text>
      </slot>
    </template>
    <!-- 自定义右侧 -->
    <template v-slot:right>
      <slot name="right"/>
    </template>
  </uv-navbar>
</template>

<script setup>
import { defineProps, defineEmits, useAttrs } from 'vue';

const props = defineProps({
  background: {
    type: String,
    default: 'transparent',
  },
  title: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#fff'
  },
  fontSize: {
    type: String,
    default: '32rpx'
  }
});

const attrs = useAttrs();
const emit = defineEmits(['leftClick', 'rightClick']);
const handleRightClick = () => {
  emit('rightClick')
}
const handleLeftClick = () => {
  emit('leftClick')
}
  </script>

<style lang="scss">
</style>
