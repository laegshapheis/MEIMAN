<template>
  <layout
    navTitle="邀请好友"
    bgType="bg-main3"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <view class="p-[32rpx]">
      <view class="flex flex-col items-center">
        <image
          src="/static/images/base/invite_logo.png"
          class="w-[240rpx] h-[240rpx]"
          mode="widthFix"
        ></image>
        <text class="text-base text-neutral mt-[48rpx]"
          >请根据对方的手机系统进行邀请</text
        >
      </view>

      <view class="flex flex-col gap-[24rpx] mt-[48rpx]">
        <template v-for="os in osList" :key="os.ua">
          <wk-stroke-bg shadow v-if="linkObj[os.ua]" borderRadius="48rpx" size="middle">
            <view class="flex items-center mb-[32rpx]">
              <image
                class="w-[80rpx] h-[80rpx] rounded-full"
                :src="os.icon"
                mode="aspectFit"
              />
              <view class="ml-[24rpx] flex-1">
                <text class="text-lg font-bold text-neutral block">{{ os.name }}</text>
                <text class="text-sm text-gray-500 mt-[8rpx] block">{{ os.description }}</text>
              </view>
            </view>
            <view class="flex gap-[16rpx] w-full">
              <wk-button
                class="flex-1"
                size="small"
                plain
                @submit="download(os.helpUrl)"
              >
                常见问题
              </wk-button>
              <wk-button
                class="flex-1"
                size="small"
                @submit="download(os.inviteUrl)"
              >
                邀请好友
              </wk-button>
            </view>
          </wk-stroke-bg>
        </template>
      </view>
    </view>
    <!-- <wk-loading v-if="loading" :loadingText="loadingText" /> -->
  </layout>
</template>

<script setup>
import { ref, reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getAppDownloadList } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";
import { routes } from "@/config/routes";
const layoutRef = ref(null);
const loading = ref(false);
const loadingText = ref("");
const isDownloading = ref(false);
const linkObj = reactive({
  ios: false,
  android: false,
  huawei: false,
});

const osList = [
  {
    name: "安卓系统",
    description: "小米、VIVO、OPPO等品牌手机",
    icon: "/static/images/android.png",
    ua: "android",
    buttonColor: "#4CAF50",
    inviteUrl: routes.inviteDetail + "?ua=android",
    helpUrl: routes.appDownloadContent + "?ua=android",
  },
  {
    name: "华为鸿蒙系统",
    description: "华为品牌手机",
    icon: "/static/images/huawei.png",
    ua: "huawei",
    buttonColor: "#E53E3E",
    inviteUrl: routes.inviteDetail + "?ua=huawei",
    helpUrl: routes.appDownloadContent + "?ua=huawei",
  },
  {
    name: "苹果IOS系统",
    description: "苹果iPhone、iPad等设备",
    icon: "/static/images/ios.png",
    ua: "ios",
    buttonColor: "#000000",
    inviteUrl: routes.inviteDetail + "?ua=ios",
    helpUrl: routes.appDownloadContent + "?ua=ios",
  },
];

const getDownloadUrl = async () => {
  loading.value = true;
  loadingText.value = "";
  const res = await getAppDownloadList();
  cacheManager.setCache("appDownload", res);
  handleData(res);
};
const handleData = (res) => {
  console.log(res);
  if (res.status == 0) {
    const list = res.list || [];
    if (list.length == 0) {
      uni.redirectTo({
        url: "mylink",
      });
      isDownloading.value = false;
      return;
    }
    isDownloading.value = true;
    list.forEach((item) => {
      linkObj[item] = true;
    });
  }
  loading.value = false;
};
const handleRefresh = async () => {
  await getDownloadUrl();
  layoutRef.value.complete();
};

const download = (url) => {
  uni.navigateTo({
    url: url,
  });
};
const cacheAppDownload = cacheManager.getCache("appDownload");

// 页面加载时执行
onLoad(() => {
  if (cacheAppDownload) {
    handleData(cacheAppDownload);
  }
  getDownloadUrl();
});
</script>

<style lang="scss" scoped></style>
