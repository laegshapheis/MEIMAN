<template>
  <view class="flex flex-col px-[0rpx] py-[0rpx]">
    <!-- 开户人姓名 -->
    <view class="flex flex-row items-center justify-between mb-[10rpx]">
      <text class="text-base text-neutral leading-6 font-medium">开户人姓名</text>
    </view>

    <view class="flex flex-row items-center justify-center h-[96rpx] input-bg3  border-[length:1rpx] border-neutral-divider border-solid rounded-[24rpx]" >
      <uv-input
        class="h-[96rpx]"
        v-model="formData.bankrealname"
        type="text"
        placeholder="请输入银行卡姓名"
        readonly
        border="0"
        :placeholderStyle="{
          color: $colors.placeholder,
          fontSize: '28rpx',
          fontWeight: 'normal',
        }"
        :customStyle="{
          padding: '0 24rpx',
          fontWeight: 'bold',
        }"
        fontSize="28rpx"
        :color="$colors.DEFAULT"
      />
    </view>

    <!-- 银行选择 -->
    <view class="flex flex-row items-center justify-between mb-[10rpx] mt-[24rpx]">
      <text class="text-base text-neutral leading-6 font-medium">请输入银行名称</text>
    </view>
    <view class="box-border py-[12rpx] flex flex-row items-center justify-center min-h-[96rpx] input-bg3 border-[length:1rpx] border-neutral-divider border-solid rounded-[24rpx]">
      <uv-input
        v-model="formData.bankname"
        type="text"
        maxlength="40"
        placeholder="请输入银行名称"
        :autoHeight="true"
        :formatter="formatBankName"
        :customStyle="{
          backgroundColor: 'transparent',
          color: $colors.DEFAULT,
          padding: '0 24rpx',
        }"
        border="0"
        :textStyle="{
          fontSize: '28rpx',
          color: $colors.DEFAULT,
          fontWeight: 'bold',
        }"
        :placeholderStyle="{
          color: $colors.placeholder,
          fontSize: '24rpx',
          fontWeight: 'normal',
        }"
      />
    </view>
    <!-- <view class="flex flex-row items-center h-[96rpx] bg-[#FFFFFF] rounded-[16rpx]">
      <wk-picker
        @change="onChangeBank"
        title="其它银行请联系客服协助绑定"
        :value="bankIndex"
        rangeKey="title"
        :range="cardlist"
        style="width: 100%"
      >
        <view class="flex flex-row justify-between px-[32rpx] box-border">
          <text class="text-lg text-neutral-secondary" v-if="bankIndex == -1">请选择</text>
          <text class="text-lg font-bold text-neutral" v-if="bankIndex >= 0">{{ cardlist[bankIndex] }}</text>
          <view class="flex flex-row items-center">
            <uv-icon size="24rpx" :color="$colors.secondary" name="arrow-right"></uv-icon>
          </view>
        </view>
      </wk-picker>
    </view> -->

    <!-- 银行卡号 -->
    <view class="flex flex-row items-center justify-between mb-[10rpx] mt-[24rpx]">
      <text class="text-base text-neutral leading-6 font-medium">银行卡号</text>
    </view>

    <view class="flex flex-row items-center justify-center h-[96rpx] input-bg3 border-[length:1rpx] border-[#2A877C33] border-solid rounded-[24rpx]">
      <uv-input
        class="h-[96rpx]"
        v-model="formData.bankcode"
        type="text"
        maxlength="30"
        :formatter="formatBankCode"
        placeholder="请输入银行卡号"
        border="0"
        :placeholderStyle="{
          color: $colors.placeholder,
          fontSize: '24rpx',
          fontWeight: 'normal',
        }"
        :customStyle="{
          padding: '0 24rpx',
          fontWeight: 'bold',
          color: $colors.DEFAULT,
        }"
        
        fontSize="28rpx"
        :color="$colors.DEFAULT"
        @input="handleBankCodeInput"
      />
    </view>

    <!-- 开户城市 -->
    <!-- <view class="flex flex-row items-center justify-between mb-[10rpx] mt-[24rpx]">
      <text class="text-base leading-6 font-medium">开户城市</text>
    </view>

    <view class="flex flex-row items-center h-[96rpx] bg-[#FFFFFF] rounded-[16rpx]" @click="$emit('openAddressSelect')">
      <view class="flex flex-row justify-between w-[100%] px-[32rpx]">
        <text class="text-lg text-neutral-secondary" v-if="!formData.ssxzStr">请选择</text>
        <text class="text-lg font-bold text-neutral" v-if="formData.ssxzStr">{{ formData.ssxzStr }}</text>
        <view class="flex flex-row items-center">
          <uv-icon size="24rpx" :color="$colors.secondary" name="arrow-right"></uv-icon>
        </view>
      </view>
    </view> -->

    <!-- 开户行 -->
    <view class="flex flex-row items-center justify-between mb-[10rpx] mt-[24rpx]">
      <text class="text-base text-neutral leading-6 font-medium">开户行</text>
    </view>

    <view class="box-border py-[12rpx] flex flex-row items-center justify-center min-h-[102rpx] input-bg3 border-[length:1rpx] border-neutral-divider border-solid rounded-[24rpx]">
      <uv-input
        v-model="formData.bankaddress"
        type="text"
        placeholder="请输入开户行支行地址(选填)"
        :autoHeight="true"
        maxlength="70"
        :formatter="formatName"
        :customStyle="{
          backgroundColor: 'transparent',
          color: $colors.DEFAULT,
          padding: '0 24rpx',
        }"
        border="0"
        :textStyle="{
          fontSize: '28rpx',
          color: $colors.DEFAULT,
          fontWeight: 'bold',
        }"
        :placeholderStyle="{
          color: $colors.placeholder,
          fontSize: '24rpx',
          fontWeight: 'normal',
        }"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import ValidateUtils from "@/utils/validate";

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  cardlist: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:formData', 'openAddressSelect']);

