<template>
  <wk-stroke-bg class="h-full relative mb-[32rpx] bg-card2">
    <view class="flex flex-row items-center justify-between h-full">
      <image class="w-[354rpx] h-[244rpx]" :src="imgSrc" mode="aspectFit" />

      <view class="h-[192rpx] flex flex-col items-center justify-between">
        <text class="text-neutral-regular text-lg">{{ text }}</text>
        <wk-button
          class="w-[176rpx] h-[56rpx] flex flex-row items-center justify-center text-sm"
          :backgroundColor="$colors.theme"
          @submit="selImg"
          borderRadius="16rpx"
          >
          <text
            class="text-neutral-white text-sm"
          >上传</text>
          <!-- <uv-icon
            class="ml-[8rpx] mt-[4rpx]"
            size="24rpx"
            :color="$colors.theme"
            name="arrow-right"
          ></uv-icon> -->
        </wk-button>
      </view>
    </view>
  </wk-stroke-bg>
  <wk-loading v-if="loading" :loadingText="loadingText" />
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";
import { decrypt } from "@/utils/request";
import { routes } from "@/config/routes";
import { uploadFile as uploadFileApi } from "@/api/upload";
const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  defaultSrc: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
});

const imgSrc = ref(props.src);
const loading = ref(false);
const loadingText = ref("");
const emit = defineEmits(["click"]);
const handleClick = () => {
  emit("click", imgSrc.value);
};
const uplodeImg_fun = async (url) => {
  loading.value = true;
  loadingText.value = "上传中...";
  try {
    const res = await uploadFileApi(url);
    if (res.status == 1) {
      uni.$showToast({
        icon: "none",
        title: res.msg,
        duration: 3000,
      });
    } else {
      imgSrc.value = res.src;
      handleClick();
    }
  } catch (error) {
    loading.value = false;
    uni.reLaunch({ url: routes.login });
  } finally {
    loading.value = false;
  }
};

const selImg = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["camera", "album"],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      uplodeImg_fun(tempFilePath);
    },
  });
};
</script>
