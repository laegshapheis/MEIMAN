<template>
  <layout
    ref="layoutRef"
    navTitle="我的订单"
    bgType="bg-main"
    :refresher="true"
    @reachBottom="handleReachBottom"
    @onRefresh="handleRefresh"
  >
    <view class="px-[32rpx] pt-[28rpx]">
      <!-- 订单列表项 -->
      <wk-stroke-bg
        v-for="(item, idx) in list"
        :key="'order_' + idx"
        class="mb-[24rpx]"
      >
        <view class="flex flex-col">
          <!-- 订单ID -->
          <view class="flex flex-row justify-between">
            <view class="text-neutral text-base font-medium">
              股权交易ID: {{ item.bianhao }}
            </view>
            <text
              :class="[
                'text-base',
                item.status == 2
                  ? 'text-neutral-theme'
                  : item.status == 4
                  ? 'text-error'
                  : 'text-neutral-theme',
              ]"
            >
              {{
                item.status == 2
                  ? "成功"
                  : item.status == 4
                  ? "交易取消"
                  : "交易中"
              }}
            </text>
          </view>

          <view class="w-full h-[2rpx] bg-neutral-divider my-[24rpx]"></view>

          <!-- 数量和状态 -->
          <view
            class="text-neutral-regular text-base mt-[12rpx] flex items-center"
          >
            <text>交易数量: {{ item.number }} 个</text>
          </view>
          <view
            class="text-neutral-regular text-base mt-[12rpx] flex items-center"
          >
            <text>交易单价: {{ item.buyprice }} {{ symbolStore.code }}</text>
          </view>
          <view
            v-if="item.successmoney != 0"
            class="text-neutral-regular text-base mt-[12rpx] flex items-center"
          >
            <text
              >成交价格: {{ item.successmoney }} {{ symbolStore.code }}</text
            >
          </view>
          <view
            class="text-neutral-regular text-base mt-[12rpx] flex items-center"
          >
            <text
              >手续费: {{ item.extmoney }} {{ symbolStore.code }} ({{
                item.feetip
              }})</text
            >
          </view>
          <!-- 时间信息 -->
          <view
            v-if="item.flag == 2"
            class="text-neutral-regular text-base mt-[12rpx] flex items-center"
          >
            <text>挂单时间: {{ item.created_at }}</text>
          </view>
          <view
            v-if="item.sortid == 1 && item.status == 2"
            class="text-neutral-regular text-base mt-[12rpx] flex items-center"
          >
            <text>交易时间: {{ item.updated_at }}</text>
          </view>
          <!-- 备注 -->
          <view
            v-if="item.status == 2"
            class="text-neutral-theme text-base mt-[12rpx]"
          >
            备注：{{ item.mark }}
          </view>

          <!-- 按钮组 -->
          <view class="flex gap-[24rpx] mt-[24rpx]" v-if="item.status == 1">
            <wk-button
              size="small"
              color="#252628"
              backgroundColor="#EBF6F0"
              class="shadow-btn-bg flex-1 rounded-[24rpx]"
              @submit="jumpInfo(item.id, 2, item)"
            >
              查看合约
            </wk-button>
            <wk-button
              size="small"
              class="flex-1 rounded-[24rpx]"
              @submit="jumpInfo(item.id, 1, item)"
            >
              市价交易
            </wk-button>
          </view>

          <view
            v-if="item.status == 3"
            class="mt-[24rpx] flex flex-row gap-[24rpx]"
          >
            <wk-button
              size="small"
              color="#000"
              class="flex-1 rounded-[24rpx]"
              backgroundColor="#98EDFB"
              @submit="open_play_pass(item.id)"
              >取消交易</wk-button
            >
            <wk-button
              size="small"
              v-if="item.frequency == 1"
              class="flex-1 rounded-[24rpx]"
              @submit="jumpInfo(item.id, 4, item)"
              >改价</wk-button
            >
          </view>
          <view
            v-if="item.status == 1 && item.endtime == 0"
            class="bg-[#FFFFFF]/80 rounded-[12rpx] px-[24rpx] py-[16rpx] mt-[24rpx]"
          >
            <view class="text-neutral-warning text-base flex items-center"
              >质押中 到期时间{{ item.exptime }}</view
            >
          </view>
        </view>
      </wk-stroke-bg>

      <!-- 无数据展示 -->
      <empty class="mt-[300rpx]" v-if="!list.length" />
    </view>
  </layout>

  <uv-load-more v-if="list.length > 0" :status="loadStatus" />

  <uni-popup ref="popup">
    <view class="pay_pass_box">
      <view class="pass_title">安全提示</view>
      <view class="pass_content">
        <input
          class="uni-input pay_input_xk"
          v-model="pay_password"
          :password="pay_icon_show"
          placeholder-class="inkl_pay_inp"
          placeholder="请输入支付密码"
        />
        <uni-icons
          v-if="pay_password.length > 0"
          @click="pay_icon_show = !pay_icon_show"
          :type="pay_icon_show == true ? 'eye-slash' : 'eye'"
          color="#999"
          size="26"
        ></uni-icons>
      </view>
      <view class="pass_btn_box">
        <view class="pass_clear" @click="clearPopWin">取消</view>
        <view class="pass_confirm" @click="confirmCancelorder">确认</view>
      </view>
    </view>
  </uni-popup>
  <!-- 安全提示 -->
  <wk-modal ref="modalRef" title="提示" :showClose="false">
    <view style="padding: 24rpx; font-size: 32rpx">
      <text class="text-neutral-regular text-base">取消交易订单需扣除</text>
      <text class="text-neutral-theme text-lg font-bold mx-[10rpx]">{{
        quxiaodingdan
      }}</text>
      <text class="text-neutral-regular text-base"
        >个可交易股权（已挂单股权不能代扣）</text
      >
    </view>
    <view class="flex flex-row gap-[24rpx]">
      <wk-button
        size="small"
        class="flex-1 rounded-[24rpx]"
        plain
        @submit="modalRef.close()"
        >取消</wk-button
      >
      <wk-button
        size="small"
        class="flex-1"
        @submit="confirmGo"
        >确认</wk-button
      >
    </view>
  </wk-modal>
  <!-- 支付密码弹窗 -->
  <wk-code-input ref="keywordRef" :value="pay_password" @finish="keyConfirm" />
  <fui-toast
    :padding="['12rpx', '24rpx', '12rpx', '24rpx']"
    background="rgba(0,0,0,.8)	"
    size="28"
    ref="toast"
  >
    <view style="color: #fff">
      <view>
        <text>您的股权只有：</text>
        <text style="color: #fff906">{{ nld_number }}</text>
        <text>个</text>
      </view>
      <view>
        <text>取消交易需要：</text>
        <text style="color: #5493FF">{{ quxiaodingdan }}</text>
        <text> 个</text>
      </view>
      <view style="color: #f3a73f">当前股权数不足以取消该交易！</view>
    </view>
  </fui-toast>
