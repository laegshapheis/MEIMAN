<template>
 <uv-popup
    mode="bottom"
    ref="actionSheetRef"
    :closeOnClickOverlay="false"
    v-bind="attrs"
  >
  <view class="bg-neutral-modalBg"> 
    <view class="py-[20rpx] flex justify-between items-center px-[32rpx] relative">
      <view class="text-[28rpx] font-bold text-center w-full text-neutral">{{ title }}</view>
      <text class="absolute right-[32rpx] text-neutral-regular text-base" @click="close">取消</text>
    </view>
    <scroll-view class="max-h-[40vh]" scroll-y>
    <view class="bg-neutral-modalBg">
      <template v-for="item in options" :key="item.id">
        <view class="h-[1rpx] bg-neutral-divider"></view>
        <view  @click="() => handleSelect(item)" class="flex justify-between items-center px-[32rpx] py-[20rpx]">
          <view class="flex flex-col justify-center items-start">
            <text class="text-base w-full text-neutral">{{ item.text }}</text>
            <text v-if="item.exptime" class="text-sm w-full text-neutral-regular mt-[5rpx]">到期时间：{{ item.exptime }}</text>
          </view>
          <uv-icon name="arrow-right" color="#fff" size="24rpx"></uv-icon>
        </view>
      </template>
    </view>
    </scroll-view>
  </view>
  </uv-popup> 

</template>


<script setup>
  import { ref, defineProps, defineEmits, useAttrs, watch } from 'vue'; 
  const props = defineProps({
    title: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    }
  });
  const actionSheetRef = ref(null);

  const attrs = useAttrs();
  const emit = defineEmits(['select', 'close']);

  const handleSelect = (item) => {
    emit('select', item);
  }

  const open = () => {
    if (actionSheetRef.value) {
      actionSheetRef.value.open();
    }
  }
  const close = () => {
    if (actionSheetRef.value) {
      actionSheetRef.value.close();
    }
  }
  defineExpose({
    open,
    close
  });

</script>

<style scoped>
::v-deep .uv-cell__title-text {
  color: rgba(255, 255, 255, 0.8) !important;
}
</style>
