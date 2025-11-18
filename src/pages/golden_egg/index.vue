<template>
  <layout navTitle="砸金蛋赢大奖" bgType="bg-egg" mode="black" :showBack="true">
    <template v-slot:navRight>
      <view
        @click="handleViewRecords"
        class="flex items-center py-[10rpx] rounded-full"
      >
        <text class="text-base text-black">获奖记录</text>
      </view>
    </template>

    <view class="relative h-[1130rpx]">
      <!-- 背景装饰 -->
      <image
        src="/static/images/golden_egg/bg_main.png"
        class="absolute inset-0 w-full"
        mode="widthFix"
      />
      <view class="relative flex justify-center top-[240rpx]">
        <view class="relative w-[750rpx] h-[920rpx]">
          <image
            src="/static/images/golden_egg/egg_stage.png"
            class="mx-auto absolute inset-0 w-[700rpx] h-[700rpx]"
            mode="aspectFill"
          />
          <!-- 金蛋网格 -->
          <egg-grid
            :eggs="eggs"
            :selectedEggIndex="selectedEggIndex"
            :currentSmashingIndex="currentSmashingIndex"
            :hammerImage="getHammerImage()"
            @selectEgg="selectEgg"
          />

          <!-- 立即砸蛋按钮 -->
          <view
            class="absolute bottom-[70rpx] left-1/2 -translate-x-1/2 z-30"
            @click="handleSmashAll"
          >
            <view class="relative">
              <image
                src="/static/images/golden_egg/btn_smash.png"
                class="w-[330rpx] h-[126rpx]"
              />
              <text
                class="absolute top-[50rpx] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[40rpx] font-bold"
              >
                立即砸蛋
              </text>
              <text
                class="text-sm absolute top-[70rpx] left-1/2 -translate-x-1/2 text-white text-[24rpx]"
              >
                还剩{{ remainingChances }}次
              </text>
            </view>
          </view>

          <!-- 底部操作按钮 -->
          <view
            class="absolute bottom-[100rpx] left-[30rpx] right-[30rpx] flex justify-between z-20"
          >
            <!-- 换锤子按钮组 -->
            <view class="relative">
              <!-- 基础锤展示图片 -->
              <image
                src="/static/images/golden_egg/hammer_basic.png"
                class="absolute -top-[50rpx] left-1/2 -translate-x-1/2 w-[100rpx] h-[130rpx] pointer-events-none"
                mode="aspectFit"
              />
              <view
                class="relative w-[168rpx] h-[86rpx]"
                @click.stop="handleSwitchHammer"
              >
                <image
                  src="/static/images/golden_egg/btn_switch.png"
                  class="w-full h-full"
                  mode="aspectFit"
                />
                <text
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-base font-semibold pointer-events-none"
                >
                  换锤子
                </text>
              </view>
            </view>
            <!-- 买锤子按钮组 -->
            <view class="relative">
              <!-- 进阶锤展示图片 -->
              <image
                src="/static/images/golden_egg/hammer_advanced.png"
                class="absolute -top-[70rpx] left-1/2 -translate-x-1/2 w-[100rpx] h-[130rpx] pointer-events-none"
                mode="aspectFit"
              />
              <view
                class="relative w-[168rpx] h-[86rpx]"
                @click.stop="handleBuyHammer"
              >
                <image
                  src="/static/images/golden_egg/btn_buy.png"
                  class="w-full h-full"
                  mode="aspectFit"
                />
                <text
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-base font-semibold pointer-events-none"
                >
                  买锤子
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 抽奖规则 -->
    <view
      style="
        border-radius: var(--radius-card-l, 16px);
        border: 0.5px solid #ffdbbb;
        background: #fff;
      "
      class="mb-[32rpx] mx-[30rpx] relative z-30 rounded-[24rpx] border border-[#FFDBBB] border-solid p-[24rpx_32rpx]"
    >
      <text
        class="block text-[26rpx] leading-[42rpx] opacity-80 whitespace-pre-wrap"
      >
        {{ gameRules }}
      </text>
    </view>

    <!-- 中奖弹窗 -->
    <prize-modal
      :show="showPrizeModal"
      :prize="currentPrize"
      @continue="handleContinueSmash"
      @checkPrize="handleCheckPrize"
    />

    <!-- 未中奖弹窗 -->
    <no-win-modal :show="showNoWinModal" @continue="handleContinueTry" />

    <!-- 锤子商店弹窗 -->
    <hammer-shop
      :show="showHammerModal"
      :userBalance="userBalance"
      :myHammers="myHammers"
      :hammerList="hammerList"
      :currentHammerType="currentHammerType"
      @close="closeHammerModal"
      @selectHammer="selectHammer"
      @buyHammer="buyHammer"
      @recharge="handleRecharge"
    />

    <!-- 购买确认弹窗 -->
    <purchase-dialog
      :show="showPurchaseDialog"
      :hammerName="purchaseHammerName"
      :hammerIcon="purchaseHammerIcon"
      :price="purchasePrice"
      :userBalance="userBalance"
      @close="closePurchaseDialog"
      @confirm="handlePurchaseConfirm"
      @recharge="handleRecharge"
    />

    <!-- 支付密码输入框 -->
    <wk-code-input
      ref="payPasswordRef"
      :value="payPassword"
      title="请输入支付密码"
      @finish="handlePayPasswordFinish"
      @cancel="handlePayPasswordCancel"
    />

    <!-- 加载动画 -->
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import {
  getGoldenEggInfo,
  smashGoldenEgg,
  buyHammerApi,
} from "@/api/golden_egg";

