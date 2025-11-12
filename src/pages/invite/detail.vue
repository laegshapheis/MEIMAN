<template>
  <layout
    navTitle="邀请好友"
    bgType="bg-main3"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <view class="p-[32rpx] text-center">
      <image
        src="/static/images/base/invite_logo.png"
        class="w-[176rpx] h-[176rpx]"
        mode="widthFix"
      ></image>
      <wk-stroke-bg
        shadow
        borderRadius="32rpx"
        class="relative flex flex-col items-center rounded-[16rpx] mt-[40rpx]"
      >
        <view
          class="font-medium px-[32rpx] bg-[#F3F5FC] py-[10rpx] flex flex-row justify-center text-neutral-white text-lg rounded-[360rpx] mt-[24rpx]"
        >
          <text class="text-neutral text-lg font-medium">邀请码：{{ linkCode }}</text>
          <view
            class="flex flex-row items-center ml-[16rpx] text-base text-neutral-theme"
            @click="copyInfo"
          >
            <image
              class="w-[36rpx] h-[36rpx]"
              src="/static/images/base/copy.svg"
              mode="widthFix"
            />复制
          </view>
        </view>
        <view
          class="bg-[#FBFBFB] rounded-[16rpx] w-[360rpx] h-[360rpx] box-border mt-[32rpx]"
        >
          <view
            class="w-full h-full flex flex-col justify-center items-center mt-[5rpx]"
          >
            <tki-qrcode
              ref="qrcode"
              :cid="'cid'"
              :val="imgUrl"
              :size="300"
              :onval="true"
              :showLoading="false"
              loadingText="..."
            />
          </view>
        </view>

        <view class="mt-[24rpx] text-sm text-neutral">
          <view class="flex flex-row items-center justify-center mb-[16rpx]">
            <image
              class="w-[44rpx] h-[44rpx] mr-[16rpx]"
              :src="downloadIcon[ua]"
              mode="widthFix"
            />
            <text class="text-lg font-semibold">{{ downloadText[ua] }}</text>
          </view>
          <text class="text-base bg-[#F3F5FC] rounded-[360rpx] px-[16rpx] py-[8rpx]"
            >{{ imgUrl
            }}<view
              class="ml-[16rpx] inline-block text-base"
              @click="copyLink"
            >
              <image
                class="w-[36rpx] h-[36rpx] mb-[-4rpx]"
                src="/static/images/base/copy.svg"
                mode="widthFix"
              />
            </view></text
          >
        </view>
      </wk-stroke-bg>
    </view>
    <view class="px-[32rpx] pb-[150rpx] my-[24rpx]">
      <rich-text
        class="text-base leading-6 text-neutral-theme"
        :nodes="yaoqinconte"
      ></rich-text>
    </view>
    <view
      class="fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx] pb-[56rpx] border-[length:1rpx] border-neutral-divider border-l-0 border-r-0 border-b-0 bg-neutral-bottomBtnBg"
    >
      <wk-button type="bg" @submit="saveImage">
        保存图片
      </wk-button>
    </view>
    <uv-popup
      ref="popup"
      type="bottom"
      custom-style="backgroundColor: transparent"
    >
      <view @click="closeImgk">
        <image
          class="fen_xiang_tu"
          :src="saveImgObjUrl"
          mode="widthFix"
        ></image>
      </view>
    </uv-popup>
    <!-- 海报生成 -->
    <l-painter
      isCanvasToTempFilePath
      @success="saveImg($event)"
      hidden
      css="background: #fff; box-sizing: border-box; position: relative; width: 750rpx; height: 100%; position: relative;"
    >
      <l-painter-image
        src="/static/images/bg/main3.png"
        css="position: absolute; top: 0; left: 0; z-index: -1;width: 100%; height: 100%;"
      />
      <l-painter-view
        css="padding-top: 32rpx; width: 176rpx; height: 176rpx; position: relative; z-index: 22; margin: auto;"
      >
        <l-painter-image
          src="/static/images/base/invite_logo.png"
          css="width: 100%; height: 100%; object-fit: contain;"
        />
      </l-painter-view>
      <l-painter-view
        css="
            margin-top: 32rpx;
            z-index: 33;
            padding: 40rpx 32rpx;
            box-sizing: border-box;
            border-radius: 32rpx;
            margin-left: 40rpx;
            position:relative;
            box-sizing: border-box; 
            width: 90%;
            display:flex;
            justify-content:center;
            flex-direction:column;
            background: #FFFFFF;
            align-items: center;
            <!-- box-shadow: 0px -3px 8px 0px rgba(27, 55, 135, 0.20) inset, 0px -12px 13.9px 0px rgba(0, 0, 0, 0.20) inset, 0px 4px 13.4px 0px rgba(255, 255, 255, 0.05) inset; -->
        "
      >
        <l-painter-view css="font-weight: 600;">
          <l-painter-text
            :text="'邀请码：' + linkCode"
            :css="{
              display: 'block',
              padding: '0',
              width: '350rpx',
              height: '70rpx',
              textAlign: 'center',
              fontSize: '32rpx',
              color: '#010101',
              background: '#F3F5FC',
              borderRadius: '32rpx',
            }"
          />
        </l-painter-view>
        <l-painter-view
          css="
            width: 380rpx;
            height: 380rpx;
            border-radius: 16rpx;
            box-sizing: border-box;
            padding: 0rpx;
            z-index: 100;
            position: relative;
          "
        >
          <l-painter-qrcode
            css="
                position: absolute;
                padding: 24rpx;
                width: 300rpx;
                height: 300rpx;
                border-radius: 16rpx;
                top: 22rpx;
                left: 22rpx;
                z-index: 10;
                background-color: #FBFBFB;"
            :text="imgUrl"
          >
          </l-painter-qrcode>
        </l-painter-view>
        <l-painter-view
          css="width: 100%; height: 100%; margin: 10rpx auto; text-align: center; flex-direction: row; align-items: center;"
        >
          <l-painter-image
            :src="downloadIcon[ua]"
            css="margin-right: 10rpx; width: 44rpx; height: 44rpx; z-index: 1;object-fit: contain;"
          />
          <l-painter-text
            :text="downloadText[ua]"
            :css="{
              padding: '0',
              color: $colors.DEFAULT,
              fontSize: '16px',
              fontWeight: 600,
            }"
          >
          </l-painter-text>
        </l-painter-view>
        <l-painter-view
          css="width: 100%; height: 100%; margin-top: 10rpx;text-align: center; flex-direction: row; align-items: center;"
        >
          <l-painter-text
            :text="imgUrl"
            :css="{
              padding: '0',
              color: $colors.DEFAULT,
              fontSize: '16px',
              fontWeight: 500,
              borderRadius: '32rpx',
              background: '#F3F5FC',
              padding: '16rpx',
            }"
          ></l-painter-text>
        </l-painter-view>
      </l-painter-view>
      <l-painter-view
        css="position: relative; z-index: 10; padding:10rpx 20rpx 50rpx 40rpx;"
      >
        <l-painter-text
          :text="yaoqinconte"
          :css="{
            marginTop: '20rpx',
            display: 'block',
            lineHeight: '42rpx',
            color: '#06F',
            fontSize: '28rpx',
            fontWeight: 500,
          }"
        ></l-painter-text>
      </l-painter-view>
    </l-painter>
    <wk-loading v-if="loading" :loadingText="loadingText" />
    <wk-modal ref="contentPopup" title="">
      <uv-parse
        :content="content"
        container-style="white-space: pre-wrap"
      ></uv-parse>
    </wk-modal>
  </layout>
