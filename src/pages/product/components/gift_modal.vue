<template>
  <uv-overlay :show="show" class="flex flex-col items-center justify-center">
    <wk-stroke-bg shadow bgColor="#FFFFFF" class="relative rounded-[16rpx] p-[40rpx] w-[78vw]">
      <image
        class="w-[224rpx] h-[214rpx] absolute top-[-100rpx] right-0"
        src="/static/images/product/gift_icon.png"
        mode="scaleToFill"
      />
      <view
        class="flex flex-col items-start relative text-2xl text-neutral"
      >
        <text>投资赠送 </text>
        <text class="text-neutral text-2xl">{{
          jfproduct.title
        }}</text>
      </view>
      <view class="flex flex-row items-center justify-center">
        <image
          class="w-[200rpx] h-[200rpx] rounded-[20rpx] mt-[20rpx]"
          :src="jfproduct.image"
          mode="wihdthFix"
        />
      </view>
      <view
        class="bg-[#F3F5FC] rounded-[16rpx] py-[16rpx] box-border flex flex-col w-full mt-[20rpx] items-center"
      >
        <view
          v-if="!form.address_mask"
          class="flex-col items-center text-center"
          @click.stop="toAddress"
        >
          <text class="text-neutral-secondary text-base">暂无地址</text>
          <view class="flex flex-row items-center mt-[10rpx]">
            <text class="text-neutral-theme text-base mr-[10rpx]"
              >选择或添加收货地址</text
            >
            <uv-icon
              name="arrow-right"
              :color="$colors.theme"
              size="12"
            ></uv-icon>
          </view>
        </view>
        <view
          class="flex flex-col items-center mt-[10rpx] w-full justify-center"
          v-else
        >
          <view
            class="w-full flex flex-col justify-center px-[32rpx] box-border"
            @click.stop="toAddress"
          >
            <text class="text-neutral text-base mb-[10rpx]">{{
              form.name_mask
            }}</text>
            <text class="text-neutral text-base mb-[10rpx]">
              {{
                form.area_code
                  ? `+${form.area_code} ${form.phone_mask}`
                  : form.phone_mask
              }}
            </text>
            <view class="text-neutral text-base w-full line-clamp-2"
              >{{ form.location }} {{ form.address_mask }}</view
            >
          </view>
          <view
            class="h-[60rpx] flex flex-row items-center relative mt-[16rpx] leading-5"
            v-if="form.address_mask"
            @click.stop="toAddress"
          >
            <text class="text-neutral-theme text-base ml-[15rpx]"
              >更换地址</text
            >
            <uv-icon
              name="arrow-right"
              :color="$colors.theme"
              size="28rpx"
            ></uv-icon>
          </view>
        </view>
      </view>
      <view class="flex flex-col w-full items-center mt-[20rpx]">
        <wk-button class="w-full" @submit="$emit('confirm', form)">
          确定
        </wk-button>
        <view class="flex flex-col items-center mt-[20rpx]">
          <text class="text-neutral-regular text-base text-center">
            {{ jfproduct.tips }}
          </text>
        </view>
      </view>
      <view class="absolute bottom-[-90rpx] left-0 right-0 w-[70rpx] h-[70rpx] mx-auto rounded-[50%] bg-[#FFFFFF]/80 flex items-center justify-center z-index-1" @tap="close">
          <uv-icon name="close" color="#000" size="16"></uv-icon>
        </view>
    </wk-stroke-bg>
  </uv-overlay>
</template>

<script setup>
import {
  ref,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
  onActivated,
  reactive,
} from "vue";
import { routes } from "@/config/routes";
import { getDefaultAddress as getDefaultAddressApi } from "@/api/user";

defineProps({
  jfproduct: {
    type: Object,
    default: () => ({}),
  },
});
const show = ref(false);
const form = reactive({
  id: "",
  name_mask: "",
  phone_mask: "",
  location: "",
  address_mask: "",
});
const toAddress = () => {
  uni.navigateTo({
    url: routes.address,
  });
};

// 获取默认地址
const getDefaultAddress = async () => {
  if (form.id) return;
  const res = await getDefaultAddressApi();
  if (res.status === 0) {
    Object.assign(form, res.info);
  } else {
    uni.$showToast({
      title: res.msg,
      icon: "none",
      duration: 3000,
    });
  }
};
const open = () => {
  show.value = true;
};
const close = () => {
  show.value = false;
};
onActivated(() => {
  getDefaultAddress();
});
onMounted(() => {
  getDefaultAddress();
  uni.$on("selectedAddress", (data) => {
    // 处理传回的地址数据
    Object.assign(form, data);
  });
});
onUnmounted(() => {
  uni.$off("selectedAddress");
});
const $emit = defineEmits(["confirm"]);

defineExpose({
  open,
  close,
});
</script>

<style lang="scss" scoped>
.gift-bg {
  background-image: url(/static/images/product/gift_bg.png);
  background-size: 100% 100%;
}
</style>
