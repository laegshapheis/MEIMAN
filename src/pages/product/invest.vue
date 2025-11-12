<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="我的投资"
    bgType="bg-main"
    :isNavLeftBackClick="false"
    @navLeftClick="handelBack"
    @reachBottom="getPaginationList"
  >
    <view class="px-[32rpx] my-[28rpx] box-border w-full flex flex-col">
      <!-- start 顶部汇总信息 -->
      <view
        class="mb-[24rpx] flex flex-row justify-around rounded-[32rpx] h-[208rpx] bg-card3"
      >
        <view class="flex flex-col items-center justify-center">
          <text class="text-base text-white/60"
            >已收利息({{ symbolStore.code }})</text
          >
          <text
            class="text-2xl font-bold leading-6 text-[40rpx] mt-[16rpx] text-neutral-white"
            >{{ data.interestReceived }}</text
          >
        </view>

        <view class="flex flex-col items-center justify-center">
          <text class="text-base text-white/60"
            >待收利息({{ symbolStore.code }})</text
          >
          <text
            class="text-2xl font-bold leading-6 text-[40rpx] mt-[16rpx] text-neutral-white"
            >{{ data.interestPending }}</text
          >
        </view>
      </view>
      <!-- end 顶部汇总信息 -->
      <wk-button-tabs 
        :list="tabs" 
        :scrollable="false" 
        @change="handleTabChange"
        className="bg-[#FFFFFF] rounded-[24rpx] border-[length:1rpx] border-solid border-black/10"
        :activeStyle="{
            color: '#FFFFFF',
            fontSize: '32rpx',
            textAlign: 'center',
            fontWeight: 500,
            border: '0px solid #000',
            background: '#06F',
            borderRadius: '16rpx',
          }"
          :inactiveStyle="{
            color: '#252C2F',
            fontSize: '32rpx',
            border: '0px solid #000',
          }"
        />
      <!-- list -->
      <view class="flex flex-col mt-[24rpx]">
        <view
          class="bg-[#FFFFFF] flex flex-col rounded-[24rpx] mb-[24rpx]"
          v-for="item in data.list"
          :key="item.id"
        >

        <view class="flex flex-col w-full">
          <view class="flex flex-row items-center justify-between pt-[24rpx] pb-[16rpx] px-[32rpx]">
            
              <view class="flex flex-row w-full justify-between">
              <text class="flex-grow text-lg text-neutral font-semibold">{{
                item.title
              }}</text>
            </view>
              <view class="flex flex-row items-center">
                <text
                :class="[
                  'text-base whitespace-nowrap font-medium ml-[5rpx]',
                  item.status == 1
                    ? 'text-[#06F]'
                    : item.status == 0
                    ? 'text-neutral-light'
                    : item.status == 2
                    ? 'text-neutral-error'
                    // : item.status == 3
                    // ? 'text-neutral-theme'
                    : 'text-neutral-placeholder',
                ]"
                >{{
                  item.status == 1
                    ? "投资中"
                    : item.status == 0
                    ? "已完成"
                    : item.status == 2
                    ? "已解约"
                    // : item.status == 3
                    // ? "抢购中"
                    : "结束"
                }}</text>
              </view>
            </view>


        </view>

        <view
            class="flex flex-row my-[12rpx] h-[2rpx] bg-neutral-divider"
          ></view>

        
        <view class="flex flex-col px-[32rpx] mt-[8rpx]">
          <view class="py-[8rpx] flex flex-col">
            <view class="flex flex-col bg-[#F3F5FC] py-[8rpx] px-[16rpx] rounded-[16rpx] text-neutral-secondary">
              <view class="flex flex-row items-center py-[4rpx] justify-between">
                <text class="text-sm">投资时间</text>
                <text class="ml-[16rpx] text-sm">{{ item.created_at }}</text>
              </view>
              <view class="flex flex-row items-center py-[4rpx] justify-between">
                  <text class="text-sm">合同ID：</text>
                  <text class="text-sm">{{ item.contract_no }}</text>
              </view>
            </view>            
          </view>


          <view
            class="flex flex-row my-[12rpx] mt-[24rpx] h-[2rpx] bg-black/10"
          ></view>

          <view class="flex flex-row mt-[12rpx]">
            <view class="grid grid-flow-row-dense grid-cols-3 gap-[24rpx]">
              <view class="flex flex-col min-w-[254rpx] gap-[8rpx]">
                <text class="text-2xl text-neutral">{{ item.jyrsy }} <text class="text-sm">%</text></text>
                <text class="text-sm text-neutral-placeholder">项目利率</text>
              </view>

              <view class="flex flex-col min-w-[254rpx] gap-[8rpx]">
                <text class="text-2xl text-neutral">{{ item.shijian }}
                  <text class="text-sm">{{ item.qxdw }}</text></text>
                <text class="text-sm text-neutral-placeholder">项目周期</text>
              </view>
              <view class="flex flex-col min-w-[254rpx] gap-[8rpx]">
                <text class="text-2xl text-neutral">{{ item.amount }}</text>
                <text class="text-sm text-neutral-placeholder"
                  >投资金额({{ symbolStore.code }})</text>
              </view>
              <!-- 基础收益 -->
              <view class="flex flex-col min-w-[254rpx] gap-[8rpx]">
                <text class="text-2xl text-neutral">{{ item.moneyCount }}</text>
                <text class="text-sm text-neutral-placeholder"
                  >基础收益({{ symbolStore.code }})</text>
                
              </view>
              <!-- Vip收益 -->
              <view
                class="flex flex-col min-w-[254rpx] gap-[8rpx]"
                v-if="item.elseMoney !== '0.00'"
              >
                <text class="text-2xl text-neutral">{{ item.elseMoney }}</text>
                <text class="text-sm text-neutral-placeholder"
                  >{{ item.levelname }}收益({{ symbolStore.code }})</text>
                
              </view>
              <!-- 加息券收益 -->
              <view
                class="flex flex-col min-w-[254rpx] gap-[8rpx]"
                v-if="item.bugcoupon * 1 > 0"
              >
              <text class="text-2xl text-neutral">{{ item.bugcoupon }}</text>
              <text class="text-sm" v-if="item.elseMoney * 1 <= 0">{{
                  statusText(item.status)
                }}</text>
                <text class="text-sm text-neutral-placeholder"
                  >加息券收益({{ symbolStore.code }})</text
                >
                
              </view>
            </view>
          </view>
          <view class="w-full h-[1rpx] bg-black/10 my-[24rpx]"></view>
         
          <view v-if="item.status != 2" class="flex flex-row items-center justify-between py-[10rpx] 
          mt-[22rpx] text-neutral-theme bg-[#F3F5FC] rounded-[32rpx] px-[16rpx] py-[8rpx] text-sm">
                <view class="flex flex-row items-center">
                  <!-- <view class="flex flex-row items-center justify-center w-[40rpx] h-[40rpx] rounded-full">
                    <image
                      class="flex-shrink-0 w-[40rpx] h-[40rpx] "
                      src="/static/images/user/logo.png"
                      mode="widthFix"
                    ></image>
                  </view> -->
                  <text class="text-base ml-[8rpx]">预计收益</text>
                </view>

                <text class="text-lg font-bold"
                  >{{ item.yujishouyi }}
                  <text class="font-bold">{{
                    symbolStore.code
                  }}</text></text>
          </view>
          
          <view
            v-if="item.status != 2"
            class="flex flex-row items-center justify-center gap-[24rpx] my-[24rpx]"
          >
              <wk-button
                class="flex-grow"
                :borderColor="$colors.theme"
                backgroundColor="transparent"
                :color="$colors.theme"
                borderRadius="32rpx"
                fontWeight="normal"
                size="small"
                shadow=""
                height="64rpx"
                @submit="cancel(item)"
                v-if="
                  item.iszengsong != 1 &&
                  item.status == 1 &&
                  ((isshow == 1 && item.equity > 0) || item.equity > 0)
                "
                >解除合同</wk-button
              >

              <wk-button
                class="flex-grow"
                :borderColor="$colors.theme"
                backgroundColor="transparent"
                :color="$colors.theme"
                borderRadius="32rpx"
                fontWeight="normal"
                size="small"
                shadow=""
                height="64rpx"
                @submit="handleSign(item)"
                v-if="!item.sign_img && data.esignature == 1"
                >补签合同</wk-button
              >
           
              <wk-button
                class="flex-grow"
                :borderColor="$colors.theme"
                backgroundColor="transparent"
                :color="$colors.theme"
                borderRadius="32rpx"
                fontWeight="normal"
                size="small"
                shadow=""
                height="64rpx"
                @submit="handleDownload(item)"
                v-if="
                data.downloadSwitch == 1 &&
                ((data.esignature == 1 && item.sign_img) ||
                  data.esignature == 0)
              "
                >下载合同</wk-button
              >

            <wk-button
              class="flex-grow"
              :borderColor="$colors.theme"
              backgroundColor="transparent"
              :color="$colors.theme"
              borderRadius="32rpx"
              fontWeight="normal"
              size="small"
              shadow=""
              height="64rpx"
              @submit="view(item)"
              >查看合同</wk-button
            >
          </view>
         

          </view>
        </view>
      </view>

      <!-- list -->
    </view>

    <Empty v-if="data.list.length == 0" :color="$colors.regular"></Empty>
    <wk-modal size="28" ref="wkModalRef" :showClose="false">
      <view class="flex flex-col items-start justify-center w-[400rpx] m-auto">
        <view class="mb-[10rpx]">
          <text class="text-base text-neutral">您的积分只有：</text>
          <text class="text-base text-neutral-theme">{{ data.integral }}</text>
          <text class="text-base text-neutral"> 积分</text>
        </view>
        <view class="mb-[10rpx]">
          <text class="text-base text-neutral">解除合同需要：</text>
          <text class="text-base text-neutral-theme">{{ data.equity }}</text>
          <text class="text-base text-neutral"> 积分</text>
        </view>
        <view class="text-base text-neutral-warning"
          >当前积分不足以解除该合同！</view
        >
      </view>
      <view class="flex flex-row justify-center mt-[44rpx] w-full">
        <wk-button
          class="w-full h-[70rpx] text-sm"
          @submit="wkModalRef.close()"
        >
          确认
        </wk-button>
      </view>
    </wk-modal>
    <wk-code-input ref="keywordRef" :value="pwdPay" @finish="handleSubmit" />
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive } from "vue";
import { onLoad, onUnload, onBackPress } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { routes } from "@/config/routes";
import Empty from "@/components/base/empty";
import {
  getList as getListApi,
  cancel as cancelApi,
  download as downloadApi,
} from "@/api/invest";
import { cacheManager } from "@/utils/cacheManager";
import { downloadContractApi2 } from "@/api/user";
import { usePermissionStore } from "@/stores/permission";

