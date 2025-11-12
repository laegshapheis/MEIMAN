<template>
  <view
    class="box_view"
    :style="{ height: divce_height + 'px', width: divce_widht + 'px' }"
  >
    <web-view
      :update-title="false"
      webview-styles
      :fullscreen="false"
      :style="{ height: divce_height + 'px', width: divce_widht + 'px' }"
      :src="url"
    ></web-view>
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
      try {
        const res = await getIssms();
        if (res.status == 0) {
          this.url = res.links;
        } else {
          if (res.msg) {
            uni.$showToast({
              title: res.msg,
              icon: "none",
              duration: 3000,
            });
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
        })
        .catch((err) => {
          uni.$showToast({
            title: "获取客服地址失败",
            icon: "none",
            duration: 3000,
          });
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
</style>