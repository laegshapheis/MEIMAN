<template>
  <view>
    <!-- 显示当前选择的国家区号 -->
    <view
      class="flex flex-row items-center justify-center"
      @click="showCountryCodePopup"
    >
      <text class="text-base font-bold text-[#252C2F]"
        >+{{ selectedCountry.code }}</text
      >
      <uv-icon
        v-if="!isPopupOpen"
        name="arrow-down"
        size="11"
        color="#252C2F"
        class="mx-[5rpx]"
      />
      <uv-icon
        v-else
        name="arrow-up"
        size="11"
        :color="$colors.white"
        class="mx-[5rpx]"
      />
    </view>

    <!-- 国家区号选择弹窗 -->
    <uv-popup
      ref="countryCodePopup"
      round
      mode="bottom"
      :mask-close-able="true"
      border-radius="30"
      @open="handlePopupOpen"
      @close="handlePopupClose"
    >
      <view
        class="max-h-[70vh] bg-[#FFFFFF]"
      >
        <view
          class="px-[24rpx] flex justify-between items-center py-[24rpx] border-b border-neutral-divider"
        >
          <text class="text-base font-medium text-[#010101]">{{
            popupTitle
          }}</text>
          <text
            class="text-base text-[#010101]"
            @click="countryCodePopup.close()"
            >{{ closeText }}</text
          >
        </view>
        <view class="px-[24rpx] py-[16rpx]">
          <uv-input
            :color="$colors.DEFAULT"
            :placeholder-style="`color: ${$colors.regular}`"
            class="h-[66rpx] text-white"
            prefixIcon="search"
            :prefixIconStyle="`color: ${$colors.regular}` "
            v-model="searchCountry"
            :placeholder="searchPlaceholder"
          />
        </view>
        <scroll-view scroll-y class="h-[55vh] box-border">
          <view
            v-for="(country, index) in filteredCountries"
            :key="index"
            class="mx-[24rpx] flex flex-col items-center border-b border-white/10"
            @click="selectCountry(country)"
          >
            <view
              class="flex flex-row items-center justify-between w-full py-[20rpx]"
            >
              <text class="flex-1 text-[#010101]">{{
                country.name
              }}</text>
              <text class="text-neutral-regular">+{{ country.code }}</text>
            </view>
            <view class="w-full h-[1px] bg-neutral-divider"></view>
          </view>
        </scroll-view>
      </view>
    </uv-popup>
  </view>
</template>

<script setup>
import { ref, computed, watch } from "vue";

// 接收 props
const props = defineProps({
  // 默认选中的国家区号
  defaultCountry: {
    type: Object,
    default: () => ({ name: "中国", code: "86" }),
  },
  // v-model绑定值
  modelValue: {
    type: Object,
    default: null,
  },
  // 国家列表
  countries: {
    type: Array,
    default: () => [
      { name: "中国", code: "86" },
      { name: "美国", code: "1" },
      { name: "英国", code: "44" },
      { name: "日本", code: "81" },
      { name: "韩国", code: "82" },
      { name: "澳大利亚", code: "61" },
      { name: "加拿大", code: "1" },
      { name: "德国", code: "49" },
      { name: "法国", code: "33" },
      { name: "俄罗斯", code: "7" },
      { name: "印度", code: "91" },
      { name: "巴西", code: "55" },
      { name: "西班牙", code: "34" },
      { name: "意大利", code: "39" },
      { name: "阿根廷", code: "54" },
      { name: "南非", code: "27" },
      { name: "新加坡", code: "65" },
      { name: "墨西哥", code: "52" },
      { name: "瑞士", code: "41" },
      { name: "瑞典", code: "46" },
      { name: "挪威", code: "47" },
      { name: "荷兰", code: "31" },
      { name: "比利时", code: "32" },
      { name: "奥地利", code: "43" },
      { name: "爱尔兰", code: "353" },
      { name: "新西兰", code: "64" },
      { name: "希腊", code: "30" },
      { name: "葡萄牙", code: "351" },
      { name: "乌克兰", code: "380" },
      { name: "菲律宾", code: "63" },
      { name: "泰国", code: "66" },
      { name: "马来西亚", code: "60" },
      { name: "印度尼西亚", code: "62" },
      { name: "埃及", code: "20" },
      { name: "沙特阿拉伯", code: "966" },
      { name: "以色列", code: "972" },
      { name: "阿联酋", code: "971" },
    ],
  },
  // 是否显示国旗图标
  showFlag: {
    type: Boolean,
    default: true,
  },
  // 国旗图标
  flagIcon: {
    type: String,
    default: "",
  },
  // 弹窗标题
  popupTitle: {
    type: String,
    default: "选择国家/地区代码",
  },
  // 关闭按钮文本
  closeText: {
    type: String,
    default: "关闭",
  },
  // 搜索框占位符
  searchPlaceholder: {
    type: String,
    default: "搜索",
  },
});

// 定义事件
const emit = defineEmits(["change", "open", "close", "update:modelValue"]);

// 响应式数据
const isPopupOpen = ref(false);
const selectedCountry = ref(props.modelValue || props.defaultCountry);
const searchCountry = ref("");
const countryCodePopup = ref(null);

// 监听modelValue变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedCountry.value = newValue;
    }
  },
  { immediate: true }
);

// 监听selectedCountry变化，更新modelValue
watch(
  () => selectedCountry.value,
  (newValue) => {
    emit("update:modelValue", newValue);
  },
  { immediate: true }
);

// 根据搜索过滤国家列表
const filteredCountries = computed(() => {
  if (!searchCountry.value) return props.countries;
  return props.countries.filter(
    (country) =>
      country.name.includes(searchCountry.value) ||
      country.code.includes(searchCountry.value)
  );
});

// 显示国家区号选择弹窗
const showCountryCodePopup = () => {
  countryCodePopup.value.open();
};

// 选择国家区号
const selectCountry = (country) => {
  selectedCountry.value = country;
  countryCodePopup.value.close();
  emit("change", country);
  emit("update:modelValue", country);
};

// 弹窗打开事件处理
const handlePopupOpen = () => {
  isPopupOpen.value = true;
  emit("open");
};

// 弹窗关闭事件处理
const handlePopupClose = () => {
  isPopupOpen.value = false;
  emit("close");
};

// 暴露方法给父组件
defineExpose({
  open: showCountryCodePopup,
  close: () => countryCodePopup.value.close(),
  getSelectedCountry: () => selectedCountry.value,
});
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>
