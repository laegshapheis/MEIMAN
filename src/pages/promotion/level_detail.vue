<template>
  <layout ref="layoutRef" navTitle="" 
   bgType="bg-promotion" :refresher="true" :isNav="false" mode="black"
   :isLottie="false"
    @onRefresh="handleRefresh">
    <view class="relative h-[100vh] flex flex-col">
      <view class="fixed w-full">
        <wk-nav-bar @rightClick="handleNavRightClick" @leftClick="navigateBack">
          <template #left>
            <image class="w-[60rpx] h-[60rpx]" :src="'/static/images/tuiguangIcon/back_tuiguang.svg'" mode="widthFix"></image>
          </template>
          <template v-slot:right>
            <view
              class="h-[64rpx] px-[16rpx] flex items-center justify-center text-white text-base bg-[rgba(255,255,255,.1)] rounded-[64rpx]"
              @click="openTips(1)">推广说明</view>
          </template>
        </wk-nav-bar>
      </view>
      <!-- 加载占位，避免先出现“暂无等级”再跳变 -->
      <view v-if="!promotionLoaded" class="w-full flex flex-col items-center py-[80rpx] text-white/80">
        <text class="text-base">加载中...</text>
      </view>

      <template v-else>
        <view class="h-[668rpx] w-full flex flex-col items-center">
          <image v-if="hasPromotionLevel" :src="levelIcons[userActualLevel] || levelIcons[0]"
            class="w-[192rpx] h-[192rpx] mt-[auto]" mode="aspectFit" />
          <image v-else src="/static/images/tuiguangIcon/tuiguang_00.png"
            class="w-[192rpx] h-[192rpx] mt-[auto]" mode="aspectFit" />
          <view class="mt-[8rpx] text-black text-3xl leading-[68rpx] font-[600]">{{ userActualLevelTitle }}</view>
          <view class="mt-[8rpx] text-white/60 text-xs">您的当前等级</view>
          <view class="h-[172rpx] w-full mt-[16rpx] relative">
            <view
              class="h-[16rpx] ml-[48rpx] mr-[48rpx] bg-[rgba(255,255,255,.2)] rounded-[32rpx] absolute top-[60rpx] left-0 right-0">
              <view class="h-[16rpx] rounded-[32rpx] absolute top-0 left-0"
                :style="{ 
                  width: progressBarWidth,
                  borderRadius: '360px',
                  border: '0.5px solid #FFF',
                  background: 'linear-gradient(90deg, #00E1FF 3.08%, #E9FCFF 100%)'
                }"></view>
            </view>
            <view class="flex justify-between mt-[48rpx] absolute top-0 left-0 right-0 bottom-0">
              <view class="flex flex-col items-center w-[96rpx]">
                <!-- <image :src="levelIcons[0]" class="w-[40rpx] h-[40rpx] mb-[8rpx]"
                  mode="aspectFit" />
                <view class="text-white text-ss">暂无等级</view> -->

              </view>
              <view class="flex flex-col items-center w-[96rpx]" v-for="(item, index) in levelList"
                :key="item.level_id">
                <image :src="levelIcons[index] || levelIcons[0]" class="w-[40rpx] h-[40rpx] mb-[8rpx]"
                  mode="aspectFit" />
                <view :style="{ fontSize: '16rpx' }" :class="(index == userActualLevel) ? 'text-white' : 'text-white/50'">{{ item.name
                }}</view>
              </view>
            </view>
          </view>
        </view>
        <view class="flex flex-col flex-1 h-[0rpx] bg-[#00299B] rounded-t-[32rpx]  pt-[0]">
          <view class="px-[32rpx] my-[32rpx]">
            <scroll-view v-if="subTabs.length > 0" class="w-full" scroll-x :show-scrollbar="false" :enable-back-to-top="false">
              <view class="flex flex-row items-center" style="white-space: nowrap;">
                <view 
                  v-for="(item, index) in subTabs" 
                  :key="item.id"
                  class="inline-block mr-[16rpx]"
                  :class="{ 'last:mr-0': index === subTabs.length - 1 }"
                >
                  <wk-button
                    :type="subCurrent === index ? 'img-bg3' : 'plain_1'"
                    size="mini"
                    :width="'auto'"
                    @click="handleSubTabChange(item, index)"
                  >
                    {{ item.name }}
                  </wk-button>
                </view>
              </view>
            </scroll-view>
          </view>
          <scroll-view class="flex-1 scroll-content " scroll-y :show-scrollbar="true" :enable-back-to-top="false">
            <view class="px-[32rpx] pb-[32rpx]">
              <view class="px-[32rpx] py-[16rpx] 
          h-[40rpx] flex items-center 
          justify-center text-[#FFE8D8] 
          text-base bg-[rgba(0,0,0,.2)] rounded-[24rpx] 
          border-[rgba(255,255,255,.2)] border-[length:1rpx] border-solid">{{ promotionData.data.user.promotion_level
            >= levelList[subCurrent].level ? '您已达成该等级！' : '您还未达成该等级！' }}</view>

            <view class="flex items-center justify-center mt-[24rpx]">
              <text class="text-white text-[24rpx] mr-[16rpx]">★</text>
              <text class="text-white text-[36rpx] font-semibold">升级条件</text>
              <text class="text-white text-[24rpx] ml-[16rpx]">★</text>
            </view>
            <view class="mt-[32rpx] space-y-[16rpx] bg-black/25 rounded-[24rpx] p-[24rpx]"
            style="border: 1rpx solid #007BFF;">
              <view class="flex justify-between mb-[16rpx]">
                <view class="text-base text-[#FFDBC280]">以下条件全部达成才可升级</view>
                <!-- <view class="text-sm text-white/50">当前有效会员</view> -->
              </view>
              <view class="flex items-center text-base text-white mb-[16rpx]"
                v-for="(item, index) in levelList[subCurrent].conditions_map" :key="index">
                <view class="mr-[16rpx] ">{{ index+1 }}</view>
                <view class="flex-1 mr-[16rpx]">{{ item.condition }}</view>
                <view class="w-[108rpx] h-[52rpx] flex items-center justify-center text-sm rounded-[48rpx] border-[rgba(255,219,194,0.2)] border-[length:1rpx] border-solid text-[#FFDBC2]" v-if="item.is_finish == 1">已达成</view>
                <view class="w-[108rpx] h-[52rpx] flex items-center justify-center text-sm rounded-[48rpx] border-[rgba(255,219,194,0.2)] border-[length:1rpx] border-solid text-[#373A4A] bg-[#FFDBC2]" v-else>未达成</view>
              </view>
              <view class="bg-white/5 rounded-[16rpx] p-[16rpx] text-white/60 text-sm">注意：一级会员必须在投金额达到{{invite_min_amount}}{{symbolStore.code}}才能算1个在投人数</view>
            </view>

            <view class="flex items-center justify-center mt-[24rpx]">
              <text class="text-white text-[24rpx] mr-[16rpx]">★</text>
              <text class="text-white text-[36rpx] font-semibold">奖励说明</text>
              <text class="text-white text-[24rpx] ml-[16rpx]">★</text>
            </view>
            <view class="mt-[32rpx] space-y-[16rpx] bg-black/25 rounded-[24rpx] p-[24rpx]"
            style="border: 1rpx solid #007BFF;">
              <!-- <view class="mb-[16rpx] flex items-center" >
              <text class="text-[rgba(255,219,194,0.5)] text-base">管道收益</text>
              <uv-icon v-if="promotionData.data.vip_pipeline_income" @click="openTips" class="w-[30rpx] h-[30rpx] ml-[4rpx]" name="question-circle" size="14" color="#FFDBC280" />
            </view> -->
              <view class="flex justify-between text-base text-white"
                v-for="(text, index) in levelList[subCurrent].reward_map" :key="index">
                <view class="mb-[8rpx]">·{{ text }}</view>
              </view>
            </view>
            <view v-if="promotionLevelSwitch" class="mt-[48rpx] mb-[48rpx] px-[32rpx]">
              <CommonTips :content="promotionLevelTips" color="#FFDBC280" />
            </view>
            </view>
            
          </scroll-view>

        </view>
      </template>
    </view>

    <uv-popup 
      ref="wkPopupRef" 
      mode="bottom" 
      :round="'24rpx'"
      :closeOnClickOverlay="true"
      bgColor="#0C052F"
      :safeAreaInsetBottom="true"
    >
      <view class="drawer-container">
        <view class="drawer-title">推广说明</view>
        <scroll-view class="drawer-content" scroll-y>
          <uv-parse 
            :show-img-menu="false" 
            container-style="white-space: pre-wrap; color: #ffffff;" 
            :content="strings"
          ></uv-parse>
        </scroll-view>
        <view class="drawer-footer">
          <view class="drawer-button" @click="closeDrawer">我知道了</view>
        </view>
      </view>
    </uv-popup>
  </layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getPromotionLevel } from "@/api/user";
