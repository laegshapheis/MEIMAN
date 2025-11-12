<template>
   <!-- 自定义背景 -->
   <!-- gradient 渐变背景 -->
   <!-- white 白色背景 -->
   <!-- theme 主题背景 -->
  <wk-container-bg :type="bgType"/>
  <z-paging ref="pagingRef"
    :refresher-theme-style="refresherThemeStyle"
    :refresher-enabled="refresher"
    :use-custom-refresher="true" 
    :use-refresher-status-bar-placeholder="true" 
    refresher-only
    @onRefresh="onRefresh"
    :loading-more-enabled="false"
    @scrolltolower="handleReachBottom"
    @scroll="handleScroll"
    :scrollToBottomBounceEnabled="true"
  >
    <template #top>
      <wk-nav-bar v-if="isNav" :background="navBgColor" @rightClick="handleNavRightClick" @leftClick="handleNavLeftClick" :title="navTitle" :color="mode == 'black' ? '#000' : mode == 'white' ? '#fff' : '#2A877C'">
        <template #left>
          <image  v-if="isNavLeftBack" class="w-[64rpx] h-[64rpx] bg-[#FFFFFF1A] rounded-full" :src="mode == 'black' ? '/static/images/common/black_back.svg' : mode == 'white' ? '/static/images/common/white_back.svg' : '/static/images/common/back.svg'" mode="widthFix"></image>
          <text v-else>
          </text>
        </template>
        <template v-slot:right>
          <slot name="navRight"/>
        </template>
      </wk-nav-bar>
      <view v-if="isShowStatusBar && !isNav" class="h-[var(--status-bar-height)] bg-transparent"></view>
       <!-- 内容区域 -->
       <view class="relative z-20">
        <!-- <uv-loading-page :loading="true" :loadingColor="$colors.theme" :color="$colors.theme" loading-text="加载中..." loading-mode="spinner" bgColor="transparent" font-size="24rpx"></uv-loading-page> -->
        <slot name="exp"></slot>
      </view>
    </template>
    <view :style="style">
      <slot></slot>
    </view>
  </z-paging>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { navigateBack } from '@/utils/navigation';

const props = defineProps({
  isShowStatusBar: {
    type: Boolean,
    default: true
  },
  refresherThemeStyle: {
    type: String,
    default: 'white'
  },
  // 是否使用默认的返回按钮
  isNavLeftBack: {
    type: Boolean,
    default: true
  },
  // 设置背景，颜色、图片、渐变
  background: {
    type: String,
    default: ''
  },
  navBgColor: {
    type: String,
    default: 'transparent'
  },
  // 头部导航title
  navTitle: {
    type: String,
    default: ''
  },
  // 是否设置头部导航
  isNav: {
    type: Boolean,
    default: true
  },
  // 内容区样式
  style: {
    type: Object,
    default() {
      return {
      }
    }
  },
  mode: {
    type: String,
    default: 'black'
  },
  // 设置背景类型
  bgType: {
    type: String,
    default: 'bg-neutral-grey'
  },
  // 是否使用默认的返回按钮
  isNavLeftBackClick: {
    type: Boolean,
    default: true
  },
  // 是否使用下拉刷新
  refresher: {
    type: Boolean,
    default: false
  }
});
const pagingRef = ref(null);
const dataList = ref([]);
const emit = defineEmits(['onScroll','navRightClick', 'navLeftClick', 'reachBottom', 'onRefresh']);
const handleNavRightClick = () => {
  emit('navRightClick')
}
const handleNavLeftClick = () => {
  if (props.isNavLeftBackClick) {
    navigateBack()
  } else {
    emit('navLeftClick')
  }
}

const complete = () => {
  pagingRef.value.complete();
}
const onRefresh = () => {
  emit('onRefresh');
};
const handleReachBottom = () => {
  emit('reachBottom');
};
const handleScroll = () => {
  emit('onScroll');
}
// 添加滚动到底部方法
const scrollToBottom = () => {
  pagingRef.value.scrollToBottom();
}

defineExpose({
  complete,
  scrollToBottom  // 暴露滚动到底部方法
});
</script>

<style lang="scss" scoped>
</style>
