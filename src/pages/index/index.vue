<template>
  <layout
    :isNav="false"
    :refresher="true"
    ref="layoutRef"
    @onRefresh="handleRefresh"
    bgType="bg-main1"
    @onScroll="handleScroll"
  >
    <view class="pt-[16rpx] relative">
      <view>
        <view class="h-[var(--status-bar-height)] bg-transparent"></view>
        <home-header :isAuth="isAuth" class="px-[32rpx]" />
        <view class="flex flex-col items-start justify-start px-[32rpx] mt-[210rpx]">
          <image  src="/static/images/index/index_title.png" class="w-[314rpx] h-[74rpx]" mode="widthFix" />
          <view class="text-sm text-white my-[20rpx]">天空，不再只是风景，让我们飞越城市的下一个维度。</view>
        </view>

        <!-- 系统公告 -->
        <system-notice
          ref="noticeRef"
          :content="noticeContent"
          :noticeText="noticeText"
          :gujia="gujia"
          @open="handleOpenNotice"
        />

        <!-- 功能导航 -->
        <view
          :class="`flex flex-row items-center justify-between gap-2 rounded-32] mx-[32rpx] px-[32rpx] py-[24rpx] mb-[32rpx]`"
        >
          <template v-for="(item, index) in functionList" :key="index">
            <function-item
              v-if="!item.auth || hasPermission(item.auth)"
              :icon="item.icon"
              :title="item.title"
              :desc="item.desc"
              :path="item.path"
              :redirect="item.redirect || ''"
            />
          </template>
        </view>

        <!-- 视频卡片 -->
        <video-card
          ref="videoCardRef"
          v-if="isVideo == 1"
          :videoUrl="videoUrl"
          :posterUrl="posterUrl"
        />
        
        <!-- 轮播图 -->
        <swiper-banner v-else :bannerList="bannerList" />
        
        
        <!-- vip特权，拼团抢购，团队等级 -->
        <section-action
          :isAuth="isAuth"
          :list="sectionActionList"
          class="my-[16rpx] px-[32rpx]"
        />
        
      </view>
      
      <!-- 学堂，直播 -->
      <!-- <guide-section :isAuth="isAuth" class="mb-[32rpx]"/> -->
        <!-- 邀请好友 -->
        <view @click="goInvite" class="px-[32rpx] my-[32rpx]">
          <image
            src="/static/images/index/invite.png"
            class="w-full"
            mode="widthFix"
          />
        </view>
        <!-- 产品严选 -->
        <product-list
          v-if="productListInfo.length > 0"
          :list="productListInfo"
        />
        
        <!-- 新闻资讯 -->
        <news-section :newsList="newsList" class="pt-[32rpx] px-[32rpx]" />
      </view>
  </layout>
</template>

