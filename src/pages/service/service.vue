<template>
  <view
    class="box_view"
    :style="{ height: divce_height + 'px', width: divce_widht + 'px', paddingTop: iStatusBarHeight + 'px' }"
  >
    <!-- Loading状态 -->
    <view v-if="loading" class="loading-container">
      <view class="loading-spinner"></view>
      <text class="loading-text">正在加载客服页面...</text>
    </view>
    
    <!-- Web-view内容 -->
    <view v-else class="webview-container" :style="{ height: fram_height - 56 + 'px', width: divce_widht + 'px' }">
      <web-view
        v-if="url"
        :update-title="false"
        webview-styles
        :fullscreen="true"
        :style="{ height: fram_height - 56 + 'px', width: divce_widht + 'px' }"
        :src="url"
      ></web-view>
    </view>
  </view>
</template>

<script>
import { getIssms } from "@/api/index";
import config from "@/config/index";

const { serviceUrls } = config;
export default {
  data() {
    return {
      url: "",
      loading: true, // 添加loading状态
      iStatusBarHeight: 0,
      divce_widht: 0,
      divce_height: 0,
      fram_height: 0,
    };
  },
  onShow() {
    this.setStyle();
    this.getIssms();
  },
  methods: {
    setStyle() {
      this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
      this.divce_widht = uni.getSystemInfoSync().screenWidth;
      this.divce_height = uni.getSystemInfoSync().screenHeight;
      this.fram_height = this.divce_height - this.iStatusBarHeight;
    },
    async getIssms() {
      this.loading = true; // 开始加载
      try {
        const res = await getIssms();
        if (res.status == 0) {
          this.url = res.links;
          this.loading = false; // 数据加载完成，隐藏loading
        } else {
          if (res.msg) {
            uni.$showToast({
              title: res.msg,
              icon: "none",
              duration: 3000,
            });
            this.loading = false; // 显示错误信息后隐藏loading
          } else {
            this.handleConfigUrl();
          }
        }
      } catch (err) {
        this.handleConfigUrl();
        console.log(err, "service");
      }
    },
    handleConfigUrl() {
      Promise.race(serviceUrls.map((url) => this.getCustomerServiceConfig(url)))
        .then((url) => {
          console.log(url);
          this.url = url;
          this.loading = false; // 配置URL获取成功，隐藏loading
        })
        .catch((err) => {
          uni.$showToast({
            title: "获取客服地址失败",
            icon: "none",
            duration: 3000,
          });
          this.loading = false; // 获取失败后隐藏loading
        });
    },
    getCustomerServiceConfig(url) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: url,
          method: "GET",
          timeout: 5000,
          success: (res) => {
            if (res.statusCode == 200 && res.data) {
              const data = res.data;
              resolve(data[0] || "");
            } else {
              reject("获取客服地址失败");
            }
          },
          fail: (err) => {
            reject(err);
          },
        });
      });
    },
  },
};
</script>

<style>
.status_bar {
  /* height: var(--status-bar-height); */
  /* width: 100px; */
  background-color: #fff;
}

.webview-container {
  width: 100%;
}

/* Loading样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>