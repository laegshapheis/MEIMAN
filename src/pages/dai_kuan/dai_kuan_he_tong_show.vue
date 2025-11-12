<template>
  <layout navTitle="合同详情"  bgType="bg-white" mode="black">
    <view class="px-[32rpx]">
      <rich-text :nodes="content"></rich-text>
    </view>
  </layout>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { getDaikuanContractInfoApi } from '@/api/user';
import { cacheManager } from '@/utils/cacheManager';
// 响应式数据
const qm_url = ref("");
const img_stv = ref(true);
const content = ref("");
const sign_img = ref("");

// 页面加载生命周期
onLoad((options) => {
  if (options.id) {
    const cacheContractInfo = cacheManager.getCache("daikuanContractInfoShow" + options.id);
    if (cacheContractInfo) {
      content.value = cacheContractInfo.data.content;
    }
    articleDetails(options.id);
  }
  
  uni.$on("sign", (data) => {
    if (data) {
      console.log(data);
      sign_img.value = data;
      img_stv.value = false;
      qm_url.value = data;
    }
  });
});

// 组件卸载时移除事件监听
onUnload(() => { 
  uni.$off("sign");
});

// 方法
const handleSubmit = () => {
  if (sign_img.value === "") {
    uni.$showToast({
      title: "请签名后确认提交",
      icon: "none",
      duration: 3000,
    });
    return;
  }
  uni.$emit("onSign", sign_img.value);
  uni.navigateBack();
};

const articleDetails = (id) => {
  getDaikuanContractInfoApi({ contract_no: id }).then((res) => {
    if (res.status == 0) {
      cacheManager.setCache("daikuanContractInfoShow" + id, res);
      content.value = res.data.content;
    }
  });
};
</script>

<style lang="scss">
.xs-bg-box {
  background-image: none !important;
  background-color: #f0f3f5;
}
.slef_32 {
  box-sizing: border-box;
  padding: 24rpx 32rpx 48rpx;
}

.hr-m {
  height: 24rpx;
}
.hr-x {
  height: 48rpx;
}
.he_tong_box {
  color: #252c2f;
  line-height: 1.4;
  position: relative;
  box-sizing: border-box;
  padding: 32rpx;
  background-color: #fff;
  border: 2rpx solid #000000;
  .title {
    font-size: 44rpx;
    text-align: center;
    margin-top: 32rpx;
  }
  .tou-zi-id {
    text-align: center;
    margin-top: 48rpx;
    color: #4d585b;
    font-size: 28rpx;
    margin-bottom: 24rpx;
  }
  .tab-box-k {
    background-color: #f0f3f5;
    padding: 32rpx 32rpx 1rpx;
    .line-x {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24rpx;
      font-size: 32rpx;
      .var-n {
      }
      .dfn-n {
        font-weight: bold;
      }
      .time-n {
      }
    }
  }
  .h-1-x {
    font-weight: bold;
    font-size: 32rpx;
  }
  .hr-m {
    height: 24rpx;
  }
  .span-box {
    font-size: 32rpx;
    .var {
    }
    .bold {
      font-weight: bold;
    }
  }
  .hr-x {
    height: 48rpx;
  }
  .le-str-x {
    font-size: 32rpx;
  }
  .re-str-x {
    text-align: right;
    font-size: 32rpx;
  }
  .b-k-1,
  .b-k-2,
  .b-k-3,
  .b-k-4 {
    position: absolute;
    width: 42rpx;
    height: 42rpx;
    border: 6rpx solid #000000;
  }
  .b-k-1,
  .b-k-4 {
    left: -6rpx;
    border-right: none;
  }
  .b-k-1,
  .b-k-2 {
    top: -6rpx;
    border-bottom: none;
  }
  .b-k-2,
  .b-k-3 {
    right: -6rpx;
    border-left: none;
  }
  .b-k-3,
  .b-k-4 {
    bottom: -6rpx;
    border-top: none;
  }
}
.qian-m-title {
  color: #252c2f;
  font-size: 32rpx;
}
.bai-ban {
  border: 2rpx solid #000000;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 344rpx;
  width: 686rpx;
  box-sizing: border-box;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  .icon {
    width: 260rpx;
    height: 80rpx;
  }
  .qm_img {
    transform: rotate(-90deg);
    width: 344rpx;
    height: 686rpx;
    /* background-color: aquamarine; */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
.copy-btn {
  margin-top: 32rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 102rpx;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-size: 36rpx;
  font-weight: bold;
}
</style>
