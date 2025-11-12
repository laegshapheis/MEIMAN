# uv-tabs 组件使用示例

## 新增功能

### 1. 滑块铺满模式
设置 `lineFullWidth` 为 `true` 可以让滑块铺满整个激活容器的宽度：

```vue
<template>
  <!-- 滑块铺满模式 -->
  <uv-tabs 
    :list="list" 
    :current="current" 
    :lineFullWidth="true"
    @change="change"
  />
  
  <!-- 传统居中模式（默认） -->
  <uv-tabs 
    :list="list" 
    :current="current" 
    :lineFullWidth="false"
    @change="change"
  />
</template>
```

### 2. 底部边框控制
可以控制底部边框的显示和颜色：

```vue
<template>
  <!-- 自定义底部边框颜色 -->
  <uv-tabs 
    :list="list" 
    :current="current" 
    bottomBorderColor="#ddd"
    @change="change"
  />
  
  <!-- 隐藏底部边框 -->
  <uv-tabs 
    :list="list" 
    :current="current" 
    :showBottomBorder="false"
    @change="change"
  />
  
  <!-- 自定义边框颜色和高度 -->
  <uv-tabs 
    :list="list" 
    :current="current" 
    bottomBorderColor="#f0f0f0"
    lineHeight="2"
    @change="change"
  />
</template>
```

### 3. 组合使用
```vue
<template>
  <!-- 滑块铺满 + 自定义底部边框 -->
  <uv-tabs 
    :list="list" 
    :current="current" 
    :lineFullWidth="true"
    bottomBorderColor="#f5f5f5"
    lineColor="#007aff"
    lineHeight="3"
    @change="change"
  />
  
  <!-- 居中滑块 + 无底部边框 -->
  <uv-tabs 
    :list="list" 
    :current="current" 
    :lineFullWidth="false"
    :showBottomBorder="false"
    lineColor="#ff3b30"
    lineWidth="30"
    lineHeight="2"
    @change="change"
  />
</template>

<script>
export default {
  data() {
    return {
      current: 0,
      list: [
        { name: '首页' },
        { name: '推荐' },
        { name: '关注' },
        { name: '视频' },
        { name: '音频' }
      ]
    }
  },
  methods: {
    change(e) {
      this.current = e.index
    }
  }
}
</script>
```

## 属性说明

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| lineFullWidth | Boolean | false | 滑块是否铺满容器宽度，true为铺满，false为居中 |
| showBottomBorder | Boolean | true | 是否显示底部边框 |
| bottomBorderColor | String | '#e6e6e6' | 底部边框颜色 |

## 视觉效果说明

- **底部边框**：整个容器底部会有一条边框，高度与滑块高度一致（`lineHeight`）
- **滑块重叠**：激活的滑块会覆盖在底部边框上方，形成重叠效果
- **层级关系**：滑块具有更高的 z-index，确保显示在边框上方

## 兼容性

- ✅ 完全兼容原有API和用法
- ✅ 默认行为保持不变
- ✅ 支持APP-NVUE和非NVUE平台
- ✅ 支持所有原有的样式和配置 