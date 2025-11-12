<template>
  <view class="flex flex-col">
    <text class="text-neutral-regular text-base leading-6" :style="{ color: color }">{{content}}</text>
  </view>
</template>
<script setup>
import { defineProps } from 'vue';
import { neutral } from '@/config/colors';
const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: neutral.regular
  }
});
</script>