<template>
  <!-- 自定义背景 -->
  <!-- gradient 渐变背景 -->
  <!-- white 白色背景 -->
  <!-- theme 主题背景 -->
 <wk-container-bg ref="containerBgRef" :type="bgType" :isLottie="isLottie" />
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
     <wk-nav-bar v-if="isNav" :background="navBgColor" @rightClick="handleNavRightClick" @leftClick="handleNavLeftClick" :title="navTitle" :color="mode == 'black' ? '#000' : '#fff'">
       <template #left>
         <image  v-if="isNavLeftBack" class="w-[80rpx] h-[80rpx]" :src="mode == 'black' ? '/static/images/common/black_back.svg' : '/static/images/common/back.svg'" mode="widthFix"></image>
         <text v-else>
         </text>
       </template>
       <template v-slot:right>
         <slot name="navRight"/>
       </template>
     </wk-nav-bar>
     <view v-else class="h-[var(--status-bar-height)] bg-transparent"></view>
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
 <!-- 全局提示 -->
 <wk-modal ref="layoutModalRef" :title="modalOptions.title" :showClose="modalOptions.showCancel">
   <view class="flex h-[200rpx] mb-[24rpx] justify-center items-center">
     <text>{{ modalOptions.content }}</text>
   </view>
   <wk-button v-if="modalOptions.showConfirm" @submit="confirmSaveCode">{{ modalOptions.confirmText }}</wk-button>
 </wk-modal>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, onBeforeUnmount } from 'vue';
import { navigateBack } from '@/utils/navigation';
import modalManager from '@/utils/modal-manager';
import lottieManager from '@/utils/lottie-manager';

const props = defineProps({
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
   default: 'white'
 },
 // 设置背景类型
 bgType: {
   type: String,
   default: 'bg-neutral-grey'
 },
 isLottie : {
   type: Boolean,
   default: true
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
const containerBgRef = ref(null);
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
const layoutModalRef = ref(null);
const modalOptions = ref({
 title: '提示',
 content: '',
 success: null,
 showConfirm: true,
 confirmText: '确定',
 showCancel: false,
});
const confirmSaveCode = () => {
 modalOptions.value.success && (modalOptions.value.success({
   confirm: true
 }) || hideModal());
}
const showModal = (options = {}) => {
 modalOptions.value = {
   ...modalOptions.value,
   ...options
 };
 layoutModalRef.value && layoutModalRef.value.open()
}
const hideModal = () => {
 layoutModalRef.value && layoutModalRef.value.close()
}

let pageId = '';
onMounted(() => {
 // 获取当前页面实例
 const pages = getCurrentPages();
 console.log('pages', pages)
 const currentPage = pages[pages.length - 1];
 pageId = currentPage.route || currentPage.__route__;
 // 注册该页面的lottie实例到全局管理器
 lottieManager.registerLottie(pageId, containerBgRef.value);
 // 注册该页面的modal实例到全局管理器
 modalManager.registerModal(pageId, showModal);
 
 // 暴露全局hideModal方法
 uni.$hideModal = hideModal;
})

onBeforeUnmount(() => {
 // 注销该页面的lottie实例到全局管理器
 lottieManager.unregisterLottie(pageId);
 // 注销该页面的modal实例到全局管理器
 modalManager.unregisterModal(pageId);
})

const pauseLottie = () => {
 containerBgRef.value && containerBgRef.value.pauseLottie();
}
const playLottie = () => {
 containerBgRef.value && containerBgRef.value.playLottie();
}

defineExpose({
 showModal,
 hideModal,
 complete,
 scrollToBottom,
 pauseLottie,
 playLottie
});
</script>

<style lang="scss" scoped>
</style>
