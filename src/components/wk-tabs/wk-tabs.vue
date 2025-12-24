<template>
  <view :class="['wk-tabs', `wk-tabs--${mode}`, customClass]">
    <uv-tabs
      :class="tabsClass"
      :customStyle="mergedCustomStyle"
      :itemStyle="mergedItemStyle"
      :lineColor="computedLineColor"
      :lineHeight="computedLineHeight"
      :lineWidth="computedLineWidth"
      :lineFullWidth="computedLineFullWidth"
      :list="list"
      :activeStyle="mergedActiveStyle"
      :inactiveStyle="mergedInactiveStyle"
      :showBottomBorder="computedShowBottomBorder"
      :bottomBorderColor="bottomBorderColor"
      :current="current"
      :scrollable="scrollable"
      @change="handleChange"
      v-bind="attrs"
    />
  </view>
</template>

<script>
const MODE_PRESETS = {
  normal: {
    lineColor: "#010101",
    lineHeight: "4rpx",
    lineWidth: 40,
    lineFullWidth: false,
    showBottomBorder: false,
    customStyle: {},
    itemStyle: {
      fontSize: "32rpx",
      height: "76rpx",
      minWidth: "150rpx",
    },
    activeStyle: {
      fontSize: "32rpx",
      color: "#FFFFFF",
      fontWeight: "600",
    },
    inactiveStyle: {
      fontSize: "32rpx",
      color: "rgba(37, 44, 47, 0.75)",
    },
  },

  underline: {
    lineColor: "#010101",
    lineHeight: "76rpx",
    lineWidth: "100%",
    lineFullWidth: true,
    showBottomBorder: false,
    customStyle: {},
    itemStyle: {
      fontSize: "32rpx",
      height: "76rpx",
      minWidth: "150rpx",
    },
    activeStyle: {
      fontSize: "32rpx",
      color: "#FFFFFF",
      fontWeight: "600",
    },
    inactiveStyle: {
      fontSize: "32rpx",
      color: "rgba(37, 44, 47, 0.75)",
    },
  },

  button: {
    lineColor: "transparent",
    lineHeight: 0,
    lineWidth: 0,
    lineFullWidth: false,
    showBottomBorder: false,
    customStyle: {
      background: "#1C0D89",
      borderRadius: "24px",
    },
    itemStyle: {
      padding: "0 4rpx",
      height: "auto",
      minWidth: "auto",
    },
    activeStyle: {
      borderRadius: "100rpx",
      padding: "12rpx 32rpx",
      fontSize: "28rpx",
      color: "#fff",
      fontWeight: "bold",
      background: "url(/static/images/component/tabs/tabBtnAc.png) center/cover no-repeat",
    },
    inactiveStyle: {
      borderRadius: "100rpx",
      padding: "12rpx 32rpx",
      fontSize: "28rpx",
      color: "rgba(255, 255, 255, 0.60)",
      backgroundColor: "transparent",
    },
  },

  capsule: {
    lineColor: "#010101",
    lineHeight: "100%",
    lineWidth: "100%",
    lineFullWidth: true,
    showBottomBorder: false,
    customStyle: {
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "100rpx",
      padding: "4rpx",
      border: "0.5px solid rgba(255, 255, 255, 0.25)",
    },
    itemStyle: {
      height: "64rpx",
      padding: "0 32rpx",
    },
    activeStyle: {
      fontSize: "28rpx",
      color: "#FFFFFF",
      fontWeight: "600",
    },
    inactiveStyle: {
      fontSize: "28rpx",
      color: "rgba(255, 255, 255, 0.6)",
    },
  },

  pill: {
    lineColor: "#299DF6",
    lineHeight: "100%",
    lineWidth: "100%",
    lineFullWidth: true,
    customStyle: {
      background: "#000",
      borderRadius: "200rpx",
      padding: "6rpx",
    },
    itemStyle: {
      height: "56rpx",
      padding: "0 40rpx",
    },
    activeStyle: {
      fontSize: "28rpx",
      color: "#FFFFFF",
      fontWeight: "400",
    },
    inactiveStyle: {
      fontSize: "28rpx",
      color: "rgba(255, 255, 255, 0.5)",
    },
  },

  card: {
    lineColor: "transparent",
    lineHeight: 0,
    lineWidth: 0,
    lineFullWidth: false,
    showBottomBorder: false,
    customStyle: {
    },
    itemStyle: {
      height: "auto",
      padding: "0 8rpx",
    },
    activeStyle: {
      padding: "16rpx 48rpx",
      fontSize: "28rpx",
      color: "#FFFFFF",
      fontWeight: "600",
      background: "url(/static/images/component/tabs/tabActive.png) center/100% 100% no-repeat",
      borderRadius: "16rpx",
    },
    inactiveStyle: {
      padding: "16rpx 48rpx",
      fontSize: "28rpx",
      color: "rgba(255, 255, 255, 0.6)",
      background: "url(/static/images/component/tabs/tabIn.png) center/100% 100% no-repeat",
      borderRadius: "16rpx",
    },
  },

  ghost: {
    lineColor: "transparent",
    lineHeight: 0,
    lineWidth: 0,
    lineFullWidth: false,
    showBottomBorder: false,
    customStyle: {},
    itemStyle: {
      height: "auto",
      padding: "0 16rpx",
    },
    activeStyle: {
      padding: "12rpx 24rpx",
      fontSize: "28rpx",
      color: "#299DF6",
      fontWeight: "600",
      backgroundColor: "rgba(41, 157, 246, 0.1)",
      borderRadius: "12rpx",
    },
    inactiveStyle: {
      padding: "12rpx 24rpx",
      fontSize: "28rpx",
      color: "rgba(0, 0, 0, 0.5)",
      backgroundColor: "transparent",
      borderRadius: "12rpx",
    },
  },

  text: {
    lineColor: "transparent",
    lineHeight: 0,
    lineWidth: 0,
    lineFullWidth: false,
    showBottomBorder: false,
    customStyle: {},
    itemStyle: {
      height: "auto",
      padding: "0 24rpx",
    },
    activeStyle: {
      fontSize: "32rpx",
      color: "#010101",
      fontWeight: "bold",
    },
    inactiveStyle: {
      fontSize: "28rpx",
      color: "rgba(0, 0, 0, 0.4)",
    },
  },
};

