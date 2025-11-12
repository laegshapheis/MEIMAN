<template>
  <view 
    class="draggable-floating-button"
    :style="buttonStyle"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @click="handleClick"
  >
    <image 
      :src="imageSrc" 
      class="floating-image"
      mode="aspectFit"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  imageSrc: {
    type: String,
    default: '/static/images/profile/jika_icon.png'
  },
  bottom: {
    type: Number,
    default: 86
  },
  right: {
    type: Number,
    default: 16
  },
  width: {
    type: Number,
    default: 80
  },
  height: {
    type: Number,
    default: 80
  }
})

const emit = defineEmits(['click'])

// 拖拽状态
const isDragging = ref(false)
const hasMoved = ref(false) // 是否发生了移动
const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const initialX = ref(0)
const initialY = ref(0)

// 屏幕尺寸
const screenWidth = ref(0)
const screenHeight = ref(0)

// 计算按钮样式
const buttonStyle = computed(() => {
  return {
    position: 'fixed',
    bottom: `${currentY.value}px`,
    left: `${currentX.value}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    zIndex: 999,
    cursor: isDragging.value ? 'grabbing' : 'grab',
    transition: isDragging.value ? 'none' : 'all 0.3s ease'
  }
})

// 初始化位置
const initPosition = () => {
  currentX.value = screenWidth.value - props.width - props.right
  currentY.value = props.bottom
  initialX.value = currentX.value
  initialY.value = currentY.value
}

// 获取屏幕尺寸
const getScreenSize = () => {
  const systemInfo = uni.getSystemInfoSync()
  screenWidth.value = systemInfo.windowWidth
  screenHeight.value = systemInfo.windowHeight
}

// 处理触摸开始
const handleTouchStart = (e) => {
  isDragging.value = true
  hasMoved.value = false
  const touch = e.touches[0]
  startX.value = touch.clientX
  startY.value = touch.clientY
  initialX.value = currentX.value
  initialY.value = currentY.value
}

// 处理触摸移动
const handleTouchMove = (e) => {
  if (!isDragging.value) return
  
  const touch = e.touches[0]
  const deltaX = touch.clientX - startX.value
  const deltaY = touch.clientY - startY.value
  
  // 计算移动距离
  const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  
  // 如果移动距离超过阈值，认为是拖拽操作
  if (moveDistance > 10) {
    hasMoved.value = true
    e.preventDefault()
  }
  
  let newX = initialX.value + deltaX
  let newY = initialY.value - deltaY // Y轴需要反向，因为bottom是距离底部的距离
  
  // 限制在屏幕范围内
  newX = Math.max(0, Math.min(newX, screenWidth.value - props.width))
  newY = Math.max(0, Math.min(newY, screenHeight.value - props.height))
  
  currentX.value = newX
  currentY.value = newY
}

// 处理触摸结束
const handleTouchEnd = (e) => {
  if (!isDragging.value) return
  
  isDragging.value = false
  
  // 如果发生了移动，则进行吸附
  if (hasMoved.value) {
    // 自动吸附到两边
    const centerX = screenWidth.value / 2
    const targetX = currentX.value < centerX ? 0 : screenWidth.value - props.width
    
    // 使用动画过渡到目标位置
    currentX.value = targetX
  }
  
  // 重置移动状态
  hasMoved.value = false
}

// 处理点击事件
const handleClick = (e) => {
  // 如果发生了移动，不触发点击事件
  if (hasMoved.value) return
  
  emit('click', e)
}

// 窗口大小变化处理函数
const handleWindowResize = () => {
  getScreenSize()
  initPosition()
}

// 组件挂载时初始化
onMounted(() => {
  getScreenSize()
  initPosition()
  
  // 监听屏幕旋转
  uni.onWindowResize(handleWindowResize)
})

// 组件卸载时清理
onUnmounted(() => {
  uni.offWindowResize(handleWindowResize)
})
</script>

<style lang="scss" scoped>
.draggable-floating-button {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  touch-action: none;
  &:active {
    transform: scale(0.95);
  }
}

.floating-image {
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