</template>

<script setup>
import { ref } from "vue";
import Empty from "@/components/base/empty.vue";
import { routes } from "@/config/routes";
import { onShow } from "@dcloudio/uni-app";
import { getContractListApi, cancelTradeApi } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";
import { useSymbolStore } from "@/stores/symbolStore";

const symbolStore = useSymbolStore();
// 状态定义
const list = ref([]);
const currentPage = ref(1);
const loadStatus = ref("loadmore");
const layoutRef = ref(null);
const loading = ref(false);
const keyShow = ref(false);
const modalRef = ref(null);
const pay_password = ref("");
const clear_id = ref("");
const nld_number = ref(null);
const quxiaodingdan = ref(null);
const sjjy_status = ref(0);
const xjjy_status = ref(0);
const toast = ref(null);
const keywordRef = ref(null);

// 刷新和加载更多处理
const handleRefresh = async () => {
  currentPage.value = 1;
  list.value = [];
  await getLogList();
  layoutRef.value.complete();
};

const handleReachBottom = () => {
  if (loadStatus.value === "nomore") return;
  currentPage.value++;
  loadStatus.value = "loading";
  getLogList();
};

const handleCache = (res) => {
  if (currentPage.value === 1) {
    list.value = res.list.data;
  } else {
    list.value = list.value.concat(res.list.data);
  }

  if (res.list.total === list.value.length) {
    loadStatus.value = "nomore";
  } else {
    loadStatus.value = "loadmore";
  }

  nld_number.value = res.nld_number;
  quxiaodingdan.value = res.quxiaodingdan;
  sjjy_status.value = res.sjjy;
  xjjy_status.value = res.xjjy;
  loading.value = false;
};

// 获取订单列表
const getLogList = () => {
  loading.value = true;
  getContractListApi({
    sort: 3,
    page: currentPage.value,
  })
    .then((res) => {
      console.log(res);
      if (currentPage.value == 1) {
        cacheManager.setCache("equityInfoOrder", res);
      }
      handleCache(res);
    })
    .catch((error) => {
      console.error("请求失败", error);
      loading.value = false;
    });
};