<script setup>
import productList from "./components/index/productList.vue";
import sectionAction from "./components/index/section_action_4.vue";
import homeHeader from "./components/index/homeHeader.vue";
import videoCard from "./components/index/video_card.vue";
import systemNotice from "./components/index/system_notice.vue";
import functionItem from "./components/index/function_item.vue";
import newsSection from "./components/index/news_section.vue";
import guideSection from "./components/index/guide-section.vue";
import { usePermissionStore } from "@/stores/permission";
import { ref, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";

import checkNetwork from "@/utils/checkNetWork";
import {
  getIndexData,
  getNewsList,
  getGuideList,
  getProductList,
} from "@/api/index";
import { routes } from "@/config/routes";
import { useAuth } from "@/hooks/useAuth";
import swiperBanner from "./components/index/swiper_banner.vue";

const { hasPermission, getPermission } = usePermissionStore();

const { authStatus, checkAuth } = useAuth();
const isVideo = ref(1);
const videoUrl = ref("");
const posterUrl = ref("");
const noticeContent = ref("");
const noticeText = ref("");
const noticeRef = ref(null);
const sectionActionList = ref([]);
const layoutRef = ref(null);
const gujia = ref({});
const isequity = ref(0);

// 功能列表，使用计算属性根据配置动态调整
const functionList = computed(() => {
  const list = [
    {
      path: routes.articleInfo + `?id=7`,
      icon: "/static/images/index/company.svg",
      title: "公司简介",
    },
    {
      path: routes.articleInfo + `?id=10`,
      icon: "/static/images/index/qianjing.svg",
      title: "行业前景",
    },
    {
      path: routes.articleInfo + `?id=64`,
      icon: "/static/images/index/baozhang.svg",
      title: "安全保障",
    },
  ];

  // 根据 website_switch 配置决定是否显示公司官网
  const websiteSwitch = getPermission("website_switch");
  if (websiteSwitch == 1) {
    list.splice(2, 0, {
      path: routes.website,
      icon: "/static/images/index/website.svg",
      title: "公司官网",
    });
  }

  return list;
});
const newsList = ref([]);
const productListInfo = ref([]);
const isschool = ref(0);
const isAuth = computed(() => {
  return authStatus.value == 1;
});

const bannerList = ref([]);

onShow(() => {
  usePermissionStore().fetchPermissions();
  init();
});
const videoCardRef = ref(null);
const handleScroll = () => {
  if (videoCardRef.value) {
    videoCardRef.value.pauseVideo();
  }
};

const goInvite = async () => {
  if (authStatus.value !== 1) {
    const stat = await checkAuth();
    if (stat !== 1) {
      return;
    }
  }
  uni.navigateTo({
    url: routes.inviteIndex,
  });
};

const handleOpenNotice = () => {
  videoCardRef.value.pauseVideo();
};
const init = () => {
  if (authStatus.value != 1) {
    checkAuth(false);
  }
  getIndexDataInfo();
  getNewsListInfo();
  // getXtlist();
  getProductListInfo();
};
const getXtlist = async () => {
  const res = await getGuideList();
  console.log(res);
  const data = res || [];
  sectionActionList.value = data.map((item) => item.arr[0]);
};
const getProductListInfo = async () => {
  const res = await getProductList({
    page: 1, //页码
    key: "",
    BID: "",
    id: "",
    sortid: 1,
  });
  if (res.status == 0) {
    productListInfo.value = res.list.data || [];
  }
};
const showGonggao = (res) => {
  // 如果不需要显示公告，直接返回
  if (res.isggao !== 1) return;

  // 获取存储的公告数据
  const gonggaoData = uni.getStorageSync("gonggao") || {};
  const appToken = uni.getStorageSync("app_token");

  // 构建新的公告数据
  const newGonggao = {
    token: appToken,
    id: res.gonggao.id,
    count: 1,
  };

  // 判断是否需要显示公告
  if (
    !gonggaoData.token || // 没有存储过
    gonggaoData.token !== appToken || // token不同
    gonggaoData.id !== res.gonggao.id || // 公告ID不同
    gonggaoData.count < res.gonggao.pop_count // 未达到显示次数上限
  ) {
    // 打开弹窗
    noticeRef.value.open();

    // 只有在token和id都相同时才增加计数
    if (gonggaoData.token === appToken && gonggaoData.id === res.gonggao.id) {
      newGonggao.count = gonggaoData.count + 1;
    }
    // 存储新的公告数据
    uni.setStorageSync("gonggao", newGonggao);
  }
};
const handleRefresh = async () => {
  await getIndexDataInfo();
  await getNewsListInfo();
  videoCardRef.value.pauseVideo();
  layoutRef.value.complete();
};

const getIndexDataInfo = () => {
  getIndexData().then((res) => {
    console.log(res);
    isVideo.value = res.isvideo;
    videoUrl.value = res.videourl;
    posterUrl.value = res.voidpic;
    gujia.value = res.gujia;
    isequity.value = res.isequity;
    isschool.value = res.isschool;
    bannerList.value = res.banner;
    noticeContent.value = res.gonggao.title;
    noticeText.value = res.gonggao.ccontent;
    showGonggao(res);
  });
};
const getNewsListInfo = () => {
  getNewsList({
    page: 1,
    pagesize: 30,
    sortid : 54,
    from : 'index', 
  }).then((res) => {
    console.log(res);
    newsList.value = res.articlescategory || [];
  });
};
</script>
<style lang="scss" scoped></style>
