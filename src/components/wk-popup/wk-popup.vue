<template>
  <uv-modal ref="modal" :title="title" zIndex="33" :closeOnClickOverlay="false" :showConfirmButton="false" v-bind="attrs">
    <view class="modal-wrapper">
      <view class="close-btn" v-if="showClose" @click="close">×</view>
      <scroll-view class="max-h-[60vh]" scroll-y>
        <slot></slot>
      </scroll-view>
    </view>
  </uv-modal>
</template>
<script setup>
  import { defineProps, defineEmits, watch, ref, defineExpose, useAttrs } from 'vue';
  const modal = ref(null);
  const attrs = useAttrs();
  const props = defineProps({
    title: {
      type: String,
      default: '提示'
    },
    showClose: {
      type: Boolean,
      default: true
    }
  });

  const open = () => {
    modal.value.open();
  };
  const close = () => {
    modal.value.close();
  };

  defineExpose({
    open,
    close
  });
</script>

<style lang="scss" scoped>
.modal-wrapper {
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  right: 0rpx;
  top: -80rpx;
  width: 44rpx;
  height: 44rpx;
  text-align: center;
  font-size: 48rpx;
  cursor: pointer;
  color: #999;
  z-index: 34;
  
  &:hover {
    color: #666;
  }
}

</style>