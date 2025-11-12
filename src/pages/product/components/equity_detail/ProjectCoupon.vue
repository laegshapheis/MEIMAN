<template>
  <wk-stroke-bg class="mt-[24rpx]">
    <view
        class="flex flex-row items-center justify-between"
      >
        <view class="flex flex-row items-center">
          <image
            class="w-[48rpx] h-[48rpx]"
            src="/static/images/product/coupon.svg"
            mode="widthFix"
          ></image>
          <view class="text-neutral text-lg ml-[16rpx] font-bold">代金券</view>
        </view>
        <view class="flex flex-row items-center" @click="handleSelectMake">
          <view class="flex flex-row items-center" v-if="!make.value">
            <view class="text-neutral-theme text-base mr-[10rpx]"
              >请选择代金券</view
            >
            <uv-icon size="14" :color="$colors.theme" name="arrow-right" />
          </view>
          <view class="flex flex-row items-center" v-else>
            <text class="text-neutral-theme text-xl font-bold">{{ make.text }}</text>
          </view>
        </view>
      </view>
      <wk-action-sheet
        title="请选择代金券"
        ref="makeRef"
        :options="makelist"
        @select="onSelectMake"
      />
  </wk-stroke-bg>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['update:coupon'])

const makeRef = ref(null)
const make = ref({})

const makelist = computed(() => {
  const list = props.data.makelist || [];
  const arr = list.map((item) => {
    return {
      text: item.name,
      value: item.id,
      money: item.money,
      exptime: item.exptime,
    };
  });
  return [{ text: "不使用代金券", value: 0, money: 0 }, ...arr];
});
const handleSelectMake = () => {
  makeRef.value.open()
}
const onSelectMake = (item) => {
  make.value = item
  makeRef.value.close()
  emit('update:coupon', item)
}
</script> 