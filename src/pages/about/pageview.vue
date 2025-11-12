<template>
  <layout
    :navTitle="title"
    bgType="bg-white"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <template #navRight>
      <view v-if="hasPermission('cms_save_to_album_switch')" class="flex items-center justify-center px-[16rpx] py-[8rpx] rounded-full" @click="saveImage">
        <image
          class="w-[32rpx] h-[32rpx] mr-[8rpx]"
          src="/static/images/base/download.svg"
          mode="widthFix"
        >
        </image>
        <text class="text-base text-black">保存</text>
      </view>
    </template>
    <view
      class="px-[32rpx] pt-[24rpx] pb-[30rpx] box-border w-full flex flex-col"
    >
      <view v-if="details.ccontent" class="article_box text-base">
        <uv-parse
          :show-img-menu="false"
          class="parse-container"
          :content="details.ccontent"
          container-style="white-space: pre-wrap"
        ></uv-parse>
      </view>
    </view>
    <uv-popup
      ref="popup"
      type="bottom"
      custom-style="backgroundColor: transparent"
    >
      <scroll-view scroll-y @click="closeImgk" class="w-[90vw] h-[90vh]">
        <image class="w-full h-full" :src="imageUrl" mode="widthFix"></image>
      </scroll-view>
    </uv-popup>
    <l-painter
      isCanvasToTempFilePath
      @success="saveImg($event)"
      hidden
      css="background: #fff;box-sizing: border-box; position: relative; width: 750rpx;  position: relative;"
    >
      <!-- <l-painter-image
        src="/static/images/bg/main.png"
        css="position: absolute; top: 0; left: 0; z-index: -1;width: 100%;"
      /> -->
      <l-painter-view
        css="width: 100%; padding: 40rpx 0rpx; box-sizing: border-box; border-radius: 32rpx; margin-left: 22rpx;  position:relative; box-sizing: border-box; width: 90%; display:flex; justify-content:center; flex-direction:column; align-items: center;"
      >
        <l-painter-view css="width: 100%; min-height: 100vh; margin-top: 20rpx;">
          <l-painter-text
            :text="plainTextContent"
            :css="{
              padding: '0',
              color: '#252C2F',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '42rpx',
            }"
          ></l-painter-text>
        </l-painter-view>
      </l-painter-view>
    </l-painter>
    <wk-loading v-if="loading" />
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { setImageWidth } from "@/utils/utils";
import { getPageDetails as getPageDetailsApi } from "@/api/index";
import { cacheManager } from "@/utils/cacheManager";
import permision from "@/js_sdk/wa-permission/permission.js";
import { usePermissionStore } from "@/stores/permission";

const permissionStore = usePermissionStore();
const { hasPermission } = permissionStore;

const cacheDetails = cacheManager.getCache("pageview");

const links = ref(0);
const title = ref("");
const details = ref({});
const imageUrl = ref("");
const popup = ref(null);

const saveImg = (e) => {
  imageUrl.value = e;
};

onLoad((options) => {
  links.value = options.links;
  if (cacheDetails) {
    handleResDetails(cacheDetails);
  }
  getDetails();
});

const loading = ref(false);
const layoutRef = ref(null);
const handleRefresh = async () => {
  await getDetails();
  layoutRef.value.complete();
};

const handleResDetails = (result) => {
  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });

    return;
  }

  // #ifdef APP-PLUS
  result.article.ccontent = setImageWidth(result.article.ccontent, "100%");
  // #endif

  details.value = result.article;
  title.value = result.title;

  loading.value = false;
};

const getDetails = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
  }

  try {
    const result = await getPageDetailsApi({
      links: links.value,
    });
    cacheManager.setCache("pageview", result);
    console.log(result);
    handleResDetails(result);
  } catch (e) {
    loading.value = false;
  }
};

const closeImgk = () => {
  popup.value.close();
};

const saveImage = async () => {
  // #ifdef H5
  console.log("请长按图片保存");
  popup.value.open("center");
  // #endif

  // #ifdef APP-PLUS
  popup.value.open("center");
  setTimeout(() => {
    popup.value.close();
  }, 500);

  const result = await permision.requestAndroidPermission(
    "android.permission.WRITE_EXTERNAL_STORAGE"
  );

  if (result == 1) {
    handleSaveImg();
  } else if (result == 0) {
    // 未获得授权
  } else {
    uni.$showModal({
      title: "提示",
      content: "保存图片需要相册权限，请到设置中开启。",
      success(res) {
        if (res.confirm) {
          permision.gotoAppPermissionSetting();
        }
      },
    });
  }
  // #endif
};

const handleSaveImg = () => {
  uni.saveImageToPhotosAlbum({
    filePath: imageUrl.value,
    success() {
      uni.$showToast({
        position: "center",
        icon: "none",
        title: "图片保存成功，请到手机相册查看",
      });
    },
    fail(e) {
      uni.$showModal({
        content: `保存相册失败，errCode：${e.errCode}，errMsg：${e.errMsg}，errSubject：${e.errSubject}`,
        showCancel: false,
      });
    },
  });
};

const plainTextContent = computed(() => {
  if (!details.value.ccontent) return "";
  return details.value.ccontent.replace(/<[^>]+>/g, "");
});
</script>

<style lang="scss">
.article_box {
  box-sizing: border-box;
  position: relative;
}

.fen_xiang_tu {
  width: 100%;
}
</style>
