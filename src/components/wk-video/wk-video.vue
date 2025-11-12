<template>
  <view>
    <ls-dom-video ref="videoRef" @pause="pause" v-if="isIos" v-bind="$attrs"></ls-dom-video>
    <video id="videoId" @pause="pause" v-else v-bind="$attrs"></video>
  </view>
</template>
<script setup>
import lsDomVideo from '../ls-dom-video/ls-dom-video.vue';
import { ref, onMounted } from 'vue';

const isIos = ref(true);

const emit = defineEmits(['play', 'pause']);

const videoRef = ref(null);
const videoDom = ref(null);
const play = () => {
  emit('play');
  onPlay();
};

const pause = () => {
  emit('pause');
  onPause();
};

const onPlay = () => {
  if (isIos.value) {
    videoRef.value.play();
  } else {
    videoDom.value.play();
  }
};

const onPause = () => {
  if (isIos.value) {
    videoRef.value.pause();
  } else {
    videoDom.value.pause();
  }
};

onMounted(() => {
  isIos.value = uni.getSystemInfoSync().platform === 'ios';
  if (!isIos.value) {
    videoDom.value = uni.createVideoContext('videoId');
  } 
});

defineExpose({
  play,
  pause
});
</script>
