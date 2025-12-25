<template>
  <layout navTitle="申请还款" bgType="bg-main1" :isLottie="false">
    <template v-slot:navRight>
      <view class="flex items-center justify-center w-[64rpx] h-[64rpx] bg-white/10 rounded-full">
        <image @click="HuankuanLog" src="/static/images/user/record_icon.svg" mode="widthFix"
          class="w-[32rpx] h-[32rpx]"></image>
      </view>
    </template>
    <view class="px-[32rpx] mt-[28rpx]">
      <!-- <wk-stroke-bg>
        <view class="flex flex-row items-center justify-between">
          <view class="text-neutral text-xl font-bold">待还金额</view>
          <view class="text-neutral-theme text-2xl font-bold"
            >{{ jiemoney }} {{ symbolStore.code }}</view
          >
        </view>
      </wk-stroke-bg> -->
      <view class="bg-black p-[32rpx] rounded-[32rpx] shadow-[0_0_16px_0_#266AFF_inset]">
        <view class="mt-[28rpx]">
          <view class="flex flex-row items-center justify-between font-medium">
            <text class="text-neutral text-lg">还款金额</text>
            <text class="text-neutral-theme text-base">投资余额 {{ amount }} {{ symbolStore.code }}</text>
          </view>
          <view class="mt-[28rpx] bg-grey">
            <wk-input maxlength="33" type="number" fontSize="38rpx" v-model="inp_val" placeholder="请输入金额"
              :bgColor="$colors.inputBg" :borderColor="$colors.divider" readonly
              placeholder-class="text-neutral-placeholder text-2xl" />
          </view>
        </view>

        <view class="py-[16rpx] mt-[28rpx]">
          <wk-button height="80rpx" @submit="open_play_pass">申请还款</wk-button>
        </view>
      </view>
      <view
        class="mt-[28rpx] text-base leading-6 border-[length:1rpx] border-solid border-white/25 rounded-[24rpx] p-[32rpx]"
        v-if="mark">
        <view class="text-base text-white/80">{{ mark }}</view>
      </view>
    </view>

    <wk-code-input ref="keywordRef" :value="pay_password" @finish="keyConfirm" />

    <!-- 内容区域 => 结束 -->
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script>
import { useSymbolStore } from "@/stores/symbolStore";
import commonTips from "../../components/base/common-tips.vue";

export default {
  components: { commonTips },
  data() {
    return {
      price_max: "0",
      inp_val: 0,
      withdrawalmin: 0,
      mark: "", //贷款规则
      isdaikuan: "1",
      pay_icon_show: true, //显示支付密码用的
      pay_password: "", //支付密码
      keyShow: false,
      jiao_yi_type: "", //在操作什么类型
      jiemoney: "",
      huanmoney: "",
      amount: "",
      symbolStore: useSymbolStore(),
      loading: false,
      loadingText: "",
    };
  },
  onShow() {
    this.getDaikuanInfo();
  },
  methods: {
    // 数字键盘---------start
    // 数字键盘确认回调
    keyConfirm(password) {
      this.pay_password = password;
      if (this.pay_password.length < 6) {
        uni.$showToast({
          title: "请输入完整的支付密码！",
          duration: 3000,
          icon: "none",
        });
        return;
      }
      this.$refs.keywordRef.close();
      this.confirmPaySubDaikuan();
      // return
      // this.exchangeSubmit();
    },
    // 唤起数字键盘
    open_play_pass(type_str) {
      let ths = this;
      if (ths.isdaikuan == 0) {
        uni.$showToast({
          title: "暂未开放",
          duration: 3000,
          icon: "none",
        });
        return false;
      }
      if (parseInt(ths.inp_val) < 1) {
        uni.$showToast({
          title: "您当前没有还款额度",
          duration: 3000,
          icon: "none",
        });
        return false;
      }
      if (parseInt(ths.inp_val) > parseInt(ths.amount)) {
        uni.$showToast({
          title: "账号的投资余额不足以支付还款金额，请充值！",
          duration: 3000,
          icon: "none",
        });
        return false;
      }

      this.$refs.keywordRef.open();
    },
    // 数字键盘---------end
    confirmPaySubDaikuan() {
      let ths = this;
      this.loading = true;
      this.$requestApi({
        url: "/api/user/huankuan",
        method: "POST",
        data: {
          money: ths.inp_val,
          pay_passworld: ths.pay_password,
        },
      }).then((res) => {
        this.loading = false;
        if (res.status != 0) {
          uni.$showToast({
            icon: "none",
            title: res.msg,
            duration: 3000,
          });
          ths.pay_password = "";
        }
        if (res.status == 0) {
          ths.pay_password = "";
          uni.$showModal({
            title: "提示",
            showCancel: false,
            content: res.msg,
            success: function (res) {
              uni.navigateTo({
                url: "huan_kuan_ji_lu",
              });
            },
          });
        }
      });
    },
    HuankuanLog() {
      uni.navigateTo({
        url: "huan_kuan_ji_lu",
      });
    },
    getDaikuanInfo() {
      this.loading = true;
      this.loadingText = "加载中...";
      let ths = this;
      this.$requestApi({
        url: "/api/user/getdaikuan",
        method: "POST",
        data: {},
      }).then((res) => {
        this.loading = false;
        if (ths.mark !== res.huankuancontent) {
          ths.mark = res.huankuancontent;
          uni.setStorage({
            key: "dai_kuan_gui_ze_m",
            data: ths.mark,
            success: function () {
              console.log("来了新规则");
            },
          });
        } else {
          console.log("规则没有更新");
        }
        console.log(res);
        ths.withdrawalmin = res.txmoney; //tixian
        ths.isdaikuan = res.isdaikuan;
        ths.inp_val = res.jiemoney;
        ths.jiemoney = res.jiemoney;
        ths.amount = res.amount;
      });
    },
  },
};
</script>

