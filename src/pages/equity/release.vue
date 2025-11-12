<template>
  <layout
    ref="layoutRef"
    navTitle="股权质押"
    bgType="bg-main"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <template #navRight>
      <view
        @click="goPageDetail"
        class="flex flex-row items-center text-base bg-white/10 rounded-full px-[24rpx] py-[8rpx] text-neutral-regular"
      >
        明细
        <!-- <image src="/static/images/user/list_search.svg" class="w-[48rpx] h-[48rpx]" /> -->
      </view>
    </template>
    <view class="px-[32rpx] pt-[28rpx]">
      <!-- 股权卡片 -->
      <!-- <equity-card :data="data" /> -->

      <!-- 质押表单 -->
      <view class="flex flex-col mt-[48rpx]">
        <!-- <text class="text-neutral-theme text-xl">股权质押</text> -->
        <view
          class="h-[100rpx] bg-white border border-solid border-neutral-divider rounded-[24rpx] px-[32rpx] mt-[24rpx]"
        >
          <input
            type="number"
            v-model="amount"
            @input="removeDecimalPoint"
            class="h-full w-full text-base text-neutral"
            placeholder="请输入数量"
            placeholder-class="text-base text-neutral-regular"
          />
        </view>
        <view class="flex flex-row justify-end items-center mt-[16rpx]">
          <text class="text-neutral-regular text-sm"
            >稀释比例 {{ data.sfbl }}</text
          >
        </view>
        <view class="mt-[24rpx]">
          <wk-button class="rounded-[16rpx]" @submit="handleRelease"
            >单次质押</wk-button
          >
        </view>
        <view
          class="text-base text-center mt-[32rpx] px-[]"
          >
          <wk-button class="rounded-[16rpx]" plain @submit="setMaxAmount"
            >全部质押</wk-button
          >
          </view
        >
      </view>

      <!-- 说明文案 -->
      <view
        class="my-[48rpx] text-[#252C2F] text-base leading-6 border border-black/10 border-solid rounded-[24rpx] p-[24rpx]"
      >
        {{ description }}
      </view>
    </view>

    <wk-loading v-if="loading" :loadingText="loadingText" />

    <!-- 支付密码弹窗 -->
    <wk-code-input
      ref="keywordRef"
      :value="payPassword"
      @finish="handlePasswordComplete"
    />
  </layout>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { onShow, onLoad, onUnload } from "@dcloudio/uni-app";
import EquityCard from "./components/equity-card.vue";
import {
  getUserInfoIndex as getUserInfoIndexApi,
  nowToShiFang,
  getEquityInfo as getEquityInfoApi,
  previewContractApi,
} from "@/api/user";
import { routes } from "@/config/routes";
import { cacheManager } from "@/utils/cacheManager";

const loading = ref(false);
const loadingText = ref("加载中...");
const keywordRef = ref(null);

const tradeable = ref("0");
const amount = ref("");
const payPassword = ref("");
const description = ref("");
const layoutRef = ref(null);
const sign_img = ref("");
const data = ref({});
const energy = ref(0);
// 刷新
const goPageDetail = () => {
  uni.navigateTo({
    url: routes.flowRecord + "?type=2",
  });
};
const handleRefresh = async () => {
  await getEquityInfo();
  layoutRef.value?.complete();
};

const handleCache = (result) => {
  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      icon: "none",
    });
    return;
  }
  tradeable.value = result.equity;
  data.value = result;
  description.value = result.gqsfcontent;
  energy.value = result.energy;
  loading.value = false;
};

// 获取股权信息
const getEquityInfo = async () => {
  loading.value = true;
  try {
    const result = await getEquityInfoApi();
    cacheManager.setCache("equityInfoRelease", result);
    handleCache(result);
  } catch (error) {
    loading.value = false;
    console.error("获取股权信息失败:", error);
  }
};

// 移除小数点
const removeDecimalPoint = (e) => {
  const value = e.detail.value;
  setTimeout(() => {
    amount.value = value.replace(/[^\d]/g, "");
  }, 100);
};

// 设置最大数量
const setMaxAmount = () => {
  amount.value = tradeable.value;
  handleRelease();
};

// 处理质押
const handleRelease = () => {
  if (!amount.value) {
    uni.$showToast({
      title: "请输入质押数量",
      icon: "none",
    });
    return;
  }

  if (Number(amount.value) > Number(tradeable.value)) {
    uni.$showToast({
      title: "质押数量不能大于可用数量",
      icon: "none",
    });
    return;
  }

  // 添加最低质押数量和整除判断
  if (Number(amount.value) < energy.value) {
    uni.$showToast({
      title: `单次最低质押数量为${energy.value}个`,
      icon: "none",
    });
    return;
  }

  if (Number(amount.value) % 10 !== 0) {
    uni.$showToast({
      title: "质押数量必须为10的整数倍",
      icon: "none",
    });
    return;
  }

  if (data.esignature == 1) {
    uni.navigateTo({
      url: routes.equityAgreement + "?isSign=true&amount=" + amount.value,
    });
  } else {
    keywordRef.value?.open();
  }
};

// 处理支付密码完成
const handlePasswordComplete = async (password) => {
  payPassword.value = password;
  if (password.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码",
      icon: "none",
    });
    return;
  }

  loading.value = true;
  loadingText.value = "质押中...";

  try {
    const result = await nowToShiFang({
      number: amount.value,
      pay_passworld: password,
      sign_img: sign_img.value,
    });

    if (result.status === 0) {
      keywordRef.value?.close();
      uni.$showModal({
        title: "提示",
        showCancel: false,
        content: result.msg,
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({
              url: routes.equityContract,
            });
          }
        },
      });
    } else {
      uni.$showToast({
        title: result.msg,
        icon: "none",
      });
    }
  } catch (error) {
    console.error("质押失败:", error);
    uni.$showToast({
      title: "质押失败",
      icon: "none",
    });
  } finally {
    loading.value = false;
  }
};

onShow(() => {
  const equityInfo = cacheManager.getCache("equityInfoRelease");
  if (equityInfo) {
    handleCache(equityInfo);
  }
  getEquityInfo();
});

onLoad(() => {
  uni.$on("onSign", (data) => {
    if (data) {
      sign_img.value = data;
      setTimeout(() => {
        keywordRef.value?.open();
      }, 100);
    }
  });
});
onUnload(() => {
  uni.$off("onSign");
});
</script>
