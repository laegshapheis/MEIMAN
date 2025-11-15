<template>
  <layout
    navTitle="提前还款"
    bgType="bg-main"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <template v-slot:navRight>
      <view class="flex items-center justify-center w-[64rpx] h-[64rpx] bg-white/10 rounded-full">
        <image @click="jumpLogs" src="/static/images/user/record_icon.svg" mode="widthFix" class="w-[32rpx] h-[32rpx]"></image>
      </view>
    </template>

    <view class="px-[32rpx] mt-[28rpx]">
      <!-- <wk-stroke-bg>
        <view class="flex flex-row items-center">
          <view class="text-neutral text-xl font-bold">还款编号</view>
          <view class="text-neutral-lagular text-lg ml-[16rpx]">{{
            contractNo
          }}</view>
        </view>
      </wk-stroke-bg> -->

      <view class="mt-[28rpx]">
        <view class="flex flex-row items-center justify-between">
          <text class="text-neutral text-lg font-medium">提前还款金额</text>
          <text class="text-neutral-theme text-base"
            >投资余额 {{ amount }} {{ symbolStore.code }}</text
          >
        </view>

        <view class="flex flex-row items-center justify-between mt-[36rpx]">
          <text class="text-neutral text-base">还款编号 {{ contractNo }}</text>
        </view>

        <view
          class="mt-[28rpx] bg-grey"
        >
          <wk-input
            maxlength="33"
            type="number"
            fontSize="38rpx"
            v-model="inp_val"
            placeholder="请输入金额"
            :bgColor="$colors.inputBg"
            readonly
            placeholder-class="text-neutral-placeholder text-2xl"
          />
        </view>
      </view>

      <view class="py-[16rpx] mt-[28rpx]">
      <wk-button @submit="shen_qing_huan_kuan"
          >申请还款</wk-button
        >
    </view>

      <view v-if="mark" class="mt-[28rpx] text-base bg-white leading-6 border-[length:1rpx] border-solid border-neutral-divider rounded-[24rpx] p-[32rpx]">
        <view class="text-base text-neutral-regular">{{ mark }}</view>
      </view>
    </view>
    <wk-code-input
      ref="keywordRef"
      :value="pay_password"
      @finish="handlePasswordComplete"
    />
    
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";
import {
  getDaikuanInfo as getDaikuanInfoApi,
  getDaikuanContractInfo as getDaikuanContractInfoApi,
  forwarhuankuan as forwarhuankuanApi,
} from "@/api/user";

const symbolStore = useSymbolStore();
const layoutRef = ref(null);
const keywordRef = ref(null);

// 数据定义
const pay_password = ref("");
const contractNo = ref("");
const mark = ref("");
const inp_val = ref("");
const amount = ref("");
const object = ref({});
const loading = ref(false)
const loadingText = ref('加载中...')
// 方法定义
const handleRefresh = async () => {
  await getDaikuanInfo();
  await getZhengShuInfo(contractNo.value);
  layoutRef.value.complete();
};

const jumpLogs = () => {
  uni.navigateTo({
    url: routes.huanKuanJiLu,
  });
};

const confirmPaySubDaikuan = () => {
  loading.value = true;
  loadingText.value = '加载中...'
  forwarhuankuanApi({
    bianhao: contractNo.value,
    money: inp_val.value,
    pay_passworld: pay_password.value,
  }).then((res) => {
    loading.value = false;
    if (res.status == 0) {
      uni.$showModal({
        title: "提示",
        showCancel: false,
        content: res.msg,
        success: function (res) {
          uni.navigateBack();
        },
      });
    } else {
      uni.$showToast({
        title: res.msg,
        duration: 3000,
        icon: "none",
      });
    }
  });
};

const handlePasswordComplete = (password) => {
  pay_password.value = password;
  if (pay_password.value.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      duration: 3000,
      icon: "none",
    });
    return;
  }
  keywordRef.value.close();
  confirmPaySubDaikuan();
};

const shen_qing_huan_kuan = () => {
  keywordRef.value.open();
};

const getZhengShuInfo = (id) => {
  getDaikuanContractInfoApi({ contract_no: id }).then((res) => {
    object.value = res;
    inp_val.value = res.data.number_amount;
  });
};

const getDaikuanInfo = () => {
  loading.value = true;
  loadingText.value = '加载中...'
  getDaikuanInfoApi()
    .then((res) => {
      mark.value = res.huankuan_tiqian_content;
      amount.value = res.amount;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};

// 生命周期钩子
onShow(() => {
  getDaikuanInfo();
  if (contractNo.value) {
    getZhengShuInfo(contractNo.value);
  }
});

onLoad((option) => {
  contractNo.value = option.id;
  getZhengShuInfo(contractNo.value);
});
</script>

<style lang="scss">
.right-menu {
  font-size: 28rpx;
  color: #000000;
  .str {
  }
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
  padding: 32rpx;
  // padding-bottom: 0;
  .header {
    height: 122rpx;
    padding: 0 32rpx;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border: 1px solid #000000;
    line-height: 1;
    background-image: linear-gradient(276.53deg, #00366c 0%, #005bb5 82.17%);
    .var {
      font-size: 32rpx;
      color: #fff;
      margin-right: 16rpx;
    }
    .bold-str {
      font-weight: bold;
      font-size: 36rpx;
    }
  }
}

.str-title {
  color: #fff;
  font-size: 28rpx;
  line-height: 1;
}
.dk-input-box {
  position: relative;
  height: 104rpx;
  background-color: #010e21;
  border: 1px solid #000000;
  margin-top: 32rpx;
  .dk-input {
    width: 100%;
    height: 100%;
    display: block;
    color: #fff;
    font-size: 32rpx;
    padding-left: 32rpx;
  }
  .dk-input-pl {
    color: #bbdaff;
    font-size: 32rpx;
  }
}
.dk-str2 {
  color: #000000;
  margin-top: 32rpx;
  font-size: 28rpx;
}
.dk-sq-btn {
  height: 102rpx;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: bold;
  margin-top: 32rpx;
  margin-bottom: 64rpx;
}
.dk-card-kl {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 44rpx 32rpx 44rpx 42rpx;
  border: 1px solid #000000;
  margin-bottom: 32rpx;
  line-height: 1;
  background-image: linear-gradient(276.53deg, #00366c 0%, #005bb5 82.17%);
  position: relative;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    background-position: bottom left;
    background-size: 309rpx 152rpx;
    background-repeat: no-repeat, no-repeat;
    filter: brightness(1.4);
  }
  &::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
    background-position: top right;
    background-size: 309rpx 152rpx;
    background-repeat: no-repeat, no-repeat;
    filter: brightness(1.8);
  }
  .dk-left-box {
    position: relative;
    z-index: 2;
    .top-dk-val {
      font-size: 40rpx;
      font-weight: bold;
    }
    .dk-jin-e {
      margin-top: 24rpx;
      font-size: 28rpx;
      color: #000000;
    }
  }
  .dk-sq-hk {
    position: relative;
    z-index: 2;
    height: 80rpx;
    background-color: rgba(1, 36, 71, 0.34);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24rpx;
    font-size: 28rpx;
    .lef-icon,
    .ref-icon,
    &::before,
    &::after {
      position: absolute;
    }
    .lef-icon,
    .ref-icon {
      width: 18rpx;
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
      left: 18rpx;
      right: 18rpx;
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
    .dk-str-btn {
    }
  }
}
.dk-tips {
  white-space: pre-wrap;
  margin-top: 64rpx;
  font-size: 28rpx;
  padding-bottom: 32rpx;
  br {
  }
}
</style>
