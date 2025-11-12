<template>
  <!-- 内容区域 => 开始 -->
  <view class="px-[32rpx] pb-[32rpx] pt-[28rpx]">
    <!-- 头部信息 -->
    <view class="bg-card3 box-border w-full h-full rounded-[24rpx] p-[48rpx] flex flex-col items-center justify-center"
    >
      <text class="text-neutral-white/60 text-base"
        >可用余额（{{ symbolStore.code }}）</text
      >
      <text class="text-neutral-white text-4xl font-bold mt-[10rpx]">{{
        data.Memberamount
      }}</text>
    </view>
    <!-- 拼团口令 参加拼团-->
    <view v-if="type == 'apply'" class="my-[24rpx]">
      <view class="">
        <view class="text-xl flex flex-row items-center justify-between w-full">
          <text>拼团口令</text>
        </view>
      </view>
      <view
        class="mt-[24rpx] h-[112rpx] px-[32rpx] rounded-[24rpx] flex flex-row items-center bg-[#FFF]"
      >
        <input
          type="number"
          maxlength="8"
          v-model="buycode"
          class="ml-[20rpx] text-neutral-black text-2xl font-medium"
          placeholder="请输入拼团口令"
          placeholderStyle="font-weight: 400; font-size: 36rpx;"
        />
      </view>
    </view>
    <!-- 拼团人数 发起拼团-->
    <view v-if="type == 'create'" class="my-[24rpx]">
      <view class="text-xl flex flex-row items-center justify-between w-full">
        <text>拼团人数</text>
      </view>
      <view
        class="mt-[24rpx] h-[112rpx] px-[32rpx] rounded-[24rpx] flex flex-row items-center bg-[#FFF]"
      >
        <input
          class="text-neutral-black text-2xl font-medium w-full"
          type="number"
          v-model="fennum"
          maxlength="8"
          :placeholder="`请输入拼团人数(${data.groupmin}-${data.groupmax})`"
          placeholderStyle="font-weight: 400; font-size: 36rpx;"
        />
      </view>
    </view>
    <!-- 预期收益计算 -->
    <wk-stroke-bg shadow class="my-[24rpx]">
      <view class="flex flex-row items-center py-[16rpx]">
        <text class="text-neutral-regular text-lg font-bold">{{ data.member_level_name }} 会员累计收益</text>
        <text class="text-neutral-theme text-lg font-[700] ml-[16rpx]">{{ calculateTotalRevenue(data.member_level_name) }} 
          <text class="text-neutral-theme text-base font-bold">{{ symbolStore.code }}</text> 
        </text>
      </view>
      <view class="flex flex-col bg-[#F5F8FD] px-[16rpx] py-[24rpx] rounded-[32rpx]">
        <view
          v-for="item in allMemberLevels"
          class="flex flex-row items-center justify-between mb-[8rpx]"
          :key="item.id"
          :class="[
              data.member_level_name == item.name
                ? 'bg-[#9AEEDE]'
                : '',
            ]"
        >
          <view
            :class="[
              data.member_level_name == item.name
                ? 'text-neutral-black'
                : 'text-[#252C2F75]',
              'text-base mr-[16rpx] flex flex-row items-center',
            ]"
          >
            <view class="w-[90rpx]">{{ item.name }}</view>
            <view>累计收益</view>
          </view>
          <view
            :class="[
              data.member_level_name == item.name
                ? 'text-neutral-black'
                : 'text-[#252C2F75]',
              'text-lg font-bold',
            ]"
            >{{ calculateTotalRevenue(item) }} {{ symbolStore.code }}</view
          >
        </view>
      </view>
      <!-- <view class="flex flex-row items-center w-full">
        <text class="text-base text-neutral-regular"
          >您的当前等级
          <text class="text-neutral-warning text-lg font-bold">
            {{ data.member_level_name }}</text
          ></text
        >
        <text
          class="ml-[20rpx] text-neutral-theme text-sm border-solid border border-neutral-theme rounded-[6rpx] px-[6rpx]"
          @click="handleUpgradeClick"
          >如何升级VIP?</text
        >
      </view> -->
    </wk-stroke-bg>
    <wk-stroke-bg
      shadow
      v-if="
        (data.makelist && data.makelist.length > 0) ||
        (data.couponlist && data.couponlist.length > 0) ||
        data.is_insurance > 0
      "
    >
      <view
        v-if="data.is_insurance > 0"
        class="flex flex-row items-center justify-between"
      >
        <view class="flex flex-row items-center">
          <image
            class="w-[48rpx] h-[48rpx]"
            src="/static/images/product/safe.svg"
            mode="widthFix"
          ></image>
          <view class="text-neutral text-lg ml-[16rpx]">保险</view>
        </view>
        <view class="flex flex-row items-center">
          <text class="text-neutral-regular text-base"
            >费用
            {{ truncateDecimal((investment_amount * data.insurance) / 100, 2) }}
            {{ symbolStore.code }}</text
          >
        </view>
      </view>
      <view
        v-if="data.makelist && data.makelist.length > 0"
        class="flex flex-row items-center justify-between mt-[30rpx]"
      >
        <view class="flex flex-row items-center">
          <image
            class="w-[48rpx] h-[48rpx]"
            src="/static/images/product/coupon.svg"
            mode="widthFix"
          ></image>
          <view class="text-neutral text-lg ml-[16rpx]">代金券</view>
        </view>
        <view class="flex flex-row items-center" @click="handleSelectMake">
          <view class="flex flex-row items-center" v-if="!make.value">
            <view class="text-neutral-theme text-base mr-[10rpx]"
              >请选择代金券</view
            >
            <uv-icon size="26rpx" :color="$colors.theme" name="arrow-right" />
          </view>
          <view class="flex flex-row items-center" v-else>
            <text class="text-neutral-theme text-base font-bold mr-[10rpx]">{{
              make.text
            }}</text>
            <uv-icon size="26rpx" :color="$colors.theme" name="arrow-right" />
          </view>
        </view>
      </view>
      <view v-if="data.couponlist && data.couponlist.length > 0">
        <view class="flex flex-row items-center justify-between mt-[30rpx]">
          <view class="flex flex-row items-center">
            <image
              class="w-[48rpx] h-[48rpx]"
              src="/static/images/product/jiaxi.svg"
              mode="widthFix"
            ></image>
            <view class="text-neutral text-lg ml-[16rpx]">加息券</view>
          </view>
          <view class="flex flex-row items-center" @click="handleSelectCoupon">
            <view class="flex flex-row items-center" v-if="!coupon.value">
              <view class="text-neutral-theme text-base mr-[10rpx]"
                >请选择加息券</view
              >
              <uv-icon size="26rpx" :color="$colors.theme" name="arrow-right" />
            </view>
            <view class="flex flex-row items-center" v-else>
              <text class="text-neutral-theme text-base font-bold mr-[10rpx]">{{
                coupon.text
              }}</text>
              <uv-icon size="26rpx" :color="$colors.theme" name="arrow-right" />
            </view>
          </view>
        </view>
        <view
          v-if="coupon.value"
          class="text-black text-base mt-[10rpx] ml-[60rpx] text-right"
          ><text class="bg-[#9AEEDE] px-[8rpx] py-[4rpx]"
            >加息券收益 {{ numFilter(couponExtMoney)
            }}{{ symbolStore.code }}</text
          >
        </view>
      </view>
    </wk-stroke-bg>
    <!-- 特别说明 -->
    <wk-stroke-bg shadow class="my-[24rpx]" v-if="productview.specialbenefits">
      <view class="text-base" v-if="productview.specialbenefits">
        <rich-text
          class="text-neutral-black text-base"
          :nodes="productview.specialbenefits"
        />
      </view>
    </wk-stroke-bg>
    <!-- 温馨提示 -->
    <wk-stroke-bg shadow class="my-[24rpx] mb-[350rpx]" v-if="data.content">
      <text class="text-neutral-black text-base">{{ data.content }}</text>
    </wk-stroke-bg>
  </view>
  <view
    class="bg-neutral-bottomBtnBg fixed bottom-0 w-full px-[32rpx] py-[24rpx] box-border rounded-t-[48rpx]"
    style="box-shadow: -8px 16px -8px rgba(12, 12, 13, 0.05);border-top: 0.5px solid rgba(0, 0, 0, 0.10);"
  >
  <!-- 投资金额 -->
    <view
      class="mt-[24rpx] h-[120rpx] px-[32rpx] rounded-[24rpx] flex flex-col items-center justify-center bg-[#F3F5FC]"
    >
      <text class="text-black font-[400] text-[24rpx]">投资金额（{{
        symbolStore.unit
      }}）</text>
      <input
        @input="checkInput($event)"
        v-model="investment_amount"
        type="digit"
        class="text-neutral-black text-xl font-medium w-full text-center"
        :placeholder="
          (productview.qtje || 0) +
          ' ' +
          symbolStore.code +
          (productview.qtje == productview.zgje ? '' : '起投')
        "
        placeholderStyle="color: #252C2F30; font-weight: 400; font-size: 36rpx;text-align: center;"
      />
    </view>
    <view class="flex flex-row items-center justify-center py-[24rpx]">
      <view class="text-base text-[#252C2F75]"
        >最高投资金额：{{ productview.zgje || 0 }} {{ symbolStore.code }}</view>
    </view>
    <wk-button @submit="rdSubmit">立即投资</wk-button>
  </view>
  <gift-modal
    ref="giftModalRef"
    :jfproduct="jfproduct"
    @confirm="handleModalClick"
  />
  <wk-action-sheet
    title="请选择加息券"
    ref="couponRef"
    :options="couponlist"
    @select="onSelectCoupon"
  />
  <wk-action-sheet
    title="请选择代金券"
    ref="makeRef"
    :options="makelist"
    @select="onSelectMake"
  />
  <wk-code-input
    ref="keywordRef"
    :value="pay_password"
    @finish="handlePasswordComplete"
  />
  <!-- 内容区域 => 结束 -->
  <wk-modal ref="wkPopupRef" title="拼团规则">
    <uv-parse
      container-style="white-space: pre-wrap"
      :content="data.grouprules"
    ></uv-parse>
  </wk-modal>
