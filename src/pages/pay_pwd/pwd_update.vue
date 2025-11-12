<template>
    <layout :navTitle="type == 0 ? '设置支付密码' : type == 1 ? '修改支付密码' : ''"  bgType="bg-main">  
          <view class="p-[32rpx]">
       <view class="">
          <view v-if="type == 0" class="mt-[58rpx] text-center">
            <view v-if="new_pass_s == 0" class="text-lg font-semibold text-center">
              <text>请输入支付密码</text>
              <uv-code-input class="mt-[58rpx]"  v-model="new_pass" :maxlength="6" :focus="true" borderColor="none" :dot="true" color="#000" size="90rpx" @finish="keyConfirm"></uv-code-input>
            </view>
            <view v-if="new_pass_s == 1" class="text-lg font-semibold text-center">
              <text>请再次输入支付密码！</text>
              <uv-code-input class="mt-[58rpx]" v-model="new_pass_firm" :maxlength="6" :focus="true" borderColor="none" :dot="true" color="#000" size="90rpx" @finish="keyConfirm"></uv-code-input>
            </view>
          </view>
          <view v-if="type == 1" class="text-neutral text-3xl font-semibold">
            <view v-if="old_pass_s == 0" class="text-lg font-semibold text-center">
              <text>请输入原支付密码</text>
              <uv-code-input class="mt-[58rpx]" v-model="old_pass" :maxlength="6" :focus="true" borderColor="none" :dot="true" color="#000" size="90rpx" @finish="keyConfirm"></uv-code-input>
            </view>
            <view v-if="old_pass_s == 1" class="text-lg font-semibold text-center">
              <text>请输入新的支付密码！</text>
              <uv-code-input class="mt-[58rpx]" v-model="new_pass" :maxlength="6" :focus="true" borderColor="none" :dot="true" color="#000" size="90rpx" @finish="keyConfirm"></uv-code-input>
            </view>
            <view v-if="old_pass_s == 2" class="text-lg font-semibold text-center">
              <text>请再次输入新的支付密码！</text>
              <uv-code-input class="mt-[58rpx]" v-model="new_pass_firm" :maxlength="6" :focus="true" borderColor="none" :dot="true" color="#000" size="90rpx" @finish="keyConfirm"></uv-code-input>
            </view>
          </view>
        </view>
      </view>
      <wk-loading v-if="loading" :loadingText="loadingText" />
    </layout>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';
  import { updatePaypwd, verifypws } from '@/api/user';
  const old_pass = ref(''); // 旧支付密码
  const new_pass = ref(''); // 新支付密码
  const new_pass_firm = ref(''); // 用于确认对比
  const new_pass_s = ref(0); // 设置流程步骤
  const old_pass_s = ref(0); // 修改流程步骤
  const type = ref('');
  const loading = ref(false);
  const loadingText = ref('');
  onLoad(({code}) => {
    type.value = code;
  });
  
  // 方法定义
  const keyConfirm = async () => {
    if (type.value == 0) {
      // 设置新支付密码
      if (new_pass_s.value == 0) {
        new_pass_s.value = 1;
        return;
      }
      if (new_pass_s.value == 1) {
        if (new_pass.value == new_pass_firm.value) {
          console.log('验证通过');
          loading.value = true;
          loadingText.value = '设置中...'
          try {
            const res = await updatePaypwd({
              newpass: new_pass.value,
              renewpass: new_pass_firm.value,
            });
            loading.value = false;
            if (res.status != 0 ) {
              uni.$showToast({
                icon: 'none',
                title: res.msg,
                duration: 3000,
              });
            } else {
              uni.$showModal({
                title: '提示',
                showCancel: false,
                content: res.msg,
                success: function (res) {
                  if (res.confirm) {
                    uni.navigateBack();
                  }
                },
              });
            }
          } catch (error) {
            console.error('请求失败', error);
            loading.value = false;
          }
        } else {
          console.log('验证失败');
          uni.$showModal({
            title: '安全提示',
            content: '两次密码输入不正确，请重新输入！',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                new_pass_s.value = 0;
                new_pass.value = '';
                new_pass_firm.value = '';
              }
            },
          });
        }
      }
    }
    if (type.value == 1) {
      // 修改支付密码
      if (old_pass_s.value == 0) {
        loading.value = true;
        loadingText.value = '加载中...'
        try {
          const res = await verifypws({
            old_pass: old_pass.value,
          });
          loading.value = false;
          if (res.status != 0 ) {
            uni.$showToast({
              title: res.msg,
              duration: 3000,
              icon: 'none',
            });
            old_pass.value = '';
          }
          if (res.status == 0) {
            old_pass_s.value = 1; // 验证成功，更换到下一个操作状态
          }
        } catch (error) {
          console.error('请求失败', error);
          loading.value = false;
        }
        return;
      }
      if (old_pass_s.value == 1) {
        old_pass_s.value = 2;
        return;
      }
      if (old_pass_s.value == 2) {
        // 两次支付密码不匹配
        if (new_pass.value != new_pass_firm.value) {
          uni.$showModal({
            title: '安全提示',
            content: '两次密码输入不正确，请重新输入！',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                old_pass_s.value = 1;
                new_pass.value = '';
                new_pass_firm.value = '';
              }
            },
          });
          return;
        }
        // 提交验证
        console.log('走提交验证');
        loading.value = true;
        loadingText.value = '修改中...'
        try {
          const res = await updatePaypwd({
            pass: old_pass.value,
            newpass: new_pass.value,
            renewpass: new_pass_firm.value,
          });
          loading.value = false;
          if (res.status != 0 ) {
            uni.$showToast({
              icon: 'none',
              title: res.msg,
              duration: 3000,
            });
          } else {
            uni.$showModal({
              title: '提示',
              showCancel: false,
              content: res.msg,
              success: function (res) {
                if (res.confirm) {
                  uni.navigateBack();
                }
              },
            });
          }
          old_pass_s.value = 0;
          old_pass.value = '';
          new_pass.value = '';
          new_pass_firm.value = '';
        } catch (error) {
          console.error('请求失败', error);
          loading.value = false;
        }
      }
    }
  };
  
  </script>
  
  <style scoped lang="scss">
  ::v-deep {
    .uv-code-input {
      display: flex;
      justify-content: center;
    }
    .uv-code-input__item {
      background-color: rgba(255, 255, 255, 1);
      border: 1rpx solid rgba(0, 0, 0, 0.10);
      border-radius: 24rpx;
    }
  }
  </style>