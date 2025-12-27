<template>
  <layout navTitle="语言设置" bgType="bg-main">
    <view class="bg-[#1F197D] flex flex-col mx-[32rpx] h-[calc(100vh-240rpx)] rounded-[48rpx]">
      <uv-radio-group v-model="lang" placement="column" iconPlacement="right">
        <view class="flex flex-col w-full">
          <template v-for="item in languages" :key="item.code">
            <view
              class="flex flex-row items-center px-[24rpx] border-b border-gray-100"
            >
            <image
              class="w-[48rpx] h-[48rpx] rounded-full"
              :src="item.flag"
              mode="aspectFit"
            />
              <uv-radio
                activeColor="#06F"
                inactiveColor="#010101"
                iconColor="#ffffff"
                labelColor="#fff"
                backgroundColor=""
                :customStyle="{
                  marginRight: '0',
                  flex: '1',
                  fontSize: '32rpx',
                  fontWeight: '600',
                  padding: '32rpx 0',
                }"
                :name="item.code"
                :label="item.name"
              ></uv-radio>
            </view>
            <view class="w-full h-[1px] bg-neutral-divider"></view>
          </template>
        </view>
      </uv-radio-group>
    </view>
    <view
      class="bg-neutral-bottomBtnBg fixed bottom-0 left-0 right-0 px-[32rpx] py-[16rpx]"
    >
      <wk-button class="" @submit="handleSwitchLanguage">切换语言</wk-button>
    </view>
  </layout>
</template>

<script setup>
import { ref } from "vue";

const lang = ref("zh-CN");

const languages = [
  { code: "zh-CN", name: "中文", flag: "/static/images/flags/china.png" },
  { code: "en-US", name: "English", flag: "/static/images/flags/uk.png" },
  // { code: "id-ID", name: "Indonesia", flag: "/static/images/flags/indonesia.png" },
  // { code: "zh-TW", name: "中文繁體", flag: "/static/images/flags/taiwan.png" },
  // { code: "ja-JP", name: "日本語", flag: "/static/images/flags/japan_icon.png" },
  // { code: "ko-KR", name: "한국어", flag: "/static/images/flags/korea.png" },
  // { code: "th-TH", name: "ภาษาไทย", flag: "/static/images/flags/thailand.png" },
  // { code: "ms-MY", name: "Bahasa Melayu", flag: "/static/images/flags/malaysia.png" },
  // { code: "de-DE", name: "Das ist Deutsch.", flag: "/static/images/flags/germany.png" },
  // { code: "fr-FR", name: "En français", flag: "/static/images/flags/france.png" },
  // { code: "es-ES", name: "español", flag: "/static/images/flags/spain.png" },
  // { code: "it-IT", name: "italiano", flag: "/static/images/flags/italy_icon.png" },
  // { code: "vi-VN", name: "Việt Nam", flag: "/static/images/flags/vietnam.png" },
  // { code: "pt-PT", name: "Lingua portuguesa português", flag: "/static/images/flags/portugal.png" },
  // { code: "ar-SA", name: "العربية", flag: "/static/images/flags/arabic.png" },
  // { code: "hi-IN", name: "हिंदी", flag: "/static/images/flags/india.png" },
  // { code: "ru-RU", name: "Русский язык", flag: "/static/images/flags/russia.png" },
  // { code: "bn-BD", name: "বাঙালি", flag: "/static/images/flags/bangladesh.png" },
];

// 当语言选择变化时会自动更新 lang 值
// 如果需要额外处理，可以添加 watch

// 处理切换语言按钮点击事件
const handleSwitchLanguage = () => {
  uni.navigateBack();
  if (lang.value !== "zh-CN") {
    uni.$showToast({
      title: "暂未开放，敬请期待",
      duration: 3000,
      icon: "none",
    });
  }
  // 这里添加切换语言的逻辑
  console.log("切换语言为:", lang.value);
  // TODO: 实现语言切换功能
};
</script>

<style scoped></style>
