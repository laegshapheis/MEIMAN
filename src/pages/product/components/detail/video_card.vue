<template>
  <view class="flex flex-col items-center justify-center relative aspect-video overflow-hidden">
    <!-- ios使用html播放， 安卓使用video原生播放 -->
    <wk-video
      ref="videoId"
      class="w-full h-full aspect-video"
      :src="videoUrl"
      :autoplay="false"
      :muted="false"
      :loop="true"
      objectFit="contain"
      :controls="true"
      :show-center-play-btn="false"
      @pause="handlePauseVideo"
      v-show="!isShowingPoster"
    />
    <view v-if="isShowingPoster" class="absolute inset-0 overflow-hidden">
      <image
        :src="posterUrl"
        class="w-full h-full object-cover aspect-video absolute inset-0"
        mode="aspectFill"
      />
      <view
        class="w-full h-full absolute inset-0 flex items-center justify-center bg-black/50 aspect-video"
      >
      <image
        @click="handlePlayVideo"
        class="w-[120rpx] h-[120rpx] absolute"
        src="/static/images/index/video_play.png"
        mode="widthFix"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'

const props = defineProps({
  videoUrl: {
    type: String,
    required: true
  },
  posterUrl: {
    type: String,
    required: true
  },
})

const videoId = ref(null)
const isIos = ref(true)
const isShowingPoster = ref(true)

const handlePlayVideo = () => {
  isShowingPoster.value = false
  videoId.value.play()
}

const pauseVideo = () => {
  videoId.value.pause()
}
const handlePauseVideo = () => {
  isShowingPoster.value = true
}

onMounted(() => {
  isIos.value = uni.getSystemInfoSync().platform === 'ios'
  console.log(isIos.value)
})

defineExpose({
  pauseVideo
})
</script>

<style lang="scss" scoped>  
</style>
