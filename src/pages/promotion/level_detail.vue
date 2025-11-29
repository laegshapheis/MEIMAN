<template>
  <layout
    ref="layoutRef"
    navTitle="推广等级"
    :bgType="dynamicBgType"
    :refresher="true"
    mode="white"
    @onRefresh="handleRefresh"
  >
  <!-- <image src="/static/images/tuiguangIcon/bg.png" class="w-full h-[240rpx] absolute top-[-140rpx] left-0" mode="widthFix"/> -->
    <view class="px-[32rpx] pt-[48rpx]">
      <!-- 当前等级徽章 -->
      <view class="flex flex-col items-center mb-[-48rpx]">
          <image 
            :src="currentLevelInfo.iconUrl" 
            class="w-[250rpx] h-[250rpx] mb-[8rpx]"
            mode="aspectFit"
          />
      </view>

      <!-- 等级进度条 -->
      <view class="relative mb-[48rpx]">
        <!-- 进度条图片 -->
        <image 
          :src="currentProgressImage" 
          class="w-full h-[240rpx]"
          mode="aspectFit"
        />
      </view>

      <!-- 升级条件卡片 -->
      <view class="bg-tuiguang-card rounded-[24rpx] p-[32rpx] mb-[48rpx] border-[#D5D5D8] border-[length:2rpx] border-solid">
        <view class="flex items-center justify-center">
          <text class="text-[#FFDBC2] text-[24rpx] mr-[16rpx]">★</text>
          <text class="text-[#FFDBC2] text-[36rpx] font-semibold">升级条件</text>
          <text class="text-[#FFDBC2] text-[24rpx] ml-[16rpx]">★</text>
        </view>

        <view class="mb-[24rpx]">
          <img src="/static/images/tuiguangIcon/line_tuiguang.svg" alt="" class="w-[100%] h-[2px]">
        </view>
        
        <view class="space-y-[12rpx]">
          <view v-for="(condition, index) in currentLevelInfo.conditions" :key="index" class="flex items-center justify-between mb-[10rpx]">
            <text class="text-[#FFDBC2] text-base"><text class="text-[#FFDBC2] text-[24rpx] mr-[12rpx]">•</text>{{ condition.condition }}</text>
            <view class="px-[16rpx] py-[4rpx] rounded-[16rpx] border-[#FFDBC233] border-[length:2rpx] border-solid">
              <text class="text-[#FFDBC2] text-base">{{ condition.is_finish === 1 ? '已达成' : '未达成' }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 奖励说明卡片 -->
      <view class="bg-tuiguang-card rounded-[24rpx] p-[32rpx] border-[#D5D5D8] border-[length:1rpx] border-solid">
        <view class="flex items-center justify-center">
          <text class="text-[#FFDBC2] text-[24rpx] mr-[16rpx]">★</text>
          <text class="text-[#FFDBC2] text-[36rpx] font-semibold">奖励说明1</text>
          <text class="text-[#FFDBC2] text-[24rpx] ml-[16rpx]">★</text>
        </view>

        <view class="mb-[24rpx]">
          <img src="/static/images/tuiguangIcon/line_tuiguang.svg" alt="" class="w-[100%] h-[2px]">
        </view>

        <view class="mb-[16rpx]">
          <text class="text-[#FFDBC280] text-[24rpx]">当前等级下</text>
        </view>
        
        <view class="space-y-[12rpx]">
          <view v-for="(reward, index) in currentLevelInfo.rewards" :key="index" class="flex items-center">
            <text class="text-[#FFDBC2] text-[24rpx] mr-[12rpx]">•</text>
            <text class="text-[#FFDBC2] text-base">{{ reward }}</text>
          </view>
        </view>
      </view>
    </view>
  </layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getPromotionLevel } from "@/api/user";

// 响应式数据
const layoutRef = ref(null);
const promotionData = ref(null);
const currentLevel = ref(0);
const levelList = ref([]);

// 等级图标配置
const levelIcons = [
  '/static/images/tuiguangIcon/tuiguang_01.png',
  '/static/images/tuiguangIcon/tuiguang_02.png',
  '/static/images/tuiguangIcon/tuiguang_03.png',
  '/static/images/tuiguangIcon/tuiguang_04.png',
  '/static/images/tuiguangIcon/tuiguang_05.png',
  '/static/images/tuiguangIcon/tuiguang_06.png',
];

// 当前等级信息
const currentLevelInfo = computed(() => {
  const levelData = levelList.value.find(item => item.level === currentLevel.value + 1);
  if (levelData) {
    return {
      level: levelData.level,
      title: levelData.name,
      iconUrl: levelIcons[currentLevel.value] || levelIcons[0],
      conditions: levelData.conditions_map || [],
      rewards: levelData.reward_map || []
    };
  }
  return {
    level: 1,
    title: '推广能手',
    iconUrl: levelIcons[0],
    conditions: [],
    rewards: []
  };
});

// 当前进度条图片
const currentProgressImage = computed(() => {
  const levelImages = [
    '/static/images/tuiguangIcon/level_1.png',
    '/static/images/tuiguangIcon/level_2.png', 
    '/static/images/tuiguangIcon/level_3.png',
    '/static/images/tuiguangIcon/level_4.png',
    '/static/images/tuiguangIcon/level_5.png',
    '/static/images/tuiguangIcon/level_6.png',
  ];
  return levelImages[currentLevel.value];
});

// 动态背景类型
const dynamicBgType = computed(() => {
  switch (currentLevel.value + 1) {
    case 0:
    case 1:
      return 'bg-page1';
    case 2:
      return 'bg-page2';
    case 3:
      return 'bg-page3';
    case 4:
      return 'bg-page4';
    case 5:
      return 'bg-page5';
    case 6:
      return 'bg-page6';
    default:
      return 'bg-page1';
  }
});

// 获取推广等级数据
const fetchPromotionData = async () => {
  try {
    const data = await getPromotionLevel();
    promotionData.value = data;
    // 设置等级列表
    if (data?.data?.level_list) {
      levelList.value = data.data.level_list;
    }
    
    // 根据promotion_level设置当前等级
    const level = data?.data?.user?.promotion_level || 0;
    if (level >= 0 && level <= 6) {
      currentLevel.value = level == 0 ? 0 : level - 1;
    }
    
    console.log('推广等级数据:', data);
  } catch (error) {
    console.error('获取推广等级数据失败:', error);
  }
};

// 处理下拉刷新
const handleRefresh = async () => {
  await fetchPromotionData();
  if (layoutRef.value) {
    layoutRef.value.complete();
  }
};

// 页面加载
onLoad(() => {
  fetchPromotionData();
});

// 页面挂载
onMounted(() => {
  // 可以在这里添加其他初始化逻辑
});
</script>

<style lang="scss" scoped>
// 自定义样式
.transition-all {
  transition: all 0.3s ease;
}

.space-y-12 > * + * {
  margin-top: 12rpx;
}
</style>
