<template>
  <layout navTitle="选择钱包" bgType="bg-main">  
    <template v-slot:navRight>
      <view class="flex flex-row w-full items-center justify-end" @click="navigateTo(routes.indexGuide)">
        <text class="text-base mr-[2rpx] text-neutral-theme">下载钱包</text>
        <text class="mr-[5rpx]"><uv-icon size="32rpx" color="#000000" name="question-circle"></uv-icon></text>
      </view>
    </template>


    <view class="px-[32rpx] pt-[44rpx] pb-[30rpx] box-border w-full flex flex-col">
      <view class="flex flex-row justify-center items-center mb-[48rpx]"> 
        <text class="text-3xl">请选择钱包品牌</text>
      </view>

      <view class="grid grid-flow-row-dense grid-cols-2 gap-[32rpx]">
        <view class="flex items-center h-[178rpx]  bg-[#FFFFFF] rounded-[16rpx]" v-for="(item, index) in dataList" :key="index"  @click="edit">
          <image :src="item" mode="widthFix" class="w-full h-full" />
        </view>
      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>


<script setup>
import { ref, reactive, watch } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { navigateTo } from "@/utils/navigation";
import { routes } from "@/config/routes";
import {
  getConfig as getConfigApi,
} from "@/api/index";


onLoad((options) => {


});

onShow(() => {
  getConfig();
});

const dataList = ref([])
const loading = ref(false);
const loadingText = ref('');

const getConfig = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = '加载中...'
  }

  try {
    const result = await getConfigApi();

    if (result.status && result.status != 0) {
      loading.value = false;
      return;
    }

    dataList.value = result.data.usdt_wallet_type;

    loading.value = false;
  } catch (e) {
    loading.value = false;
  }
}

const edit = (type) => {
  navigateTo(routes.walletEdit + '?type=usdt');
}

</script>


<style lang="scss" scoped>
</style> 