import { getConfig } from "@/api/index";
import CommonTips from "@/components/base/common-tips";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateBack } from '@/utils/navigation';

const symbolStore = useSymbolStore();
const subTabs = ref([])
const subCurrent = ref(0);
// 响应式数据
const layoutRef = ref(null);
const promotionData = ref(null);
const currentLevel = ref(0); // swiper当前显示的等级索引
const userActualLevel = ref(0); // 用户实际等级索引（从接口返回，固定不变）
const levelList = ref([]);
const promotionLevelTips = ref("");
const promotionLevelSwitch = ref(false);
const wkPopupRef = ref(null);
const strings = ref("");
const invite_min_amount = ref(0);
const swiperCurrent = ref(0);
// 数据加载状态，避免初始闪现"暂无等级"
const promotionLoaded = ref(false);
// 屏幕宽度（rpx单位，默认750rpx）
const screenWidth = ref(750);

// 等级图标配置
const levelIcons = [
  '/static/images/tuiguangIcon/tuiguang_01.png',
  '/static/images/tuiguangIcon/tuiguang_02.png',
  '/static/images/tuiguangIcon/tuiguang_03.png',
  '/static/images/tuiguangIcon/tuiguang_04.png',
  '/static/images/tuiguangIcon/tuiguang_05.png',
  '/static/images/tuiguangIcon/tuiguang_06.png',
];

