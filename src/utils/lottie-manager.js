/**
 * Lottie动画管理器
 * 用于管理不同页面的Lottie动画实例，确保页面切换时正确控制动画播放/暂停
 */
class LottieManager {
  constructor() {
    // 存储各页面Lottie引用的Map
    this.lottieRefs = new Map();
    // 当前活跃的页面ID
    this.activePageId = null;
  }

  /**
   * 注册页面的Lottie引用
   * @param {string} pageId - 页面ID，通常是页面路径
   * @param {Object} lottieRef - 页面的containerBgRef引用
   */
  registerLottie(pageId, lottieRef) {
    this.lottieRefs.set(pageId, lottieRef);
  }

  /**
   * 注销页面的Lottie引用
   * @param {string} pageId - 页面ID
   */
  unregisterLottie(pageId) {
    if (this.lottieRefs.has(pageId)) {
      this.lottieRefs.delete(pageId);
    }
  }

  /**
   * 设置当前活跃的页面，播放当前页面动画，暂停其他页面动画
   * @param {string} pageId - 当前页面ID
   */
  setActivePage(pageId) {
    console.log('setActivePage', pageId)
    // 暂停上一个活跃页面的动画
    if (this.activePageId && this.activePageId !== pageId) {
      const prevLottieRef = this.lottieRefs.get(this.activePageId);
      if (prevLottieRef) {
        prevLottieRef.pauseLottie();
      }
    }

    // 记录新的活跃页面
    this.activePageId = pageId;

    // 播放当前页面的动画
    const currentLottieRef = this.lottieRefs.get(pageId);
    if (currentLottieRef) {
      currentLottieRef.playLottie();
    }
  }

  /**
   * 暂停所有页面的动画
   */
  pauseAll() {
    this.lottieRefs.forEach((lottieRef) => {
      if (lottieRef) {
        lottieRef.pauseLottie();
      }
    });
  }

  /**
   * 初始化Lottie管理器，添加页面生命周期钩子
   */
  init() {
    // 监听页面显示事件
    uni.$on('pageShow', (pageId) => {
      this.setActivePage(pageId);
    });

    // 监听页面隐藏事件
    uni.$on('pageHide', (pageId) => {
      const lottieRef = this.lottieRefs.get(pageId);
      if (lottieRef) {
        lottieRef.pauseLottie();
      }
    });
  }
}

// 创建单例
const lottieManager = new LottieManager();

export default lottieManager; 