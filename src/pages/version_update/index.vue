<template>
  <layout navTitle="版本升级" bgType="bg-main4" :isLottie="false">
    <view class="px-page-x py-page-y">
      <view class="py-[80rpx] flex flex-col justify-between">
        <view class="text-center mx-auto flex flex-col items-center">
          <image
            class="w-[196rpx] h-[196rpx]"
            src="/static/images/index/up_app_logo.png"
            mode="widthFix"
          ></image>
        </view>
        <view class="flex flex-col items-center mt-[50rpx]">
          <view class="text-neutral text-lg text-center mt-[10rpx]">
            <text class="">当前版本：</text>
            <text>
              {{ self_app_version }}
            </text>
          </view>
          <view class="text-white/60 text-sm text-center mt-[10rpx]">
            <text class="">最新版本：</text>
            <text>
              {{ new_app_version }}
            </text>
          </view>
        </view>
      </view>
      <view class="flex flex-col justify-end">
        <view class="flex flex-col items-center w-full justify-center">
          <wk-button
            v-if="app_upgrade_1_switch == 1"
            class="flex-1 w-full text-xl font-medium mb-[15rpx]"
            height="80rpx"
            fontSize="30rpx"
            @submit="onlineUpApp"
          >
            APP在线升级
          </wk-button>
          <wk-button
            :borderColor="$colors.theme"
            height="80rpx"
            fontSize="30rpx"
            class="flex-1 text-lg font-medium w-full"
            v-if="!online_up && app_upgrade_2_switch == 1"
            @submit="openDownloadApp"
          >
            重新下载APP
          </wk-button>
        </view>
        <view v-if="online_up && app_upgrade_1_switch == 1">
          <fui-progress
            :percent="wgt_per"
            height="20"
            radius="8"
            :showInfo="true"
            size="34rpx"
            :color="$colors.theme"
            background="rgba(10, 125, 254, 0.20)"
            :activeColor="$colors.theme"
          ></fui-progress>
          <view class="text-center text-sm text-neutral-error"
            >APP正在升级中...(请勿进行其他操作)</view
          >
        </view>
      </view>
      <view class="mt-[48rpx] p-[32rpx] text-base text-white/80 bg-[#0C052F] leading-6 border-[length:1rpx] border-solid border-neutral-divider rounded-[48rpx]" v-if="up_app_tip">
        <common-tips :content="up_app_tip" :color="'rgba(255,255,255,0.8)'"></common-tips>
      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script>
import { getUpapp } from "@/api/index";
import { routes } from "@/config/routes";
import commonTips from '../../components/base/common-tips.vue';
export default {
  components: { commonTips },
  data() {
    return {
      self_app_version: "加载中...", //当前版本
      new_app_version: "加载中...", //当前版本
      online_up: false, //在线升级
      wgt_per: 0, //热更新下载进度
      app_wgt_url: "", //热更新下载地址
      app_apk_url: "", //下载地址
      up_app_tip: "", //更新提示
      loading: false,
      loadingText: "",
      app_upgrade_1_switch: 0,
      app_upgrade_2_switch: 0,
    };
  },
  onLoad() {
    let ths = this;
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
      ths.self_app_version = widgetInfo.version;
    });
    // #endif
    this.handleGetUpapp();
  },
  methods: {
    async handleGetUpapp() {
      this.loading = true;
      this.loadingText = "加载中...";
      const res = await getUpapp();
      console.log(res);
      this.loading = false;
      if (res.status == 0) {
        this.up_app_tip = res.app.hot_up_content;
        this.new_app_version = res.app.app_new_version;
        this.app_apk_url = res.app.app_new_down_url;
        this.app_wgt_url = res.app.hot_up_domain;
        this.app_upgrade_1_switch = res.app.app_upgrade_1_switch;
        this.app_upgrade_2_switch = res.app.app_upgrade_2_switch;
      }
    },
    onlineUpApp() {
      if (this.self_app_version === this.new_app_version) {
        uni.$showModal({
          showCancel: false,
          content: "当前已是最新版本",
        });
        return;
      }
      let ths = this;
      ths.online_up = true;
      let downloadTask = uni.downloadFile({
        url: ths.app_wgt_url,
        success: (downloadResult) => {
          if (downloadResult.statusCode === 200) {
            plus.runtime.install(
              downloadResult.tempFilePath,
              {
                force: false,
              },
              function () {
                console.log("热更新成功！");
                plus.runtime.restart();
              },
              function (e) {
                console.log("热更新失败！");
              }
            );
          } else {
            if (ths.app_upgrade_2_switch == 1) {
              uni.$showModal({
                showCancel: false,
                content: "升级资源包异常！请重新下载APP",
                success: () => {
                  ths.online_up = false;
                  ths.openDownloadApp();
                },
              });
            }
          }
        },
        fail: (error) => {
          console.log(error);
        },
      });
      // 监听下载进度
      downloadTask.onProgressUpdate(function (res) {
        // 进度百分比
        ths.wgt_per = Math.floor(res.progress);
      });
    },
    openDownloadApp() {
      uni.navigateTo({ url: routes.versionUpdate });
    },
  },
};
</script>

<style lang="scss" scoped></style>
