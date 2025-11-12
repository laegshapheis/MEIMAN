<template>
  <view>
    <view class="flex-1 flex justify-center items-center flex-col gap-[24rpx]">
      <template v-for="field in fields" :key="field.name">
        <view v-if="!field.inputHidden" class="custom-box flex flex-row items-center justify-center w-full custom-border" :label="field.label" :required="field.required">
          <wk-input
            v-bind="field"
            v-model="formData[field.name]"
            :type="getInputType(field)"
            :placeholder="field.placeholder"
            @input="(value) => handleInput(value, field)"
            style="border: none;"
            bgColor="#FFFFFF"
          >
          <template v-slot:prefix>
            <view class="flex flex-row items-center justify-center">
              <image
                v-if="field.icon"
                class="w-[40rpx] h-[40rpx] mr-[10rpx]"
                :src="field.icon"
                mode="widthFix"
              />
              <wk-country-code-picker
                v-model="selectedCountry"
                v-if="field.inputType === 'tel'"
                ref="countryCodePicker"
                :flagIcon="field.icon"
                @change="handleCountryChange"
              />
            </view>
            
          </template>
        </wk-input>
        </view>
      </template>
      <slot name="formBottom" />
    </view>
    <wk-button class="mt-[40rpx]" size="large" @submit="handleSubmit">{{ submitButtonText }}</wk-button>
  </view>
</template>
<script setup>
import { reactive, nextTick, ref, computed } from 'vue';

// 接收 props
const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  submitButtonText: {
    type: String,
    default: 'Submit',
  },
});

const selectedCountry = ref({ name: '中国', code: '86' });
const countryCodePicker = ref(null);

// 选择国家区号
const handleCountryChange = (country) => {
  selectedCountry.value = country;
};

const getInputType = (field) => {
  if (field.type === 'password') {
    if(!field.showPassword) {
      return 'password'
    } else {
      return 'text'
    }
  }
  return field.type;
};

const emit = defineEmits(['submit']);
// 定义响应式数据
const formData = reactive({});

const handleInput = (value, item) => {
  if (item.regexp) {
    nextTick(() => {
      formData[item.name] = value.replace(item.regexp, '');
    });
  } else {
    formData[item.name] = value;
  }
};

const handleSubmit = () => {
  // 如果是电话号码，添加国家区号
  for (const field of props.fields) {
    if (field.inputType === 'tel') {
      // 存储完整的电话号码（带国家区号）
      formData['code'] = selectedCountry.value.code;
    }
  }
  emit('submit', formData);
};
</script>