<template>
  <layout
    ref="layoutRef"
    navTitle="我要转让"
    bgType="bg-main"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <template #navRight>
      <view @click="handleOrder" class="flex flex-row items-center bg-white/10 rounded-full px-[24rpx] py-[8rpx]">
        <text class="text-neutral text-base">我的订单</text>
      </view>
    </template>
    <view class="px-[32rpx] pt-[28rpx] pb-[200rpx]">
      <view
        size="large"
        class="mb-[32rpx] rounded-[32rpx] py-[32rpx] flex flex-col justify-center items-center bg-card3"
      >
        <view class="flex flex-col text-center">
          <text class="text-neutral-white text-base">股权数量(个)</text>
          <text class="text-white text-2xl font-semibold mt-[10rpx]">{{
            result.nld_number || 0
          }}</text>
        </view>
      </view>
      <wk-stroke-bg 
        v-if="tabList.length > 0"
      >
        <view class="mb-[24rpx]">
          <wk-button-tabs
            className="w-full rounded-[24rpx] border-[length:1rpx] border-solid border-black/10"
            :list="tabList"
            :scrollable="false"
            @change="changeType"
            :activeStyle="{
              color: '#FFFFFF'
            }"
          />
        </view>
        <uv-form
          labelPosition="left"
          labelWidth="240rpx"
          labelAlign="left"
          labelStyle="font-size: 28rpx; color: #010101;"
        >
          <uv-form-item label="股权数量(个)">
            <uv-input
              :maxlength="20"
              v-model="model[type].input_nld"
              inputAlign="right"
              type="number"
              border="none"
              fontSize="32rpx"
              :color="$colors.DEFAULT"
              placeholder="请输入股权数量"
              placeholderStyle="font-size: 28rpx;"
              @input="handleInput"
              :customStyle="{
                fontWeight: 'semibold',
              }"
            />
            <!-- <template v-slot:right>
              <text class="text-neutral text-base">个</text>
            </template> -->
          </uv-form-item>
          <view class="w-full h-[1rpx] bg-white/10 my-[16rpx]"></view>
          <uv-form-item :label="(type == 'xian_jia' ? '自定义价格(' : '股权价格(') + symbolStore.code + ')'">
            <uv-input
              v-model="model[type].input_pric"
              inputAlign="right"
              border="none"
              type="digit"
              :color="$colors.DEFAULT"
              maxlength="10"
              fontSize="32rpx"
              :placeholder="type == 'xian_jia' ? '请输入自定义价格' : '请输入股权价格'"
              :readonly="type == 'shi_jia'"
              placeholderStyle="font-size: 28rpx;"
              @input="jisuan_1"
              :customStyle="{
                fontWeight: 'semibold',
              }"
            />
            <!-- <template v-slot:right>
              <text class="text-neutral text-base">{{ symbolStore.code }}</text>
            </template> -->
          </uv-form-item>
          <view
            v-if="type == 'xian_jia'"
            class="w-full h-[1rpx] bg-white/10 my-[16rpx]"
          ></view>

          <uv-form-item
            v-if="type == 'xian_jia'"
            label="承担人"
            prop="userInfo.sex"
            @click="showSexSelect"
          >
            <wk-picker
              style="width: 100%"
              @change="handleChangeMethod"
              :value="0"
              rangeKey="title"
              :range="methodList"
            >
              <view class="flex flex-row justify-end">
                <text
                  class="text-base text-neutral-regular"
                  v-if="currentMethodIndex == -1"
                  >请选择承担人</text
                >
                <text
                  class="text-base text-neutral font-semibold"
                  v-if="currentMethodIndex >= 0"
                  >{{ methodList[currentMethodIndex].title }}</text
                >
              </view>
            </wk-picker>
            <template v-slot:right>
              <uv-icon name="arrow-right" color="#010101" size="14"></uv-icon>
            </template>
          </uv-form-item>
          <view class="w-full h-[1rpx] bg-white/10 my-[16rpx]"></view>
          <uv-form-item label="手续费">
            <view class="w-full text-right">
              <text class="text-base text-neutral font-semibold"
                >{{ shou_xu_fei }}%</text
              >
            </view>
          </uv-form-item>
          <view class="w-full h-[1rpx] bg-white/10 my-[16rpx]"></view>
          <uv-form-item label="总价格">
            <view class="w-full text-right">
              <text class="text-base text-neutral font-semibold"
                >{{ zong_jia[type] }} {{ symbolStore.code }}</text
              >
            </view>
          </uv-form-item>
        </uv-form>
      </wk-stroke-bg>
      <view
        class="text-base leading-6 mt-[32rpx] p-[24rpx] border border-solid border-white/80 rounded-[24rpx]"
      >
        <CommonTips color="rgba(255, 255, 255, 0.80)" :content="content"></CommonTips>
      </view>
    </view>
    <!-- 按钮 -->
    <view
      v-if="result.xjjy == 1 || result.sjjy == 1"
      class="fixed bottom-0 left-0 right-0 bg-neutral-bottomBtnBg px-[32rpx] py-[16rpx]"
    >
      <wk-button type="bg" @submit="prepareSubmit">
        申请交易
      </wk-button>
    </view>
    <!-- 支付密码弹窗 -->
    <wk-code-input
      ref="keywordRef"
      :value="payPassword"
      @finish="handlePasswordComplete"
    />
    <wk-loading v-if="loading" />
  </layout>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { getTradeInfoApi, submitTradeApi } from "@/api/user";