// 导入组件
import EggGrid from "./components/EggGrid.vue";
import PrizeModal from "./components/PrizeModal.vue";
import NoWinModal from "./components/NoWinModal.vue";
import HammerShop from "./components/HammerShop.vue";
import PurchaseDialog from "./components/PurchaseDialog.vue";

// 页面状态
const showHammerModal = ref(false);
const showPurchaseDialog = ref(false);
const showPrizeModal = ref(false);
const showNoWinModal = ref(false);
const loading = ref(false);
const loadingText = ref("");

const eggs = ref([]);
const isSmashing = ref(false);
const currentSmashingIndex = ref(-1);
const selectedEggIndex = ref(0);
const currentHammerType = ref("");

const remainingChances = computed(() => {
  const currentHammer = myHammers.value.find(
    (h) => h.type === currentHammerType.value
  );
  return currentHammer ? currentHammer.count : 0;
});

const currentPrize = ref({
  name: "",
  value: "",
  icon: "",
  image: "",
});
const gameRules = ref("");

const userBalance = ref(0);
const purchaseHammerType = ref("");
const purchaseHammerName = ref("");
const purchaseHammerIcon = ref("");
const purchasePrice = ref(0);
const purchaseQuantity = ref(1);

const payPasswordRef = ref(null);
const payPassword = ref("");

const myHammers = ref([]);
const hammerList = ref([]);

// 初始化金蛋
const initEggs = () => {
  if (!eggs.value || eggs.value.length === 0) {
    eggs.value = Array(6)
      .fill(null)
      .map(() => ({
        isSmashed: false,
        prize: null,
      }));
  }
};

onShow(() => {
  initEggs();
  getUserGoldenEggInfo();
});

