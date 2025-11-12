import { onShow } from '@dcloudio/uni-app';
import lottieManager from '@/utils/lottie-manager';

export const useLottie = () => {
  onShow(() => {
    console.log('onShow33232')
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const pageId = currentPage.route || currentPage.__route__;
    lottieManager.setActivePage(pageId);
  });
}
