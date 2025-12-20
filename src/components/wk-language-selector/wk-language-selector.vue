<template>
<view
  @click="handleSwitchLanguage"
  :class="[
    'flex-shrink-0 flex flex-row items-center rounded-full px-[18rpx] py-[10rpx]',
    plain ? 'bg-[#202337] text-white border-[length:0.5px] border-[rgba(255, 255, 255, 0.20)] border-solid' : 'text-neutral-theme bg-[#4E4244]',
  ]"
>
  <image
    :src="
      plain
        ? '/static/images/index/world_plain.svg'
        : '/static/images/index/world.svg'
    "
    class="w-[32rpx] h-[32rpx]"
  />
  <text
    :class="[
      'text-sm ml-[8rpx]',
      plain ? 'text-white' : 'text-neutral-theme',
    ]"
    >{{ currentLanguage }}</text
  >
</view>
</template>

<script setup>
import { ref } from "vue";
import { routes } from "@/config/routes";
const props = defineProps({
  plain: {
    type: Boolean,
    default: true,
  },
});
const handleSwitchLanguage = () => {
  uni.navigateTo({
    url: routes.lang,
  });
};
// const props = defineProps({
//   plain: {
//     type: Boolean,
//     default: false,
//   },
// });

// const languages = ref([
// { title: "简体中文", id: "zh-CN" },
//   { title: "繁体中文", id: "zh-TW" },
//   { title: "English", id: "en" },
//   { title: "Bahasa Indonesia", id: "id" },
//   { title: "日本語", id: "ja" },
//   { title: "한국어", id: "ko" },
//   { title: "ภาษาไทย", id: "th" },
//   { title: "Bahasa Melayu", id: "ms" },
//   { title: "Deutsch", id: "de" },
//   { title: "Français", id: "fr" },
//   { title: "Español", id: "es" },
//   { title: "Italiano", id: "it" },
//   { title: "Tiếng Việt", id: "vi" },
//   { title: "Português", id: "pt" },
//   { title: "العربية", id: "ar" },
//   { title: "हिन्दी", id: "hi" },
//   { title: "Русский", id: "ru" },
//   { title: "বাংলা", id: "bn" },
// ]);

const currentLanguage = ref("简体");
// const currentLanguageIndex = ref(0);
// const picker = ref(null);

// const handleChangeLanguage = (e,item) => {
//   const value = item.value[0] || {};
//   if(value.id != "zh-CN"){
//     uni.$showToast({
//       title: "您当前所在的地区不匹配",
//       duration: 3000,
//       icon: "none",
//     });
//     picker.value.setIndexs([0], true);
//     currentLanguageIndex.value = 0;
//     return;
//   }
//   currentLanguage.value = value.title;
//   currentLanguageIndex.value = value.id;
// };
</script>

