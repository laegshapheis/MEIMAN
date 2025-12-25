<template>
  <view v-if="productview.id" class="mt-[28rpx] pb-[150rpx]">
    <view class="mb-[24rpx] rounded-[16rpx] overflow-hidden mx-[32rpx]" style="aspect-ratio: 2/1;">
      <uv-image
        :src="productview.pic"
        width="100%"
        height="100%"
        mode="aspectFill"
      />
    </view>
    <view class="px-[32rpx] box-border">
      <!-- 产品信息 -->
      <ProductDetailInfo :productview="productview" />
      <!-- 购买数量 -->
      <ProjectBuy :productview="productview" v-model:quantity="quantity" />
      <!-- 代金券 -->
      <ProjectCoupon
        v-if="data.makelist && data.makelist.length > 0"
        :data="data"
        @update:coupon="onUpdateCoupon"
      />
      <!-- 投资相关 -->
      <ProductSections :data="data" />
      <!-- 项目介绍 -->
      <!-- <ProjectIntroduce
      :productview="productview"
    /> -->
      <!-- 项目详情 -->
      <!-- <ProjectDetails
      :productview="productview"
    /> -->

      <!-- 底部操作栏 -->
      <BottomAction
        :productview="productview"
        :type="type"
        :btn-text="btnText"
        @submit="handleSubmit"
        @finish="onTimeFinish"
      />
      <!-- 礼物弹窗 -->
      <gift-modal
        ref="giftModalRef"
        :jfproduct="jfproduct"
        @confirm="handleModalClick"
      />
      <wk-code-input
        ref="keywordRef"
        :value="pay_password"
        @finish="handlePasswordComplete"
      />
      <wk-loading :show="loading" />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { routes } from "@/config/routes";
import ProductDetailInfo from "./ProductDetailInfo.vue";
import ProductSections from "./product-sections.vue";
import ProjectDetails from "./ProjectDetails.vue";
import ProjectIntroduce from "./ProjectIntroduce.vue";
import ProjectBuy from "./ProjectBuy.vue";
import BottomAction from "./BottomAction.vue";
import ProjectCoupon from "./ProjectCoupon.vue";
import { buyProduct } from "@/api/product";
import GiftModal from "../gift_modal.vue";

const emit = defineEmits(["onSubmit", "onTimeFinish"]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: "", // apply 参与拼团, create 发起拼团
  },
  btnText: {
    type: String,
    default: "",
  },
});
const giftModalRef = ref(null);
const coupon = ref({});
const quantity = ref(1);
const pay_password = ref("");
const keywordRef = ref(null);
const loading = ref(false);
const address_id = ref("");
const productview = computed(() => props.data.productview || {});
const jfproduct = computed(() => props.data.jfproduct || {});
const btnText = computed(() => {
  // 通用按钮提示
  if (productview.value.xmjd >= 100) {
    return "项目已投满";
  }
  if (productview.value.presale == 1) {
    return "暂未开放";
  }
  // 自定义外部按钮文字
  return props.btnText || "";
});
// 处理模态框点击事件
const handleModalClick = (data) => {
  address_id.value = data.id;
  if (!address_id.value) {
    uni.$showToast({
      title: "请选择收货地址",
      icon: "none",
      duration: 3000,
    });
  } else {
    giftModalRef.value.close();
    keywordRef.value.open();
  }
};
const handlePasswordComplete = (value) => {
  pay_password.value = value;
  if (pay_password.value.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      duration: 3000,
      icon: "none",
    });
    return;
  }
  handleBuy();
};

const handleBuy = async () => {
  loading.value = true;
  const res = await buyProduct({
    amountPay: productview.value.qtje * quantity.value,
    idPay: productview.value.id,
    pwdPay: pay_password.value,
    num: quantity.value,
    make: coupon.value.value,
    address_id: address_id.value,
  });
  console.log("res", res);
  if (res.status == 0) {
    keywordRef.value.close();
    uni.navigateTo({
      url: routes.equity,
    });
    // uni.$showModal({
    //   title: "提示",
    //   showCancel: false,
    //   content: res.msg,
    //   success: (res) => {
    //     if (res.confirm) {
    //       uni.switchTab({
    //         url: routes.profile,
    //       })
    //     }
    //   }
    // })
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
  loading.value = false;
};
const onUpdateCoupon = (item) => {
  coupon.value = item;
};
const onTimeFinish = () => {
  emit("onTimeFinish");
};
const handleSubmit = () => {
  // 通用业务
  const productView = productview.value || {};
  if (productView.xmjd >= 100) {
    return;
  }
  if (productView.presale === 1) {
    uni.$showToast({
      title: "暂未开放",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  if (productView.jfpid > 0) {
    console.log("productView.jfpid", productView);
    giftModalRef.value.open();
  } else {
    keywordRef.value.open();
  }
};
</script>

<style lang="scss" scoped></style>
