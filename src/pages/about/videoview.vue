<template>
  <layout :navTitle="title" bgType="bg-main"  ref="layoutRef" :refresher="true" @onRefresh="handleRefresh" @reachBottom="getPaginationList">

    <view class="px-[32rpx] pt-[24rpx] pb-[30rpx] box-border w-full flex flex-col">
     
      <!-- 视频播放器 -->
      <view class="video_box w-full mb-[40rpx] rounded-[32rpx]" 
        :style="{
          background: '#12478D',
        }"
         v-for="item in dataList" 
        :key="item.id"
      >
        <video
          :id="'video-' + item.id" 
          class="video"
          :src="item.url"
          :poster="item.thumb_url"
          :autoplay="false"
          :muted="false"
          :loop="true"
          :controls="true"
          objectFit="cover"
          v-if="playVideoState[item.id]"
        ></video>
        <image v-else :src="item.thumb_url" mode="scaleToFill" class="w-full aspect-video"></image>
        <view
          @click="playVideo(item.id)"
          v-if="!playVideoState[item.id]"
          class="top_pop_win"
        >
          <uv-icon name="/static/images/video_play_icon.png" color="#fff" size="40"></uv-icon>
        </view>
      </view>

      
      <Empty v-if="dataList.length == 0"></Empty>
    </view>
    <wk-loading v-if="loading" />
  </layout>
</template>

<script setup>

import { ref, reactive, watch } from "vue";
import { onLoad, onShow, onReachBottom, onPullDownRefresh } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateTo } from "@/utils/navigation";

import { setImageWidth } from "@/utils/utils"

import CommonTips from "@/components/base/common-tips";
import Empty from "@/components/base/empty";

import { formatPrice } from "@/utils/utils";

import { getAdList as getAdListApi } from "@/api/index";

const page = ref(1);
const dataList = ref([]);

const layoutRef = ref(null);
const title = ref('')
const lock = ref(false)
const loading = ref(false)
const pullType = ref("");
const loadFinish = ref(false)
onLoad((options) => {

  getList();
});

const handleRefresh = () => {
  pullType.value = "down";
  loadFinish.value = false;
  page.value = 1;

  dataList.value = [];
  getList()
}

// 上拉加载
onReachBottom(() => {
  if (loadFinish.value) return ;

  getPaginationList()
});

const getPaginationList = () => {
  if (loadFinish.value) return ;
  if (lock.value) return ;
  pullType.value = "up";

  console.log('up');

  page.value++;

  getList();
}


const getList = async (showLoading = true) => {
  if (lock.value) return ;
  lock.value = true;

  if (showLoading) {
    loading.value = true;
  }

  try {
    const result = await getAdListApi({
      type: 'video',
      page : page.value,
    });

    lock.value = false;

    layoutRef.value.complete();

    if (result.status && result.status != 0) {
      loading.value = false;
      uni.$showToast({
        title: result.msg,
        duration: 3000,
        icon: "none",
      });

      return;
    }

    dataList.value = dataList.value.concat(result.data.list)
    title.value = result.data.title

    if (page.value >= result.data.pagination.total_page) {
      loadFinish.value = true
    }

    console.log(result)

    loading.value = false;
  } catch (e) {
    layoutRef.value.complete();
    loading.value = false;
  }
}


const videoContext = ref(null)
const playVideoState = ref({})
const currentId = ref(null)
//播放视频用的
const playVideo = (id) => {
  if (currentId.value) {
    if (videoContext.value) videoContext.value.pause();
    playVideoState.value[currentId.value] = false;
  }
  

  currentId.value = id;
  videoContext.value = uni.createVideoContext("video-" + id);
  playVideoState.value[id] = true;
  

  setTimeout(function () {
    videoContext.value.play();
  }, 300);
}


</script>

<style lang="scss">
 .top_pop_win {
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    z-index: 3;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .video {
    width: 100%;
    height: 100%;
    display: block;
  }

.video_box {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%;
  overflow: hidden;

  .video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover; 
  }
}

</style>