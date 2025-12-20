/**
 * 模态框管理器
 * 用于管理不同页面的模态框实例，确保uni.$showModal调用的是当前页面的模态框
 */
class ModalManager {
  constructor() {
    // 存储各页面模态框方法的Map
    this.modals = new Map();
    // 保存原始的showModal方法
    this.originalShowModal = null;
  }

  /**
   * 注册页面的模态框方法
   * @param {string} pageId - 页面ID，通常是页面路径
   * @param {Function} modalFunction - 页面的showModal方法
   */
  registerModal(pageId, modalFunction) {
    this.modals.set(pageId, modalFunction);
  }

  /**
   * 注销页面的模态框方法
   * @param {string} pageId - 页面ID
   */
  unregisterModal(pageId) {
    if (this.modals.has(pageId)) {
      this.modals.delete(pageId);
    }
  }

  /**
   * 显示模态框，优先使用当前页面的模态框
   * @param {Object} options - 模态框配置选项
   * @returns {*} 模态框的显示结果
   */
  showModal(options = {}) {
    const pages = getCurrentPages();
    if (pages.length === 0) {
      // 没有页面，使用原始的showModal
      return this.originalShowModal ? this.originalShowModal(options) : uni.showModal(options);
    }

    const currentPage = pages[pages.length - 1];
    const pageId = currentPage.route || currentPage.__route__;
    
    // 获取当前页面的模态框方法
    const modalFunction = this.modals.get(pageId);
    
    if (modalFunction) {
      // 使用当前页面的模态框
      return modalFunction(options);
    } else {
      // 如果当前页面没有注册模态框，使用原始的showModal
      return this.originalShowModal ? this.originalShowModal(options) : uni.showModal(options);
    }
  }

  /**
   * 初始化模态框管理器，替换全局的showModal方法
   */
  init() {
    // 保存原始的showModal方法
    if (!this.originalShowModal) {
      this.originalShowModal = uni.$showModal || uni.showModal;
    }
    
    // 替换全局的showModal方法
    uni.$showModal = this.showModal.bind(this);
  }
}

// 创建单例
const modalManager = new ModalManager();

export default modalManager; 