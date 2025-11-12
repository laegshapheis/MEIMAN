<template>
  <layout
    navTitle="会员卡购买"
    bgType="bg-main1"
    ref="layoutRef"
    :refresher="true"
    mode="black"
    @onRefresh="handleRefresh"
  >
    <template #navRight>
      <view @click="handlePurchaseRecord" class="flex flex-row items-center">
        <text class="text-base ml-[5rpx] text-neutral-theme">购卡记录</text>
      </view>
    </template>
    <view class="px-[32rpx] my-[24rpx] flex flex-row items-center">
      <image src="/static/images/user/logo.svg" class="w-[80rpx] h-[80rpx]" mode="widthFix"></image>
      <view class="flex flex-col ml-[16rpx]">
        <text v-if="cardsInfo.cards > 0" class="text-lg font-semibold">已开通{{ cardsInfo.name }}</text>
        <text v-else class="text-lg font-semibold">未开通</text>
        <text v-if="cardsInfo.endtime" class="text-sm text-neutral-regular">有效期至{{cardsInfo.endtime}}</text>
      </view>
    </view>
    <z-swiper
      ref="mySwiper"
      class="h-full w-full"
      v-model="vipCards"
      @slideChange="onChange"
      :options="{
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 16,
        grabCursor: true,
      }"
    >
      <z-swiper-item
        v-for="(item, index) in vipCards"
        :key="index"
        :custom-style="{
          width: '608rpx',
          height: '296rpx',
        }"
      >
        <view
          :style="`color: ${cards[index].color}`"
          class="w-[608rpx] h-[296rpx] flex flex-row justify-center items-center"
        >
          <image
            :src="cards[index].image"
            class="absolute top-0 left-0 flex-shrink-0 w-[608rpx] h-[296rpx]"
          />
          <text class="absolute top-[4rpx] left-[34rpx] text-sm font-bold">{{
            item.name
          }}</text>
          <view
            class="absolute top-[88rpx] w-[260rpx] left-[48rpx] flex flex-col"
          >
            <text class="text-lg font-bold">有效期{{ item.duration }}天</text>
            <text class="text-base mt-[12rpx]"
              >每天可以签到{{ item.sign_times }}次，签到金额{{
                item.sign_amount
              }}
              {{ symbolStore.code }}</text
            >
          </view>
        </view>
      </z-swiper-item>
    </z-swiper>

    <!-- 原点分页器 -->
    <view
      class="pagination-dots flex justify-center items-center mt-[20rpx] mb-[30rpx]"
    >
      <view
        v-for="(item, index) in vipCards"
        :key="index"
        :class="['pagination-dot', activeIndex === index ? 'active' : '']"
        @click="mySwiper.swiper.slideTo(index)"
      ></view>
    </view>
    <view v-if="currentCard" class="px-[32rpx] pt-[16rpx] pb-[150rpx]">
      <view
        :style="`border: 1rpx solid #F3F1F9`"
        class="px-[32rpx] py-[16rpx] rounded-[16rpx] flex flex-col"
      >
        <view class="flex flex-row items-center">
          <image
            :src="cards[activeIndex].icon"
            class="w-[48rpx] h-[48rpx]"
            mode="widthFix"
          />
          <text class="text-lg font-semibold ml-[5rpx]"
            >{{ currentCard?.name }}获取的唯一条件</text
          >
        </view>
        <text class="text-base mt-[24rpx] text-neutral-regular"
          >充值后直接购买，价格 {{ currentCard?.price }}
          {{ symbolStore.code }} (不能抵扣购物款项)</text
        >
      </view>
      <view
        :style="`border: 1rpx solid #F3F1F9`"
        class="mt-[24rpx] px-[32rpx] py-[16rpx] rounded-[16rpx] flex flex-col"
      >
        <view class="flex flex-row items-center">
          <image
            :src="cards[activeIndex].icon"
            class="w-[48rpx] h-[48rpx]"
            mode="widthFix"
          />
          <text class="text-lg font-semibold ml-[5rpx]"
            >{{ currentCard?.name }}权益</text
          >
        </view>
        <text class="text-base mt-[24rpx] text-neutral-regular"
          >每天可以签到 {{ currentCard?.sign_times }} 次，签到金额
          {{ currentCard?.sign_amount }} {{ symbolStore.code }}</text
        >
      </view>
      <view
        :style="`border: 1rpx solid #F3F1F9`"
        class="mt-[24rpx] px-[32rpx] py-[16rpx] rounded-[16rpx] flex flex-col"
      >
        <view class="flex flex-row items-center">
          <image
            :src="cards[activeIndex].icon"
            class="w-[48rpx] h-[48rpx]"
            mode="widthFix"
          />
          <text class="text-lg font-semibold ml-[5rpx]"
            >{{ currentCard?.name }}有效期</text
          >
        </view>
        <text class="text-base mt-[24rpx] text-neutral-regular"
          >有效期 {{ currentCard?.duration }} 天</text
        >
      </view>
      <view
        :style="`border: 1rpx solid #F3F1F9`"
        class="mt-[24rpx] px-[32rpx] py-[16rpx] rounded-[16rpx] flex flex-col"
      >
        <view class="flex flex-row items-center">
          <image
            :src="cards[activeIndex].icon"
            class="w-[48rpx] h-[48rpx]"
            mode="widthFix"
          />
          <text class="text-lg font-semibold ml-[5rpx]">注意事项</text>
        </view>
        <text class="text-base mt-[24rpx] text-neutral-regular">
          {{ notice }}
        </text>
      </view>
    </view>
    <view
      class="fixed left-0 right-0 bottom-0 bg-[#f7f7f7] px-[32rpx] py-[16rpx]"
    >
      <wk-button
        :disabled="member_cardsid >= currentCard?.id"
        class="w-full"
        @submit="handlePurchase"
      >
        <text v-if="member_cardsid == currentCard?.id">到期后才能重新购买</text>
        <text v-else>
          {{ currentCard?.price }} {{ symbolStore.code }} 立即支付
        </text>
      </wk-button>
    </view>
    <wk-code-input
      ref="codeInputRef"
      :value="password"
      @finish="confirmPurchase"
    >
      <template #content>
        <text class="text-lg font-semibold text-black/70">支付金额 {{ currentCard?.price }} {{ symbolStore.code }}</text>
      </template>
    </wk-code-input>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getVipCardList, purchaseVipCard } from "@/api/user";