// 判断是否有推广等级
const hasPromotionLevel = computed(() => {
  const promotionLevel = promotionData.value?.data?.user?.promotion_level;
  return promotionLevel !== 0 && promotionLevel !== undefined && promotionLevel !== null;
});

// 用户实际等级标题（不随swiper变动）
const userActualLevelTitle = computed(() => {
  const promotionLevel = promotionData.value?.data?.user?.promotion_level;
  if (promotionLevel === 0) {
    return '暂无等级';
  }
  const levelData = levelList.value[userActualLevel.value];
  return levelData?.name || '暂无等级';
});

// 动态计算进度条宽度（根据level_list动态计算，按等级数量等分）
const progressBarWidth = computed(() => {
  if (!levelList.value || levelList.value.length === 0) {
    return '0rpx';
  }
  
  const totalLevels = levelList.value.length;
  const userLevel = promotionData.value?.data?.user?.promotion_level || 0;
  
  // 如果用户等级为0，进度条宽度为0
  if (userLevel === 0) {
    return '0rpx';
  }
  
  // 使用动态获取的屏幕宽度（rpx单位）
  const containerWidth = screenWidth.value; // rpx单位，默认750
  const leftMargin = 48; // rpx
  const rightMargin = 48; // rpx
  
  // 进度条容器的可用宽度 = 屏幕宽度 - 左右边距
  const availableWidth = containerWidth - leftMargin - rightMargin;
  
  // 按等级数量等分：当前等级 / 总等级数 * 可用宽度
  // 例如：6个等级，当前第1级 = 1/6，当前第4级 = 4/6
  const progressRatio = userLevel / totalLevels;
  const width = availableWidth * progressRatio;
  
  return `${Math.max(0, width)}rpx`;
});

const handleSubTabChange = (item, index) => {
  console.log(item);
  subCurrent.value = index;
};