// 取消交易确认
const confirmCancelorder = () => {
  if (pay_password.value.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      icon: "none",
    });
    return;
  }

  loading.value = true;
  cancelTradeApi({
    id: clear_id.value,
    sortid: 2,
    pay_passworld: pay_password.value,
  })
    .then((res) => {
      if (res.status != 0) {
        uni.$showToast({
          title: res.msg,
          icon: "none",
        });
        return;
      }
      pay_password.value = "";
      uni.$showModal({
        title: "提示",
        content: res.msg,
        showCancel: false,
        success: () => {
          list.value = [];
          currentPage.value = 1;
          getLogList();
        },
      });
      keywordRef.value.close();
    })
    .catch((error) => {
      console.error("请求失败", error);
      loading.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 跳转处理
const jumpInfo = (id, sel, obj) => {
  if (sel === 1) {
    if (sjjy_status.value === 0) {
      uni.$showToast({
        title: "暂未开放",
        icon: "none",
      });
      return;
    }
    uni.navigateTo({
      url: `${routes.equityMarketOrder}?id=${id}`,
    });
  } else {
    if (xjjy_status.value === 0) {
      uni.$showToast({
        title: "暂未开放",
        icon: "none",
      });
      return;
    }
    uni.navigateTo({
      url: `${routes.equityLimitOrder}?id=${id}`,
    });
  }
};

// 数字键盘相关方法
const keyConfirm = (value) => {
  pay_password.value = value;
  if (pay_password.value.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      icon: "none",
    });
    return;
  }
  confirmCancelorder();
};

const keyBackspace = () => {
  pay_password.value = pay_password.value.slice(0, -1);
};

const keyClick = (keyobj) => {
  if (pay_password.value.length === 6) return;
  pay_password.value += keyobj.value;
};

const keyClose = () => {
  keyShow.value = false;
  pay_password.value = "";
};

// 打开支付密码输入
const open_play_pass = (id) => {
  modalRef.value.open();
  clear_id.value = id;
};

// 确认继续
const confirmGo = () => {
  modalRef.value.close();
  if (nld_number.value < quxiaodingdan.value) {
    toast.value.show({
      duration: 3000,
    });
  } else {
    keywordRef.value.open();
  }
};

// 页面加载
onShow(() => {
  const equityInfo = cacheManager.getCache("equityInfoOrder");
  if (equityInfo) {
    handleCache(equityInfo);
  }
  getLogList();
});
</script>

<style lang="scss">
.mini_font {
  font-size: 20rpx;
}

.c1 {
  color: darkgray;
}

.c2 {
  color: coral;
}

.c3 {
  color: green;
}

.edit_x {
  color: blueviolet;
}

.uni-table-th {
  padding: 10rpx 0;
  font-size: 22rpx;
}

.uni-table-td {
  padding: 0 2rpx;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 150rpx;
  background-color: #fff;
}

.val_str {
  font-size: 44rpx;
  font-weight: bold;
  color: #ff5e0e;
  margin-top: 10rpx;
}

.aside_x {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: #fff;
}

.c1 {
  color: rgb(255, 153, 0);
}

.c2 {
  color: rgb(255, 0, 0);
}

.c3 {
  color: rgb(0, 161, 29);
}

/* 数据列表新增的 */
.content_xm {
  border: 1px dashed #ff5e0e;
  background-color: rgb(255, 252, 250);
}

.nex_nav_m {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 24rpx;
}

.item_nav_m {
  background-color: #fff;
  text-align: center;
  border: 1px solid #ebeef5;
  border-left: none;
  padding: 10rpx 0;
  color: #646464;
}

.item_nav_m:last-of-type {
  border-right: none;
}

/* 新样式 */
.cart_box_x {
  border-radius: 0rpx;
  padding: 36rpx 20rpx;
  padding-bottom: 62rpx;
  box-sizing: border-box;
  margin: auto;
  border-bottom: 1px solid #000;
}

.line_top_x {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
}

.line_top_m {
  display: flex;
  height: 88rpx;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #eeeeee;
  margin-top: 12rpx;
}

.tiem_x {
  width: 100%;
  font-size: 34rpx;
  text-align: right;
}

.number_xk {
  font-size: 40rpx;
  color: #e14a42;
}

// 安全提示窗 -- 开始
.fui-title_x {
  font-size: 32rpx;
  padding-top: 24rpx;
}

.fui-descr {
  font-size: 28rpx;
  color: #b2b2b2;
  padding-top: 12rpx;
  padding-bottom: 48rpx;
}

.fui-icon__close {
  position: absolute;
  right: 24rpx;
  top: 20rpx;
}

.fui-btn__box {
  display: flex;
  justify-content: center;
  padding: 12rpx 0;
  box-sizing: border-box;
}

.nl_he_yue_list .dkl .str_x {
  color: #5a6876;
}

.nl_he_yue_list .dkl {
  color: #5a6876;
}

.btn_box {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24rpx;

  .btn_1,
  .btn_2 {
    flex: 1;
    border-radius: 12rpx;
    height: 90rpx;
    line-height: 90rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn_1 {
    color: #2cbba2;
    background-color: #144c4d;
    margin-right: 24rpx;
    padding: 0 24rpx;
    white-space: nowrap;
  }

  .btn_2 {
    background-color: #2cbba2;
  }
}
// 安全提示窗 -- 结束
</style>