</template>
<script setup>
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  defineProps,
  computed,
  onUnmounted,
} from "vue";
import { getDetailsV2, checkCanBuy } from "@/api/product";
import { groupbuy, joingroup, nowToMoney } from "@/api/user";
import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";
import GiftModal from "../gift_modal.vue";
import { cacheManager } from "@/utils/cacheManager";
const symbolStore = useSymbolStore();

const props = defineProps({
  productId: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
});

// 定义数据和响应式对象
const giftModalRef = ref(null);
const product_id = ref("");
const investment_amount = ref("");
const investment_amounttwo = ref(0);
const sel_insurance = ref(1);
const buycode = ref("");
const fennum = ref("");
const wkPopupRef = ref(null);
const pay_password = ref("");
const keywordRef = ref(null);
const productview = reactive({});
const jfproduct = reactive({});
const sign_img = ref("");
const couponRef = ref(null);
const makeRef = ref(null);
const coupon = reactive({});
const make = reactive({});
const address_id = ref("");
let submitLoading = false;
let checkLoading = false;
const data = reactive({});
const makelist = computed(() => {
  const list = data.makelist || [];
  const arr = list.map((item) => {
    return {
      text: item.name,
      value: item.id,
      money: item.money,
      exptime: item.exptime,
    };
  });
  return [{ text: "不使用代金券", value: 0, money: 0 }, ...arr];
});
const couponlist = computed(() => {
  const list = data.couponlist || [];
  const arr = list.map((item) => {
    return {
      text: item.name,
      value: item.id,
      money: item.money,
      exptime: item.exptime,
    };
  });
  return [{ text: "不使用加息券", value: 0, money: 0 }, ...arr];
});

