<template>
  <uv-overlay
    :show="show"
    class="px-[60rpx] box-border flex flex-col items-center justify-center"
    :showClose="false"
  >
    <view class="w-full flex flex-col items-center relative mt-[160rpx]">
      <!-- 顶部图标 -->
      <view class="w-full absolute top-[-166rpx] left-0 flex justify-center z-50">
        <image
          class="w-full h-[206rpx]"
          src="/static/images/profile/product_icon.png"
          mode="widthFix"
        />
      </view>

      <!-- 产品内容区域 -->
      <wk-stroke-bg shadow
        class="p-[32rpx] w-full relative z-20 box-border"
        bgColor="#FFFFFF"
      >
        <scroll-view
          class="max-h-[80vh] text-left pb-[0rpx] rounded-b-[0rpx] pt-[16rpx]"
          :show-scrollbar="true"
          :scroll-y="true"
        >
          <!-- 根据产品类型显示不同内容 -->
          <ProductEquityInfo
            v-if="product.category_id == 32"
            :product="product"
          />
          <ProductInfo v-else :product="product" />

          <!-- 拼团产品按钮 -->
          <view
            v-if="product.category_id == 57"
            class="grid grid-cols-2 gap-x-[16rpx] mt-[24rpx]"
          >
            <wk-button
              @submit="$emit('submit', 'apply')"
               backgroundColor="transparent"
               :borderColor="$colors.theme"
              class="shadow-btn-bg rounded-[24rpx]"
            >
              <view class="flex flex-col items-center">
                <text class="text-lg text-neutral-theme">参与拼团</text>
              </view>
              <view class="text-[28rpx]"></view>
            </wk-button>
            <wk-button
              @submit="$emit('submit', 'create')"
              class="btn-item fbtn"
            >
              <view class="text-lg">发起拼团</view>
            </wk-button>
          </view>

          <!-- 普通产品按钮 -->
          <view v-else>
            <wk-button
              @submit="$emit('submit')"
              height="80rpx"
              class="mt-[24rpx]"
            >
              立即查看
            </wk-button>
          </view>
        </scroll-view>
      </wk-stroke-bg>

      <!-- 关闭按钮 -->
      <view @click="$emit('close')" class="mt-[30rpx]">
        <uv-icon name="close-circle-fill" size="66rpx" color="#D9D9D9" />
      </view>
    </view>
  </uv-overlay>
</template>

<script setup>
import ProductInfo from "@/pages/product/components/list/ProductInfo.vue";
import ProductEquityInfo from "@/pages/product/components/list/ProductEquityInfo.vue";

// 定义组件属性
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  product: {
    type: Object,
    default: () => ({}),
  },
});

// 定义组件事件
defineEmits(["close", "submit"]);
</script>

<style lang="scss" scoped>
.product-bg {
  position: relative;
  background: linear-gradient(128deg, #000 29.28%, #161e33 79.47%);
}
</style>
