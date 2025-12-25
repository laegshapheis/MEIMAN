<template>
  <uv-modal
    ref="modal"
    :title="title"
    zIndex="33"
    :borderRadius="borderRadius"
    :bgColor="bgColor"
    :titleColor="$colors.modalTitleColor"
    :closeOnClickOverlay="false"
    :showConfirmButton="false"
    v-bind="attrs"
  >
    <view class="modal-wrapper" :style="{ backgroundColor: bgColor }">
      <view :class="title ? 'close-btn-title' : 'close-btn'" v-if="showClose" @click="close">
        <image class="w-[64rpx] h-[64rpx]" src="/static/images/component/modal/close.png" mode="widthFix"></image>
      </view>
      <scroll-view class="max-h-[60vh] text-base" scroll-y>
        <slot></slot>
      </scroll-view>
    </view>
  </uv-modal>
</template>
<script setup>
import {
  defineProps,
  defineEmits,
  ref,
  defineExpose,
  useAttrs,
  getCurrentInstance,
} from "vue";
import { neutral } from "@/config/colors";

const modal = ref(null);
const attrs = useAttrs();
const instance = getCurrentInstance();
const $colors = instance?.appContext.config.globalProperties.$colors || neutral;

const props = defineProps({
  title: {
    type: String,
    default: "提示",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  bgColor: {
    type: String,
    default: () => neutral.modalBg,
  },
  borderRadius: {
    type: String,
    default: '48rpx',
  },
});
const emit = defineEmits(["onClose"]);
const open = () => {
  modal.value.open();
};
const close = () => {
  modal.value.close();
  emit("onClose");
};

defineExpose({
  open,
  close,
});
</script>

<style lang="scss" scoped>

.modal-wrapper {
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  right: -40rpx;
  top: -55rpx;
  width: 44rpx;
  height: 44rpx;
  text-align: center;
  font-size: 48rpx;
  cursor: pointer;
  color: theme('colors.neutral.modalTitleColor');
  z-index: 34;

  &:hover {
    color: #666;
  }
}
.close-btn-title {
  position: absolute;
  right: 0rpx;
  top: -80rpx;
  width: 44rpx;
  height: 44rpx;
  text-align: center;
  font-size: 48rpx;
  cursor: pointer;
  color: theme('colors.neutral.modalTitleColor');
  z-index: 34;
}
</style>
