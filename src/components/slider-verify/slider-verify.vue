<template>
  <view class="slider-verify-box" v-if="isShow">
    <view class="verifyBox">
      <view class="slider-title text-[#010101] font-bold"
        >图形验证</view
      >
      <view class="slide-content">
        <view class="slide-tips text-[#252C2F]/75">拖动下方滑块完成拼图</view>
        <view class="slider-pintu">
          <image
            id="pintuImg"
            :src="'/static/images/sliderVerify/img' + img + '.png'"
            class="pintu"
          ></image>

          <view
            class="pintukuai"
            :style="{ top: top + 'px', left: currentLeft + 'px' }"
          >
            <image
              :src="'/static/images/sliderVerify/img' + img + '.png'"
              :style="{ top: '-' + top + 'px', left: '-' + left + 'px' }"
            ></image>
          </view>

          <view
            class="yinying"
            :style="{ top: top + 'px', left: left + 'px' }"
          ></view>
        </view>

        <view class="slider-movearea" @touchend="endTouchMove">
          <movable-area :animation="true"
            ><movable-view
              :x="x"
              direction="horizontal"
              @change="startMove"
            ></movable-view
          ></movable-area>
          <view class="huadao text-[#010101] text-lg">拖动左边滑块完成上方拼图</view>
        </view>
      </view>
      <view class="slider-btn-group">
        <view class="slider-btn text-[#252C2F]/50" @tap="closeSlider"
          >关闭</view
        >
        <view
          class="slider-btn slide-btn-refresh text-[#0066FF]"
          @tap="refreshVerify"
          >刷新</view
        >
      </view>
    </view>
  </view>
  <wk-modal ref="modal" :showConfirmButton="false" title="联系客服">
    <view class="flex flex-col justify-center w-full">
      <view class="text-center mb-[60rpx] mt-[50rpx]">
        <text class="text-lg text-opacity-80">点击联系在线客服</text>
      </view>
      <view class="flex-1 w-full">
        <wk-button @click="toService"> 在线客服 </wk-button>
      </view>
    </view>
  </wk-modal>
  <wk-loading v-if="loading" loadingText="刷新中..." />
</template>

<script>
import { routes } from "@/config/routes";
import { getCaptchaConfig, checkCaptcha } from "@/api/index";
export default {
  name: "slider-verify",
  props: {
    isShow: false,
    username: "",
  },
  data() {
    return {
      x: 0, //初始距离
      currentLeft: 0, //移动的距离
      img: "1", //显示哪张图片
      left: 0, //随机拼图的最终X轴距离
      top: 0, //拼图的top距离
      captcha_id: "",
      loading: false,
    };
  },
  watch: {
    isShow(newValue) {
      if (newValue) {
        this.refreshVerify();
      }
    },
  },
  mounted() {
    if (this.isShow) {
      this.refreshVerify(); //刷新
    }
  },
  methods: {
    toService() {
      uni.navigateTo({
        url: routes.service2,
      });
    },
    //刷新验证
    async refreshVerify() {
      this.loading = true;
      var gl = Math.random().toFixed(2);
      const res = await getCaptchaConfig();
      if (res.status == 0) {
        this.left = res.data.x;
        this.top = res.data.y;
        this.captcha_id = res.data.captcha_id;
      } else {
        this.left =
          uni.upx2px(560) * gl > uni.upx2px(280)
            ? uni.upx2px(280)
            : uni.upx2px(560) * gl + uni.upx2px(150); //生成随机X轴最终距离
        this.top = uni.upx2px(190) * gl; //生成随机Y轴初始距离
      }

      if (gl <= 0.2) {
        this.img = 1;
      }
      if (gl > 0.2 && gl <= 0.4) {
        this.img = 2;
      }
      if (gl > 0.4 && gl <= 0.6) {
        this.img = 3;
      }
      if (gl > 0.6 && gl <= 0.8) {
        this.img = 4;
      }
      if (gl > 0.8 && gl <= 1) {
        this.img = 5;
      }
      this.resetMove(); //重置阴影位置
      this.loading = false;
    },

    /* 滑动中 */
    startMove(e) {
      this.currentLeft = e.detail.x;
    },

    /* 滑动结束 */
    async endTouchMove() {
      var that = this;
      const res = await checkCaptcha({
        username: this.username,
        captcha_id: this.captcha_id,
        x: this.currentLeft,
        y: this.top,
      });
      if (res.status == 0) {
        that.$emit("touchSliderResult", true, that.captcha_id);
      } else {
        that.refreshVerify();
        that.$emit("touchSliderResult", false, res.msg);
        if (res.status == 2) {
          that.$refs.modal.open();
        }
      }
    },

    /* 重置阴影位置 */
    resetMove() {
      this.x = 0;
      this.currentLeft = 0;
    },

    closeSlider() {
      this.$emit("touchSliderResult", false);
    },
  },
};
</script>
<style lang="scss">
.slider-verify-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.verifyBox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #FFFFFF;
  border-radius: 24rpx;

  .slider-title {
    font-size: 36rpx;
    text-align: center;
    padding-top: 40rpx;
  }

  .slide-content {
    width: 560rpx;
    padding: 0 1em;
    margin: 0 auto;
    .slide-tips {
      font-size: 32rpx;
      padding: 28rpx 0;
      text-align: center;
    }

    .slider-pintu {
      position: relative;
      width: 100%;
      border-radius: 8rpx;
      overflow: hidden;
      .pintu {
        width: 590rpx;
        height: 425rpx;
        display: block;
        margin: 0 auto;
      }

      .pintukuai {
        position: absolute;
        top: 0;
        left: 0;
        width: 120rpx;
        height: 120rpx;
        z-index: 100;
        overflow: hidden;
        border: 1px solid #FFFFFF;

        image {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 590rpx;
          height: 425rpx;
        }
      }
    }

    .yinying {
      position: absolute;
      width: 120rpx;
      height: 120rpx;
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
}

.slider-movearea {
  position: relative;
  height: 110rpx;
  width: 100%;
  display: flex;
  padding: 0 10rpx;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  margin: 20rpx auto;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 99rpx;
  movable-area {
    height: 80upx;
    width: 100%;
    
    movable-view {
      width: 80upx;
      height: 80upx;
      border-radius: 50%;
      background-color: transparent;
      background-image: url("/static/images/sliderVerify/slider.svg");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-position: center;
      position: relative;
      z-index: 100;
    }
  }
}

.huadao {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 99rpx;
  text-align: center;
  box-sizing: border-box;
  padding-left: 30rpx;
  position: absolute;
  top: 7rpx;
  left: 0;
  z-index: 99;
  // border: 1px solid #2A877C;
}

.slider-btn-group {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1rpx solid #F5F8FD;

  .slider-btn {
    flex: 1;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 38rpx;
    &:active {
      opacity: 0.8;
    }
  }
  .slide-btn-refresh {
    border-left: 1rpx solid #F5F8FD;
  }
}

.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 50rpx;
  padding-right: 50rpx;
}

.text-center-margin {
  text-align: center;
  margin-bottom: 60rpx;
  margin-top: 50rpx;
}

.text-opacity {
  font-size: 16px; // Assuming 'text-base' corresponds to 16px
  opacity: 0.8;
}

.close-button {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  font-size: 32rpx;
  cursor: pointer;
  z-index: 1000;
}
</style>