</template>
<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import permision from "@/js_sdk/wa-permission/permission.js";
import { getMyLink } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const downloadText = {
  android: "安卓手机下载链接",
  ios: "苹果手机下载链接",
  huawei: "华为手机下载链接",
};
const downloadIcon = {
  android: "/static/images/android.png",
  ios: "/static/images/ios.png",
  huawei: "/static/images/huawei.png",
};

const ua = ref("android");
const linkCode = ref(""); //邀请码
const imgUrl = ref("");
const tuihaomaid = ref(""); //二维码更新编号
const yaoqinconte = ref(""); //邀请规则
const saveImgObjUrl = ref(""); //生成海报的图片
const loading = ref(false);
const loadingText = ref("");
const contentPopup = ref(null);
const content = ref("");
const layoutRef = ref(null);
const popup = ref(null);
const cacheData = cacheManager.getCache("myLink");
onLoad(({ ua: uaParam }) => {
  ua.value = uaParam;
  if (cacheData) {
    handleCache(cacheData);
  }
  getLinkInfo();
});

const handleRefresh = async () => {
  await getLinkInfo();
  layoutRef.value.complete();
};

const closeImgk = () => {
  popup.value.close();
};

const saveImage = async () => {
  if (!saveImgObjUrl.value) {
    uni.$showToast({
      title: "图片生成中，请稍后重试",
      icon: "none",
    });
    return;
  }

  // #ifdef H5
  console.log("请长按图片保存");
  popup.value.open("center");
  // #endif

  // #ifdef APP-PLUS
  popup.value.open("center");
  setTimeout(() => {
    popup.value.close();
  }, 500);

  handleSaveImg();
  // #endif
};

const handleSaveImg = () => {
  uni.saveImageToPhotosAlbum({
    filePath: saveImgObjUrl.value,
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

const saveImg = (eve) => {
  saveImgObjUrl.value = eve;
};

const handleCache = (res) => {
  linkCode.value = res.invicode;
  yaoqinconte.value = res.yaoqinconte;
  tuihaomaid.value = res.tuihaomaid;
  loading.value = false;
  content.value = res.pop_content;
  if (res.pop_content) {
    setTimeout(() => {
      contentPopup.value.open();
    }, 100);
  }
};
const getLinkInfo = () => {
  loading.value = true;
  loadingText.value = "加载中...";
  getMyLink({
    type: ua.value,
  })
    .then((res) => {
      imgUrl.value = res.logo;
      handleCache(res);
      cacheManager.setCache("myLink", res);
    })
    .catch((error) => {
      console.error("请求失败", error);
      loading.value = false;
    });
};

const copyLink = () => {
  uni.setClipboardData({
    data: imgUrl.value,
    success: () => {
      uni.$showToast({
        title: "链接复制成功",
        icon: "none",
      });
    },
  });
};

const copyInfo = () => {
  uni.setClipboardData({
    data: linkCode.value.toString(),
    success: () => {
      uni.$showToast({
        title: "邀请码复制成功",
        icon: "none",
      });
    },
  });
};
</script>

<style lang="scss" scoped></style>
