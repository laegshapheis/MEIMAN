<template>
  <view class="relative">
    <view @click="openPicker" class="relative z-30">
      <slot />
    </view>
    <uv-datetime-picker
      v-if="isDatetimePicker"
      class="relative z-40"
      ref="datetimePicker"
      v-bind="attrs"
      :mode="mode"
      :activeColor="$colors.theme"
      :color="$colors.modalTextColor"
      :confirmColor="$colors.theme"
      :cancelColor="$colors.secondary"
      v-model="dateTimeValue"
      :formatter="formatter"
      @confirm="confirmDateTime"
    ></uv-datetime-picker>
    <uv-picker
      v-else
      class="relative z-40"
      ref="picker"
      v-bind="attrs"
      :defaultIndex="defaultIndex"
      :columns="[range]"
      @confirm="confirm"
      @change="handleChange"
      :keyName="rangeKey"
      :activeColor="$colors.theme"
      :color="$colors.modalTextColor"
      :confirmColor="$colors.theme"
      :cancelColor="$colors.secondary"
    ></uv-picker>
  </view>
</template>

<script setup>
import { defineProps, defineEmits, useAttrs, ref, computed } from 'vue';
import { timeFormat } from '@/uni_modules/uv-ui-tools/libs/function/index.js';

const attrs = useAttrs();
const picker = ref(null);
const props = defineProps({
  range: {
    type: Array,
    default: () => []
  },
  rangeKey: {
    type: String,
    default: 'title'
  },
  value: {
    type: Number,
    default: 0
  },
  mode: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['change', 'onClick']);
const defaultIndex = ref([props.value]);
const modeArr = ['date', 'time', 'datetime', 'year-month', 'year'];
const isDatetimePicker = computed(() => modeArr.includes(props.mode));
const datetimePicker = ref(null);
const dateTimeValue = ref(props.value);
const confirm = (e) => {
  emit('change', {
    detail: {
      value: e.indexs[0]
    }
  }, e);
};

const confirmDateTime = (e) => {
  console.log("e", e)
  emit('change', {
    detail: {
      value: timeFormat(e.value, 'yyyy-mm-dd')
    }
  }, e);
};

const openPicker = () => {
  emit('onClick');
  if (props.disabled) return;
  if (isDatetimePicker.value) {
    datetimePicker.value.open();
  } else {
    picker.value.open();
  }
};
const setIndexs = (indexs) => {
  picker.value.setIndexs(indexs);
}
const closePicker = () => {
  if (isDatetimePicker.value) {
    datetimePicker.value.close();
  } else {
    picker.value.close();
  }
};
function formatter(type, value) {
  if (type === 'year') {
    return `${value}年`
  }
  if (type === 'month') {
    return `${value}月`
  }
  if (type === 'day') {
    return `${value}日`
  }
  return value
}

defineExpose({
  setIndexs
})
</script>

<style scoped lang="scss">
::v-deep {
  .uv-popup__content {
    background: theme('colors.neutral.modalBg') !important;
  }
  .uv-popup__content .uni-picker-view-mask {
    background-image: none !important;
  }
  .uv-toolbar__title {
    color: theme('colors.neutral.DEFAULT') !important;
  }
}
</style>