<template>
  <layout
    ref="layoutRef"
    navTitle="股权合约"
    bgType="bg-main"
    :refresher="true"
    @reachBottom="handleReachBottom"
    @onRefresh="handleRefresh"
  >
    <view class="px-[32rpx] pt-[24rpx]">
      <!-- 合约列表项 -->
      <wk-stroke-bg
        v-for="(item, idx) in list"
        :key="'contract_' + idx"
        class="mb-[24rpx]"
      >
        <view class="flex flex-col">
          <!-- 合约ID和时间 -->
          <view class="flex flex-col justify-between">
            <view class="text-neutral text-lg font-medium">
              股权质押ID: {{ item.bianhao }}
            </view>
            <view class="text-neutral-regular text-base mt-[12rpx]">
              质押时股价: {{ item.dayprice }} {{ symbolStore.code }}
            </view>
          </view>
          <view class="w-full h-[2rpx] bg-neutral-divider my-[16rpx]"></view>
          <!-- 质押数量 -->
          <view class="flex items-center mb-[8rpx]">
            <text class="text-neutral-regular text-base">质押数量:</text>
            <text class="text-primary text-base ml-[12rpx]"
              >{{ item.number }}个</text
            >
          </view>
          <view
            class="flex items-center mb-[8rpx] text-neutral-regular text-base"
          >
            <text>质押时间:</text>
            <text class="ml-[12rpx] text-primary text-base">{{
              item.created_at
            }}</text>
          </view>
          <!-- 按钮组 -->
          <view class="flex gap-[24rpx] mt-[24rpx]">
            <wk-button
              v-if="isshow"
              size="small"
              color="#010101"
              backgroundColor="#F5F8FD"
              class="shadow-btn-bg flex-1 rounded-[24rpx]"
              @submit="handleRedeem(item)"
            >
              赎回合约
            </wk-button>
            <wk-button
              size="small"
              class="bg-transparent flex-1 bg-primary text-black"
              @submit="handleView(item)"
            >
              查看合约
            </wk-button>
          </view>
          <view
            v-if="download_switch == 1"
            @click="handleDownload(item)"
            class="text-base font-medium text-neutral-theme text-center mt-[32rpx]"
            >下载合约</view
          >
        </view>
      </wk-stroke-bg>
      <!-- 无数据展示 -->
      <empty v-if="!list.length" />
    </view>
    <uv-load-more v-if="list.length > 0" :status="loadStatus" />
    <wk-loading v-if="loading" />
    <wk-modal ref="modal" title="安全提示" :showClose="false">
      <view
        class="flex flex-row items-center justify-center text-center w-full mb-[24rpx]"
      >
        <text class="text-neutral-regular">解除需要扣除</text>
        <text class="text-xl font-medium mx-[12rpx] text-warning">{{
          equitys
        }}</text>
        <text class="text-neutral-regular"> 积分 </text>
      </view>
      <view class="flex-1 flex flex-row w-[90%] mx-auto">
        <wk-button
          backgroundColor="#F5F8FD"
          size="small"
          class="flex-1"
          color="#252628"
          @submit="modal.close()"
          >取消</wk-button
        >
        <view class="flex-1 ml-[20rpx]">
          <wk-button size="small" @submit="handleRedeemKeyWord">确认</wk-button>
        </view>
      </view>
    </wk-modal>
    <fui-toast
      :padding="['12rpx', '24rpx', '12rpx', '24rpx']"
      background="rgba(0,0,0,.8)	"
      size="28"
      ref="toast"
    >
      <view style="color: #fff">
        <view>
          <text>您的积分只有：</text>
          <text style="color: #fff906">{{ integral }}</text>
          <text> 积分</text>
        </view>
        <view>
          <text>解除合约需要：</text>
          <text style="color: #18bc37">{{ equitys }}</text>
          <text> 积分</text>
        </view>
        <view style="color: #f3a73f">当前积分不足以解除该合约！</view>
      </view>
    </fui-toast>
    <!-- 支付密码弹窗 -->
    <wk-code-input
      ref="keywordRef"
      :value="payPassword"
      @finish="confirmRedeem"
    />
  </layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getContractListApi,
  redeemContractApi,
  downloadContractApi,
  downloadContractApi2
} from "@/api/user";
import { onShow, onLoad } from "@dcloudio/uni-app";
import Empty from "@/components/base/empty.vue";
import { routes } from "@/config/routes";
import { cacheManager } from "@/utils/cacheManager";
import { useSymbolStore } from "@/stores/symbolStore";
import { usePermissionStore } from "@/stores/permission";

