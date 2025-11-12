<template>
  <layout
    ref="layoutRef"
    navTitle="无忧易贷"
    bgType="bg-main"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <template #navRight>
      <view v-if="!loadBS" @click="goDaikuanLog" class="right-menu flex items-center bg-white/10 justify-center w-[64rpx] h-[64rpx] rounded-full">
        <image src="/static/images/user/record_icon.svg" mode="widthFix" class="w-[32rpx] h-[32rpx]"></image>
      </view>
    </template>

    <view class="px-page-x pt-page-y pb-[150rpx]">
      <view
        class="rounded-[32rpx] h-[244rpx] bg-card3"
      >
        <view
          class="flex flex-row h-full items-center justify-around px-[48rpx]"
        >
          <view class="flex flex-col items-center">
            <view class="text-base text-neutral-white"
              >可贷金额({{ symbolStore.code }})</view
            >
            <view class="text-2xl text-neutral-white font-bold mt-[12rpx]">{{
              price_max
            }}</view>
          </view>
          <view class="flex flex-col items-center">
            <view class="text-base text-neutral-white"
              >已贷金额({{ symbolStore.code }})</view
            >
            <view class="text-2xl text-neutral-white font-bold mt-[12rpx]">{{
              yidaimoney
            }}</view>
          </view>
        </view>
      </view>

      <!-- 内容区域 => 开始 -->
      <wk-stroke-bg  
        shadow
        class="mt-[32rpx] p-[32rpx] rounded-[16rpx]">
        <view class="text-lg text-neutral font-medium">贷款金额</view>
        <view
          class="h-[112rpx] bg-black/5 border-[length:1rpx] border-black/10 border-solid rounded-[24rpx] mt-[24rpx] px-[24rpx]"
        >
          <input
            type="number"
            :maxlength="33"
            v-model="inp_val"
            class="h-full w-full text-base"
            :placeholder="`请输入金额，最低申请借贷金额 ${withdrawalmin } ${symbolStore.code}`"
            placeholder-class="text-neutral-light text-base"
          />
          
        </view>

        <view class="py-[16rpx] mt-[18rpx]">
          <wk-button
            @submit="open_play_pass"
            >申请贷款</wk-button
          >
        </view>
      </wk-stroke-bg>

      <wk-stroke-bg
        shadow
        class="mt-[32rpx] rounded-[16rpx]" size="none">
        <view class="flex flex-row items-center justify-between px-[32rpx] pt-[24rpx]">
          <view class="flex flex-col py-[12rpx]">
            <view class="text-base text-neutral"
              >待还金额({{ symbolStore.code }})</view
            >
            <view class="mt-[12rpx] text-3xl font-bold text-neutral">{{
              jiemoney
            }}</view>
          </view>

          <view class="flex flex-col items-center justify-center">
            <wk-button
              :borderColor="$colors.theme"
              backgroundColor="transparent"
              :color="$colors.theme"
              size="small"
              fontWeight="normal"
              borderRadius="16rpx"
              shadow=""
              height="64rpx"
              @submit="goHuankuan"
            >
              申请还款
            </wk-button>
          </view>
        </view>


        <view
            class="flex flex-row my-[12rpx] h-[1rpx] bg-neutral-divider"
          ></view>

        <view class="flex flex-row items-center justify-between px-[32rpx] py-[24rpx]">
          <view class="flex flex-row items-center">
            <view class="text-base text-neutral"
              >已还金额</view
            >
            <view class="ml-[12rpx] text-base text-neutral">{{
              huanmoney
            }} {{ symbolStore.code }}</view>
          </view>

          <view class="flex flex-row items-center" @click="goHuankuanLog">
            <text class="text-sm text-neutral-theme"
            >
              还款记录
            </text>

            <uv-icon name="arrow-right" size="12" :color="$colors.theme" class="ml-[8rpx]"/>
          </view>
        </view>
        
      </wk-stroke-bg>


     
      <view v-if="mark" class="mt-[48rpx] p-[32rpx] text-base text-neutral-regular leading-6 bg-white 
      border-[length:1rpx] border-solid border-neutral-divider rounded-[24rpx]">
        {{ mark }}
      </view>
    </view>
    <wk-code-input
      ref="keywordRef"
      :value="pay_password"
      @finish="keyConfirm"
    />
    
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script>
import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";

