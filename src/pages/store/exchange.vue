<template>
  <layout navTitle="兑换商品" bgType="bg-white">
    <view class="mt-[24rpx]">
      <view class="">
        <wk-stroke-bg 
          bgColor="#9AEEDE"
          v-if="type == 0"
          shadow
          borderRadius="0"
          class="p-[30rpx] flex flex-row justify-between items-center box-border mb-[24rpx]"
        >
          <view
            class="flex flex-row justify-between items-center w-full h-full"
            v-if="!product_user"
            @click="toAddress"
          >
            <text class="text-xl font-bold">添加收货地址</text>
            <view class="text-base">
              <uni-icons type="arrowright" size="14" color="#fff"></uni-icons>
            </view>
          </view>
          <view class="flex flex-col justify-between w-full h-full" v-else>
            <view class="flex flex-row justify-between items-center mb-[20rpx]">
              <text class="text-lg">收货信息</text>
              <text @click="toAddress" class="text-black text-base underline">更换地址</text>
              <!-- <image
                @click="toAddress"
                src="/static/images/store/switch.svg"
                mode="widthFix"
                class="w-[32rpx] h-[32rpx]"
              ></image> -->
            </view>
            <view
              class="flex-col rounded-[24rpx] p-[16rpx]"
            >
              <text class="text-lg font-medium"
                >{{ form.location }} {{ product_address }}</text
              >
              <view class="flex flex-row items-center mt-[15rpx]">
                <text class="text-base">{{ product_user }}</text>
                <text class="text-base ml-[20rpx]">
                  {{
                    product_area_code
                      ? `+${product_area_code} ${product_mobile}`
                      : product_mobile
                  }}</text
                >
              </view>
            </view>
          </view>
        </wk-stroke-bg>
        <wk-stroke-bg shadow>
          <view class="px-[32rpx] flex flex-row items-center h-full">
            <image
              class="bg-black/5 w-[160rpx] h-[160rpx] rounded-[8rpx] mr-[24rpx]"
              :src="product_img"
              mode="aspectFill"
            ></image>
            <view class="flex flex-col justify-between flex-1 h-[160rpx]">
              <view class="text-base text-neutral">
                {{ product_text }}
              </view>
              <view
                v-if="product_sum"
                class="flex flex-row items-center justify-between"
              >
                <view class="flex flex-row items-center mt-[20rpx]">
                  <text class="text-2xl text-neutral mr-[5rpx] font-bold">{{
                    integral
                  }}</text>
                  <text class="text-base text-neutral ml-[5rpx]">积分</text>
                </view>
                <text class="text-neutral-regular">x{{ product_sum }}</text>
              </view>
            </view>
          </view>
        </wk-stroke-bg>
      </view>
      <view
        class="bg-neutral-bottomBtnBg fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx]"
      >
        <wk-button @submit="open_play_pass()"> 立即兑换 </wk-button>
      </view>
    </view>
    <wk-code-input ref="keywordRef" :value="password" @finish="keyConfirm" />
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, onUnmounted } from "vue";
import { routes } from "@/config/routes";
import { getDefaultAddress } from "@/api/user";
import { exchangeStore } from "@/api/index";
import { onLoad, onShow, onUnload } from "@dcloudio/uni-app";
import { cacheManager } from "@/utils/cacheManager";
const keywordRef = ref(null);

const form = reactive({
  name: "",
  phone: "",
  location: "",
  address: "",
  name_mask: "",
  phone_mask: "",
});

const localData = ref([]);
const product_text = ref("");
const product_img = ref("");
const product_sum = ref(1);
const product_id = ref("");
const password = ref("");
const product_user = ref("");
const product_mobile = ref("");
const product_area_code = ref("");
const show_p = ref(true); //显示密码用
const product_address = ref("");
const keyShow = ref(false);
const integral = ref("");
const addressId = ref("");
const loading = ref(false);
const loadingText = ref("");
const type = ref(0);

onLoad((option) => {
  product_text.value = option.product_name;
  product_img.value = option.product_img;
  product_sum.value = option.number;
  product_id.value = option.id;
  integral.value = option.integral;
  type.value = option.type;
  const cacheData = cacheManager.getCache("addressExchange");
  if (cacheData) {
    handleCache(cacheData);
  }
  getDefaultAddressData();
  uni.$on("selectedAddress", (data) => {
    // 处理传回的地址数据
    product_address.value = data.address_mask;
    product_mobile.value = data.phone_mask;
    product_user.value = data.name_mask;
    product_area_code.value = data.area_code;
    addressId.value = data.id;
    Object.assign(form, data);
  });
});

onShow(() => {
  if (!product_address.value) {
    getDefaultAddressData();
  }
});

onUnload(() => {
  uni.$off("selectedAddress");
});

const toAddress = () => {
  uni.navigateTo({
    url: routes.address,
  });
};

const handleCache = (res) => {
  Object.assign(form, res.info);
  const info = res.info || {};
  product_address.value = info.address_mask || "";
  product_mobile.value = info.phone_mask || "";
  product_user.value = info.name_mask || "";
  product_area_code.value = info.area_code || "";
  addressId.value = info.id || "";
};
const getDefaultAddressData = async () => {
  const res = await getDefaultAddress();
  cacheManager.setCache("addressExchange", res);
  handleCache(res);
};

const keyConfirm = (pwd) => {
  password.value = pwd;
  if (pwd.length < 6) {
    uni.$showToast({
      title: "请输入完整的支付密码！",
      duration: 3000,
      icon: "none",
    });
    return;
  }
  keywordRef.value.close();
  // return
  exchangeSubmit();
};

// 唤起数字键盘
const open_play_pass = () => {
  if (type.value == 0 && !addressId.value) {
    uni.$showToast({
      title: "请选择收货地址",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  keywordRef.value.open();
};

// 数字键盘---------end
const exchangeSubmit = async () => {
  loading.value = true;
  loadingText.value = "加载中...";

  const res = await exchangeStore({
    productid: product_id.value,
    name: product_user.value == form.name_mask ? form.name : product_user.value,
    pwdPay: password.value,
    phone:
      product_mobile.value == form.phone_mask
        ? form.phone
        : product_mobile.value,
    shouhuodizhi:
      product_address.value == form.address_mask
        ? form.address
        : product_address.value,
    location: form.location,
    productname: product_text.value,
    number: product_sum.value,
    area_code: product_area_code.value,
    address_id: addressId.value,
  });

  console.log(res);
  password.value = "";

  if (res.status == 0) {
    uni.$showModal({
      title: "提示",
      showCancel: false,
      content: "提交成功！等待审核",
      success: function (res) {
        if (res.confirm) {
          uni.setStorage({
            key: "dz_dh_info",
            data: JSON.stringify({
              product_user: product_user.value,
              product_mobile: product_mobile.value,
              product_address: product_address.value,
              location: form.location,
            }),
            success: function () {
              uni.redirectTo({
                url: "exchange_logs",
              });
            },
          });
        }
      },
    });
  }

  if (res.status != 0) {
    uni.$showToast({
      icon: "none",
      title: res.msg,
      duration: 3000,
    });
  }

  loading.value = false;
};
</script>

<style lang="scss"></style>
