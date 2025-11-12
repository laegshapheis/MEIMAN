<template>
    <layout
      :navTitle="form.id ? '编辑收货地址' : '新增收货地址'"
      bgType="bg-main"
    >
      <wk-stroke-bg class="px-[24rpx] py-[0rpx] mx-[32rpx] mt-[24rpx] rounded-[24rpx]">
        <uv-form
          labelWidth="140rpx"
          :labelStyle="{ color: $colors.DEFAULT, fontSize: '30rpx' }"
        >
          <uv-form-item
            v-for="item in formConfig.fields"
            :label="item.label"
            @click="() => item.func && item.func()"
            :key="item.name"
          >
            <uv-textarea
              v-if="item.type === 'textArea'"
              v-model="form[item.name]"
              :placeholder="item.placeholder"
              border="none"
              height="88"
              :textStyle="{ color: $colors.DEFAULT, fontSize: '30rpx', fontWeight: 400 }"
              :autoHeight="true"
              :customStyle="{ background: 'transparent', padding: '0 10rpx' }"
              :placeholderStyle="placeholderStyle"
              v-bind="item"
            >
            </uv-textarea>
            <uv-input
              v-else
              v-model="form[item.name]"
              border="none"
              :color="$colors.DEFAULT"
              fontSize="30rpx"
              :customStyle="{ fontWeight: 400 }"
              :placeholder="item.placeholder"
              :placeholderStyle="placeholderStyle"
              @input="(value) => handleInput(value, item)"
              v-bind="item"
            >
            <template v-slot:prefix>
              <wk-country-code-picker
                v-if="item.inputType === 'tel'"
                ref="countryCodePicker"
                :flagIcon="item.icon"
                :defaultCountry="{
                  name: '',
                  code: countryCode
                }"
                @change="handleCountryChange"
              />
            </template>
            </uv-input>
            <template v-slot:right v-if="item.rightIcon">
              <uv-icon
                :name="item.rightIcon"
                size="12"
                :color="$colors.light"
              ></uv-icon>
            </template>
          </uv-form-item>
        </uv-form>
      </wk-stroke-bg>
      <wk-stroke-bg
        class="px-[24rpx] py-[24rpx] mx-[32rpx] mt-[24rpx] flex flex-row items-center justify-between rounded-[24rpx]"
      >
        <text class="text-">设为默认</text>
        <uv-switch
          v-model="is_default"
          activeValue="1"
          inactiveValue="0"
          size="20"
          :activeColor="$colors.theme"
          inactiveColor="rgba(120, 120, 128, 0.16)"
        />
      </wk-stroke-bg>

      <view class="box-border absolute w-full bottom-0 bg-neutral-bottomBtnBg rounded-t-[16rpx] px-[32rpx] py-[24rpx]">
        <wk-button @submit="handleSubmit">
          {{ formConfig.submitButtonText }}
        </wk-button>
      </view>


      <!-- 选择省市区 -->
      <wk-address-picker ref="addressPickerRef" @confirm="handleAddressConfirm" />
      <!-- 输入支付密码 -->
      <wk-code-input ref="keywordRef" :value="pwdPay" @finish="handleFinish" />
      <wk-loading v-if="loading" :loadingText="loadingText" />
    </layout>
  </template>
  
  <script setup>
  import { onLoad } from "@dcloudio/uni-app";
  import { reactive, ref } from "vue";
  import validate from "@/utils/validate";
  import { createAddress, updateAddress } from "@/api/user";
  import { neutral as $neutral }from "@/config/colors";
  const addressPickerRef = ref(null);
  const editData = ref({
    name_mask: "",
    phone_mask: "",
    address_mask: "",
    location: "",
  });
  const pwdPay = ref("");
  const keywordRef = ref(null);
  const is_default = ref("0");
  const countryCodePicker = ref(null);
  const countryCode = ref('86');
  const loading = ref(false);
  const loadingText = ref("");


  const placeholderStyle = {
    color: $neutral.placeholder,
    fontSize: "28rpx",
  };
  const formConfig = ref({
    fields: [
      {
        name: "name",
        type: "text",
        placeholder: "请输入收件人姓名",
        label: "收件人",
        maxlength: 20,
        regexp: /[\s]/g,
      },
      {
        name: "phone",
        type: "text",
        inputType: "tel",
        placeholder: "请输入手机号码",
        label: "手机号码",
        maxlength: 20,
        regexp: /[^\d]/g,
      },
      // {
      //   name: 'location',
      //   type: 'text',
      //   placeholder: '请选择省市区',
      //   label: '所在地区',
      //   readonly: true,
      //   rightIcon: 'arrow-right',
      //   func: () => {
      //     addressPickerRef.value.open();
      //   }
      // },
      // { name: 'location', type: 'textArea', placeholder: '请输入所在地区', label: '所在地区', maxlength: 30 },
      {
        name: "address",
        type: "textArea",
        placeholder: "收货地址至少6位字符",
        label: "收货地址",
        maxlength: 60,
      },
    ],
    submitButtonText: "保存地址",
  });
  const form = reactive({
    id: "",
    name: "",
    phone: "",
    location: "",
    address: "",
  });
  onLoad((options) => {
    if (options.id) {
      editData.value = { ...options };
      form.id = options.id;
      form.location = options.location;
      form.name = options.name_mask;
      form.phone = options.phone_mask;
      form.address = options.address_mask;
      is_default.value = options.is_default;
      countryCode.value = options.area_code;
    }
  });
  const handleCountryChange = (country) => {
    countryCode.value = country.code;
  };
  const handleFinish = (value) => {
    pwdPay.value = value;
    if (pwdPay.value.length < 6) {
      uni.$showToast({
        title: "请输入完整的支付密码！",
        duration: 3000,
        icon: "none",
      });
      return;
    }
    if (form.id) {
      handleUpdateAddress({
        id: form.id,
        name:
          form.name === editData.value.name_mask
            ? editData.value.name
            : form.name,
        phone: 
          form.phone === editData.value.phone_mask
            ? editData.value.phone
            : form.phone,
        address:
          form.address === editData.value.address_mask
            ? editData.value.address
            : form.address,
        area_code: countryCode.value,
        location: form.location,
        pwdPay: pwdPay.value,
        is_default: is_default.value,
      });
    } else {
      handleCreateAddress({
        ...form,
        area_code: countryCode.value,
        pwdPay: pwdPay.value,
        is_default: is_default.value,
      });
    }
  };
  const handleCreateAddress = async (data) => {
    if (loading.value) return;
    loading.value = true;
    loadingText.value = "添加中...";
    const res = await createAddress(data);
    loading.value = false;
    if (res.status === 0) {
      uni.$showToast({
        title: "添加成功",
      });
      keywordRef.value.close();
      uni.navigateBack();
    } else {
      uni.$showToast({
        title: res.msg,
        icon: "none",
        duration: 3000,
      });
    }
  };
  const handleUpdateAddress = async (data) => {
    if (loading.value) return;
    loading.value = true;
    loadingText.value = "修改中...";
    const res = await updateAddress(data);
    loading.value = false;
    if (res.status === 0) {
      uni.$showToast({
        title: "修改成功",
      });
      uni.navigateBack();
      keywordRef.value.close();
    } else {
      uni.$showToast({
        title: res.msg,
        icon: "none",
        duration: 3000,
      });
    }
  };
  const handleInput = (value, item) => {
    if (item.regexp) {
      const sid = setTimeout(() => {
        form[item.name] = value.replace(item.regexp, "");
        clearTimeout(sid);
      }, 0);
    } else {
      form[item.name] = value;
    }
  };
  const handleAddressConfirm = (data) => {
    form.location = `${data[0].name}-${data[1].name}-${data[2].name}`;
  };
  const handleSubmit = () => {
    if (form.name === "") {
      uni.$showToast({
        title: "收件人不能为空",
        icon: "none",
      });
      return;
    }
    if (form.phone === "") {
      uni.$showToast({
        title: "请输入手机号",
        icon: "none",
      });
      return;
    }
    
    // if(form.location === '') {
    //   uni.$showToast({
    //     title: '请输入所在地区',
    //     icon: 'none'
    //   });
    //   return;
    // }
    if (form.address.length < 6) {
      uni.$showToast({
        title: "详细地址至少6位字符",
        icon: "none",
      });
      return;
    }
    keywordRef.value.open();
  };
  </script>
  
  <style lang="scss" scoped>
  ::v-deep {
    .uv-textarea__field {
      color: #fff;
    }
    .uv-form-item:not(:last-child) {
      border-bottom: 2rpx solid theme('colors.neutral.divider') !important;
    }

    .uv-form-item:not(:last-child) {
      border-bottom: 1rpx solid theme('colors.neutral.divider');
    }

    .uv-form-item__body__left {
      align-items: flex-start;
    }
    .uv-form-item__body {
      padding: 32rpx 0rpx;
    }
  }

 
  </style>
  