import { getCardsApi } from "@/api/store";

import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";
import { cacheManager } from "@/utils/cacheManager";
import { vipIcons } from "./data";
import { showToast } from "@/utils/toast";

const symbolStore = useSymbolStore();
const layoutRef = ref(null);
const mySwiper = ref(null);
const loading = ref(false);
const loadingText = ref("");
const activeIndex = ref(0);
const member_cardsid = ref("");
const codeInputRef = ref(null);
const password = ref("");
const id = ref(0);
const cardsInfo = ref({});
const notice = ref("");

const cards = ref({
  0: {
    image: "/static/images/vip/card01.png",
    icon: "/static/images/vip/vip_icon01.png",
    color: "#4D586E",
  },
  1: {
    image: "/static/images/vip/card02.png",
    icon: "/static/images/vip/vip_icon02.png",
    color: "#601911",
  },
  2: {
    image: "/static/images/vip/card03.png",
    icon: "/static/images/vip/vip_icon03.png",
    color: "#193D77",
  },
});

// 会员卡数据
const vipCards = ref([]);
const currentCard = computed(() => vipCards.value[activeIndex.value] || null);

// 轮播切换处理
const onChange = (swiper) => {
  activeIndex.value = swiper.activeIndex;
};

const handlePurchaseRecord = () => {
  uni.navigateTo({
    url: routes.vipCardPurchaseRecord,
  });
};

// 购买
const handlePurchase = () => {
  codeInputRef.value.open();
};

// 刷新处理
const handleRefresh = async () => {
  await getCardData();
  layoutRef.value.complete();
};

const handleCache = (res) => {
  console.log(res, "res");
    vipCards.value = res.data;
    member_cardsid.value = res.member_cardsid;
    notice.value = res.notice;
    const index = vipCards.value.findIndex(item => item.id == member_cardsid.value);
    setTimeout(() => {
      mySwiper.value && mySwiper.value.swiper.slideTo(index);
    }, 100);
};

const getVipCardInfo = async () => {
  const res = await getCardsApi({
  });
  if (res.status != 0) {
    showToast(res.msg || "获取会员卡信息失败");
    return;
  }
  cacheManager.setCache("cardsVipInfo", res);
  cardsInfo.value = res;
};

// 获取会员卡数据
const getCardData = async () => {
  loading.value = true;
  loadingText.value = "加载中...";

  try {
    const res = await getVipCardList();
    cacheManager.setCache("vipCards", res);
    handleCache(res);
    loading.value = false;
  } catch (error) {
    console.error("获取会员卡数据失败", error);
    loading.value = false;
  }
};

// 确认购买
const confirmPurchase = async (val) => {
  if (val.length < 6) {
    showToast("请输入正确的支付密码");
    return;
  }
  if (loading.value) return;
  password.value = val;
  loading.value = true;
  loadingText.value = "购买中...";

  try {
    const res = await purchaseVipCard({
      id: currentCard.value.id,
    });
    console.log(res, "res");
    if (res.status === 0) {
      getCardData();
      getVipCardInfo();
      showToast("购买成功");
      // 刷新数据
    } else {
      showToast(res.msg || "购买失败");
    }
    password.value = "";
    codeInputRef.value.close();
  } catch (error) {
    console.error("购买失败", error);
    showToast("购买失败，请稍后再试");
  } finally {
    loading.value = false;
  }
};

onLoad(() => {
  const vipCards = cacheManager.getCache("vipCards");
  const cardsVipInfo = cacheManager.getCache("cardsVipInfo");
  if (cardsVipInfo) {
    cardsInfo.value = cardsVipInfo;
  }
  if (vipCards) {
    handleCache(vipCards);
  }
    getCardData();
    getVipCardInfo();
});
</script>

<style lang="scss" scoped>
.vip-bg {
  border-radius: 20px;
  border: 0.5px solid rgba(224, 194, 160, 0.4);
  background: rgba(255, 255, 255, 0.1);
}

.vip-card-container {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 80rpx;
    height: 80rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0 0 0 80rpx;
  }
}

.text-bg {
  color: rgba(255, 255, 255, 0.8);
}

.pagination-dots {
  display: flex;
  gap: 12rpx;
}

.pagination-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background-color: #d9d9d9;
  transition: all 0.3s;
}

.pagination-dot.active {
  width: 16rpx;
  background-color: #000000;
  border-radius: 8rpx;
}
</style>