// 获取用户砸金蛋信息
const getUserGoldenEggInfo = async (autoSelectHammer = true) => {
  try {
    if (loading.value) return;
    loading.value = true;
    loadingText.value = "加载中...";
    const res = await getGoldenEggInfo();
    if (res.status != 0) {
      uni.$showToast({
        title: res.msg,
        icon: "none",
      });
      return;
    }
    if (res.data) {
      console.log(res.data);
      const { user, hammer_list, intro, address_status } = res.data;

      // 设置用户余额
      if (user && user.amount) {
        userBalance.value = user.amount;
      }

      if (hammer_list && hammer_list.length > 0) {
        // 只保留 status 为 1 的锤子
        const activeHammers = hammer_list.filter((h) => h.status === 1);
        hammerList.value = activeHammers;

        myHammers.value = activeHammers.map((hammer) => ({
          id: hammer.id,
          type: hammer.type,
          count: 0,
          icon: hammer.img,
          name: hammer.name,
        }));
      }

      if (user && user.user_hammer_list) {
        user.user_hammer_list.forEach((userHammer) => {
          const hammer = myHammers.value.find(
            (h) => h.id === userHammer.hammer_id
          );
          if (hammer) {
            hammer.count = Number(userHammer.num) || 0;
          }
        });

        // 只在首次加载或用户主动要求时才自动选择锤子
        if (autoSelectHammer) {
          // 优先选择有数量的锤子
          const availableHammer = myHammers.value.find((h) => h.count > 0);
          if (availableHammer) {
            currentHammerType.value = availableHammer.type;
          } else if (myHammers.value.length > 0) {
            // 如果没有可用锤子，选择第一个（通常是基础锤）
            currentHammerType.value = myHammers.value[0].type;
          }
        } else {
          // 如果当前选择的锤子数量为0，才切换到其他有数量的锤子
          const currentHammer = myHammers.value.find(
            (h) => h.type === currentHammerType.value
          );
          if (!currentHammer || currentHammer.count <= 0) {
            const availableHammer = myHammers.value.find((h) => h.count > 0);
            if (availableHammer) {
              currentHammerType.value = availableHammer.type;
            } else if (myHammers.value.length > 0) {
              currentHammerType.value = myHammers.value[0].type;
            }
          }
        }
      }

      gameRules.value = intro;

      // 检查地址状态
      checkAddressStatus(address_status);
    }
  } catch (error) {
    console.error("获取砸金蛋信息失败:", error);
  } finally {
    loading.value = false;
  }
};

// 检查地址状态
const checkAddressStatus = (address_status) => {
  if (address_status === 0) {
    // 未设置地址
    uni.$showModal({
      title: "提示",
      content: "请先设置默认收货地址，以便中奖后发放奖品",
      confirmText: "去设置",
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          uni.navigateTo({
            url: routes.address + "?isChoice=1",
          });
        }
      },
    });
  } else if (address_status === 1) {
    // 地址未设置为默认
    uni.$showModal({
      title: "提示",
      content: "收货地址必须为默认地址，以便中奖后发放奖品",
      confirmText: "去设置",
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          uni.navigateTo({
            url: routes.address + "?isChoice=1",
          });
        }
      },
    });
  }
  // address_status === 2 表示地址正常，无需提示
};

// 选择金蛋
const selectEgg = (index) => {
  if (eggs.value[index]?.isSmashed) {
    uni.$showToast({
      title: "该金蛋已经砸过了",
      icon: "none",
    });
    return;
  }
  if (isSmashing.value) return;
  selectedEggIndex.value = index;
};

