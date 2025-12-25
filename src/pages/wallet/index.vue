<template>
    <layout navTitle="提现管理" bgType="bg-main2" :isLottie="false">
      <view class="px-page-x pt-page-y pb-[30rpx] box-border w-full flex flex-col">
        <view class="flex flex-col items-center">
          <!-- USDT -->
          <UsdtWallet
            v-if="userInfo.istxusdt == 1"
            :is-empty="userInfo.isusdt == 0"
            :usdt-chain="userInfo.usdtlian"
            :usdt-address="userInfo.usdtadr"
            @edit="edit('usdt')"
            class="bg-black"
          />
  
          <!-- 支付宝 -->
          <AlipayWallet
            v-if="userInfo.iszfb == 1"
            :is-empty="userInfo.isalipay == 0"
            :real-name="userInfo.realname"
            :account="userInfo.email"
            @edit="edit('alipay')"
            class="mt-[30rpx]"
          />
  
          <!-- 微信 -->
          <WechatWallet
            v-if="userInfo.weixin_switch == 1"
            :is-empty="userInfo.is_weixin_pay == 0 || userInfo.is_weixin_pay == null"
            real-name="微信支付"
            :account="userInfo.realname"
            @edit="edit('wechat')"
            class="mt-[30rpx]"
          />
  
          <!-- 银行卡 -->
          <BankWallet
            v-if="userInfo.isyhk == 1"
            :bank-list="userInfo.bank_list"
            :real-name="userInfo.realname"
            :can-add-more="userInfo.remain_bank_count > 0"
            @edit="edit('bank')"
            class="mt-[30rpx]"
          />
        </view>
  
        <view
          class="text-base leading-6 my-[48rpx] rounded-[24rpx] p-[32rpx] bg-[#0C052F]"
          style="border: 1rpx solid #00000020;"
          v-if="userInfo.istxusdt == 1 || userInfo.iszfb == 1"
        >
          <CommonTips
            :content="userInfo.bankcontent"
          ></CommonTips>
        </view>
      </view>
      <wk-loading v-if="loading" :loadingText="loadingText" />
    </layout>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { onLoad, onShow } from "@dcloudio/uni-app";
  import { navigateTo } from "@/utils/navigation";
  import { routes } from "@/config/routes";
  import CommonTips from "@/components/base/common-tips";
  import { getUserInfo as getUserInfoApi } from "@/api/user";
  
  // 导入钱包组件
  import UsdtWallet from './components/UsdtWallet.vue'
  import AlipayWallet from './components/AlipayWallet.vue'
  import WechatWallet from './components/WechatWallet.vue'
  import BankWallet from './components/BankWallet.vue'
  import { cacheManager } from "@/utils/cacheManager";
  
  const cacheData = cacheManager.getCache("wallet");
  onShow(() => {
    if (cacheData) {
      handleUserInfo(cacheData);
    }
    getUserInfo();
  });
  
  const userInfo = ref({});
  const loading = ref(false);
  const loadingText = ref('');
  
  const handleUserInfo = (result) => {
    if (result.status && result.status != 0) {
        loading.value = false;
        return;
      }
      userInfo.value = result;
      loading.value = false;
  }
  
  const getUserInfo = async (showLoading = true) => {
    if (showLoading) {
      loading.value = true;
      loadingText.value = '加载中...'
    }
  
    try {
      const result = await getUserInfoApi();
      cacheManager.setCache("wallet", result);
      handleUserInfo(result);
    } catch (e) {
      loading.value = false;
    }
  };
  
  const edit = (type) => {
    navigateTo(routes.walletEdit + "?type=" + type);
  };
  </script>
  
  <style lang="scss" scoped></style>
  