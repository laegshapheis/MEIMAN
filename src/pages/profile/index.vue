<template>
  <layout
    :isNav="true"
    bgType="bg-profile"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="个人中心"
    :isLottie="false"
    @navLeftClick="handleNavLeftClick"
    :isNavLeftBack="true"
  >
    <view class="px-[32rpx] relative box-border w-full flex flex-col">
      <view class="h-[var(--status-bar-height)] bg-transparent"></view>
      <!-- <image src="/static/images/profile/profile_top_bg.png" mode="widthFix" class="w-full h-[458rpx] absolute -top-[80rpx] left-0"></image> -->
      <!-- 用户信息头部 -->
      <UserHeader
        :openCards="openCards"
        :userInfo="userInfo"
        @onTips="alertTips"
        @onCheckIn="() => navigateTo(routes.checkIn)"
      />
    
      <!-- VIP卡片 -->
      <!-- <VipCard /> -->
      <!-- vip -->
      <VipInfo v-if="openCards > 0" :userInfo="userInfo" @onTips="alertTips" @onNavTo="navTo" />
    </view>
    <view class="p-[32rpx] relative box-border w-full flex flex-col mb-[24rpx]">

      <!-- 账户区域 -->
      <AccountSection
        :openCards="openCards"
        :userInfo="userInfo"
        :currentRate="currentRate"
        :showData="showData"
        @onTips="alertTips"
        @onNavTo="navTo"
      />

      <!-- 团队，股权 -->
      <QuickEntry v-if="openCards > 0" :userInfo="userInfo" :isequity="isequity" :permissionStore="permissionStore" @onNavTo="navTo" />
      <!-- 游戏入口区域 -->
      <!-- <GameEntry :userInfo="userInfo" @onRealname="handleRealname" v-if="permissionStore.permissions.game_module_switch == 1"/> -->
      <!-- 推广等级 -->
      <view 
        v-if="promotion_level_switch"
        class="h-[128rpx] bg-[#1A283D] bg-tuiguang-card px-[32rpx] rounded-[32rpx] mt-[32rpx] flex flex-row justify-between items-center"
        @click="handlePromotionLevelClick"
      >
        <view class="flex flex-col">
          <text class="text-[#666666] text-sm font-medium">我的推广等级</text>
          <text class="text-[#FFDBC2] text-base font-medium">{{ promotionLevelText }}</text>
        </view>
        <view class="flex flex-row items-center">
          <image 
            v-if="promotionLevel !== 0"
            :src="promotionLevelImage" 
            mode="widthFix" 
            class="w-[112rpx] h-[112rpx]"
          ></image>
          <view 
            v-else
            class="px-[24rpx] py-[12rpx] bg-[#FFDBC21A] rounded-[32rpx]"
          >
            <text class="text-[#FFDBC2] text-sm font-medium">查看详情</text>
          </view>
        </view>
      </view>
      
      <!-- 常用功能 -->
      <CommonMenu :openCards="openCards" :userInfo="userInfo" @onNavTo="navTo" />

      <!-- 安全中心 -->
      <SecurityCenter
        :userInfo="userInfo"
        :appNewVersion="appNewVersion"
        @onNavTo="navTo"
      />
    </view>
  </layout>

  <!-- 规则弹出框 -->
  <wk-modal ref="wkPopupRef" title="说明">
    <uv-parse
      :show-img-menu="false"
      :content="strings"
      container-style="white-space: pre-wrap;color: #010101;"
    ></uv-parse>
  </wk-modal>

  <!-- 密码重置 -->
  <wk-modal ref="wkPwdPopupRef" title="修改/重置登录密码">
    <view class="flex flex-col justify-center px-[0rpx]">
      <view class="text-center mb-[50rpx] mt-[20rpx]">
        <text class="text-base text-neutral-regular"
          >请选择修改/重置登录密码方式</text
        >
      </view>
      <view class="flex-1">
        <!-- 密钥开关打开并且手机号注册的用户 -->
        <wk-button
          class="mb-[28rpx]"
          @submit="handleResetPassword(routes.editResetPass)"
          v-if="userInfo.miyao_switch && userInfo.register_type == 1"
        >
          使用密钥重置
        </wk-button>
        <!-- 邮箱注册的用户 -->
        <wk-button
          v-if="
            userInfo.register_type == 2 &&
            (registerMethod == 3 || registerMethod == 2)
          "
          class="mb-[28rpx]"
          @submit="handleResetPassword(routes.emailResetPass)"
        >
          使用邮箱重置
        </wk-button>
        <view
          class="mb-[28rpx] text-center pt-[10rpx]"
          @click="handleResetPassword(routes.editPassword)"
        >
          <text class="text-neutral-theme text-base">使用原登录密码修改</text>
      </view>
      </view>
    </view>
  </wk-modal>

  <!-- 支付密码重置 -->
  <wk-modal ref="wkPaypwdPopupRef" title="修改/重置支付密码">
    <view class="flex flex-col justify-center px-[0rpx]">
      <view class="text-center mb-[50rpx] mt-[20rpx]">
        <text class="text-base text-neutral-regular"
          >请选择修改/重置支付密码方式</text
        >
      </view>
      <view class="flex-1">
        <wk-button
          class="mb-[28rpx]"
          @submit="
            handleResetPayPassword(
              routes.editPayPass + '?code=' + userInfo.ispaypwd
            )
          "
          v-if="userInfo.pwdmima == 1 && userInfo.register_type == 1"
        >
          使用密钥重置
        </wk-button>
        <!-- 邮箱注册 -->
        <wk-button
          v-if="
            userInfo.register_type == 2 &&
            (registerMethod == 3 || registerMethod == 2)
          "
          class="mb-[28rpx]"
          @submit="handleResetPayPassword(routes.emailResetPayPass)"
        >
          使用邮箱重置
        </wk-button>
        <view
          class="mb-[28rpx] text-center pt-[10rpx]"
          @click="
            handleResetPayPassword(
              routes.payPassNew + '?code=' + userInfo.ispaypwd
            )
          "
        >
          <text class="text-neutral-theme text-base">使用原支付密码修改</text>
        </view>
      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </wk-modal>

  <!-- 产品弹窗, 开会员卡展示 -->
  <ProductModal
    v-if="openCards > 0"
    :show="showProductModal"
    :product="product"
    @close="handleProductClose"
    @submit="handleProductSubmit"
  />

  <!-- 右下角可拖拽固定图片按钮 -->
  <!-- <DraggableFloatingButton 
    v-if="fucardSwitch == 1" 
    @click="handleFloatingImageClick"
  /> -->
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { onShow, onHide, onBackPress } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";
import { navigateTo } from "@/utils/navigation";
import { formatPrice } from "@/utils/utils";
import { getUserInfoIndex as getUserInfoIndexApi, getPromotionLevel } from "@/api/user";
import checkNetwork from "@/utils/checkNetWork";
import ProductInfo from "@/pages/product/components/list/ProductInfo.vue";
import ProductEquityInfo from "@/pages/product/components/list/ProductEquityInfo.vue";
import UserHeader from "./components/UserHeader.vue";
import VipInfo from "./components/VipInfo.vue";
import VipCard from "./components/vipCard.vue";
import AccountSection from "./components/AccountSection.vue";
import QuickEntry from "./components/QuickEntry.vue";
import GameEntry from "./components/GameEntry.vue";
import CommonMenu from "./components/CommonMenu.vue";
import SecurityCenter from "./components/SecurityCenter.vue";
import ProductModal from "./components/ProductModal.vue";
import DraggableFloatingButton from "./components/DraggableFloatingButton.vue";
import { cacheManager } from "@/utils/cacheManager";
import { usePermissionStore } from "@/stores/permission";
import { useProductPopup } from "./composables/useProductPopup";
import { useUserInfo } from "./composables/useUserInfo";
import { useUserCardInfoStore } from '@/stores/userCardInfoStore';


