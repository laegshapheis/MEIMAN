<template>
  <layout navTitle="版本升级" bgType="bg-main"> 
    <view class="px-page-x py-page-y">
      <view class="py-[64rpx] text-center mx-auto flex flex-col items-center">
          <image
            class="w-[196rpx] h-[196rpx]"
            src="/static/images/index/up_app_logo.png"
            mode="widthFix"
          ></image>
        </view>

      <view class="text-center mb-[64rpx]">
        <text class="text-neutral text-2xl">请选择你的手机类型</text>
      </view>
      <view class="rounded-[16rpx] pt-[0rpx] pb-[24rpx]">
        <template v-for="item in links">
            <wk-button class="mb-[24rpx]" height="104rpx" v-if="linkObj[item.ua]" :key="item.name" @submit="download(item.ua)"
              borderRadius="720rpx"
              borderColor="transparent"
              backgroundColor="#FFFFFF"
              :plain="false"
            >
            <image
              class="w-[48rpx] h-[48rpx] mr-[24rpx]"
              :src="item.icon"
              mode="widthFix"
            />
            <text class="text-lg mr-[50rpx] text-black font-medium">{{ item.name}}</text>
            </wk-button>
        </template>
      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>
<script>
export default {
  data() {
    return {
      isDownloading: false,
      linkObj: {
        ios: false,
        android: false,
        huawei: false
      },
      links: [{
        name: '安卓手机下载',
        icon: '/static/images/index/az_icon.svg',
        ua: 'android'
      },
      {
        name: '华为手机下载',
        icon: '/static/images/index/hw_icon.svg',
        ua: 'huawei'
      },
    
      {
        name: '苹果手机下载',
        icon: '/static/images/index/ios.svg',
        ua: 'ios'
      },
    ],
      list:[],
      loading: false,
      loadingText: ''
    };
  },
  onLoad() {
    this.getDownloadUrl();
  },
  methods: {
    getDownloadUrl() {
      this.loading = true;
      this.loadingText = ''
      this.$requestApi({
        url: '/api/user/getAppDownloadList',
        method: 'post',
      }).then(res => {
       if(res.status == 0) {
        console.log(res);
        const list = res.list2 || [];
        this.list = list;
        this.isDownloading = true;
        list.forEach(item => {
          this.linkObj[item.os] = true;
        });
       };
       this.loading = false;
      });
    },
    download(ua) {
      // #ifdef APP-PLUS
      this.list.forEach(item => {
        if (item.os === ua) {
          console.log(item.url);
          plus.runtime.openURL(item.url);
        }
      });
      // #endif
      
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