export { MODE_PRESETS };
</script>

<script setup>
import { ref, computed, watch, useAttrs } from "vue";

const current = ref(0);
const attrs = useAttrs();

const props = defineProps({
  mode: {
    type: String,
    default: "underline",
    validator: (value) => Object.keys(MODE_PRESETS).includes(value),
  },
  list: {
    type: Array,
    default: () => [],
  },
  defaultIndex: {
    type: Number,
    default: 0,
  },
  scrollable: {
    type: Boolean,
    default: true,
  },
  customClass: {
    type: String,
    default: "",
  },
  tabsClass: {
    type: String,
    default: "",
  },
  customStyle: {
    type: Object,
    default: () => ({}),
  },
  itemStyle: {
    type: Object,
    default: () => ({}),
  },
  activeStyle: {
    type: Object,
    default: () => ({}),
  },
  inactiveStyle: {
    type: Object,
    default: () => ({}),
  },
  lineColor: {
    type: String,
    default: "",
  },
  lineHeight: {
    type: [String, Number],
    default: "",
  },
  lineWidth: {
    type: [String, Number],
    default: "",
  },
  lineFullWidth: {
    type: Boolean,
    default: undefined,
  },
  showBottomBorder: {
    type: Boolean,
    default: undefined,
  },
  bottomBorderColor: {
    type: String,
    default: "#010101",
  },
  activeColor: {
    type: String,
    default: "",
  },
  inactiveColor: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["change"]);

const currentPreset = computed(() => MODE_PRESETS[props.mode]);

const mergedCustomStyle = computed(() => ({
  ...currentPreset.value.customStyle,
  ...props.customStyle,
}));

const mergedItemStyle = computed(() => ({
  ...currentPreset.value.itemStyle,
  ...props.itemStyle,
}));

const mergedActiveStyle = computed(() => {
  const preset = { ...currentPreset.value.activeStyle };
  if (props.activeColor) preset.color = props.activeColor;
  return { ...preset, ...props.activeStyle };
});

const mergedInactiveStyle = computed(() => {
  const preset = { ...currentPreset.value.inactiveStyle };
  if (props.inactiveColor) preset.color = props.inactiveColor;
  return { ...preset, ...props.inactiveStyle };
});

const computedLineColor = computed(() => 
  props.lineColor || currentPreset.value.lineColor
);

const computedLineHeight = computed(() => 
  props.lineHeight !== "" ? props.lineHeight : currentPreset.value.lineHeight
);

const computedLineWidth = computed(() => 
  props.lineWidth !== "" ? props.lineWidth : currentPreset.value.lineWidth
);

const computedLineFullWidth = computed(() => 
  props.lineFullWidth !== undefined ? props.lineFullWidth : currentPreset.value.lineFullWidth
);

const computedShowBottomBorder = computed(() => 
  props.showBottomBorder !== undefined ? props.showBottomBorder : currentPreset.value.showBottomBorder
);

const handleChange = (item) => {
  const index = props.list.findIndex((i) => i.id === item.id);
  current.value = index >= 0 ? index : 0;
  emit("change", item, index);
};

watch(
  () => props.defaultIndex,
  (newVal) => {
    current.value = newVal;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.wk-tabs {
  :deep(.uv-tabs__wrapper__nav__item) {
    z-index: 10;
  }
}

.wk-tabs--underline {
  :deep(.uv-tabs__wrapper__nav__line) {
    height: 100%;
    border-radius: 100rpx;
  }
  :deep(.uv-tabs__wrapper__nav) {
    border-radius: 100rpx;
    border: 0.5px solid rgba(255, 255, 255, 0.25);
    background: #000;
    backdrop-filter: blur(4px);
  }
}

.wk-tabs--capsule {
  :deep(.uv-tabs__wrapper__nav__line) {
    height: 100%;
    border-radius: 100rpx;
  }
  :deep(.uv-tabs__wrapper__nav) {
    border-radius: 100rpx;
  }
}

.wk-tabs--pill {
  overflow: visible;
  padding: 4rpx;
  margin: -4rpx;
  
  :deep(.uv-tabs) {
    overflow: visible;
  }
  :deep(.uv-tabs__wrapper) {
    overflow: visible;
  }
  :deep(.uv-tabs__wrapper__scroll-view-wrapper) {
    overflow: visible !important;
  }
  :deep(.uv-tabs__wrapper__scroll-view) {
    overflow: visible !important;
  }
  :deep(.uv-tabs__wrapper__nav) {
    border-radius: 200rpx;
    overflow: visible;
  }
  :deep(.uv-tabs__wrapper__nav__item) {
    overflow: visible;
  }
  :deep(.uv-tabs__wrapper__nav__line) {
    border-radius: 360rpx;
    border: 2px solid rgba(255, 255, 255, 0.50);
    background-color: #299DF6;
    background-image: url('/static/images/base/tab_btn_bg.png') !important;
    box-shadow: 0 4px 4px 0 rgba(63, 171, 255, 0.20);

    box-sizing: border-box;
    bottom: 0 !important;
    height: calc(100% - 4rpx) !important;
    top: 2rpx;
  }
}

.wk-tabs--button,
.wk-tabs--card,
.wk-tabs--ghost,
.wk-tabs--text {
  :deep(.uv-tabs__wrapper__nav) {
    border-bottom: none !important;
  }
}
</style>
