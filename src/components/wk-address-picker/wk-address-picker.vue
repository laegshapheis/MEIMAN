<template>
<view>
		<uv-picker ref="pickerRef" :closeOnClickOverlay="false" :cancelColor="$colors.secondary" :confirmColor="$colors.theme" class="address-content" title="选择所在地区" :color="$colors.DEFAULT" :activeColor="$colors.theme" :columns="addressList" :loading="loading" keyName="name" @change="change" @confirm="confirm">
		</uv-picker>
	</view>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import addressData from '@/static/data/regions.json';

const emit = defineEmits(['confirm']);
const loading = ref(true);
const provinces = ref([]); // 省
const citys = ref([]); // 市
const areas = ref([]); // 区
const pickerValue = ref([]);
const defaultValue = ref([110000, 110100, 110101]);
const pickerRef = ref(null);

const addressList = computed(() => {
  return [provinces.value, citys.value, areas.value];
});

const getData = () => {
  const data = addressData || [];
  provinces.value = data.sort((left, right) => (Number(left.code) > Number(right.code) ? 1 : -1));
  handlePickValueDefault();
  setTimeout(() => {
    loading.value = false;
  }, 200);
};

const handlePickValueDefault = () => {
  // 设置省
  pickerValue.value[0] = provinces.value.findIndex(item => Number(item.id) === defaultValue.value[0]);
  // 设置市
  citys.value = provinces.value[pickerValue.value[0]]?.children || [];
  pickerValue.value[1] = citys.value.findIndex(item => Number(item.id) === defaultValue.value[1]);
  // 设置区
  areas.value = citys.value[pickerValue.value[1]]?.children || [];
  pickerValue.value[2] = areas.value.findIndex(item => Number(item.id) === defaultValue.value[2]);
  // 重置下位置
  if (pickerRef.value) {
    pickerRef.value.setIndexs([pickerValue.value[0], pickerValue.value[1], pickerValue.value[2]], true);
  }
};

const change = (e) => {
  if (loading.value) return;
  const { columnIndex, index, indexs } = e;
  // 改变了省
  if (columnIndex === 0) {
    citys.value = provinces.value[index]?.children || [];
    areas.value = citys.value[0]?.children || [];
    if (pickerRef.value) {
      pickerRef.value.setIndexs([index, 0, 0], true);
    }
  } else if (columnIndex === 1) {
    areas.value = citys.value[index]?.children || [];
    if (pickerRef.value) {
      pickerRef.value.setIndexs(indexs, true);
    }
  }
};

const open = () => {
  if (pickerRef.value) {
    pickerRef.value.open();
    handlePickValueDefault();
  }
};

const confirm = (e) => {
  emit('confirm', e.value);
};

onMounted(() => {
  getData();
});
defineExpose({
  open
});
</script>

<style scoped lang="scss">
::v-deep {
  .uv-popup__content {
    background-color: #fff !important;
    color: #252C2F;
  }
  .uni-picker-view-mask {
    background-image: none !important;
  }
  .uv-toolbar__title {
    color: #252C2F !important;
    font-size: 34rpx !important;

  }
  .uni-picker-view-indicator:before {
    border-top: 2rpx solid #fff !important;
  }
  .uni-picker-view-indicator:after, .uv-toolbar {
    border-bottom: 2rpx solid #fff !important;
  }
}
.address-content {
  background: #fff !important;
}
</style>