import { routes } from "@/config/routes";
import CommonTips from "@/components/base/common-tips";
import { cacheManager } from "@/utils/cacheManager";
const symbolStore = useSymbolStore();
const model = ref({
  xian_jia: {
    input_nld: "", // 限价交易股权数量
    input_pric: "", // 限价交易自定义价格
  },
  shi_jia: {
    input_nld: "", // 市价交易股权数量
    input_pric: "", // 市价交易价格（市价时自动填入market_price）
  },
});
const zong_jia = ref({
  xian_jia: 0,
  shi_jia: 0,
});
const result = ref({});
const type = ref("xian_jia");
const currentMethodIndex = ref(0);
const payPassword = ref("");
const keywordRef = ref(null);
const loading = ref(false);
const layoutRef = ref(null);
const isRefresh = ref(false);
const methodList = ref([
  { title: "转让方支付手续费", id: 1 },
  { title: "受让方支付手续费", id: 2 },
]);
const tabList = computed(() => {
  console.log(result.value);
  const list = [];
  if (result.value.xjjy == 1) {
    list.push({ name: "限价交易", id: "xian_jia" });
  }
  if (result.value.sjjy == 1) {
    list.push({ name: "市价交易", id: "shi_jia" });
  }
  // 如果页面没有刷新，则自动选择第一个
  if (!isRefresh.value) {
    type.value = list[0]?.id;
    isRefresh.value = false;
  }
  return list;
});

const shou_xu_fei = computed(() => {
  return type.value == "xian_jia"
    ? result.value.shou_xu_fei
    : result.value.shou_xu_fei2;
});

const content = computed(() => {
  return type.value === "xian_jia"
    ? result.value.rule_str
    : result.value.rule_str2;
});

onLoad(() => {
  uni.$on("onSign", (data) => {
    if (data) {
      sign_img.value = data;
    }
  });
});
const handleRefresh = () => {
  isRefresh.value = true;
  getTradeInfo();
};
const handlePasswordComplete = (value) => {
  payPassword.value = value;
  if (payPassword.value < 6) {
    uni.showToast({
      title: "请输入完整支付密码",
      icon: "none",
    });
    return;
  }
  submitTrade();
};
const handleChangeMethod = (item) => {
  currentMethodIndex.value = item.detail.value;
};
const handleOrder = () => {
  uni.navigateTo({
    url: routes.equityOrder,
  });
};

watch(
  type,
  (newVal) => {
    if (newVal == "shi_jia") {
      // 市价交易时，自动填入市场价格
      if (type.value === "shi_jia") {
        model.value.shi_jia.input_pric = result.value.input_pric;
        // 如果已经输入了数量，重新计算总价
        if (model.value.shi_jia.input_nld) {
          zong_jia.value.shi_jia = (
            result.value.input_pric * model.value.shi_jia.input_nld
          ).toFixed(2);
        }
      }
    }
  },
  { immediate: true }
);
const changeType = (item) => {
  type.value = item.id;
};