const couponExtMoney = computed(() => {
  const amount = parseFloat(investment_amount.value) || 0; // 投资金额
  const baseRate = parseFloat(productview.jyrsy) || 0; // 基础收益率
  const couponRate = parseFloat(coupon.money) || 0; // 加息券利率

  // 获取当前用户的VIP额外收益率
  const currentMemberLevel = data.Memberlevels?.find(
    (level) => level.name === data.member_level_name
  );
  const vipRate = parseFloat(currentMemberLevel?.rate) || 0; // VIP额外收益率

  const days =
    productview.cycle > 0
      ? productview.shijian * productview.cycle
      : productview.shijian;

  if (!amount || !couponRate) {
    return 0;
  }

  // 判断是否为每日复利
  if (data.is_compound === 1) {
    // 每日复利计算
    const baseTotalDailyRate = (baseRate + vipRate) / 100; // 基础+VIP日利率
    const fullTotalDailyRate = (baseRate + vipRate + couponRate) / 100; // 基础+VIP+加息券日利率

    // 基础+VIP收益：本金 * (1 + (基础+VIP)日利率)^天数 - 本金
    const baseTotalFinalAmount =
      amount * Math.pow(1 + baseTotalDailyRate, days);
    const baseTotalRevenue = baseTotalFinalAmount - amount;

    // 总收益：本金 * (1 + (基础+VIP+加息券)日利率)^天数 - 本金
    const fullTotalFinalAmount =
      amount * Math.pow(1 + fullTotalDailyRate, days);
    const fullTotalRevenue = fullTotalFinalAmount - amount;

    // 加息券收益 = 总收益 - (基础+VIP)收益
    return fullTotalRevenue - baseTotalRevenue;
  } else {
    // 简单利息计算：加息券收益 = 本金 * 加息券利率 * 天数 / 100
    return (couponRate * amount * days) / 100;
  }
});

