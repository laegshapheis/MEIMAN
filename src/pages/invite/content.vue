<template>
  <layout navTitle="下载安装常见问题" bgType="bg-main4" :isLottie="false">
    <view
      class="px-[32rpx] pt-[24rpx] pb-[30rpx] box-border w-full flex flex-col"
    >
      <view
        v-if="content"
        class="text-base rounded-[32rpx] p-[48rpx]"
      >
        <uv-parse
          :show-img-menu="false"
          :content="content"
          container-style="white-space: pre-wrap"
        ></uv-parse>
      </view>
    </view>
  </layout>
</template>
<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getAppDownloadList } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const ua = ref("");
const content = ref("");
onLoad((options) => {
  ua.value = options.ua;
  const cache = cacheManager.getCache("appDownloadContent");
  if (cache) {
    handleCache(cache);
  }
  getAppDownloadContent();
});

const handleCache = (res) => {
  const list = res.list2 || [];
  list.forEach((item) => {
    if (item.os == ua.value) {
      content.value = item.content;
    }
  });
};
const getAppDownloadContent = async () => {
  const res = await getAppDownloadList();
  handleCache(res);
  cacheManager.setCache("appDownloadContent", res);
  console.log(res);
};
</script>
