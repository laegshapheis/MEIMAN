let instance = null;
let osName = uni.getSystemInfoSync().osName;
/**
 * @author Evelyn
 * @constructor
 */
export class _showModal {
  constructor(option = {}) {
    /**
     * @description 支持自定义修改参数
     *
     * 横竖屏不一致可以自行增加 uni.getDeviceInfo().deviceOrientation === 'landscape' 进行适配
     * 看清单位
     */
    let styleOption = {
      widthPerc:
        uni.getDeviceInfo().deviceOrientation === "landscape" ? -30 : 0, // 横屏：竖屏，单位 %
      buttonHeight: 48, // 按钮高度，单位 px
      titleFontSize: 16, // 标题字体大小，单位 px
      contentFontSize: 14, // 内容字体大小，单位 PX
      buttonFontSize: 16, // 按钮字体大小，单位 px
      titlePadding: [2.8, 5, 0, 5], // 弹窗内边距，单位 %
      contentPadding: [1.8, 5, 3.8, 5], // 内容内边距，单位 %
      borderRadius: 0, // 边框radius，单位 px
    };

    instance = this;
    this.currentPage =
      getCurrentPages()[getCurrentPages().length - 1]?.$getAppWebview();
    this.bodyModel = null;
    this.cancelModel = null;
    this.confirmModel = null;
    this.pageHeight = uni.getSystemInfoSync().screenHeight;
    let title = option.title || "";
    let content = option.content || "";
    let cancelVal = option.cancelText || "";
    cancelVal = cancelVal.substring(0, 4);
    let confirmVal = option.confirmText || "";
    confirmVal = confirmVal.substring(0, 4);
    let cancelColor = option.cancelColor || "#999";
    let confirmColor = option.confirmColor || "#3ABDFE";
    let contentColor = option.contentColor || "#000";
    let contentTextColor = option.contentTextColor || "#000";
    let titleColor = option.titleColor || "#000";
    let showCancel =
      typeof option.showCancel === "boolean" ? option.showCancel : true;
    let fn = () => {};
    this.$success = option.success || fn;
    styleOption = Object.assign(styleOption, option.styleOption || {});
    Object.freeze(styleOption);

    /**
     * @description 修改content对齐位置
     * @type {string} ['left' | 'center' | 'right']
     */
    const align = option.align || "center";
    /**
     * @description 修改蒙层是否可点击关闭
     * @type {Boolean} [true | false]
     */
    const clickEvent =
      typeof option.maskClick === "boolean" ? option.maskClick : false;
    /**
     * @description 确认按钮位置
     * @type {Boolean} ['left' | 'right']
     */
    const confirmPosition = option.confirmPosition || "left";

    //#ifdef APP-PLUS
    this.creatView(
      {
        height: `${this.pageHeight}px`,
        top: 0,
      },
      {
        title,
        content,
        cancelVal,
        confirmVal,
        confirmColor,
        cancelColor,
        contentColor,
        titleColor,
        showCancel,
        confirmPosition,
        clickEvent,
        align,
        contentTextColor,
      },
      styleOption
    );
    //#endif
  }
  //生成提示框view
  creatView(style, modelInfo, op) {
    /**
     * @description 总共字节
     */
    const replaceStr = modelInfo.content.replace(/[^\u0000-\u00ff]/g, "aa");
    /**
     * @description 按换行符分开的内容数组
     */
    const contentArr = replaceStr.split("\n");
    /**
     * @description 一行的宽度
     */
    const oneLine =
      Math.floor(
        (uni.getSystemInfoSync().screenWidth *
          (70 - op.contentPadding[3] - op.contentPadding[1] + op.widthPerc)) /
          100 /
          op.contentFontSize
      ) * 2;

    function getOneWord(fs) {
      return (21.4 / 16) * fs;
    }

    function getOneWordMin(fs) {
      return (22 / 16) * fs;
    }
    /**
     * @description 内容总高度
     */
    let contentHeight = 0;
    contentArr.map((x) => {
      contentHeight +=
        Math.ceil(x.length / oneLine) * getOneWord(op.contentFontSize);
    });
    if (
      contentHeight < getOneWordMin(op.contentFontSize) &&
      contentHeight > 0
    ) {
      contentHeight = getOneWordMin(op.contentFontSize);
    }

    /**
     *  @description 获取高度的百分比
     */
    const getHeightR = (height) => {
      return (height / this.pageHeight) * 100;
    };

    style = {
      left: "0px",
      width: "100%",
      ...style,
    };

    let view = new plus.nativeObj.View("showModalView", style);
    view.draw([
      // 蒙层
      {
        tag: "rect",
        id: "modal",
        color: `rgba(0,0,0,0.4)`,
        position: {
          top: "0px",
          left: "0px",
          width: "100%",
          height: "100%",
        },
      },
      // 内容
      {
        tag: "rect",
        id: "content",
        color: modelInfo.contentColor,
        rectStyles: {
          color: modelInfo.contentColor,
          radius: `${op.borderRadius}px`,
        },
        position: {
          top: `${
            44.8 -
            getHeightR(
              contentHeight + op.buttonHeight + getOneWordMin(op.titleFontSize)
            ) /
              2
          }%`,
          left: `${15 - op.widthPerc / 2}%`,
          width: `${70 + op.widthPerc}%`,
          height: `${
            op.titlePadding[0] +
            op.titlePadding[2] +
            op.contentPadding[0] +
            op.contentPadding[2] +
            getHeightR(
              contentHeight + op.buttonHeight + getOneWordMin(op.titleFontSize)
            )
          }%`,
        },
      },
      {
        tag: "font",
        id: "title",
        text: modelInfo.title,
        textStyles: {
          size: op.titleFontSize,
          color: modelInfo.titleColor,
          weight: "bold",
          overflow: "ellipsis",
        },
        position: {
          top: `${
            44.8 -
            getHeightR(
              contentHeight + op.buttonHeight + getOneWordMin(op.titleFontSize)
            ) /
              2 +
            2.8
          }%`,
          left: `${15 + op.titlePadding[3] - op.widthPerc / 2}%`,
          width: `${
            70 - op.titlePadding[1] - op.titlePadding[3] + op.widthPerc
          }%`,
          height: `${getOneWordMin(op.titleFontSize)}px`,
        },
      },
      {
        tag: "font",
        id: "text",
        text: modelInfo.content,
        textStyles: {
          size: op.contentFontSize,
          color: modelInfo.contentTextColor,
          whiteSpace: "normal",
          align: modelInfo.align,
          verticalAlign: "top",
        },
        position: {
          top: `${
            47.6 -
            getHeightR(
              contentHeight + op.buttonHeight - getOneWordMin(op.titleFontSize)
            ) /
              2 +
            op.contentPadding[0]
          }%`,
          left: `${15 + op.contentPadding[3] - op.widthPerc / 2}%`,
          width: `${
            70 - op.contentPadding[3] - op.contentPadding[1] + op.widthPerc
          }%`,
          height: getHeightR(contentHeight) + "%",
        },
      },
      {
        tag: "rect",
        id: "line",
        color: "rgba(0,0,0,0.2)",
        position: {
          top: `${
            47.6 -
            getHeightR(
              -contentHeight + op.buttonHeight - getOneWordMin(op.titleFontSize)
            ) /
              2 +
            op.contentPadding[0] +
            op.contentPadding[2]
          }%`,
          left: `${15 - op.widthPerc / 2}%`,
          width: `${70 + op.widthPerc}%`,
          height: "1px",
        },
      },
      {
        tag: "rect",
        id: "line2",
        color: "rgba(0,0,0,0.2)",
        position: {
          top: `${
            47.6 -
            getHeightR(
              -contentHeight + op.buttonHeight - getOneWordMin(op.titleFontSize)
            ) /
              2 +
            op.contentPadding[0] +
            op.contentPadding[2]
          }%`,
          left: "49%",
          width: !modelInfo.showCancel ? "0px" : "1px",
          height: !modelInfo.showCancel ? "0px" : `${op.buttonHeight}px`,
        },
      },
    ]);

    let topNum = osName === 'ios' ? 49.6 : 47.6;
    if (modelInfo.showCancel) {
      // 取消
      let viewCancel = new plus.nativeObj.View("cancel", {
        width: `${(70 + op.widthPerc) / 2}%`,
        height: `${op.buttonHeight}px`,
        top: `${
          topNum -
          getHeightR(
            -contentHeight + op.buttonHeight - getOneWordMin(op.titleFontSize)
          ) /
            2 +
          op.contentPadding[0] +
          op.contentPadding[2]
        }%`,
        left:
          modelInfo.confirmPosition === "left"
            ? "50%"
            : `${15 - op.widthPerc / 2}%`,
        backgroundColor: "rgba(255,255,255,0)",
      });
      viewCancel.draw([
        {
          tag: "font",
          id: "cancel",
          text: modelInfo.cancelVal,
          textStyles: {
            color: modelInfo.cancelColor,
            size: "16px",
            align: "center",
            verticalAlign: "middle",
          },
        },
      ]);

      viewCancel.addEventListener(
        "click",
        (e) => {
          this.$success({
            cancel: true,
          });
          this.hide();
        },
        false
      );
      this.cancelModel = viewCancel;
    }

    // 确认
    let viewconfirm = new plus.nativeObj.View("confirm", {
      width: !modelInfo.showCancel
        ? `${70 + op.widthPerc}%`
        : `${(70 + op.widthPerc) / 2}%`,
      height: `${op.buttonHeight}px`,
      top: `${
        topNum -
        getHeightR(
          -contentHeight + op.buttonHeight - getOneWordMin(op.titleFontSize)
        ) /
          2 +
        op.contentPadding[0] +
        op.contentPadding[2]
      }%`,
      left:
        !modelInfo.showCancel || modelInfo.confirmPosition === "left"
          ? `${15 - op.widthPerc / 2}%`
          : "50%",
      backgroundColor: "rgba(255,255,255,0)",
    });
    viewconfirm.draw([
      {
        tag: "font",
        id: "confirm",
        text: modelInfo.confirmVal,
        textStyles: {
          color: modelInfo.confirmColor,
          size: "16px",
          align: "center",
          verticalAlign: "middle",
        },
      },
    ]);

    viewconfirm.addEventListener(
      "click",
      (e) => {
        this.$success({
          confirm: true,
        });
        this.hide();
      },
      false
    );
    //点击蒙布
    if (modelInfo.clickEvent) {
      view.addEventListener(
        "click",
        (e) => {
          this.$success({
            mask: true,
          });
          this.hide();
        },
        false
      );
    }
    this.bodyModel = view;
    this.confirmModel = viewconfirm;
  }
  showModalAnimationClose() {
    var options = {
      type: "pop-out",
      duration: 300,
    };
    plus.nativeObj.View.startAnimation(
      options,
      {
        view: this.bodyModel,
      },
      {
        view: this.cancelModel,
      },
      {
        view: this.viewconfirm,
      },
      function () {
        console.log("plus.nativeObj.View.startAnimation动画结束");
        // 关闭原生动画
        plus.nativeObj.View.clearAnimation();
      }
    );
  }
  showModalAnimationOpen() {
    var options = {
      type: "pop-in",
      duration: 1000,
    };

    plus.nativeObj.View.startAnimation(
      options,
      {
        view: this.bodyModel,
      },
      {
        view: this.cancelModel,
      },
      {
        view: this.viewconfirm,
      },
      function () {
        console.log("plus.nativeObj.View.startAnimation动画结束");
        // 关闭原生动画
        plus.nativeObj.View.clearAnimation();
      }
    );
  }
  show() {
    try {
      if (osName === "ios") {
        // ios监听侧滑返回并关闭弹窗
        this.currentPage?.addEventListener("popGesture", this.handleBackButton);
      } else {
        // 安卓监听返回
        plus.key.addEventListener("backbutton", this.handleBackButton);
      }
    } catch (e) {}

    this.showModalAnimationOpen();
    this.bodyModel.show();
    if (this.cancelModel) {
      this.cancelModel.show();
    }
    this.confirmModel.show();
  }
  hide() {
    try {
      if (osName === "ios") {
        this.currentPage?.removeEventListener(
          "popGesture",
          this.handleBackButton
        );
      } else {
        plus.key.removeEventListener("backbutton", this.handleBackButton);
      }
    } catch (e) {}

    this.showModalAnimationClose();
    this.bodyModel.hide();
    if (this.cancelModel) {
      this.cancelModel.hide();
    }
    this.confirmModel.hide();
  }
  handleBackButton(e) {
    try {
      let status = true;
      if (osName === "ios") {
        status = e.type === "end" && e.result;
      }
      if (status) {
        instance &&
          instance.$success({
            cancel: true,
          });
        instance && instance.hide();
      }
    } catch (e) {}
  }
}

export default _showModal;