const { hasPermission } = usePermissionStore();

const cacheInvestList = cacheManager.getCache("investList");
const pwdPay = ref("");
const keywordRef = ref(null);
const wkModalRef2 = ref(null);
const layoutRef = ref(null);
const path = ref("");
const sortid = ref(-1);
const loading = ref(false);
const loadingText = ref('');
const isShow = ref(false);
const downType = ref(0);
const tabs = ref([
  {
    name: "全部",
    id: -1,
  },
  {
    name: "投资中",
    id: 1,
  },
  // {
  //   name: "抢购中",
  //   id: 3,
  // },
  {
    name: "已完成",
    id: 0,
  },
  {
    name: "已解约",
    id: 2,
  },
]);
// 数据集
const data = reactive({
  pullType: "",
  page: 1,
  pagesize: 20,
  list: [],
  interestReceived: 0,
  interestPending: 0,
  downloadSwitch: 0,
  integral: 0,
  equity: 0,
  currentId: 0,
  loadBS: false,
  loadRE: false,
  esignature: 0,
});
const wkModalRef = ref(null);
const symbolStore = useSymbolStore();

onBackPress((event) => {
  if (event.from == 'backbutton') {
    handelBack();
    return true;
  }
  return false;
});
onLoad((options) => {
  path.value = options.path;
  if (cacheInvestList) {
    handleResList(cacheInvestList);
  }
  getLogList();
  uni.$on("onSign", () => {
    data.list = [];
    data.page = 1;
    getLogList();
  });
});
onUnload(() => {
  uni.$off("onSign");
});
const handleTabChange = (item) => {
  data.page = 1;
  sortid.value = item.id;
  data.list = [];
  getLogList();
};
const statusText = (status) => {
  const item = tabs.value.find((item) => item.value == status);
  return item ? item.name : "";
};

