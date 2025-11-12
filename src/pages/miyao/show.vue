<template>
    <layout class="" navTitle="我的密钥" bgType="bg-main" >
      <view class="p-[32rpx]">
        <wk-stroke-bg shadow size="large">
          <view class="flex flex-row justify-center mb-[32rpx]">
            <image
              class="w-[196rpx] h-[196rpx]" 
              src="/static/images/base/miyao_icon.png"
              mode="scaleToFill"
            />
          </view>
          <view class="text-neutral text-center text-2xl font-bold mb-[32rpx]">
            <text>您当前的密钥</text>
          </view>
          <view  
            class="font-bold text-black text-3xl rounded-[24rpx] bg-[#F5F8FD] h-[160rpx] flex flex-row items-center justify-center px-[32rpx] mb-[48rpx]">
            <text v-if="show">{{ formatMiyao(mi_yao_str) }}</text>
            <text v-else>******</text>
          </view>
          <wk-button
            @submit="saveMiYao"
          >
            复制密钥
          </wk-button>
        </wk-stroke-bg>
        <view bgColor="transparent" class="border-[length:1rpx] border-solid border-neutral-inputBorder rounded-[24rpx] p-[32rpx] mt-[48rpx]" v-if="wx_ti_shi">
          <wk-common-tip :content="wx_ti_shi"></wk-common-tip>
        </view>
      </view>
      <wk-code-input ref="keywordRef" :value="pay_password"  @cancel="handleCancel" @finish="handleFinish"/>
      <wk-loading v-if="loading" :loadingText="loadingText" />
    </layout>
  </template>
  
  <script setup>
  import { nextTick, ref } from 'vue';
  import { onShow, onPullDownRefresh, onLoad } from "@dcloudio/uni-app";
  import { getmiyao } from "@/api/user";
  // 响应式数据
  const user_cz = ref(""); // 在操作什么
  const user_cz_i = ref(0); // 无感刷新
  const pay_password = ref("");
  const mi_yao_str = ref("");
  const wx_ti_shi = ref("");
  const show = ref(false);
  const keywordRef = ref(null);
  const loading = ref(false);
  const loadingText = ref('');
  onShow(() => {
    if (user_cz_i.value === 0) {
      user_cz.value = "首次加载";
      user_cz_i.value++;
    } else {
      user_cz.value = "无感刷新";
    }
  });
  onLoad(() => {
    nextTick(() => {
      if (keywordRef.value) {
        keywordRef.value.open();
      }
    });
  });
  onPullDownRefresh(() => {
    user_cz.value = "下拉刷新";
  });168
  const formatMiyao = (str) => {
    return str.replace(/(\d{4})(?=\d)/g, '$1 ');
  };
  const handleFinish = (value) => {
    pay_password.value = value;
    keyConfirm();
  };
  const handleCancel = () => {
    uni.navigateBack();
  };
  // 保存密钥到剪贴板
  const saveMiYao = () => {
    const copyText = mi_yao_str.value.toString();
    uni.setClipboardData({
      data: copyText,
      success: function () {
        uni.$showToast({
          title: "复制成功，请妥善保管！",
          duration: 3000,
          icon: "none",
        });
      },
    });
  };
  
  
  // 获取密钥
  const getMiYao = async () => {
    loading.value = true;
    loadingText.value = '加载中...'
  
    const res = await getmiyao({
      pay_passworld: pay_password.value,
      sortid: 1,
    })
    loading.value = false;
    if (res.status != 0 ) {
      uni.$showToast({
        icon: "none",
        title: res.msg,
        duration: 3000,
      });
    } else {
      mi_yao_str.value = res.miyao;
      wx_ti_shi.value = res.wx_ti_shi;
      show.value = true;
      pay_password.value = ""; // 清空已输入的密码
      keywordRef.value.close();
    }
  };
  
  // 数字键盘确认回调
  const keyConfirm = () => {
    if (pay_password.value.length < 6) {
      uni.$showToast({
        title: "请输入完整的支付密码！",
        duration: 3000,
        icon: "none",
      });
      return;
    }
    getMiYao();
  };
  
  </script>
  
  
  <style lang="scss" scoped>
  </style>
  
  