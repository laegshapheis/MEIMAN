<template>
	<view class="fixed inset-0 bg-black" v-if="isLottie">
		<!-- <c-lottie style="transform: translate3d(0, 0, 0); will-change: transform;" v-if="isLottie" ref="lottieRef" renderer="svg" :data="selectedLottieData" :loop="true" :autoPlay="true" width="750rpx" height="1624rpx"></c-lottie> -->
		 <image  :src="bgImage" mode="widthFix" class="fixed inset-0 w-full h-full"></image>

	</view>
	<view v-else :class="['fixed inset-0', bgColor]">
	</view>
</template>

<script setup>
import { defineProps, computed, ref, onBeforeUnmount, onMounted, nextTick } from 'vue';
import lottieData from '@/static/lottie/bg.json';
import lottieDataEasy from '@/static/lottie/bg_easy.json';
import bgImage from '@/static/gif/bg.png';

const isIOS = uni.getSystemInfoSync().platform === 'ios';
const selectedLottieData = isIOS ? lottieDataEasy : lottieData;

const props = defineProps({
	type: {
		type: String,
		default: 'bg-neutral-grey'
	},
	isLottie: {
		type: Boolean,
		default: true
	}
})

const lottieRef = ref(null)
const bgColor = computed(() => props.type);

const pauseLottie = () => {
	if ( props.isLottie && lottieRef.value) {
		lottieRef.value.call('pause')
	}
}

const playLottie = () => {
	if ( props.isLottie && lottieRef.value) {
		lottieRef.value.call('play')
	}
}
onMounted(() => {
	console.log('page lottie onMounted')
	// if (props.isLottie && lottieRef.value) {
	// 	nextTick(() => {
	// 		lottieRef.value.call('setSpeed', 0.7)
	// 	})
	// }
})

onBeforeUnmount(() => {
	console.log('page lottie onBeforeUnmount')
  if (props.isLottie && lottieRef.value) {
    lottieRef.value.call('destroy')
	lottieRef.value = null
  }
})

defineExpose({
	pauseLottie,
	playLottie
})

</script>