const handelBack = () => {
  uni.switchTab({
    url: routes.profile,
  });
};
const handleRefresh = () => {
  data.pullType = "down";
  data.page = 1;
  getLogList();
};

const getPaginationList = () => {
  data.pullType = "up";
  console.log("up");
  data.page++;
  getLogList();
};

const handleResList = (result) => {
  console.log(result.list.total, data.list.length);
  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });

    return;
  }

  if (data.pullType == "down" || data.page == 1) {
    data.list = [];
  }
  if (result.list.total > data.list.length) {
    data.list = data.list.concat(result.list.data);
  }
  data.interestReceived = result.ys;
  data.interestPending = result.ds;
  data.downloadSwitch = result.download_switch;
  data.integral = result.integral;
  data.esignature = result.esignature;
  isShow.value = result.isshow;
  loading.value = false;
}
const getLogList = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = '加载中...'
  }
  const result = await getListApi({
    sortid: sortid.value,
    pagesize: data.pagesize,
    page: data.page,
  });
  console.log('result', result)
  if (data.page == 1) {
    cacheManager.setCache("investList", result);
  }
  handleResList(result);
  layoutRef.value.complete();
};

const cancel = (item) => {
  data.equity = item.equity;
  if (item.equity > data.integral) {
    wkModalRef.value.open();
    return;
  }
  uni.$showModal({
    content: `当前可用积分 ${data.integral} 积分\n解除需要扣除 ${item.equity} 积分`,
    success: (res) => {
      if (res.confirm) {
        data.currentId = item.id;
        keywordRef.value.open();
      }
    },
  });
};

