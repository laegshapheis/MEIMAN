<template>
  <layout navTitle="市价交易" bgType="bg-main">
    <view class="px-[32rpx] py-[28rpx]">
      <wk-stroke-bg>
        <uv-form labelPosition="left" labelWidth="160rpx" labelAlign="left" labelStyle="font-size: 28rpx; color: #fff;">
          <uv-form-item label="股权数量">
            <uv-input
              :maxlength="20"
              v-model="inp_val_num"
              inputAlign="right"
              type="number"
              border="none"
              readonly
              placeholder="请输入股权数量"
              placeholderStyle="color: rgba(255, 255, 255, 0.50); font-size: 28rpx;"
            />
            <template v-slot:right>
              <text class="text-neutral text-base">个</text>
            </template>
          </uv-form-item>
          <view class="w-full h-[1rpx] bg-[#042D63] my-[16rpx]"></view>
          <uv-form-item
            label="股权价格"
          >
            <uv-input
              v-model="inp_val_price"
              inputAlign="right"
              border="none"
              type="digit"
              maxlength="10"
              readonly
              placeholder="请输入股权单个售价"
              placeholderStyle="color: rgba(255, 255, 255, 0.50); font-size: 28rpx;"
            />
            <template v-slot:right>
              <text class="text-neutral text-base">{{ symbolStore.code }}</text>
            </template>
          </uv-form-item>
        </uv-form>
        <view class="w-full h-[1rpx] bg-[#042D63] my-[16rpx]"></view>
        <view class="flex flex-row justify-between mt-[20rpx]">
          <view class="flex-shrink-0 w-[200rpx] text-neutral-regular text-base"
            >手续费：{{ shouxufeiitshi }}</view
          >
          <view class="text-neutral-regular text-base ml-[20rpx]"
            >总价格：{{  parseFloat(parseFloat(inp_val_price) * parseFloat(inp_val_num)).toFixed(2)
          }} {{ symbolStore.code }}</view
          >
        </view>
      </wk-stroke-bg>
      <view class="text-base leading-6 mt-[20rpx]">
        <CommonTips :color="$colors.DEFAULT" :content="rule_str"></CommonTips>
      </view>
    </view>
    <!-- 按钮 -->
    <view
      v-if="result.xjjy == 1 || result.sjjy == 1"
      class="px-[32rpx] py-[44rpx]"
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
import { ref, reactive } from "vue";
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

const type = ref("shi_jia");
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
  keywordRef.value.open();
};

// 提交
const popTip = async () => {
  loading.value = true;
  const res = await equitySaveApi({
    id: id.value,
    password: payPassword.value,
  });
  if (res.status != 0) {
    uni.$showToast({ title: res.msg, duration: 3000, icon: "none" });
    loading.value = false;
    return;
  }
  payPassword.value = "";
  uni.$showModal({
    title: "提示",
    showCancel: false,
    content: res.msg,
    success: function (res) {
      if (res.confirm) {
        uni.navigateTo({
          url: routes.profile,
        });
      }
    },
  });
  loading.value = false;
};


// 获取规则
const getRule = (id) => {
  getTradeInfo({ id: id }).then((res) => {
    console.log(res);
    quote.value = res.data.quote;
    inp_val_num.value = res.data.number;
    inp_val_price.value = res.data.xtquote;
    rule_str.value = res.data.equitycontent;
    shouxufei.value = res.data.scjysxf;
    shouxufeiitshi.value = res.data.scjysxf + "%";
    
  });
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
