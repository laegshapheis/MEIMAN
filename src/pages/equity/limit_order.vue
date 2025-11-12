<template>
  <layout navTitle="限价交易" bgType="bg-main">
    <view class="px-[32rpx] pt-[28rpx]">
      <wk-stroke-bg
      >
        <uv-form labelPosition="left" labelWidth="180rpx" labelAlign="left" labelStyle="font-size: 28rpx; color: #010101;">
          <uv-form-item label="股权数量">
            <uv-input
              :maxlength="20"
              v-model="inp_val_num"
              inputAlign="right"
              type="number"
              border="none"
              readonly
              :color="$colors.DEFAULT"
              fontSize="32rpx"
              placeholder="请输入股权数量"
              placeholderStyle="color: rgba(255, 255, 255, 0.50); font-size: 28rpx;"
              :customStyle="{
                fontWeight: 'bold',
              }"
            />
            <template v-slot:right>
              <text class="text-neutral text-base font-semibold">个</text>
            </template>
          </uv-form-item>
          <view class="w-full h-[1rpx] bg-[#EBF6F0] my-[16rpx]"></view>
          <uv-form-item
            :label="type == 'xian_jia' ? '自定义价格' : '股权价格'"
          >
            <uv-input
              v-model="inp_val_price"
              inputAlign="right"
              border="none"
              type="digit"
              maxlength="10"
              :color="$colors.DEFAULT"
              fontSize="30rpx"
              placeholder="请输入股权单个售价"
              :readonly="type == 'shi_jia'"
              placeholderStyle="color: rgba(255, 255, 255, 0.50); font-size: 28rpx;" 
              @input="inputChange"
              :customStyle="{
                fontWeight: '600',
              }"
            />
            <template v-slot:right>
              <text class="text-neutral text-base font-semibold">{{ symbolStore.code }}</text>
            </template>
          </uv-form-item>
          <view class="w-full h-[1rpx] bg-[#EBF6F0] my-[16rpx]"></view>
          <uv-form-item
            v-if="type == 'xian_jia'"
            label="承担人"
            prop="userInfo.sex"
            >
            <wk-picker
              ref="pickerRef"
              style="width: 100%"
              @change="handleChangeMethod"
              :value="currentMethodIndex"
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
              <uv-icon name="arrow-right" color="#fff" size="28rpx"></uv-icon>
            </template>
          </uv-form-item>
        </uv-form>
        <view class="w-full h-[1rpx] bg-[#EBF6F0] my-[16rpx]"></view>
        <view class="flex flex-row justify-between mt-[20rpx]">
          <view class="flex-shrink-0 w-[200rpx] text-neutral text-base"
            >
            <text class="text-base text-neutral-regular">手续费：</text>
            <text class="text-base text-neutral font-semibold">{{ shouxufeiitshi }}</text>
            </view
          >
          <view class="text-neutral text-base font-medium ml-[20rpx]"
            >总价格：{{ totle_nuber }} {{ symbolStore.code }}</view
          >
        </view>
      </wk-stroke-bg>
    </view>
    <!-- 按钮 -->
    <view
      v-if="result.xjjy == 1 || result.sjjy == 1"
      class="px-[32rpx] mt-[44rpx]"
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
import { ref, reactive, onMounted, nextTick, computed } from "vue";
import { useSymbolStore } from "@/stores/symbolStore";
import { getTradeInfo, equitySaveApi } from "@/api/user";
import CommonTips from "@/components/base/common-tips.vue";
import { onLoad } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
// store
const symbolStore = useSymbolStore();

// 数据
const totle_nuber = ref(0);
const inp_val_num = ref("");
const inp_val_price = ref("");
const rule_str = ref("");
const keyShow = ref(false);
const quote = ref(""); // 股价格
const id = ref("");
const shouxufei = ref("");
const shouxufeiitshi = ref("");
const value = ref(1);
const keywordRef = ref(null);
const loading = ref(false);
const payPassword = ref("");
const fee_type = ref(0);
const type = ref("xian_jia");
const pickerRef = ref(null);
const result = reactive({
  nld_number: 0,
  xjjy: 1,
  sjjy: 1,
});
const methodList = ref([
  { title: "转让方支付手续费", value: 1 },
  { title: "受让方支付手续费", value: 2 },
]);
const currentMethodIndex = ref(0);

// 生命周期钩子
onLoad((options) => {
  id.value = options.id;
  getRule(options.id);
});

// 唤起数字键盘
const open_play_pass = (type_str) => {
  if (inp_val_price.value == "") {
    uni.$showToast({ title: "请输入售价", duration: 3000, icon: "none" });
    return;
  }

  if (
    Math.round(inp_val_price.value * 100) / 100 <
    Math.round(quote.value * 100) / 100
  ) {
    uni.$showToast({
      title: "售价格低于" + quote.value + symbolStore.code,
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (value.value == 0) {
    uni.$showToast({ title: "选择手续费承担人", duration: 3000, icon: "none" });
    return;
  }
  keywordRef.value.open();
};

// 输入变化
const inputChange = (val) => {
  if (val.length > 0) {
    nextTick(() => {
      inp_val_price.value = val.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      changeprice();
    });
  }
};

// 提交
const popTip = async () => {
  loading.value = true;
  const res = await equitySaveApi({
    id: id.value,
    sortid: 1,
    price: inp_val_price.value,
    fee: value.value,
    password: payPassword.value,
  });
  if (res.status != 0) {
    uni.$showToast({ title: res.msg, duration: 3000, icon: "none" });
    loading.value = false;
    return;
  }
  payPassword.value = "";
  keywordRef.value.close();
  uni.$showModal({
    title: "提示",
    showCancel: false,
    content: res.msg,
    success: function (res) {
      if (res.confirm) {
        uni.redirectTo({ url: routes.equityTrade });
      }
    },
  });
  loading.value = false;
};

// 价格变化
const changeprice = () => {
  let emoney = 0;
  if (value.value != 1) {
    emoney = (inp_val_num.value * inp_val_price.value * shouxufei.value) / 100;
  }
  totle_nuber.value = inp_val_num.value * inp_val_price.value + emoney;
};

// 获取规则
const getRule = (id) => {
  getTradeInfo({ id: id }).then((res) => {
    console.log(res);
    fee_type.value = res.data.fee_type;
    quote.value = res.data.quote;
    inp_val_num.value = res.data.number;
    rule_str.value = res.data.equitycontent;
    shouxufei.value = res.data.shouxufei;
    shouxufeiitshi.value = res.data.shouxufei + "%";
    // 交易中 修改价格
    if (res.data.status == 3) {
      inp_val_price.value = res.data.buyprice;
      if (fee_type.value == 2) {
        value.value = 2;
        currentMethodIndex.value = 1;
        pickerRef.value.setIndexs([1]);
      } else {
        value.value = 1;
        currentMethodIndex.value = 0;
        pickerRef.value.setIndexs([0]);
      }
      totle_nuber.value = res.data.totle;
    }
    uni.hideLoading();
  });
};

// 新增的方法
const handleOrder = () => {
  uni.navigateTo({
    url: "/pages/equity/order_list",
  });
};

const handleChangeMethod = (e) => {
  currentMethodIndex.value = e.detail.value;
  value.value = methodList.value[currentMethodIndex.value].value;
};

const prepareSubmit = () => {
  // 准备提交
  open_play_pass();
};

const handlePasswordComplete = (password) => {
  payPassword.value = password;
  if (payPassword.value.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      duration: 3000,
      icon: "none",
    });
    return;
  }
  // 处理密码完成后的逻辑
  popTip();
};
</script>
