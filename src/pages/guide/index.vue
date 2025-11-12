<template>
  <layout
    :isNav="isShowNav"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="知识学堂"
    bgType="bg-main" 
    
  >
    <view class="flex flex-col w-full h-full absolute overflow-hidden">
      <view class="mx-[32rpx] my-[24rpx]">
        <wk-tabs
          :list="data.tabList"
          :isButton="true"
          @change="changeType"
          :itemStyle="{
            padding: '0rpx 12rpx',
            flex:'initial',
            fontWeight: 'normal',
          }"

          :activeStyle="{
            fontWeight: 'normal',
          }"
        />
      </view>

      <scroll-view
        scroll-y
        class="overflow-auto flex-1 bg-[#F5F8FD] py-[32rpx] pb-[30rpx] w-full flex flex-col rounded-t-[32rpx] box-border"
      >
        <view class="flex flex-col">
          <wk-stroke-bg
            shadow
            v-for="item in data.list[data.current].arr"
            :key="item.id"
            @click="openUrl(item)"
            class="rounded-[24rpx] flex flex-col items-start justify-between mb-[24rpx] mx-[32rpx] px-[32rpx] box-border border-[length:1rpx] border-solid border-neutral-inputBorder"
          >
            <view class="flex flex-row items-center">
              <image
                class="w-[40rpx] h-[40rpx] mr-[15rpx]"
                src="/static/images/index/content_icon.png"
                mode="widthFix"
              >
              </image>
              <text class="text-lg text-neutral">{{ item.name }}</text>
            </view>
            <view class="w-full mt-[32rpx]">
              <wk-button
                @click="openUrl(item)"
                class="w-full"
                size="small"
                plain
                type="primary"
              >
                <text class="text-base">查看详情</text>
              </wk-button>
            </view>
            
            <!-- <view class="flex flex-row items-center p-[18rpx] rounded-full bg-[#0C052F]">
              <uv-icon
                size="24rpx"
                name="arrow-right"
                color="#FFFFFF"
              ></uv-icon>
            </view> -->
          </wk-stroke-bg>
        </view>
      </scroll-view>
    </view>

    <video
      id="myVideo"
      :class="
        data.videoPlayUrl == '' ? 'video_pl_bbn close_btn_d' : 'video_pl_bbn'
      "
      :src="data.videoPlayUrl"
      :autoplay="true"
      :loop="true"
      :controls="true"
      :show-fullscreen-btn="false"
    ></video>
    <cover-view
      @click="stopVideo"
      :class="[
        'mt-[48rpx]',
        data.videoPlayUrl == '' ? 'close_btn close_btn_d' : 'close_btn',
      ]"
      >
      <cover-view @click="stopVideo">关闭</cover-view>
    </cover-view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, watch } from "vue";
import {
  onLoad,
  onShow,
  onReachBottom,
  onPullDownRefresh,
} from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateTo } from "@/utils/navigation";
import CommonTips from "@/components/base/common-tips";
import Empty from "@/components/base/empty";
import { formatPrice } from "@/utils/utils";
import { getGuideList as getGuideListApi } from "@/api/index";
import { usePageData } from "@/hooks/usePageData";

const page = ref(1);
const dataList = ref([]);

const layoutRef = ref(null);

const symbolStore = useSymbolStore();

const pullType = ref("");
const type = ref("");
const isShowNav = ref(true);
const loadingText = ref('加载中...')
let videoContext = null;
const { loading, initData, refresh } = usePageData({
  cacheKey: 'guideList',
  fetchFunction: () => getGuideListApi({
    type: type.value,
    page: page.value,
  }),
  immediate: true, // 是否立即执行
  onSuccess(data) {
    getList(data);
    layoutRef.value && layoutRef.value.complete();
    console.log("测试", data);
  },
  onError: (error) => {
    console.log("测试", error);
  },
});

const handleRefresh = () => {
  refresh();
}

onLoad((options) => {
  initData();
  videoContext = uni.createVideoContext("myVideo");
});



const data = reactive({
  videoPlayUrl: "",
  tabList: [],
  list: [[{ arr: [] }]],
  current: 0,
});
const stopVideo = () => {
  videoContext.stop();
  data.videoPlayUrl = "";
  isShowNav.value = true;
};
const getList = async (result) => {
  // if (showLoading) {
  //   loading.value = true;
  //   loadingText.value = '加载中...'
  // }

  // const result = await getGuideListApi({
  //   type: type.value,
  //   page: page.value,
  // });


  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });

    return;
  }

  data.tabList = result.map((item, index) => {
    return { name: item.name, id: index };
  });

  data.list = result;
  data.current = 0;

  console.log("测试", result);

  loading.value = false;
};

const changeType = (e) => {
  data.current = e.id;
};

const openUrl = (obj) => {
  if (obj.url.endsWith(".mp4")) {
    data.videoPlayUrl = obj.url;
    videoContext.play();
    isShowNav.value = false;
    // console.log("播放视频")
  } else if (obj.url.includes("new_details")) {
    uni.navigateTo({
      // url: "../about/new_details?id=" + obj.id,
      url: obj.url,
    });
  } else {
    // console.log("打开链接")
    // #ifdef APP-PLUS
    plus.runtime.openURL(obj.url);
    // #endif
    // #ifdef H5
    window.open(obj.url);
    // #endif
  }
};
</script>

<style lang="scss" scoped>
.uni-scroll-view-content > uni-view > uni-view {
  justify-content: space-between !important;
}

:deep .fui-scroll__view {
  justify-content: space-between;
}

// 新增样式-视频播放
.video_box_play_oi {
  position: fixed;
  top: -150%;
  left: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: #000;
  padding-top: calc(var(--status-bar-height));
  z-index: 999;
}

.oi_show {
  top: 0;
}

.video_pl_bbn {
  width: 100%;
  height: calc(100% - var(--status-bar-height));
  position: fixed;
  top: var(--status-bar-height);
  left: 0;
  box-sizing: border-box;
  background-color: #000;
  z-index: 5;
}

.close_btn {
  padding: 15rpx;
  display: flex;
  flex-direction: row;
  font-size: 28rpx;
  align-items: center;
  text-align: center;
  position: fixed;
  right: 32rpx;
  background-color: #4D585B;
  border-radius: 16rpx;
  color: #fff;
  z-index: 9;
}

.close_btn_d {
  top: -150%;
}
</style>
