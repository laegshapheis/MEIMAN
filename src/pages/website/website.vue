<template>
  <layout
    :isNav="true"
    :refresher="false"
    navTitle="公司官网"
    :isShowStatusBar="false"
    bgType="bg-white"
    mode="black"
  >
    <!-- Loading状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在加载官网页面...</text>
    </view>
    
    <!-- Web-view内容 -->
    <view v-else class="webview-container" :style="{ height: webviewHeight + 'px' }">
      <web-view
        :update-title="false"
        :webview-styles="webviewStyles"
        :style="{ height: webviewHeight + 'px', width: '100%' }"
        :src="url"
      ></web-view>
    </view>
  </layout>
</template>

<script>
import { getConfig } from "@/api/index";

export default {
  data() {
    return {
      url: "",
      loading: true, // 添加loading状态
      webviewHeight: 0,
      webviewStyles: {
        progress: {
          color: '#007aff'
        }
      },
    };
  },
  onShow() {
    this.setStyle();
    this.getWebsiteUrl();
  },
  mounted() {
    this.setStyle();
  },
  methods: {
    setStyle() {
      this.$nextTick(() => {
        const systemInfo = uni.getSystemInfoSync();
        // 计算webview高度：使用窗口可用高度
        // 导航栏高度约为 44px (状态栏) + 44px (导航栏) = 88px
        this.webviewHeight = systemInfo.windowHeight || (systemInfo.screenHeight - systemInfo.statusBarHeight - 88);
      });
    },
    async getWebsiteUrl() {
      this.loading = true; // 开始加载
      try {
        const res = await getConfig();
        if (res && res.data) {
          const websiteUrl = res.data.website_url;
          if (websiteUrl) {
            this.url = websiteUrl;
            this.loading = false; // 数据加载完成，隐藏loading
          } else {
            uni.$showToast({
              title: "官网地址未配置",
              icon: "none",
              duration: 3000,
            });
            this.loading = false;
          }
        } else {
          uni.$showToast({
            title: "获取官网地址失败",
            icon: "none",
            duration: 3000,
          });
          this.loading = false;
        }
      } catch (err) {
        console.log(err, "website");
        uni.$showToast({
          title: "获取官网地址失败",
          icon: "none",
          duration: 3000,
        });
        this.loading = false;
      }
    },
  },
};
</script>

<style>
/* Loading样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  background-color: #f5f5f5;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top: 3px solid #007aff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

.webview-container {
  width: 100%;
  position: relative;
  overflow: hidden;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

