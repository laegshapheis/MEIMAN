export default {
	props: {
		// 滑块的移动过渡时间，单位ms
		duration: {
			type: Number,
			default: 300
		},
		// tabs标签数组
		list: {
			type: Array,
			default: () => []
		},
		// 滑块颜色
		lineColor: {
			type: String,
			default: '#3c9cff'
		},
		// 菜单选择中时的样式
		activeStyle: {
			type: [String, Object],
			default: () => ({
				color: '#303133'
			})
		},
		// 菜单非选中时的样式
		inactiveStyle: {
			type: [String, Object],
			default: () => ({
				color: '#606266'
			})
		},
		// 滑块长度
		lineWidth: {
			type: [String, Number],
			default: 20
		},
		// 滑块高度
		lineHeight: {
			type: [String, Number],
			default: 1
		},
		// 滑块背景显示大小，当滑块背景设置为图片时使用
		lineBgSize: {
			type: String,
			default: 'cover'
		},
		// 菜单item的样式
		itemStyle: {
			type: [String, Object],
			default: () => ({
				height: '44px'
			})
		},
		// 菜单是否可滚动
		scrollable: {
			type: Boolean,
			default: true
		},
		// 当前选中标签的索引
		current: {
			type: [Number, String],
			default: 0
		},
		// 默认读取的键名
		keyName: {
			type: String,
			default: 'name'
		},
		// 滑块是否铺满容器宽度，true为铺满，false为居中（默认兼容原来的居中模式）
		lineFullWidth: {
			type: Boolean,
			default: false
		},
		// 是否显示底部边框
		showBottomBorder: {
			type: Boolean,
			default: false
		},
		// 底部边框颜色
		bottomBorderColor: {
			type: String,
			default: '#e6e6e6'
		},
		...uni.$uv?.props?.tabs
	}
}