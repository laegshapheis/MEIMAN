<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="转让加息券"
    bgType="bg-[#130D08]"
  >
  <template v-slot:navRight>
      <view class="flex flex-row items-center justify-end px-[16rpx] py-[8rpx] pt-[5rpx]">
        <text class="text-base text-[#2A877C]" @click="transHandle">转让</text>
      </view>
    </template>
    <view class="px-[32rpx] pb-[180rpx]">
      <!-- 审核中 -->
      <view
        class="flex-col flex items-center justify-center"
      >
        <image
          class="w-[184rpx] h-[184rpx]"
          src="/static/images/profile/interest_rate_coupons.png"
          mode="widthFix"
        />
        <view class="text-center flex flex-col mt-[20rpx] mb-[60rpx]">
          <text class="text-neutral text-xl">{{infoData.title}}</text>
        </view>
      </view>

      <view class="mb-[12rpx] text-base text-[#FFFFFFCC] font-medium">真实姓名</view>
          <view class="flex flex-row items-center justify-between">
            <wk-input
              v-model="infoData.userName"
              :formatter="formatName"
              type="text"
              maxlength="50"
              placeholder="请输入真实姓名"
              borderColor="#FFFFFF33"
              bgColor="linear-gradient(94deg, #4e4244 -6.07%, #2b2527 66.94%)"
            ></wk-input>
        </view>

        <view class="mb-[12rpx] mt-[24rpx] text-base text-[#FFFFFFCC] font-medium">ID</view>
          <view class="flex flex-row items-center justify-between">
            <wk-input
              v-model="infoData.userId"
              type="number"
              maxlength="8"
              placeholder="请输入对方用户ID"
              borderColor="#FFFFFF33"
              bgColor="linear-gradient(94deg, #4e4244 -6.07%, #2b2527 66.94%)"
            ></wk-input>
        </view>

      <wk-code-input ref="keywordRef" :value="pay_password"  @cancel="handleCancel" @finish="handleFinish"/>
    </view>
  </layout>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { onShow, onPullDownRefresh, onLoad } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import { transferCoupon } from "@/api/user";
import { navigateTo } from "@/utils/navigation";

const pay_password = ref("");
const keywordRef = ref(null);

const infoData = reactive({
  userName: '',
  userId: '',
  title: '',
  id: 0
})

const formatName = (val) => {
    return val.replace(/[^\u4e00-\u9fa5]/g, "");
};

const transHandle = () => {
  keywordRef.value.open();
}
const handleCancel = () => {
    // uni.navigateBack();
};
const handleFinish = (value) => {
    pay_password.value = value;
    keyConfirm();
};
  // 数字键盘确认回调
  const keyConfirm = async () => {
    if (pay_password.value.length < 6) {
      uni.$showToast({
        title: "请输入完整的支付密码！",
        duration: 3000,
        icon: "none",
      });
      return;
    }
    const body = {
      id: infoData.id,
      pwdPay: pay_password.value,
      target_name: infoData.userName,
      target_account: infoData.userId
    }
    let res = await transferCoupon(body)
      // 请求成功后的处理
    if (res.status == 0) {
      keywordRef.value.close();
      navigateTo(routes.rateCoupon)
    } else {
      uni.$showToast({
        title: res.msg,
        duration: 3000,
        icon: "none",
      });
    }
  };
onLoad((data) => {
  infoData.id = data.id;
  infoData.title = data.name;
});
</script>
