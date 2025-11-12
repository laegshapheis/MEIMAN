/**
 * 显示toast提示
 * @param {string|object} options - 提示内容或配置对象
 * @param {string} options.title - 提示内容
 * @param {string} options.icon - 图标类型，默认none
 * @param {number} options.duration - 提示显示时间，默认2000ms
 * @returns {Promise} Promise对象
 */
export const showToast = (options) => {
  if (typeof options === 'string') {
    options = {
      title: options
    };
  }
  
  return new Promise((resolve, reject) => {
    uni.$showToast({
      title: options.title || '',
      icon: options.icon || 'none',
      duration: options.duration || 3000,
      success: resolve,
      fail: reject
    });
  });
};

/**
 * 显示加载提示
 * @param {string|object} options - 提示内容或配置对象
 * @param {string} options.title - 提示内容
 * @param {boolean} options.mask - 是否显示透明蒙层
 * @returns {Promise} Promise对象
 */
export const showLoading = (options) => {
  if (typeof options === 'string') {
    options = {
      title: options
    };
  }
  
  return new Promise((resolve, reject) => {
    uni.showLoading({
      title: options.title || '加载中...',
      mask: options.mask !== undefined ? options.mask : true,
      success: resolve,
      fail: reject
    });
  });
};

/**
 * 隐藏加载提示
 */
export const hideLoading = () => {
  uni.hideLoading();
};

/**
 * 显示模态框
 * @param {object} options - 配置对象
 * @param {string} options.title - 标题
 * @param {string} options.content - 内容
 * @param {boolean} options.showCancel - 是否显示取消按钮
 * @param {string} options.cancelText - 取消按钮文字
 * @param {string} options.confirmText - 确认按钮文字
 * @returns {Promise} Promise对象
 */
export const showModal = (options) => {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: options.title || '提示',
      content: options.content || '',
      showCancel: options.showCancel !== undefined ? options.showCancel : true,
      cancelText: options.cancelText || '取消',
      confirmText: options.confirmText || '确定',
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        } else if (res.cancel) {
          resolve(false);
        }
      },
      fail: reject
    });
  });
}; 