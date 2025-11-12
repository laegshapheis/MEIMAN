<template>
  <layout navTitle="地址管理"  bgType="bg-main">
    <!-- <template v-if="isChoice != 1" v-slot:navRight>
      <text class="text-sm text-white">点击地址选择</text>
    </template> -->
    <scroll-view scroll-y>
      <uv-radio-group v-if="addressList.length != 0" class="px-[32rpx] mt-[24rpx]" @change="change"
        v-model="is_default">
        <wk-stroke-bg v-for="item in addressList" :key="item.id" class="mb-[16rpx] w-full flex flex-col"
        >
          <view @click="selectAddress(item)" class="flex flex-col">
            <view :class="['flex flex-row items-center', selectId == item.id ? 'text-theme' : '']">
              <text class="text-base">{{ item.name_mask }}</text>
              <text class="text-base ml-[20rpx]">{{ `+${item.area_code} ${item.phone_mask}` }}</text>
            </view>
            <text :class="['text-lg mt-[10rpx] font-medium', selectId == item.id ? 'text-theme' : '']">{{ item.location }} {{
              item.address_mask }}</text>
          </view>
          <view class="h-[2rpx] bg-neutral-divider my-[24rpx]"></view>
          <view class="flex flex-row items-center justify-between">
            <uv-radio shape="square" :name="item.id" :inactiveColor="$colors.secondary" :activeColor="$colors.theme" iconColor="#fff"
              :label="item.id !== is_default ? '设为默认' : '已设为默认'"
              :labelColor="item.id !== is_default ? $colors.regular : $colors.theme">
            </uv-radio>
            <view>
              <!-- <image src="/static/images/user/delete.svg" class="w-[32rpx] h-[32rpx] mr-[40rpx]"
                @click.stop="handleDelete(item)"></image>
              <image src="/static/images/user/edit.svg" class="w-[32rpx] h-[32rpx]" @click.stop="handleEdit(item)">
              </image> -->
              <view class="flex flex-row items-center">
                <view class="text-neutral-secondary text-sm" @click.stop="handleDelete(item)">删除</view>
                <view class="text-neutral-secondary text-sm ml-[24rpx]" @click.stop="handleEdit(item)">修改</view>
              </view>
              
            </view>
          </view>
        </wk-stroke-bg>
      </uv-radio-group>
    </scroll-view>
    <empty class="absolute top-0 left-0 right-0 bottom-0" v-if="isEmpty" />

    <view class="bg-neutral-bottomBtnBg fixed w-full bottom-0 left-0 px-[32rpx] py-[24rpx] box-border">
      <wk-button @submit="addAddress">
        新建收货地址
      </wk-button>
    </view>

    <wk-code-input ref="keywordRef" :value="pay_password" @finish="handleFinish" />
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>
    
  <script setup>
  import { ref, reactive, watch } from 'vue';
  import { onLoad, onShow } from '@dcloudio/uni-app';
  import { navigateTo} from '@/utils/navigation';
  import { getAddressList, deleteAddress, setDefaultAddress } from '@/api/user';
  import { routes } from "@/config/routes";
  import { cacheManager } from "@/utils/cacheManager";
  import Empty from '@/components/base/empty.vue';
  
  const cacheData = cacheManager.getCache("addressList");
  const isEmpty = ref(false);
  const keywordRef = ref(null);
  const pay_password = ref('');
  const addressList = ref([]);
  const is_default = ref(0);
  const selectId = ref('');
  const page = reactive({
    page: 1,
    pageSize: 20,
  });
  const deleteItemId = ref('');
  const isChoice = ref(0); // 地址是否可以点击选择
  const loading = ref(false);
  const loadingText = ref('');
  onLoad((options) => {
    if (cacheData) {
      handleList(cacheData)
    }
    getList();
    selectId.value = options.selectId || '';
    isChoice.value = options.isChoice || 0;
  });
  onShow(() => {
    getList(false);
  });
  watch(addressList, () => {
    isEmpty.value = addressList.value.length === 0;
  });
  
  const handleList = (res) => {
    addressList.value = res.list || [];
    addressList.value.forEach((item) => {
      if (item.is_default == 1) {
        is_default.value = item.id;
      }
    });
    loading.value = false;
  }
  const getList = async (showLoading = true) => {
    if (showLoading) {
      loading.value = true;
      loadingText.value = '加载中...'
    }
    const res = await getAddressList(page);
    console.log(res, 'res');
    if (page.page == 1) {
      cacheManager.setCache("addressList", res);
    }
    handleList(res)
    
  };
  const handleEdit = (item) => {
    navigateTo(routes.addressAdd, item);
  };
  const handleFinish = (value) => {
    pay_password.value = value;
    if (pay_password.value.length < 6) {
      uni.$showToast({
        title: "请输入完整的支付密码！",
        duration: 3000,
        icon: "none",
      });
      return;
    }
    if (deleteItemId.value) {
      handleDeleteAddress();
    }
  };
  const change = (value) => {
    handleSetDefaultAddress();
  };
  
  const handleSetDefaultAddress = async() => {
    let id = is_default.value;
    loading.value = true;
    loadingText.value = '设置中...'
    const res = await setDefaultAddress({
      id
    });
    if (res.status == 0) {
      uni.$showToast({
        title: '设置成功',
        icon: 'none',
        duration: 3000,
      });
      getList(false);
    } else {
      uni.$showToast({
        title: res.msg,
        icon: 'none',
        duration: 3000,
      });
    }
    loading.value = false;
  };
  
  const selectAddress = (item) => {
    if (isChoice.value == 1) {
      return;
    }
    uni.$emit('selectedAddress', item);
    uni.navigateBack();
  };
  
  const handleDelete = (item) => {
    deleteItemId.value = item.id;
    keywordRef.value.open();
  };
  
  const handleDeleteAddress = async () => {
    loading.value = true;
    loadingText.value = '删除中...'
    const res = await deleteAddress({
      id: deleteItemId.value,
      pwdPay: pay_password.value,
    });
    if (res.status === 0) {
        uni.$showToast({
          title: '删除成功',
          icon: 'none',
        });
        getList();
        keywordRef.value.close();
        deleteItemId.value = '';
      } else {
      uni.$showToast({
        title: res.msg,
        icon: 'none',
        duration: 3000,
      });
    }
    loading.value = false;
  };
  
  const addAddress = () => {
    navigateTo(routes.addressAdd);
  };
  
  </script>
  
    
  <style lang="scss" scoped>
  </style>
    