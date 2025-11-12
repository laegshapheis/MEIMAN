<template>
  <view
    class="w-full px-[32rpx] box-border my-[24rpx] overflow-hidden aspect-video rounded-[32rpx]"
  >
    <z-swiper
      ref="mySwiper"
      :modules="modules"
      autoplay
      @slideChange="onChange"
    >
      <z-swiper-item
        v-for="(item) in bannerList"
        :key="item.id"
        class="aspect-video overflow-hidden rounded-[24rpx]"
        :custom-style="{ width: '100%', height: '100%' }"
      >
        <view class="flex justify-center items-center">
          <image class="w-full aspect-video" :src="item.thumb_url" mode="aspectFit">
          </image>
        </view>
      </z-swiper-item>
    </z-swiper>
  </view>
  <view
    v-if="bannerList.length > 1"
      class="pagination-dots flex justify-center items-center mt-[20rpx] mb-[30rpx]"
    >
      <view
        v-for="(item, index) in bannerList"
        :key="index"
        :class="['pagination-dot', activeIndex === index ? 'active' : '']"
        @click="mySwiper.swiper.slideTo(index)"
      ></view>
    </view>
</template>

<script setup>
import { defineProps, ref, computed } from "vue";
import { Autoplay } from "@/uni_modules/zebra-swiper/modules";

const modules = ref([Autoplay]);
const mySwiper = ref(null);

const props = defineProps({
  bannerList: {
    type: Array,
    default: () => [],
  },
});

const list = computed(() => {
  return props.bannerList.map((item) => {
    return {
      image: item,
    };
  });
});

const onChange = (swiper) => {
  activeIndex.value = swiper.activeIndex;
};

const activeIndex = ref(0);
</script>

<style scoped lang="scss">
.aspect-video {
  aspect-ratio: 16 / 9;
}

.pagination-dots {
  display: flex;
  gap: 12rpx;
}

.pagination-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 100%;
  background-color: rgba(255, 255, 255, 0.15);
  transition: all 0.3s;
}

.pagination-dot.active {
  width: 12rpx;
  background-color: theme('colors.neutral.theme');
  border-radius: 100%;
}
</style>
