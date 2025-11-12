<template>
  <layout
    ref="layoutRef"
    navTitle="贷款记录"
    bgType="bg-main"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <view class="px-[32rpx] mt-[28rpx]" v-if="list.length > 0">
      <wk-stroke-bg
        shadow
        class="mb-[24rpx] rounded-[32rpx]"
        v-for="item in list"
        size="none"
        :key="item.bianhao"
      >
        <view
          class="flex flex-row items-center justify-between py-[32rpx] px-[32rpx]"
        >
          <view class="text-base text-neutral-regular"
            >合同编号：{{ item.bianhao }}</view
          >
          <view class="text-base text-neutral font-medium">
            <view
              :class="
                item.status == 0
                  ? 'text-neutral'
                  : item.status == 1
                  ? 'text-neutral-theme'
                  : item.status == 2
                  ? 'text-neutral-warning'
                  : ''
              "
            >
              {{
                item.status == 0
                  ? "已还款"
                  : item.status == 1
                  ? "使用中"
                  : item.status == 2
                  ? "待还款"
                  : ""
              }}</view
            >
          </view>
        </view>

        <view class="flex flex-row h-[1rpx] bg-neutral-divider"></view>

        <view class="flex flex-col py-[16rpx] px-[32rpx]">
          <view class="flex flex-col">
            <view class="text-base text-neutral">贷款金额</view>
            <view class="text-2xl text-neutral font-bold mt-[12rpx]"
              >{{ item.number }} {{ symbolStore.code }}</view
            >
          </view>

          <view class="flex flex-col pt-[24rpx]">
            <text class="text-neutral-regular text-base"
              >贷款时间：{{ item.created_at }}</text
            >
            <text class="text-neutral-regular text-base mt-[16rpx]"
              >还款时间：{{ item.updated_at }}</text
            >
          </view>
        </view>

        <view
          v-if="item.status != 0"
          class="flex flex-row items-center px-[32rpx] py-[32rpx] justify-between gap-[16rpx] border border-solid border-neutral-divider border-b-0 border-l-0 border-r-0"
        >
          <wk-button
            class="flex-grow"
            :borderColor="$colors.theme"
            backgroundColor="transparent"
            :color="$colors.theme"
            shadow=""
            fontWeight="normal"
            size="small"
            borderRadius="16rpx"
            height="64rpx"
            @submit="handleDownload(item)"
            v-if="
              item.status != 0 &&
              download_switch == 1 &&
              ((esignature == 1 && item.sign_img) || esignature == 0)
            "
            >下载合同</wk-button
          >

          <wk-button
            class="flex-grow"
            :borderColor="$colors.theme"
            backgroundColor="transparent"
            :color="$colors.theme"
            shadow=""
            fontWeight="normal"
            size="small"
            borderRadius="16rpx"
            height="64rpx"
            @submit="handleSign(item)"
            v-if="item.status != 0 && !item.sign_img && esignature == 1"
            >补签合同</wk-button
          >

          <wk-button
            class="flex-grow"
            :borderColor="$colors.theme"
            backgroundColor="transparent"
            :color="$colors.theme"
            shadow=""
            fontWeight="normal"
            size="small"
            borderRadius="16rpx"
            height="64rpx"
            @submit="goToTiQian(item)"
            v-if="item.status == 1"
            >提前还款</wk-button
          >

          <wk-button
            class="flex-grow"
            :borderColor="$colors.theme"
            backgroundColor="transparent"
            :color="$colors.theme"
            shadow=""
            fontWeight="normal"
            size="small"
            borderRadius="16rpx"
            height="64rpx"
            @submit="jumpToContract(item)"
            v-if="item.status == 1"
            >查看合同</wk-button
          >
        </view>
      </wk-stroke-bg>

    </view>

    <Empty class="mt-[300rpx]" v-else :color="$colors.regular" />
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script>
import Empty from "@/components/base/empty.vue";
import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";
import { signContract as signContractApi } from "@/api/user";
import { usePermissionStore } from "@/stores/permission";