// 引用和状态
const layoutRef = ref(null);
const wkPopupRef = ref(null);
const wkPwdPopupRef = ref(null);
const wkPaypwdPopupRef = ref(null);
const strings = ref("");
// 获取权限和菜单配置
const permissionStore = usePermissionStore();
const userCardInfoStore = useUserCardInfoStore();
console.log('permissionStore.permissions', permissionStore.permissions);
const promotion_level_switch = computed(() => permissionStore.permissions?.promotion_level_switch);

// 用户信息相关
const {
  userInfo,
  showData,
  currentRate,
  isequity,
  appNewVersion,
  fucardSwitch,
  loading,
  loadingText,
  getUserInfoIndex,
  handleCache,
} = useUserInfo();

// 推广等级相关
const promotionLevel = ref(0);

// 推广等级文字映射
const promotionLevelText = computed(() => {
  const levelMap = {
    0: '暂未达成',
    1: '推广能手',
    2: '推广专员',
    3: '推广明星',
    4: '推广大使'
  };
  return levelMap[promotionLevel.value] || '暂未达成';
});

// 推广等级图片映射
const promotionLevelImage = computed(() => {
  const imageMap = {
    1: '/static/images/tuiguangIcon/tuiguang_01.png',
    2: '/static/images/tuiguangIcon/tuiguang_02.png',
    3: '/static/images/tuiguangIcon/tuiguang_03.png',
    4: '/static/images/tuiguangIcon/tuiguang_04.png'
  };
  return imageMap[promotionLevel.value] || '/static/images/tuiguangIcon/tuiguang_01.png';
});

