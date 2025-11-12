import _showModal from './showModal.js'
import { neutral } from '@/config/colors'

/**
 * @description 自定义弹窗方法
 */
uni.$showModal = function(op = {}) {
  // 设置全局默认值
  op = {
    title: '提示',
    content: '',
    cancelText: '取消',
    confirmText: '确定',
    contentTextColor:neutral.showModal.textColor,
    cancelColor: neutral.showModal.cancelColor,
    confirmColor: neutral.showModal.confirmColor,
    showCancel: true,
    align: 'center', // 内容对齐方式，默认为center
    maskClick: false, // 蒙层点击是否关闭，默认为false
    confirmPosition: 'right', // 确认按钮位置，默认为right
    styleOption: {}, // 自定义样式
    contentColor:neutral.showModal.bgColor,
    titleColor:neutral.showModal.titleColor,
    ...op,
  }
  // #ifdef APP
  let sm = new _showModal(op);
  sm.show();
  // #endif
  // #ifndef APP
  return uni.showModal(op);
  // #endif	
};