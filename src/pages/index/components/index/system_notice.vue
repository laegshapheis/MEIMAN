<template>
  <view
    class="mb-[20rpx] w-full box-border px-[32rpx] flex items-center"
  >
    <view 
    style="background: rgba(25, 82, 149, 0.25)"
    class="w-full flex flex-row items-center justify-between rounded-full py-[0rpx] px-[16rpx]">
      <image
        class="w-[48rpx] h-[48rpx] mr-[16rpx]"
        src="/static/images/index/notice.svg"
      ></image>
      <!-- <text class="text-base mr-[16rpx] text-[#252628]">公告</text> -->
      <view class="flex-1 flex flex-row items-center">
        <uni-notice-bar
          style="padding-left: 0rpx; padding-right: 16rpx; margin-bottom: 0rpx;"
          background-color="transparent"
          scrollable
          :speed="20"
          :fontSize="14"
          color="#FFFFFF90"
          :text="content"
          @click="open"
        ></uni-notice-bar>
      </view>
    </view>
  </view>
  <uv-overlay
    :show="showModal"
    class="px-[60rpx] box-border flex flex-col items-center justify-center"
    :showClose="false"
  >
    <view
      class="bg-neutral-modalBg w-full flex flex-col items-center relative rounded-[16rpx] p-[48rpx] box-border"
    >
    <image
      class="absolute top-[-30rpx] left-[50rpx] m-auto w-[164rpx] h-[164rpx] z-11"
      src="/static/images/index/notice_icon.png"
      mode="widthFix"
    />
      <view
        class="z-10 absolute top-[20rpx] flex flex-col items-center w-full py-[16rpx]"
        :style="{
          backgroundImage: 'url(/static/images/index/notice_title_bg.png)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '100% 100%'
        }"
      >
        <text class="text-xl my-[24rpx]">系统公告</text>
      </view>
      <scroll-view
        class="min-h-[180rpx] max-h-[480rpx] mt-[100rpx] text-left"
        :show-scrollbar="true"
        :scroll-y="true"
      >
        <uv-parse
          space="nbsp"
          class="uni-rich-text"
          style="white-space: pre-wrap"
          :content="noticeText"
        ></uv-parse>
      </scroll-view>
      <wk-button @submit="close" class="mt-[24rpx] w-full"> 我知道了</wk-button>
      <wk-button @submit="goToNewsList" backgroundColor="transparent" class="w-full mt-[8rpx]" :color="$colors.theme"> 查看历史公告</wk-button>
    </view>
  </uv-overlay>
</template>

<script setup>
import { ref, computed } from "vue";
import { routes } from "@/config/routes";
import { usePermissionStore } from "@/stores/permission";
const { hasPermission } = usePermissionStore();

const isequity = computed(() => {
  return hasPermission("isequity");
});
defineProps({
  content: {
    type: String,
    default: "",
  },
  noticeText: {
    type: String,
    default: "",
  },
  gujia: {
    type: Object,
    default: () => {},
  },
});
const emit = defineEmits(["open"]);
const goToNewsList = () => {
  uni.navigateTo({
    url: routes.newsList + "?id=65&title=历史公告",
  });
};
const showModal = ref(false);
const open = () => {
  showModal.value = true;
  emit("open");
};
const close = () => {
  showModal.value = false;
};

defineExpose({
  open,
  close,
});
</script>

<style lang="scss" scoped>
::v-deep {
  .uni-rich-text img {
    max-width: 100% !important;
  }
}
</style>