// 产品弹窗相关
const {
  showProductModal,
  product,
  productList,
  handleProductOpen,
  handleProductClose,
  handleProductSubmit,
  showNextProduct,
} = useProductPopup(userInfo);

const registerMethod = computed(
  () => permissionStore.permissions?.register_method
);
const openCards = 1;

onBackPress((event) => {
  if (event.from == 'backbutton') {
    handleNavLeftClick();
    return true;
  }
  return false;
});
// 生命周期钩子
onShow(() => {
  permissionStore.fetchPermissions();
  // checkNetwork({
  //   onFailure: () => {
  //     uni.switchTab({ url: routes.service });
  //   },
  //   onSuccess: () => {
  //   },
  // });
  init();

});

// 获取推广等级数据
const fetchPromotionLevel = async () => {
  try {
    if (!promotion_level_switch.value) return;
    const data = await getPromotionLevel();
    promotionLevel.value = data?.data?.user?.promotion_level || 0;
  } catch (error) {
    console.error('获取推广等级数据失败:', error);
  }
};

// 初始化方法
const init = async () => {
  loading.value = true;
  await getUserInfoIndex(false);
  await fetchPromotionLevel();
  handleProductOpen();
  // 完成下拉刷新
  if (layoutRef.value) {
    layoutRef.value.complete();
  }
  loading.value = false;
};

// 处理实名认证提示
const handleRealname = () => {
  uni.$showModal({
    title: "提示",
    content: "请先进行实名认证",
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        uni.navigateTo({
          url: routes.certification,
        });
      }
    },
  });
};

// 处理密码重置
const handleResetPassword = (path) => {
  wkPwdPopupRef.value.close();
  uni.navigateTo({ url: path });
};

// 处理支付密码重置
const handleResetPayPassword = (path) => {
  wkPaypwdPopupRef.value.close();
  uni.navigateTo({ url: path });
};

// 处理下拉刷新
const handleRefresh = () => {
  Promise.all([
    getUserInfoIndex(false),
    fetchPromotionLevel()
  ]).finally(() => {
    if (layoutRef.value) {
      layoutRef.value.complete();
    }
  });
};

// 处理推广等级点击
const handlePromotionLevelClick = () => {
  navigateTo(routes.promotionLevelDetail);
};

// 处理导航左侧点击
const handleNavLeftClick = () => {
  uni.reLaunch({ url: routes.index });
};

// 导航处理
const navTo = (item) => {
  switch (item.key) {
    case "logout":
      uni.$showModal({
        content: "确定要退出吗？",
        success: function (res) {
          if (res.confirm) {
            // 清除所有接口数据缓存
            cacheManager.clearAllCache();
            uni.removeStorageSync("app_token");
            uni.redirectTo({ url: routes.login });
          }
        },
      });
      break;

    case "app_version":
      if (appNewVersion.value) {
        uni.navigateTo({ url: routes.upApp });
      } else {
        uni.$showToast({
          title: "当前版本已是最新版本",
          duration: 1000,
          icon: "none",
        });
      }
      break;

    default:
      // 未实名，并且实名认证和支付密码不需要验证实名
      if (
        item.key != "realname" &&
        item.key != "pay_passwd" &&
        userInfo.value.isreal != 1
      ) {
        handleRealname();
        return false;
      }

      // 检查支付密码状态
      if (item.key == "view_miyao" && userInfo.value.ispaypwd != 1) {
        uni.$showModal({
          title: "提示",
          content: "请先设置支付密码再查看密钥！",
          showCancel: false,
          success: function (resx) {
            if (resx.confirm) {
              uni.navigateTo({
                url: routes.payPassNew + "?code=" + 0,
              });
            }
          },
        });
        return false;
      }

      // 重置密码
      if (item.key == "passwd") {
        wkPwdPopupRef.value.open();
        return;
      }

      // 重置支付密码
      if (item.key == "pay_passwd") {
        wkPaypwdPopupRef.value.open();
        return;
      }
      if (item.redirect) {
        navigateTo(item.redirect);
      } else {
        uni.switchTab({ url: item.switchTab });
      }
  }
};

// 弹窗提示
const alertTips = (idx) => {
  if (idx === 999) {
    strings.value = userInfo.value.clockcontent;
  } else {
    strings.value = userInfo.value.infolist[idx];
  }
  wkPopupRef.value.open();
};

// 处理右下角图片点击
const handleFloatingImageClick = () => {
  uni.navigateTo({
    url: '/pages/activity/index'
  });
};

</script>

<style lang="scss" scoped>
</style>