const allMemberLevels = computed(() => {
  const memberLevels = data.Memberlevels || [];
  return memberLevels;
});

const calculateTotalRevenue = (memberLevel) => {
  const amount = parseFloat(investment_amount.value) || 0; // 投资金额
  const baseRate = parseFloat(productview.jyrsy) || 0; // 基础收益率
  const vipRate = parseFloat(memberLevel.rate) || 0; // VIP额外收益率
  const days =
    productview.cycle > 0
      ? productview.shijian * productview.cycle
      : productview.shijian;

  // 总收益率（基础收益率 + VIP额外收益率）
  const totalRate = baseRate + vipRate;

  let totalRevenue = 0;

  // 判断是否为每日复利
  if (data.is_compound === 1) {
    // 每日复利计算：本金 * (1 + 日利率)^天数 - 本金
    const dailyRate = totalRate / 100; // 转换为小数
    const finalAmount = amount * Math.pow(1 + dailyRate, days);
    totalRevenue = finalAmount - amount;
  } else {
    // 简单利息计算：本金 * 利率 * 天数 / 100
    totalRevenue = (amount * totalRate * days) / 100;
  }

  return numFilter(totalRevenue);
};

onMounted(() => {
  product_id.value = props.productId;
  const cacheDetails = cacheManager.getCache(
    "productDetailsBuy" + product_id.value
  );
  if (cacheDetails) {
    handleCacheDetails(cacheDetails);
  }
  getDetails();
  uni.$on("onSign", (data) => {
    if (data) {
      sign_img.value = data;
      setTimeout(() => {
        if (keywordRef.value) {
          keywordRef.value.open();
        }
      }, 300);
    }
  });
});
onUnmounted(() => {
  uni.$off("onSign");
});

