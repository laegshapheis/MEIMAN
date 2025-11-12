<template>
	<view :class="['fixed inset-0', bgColor]">
	</view>
</template>

<script setup>
import { defineProps, computed } from 'vue';
const props = defineProps({
	type: {
		type: String,
		default: 'bg-neutral-grey'
	},
})

const bgColor = computed(() => props.type);

</script>