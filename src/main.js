import { createSSRApp } from "vue";
import App from "./App.vue";
import * as Pinia from 'pinia';
import {requestApi} from "@/utils/request";
import { neutral } from '@/config/colors'
import i18n from './locale'


// uni.$showModal = function(params = {}) {
//   const op = {
//     title: '提示',
//     content: '',
//     cancelText: '取消',
//     confirmText: '确定',
//     cancelColor: '#999',
//     confirmColor: neutral.theme, 
//     showCancel: true,
//     align: 'center', // 内容对齐方式，默认为center
//     maskClick: false, // 蒙层点击是否关闭，默认为false
//     confirmPosition: 'right', // 确认按钮位置，默认为right
//     styleOption: {}, // 自定义样式
//     ...params,
//   }
//   uni.showModal(op);
// }
// 这里定义全局的返回函数
function backWithAnim(delta = 1, animationType = 'pop-out', animationDuration = 200) {
  uni.navigateBack({
    delta,
    animationType,
    animationDuration
  });
}

function navigateWithAnim(url, animationType = 'pop-in', animationDuration = 200) {
  uni.navigateTo({
    url,
    animationType,
    animationDuration
  });
}

function sxCopyText(content, message = '复制成功', duration = 800) {
  // 使用系统剪贴板API进行复制
  uni.setClipboardData({
      data: content,
      success: function() {
          // 复制成功后，显示提示信息
          uni.showToast({
              title: message,
              icon: 'none',
              duration: duration
          });
      },
      fail: function() {
          // 复制失败时，提示失败信息
          uni.showToast({
              title: '复制失败，请重试',
              icon: 'none',
              duration: duration
          });
      }
  });
};

export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  app.use(i18n);

  // 将颜色配置挂载到全局
  app.config.globalProperties.$colors = neutral;
  // 将导航函数挂载到全局
  app.config.globalProperties.$backWithAnim = backWithAnim;
  app.config.globalProperties.$navigateWithAnim = navigateWithAnim;
  app.config.globalProperties.$sxCopyText = sxCopyText;
  // 自定义toast
  uni.$showToast = function(op) {
    uni.showToast({
      ...op,
      icon: op.icon || 'none',
      duration: op.duration || 3000,
    });
  }
  // 将 requestApi 函数挂载到全局
  app.config.globalProperties.$requestApi = requestApi;

  return {
    app,
    Pinia,
  };
}