export default {
  components: {
    Empty,
  },
  data() {
    return {
      symbolStore: useSymbolStore(),
      download_switch: 0,
      list: [],
      esignature: 0,
      loading: false,
      loadingText: "加载中...",
    };
  },
  onShow() {
    this.getDaikuanlogs();
  },
  methods: {
    handleSign(item) {
      uni.$on("onSign", async (sign_img) => {
        this.list = [];
        await this.getDaikuanlogs();
        uni.$off("onSign", () => {});
      });
      uni.navigateTo({
        url: `${routes.daiKuanHeTong}?id=${item.bianhao}`,
      });
    },
    handleRefresh() {
      this.getDaikuanlogs();
    },
    goToTiQian(item) {
      uni.navigateTo({
        url: `${routes.daiKuanTiQian}?id=${item.bianhao}`,
      });
    },
    jumpToContract(item) {
      if (item.status == 0) {
        uni.$showToast({
          title: "贷款合同已销毁！",
          icon: "none",
          duration: 3000,
        });
        return;
      }

      uni.navigateTo({
        url: `${routes.daiKuanHeTongShow}?id=${item.bianhao}`,
      });
    },
    arrayBufferToObject(arrayBuffer) {
      try {
        const uint8Array = new Uint8Array(arrayBuffer);
        let jsonString = "";
        for (let i = 0; i < uint8Array.length; i++) {
          jsonString += String.fromCharCode(uint8Array[i]);
        }
        const object = JSON.parse(jsonString);
        return object;
      } catch (error) {
        console.error("解析 JSON 字符串失败", error);
        return false;
      }
    },
    H5download(arrayBuffer, item) {
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.bianhao}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url); // 释放URL对象
    },
    appDownload(item) {
      uni.getStorage({
        key: "app_token",
        success: function (res) {
          let host = "";
          // #ifdef APP-PLUS
          host = uni.getStorageSync("ip_host");
          // #endif
          const fileName = `${item.bianhao}.pdf`;
          let downUrl =
            uni.getStorageSync("api_url") +
            "/api/v2/daikuan/downloadContract?contract_no=" +
            item.bianhao;
          let dtask = plus.downloader.createDownload(
            downUrl,
            {
              filename: "file://storage/emulated/0/Download/" + fileName,
            },
            function (d, status) {
              this.loading = false;
              console.log(d, status);
              if (status == 200) {
                //下载成功
                //d.filename是文件在保存在本地的相对路径，使用下面的API可转为平台绝对路径
                let fileSaveUrl = plus.io.convertLocalFileSystemURL(d.filename);
                uni.$showModal({
                  title: "提示",
                  content: `文件已下载至${fileSaveUrl}, 是否打开文件？`,
                  showCancel: false,
                  success: ({ confirm, cancel }) => {
                    if (confirm) {
                      plus.runtime.openFile(d.filename); //选择软件打开文件
                    }
                  },
                });
              } else {
                //下载失败
                console.log("下载失败");
                plus.downloader.clear(); //清除下载任务
              }
            }
          );
          dtask.setRequestHeader("authorization", "Bearer " + res.data);
          if (host) {
            dtask.setRequestHeader("host", host);
          }
          dtask.start();
        },
        fail: function (res) {
          this.loading = false;
          uni.reLaunch({
            url: routes.login,
          });
        },
      });
    },
    async handleDownload(item) {
      this.loading = true;
      this.loadingText = "下载中...";
      const { hasPermission } = usePermissionStore();
      this.downType = hasPermission("pdf_download_type") ? 1 : 0;
      console.log("this.downType", this.downType);
      if (this.downType == 1) {
        this.$requestApi({
          url: "/api/v2/daikuan/downloadContract?contract_no=" + item.bianhao,
          method: "get",
        }).then((res) => {
            if (res.status == 0) {
              // #ifdef APP-PLUS
              plus.runtime.openURL(res.url);
              // #endif
              // #ifdef H5
              window.open(res.url);
              // #endif
            }

              this.loading = false;
              uni.hideLoading();
              return;
            })
            .catch((error) => {
            console.error("请求失败", error);
            this.loading = false;
            uni.hideLoading();
            // 处理错误情况
            });
        return;
      }
      this.$requestApi({
        url: "/api/v2/daikuan/downloadContract?contract_no=" + item.bianhao,
        responseType: "arraybuffer",
        method: "get",
      })
        .then((arrayBuffer) => {
          const data = this.arrayBufferToObject(arrayBuffer);
          if (data.status == 1) {
            uni.$showToast({
              title: data.msg,
              icon: "none",
              duration: 3000,
            });
            this.loading = false;
            return;
          }
          if (arrayBuffer) {
            // #ifdef H5
            this.H5download(arrayBuffer, item);
            // #endif
            // #ifdef APP-PLUS
            this.appDownload(item);
            // #endif
          }
          this.loading = false;
          uni.hideLoading();
        })
        .catch((error) => {
          console.error("请求失败", error);
          this.loading = false;
          uni.hideLoading();
          // 处理错误情况
        });
    },
    getDaikuanlogs() {
      this.loading = true;
      this.loadingText = "加载中...";
      this.$requestApi({
        url: "/api/user/daikuanlogs",
        method: "POST",
      }).then((res) => {
        console.log(res);
        this.list = res.list.data;
        this.download_switch = res.download_switch;
        this.esignature = res.esignature;
        this.$refs.layoutRef.complete();
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss">
.slef_32 {
  box-sizing: border-box;
  padding: 24rpx 28rpx 1rpx;
}
// 装饰部分
.b-k-1,
.b-k-2,
.b-k-3,
.b-k-4 {
  position: absolute;
  width: 28rpx;
  height: 28rpx;
  border: 6rpx solid #000000;
}
.b-k-1,
.b-k-4 {
  left: -6rpx;
  border-right: none;
}
.b-k-1,
.b-k-2 {
  top: -6rpx;
  border-bottom: none;
}
.b-k-2,
.b-k-3 {
  right: -6rpx;
  border-left: none;
}
.b-k-3,
.b-k-4 {
  bottom: -6rpx;
  border-top: none;
}
// 头部固定部分
.header-wrap {
  padding: 24rpx;
  // padding-bottom: 0;
  .header {
    position: relative;
    width: 100%;
    height: 198rpx;
    background-size: 100% 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .str {
        font-size: 28rpx;
        color: #000000;
      }
      .dfn {
        color: #fff;
        margin-top: 24rpx;
        font-weight: bold;
        font-size: 40rpx;
      }
    }
  }
}

.item-card {
  position: relative;
  padding: 32rpx;
  line-height: 1.4;
  margin-bottom: 24rpx;
  .title-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      font-size: 32rpx;
      color: #fff;
    }
    .status {
      font-size: 28rpx;
      color: #000000;
    }
  }
  .line-tips {
    display: flex;
    margin-top: 24rpx;
    margin-bottom: 20rpx;
    font-size: 28rpx;
    justify-content: space-between;
    .var {
      color: #95caff;
    }
    .dfn {
      font-weight: bold;
    }
    .status {
      font-size: 28rpx;
      color: #000000;
    }
  }
  .tips-s {
    margin-top: 12rpx;
    color: #95caff;
    font-size: 28rpx;
  }
  .info-box-x {
    margin-top: 32rpx;
    .hr-x {
      height: 2rpx;
      background-image: linear-gradient(
        to right,
        rgba(3, 88, 173, 1),
        rgba(7, 254, 239, 1),
        rgba(3, 88, 173, 1)
      );
    }
    .line-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      font-size: 28rpx;
      padding: 24rpx 0;
      padding-left: 24rpx;
      .leftb {
      }
      .top {
        font-weight: bold;
        font-size: 32rpx;
      }
      .bot {
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  .bt-box {
    display: flex;
    grid-template-columns: repeat(2, 1fr);
    font-size: 32rpx;
    column-gap: 32rpx;
    .item-btn {
      width: 100%;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-radius: 16rpx;
      color: theme("colors.neutral.regular");
      font-size: 28rpx;
      border: 2rpx solid theme("colors.neutral.light");
      .lef-icon,
      .ref-icon,
      &::before,
      &::after {
        position: absolute;
      }
      .lef-icon,
      .ref-icon {
        width: 24rpx;
        height: 100%;
        top: 0;
      }
      .lef-icon {
        left: 0;
      }
      .ref-icon {
        right: 0;
      }
      &::before,
      &::after {
        content: "";
        left: 24rpx;
        right: 24rpx;
        height: 12rpx;
        background-size: 100% 100%;
        // background-color: #000000;
      }
      &::before {
        top: 0;
      }
      &::after {
        bottom: 0;
      }
    }
  }
  .other-btn {
    color: #000000;
    font-size: 28rpx;
    margin-top: 32rpx;
    text-align: center;
  }
}
</style>