<style lang="scss">
.right-menu {
  font-size: 28rpx;
  color: #000000;

  .str {}
}

.slef_32 {
  box-sizing: border-box;
  padding: 24rpx 28rpx 1rpx;
}

// 装饰部分
.b-k-1,
.b-k-2,
.b-k-3,
.b-k-4 {
  position: absolute;
  width: 28rpx;
  height: 28rpx;
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

// 头部固定部分
.header-wrap {
  padding: 32rpx;

  // padding-bottom: 0;
  .header {
    height: 122rpx;
    padding: 0 32rpx;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #000000;
    line-height: 1;
    background-image: linear-gradient(276.53deg, #00366c 0%, #005bb5 82.17%);

    .var {
      font-size: 32rpx;
      color: #fff;
    }

    .bold-str {
      font-weight: bold;
      font-size: 36rpx;
    }

    // position: relative;
    // width: 100%;
    // height: 198rpx;
    // background-size: 100% 100%;
    // display: grid;
    // grid-template-columns: repeat(2,1fr);

    // .item {
    // 	display: flex;
    // 	align-items: center;
    // 	justify-content: center;
    // 	flex-direction: column;
    // 	.str {
    // 		font-size: 28rpx;
    // 		color: #000000;
    // 	}
    // 	.dfn {
    // 		color: #fff;
    // 		margin-top: 24rpx;
    // 		font-weight: bold;
    // 		font-size: 40rpx;
    // 	}
    // }
  }
}

.str-title {
  color: #fff;
  font-size: 28rpx;
  line-height: 1;
}

.dk-input-box {
  position: relative;
  height: 104rpx;
  background-color: #010e21;
  border: 1px solid #000000;
  margin-top: 32rpx;

  .dk-input {
    width: 100%;
    height: 100%;
    display: block;
    color: #fff;
    font-size: 32rpx;
    padding-left: 32rpx;
  }

  .dk-input-pl {
    color: #bbdaff;
    font-size: 32rpx;
  }
}

.dk-str2 {
  color: #000000;
  margin-top: 32rpx;
  font-size: 28rpx;
}

.dk-sq-btn {
  height: 102rpx;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: bold;
  margin-top: 32rpx;
  margin-bottom: 64rpx;
}

.dk-card-kl {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 44rpx 32rpx 44rpx 42rpx;
  border: 1px solid #000000;
  margin-bottom: 32rpx;
  line-height: 1;
  background-image: linear-gradient(276.53deg, #00366c 0%, #005bb5 82.17%);
  position: relative;

  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
    background-position: bottom left;
    background-size: 309rpx 152rpx;
    background-repeat: no-repeat, no-repeat;
    filter: brightness(1.4);
  }

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
    background-position: top right;
    background-size: 309rpx 152rpx;
    background-repeat: no-repeat, no-repeat;
    filter: brightness(1.8);
  }

  .dk-left-box {
    position: relative;
    z-index: 2;

    .top-dk-val {
      font-size: 40rpx;
      font-weight: bold;
    }

    .dk-jin-e {
      margin-top: 24rpx;
      font-size: 28rpx;
      color: #000000;
    }
  }

  .dk-sq-hk {
    position: relative;
    z-index: 2;
    height: 80rpx;
    background-color: rgba(1, 36, 71, 0.34);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24rpx;
    font-size: 28rpx;

    .lef-icon,
    .ref-icon,
    &::before,
    &::after {
      position: absolute;
    }

    .lef-icon,
    .ref-icon {
      width: 18rpx;
      height: 100%;
      top: 0;
    }

    .lef-icon {
      left: 0;
    }

    .ref-icon {
      right: 0;
    }

    &::before,
    &::after {
      content: "";
      left: 18rpx;
      right: 18rpx;
      height: 12rpx;
      background-size: 100% 100%;
      // background-color: #000000;
    }

    &::before {
      top: 0;
    }

    &::after {
      bottom: 0;
    }

    .dk-str-btn {}
  }
}

.dk-tips {
  margin-top: 64rpx;
  font-size: 28rpx;
  padding-bottom: 32rpx;

  br {}
}
</style>