const handleSubmit = async (value) => {
  pwdPay.value = value;
  keywordRef.value.close();

  if (!pwdPay.value || pwdPay.value.length < 6) {
    uni.$showToast({
      title: "请输入支付密码",
      duration: 3000,
      icon: "none",
    });

    return false;
  }

  loading.value = true;
  loadingText.value = '投资合同解除中'

  try {
    const result = await cancelApi({
      id: data.currentId,
      pay_passworld: value,
    });

    if (result.status == 0) {
      uni.$showModal({
        title: "提示",
        showCancel: false,
        content: result.msg,
        success: function (res) {
          handleRefresh();
        },
      });

      pwdPay.value = "";
    } else if (result.status) {
      uni.$showToast({
        icon: "none",
        title: result.msg,
        duration: 3000,
      });
    }
    loading.value = false;
  } catch (e) {
    loading.value = false;
    console.error(e);
  }
};

const handleDownload = async (item) => {
  loading.value = true;
  loadingText.value = "下载中...";
  try {
    downType.value = hasPermission("pdf_download_type") ? 1 : 0;
    if (downType.value == 1) {
    const result = await downloadContractApi2({
      contract_no: item.contract_no
    });
    console.log("result123", result);
    if (result.status == 0) {
      // #ifdef APP-PLUS
      plus.runtime.openURL(result.url);
      // #endif
      // #ifdef H5
      window.open(result.url);
      // #endif
    }
    loading.value = false;
    return;
  }
    const arrayBuffer = await downloadApi({
      contract_no: item.contract_no,
    });

    const data = arrayBufferToObject(arrayBuffer);
    if (data.status == 1) {
      uni.$showToast({
        title: data.msg,
        icon: "none",
        duration: 3000,
      });
      return;
    }
    if (arrayBuffer) {
      // #ifdef H5
      H5download(arrayBuffer, item);
      // #endif
      // #ifdef APP-PLUS
      appDownload(item);
      // #endif
    }

    loading.value = false;
  } catch (error) {
    console.error("请求失败", error);

    loading.value = false;
    // 处理错误情况
  }
};

const H5download = (arrayBuffer, item) => {
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${item.contract_no}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url); // 释放URL对象
};

const appDownload = (item) => {
  uni.getStorage({
    key: "app_token",
    success: function (res) {
      let host = "";
      // #ifdef APP-PLUS
      host = uni.getStorageSync("ip_host");
      // #endif
      const fileName = `${item.contract_no}.pdf`;
      let downUrl =
        uni.getStorageSync("api_url") +
        "/api/v2/product/downloadContract?contract_no=" +
        item.contract_no;
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
            uni.showModal({
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
      uni.reLaunch({
        url: routes.login,
      });
    },
  });
};

const arrayBufferToObject = (arrayBuffer) => {
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
};

const view = (obj) => {
  uni.navigateTo({
    url: "agreement?id=" + obj.contract_no,
  });
};

const handleSign = (item) => {
  uni.navigateTo({
    url: "agreement?id=" + item.contract_no + "&isSign=1",
  });
};
</script>

<style lang="scss">

.top-bg {
  border-radius: 24rpx;
  border: 1px solid rgba(239, 176, 72, 0.20);
  background: var(--bg, linear-gradient(to bottom right, #5F450E 0%, #20160E 50%) bottom right / 50% 50% no-repeat, linear-gradient(to bottom left, #5F450E 0%, #20160E 50%) bottom left / 50% 50% no-repeat, linear-gradient(to top left, #5F450E 0%, #20160E 50%) top left / 50% 50% no-repeat, linear-gradient(to top right, #5F450E 0%, #20160E 50%) top right / 50% 50% no-repeat);
}

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
  background-color: #003972;
  background-image: linear-gradient(270deg, #00366c, #005bb5);
  border: 1px solid #000000;
  margin-bottom: 32rpx;
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
    }
    .dfn {
      font-weight: bold;
    }
  }
  .tips-s {
    margin-top: 12rpx;
    color: #b8dbff;
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
    .item-btn {
      background-color: rgba(1, 36, 71, 0.34);
      border-radius: 24rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
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