// 砸金蛋
const handleSmashEgg = async (index) => {
  if (eggs.value[index]?.isSmashed) {
    uni.$showToast({
      title: "该金蛋已经砸过了",
      icon: "none",
    });
    return;
  }

  if (remainingChances.value <= 0) {
    const currentHammer = myHammers.value.find(
      (h) => h.type === currentHammerType.value
    );
    const hammerName = currentHammer?.name || "锤子";
    uni.$showToast({
      title: `${hammerName}数量不足，请购买或切换其他锤子`,
      icon: "none",
    });
    return;
  }

  if (isSmashing.value) return;

  // 获取当前使用的锤子ID
  const currentHammer = myHammers.value.find(
    (h) => h.type === currentHammerType.value
  );
  if (!currentHammer || currentHammer.count <= 0) {
    uni.$showToast({
      title: "当前锤子数量不足",
      icon: "none",
    });
    return;
  }

  isSmashing.value = true;
  currentSmashingIndex.value = index;

  // 开始动画
  setTimeout(async () => {
    try {
      const res = await smashGoldenEgg({
        hammer_id: currentHammer.id,
      });

      if (res.status != 0) {
        currentSmashingIndex.value = -1;
        isSmashing.value = false;
        uni.$showToast({
          title: res.msg,
          icon: "none",
        });
        return;
      }

      console.log("res", res);

      if (res.data) {
        const { reward_type, reward_name, amount, reward_img } = res.data;

        // 判断是否中奖：reward_type 不是 "thanks" 就是中奖
        const is_win = reward_type !== "thanks";

        if (is_win) {
          // 中奖了
          currentPrize.value = {
            name: reward_name || "奖品",
            value: amount && amount !== "0.00" ? amount : reward_name,
            icon: getPrizeIcon(reward_type),
            image: reward_img || "",
          };
          eggs.value[index].prize = currentPrize.value;
        } else {
          // 未中奖（谢谢参与）
          eggs.value[index].prize = null;
        }

        eggs.value[index].isSmashed = true;

        getUserGoldenEggInfo(false);

        // 等待动画完成后再显示弹窗
        setTimeout(() => {
          currentSmashingIndex.value = -1;
          isSmashing.value = false;

          // 动画结束后立即显示结果弹窗
          if (is_win) {
            showPrizeModal.value = true;
          } else {
            showNoWinModal.value = true;
          }

          // 重置金蛋显示
          setTimeout(() => {
            resetEggDisplay();
          }, 100);
        }, 600);
      }
    } catch (error) {
      console.error("砸蛋API调用失败:", error);
      currentSmashingIndex.value = -1;
      isSmashing.value = false;
      uni.$showToast({
        title: error.message || "砸蛋失败，请重试",
        icon: "none",
      });
    }
  }, 600);
};

// 重置金蛋显示状态
const resetEggDisplay = () => {
  eggs.value = eggs.value.map(() => ({
    isSmashed: false,
    prize: null,
  }));
};

// 继续砸蛋
const handleContinueSmash = () => {
  showPrizeModal.value = false;
};

// 查看奖品
const handleCheckPrize = () => {
  showPrizeModal.value = false;
  uni.navigateTo({
    url: routes.goldenEggRecords,
  });
};

// 继续尝试
const handleContinueTry = () => {
  showNoWinModal.value = false;
};

// 查看中奖记录
const handleViewRecords = () => {
  uni.navigateTo({
    url: routes.goldenEggRecords || "/pages/golden_egg/records",
  });
};

// 切换锤子
const handleSwitchHammer = () => {
  showHammerModal.value = true;
};

// 购买锤子
const handleBuyHammer = () => {
  showHammerModal.value = true;
};

// 关闭锤子选择弹窗
const closeHammerModal = () => {
  showHammerModal.value = false;
};

// 选择锤子
const selectHammer = (type) => {
  const hammer = myHammers.value.find((h) => h.type === type);
  if (hammer && hammer.count > 0) {
    currentHammerType.value = type;
    showHammerModal.value = false;
    const hammerName = hammer.name || "锤子";
    uni.$showToast({
      title: `已切换至${hammerName}`,
      icon: "success",
    });
  } else {
    uni.$showToast({
      title: "您还未拥有该锤子",
      icon: "none",
    });
  }
};

// 购买锤子
const buyHammer = (type) => {
  // 从后端数据获取锤子信息
  const hammer = hammerList.value.find((h) => h.type === type);
  if (!hammer) {
    uni.$showToast({
      title: "锤子信息不存在",
      icon: "none",
    });
    return;
  }

  purchaseHammerType.value = hammer.type;
  purchaseHammerName.value = hammer.name;
  purchaseHammerIcon.value = hammer.img;
  purchasePrice.value = parseFloat(hammer.price);

  showPurchaseDialog.value = true;
};

