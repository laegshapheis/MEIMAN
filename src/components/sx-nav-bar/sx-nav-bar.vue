<template>
  <fui-sticky>
    <view class="fui-header" :style="theme == 'black' ? 'background-image: none;background-color: #F0F3F5;' : 'background-image: url('+bgImg+');'">
      <!-- 透明单词：transparent -->
      <fui-nav-bar :title="title" :background="background" :color="theme == 'black' ? '#000' : '#fff'" @leftClick="$backWithAnim" @rightClick="handleRightClick">
        <template v-slot:right>
          <slot name="right"/>
        </template>
      </fui-nav-bar>
			<slot name="exp"></slot>
    </view>
  </fui-sticky>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
  background: {
    type: String,
    default: 'transparent',
  },
  title: {
    type: String,
    default: ''
  },
	theme:{
    type: String,
    default: 'white'
  },
	bgImg: {
	  type: String,
	}
});
const emit = defineEmits(['rightClick']);
const handleRightClick = () => {
  emit('rightClick')
}

</script>

<style lang="scss">
// 返回按钮大小设置
.fui-nav-bar-bank{
	width: 48rpx;
	height: 48rpx;
}
.fui-header{
	background-repeat: no-repeat;
	background-position: top center;
	background-size: 100% auto;
}
</style>