const handleCache = (res) => {
  result.value = res;
};
const getTradeInfo = async () => {
  const res = await getTradeInfoApi();
  cacheManager.setCache("equityInfoPurchase", res);
  handleCache(res);
  layoutRef.value && layoutRef.value.complete();
};

const handleInput = (value) => {
  if (type.value === "xian_jia") {
    jisuan(value, "xian_jia");
  } else {
    jisuan(value, "shi_jia");
  }
};
const jisuan_1 = (value) => {
  let numberl = value;
  if (numberl.includes(".")) {
    const parts = numberl.split(".");
    // 如果小数点后的位数超过2，裁剪它
    if (parts[1].length > 2) {
      numberl = parts[0] + "." + parts[1].substr(0, 2);
      setTimeout(() => {
        model.value.xian_jia.input_pric = numberl;
        zong_jia.value.xian_jia = (
          model.value.xian_jia.input_nld * numberl
        ).toFixed(2);
      }, 0);
    } else {
      zong_jia.value.xian_jia = (
        model.value.xian_jia.input_nld * numberl
      ).toFixed(2);
    }
  } else {
    zong_jia.value.xian_jia = (
      model.value.xian_jia.input_nld * numberl
    ).toFixed(2);
  }
};

const jisuan = (value, type) => {
  let numberl = value;
  setTimeout(() => {
    model.value[type].input_nld = numberl.replace(/[^\d]/g, "");
    zong_jia.value[type] = (model.value[type].input_pric * numberl).toFixed(2);
  }, 0);
};

// 提交前验证
const prepareSubmit = () => {
  const currentModel = model.value[type.value];
  if (type.value === "xian_jia" && result.value.xjjy == 0) {
    uni.$showToast({
      title: "暂未开放！",
      icon: "none",
    });
    return;
  }
  if (type.value === "shi_jia" && result.value.sjyy == 0) {
    uni.$showToast({
      title: "暂未开放！",
      icon: "none",
    });
    return;
  }
  if (!currentModel.input_nld) {
    uni.$showToast({
      title: "请输入股权数量",
      icon: "none",
    });
    return;
  }

  if (Number(currentModel.input_nld) > Number(result.value.nld_number)) {
    uni.$showToast({
      title: "数量不能大于持有数量",
      icon: "none",
    });
    return;
  }

  if (type.value === "xian_jia" && !currentModel.input_pric) {
    uni.$showToast({
      title: "请输入股权单个售价",
      icon: "none",
    });
    return;
  }

  if (currentMethodIndex.value === -1) {
    uni.$showToast({
      title: "请选择承担人",
      icon: "none",
    });
    return;
  }
  keywordRef.value.open();
};

// 提交交易
const submitTrade = async () => {
  try {
    const currentModel = model.value[type.value];
    const params = {
      password: payPassword.value,
      type: type.value,
      input_nld: currentModel.input_nld,
      input_pric:
        type.value === "xian_jia"
          ? currentModel.input_pric
          : result.value.shou_xu_fei2,
      rangeListIdx:
        type.value === "xian_jia"
          ? methodList.value[currentMethodIndex.value].id
          : undefined,
      shou_xu_fei: type.value === "xian_jia" ? 2 : 1,
    };

    const res = await submitTradeApi(params);
    loading.value = false;
    if (res.status != 0) {
      uni.$showToast({
        title: res.msg,
        icon: "none",
      });
      return;
    }
    keywordRef.value.close();
    uni.$showModal({
      title: "提示",
      showCancel: false,
      content: res.msg,
      success: (resx) => {
        if (resx.confirm) {
          if (res.status == 0) {
            uni.navigateTo({
              url: routes.equityOrder,
            });
          }
        }
      },
    });
  } catch (error) {
    loading.value = false;
    uni.$showToast({
      title: error.message || "提交失败",
      icon: "none",
    });
  }
};

onShow(() => {
  const equityInfo = cacheManager.getCache("equityInfoPurchase");
  if (equityInfo) {
    handleCache(equityInfo);
  }
  getTradeInfo();
});
</script>
