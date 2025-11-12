<template>
    <uv-loading-page loadingMode="semicircle" bgColor="transparent" :loading="true" :loadingColor="$colors.theme" :color="$colors.theme" :loading-text="loadingText" font-size="28rpx" iconSize="32"></uv-loading-page>
</template>

<script setup>

defineProps({
    loadingText: {
        type: String,
        default: '加载中...'
    }
})

</script>