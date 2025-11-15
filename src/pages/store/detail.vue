<template>
  <layout
    ref="layoutRef"
    navTitle="商品详情"
    bgType="bg-main"
    navBgColor="#FFFFFF"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <view class="min-h-[500rpx]">
      <swiper
        v-if="ispoto == 1"
        class="h-[100vw]"
        :circular="true"
        :indicator-dots="true"
        :autoplay="true"
        :interval="2000"
        :duration="500"
      >
        <swiper-item
          class="w-full h-full"
          v-for="(item, idx) in bannerList"
          :key="'no__l' + idx"
        >
          <image
            @click="preView(idx)"
            class="w-full h-full"
            :src="item"
            mode="scaleToFill"
          ></image>
        </swiper-item>
      </swiper>
    </view>
    <image
      v-if="ispoto == 0"
      class="w-full"
      :src="product_img"
      mode="widthFix"
    ></image>
    <view class="p-[32rpx] pb-[150rpx]">
      <wk-stroke-bg shadow class="flex flex-col rounded-[32rpx] p-[16rpx]">
        
        <view class="flex flex-row justify-between items-center">
          <view class="flex flex-row items-center">
            <text class="text-neutral-theme text-4xl font-semibold">{{
              re_points
            }}</text>
            <text class="text-base text-neutral-theme ml-[10rpx] mt-[15rpx]"
              >积分</text
            >
          </view>
          <view class="text-base text-neutral-regular"
            >我的积分：{{ my_points }}</view
          >
        </view>

        <view class="text-xl text-neutral font-medium mt-[33rpx]">{{ product_name }}</view>
      </wk-stroke-bg>
      <wk-stroke-bg shadow
        class="bg-white flex flex-row justify-between items-center p-[16rpx] mt-[24rpx] rounded-[32rpx]"
      >
        <view class="">兑换数量</view>
        <view class="flex flex-row items-center">
          <image
            class="w-[60rpx] h-[60rpx]"
            @click="count('-')"
            src="/static/images/store/reduce.svg"
          ></image>
          <view class="text-neutral text-3xl w-[150rpx] text-center">{{
            paySum
          }}</view>
          <image
            @click="count('+')"
            class="w-[60rpx] h-[60rpx]"
            src="/static/images/store/add.svg"
          ></image>
        </view>
      </wk-stroke-bg>
      <view class="mt-[48rpx]">
        <view class="text-neutral text-xl mb-[24rpx]"> 兑换规则 </view>
        <textarea
          class="text-neutral text-base leading-6 w-full"
          :value="ruleArea"
          auto-height="true"
          disabled="true"
        ></textarea>
      </view>
      <view class="mt-[48rpx]">
        <view class="text-neutral text-xl mb-[24rpx]"> 商品信息 </view>
        <view class="">
          <uv-parse
            space="nbsp"
            class="uni-rich-text"
            style="white-space: pre-wrap"
            :content="strings"
          ></uv-parse>
        </view>
      </view>
    </view>

    <view
      class="bg-neutral-bottomBtnBg fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx]"
    >
      <wk-button @submit="jumpToExchange"> 立即兑换 </wk-button>
    </view>
    <!-- <wk-loading v-if="loading" :loadingText="loadingText" /> -->
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getJfproductApi, getExchangelog as getExchangelogApi } from "@/api/index";
import { cacheManager } from "@/utils/cacheManager";
const product_img = ref("");
const ruleArea = ref("");
const strings = ref(``);
const product_name = ref("");
const my_points = ref("");
const re_points = ref("");
const paySum = ref(1);
const ispoto = ref("-1");
const bannerList = ref([]);
const product_id = ref("");
const loading = ref(false);
const loadingText = ref("");
const layoutRef = ref(null);
const type = ref(0);
// 生命周期钩子
onLoad((option) => {
  product_id.value = option.id;
  const cacheData = cacheManager.getCache("storeDetail" + product_id.value);
  if (cacheData) {
    handleCache(cacheData);
  }
  my_points.value = option.ji_fen;
  getJfproduct(product_id.value);
  getExchangelog();
});

// 刷新
const handleRefresh = () => {
  getJfproduct(product_id.value);
  getExchangelog();
};

// 图片预览
const preView = (idx) => {
  uni.previewImage({
    current: idx,
    urls: bannerList.value,
  });
};

const handleCache = (res) => {
  console.log(res, "res");
  product_img.value = res.product.image; //商品图片
  strings.value = res.product.content; //商品详情
  product_name.value = res.product.title; //商品名称
  re_points.value = res.product.integral; //所需积分
  ruleArea.value = res.ruleArea; //所需积分
  ispoto.value = res.product.ispoto;
  bannerList.value = res.product.photos;
  type.value = res.product.type;
  loading.value = false;
};
// 获取商品信息
const getJfproduct = async (id) => {
  loading.value = true;
  loadingText.value = "加载中...";
  const res = await getJfproductApi({
    id: id,
  });
  cacheManager.setCache("storeDetail" + id, res);
  handleCache(res);
  layoutRef.value.complete();
};

const getExchangelog = async () => {
  const res = await getExchangelogApi({});
  my_points.value = res.integral || 0;
};
// 跳转到兑换页面
const jumpToExchange = () => {
  if (paySum.value * re_points.value > my_points.value) {
    uni.$showToast({
      title: "可用积分不足",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  uni.navigateTo({
    url:
      "exchange?id=" +
      product_id.value +
      "&number=" +
      paySum.value +
      "&product_name=" +
      product_name.value +
      "&product_img=" +
      product_img.value +
      "&integral=" +
      re_points.value +
      "&type=" +
      type.value,
  });
};

// 数量加减
const count = (str) => {
  if (str == "-" && paySum.value > 1) {
    paySum.value--;
  }
  if (str == "+") {
    paySum.value++;
  }
};
</script>

<style lang="scss"></style>
