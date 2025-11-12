<script setup>
import { onLaunch, onShow, onHide, onTabItemTap } from "@dcloudio/uni-app";
import '@/uni_modules/ev-showModal/js_sdk/index.js'; // 引入自定义modal弹窗
import { usePermissionStore } from '@/stores/permission';

onLaunch(() => {
  console.log("App Launch");
});
onShow(async () => {
  console.log("App Show");
  // 获取权限
  usePermissionStore().fetchPermissions();
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import "uni.scss";
@import "styles/common.scss";
@import '@/uni_modules/zebra-swiper/index.scss';
@import '@/uni_modules/zebra-swiper/modules/pagination/pagination.scss';
@import '@/uni_modules/zebra-swiper/modules/navigation/navigation.scss';
@import '@/uni_modules/zebra-swiper/modules/scrollbar/scrollbar.scss';
@import '@/uni_modules/zebra-swiper/modules/effect-fade/effect-fade.scss';
@import '@/uni_modules/zebra-swiper/modules/effect-flip/effect-flip.scss';
@import '@/uni_modules/zebra-swiper/modules/effect-cards/effect-cards.scss';
@import '@/uni_modules/zebra-swiper/modules/effect-cube/effect-cube.scss';
@import '@/uni_modules/zebra-swiper/modules/effect-creative/effect-creative.scss';
@import '@/uni_modules/zebra-swiper/modules/virtual/virtual.scss';

// #ifndef APP-PLUS-NVUE
@import url('styles/tailwind.css');
page {
  color: theme('colors.neutral.DEFAULT');
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}
// #endif
</style>