const { hasPermission } = usePermissionStore();
const symbolStore = useSymbolStore();
// 状态定义
const list = ref([]);
const currentPage = ref(1);
const lastPage = ref("");
const total = ref("");
const layoutRef = ref(null);
const loadStatus = ref("loadmore");
const modal = ref(null);
const integral = ref(0);
const equitys = ref(0);
const keywordRef = ref(null);
const redeemId = ref("");
const pay_password = ref("");
const loading = ref(false);
const loadingText = ref("");
const toast = ref(null);
const isshow = ref(false);
const download_switch = ref(0);
const downType = ref(0);

const handleDownload = async (item) => {
  loading.value = true;
  loadingText.value = "下载中...";
  try {
    downType.value = hasPermission("pdf_download_type") ? 1 : 0;
    if (downType.value == 1) {
      const result = await downloadContractApi2({
        contract_no: item.bianhao,
      });
      console.log("result123", result);
      if (result.status == 0) {
        // #ifdef H5
        window.open(result.url);
        // #endif
        // #ifdef APP-PLUS
        plus.runtime.openURL(result.url);
        // #endif
      }else {
        uni.$showToast({
          title: result.msg,
          icon: "none",
          duration: 3000,
        });
      }
      loading.value = false;
      return;
    }
    const arrayBuffer = await downloadContractApi({
      contract_no: item.bianhao,
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
  a.download = `${item.bianhao}.pdf`;
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
      const fileName = `${item.bianhao}.pdf`;
      let downUrl =
        uni.getStorageSync("api_url") +
        "/api/v2/equity/downloadContract?contract_no=" +
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
const handleRefresh = async () => {
  currentPage.value = 1;
  await getContractList();
  layoutRef.value.complete();
};

const handleReachBottom = () => {
  if (loadStatus.value == "nomore") return;
  currentPage.value++;
  loadStatus.value = "loading";
  getContractList();
};

const handleCache = (res) => {
  if (res.status == 0) {
    if (currentPage.value === 1) {
      list.value = res.list.data;
    } else {
      if (res.list.total == list.value.length) {
        loadStatus.value = "nomore";
      } else {
        list.value = list.value.concat(res.list.data);
      }
    }
    if (res.list.total == list.value.length) {
      loadStatus.value = "nomore";
    } else {
      loadStatus.value = "loadmore";
    }
    total.value = res.list.total;
    lastPage.value = res.list.last_page;
    integral.value = res.integral;
    isshow.value = res.isshow;
    loading.value = false;
    loadingText.value = "";
    download_switch.value = res.download_switch;
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
};

// 获取合约列表
const getContractList = () => {
  loading.value = true;
  getContractListApi({
    page: currentPage.value,
  }).then((res) => {
    console.log(res);
    if (currentPage.value == 1) {
      cacheManager.setCache("equityInfoContract", res);
    }
    handleCache(res);
    loading.value = false;
  });
};

// 合约操作方法
const handleRedeem = (item) => {
  redeemId.value = item.id;
  equitys.value = item.jiechuhetong;
  modal.value.open();
};

const handleView = (item) => {
  uni.navigateTo({
    url: `${routes.equityAgreement}?id=${item.bianhao}&number=${item.number}`,
  });
};

const handleRedeemKeyWord = () => {
  if (integral.value < equitys.value) {
    toast.value.show({
      duration: 3000,
    });
    return;
  }
  keywordRef.value.open();
};
// 确认赎回
const confirmRedeem = (value) => {
  pay_password.value = value;
  if (value.length < 6) {
    uni.showToast({
      title: "请输入完整的支付密码！",
      duration: 2000,
      icon: "none",
    });
    return;
  }

  loading.value = true;
  redeemContractApi({
    id: redeemId.value,
    pay_passworld: pay_password.value,
  })
    .then((res) => {
      if (res.status == 0) {
        pay_password.value = "";
        uni.$showModal({
          title: "提示",
          showCancel: false,
          content: res.msg,
          success: (res) => {
            if (res.confirm) {
              keywordRef.value.close();
              list.value = [];
              currentPage.value = 1;
              getContractList();
            }
          },
        });
      } else {
        uni.$showToast({
          title: res.msg,
          icon: "none",
          duration: 3000,
        });
      }
      loading.value = false;
      modal.value.close();
      keywordRef.value.close();
    })
    .catch((error) => {
      console.error("请求失败", error);
      keywordRef.value.close();
      modal.value.close();
      loading.value = false;
    });
};

// 页面生命周期
onLoad(() => {
  const equityInfo = cacheManager.getCache("equityInfoContract");
  if (equityInfo) {
    handleCache(equityInfo);
  }
  getContractList();
});
</script>

<style lang="scss">
// ... existing code ...
</style>