const bankIndex = ref(-1);

const handleBankCodeInput = (value) => {
  // 限制银行卡号最多19位
  setTimeout(() => {
    emit('update:formData', { ...props.formData, bankcode: value.slice(0, 30) });
  }, 10);
};

const onChangeBank = (e) => {
  bankIndex.value = e.detail.value;
  emit('update:formData', { ...props.formData, bankname: props.cardlist[e.detail.value] });
};

const formatBankName = (val) => {
  const name = val.trim();
  if (name.length > 40) {
    name = name.substring(0, 40);
  }
  return name;
};
const formatName = (val) => {
  let name = val.trim();
  if (name.length > 70) {
    name = name.substring(0, 70);
  }
  return name;
};

const formatBankCode = (val) => {
  // 移除所有非数字字符
  return val.replace(/[^\d]/g, '');
};

const validate = () => {
  if (!props.formData.bankname) {
    uni.$showToast({
      title: "请输入银行名称",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  if (!props.formData.bankcode) {
    uni.$showToast({
      title: "请输入银行卡号",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  // if (!ValidateUtils.isValidBankCardFormat(props.formData.bankcode)) {
  //   uni.$showToast({
  //     title: "银行卡号必须是16位到19位之间",
  //     duration: 3000,
  //     icon: "none",
  //   });
  //   return false;
  // }

  // if (!props.formData.ssxzStr) {
  //   uni.$showToast({
  //     title: "选择开户行所在城市：省/市/县",
  //     duration: 3000,
  //     icon: "none",
  //   });
  //   return false;
  // }

  // const reg_name = /^[\u4e00-\u9fa5]+$/;
  // if (!props.formData.bankaddress || !reg_name.test(props.formData.bankaddress)) {
  //   uni.$showToast({
  //     title: "开户行格式不正确",
  //     duration: 3000,
  //     icon: "none",
  //   });
  //   return false;
  // }

  return true;
};

defineExpose({
  validate
});
</script> 

<style lang="scss" scoped>

</style>