// 关闭购买确认弹窗
const closePurchaseDialog = () => {
  showPurchaseDialog.value = false;
};

// 处理购买确认
const handlePurchaseConfirm = (data) => {
  if (data && data.quantity) {
    purchaseQuantity.value = data.quantity;
  }
  if (payPasswordRef.value) {
    payPassword.value = "";
    payPasswordRef.value.open();
  }
};

// 处理支付密码完成
const handlePayPasswordFinish = async (password) => {
  if (!password || password.length < 6) {
    uni.$showToast({
      title: "请输入6位支付密码",
      icon: "none",
    });
    return;
  }
  payPassword.value = password;
  payPasswordRef.value.close();

  uni.showLoading({
    title: "购买中...",
    mask: true,
  });

  try {
    // 获取要购买的锤子信息
    const hammerToBuy = hammerList.value.find(
      (h) => h.type === purchaseHammerType.value
    );
    if (!hammerToBuy) {
      throw new Error("锤子信息不存在");
    }

    // 调用真实的购买API
    const res = await buyHammerApi({
      hammer_id: hammerToBuy.id,
      buy_num: purchaseQuantity.value,
      pwdPay: password,
    });
    if (res.status != 0) {
      uni.$showToast({
        title: res.msg,
        icon: "none",
      });
      return;
    }
    uni.hideLoading();
    uni.$showToast({
      title: `成功购买${purchaseHammerName.value}`,
      icon: "success",
    });

    showPurchaseDialog.value = false;
    payPassword.value = "";
    purchaseQuantity.value = 1;
    getUserGoldenEggInfo(false);
  } catch (error) {
    uni.hideLoading();
    uni.$showToast({
      title: error.message || "购买失败，请重试",
      icon: "none",
    });
  }
};

// 处理支付密码取消
const handlePayPasswordCancel = () => {
  payPassword.value = "";
  payPasswordRef.value.close();
};

// 充值
const handleRecharge = () => {
  uni.navigateTo({
    url: "/pages/recharge/index",
  });
};

// 获取锤子图片
const getHammerImage = () => {
  // 首先尝试从当前锤子列表中获取图片
  const currentHammer = myHammers.value.find(
    (h) => h.type === currentHammerType.value
  );
  if (currentHammer && currentHammer.icon) {
    return currentHammer.icon;
  }

  // 如果当前锤子列表中没有，尝试从锤子列表中获取
  const hammerFromList = hammerList.value.find(
    (h) => h.type === currentHammerType.value
  );
  if (hammerFromList && hammerFromList.img) {
    return hammerFromList.img;
  }

  // 如果都没有，返回第一个可用锤子的图片
  if (myHammers.value.length > 0 && myHammers.value[0].icon) {
    return myHammers.value[0].icon;
  }
  if (hammerList.value.length > 0 && hammerList.value[0].img) {
    return hammerList.value[0].img;
  }

  // 最后的备用方案
  return "/static/images/golden_egg/hammer_basic.png";
};

// 立即砸蛋
const handleSmashAll = () => {
  if (selectedEggIndex.value === -1) {
    uni.$showToast({
      title: "请先选择一个金蛋",
      icon: "none",
    });
    const unmashedIndex = eggs.value.findIndex((egg) => !egg.isSmashed);
    if (unmashedIndex !== -1) {
      selectedEggIndex.value = unmashedIndex;
    }
    return;
  }
  handleSmashEgg(selectedEggIndex.value);
};

// 根据奖品类型获取图标
const getPrizeIcon = (reward_type) => {
  const iconMap = {
    money: "/static/images/golden_egg/coin.png",
    item: "/static/images/golden_egg/vip.png",
    thanks: "/static/images/golden_egg/no_win.png",
  };
  return iconMap[reward_type] || "/static/images/golden_egg/coin.png";
};
</script>

<style lang="scss" scoped></style>