export default {
  data() {
    return {
      price_max: "0",
      inp_val: "",
      sign_img: "",
      withdrawalmin: 0,
      mark: "", //贷款规则
      isdaikuan: "1",
      pay_icon_show: true, //显示支付密码用的
      pay_password: "", //支付密码
      jiao_yi_type: "", //在操作什么类型
      jiemoney: 0,
      huanmoney: 0,
      yidaimoney: 0,
      esignature: 0,
      symbolStore: useSymbolStore(),
      loading: false,
      loadingText: "",
    };
  },
  onUnload() {},
  onShow() {
    this.getDaikuanInfo();
  },
  methods: {
    handleRefresh() {
      this.getDaikuanInfo();
    },
    goHuankuanLog() {
      uni.navigateTo({
        url: routes.huanKuanJiLu,
      });
    },
    goHuankuan() {
      uni.navigateTo({
        url: routes.daiKuanHuanKuan,
      });
    },
    goDaikuanLog() {
      uni.navigateTo({
        url: routes.daiKuanJiLu,
      });
    },
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
      this.confirmPaySubDaikuan();
    },
    // 推格回调
    keyBackspace() {
      this.pay_password = this.pay_password.slice(0, -1);
    },
    // 数字键盘专用回调
    keyClick(keyobj) {
      if (this.pay_password.length == 6) {
        return;
      } else {
        this.pay_password += keyobj.value;
      }
    },
    // 数字键盘取消回调
    keyClose() {
      this.$refs.keywordRef.close();
      this.pay_password = "";
    },
    // 唤起数字键盘
    open_play_pass() {
      let ths = this;
      if (ths.isdaikuan == 0) {
        uni.$showToast({
          title: "暂未开放",
          duration: 3000,
          icon: "none",
        });
        return false;
      }

      if (ths.price_max < 1) {
        uni.$showToast({
          title: "您当前没有贷款额度",
          duration: 3000,
          icon: "none",
        });
        return false;
      }

      if (ths.inp_val == "") {
        uni.$showToast({
          title: "请输入金额",
          duration: 3000,
          icon: "none",
        });
        return false;
      }
      if (parseInt(ths.inp_val) < parseInt(ths.withdrawalmin)) {
        uni.$showToast({
          title:
            "最低贷款额度" +
            " " +
            ths.withdrawalmin +
            " " +
            ths.symbolStore.code,
          duration: 3000,
          icon: "none",
        });
        return false;
      }

      if (parseInt(ths.price_max) < parseInt(ths.inp_val)) {
        uni.$showToast({
          title: "申请金额不能超过可贷款额度",
          duration: 3000,
          icon: "none",
        });
        return false;
      }
      if (ths.esignature == 1) {
        this.goHetong();
      } else {
        this.$refs.keywordRef.open();
      }
    },
    goHetong() {
      uni.$on("onSign", (data) => {
        if (data) {
          setTimeout(() => {
            this.sign_img = data;
            if (this.$refs.keywordRef) {
              this.$refs.keywordRef.open();
            }
          }, 300);
        }
      });
      uni.navigateTo({
        url: "dai_kuan_he_tong?money=" + this.inp_val,
      });
    },
    confirmPaySubDaikuan() {
      let ths = this;
      this.loading = true;
      const data = {
        money: ths.inp_val,
        pay_passworld: ths.pay_password,
      };
      if (ths.esignature == 1) {
        data.sign_img = ths.sign_img;
      }
      this.$requestApi({
        url: "/api/user/daikuan",
        method: "POST",
        data,
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
                url: "dai_kuan_ji_lu",
              });
            },
          });
        }
        this.$refs.keywordRef.close();
        uni.$off("onSign");
      });
    },
    paySubDaikuan() {
      let ths = this;
      if (ths.isdaikuan == 0) {
        uni.$showToast({
          title: "暂未开放",
          duration: 3000,
          icon: "none",
        });
        return false;
      }

      if (ths.price_max < 1) {
        uni.$showToast({
          title: "您当前没有贷款额度",
          duration: 3000,
          icon: "none",
        });
        return false;
      }
      if (ths.inp_val == "") {
        uni.$showToast({
          title: "请输入金额",
          duration: 3000,
          icon: "none",
        });
        return false;
      }
      if (parseInt(ths.inp_val) < parseInt(ths.withdrawalmin)) {
        uni.$showToast({
          title:
            "最低贷款额度" +
            " " +
            ths.withdrawalmin +
            " " +
            ths.symbolStore.code,
          duration: 3000,
          icon: "none",
        });
        return false;
      }

      if (parseInt(ths.price_max) < parseInt(ths.inp_val)) {
        uni.$showToast({
          title: "申请金额不能超过可贷款额度",
          duration: 3000,
          icon: "none",
        });
        return false;
      }
      this.$refs.popup.open("center");
    },
    DaikuanLog() {
      uni.navigateTo({
        url: "daikuanlog",
      });
    },
    Huankuan() {
      uni.navigateTo({
        url: "huankuan",
      });
    },
    HuankuanLog() {
      uni.navigateTo({
        url: "huankuanlog",
      });
    },
    getDaikuanInfo() {
      let ths = this;
      this.$requestApi({
        url: "/api/user/getdaikuan",
        method: "POST",
        data: {},
      }).then((res) => {
        console.log(res);
        if (ths.mark !== res.daikuancontent) {
          ths.mark = res.daikuancontent;
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
        ths.esignature = res.esignature;
        ths.price_max = res.money;
        ths.withdrawalmin = res.withdrawalmin;
        ths.isdaikuan = res.isdaikuan;
        ths.jiemoney = res.jiemoney;
        ths.huanmoney = res.huanmoney;
        ths.yidaimoney = res.yidaimoney;
        uni.hideLoading();
        ths.$refs.layoutRef.complete();
      });
    },
  },
};
</script>

<style lang="scss">

</style>