// 当前等级信息
const currentLevelInfo = computed(() => {
  // 直接使用数组索引获取等级数据
  const levelData = levelList.value[currentLevel.value];
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

// 当前等级的description（富文本内容）
const currentLevelDescription = computed(() => {
  const levelData = levelList.value[currentLevel.value];
  return levelData?.description || '';
});

// 当前等级的条件列表
const currentLevelConditions = computed(() => {
  const levelData = levelList.value[currentLevel.value];
  return levelData?.conditions_map || [];
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
const openTips = (type) => {
  if (type == 1) {
    strings.value = promotionData.value.data.promotion_level_desc;

  } else {
    strings.value = promotionData.value.data.vip_pipeline_income;
  }
  wkPopupRef.value.open();
};

const closeDrawer = () => {
  wkPopupRef.value.close();
};

// swiper切换处理
const onSwiperChange = (e) => {
  const index = e.detail.current;
  swiperCurrent.value = index;
  currentLevel.value = index;
};
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

// 计算等级文字的弧形偏移量
const getLevelOffset = (index, total) => {
  if (total <= 1) return 0;

  // 计算相对于中心的位置（-1 到 1）
  const center = (total - 1) / 2;
  const distanceFromCenter = Math.abs(index - center);
  const normalizedDistance = distanceFromCenter / center;

  // 使用二次函数计算偏移量，中间偏移最多
  // 最大偏移量根据总数调整
  const maxOffset = total <= 4 ? 10 : 20; // 4个及以下偏移20rpx，5个及以上偏移25rpx
  let offset = maxOffset * (1 - normalizedDistance * normalizedDistance);

  // 第一个和最后一个需要往上移动一点（使用负值）
  if (index === 0 || index === total - 1) {
    offset = offset - 20; // 两边向上偏移20rpx
  }

  return Math.round(offset);
};


// 获取配置数据
const fetchConfig = async () => {
  try {
    await getConfig();
  } catch (error) {
    console.error('获取配置数据失败:', error);
  }
};

// 获取推广等级数据
const fetchPromotionData = async () => {
  try {
    const data = await getPromotionLevel();
    promotionData.value = data;
    promotionLevelTips.value = data?.data?.promotion_level_tips || "";
    promotionLevelSwitch.value = data?.data?.promotion_level_tips_switch === 1 || false;
    invite_min_amount.value = data?.data?.invite_min_amount || 0;
    // 设置等级列表
    if (data?.data?.level_list) {
      levelList.value = data.data.level_list;
    }

    levelList.value.forEach(item => {
      subTabs.value.push({
        id: item.level_id,
        name: item.name,
      })
    })

    // 根据promotion_level设置当前等级
    const level = data?.data?.user?.promotion_level || 0;
    if (level >= 0 && level <= 6) {
      const levelIndex = level == 0 ? 0 : level - 1;
      userActualLevel.value = levelIndex; // 保存用户实际等级（固定不变）
      subCurrent.value = levelIndex;
      currentLevel.value = levelIndex;
      swiperCurrent.value = levelIndex;
    }

    console.log('推广等级数据:', data);
  } catch (error) {
    console.error('获取推广等级数据失败:', error);
  } finally {
    promotionLoaded.value = true;
  }
};

// 处理下拉刷新
const handleRefresh = async () => {
  await Promise.all([fetchPromotionData(), fetchConfig()]);
  if (layoutRef.value) {
    layoutRef.value.complete();
  }
};

// 页面加载
onLoad(() => {
  fetchPromotionData();
  fetchConfig();
});

// 页面挂载
onMounted(() => {
  // 获取设备屏幕宽度（rpx单位）
  // 在uni-app中，rpx是响应式单位，750rpx = 屏幕宽度（这是固定的规则）
  // 但为了代码的清晰性和确保在不同设备上都能正确计算，我们获取实际的windowWidth
  try {
    const systemInfo = uni.getSystemInfoSync();
    // 在uni-app中，750rpx总是等于屏幕宽度，所以screenWidth固定为750rpx
    // 这里获取windowWidth主要用于日志记录和未来可能的扩展
    const windowWidth = systemInfo.windowWidth || 750;
    // 由于rpx是响应式单位，750rpx就是屏幕宽度，这是uni-app的固定规则
    screenWidth.value = 750; // uni-app中750rpx就是屏幕宽度
  } catch (error) {
    console.error('获取设备信息失败:', error);
    screenWidth.value = 750; // 默认值，uni-app中750rpx就是屏幕宽度
  }
});
</script>

<style lang="scss" scoped>
// 自定义样式
.transition-all {
  transition: all 0.3s ease;
}

.space-y-12>*+* {
  margin-top: 12rpx;
}

.level-name-text {
  width: 2em;
  word-break: break-all;
  line-height: 1.4;
  text-align: center;
  display: block;
}

.level-item-container {
  overflow: visible;
}

.level-badge-text {
  overflow: visible;
  white-space: nowrap;
  position: relative;
  z-index: 10;
}

.scroll-content {
  height: 100%;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.drawer-container {
  width: 100%;
  background-color: #0C052F;
  border-top-left-radius: 32rpx;
  border-top-right-radius: 32rpx;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.drawer-title {
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #FFFFFF;
  padding: 48rpx 32rpx 32rpx;
  border-bottom: 1rpx solid #FFFFFF1A;
  margin-bottom: 32rpx;
}

.drawer-content {
  flex: 1;
  padding: 0 32rpx;
  color: #FFFFFF;
  font-size: 28rpx;
  line-height: 1.6;
  min-height: 200rpx;
  max-height: calc(80vh - 200rpx);
}

.drawer-footer {
  padding: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drawer-button {
  width: 100%;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-size: 32rpx;
  border: 1rpx solid #FFFFFF;
  border-radius: 88rpx;
  background-color: transparent;
}
</style>
