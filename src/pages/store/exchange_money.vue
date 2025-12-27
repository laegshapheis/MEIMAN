<template>
  <layout
    navTitle="积分兑现金"
    bgType="bg-white"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <template v-slot:navRight>
      <view class="flex flex-row items-center bg-white/10 rounded-full px-[16rpx] py-[8rpx]">
        <!-- <uv-icon name="file-text" color="#fff" size="13" class="relative"></uv-icon> -->
        <text class="text-sm ml-[2rpx] text-white" @click="jumpLogs"
          >记录</text
        >
      </view>
    </template>
    <view>
        <view class="flex flex-row items-center justify-between mb-[32rpx] bg-[#5493FF] p-[24rpx] mt-[24rpx]">
          <text class="text-neutral text-xl">积分兑换</text>
          <view>
            <!-- <text class="text-neutral-theme text-base">可用积分</text> -->
            <image
                src="/static/images/store/jifen_icon.svg"
                mode="widthFix"
                class="w-[32rpx] h-[32rpx] text-end"
              ></image>
            <text class="text-white text-base font-bold ml-[10rpx] relative top-[-5rpx]">{{
              integral
            }}</text>
          </view>
        </view>
        <view class="p-[32rpx]">
          <text>积分数量</text>
          <view
            class="mt-[24rpx] h-[112rpx] px-[32rpx] relative rounded-[24rpx] flex flex-row items-center bg-[#202337]"
            style="border: 1px solid #FFFFFF50;"
          >
            <image src="/static/images/product/left.png" class="absolute left-0 top-0 z-10 h-[48rpx]" mode="heightFix"/>
            <image src="/static/images/product/right.png" class="absolute right-0 bottom-0 z-10 h-[48rpx]" mode="heightFix"/>
            <input
              type="number"
              maxlength="11"
              v-model="number"
              @input="passKey"
              class="ml-[20rpx] text-neutral-white text-2xl font-medium"
              placeholder="请输入要兑换的积分"
              placeholderStyle="font-weight: 400; font-size: 36rpx;"
            />
          </view>
          
          <view class="flex flex-col mt-[20rpx]">
            <view class="my-[20rpx]">
              兑换规则
            </view>
            <view class="text-neutral-regular text-base">
              <text class="text-lg mx-[8rpx]">•</text>
              <text>{{ number ? number : Pointsratio }}</text>
              积分 =
              <text>{{ number ? +number / +Pointsratio : 1 }}</text>
              {{ symbolStore.code }}
            </view>
            <view class="" v-if="minExchange">
              <text class="text-lg mx-[8rpx]">•</text>
              <text class="text-neutral-regular text-base">最低兑换数量</text>
              <text class="text-neutral-regular mx-[5rpx] text-base">
                {{ minExchange || 0 }}
              </text>
              <text class="text-neutral-regular text-base">积分</text>
            </view>
          </view>
        </view>
      <view class="fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx]"
      :style="{ background: neutral.bottomBtnBg }"
      >
        <wk-button @submit="open_play_pass" fontSize="32rpx">
          立即兑换
        </wk-button>
      </view>
    </view>
    <wk-code-input ref="keywordRef" :value="password" @finish="keyConfirm" />
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";
import { getMyjifen, jifenexchange } from "@/api/index";
import { cacheManager } from "@/utils/cacheManager";
import { neutral } from "@/config/colors";
const cacheData = cacheManager.getCache("exchangeMoney");
const symbolStore = useSymbolStore();
const router = useRouter();
const minExchange = ref(0);
const password = ref("");
const number = ref("");
const Pointsratio = ref(0);
const integral = ref("0");
const keywordRef = ref(null);
const layoutRef = ref(null);
const loading = ref(false);
const loadingText = ref("");

const handleRefresh = async () => {
  await getConfig();
  layoutRef.value.complete();
};

function jumpLogs() {
  uni.navigateTo({ url: routes.exchangeMoneyLogs });
}

const handleCache = (res) => {
  if (res.status == 0) {
    const data = res.data || {};
    Pointsratio.value = data.Pointsratio || 0;
    integral.value = data.integral || 0;
    minExchange.value = data.minExchange || 0;
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
};
const getConfig = async () => {
  const res = await getMyjifen();
  cacheManager.setCache("exchangeMoney", res);
  handleCache(res);
};

function keyConfirm(inputPassword) {
  password.value = inputPassword;
  if (password.value.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      duration: 3000,
      icon: "none",
    });
    return;
  }
  keywordRef.value.close();
  exchangeSubmit();
}

function open_play_pass() {
  if (!number.value) {
    uni.$showToast({
      title: "请输入兑换积分",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  if (+minExchange.value > +number.value) {
    uni.$showToast({
      title: "最低兑换数量" + minExchange.value + "积分",
      duration: 3000,
      icon: "none",
    });
    return false;
  }
  keywordRef.value.open();
}

const exchangeSubmit = async () => {
  loading.value = true;
  loadingText.value = "加载中...";

  const res = await jifenexchange({
    number: number.value,
    pwdPay: password.value,
  });
  if (res.status == 0) {
    password.value = "";
    uni.$showToast({
      title: "兑换成功",
      duration: 3000,
    });
    uni.navigateTo({ url: routes.exchangeMoneyLogs });
    number.value = "";
    password.value = "";
    getConfig();
  } else {
    uni.$showToast({
      icon: "none",
      title: res.msg,
      duration: 3000,
    });
  }
  loading.value = false;
};

onMounted(() => {
  if (cacheData) {
    handleCache(cacheData);
  }
  getConfig();
});
</script>
