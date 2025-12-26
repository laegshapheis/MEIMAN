<template>
  <uv-keyboard
    ref="keyboard"
    :tooltip="false"
    mode="number"
    backgroundColor="rgba(32,32,32,.92)"
    class="keyboard-wrap"
    :closeOnClickOverlay="false"
    @change="handleKeyInput"
    @backspace="handleBackspace"
  >
    <view class="h-full flex flex-col items-center bg-[#0C052F]">
      <slot name="title"></slot>
      <view
        class="flex flex-row justify-between items-center w-full px-[35rpx] pt-[35rpx] mb-[10rpx] box-border">
        <text class="text-lg text-neutral-regular" @click="handleCancel">取消</text>
        <text class="text-lg text-neutral">{{ title }}</text>
        <text class="text-lg text-neutral-theme" @click="handleFinish">确定</text>
      </view>
      <view name="content" class="content-slot">
        <slot name="content"></slot>
      </view>

      <!-- 使用Tailwind CSS重构验证码输入框 -->
      <view class="flex flex-row justify-between items-center py-[32rpx] gap-[12rpx]">
        <view
          v-for="(item, index) in maxlength"
          :key="index"
          class="border border-solid border-black/10 flex justify-center items-center relative bg-white/10 rounded-[24rpx]"
          :style="{
            width: size,
            height: size,
            backgroundImage: 'url(/static/images/component/code-input/code_bg.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }"
        >
          <text
            v-if="modelValue[index]"
            class="text-5xl font-bold"
            :style="{ color: color }"
          >
            {{ dot ? "•" : modelValue[index] }}
          </text>
          <view
            v-if="index === modelValue.length"
            class="absolute w-[2px] h-2/5 bg-white/10"
            :class="[{ 'animate-blink': true }]"
          ></view>
        </view>
      </view>
    </view>
  </uv-keyboard>
</template>

<script setup>
import {
  useAttrs,
  defineEmits,
  defineProps,
  ref,
  watch,
  defineExpose,
} from "vue";

const props = defineProps({
  value: {
    type: [String, Number],
    default: "",
  },
  adjustPosition: {
    type: Boolean,
    default: true,
  },
  height: {
    type: String,
    default: "48vh",
  },
  title: {
    type: String,
    default: "请输入支付密码",
  },
  borderColor: {
    type: String,
    default: "#555",
  },
  dot: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: '$colors.DEFAULT',
  },
  size: {
    type: [String, Number],
    default: "102rpx",
  },
  maxlength: {
    type: [String, Number],
    default: 6,
  },
});

const focus = ref(true);
const modelValue = ref("");
const keyboard = ref(null);
const emit = defineEmits(["update:value", "change", "finish", "cancel"]);
const attrs = useAttrs();

// 处理键盘输入
const handleKeyInput = (key) => {
  if (modelValue.value.length < Number(props.maxlength)) {
    modelValue.value += key;
  }
};

// 处理键盘退格键
const handleBackspace = () => {
  if (modelValue.value.length > 0) {
    modelValue.value = modelValue.value.slice(0, -1);
  }
};

const handleFinish = () => {
  emit("finish", modelValue.value);
};

const handleCancel = () => {
  close();
  emit("cancel");
};

const open = () => {
  keyboard.value.open();
  focus.value = true;
  modelValue.value = "";
};

const close = () => {
  keyboard.value.close();
  focus.value = false;
};

defineExpose({
  open,
  close,
});
</script>

<style scoped>
@keyframes blink {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.animate-blink {
  animation: blink 1s infinite;
}

:deep(.uv-keyboard__button-wrapper__button) {
  color: #fff;
  border-radius: 10rpx;
  background: #FFFFFF;
  box-shadow: 0px 2rpx 0px 0px #0000001A;
}

:deep(.uv-keyboard__button-wrapper__button__text) {
  color: #010101;
}

:deep(.uv-keyboard__button-wrapper) {
  color: #fff;
  box-shadow: 0 4rpx 0px #0000001A;
  border-radius: 10rpx; /* 按钮外层容器圆角 */
}

</style>
