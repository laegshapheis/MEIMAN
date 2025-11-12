<template>
  <layout navTitle="电子签名"  bgType="bg-white" mode="black">
    <!-- 内容区域 => 开始 -->
    <view class="qm-box">
      <view class="le-box">
        <view class="str-tip text-xl text-black"
          >请在上方空白处书写你的签名</view
        >
        <view class="flex justify-between">
          <wk-button @submit="clear" height="252rpx" backgroundColor="#000" class="rounded-[24rpx]" color="#fff"
            >重写</wk-button
          >
          <wk-button @submit="subCanvas" height="252rpx" class="mt-[10rpx]"
            >提交签字</wk-button
          >
        </view>
      </view>
      <view class="re-box rounded-[8rpx]">
        <canvas
          class="handWriting rounded-[48rpx]"
          :disable-scroll="true"
          @touchstart="uploadScaleStart"
          @touchmove="uploadScaleMove"
          @touchend="uploadScaleEnd"
          canvas-id="handWriting"
        ></canvas>
      </view>
    </view>
    <!-- 内容区域 => 结束 -->
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script>
import { uploadFile as uploadFileApi } from "@/api/upload";
export default {
  data() {
    return {
      loading: false,
      loadingText: "",
      showPickerColor: false,
      ctx: "",
      canvasWidth: 0,
      canvasHeight: 0,
      selectColor: "black",
      lineColor: "#1A1A1A",
      points: [],
      historyList: [],
      canAddHistory: true,
      getImagePath: () => {
        return new Promise((resolve) => {
          uni.canvasToTempFilePath({
            canvasId: "handWriting",
            fileType: "png",
            quality: 1, //图片质量
            success: (res) => resolve(res.tempFilePath),
          });
        });
      },
      toDataURL: void 0,
      requestAnimationFrame: void 0,
    };
  },
  props: {
    //可用于修改的参数放在props里   也可单独放在外面做成组件调用  传值
    minSpeed: {
      //画笔最小速度
      type: Number,
      default: 2,
    },
    minWidth: {
      //线条最小粗度
      type: Number,
      default: 3,
    },
    maxWidth: {
      //线条最大粗度
      type: Number,
      default: 10,
    },
    openSmooth: {
      //开启平滑线条（笔锋）
      type: Boolean,
      default: true,
    },
    maxHistoryLength: {
      //历史最大长度
      type: Number,
      default: 20,
    },
    maxWidthDiffRate: {
      //最大差异率
      type: Number,
      default: 20,
    },
    bgColor: {
      //背景色
      type: String,
      default: "",
    },
  },
  onLoad() {
    this.ctx = uni.createCanvasContext("handWriting");
    this.$nextTick(() => {
      uni
        .createSelectorQuery()
        .select(".re-box")
        .boundingClientRect((rect) => {
          this.canvasWidth = rect.width;
          this.canvasHeight = rect.height;
          this.drawBgColor();
        })
        .exec();
    });
  },
  methods: {
    getPickerColor(color) {
      this.showPickerColor = false;
      if (color) {
        this.lineColor = color;
      }
    },
    // 笔迹开始
    uploadScaleStart(e) {
      this.canAddHistory = true;
      this.ctx.setStrokeStyle(this.lineColor);
      this.ctx.setLineCap("round"); //'butt'、'round'、'square'
    },
    // 笔迹移动
    uploadScaleMove(e) {
      let temX = e.changedTouches[0].x;
      let temY = e.changedTouches[0].y;
      this.initPoint(temX, temY);
      this.onDraw();
    },
    /**
     * 触摸结束
     */
    uploadScaleEnd() {
      this.canAddHistory = true;
      this.points = [];
    },
    /**
     * 记录点属性
     */
    initPoint(x, y) {
      var point = {
        x: x,
        y: y,
        t: Date.now(),
      };
      var prePoint = this.points.slice(-1)[0];
      if (
        prePoint &&
        (prePoint.t === point.t || (prePoint.x === x && prePoint.y === y))
      ) {
        return;
      }
      if (prePoint && this.openSmooth) {
        var prePoint2 = this.points.slice(-2, -1)[0];
        point.distance = Math.sqrt(
          Math.pow(point.x - prePoint.x, 2) + Math.pow(point.y - prePoint.y, 2)
        );
        point.speed = point.distance / (point.t - prePoint.t || 0.1);
        point.lineWidth = this.getLineWidth(point.speed);
        if (prePoint2 && prePoint2.lineWidth && prePoint.lineWidth) {
          var rate =
            (point.lineWidth - prePoint.lineWidth) / prePoint.lineWidth;
          var maxRate = this.maxWidthDiffRate / 100;
          maxRate = maxRate > 1 ? 1 : maxRate < 0.01 ? 0.01 : maxRate;
          if (Math.abs(rate) > maxRate) {
            var per = rate > 0 ? maxRate : -maxRate;
            point.lineWidth = prePoint.lineWidth * (1 + per);
          }
        }
      }
      this.points.push(point);
      this.points = this.points.slice(-3);
    },
    /**
     * @param {Object}
     * 线宽
     */
    getLineWidth(speed) {
      var minSpeed =
        this.minSpeed > 10 ? 10 : this.minSpeed < 1 ? 1 : this.minSpeed; //1.5
      var addWidth = ((this.maxWidth - this.minWidth) * speed) / minSpeed;
      var lineWidth = Math.max(this.maxWidth - addWidth, this.minWidth);
      return Math.min(lineWidth, this.maxWidth);
    },
    /**
     * 绘画逻辑
     */
    onDraw() {
      if (this.points.length < 2) return;
      this.addHistory();
      var point = this.points.slice(-1)[0];
      var prePoint = this.points.slice(-2, -1)[0];
      let that = this;
      var onDraw = function onDraw() {
        if (that.openSmooth) {
          that.drawSmoothLine(prePoint, point);
        } else {
          that.drawNoSmoothLine(prePoint, point);
        }
      };
      if (typeof this.requestAnimationFrame === "function") {
        this.requestAnimationFrame(function () {
          return onDraw();
        });
      } else {
        onDraw();
      }
    },
    //添加历史图片地址
    addHistory() {
      if (!this.maxHistoryLength || !this.canAddHistory) return;
      this.canAddHistory = false;
      if (!this.getImagePath) {
        this.historyList.length++;
        return;
      }
      //历史地址 (暂时无用)
      let that = this;
      that.getImagePath().then(function (url) {
        if (url) {
          that.historyList.push(url);
          that.historyList = that.historyList.slice(-that.maxHistoryLength);
        }
      });
    },
    //画平滑线
    drawSmoothLine(prePoint, point) {
      var dis_x = point.x - prePoint.x;
      var dis_y = point.y - prePoint.y;

      if (Math.abs(dis_x) + Math.abs(dis_y) <= 2) {
        point.lastX1 = point.lastX2 = prePoint.x + dis_x * 0.5;
        point.lastY1 = point.lastY2 = prePoint.y + dis_y * 0.5;
      } else {
        point.lastX1 = prePoint.x + dis_x * 0.3;
        point.lastY1 = prePoint.y + dis_y * 0.3;
        point.lastX2 = prePoint.x + dis_x * 0.7;
        point.lastY2 = prePoint.y + dis_y * 0.7;
      }
      point.perLineWidth = (prePoint.lineWidth + point.lineWidth) / 2;
      if (typeof prePoint.lastX1 === "number") {
        this.drawCurveLine(
          prePoint.lastX2,
          prePoint.lastY2,
          prePoint.x,
          prePoint.y,
          point.lastX1,
          point.lastY1,
          point.perLineWidth
        );
        if (prePoint.isFirstPoint) return;
        if (
          prePoint.lastX1 === prePoint.lastX2 &&
          prePoint.lastY1 === prePoint.lastY2
        )
          return;
        var data = this.getRadianData(
          prePoint.lastX1,
          prePoint.lastY1,
          prePoint.lastX2,
          prePoint.lastY2
        );
        var points1 = this.getRadianPoints(
          data,
          prePoint.lastX1,
          prePoint.lastY1,
          prePoint.perLineWidth / 2
        );
        var points2 = this.getRadianPoints(
          data,
          prePoint.lastX2,
          prePoint.lastY2,
          point.perLineWidth / 2
        );
        this.drawTrapezoid(points1[0], points2[0], points2[1], points1[1]);
      } else {
        point.isFirstPoint = true;
      }
    },
    //画不平滑线
    drawNoSmoothLine(prePoint, point) {
      point.lastX = prePoint.x + (point.x - prePoint.x) * 0.5;
      point.lastY = prePoint.y + (point.y - prePoint.y) * 0.5;
      if (typeof prePoint.lastX === "number") {
        this.drawCurveLine(
          prePoint.lastX,
          prePoint.lastY,
          prePoint.x,
          prePoint.y,
          point.lastX,
          point.lastY,
          this.maxWidth
        );
      }
    },
    //画线
    drawCurveLine(x1, y1, x2, y2, x3, y3, lineWidth) {
      lineWidth = Number(lineWidth.toFixed(1));
      this.ctx.setLineWidth && this.ctx.setLineWidth(lineWidth);
      this.ctx.lineWidth = lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(Number(x1.toFixed(1)), Number(y1.toFixed(1)));
      this.ctx.quadraticCurveTo(
        Number(x2.toFixed(1)),
        Number(y2.toFixed(1)),
        Number(x3.toFixed(1)),
        Number(y3.toFixed(1))
      );
      this.ctx.stroke();
      this.ctx.draw && this.ctx.draw(true);
    },
    //画梯形
    drawTrapezoid(point1, point2, point3, point4) {
      this.ctx.beginPath();
      this.ctx.moveTo(Number(point1.x.toFixed(1)), Number(point1.y.toFixed(1)));
      this.ctx.lineTo(Number(point2.x.toFixed(1)), Number(point2.y.toFixed(1)));
      this.ctx.lineTo(Number(point3.x.toFixed(1)), Number(point3.y.toFixed(1)));
      this.ctx.lineTo(Number(point4.x.toFixed(1)), Number(point4.y.toFixed(1)));
      this.ctx.setFillStyle && this.ctx.setFillStyle(this.lineColor);
      this.ctx.fillStyle = this.lineColor;
      this.ctx.fill();
      this.ctx.draw && this.ctx.draw(true);
    },
    //获取弧度
    getRadianData(x1, y1, x2, y2) {
      var dis_x = x2 - x1;
      var dis_y = y2 - y1;
      if (dis_x === 0) {
        return {
          val: 0,
          pos: -1,
        };
      }
      if (dis_y === 0) {
        return {
          val: 0,
          pos: 1,
        };
      }
      var val = Math.abs(Math.atan(dis_y / dis_x));
      if ((x2 > x1 && y2 < y1) || (x2 < x1 && y2 > y1)) {
        return {
          val: val,
          pos: 1,
        };
      }
      return {
        val: val,
        pos: -1,
      };
    },
    //获取弧度点
    getRadianPoints(radianData, x, y, halfLineWidth) {
      if (radianData.val === 0) {
        if (radianData.pos === 1) {
          return [
            {
              x: x,
              y: y + halfLineWidth,
            },
            {
              x: x,
              y: y - halfLineWidth,
            },
          ];
        }
        return [
          {
            y: y,
            x: x + halfLineWidth,
          },
          {
            y: y,
            x: x - halfLineWidth,
          },
        ];
      }
      var dis_x = Math.sin(radianData.val) * halfLineWidth;
      var dis_y = Math.cos(radianData.val) * halfLineWidth;
      if (radianData.pos === 1) {
        return [
          {
            x: x + dis_x,
            y: y + dis_y,
          },
          {
            x: x - dis_x,
            y: y - dis_y,
          },
        ];
      }
      return [
        {
          x: x + dis_x,
          y: y - dis_y,
        },
        {
          x: x - dis_x,
          y: y + dis_y,
        },
      ];
    },
    /**
     * 背景色
     */
    drawBgColor() {
      if (!this.bgColor) return;
      this.ctx.setFillStyle && this.ctx.setFillStyle(this.bgColor);
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.draw && this.ctx.draw(true);
    },
    //图片绘制
    drawByImage(url) {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      try {
        this.ctx.drawImage(url, 0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.draw && this.ctx.draw(true);
      } catch (e) {
        this.historyList.length = 0;
      }
    },
    /**
     * 清空
     */
    clear() {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this.ctx.draw && this.ctx.draw();
      this.drawBgColor();
      this.historyList.length = 0;
    },
    //撤消
    undo() {
      if (!this.getImagePath || !this.historyList.length) return;
      var pngURL = this.historyList.splice(-1)[0];
      this.drawByImage(pngURL);
      if (this.historyList.length === 0) {
        this.clear();
      }
    },
    //是否为空
    isEmpty() {
      return this.historyList.length === 0;
    },
    /**
     * @param {Object} str
     * @param {Object} color
     * 选择颜色
     */
    selectColorEvent(str, color) {
      this.selectColor = str;
      this.lineColor = color;
      this.ctx.setStrokeStyle(this.lineColor);
    },
    async uplodeImg_fun(url) {
      this.loading = true;
      this.loadingText = "上传中...";
      const data = await uploadFileApi(url);
      if (data.status == 1) {
        uni.$showToast({
          icon: "none",
          title: data.msg,
          duration: 3000,
        });
      } else {
        uni.$emit("sign", data.src);
        uni.navigateBack();
      }
      this.loading = false;
    },
    //完成
    subCanvas() {
      if (this.isEmpty()) {
        uni.$showToast({
          title: "没有任何绘制内容哦",
          icon: "none",
        });
        return;
      }
      const that = this;
      uni.canvasToTempFilePath({
        canvasId: "handWriting",
        fileType: "png",
        quality: 1, //图片质量
        success(res) {
          const path = res.tempFilePath;
          if (path) {
            that.uplodeImg_fun(path);
          }
          // uni.$showToast({
          // 	title: '已保存'
          // });
          //保存到系统相册
          // uni.saveImageToPhotosAlbum({
          // 	filePath: res.tempFilePath,
          // 	success(res) {
          // 		console.log(res);
          // 		uni.$showToast({
          // 			title: '已成功保存到相册',
          // 			duration: 2000
          // 		});
          // 	}
          // });
        },
      });
    },
    //保存到相册
    saveCanvasAsImg() {
      uni.canvasToTempFilePath({
        canvasId: "handWriting",
        fileType: "png",
        quality: 1, //图片质量
        success(res) {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              uni.$showToast({
                title: "已保存到相册",
                duration: 3000,
              });
            },
          });
        },
      });
    },
    //预览
    previewCanvasImg() {
      uni.canvasToTempFilePath({
        canvasId: "handWriting",
        fileType: "jpg",
        quality: 1, //图片质量
        success(res) {
          uni.previewImage({
            urls: [res.tempFilePath], //预览图片 数组
          });
        },
      });
    },
  },
};
</script>

<style lang="scss">
// 装饰部分
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
.qm-box {
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - var(--status-bar-height) - 96rpx);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx calc(96rpx + var(--status-bar-height)) 0;
  padding-bottom: 16rpx;
  padding-top: 6rpx;
  .le-box {
    writing-mode: vertical-rl;
    text-orientation: sideways;
    font-size: 36rpx;
    width: 206rpx;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    padding-top: 24rpx;
    box-sizing: border-box;
    .str-tip {
    }
    .bott {
      display: flex;
      align-items: center;
      .chong-xie {
        width: 102rpx;
        height: 234rpx;
        margin-bottom: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: 100% 100%;
        transition: transform 0.1s ease; /* 设置过渡效果 */
        &:active {
          transform: scale(0.9);
        }
      }
      .chong-xie-s {
        width: 102rpx;
        height: 352rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: 100% 100%;
        transition: transform 0.1s ease; /* 设置过渡效果 */
        &:active {
          transform: scale(0.9);
        }
      }
    }
  }
  .re-box {
    width: calc(100% - 206rpx);
    height: 100%;
    // background-color: #F3F1F9;
    position: relative;
  }
}
.handWriting {
  height: 100%;
  background: #F3F1F9;
  width: 100%;
}
</style>