const handleUpgradeClick = () => {
  uni.navigateTo({
    url: routes.membershipLevel,
  });
};
const handleRuleShow = () => {
  wkPopupRef.value.open();
};
const handleSelectCoupon = () => {
  couponRef.value.open();
};
const onSelectCoupon = (item) => {
  Object.assign(coupon, item || {});
  couponRef.value.close();
};

const handleSelectMake = () => {
  makeRef.value.open();
};
const onSelectMake = (item) => {
  Object.assign(make, item || {});
  makeRef.value.close();
};
const handleNowToMoney = async () => {
  const params = getParams();
  const res = await nowToMoney(params);
  if (res.status === 0) {
    uni.navigateTo({
      url: routes.invest + "?path=" + routes.profile,
    });
    keywordRef.value.close();
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
};
const handleJoingroup = async () => {
  const params = getParams();
  const res = await joingroup(params);
  if (res.status === 0) {
    uni.navigateTo({
      url: routes.pinTuanJiLu + "?index=1&path=" + routes.profile,
    });
    keywordRef.value.close();
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
};
const handleGroupbuy = async () => {
  const params = getParams();
  const res = await groupbuy(params);
  if (res.status === 0) {
    uni.navigateTo({
      url: routes.pinTuanJiLu + "?path=" + routes.profile,
    });
    keywordRef.value.close();
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
};

const handlePasswordSubmit = async () => {
  if (submitLoading) return;
  submitLoading = true;
  try {
    // 发起拼团
    if (props.type == "create") {
      await handleGroupbuy();
      // 参加拼团
    } else if (props.type == "apply") {
      await handleJoingroup();
      // 直接投资
    } else {
      await handleNowToMoney();
    }
    submitLoading = false;
  } catch (err) {
    submitLoading = false;
  }
};

// 处理密码输入完成
const handlePasswordComplete = (password) => {
  pay_password.value = password;
  if (password.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      duration: 3000,
      icon: "none",
    });
    return;
  }
  handlePasswordSubmit();
};

// 处理模态框点击事件
const handleModalClick = (data) => {
  address_id.value = data.id;
  console.log("handleModalClick", data);
  if (!address_id.value) {
    uni.$showToast({
      title: "请选择收货地址",
      icon: "none",
      duration: 3000,
    });
  } else {
    giftModalRef.value.close();
    handleSign();
  }
};

// 提交投资
const rdSubmit = async () => {
  // 拼团口令
  if (props.type == "apply") {
    if (buycode.value == "") {
      uni.$showToast({
        title: "请输入拼团口令！",
        icon: "none",
        duration: 3000,
      });
      return;
    }
  }
  // 拼团人数
  if (props.type == "create") {
    if (fennum.value == "") {
      uni.$showToast({
        title: "请输入拼团人数！",
        icon: "none",
        duration: 3000,
      });
      return;
    }
    if (+fennum.value < +data.groupmin || +fennum.value > +data.groupmax) {
      uni.$showToast({
        title: `请输入拼团人数(${data.groupmin}-${data.groupmax})`,
        icon: "none",
        duration: 3000,
      });
      return;
    }
  }
  // 直接投资
  if (investment_amount.value === "") {
    uni.$showToast({ title: "请输入投资金额", icon: "none", duration: 3000 });
    return;
  }
  // 代金券 + 投资金额
  if (
    +investment_amount.value + parseInt(make.money || 0, 10) <
    +productview.qtje
  ) {
    uni.$showToast({
      title: `最低${productview.qtje} ${symbolStore.code}起投`,
      icon: "none",
      duration: 3000,
    });
    return;
  }

  // 接口预检查
  if (checkLoading) return;
  checkLoading = true;
  const res = await checkCanBuy({
    product_id: product_id.value,
    amount: investment_amount.value,
    buy_type: props.type ? "group" : "common",
    insurance: data.is_insurance > 0 ? sel_insurance.value : undefined,
    make: make.value || undefined,
    coupon: coupon.value || undefined,
    fennum: fennum.value || undefined,
    group_type: props.type
      ? props.type === "create"
        ? "create"
        : "join"
      : undefined,
    group_count: fennum.value || undefined,
    group_buy_code: buycode.value || undefined,
  });
  checkLoading = false;
  if (res.status === 0) {
    // 赠送商品
    if (productview.jfpid > 0) {
      giftModalRef.value.open();
    } else {
      handleSign();
    }
  } else {
    if (res.status == 10001) {
      uni.$showModal({
        content: res.msg,
        showCancel: true,
        success: (data) => {
          if (data.confirm) {
            uni.navigateTo({
              url: routes.recharge,
            });
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
  }
};

// 获取参数和 API 地址
const getParams = () => {
  let params = {
    amountPay: investment_amount.value,
    idPay: product_id.value,
    pwdPay: pay_password.value,
    sign_img: sign_img.value,
    make: make.value || undefined,
    coupon: coupon.value || undefined,
    fennum: fennum.value || undefined,
    buycode: buycode.value || undefined,
    address_id: address_id.value,
    insurance: data.is_insurance > 0 ? sel_insurance.value : undefined,
    rush_type: productview.is_rush_buy || 0,
  };
  return params;
};

// 处理合同签名
const handleSign = () => {
  // 是否需要合同签名
  if (data.esignature === 1) {
    const params = getParams();
    params.sign_img = "";
    sign_img.value = "";
    uni.navigateTo({
      url: routes.touZiHeTong + "?params=" + JSON.stringify(params),
    });
  } else {
    keywordRef.value.open();
  }
};

// 格式化数字，保留两位小数
const numFilter = (value) => {
  if (!value) return 0;
  return truncateDecimal(value, 2);
};

// 截取到小数点后指定的位数
const truncateDecimal = (value, decimalPlaces) => {
  const stringValue = value.toString();
  const decimalIndex = stringValue.indexOf(".");
  if (decimalIndex === -1) return stringValue;
  return stringValue.slice(0, decimalIndex + decimalPlaces + 1);
};

// 检查输入并格式化
const checkInput = (param) => {
  if (!param.detail.value) {
    investment_amount.value = "";
    return;
  }
  let value =
    parseFloat(param.detail.value) >= parseFloat(productview.zgje)
      ? parseFloat(productview.zgje)
      : parseFloat(param.detail.value);

  if (productview.hkfs === 4) {
    let numberl = value;
    nextTick(() => {
      investment_amount.value = +numberl;
    });
    let dailyInterestRate = productview.jyrsy / 100;
    let days =
      productview.cycle > 0
        ? productview.shijian * productview.cycle
        : productview.shijian;
    setTimeout(() => {
      let finalAmount =
        numberl * Math.pow(1 + dailyInterestRate, days) - numberl;
      investment_amounttwo.value = truncateDecimal(finalAmount, 2);
    }, 100);
  } else {
    let numberl = param.detail.value;
    if (numberl.includes(".")) {
      const parts = numberl.split(".");
      if (parts[1].length > 2) {
        numberl = parts[0] + "." + parts[1].substr(0, 2);
        setTimeout(() => {
          investment_amount.value = +numberl;
        }, 100);
      }
    } else {
      nextTick(() => {
        investment_amount.value = +value;
      });
    }
  }
};

const handleCacheDetails = (res) => {
  if (res.status === 0) {
    Object.assign(data, res);
    Object.assign(productview, res.productview);
    Object.assign(jfproduct, res.jfproduct);
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
};
// 获取详情
const getDetails = async () => {
  const res = await getDetailsV2({ id: product_id.value });
  console.log("getDetails", res);
  cacheManager.setCache("productDetailsBuy" + product_id.value, res);
  handleCacheDetails(res);
};

defineExpose({
  getDetails,
  handleRuleShow,
});
</script>

<style lang="scss" scoped>
.gift-bg {
  background-image: url(/static/images/product/gift_bg.png);
  background-size: 100% 100%;
}
</style>
