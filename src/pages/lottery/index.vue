<template>
  <layout navTitle="幸运大抽奖" bgType="bg-main5" mode="black">

    <template v-slot:navRight>
      <view
        class="flex flex-row w-full items-center justify-end bg-black/10 px-[16rpx] py-[4rpx] rounded-[24rpx]"
        @click="goLotteryRecord()"
      >
        <text class="text-sm mr-[2rpx] text-black">中奖记录</text>
      </view>
    </template>

    <!-- 内容区域 => 开始 -->
    <view class="lottery-container">
      <view class="flex flex-col justify-center items-center relative z-10 px-[32rpx] relative h-[400rpx]">
        <!-- <text class="text-[3em] font-bold">幸运大抽奖</text> -->
        <!-- <image
          class="w-[390rpx] mt-[200rpx] z-0"
          src="/static/images/index/lottery_title_icon.png"
          mode="widthFix"
        ></image> -->
        <image
          class="w-[702rpx] absolute -top-[46rpx] left-[36rpx] z-1"
          src="/static/images/index/lottery_title_bg.png"
          mode="widthFix"
        ></image>
      </view>
      <view class="flex justify-center items-center relative z-10 -top-[100rpx] left-[10rpx] z-0">
        <view class="ci_shu text-neutral-black rounded-b-[0rpx]">今日剩余抽奖次数：{{ remain_count }}</view>
      </view>
      <view class="grid-container relative -mt-[150rpx]">
        <image src="/static/images/index/bg_lottery.png" class="absolute top-0 left-0 w-full h-[858rpx]" ></image>
        <!-- 奖项1 -->
         <view class="grid-container-inner relative top-[110rpx] left-[10rpx]">
          <view
            v-for="(item, index) in prizes"
            :key="index"
            :class="[
              'grid-item',
              index === currentHighlightIndex ? 'highlight' : '',
            ]"
          >
            <image :src="item.img" class="prize-image" mode="widthFix" />
            <view class="prize-text">{{ item.name }}</view>
          </view>

          <view v-if="prizes.length > 0" class="grid-item lottery-button">
            <image
              @click="startLottery"
              src="/static/images/index/lottery_logo.png"
              class="w-[256rpx] h-[256rpx]"
              mode="widthFix"
            ></image>
          </view>
         </view>
        
        <!-- 中间抽奖按钮 -->
       
        <!-- 热区域抽奖按钮 -->
        <!-- 中奖展示记录 -->
        <!-- <view class="zj_zs_box">
          <fui-notice-bar
            :content="wheelListStr"
            height="48"
            speed="60"
            color="#FAD97A"
            scrollable
          ></fui-notice-bar>
        </view> -->
        <!-- 查看中奖记录 -->
      </view>
      <view
        v-if="lottery_jifen_switch == 1"
        class="z-10 relative px-[32rpx] py-[20rpx] inline-block rounded-full absolute top-[185rpx] left-[50%] translate-x-[-50%]"
      >
        <view class="text-black text-sm">可用积分 <text class="ml-[8rpx]">{{ user_jifen }}</text></view>
      </view>
      <view class="w-full flex justify-center items-center" v-if="false">
        <view @click="goLotteryRecord" class="look_log">查看中奖记录</view>
      </view>
      <!-- 集卡抽奖区域 -->
      <!-- <view v-if="fucard_switch == 1" class="box-border px-[32rpx] w-full">
        <view class="flex flex-row justify-between items-center mb-[24rpx]">
          <image @click="goToActivity" src="/static/images/activity/entry.png" mode="widthFix" class="w-[148rpx] h-[136rpx]"></image>
          <view 
          style="border-radius: 16px;border: 1px solid rgba(223, 169, 135, 0.20);"
          class="w-[512rpx] flex flex-col justify-center items-center gap-[24rpx] mt-[16rpx] p-[16rpx]">
          <view class="text-[#2A877C] text-base">
            已集卡片({{ cardsNum }})
          </view>
          <view class="flex flex-row justify-center items-center gap-[24rpx]">
            <view
              class="small-card"
              v-for="(item, index) in cards"
              :key="index"
            >
              <image
                class="small-card-image"
                :src="item.icon"
                mode="aspectFill"
              ></image>
              <view
                class="card-count-badge"
                v-if="item.user_count && item.user_count > 0"
              >
                <text>{{ item.user_count }}</text>
              </view>
               <view class="text-[#2A877C] text-sm mt-[8rpx] text-center">
                <text>{{ item.name }}</text>
              </view>
            </view>
          </view>
          </view>
        </view>
      </view> -->
      <!-- 抽奖规则 -->
      <view class="rule-bg">
        <view class="rule_box">
          <!-- <view class="rule_box_title">抽奖规则</view> -->

          <text class="rule_box_content">{{ ruleStr }}</text>
        </view>
      </view>
    </view>

    <fui-modal :buttons="[]" :boxRadius="0" width="400" :show="zjShow" background="linear-gradient(0deg, #FFF 77.57%, #D9CDFF 100%)">
      <view class="zj_box">
        <image class="zj_img" :src="zjObj.img" mode="widthFix"></image>
        <view class="zj_str">{{ zjObj.name }}</view>
        <wk-button @click="zjShow = false" class="w-full" backgroundColor="#FE3355"
          >我知道了</wk-button
        >
      </view>
    </fui-modal>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { routes } from "@/config/routes";
import {
  getLotteryConfig,
  getWinList,
  getUserInfo,
  startLottery as startLotteryApi,
} from "@/api/lottery";
import { getCardListApi } from "@/api/activity";
import { cacheManager } from "@/utils/cacheManager";
// 响应式状态
const zjShow = ref(false);
const zjObj = ref({
  id: "",
  img: "",
  name: "",
  prize: "",
});
const ruleStr = ref(""); //抽奖规则
const wheelListStr = ref("加载中..."); //横向滚动中奖记录
const remain_count = ref(0); //免费抽奖次数
const user_jifen = ref(0); //积分
const prizes = ref([]); // 奖品列表
const currentHighlightIndex = ref(0); // 当前高亮的奖品索引
const timer = ref(null); // 定时器
const isLotteryRunning = ref(false); // 是否在抽奖
const speed = ref(33); // 初始动画速度
const finalIndex = ref(null); // 最终中奖位置
const finalIndex_x = ref(null); // 最终中奖位置-展示
const decelerationPhase = ref(false); // 是否进入减速阶段
const decelerationStep = ref(10); // 每次减速的步长
const lottery_status = ref(0); // 抽奖状态
const loading = ref(false); // 是否加载中
const fucard_switch = ref(0); // 集卡抽奖开关
const lottery_jifen_switch = ref(0); // 积分抽奖开关
const loadingText = ref("加载中...");
// 新增集卡相关状态
const cards = ref([]); // 卡片列表
const cardsNum = computed(() => {
  let num = 0
  cards.value.forEach(item => {
    num += Number(item.user_count)
  })
  return num
});
// 初始化方法
const init = async () => {
  const cache = cacheManager.getCache("lotteryConfig");
  const cacheWinList = cacheManager.getCache("lotteryWinList");
  const cacheUserInfo = cacheManager.getCache("lotteryUserInfo");

  if (cache) {
    handleLotteryConfig(cache);
  }
  if (cacheWinList) {
    handleWinList(cacheWinList);
  }
  if (cacheUserInfo) {
    handleUserInfo(cacheUserInfo);
  }
  await getLotteryPeizhi();
  await getWinListData();
  await getUserInfoNew();
  await getCardList(); // 新增获取卡片列表
};

// 跳转到抽奖记录
const goLotteryRecord = () => {
  uni.navigateTo({
    url: routes.lotteryRecord,
  });
};

// 跳转到集卡抽奖
const goToActivity = () => {
  uni.navigateTo({
    url: routes.activity,
  });
};

// 新增获取卡片列表方法
const getCardList = async () => {
  try {
    const res = await getCardListApi();
    if (res.status == 0) {
      cards.value = res.data;
    }
  } catch (error) {
    console.error("获取卡片列表失败", error);
  }
};

// 设置地址相关逻辑
const setAddress = (res) => {
  if (res.data.lottery_jifen_product_switch == 1) {
    if (res.data.address_status == 0) {
      loading.value = false;
      // 未设置地址
      uni.$showModal({
        title: "提示",
        content: "请先设置默认收货地址",
        showCancel: false,
        success: function (resx) {
          if (resx.confirm) {
            uni.navigateTo({
              url: routes.address + "?isChoice=1",
            });
          }
        },
      });
    } else if (res.data.address_status == 1) {
      uni.$showModal({
        title: "提示",
        content: "收货地址必须为默认地址",
        showCancel: false,
        success: function (resx) {
          if (resx.confirm) {
            uni.navigateTo({
              url: routes.address + "?isChoice=1",
            });
          }
        },
      });
    }
  }
};

const handleLotteryConfig = (res) => {
  console.log(res);
  try {
    lottery_jifen_switch.value = res.data.lottery_jifen_switch;
    const linarr = res.LotteryPeizhi.map((item) => ({
      id: item.id,
      img: item.img,
      name: item.name,
      prize: item.prize,
    }));
    prizes.value = linarr;
    loading.value = false;
  } catch (error) {
    console.error("请求失败", error);
    loading.value = false;
  }
};
// 获取抽奖配置
const getLotteryPeizhi = async () => {
  loading.value = true;
  loadingText.value = "加载中...";
  const res = await getLotteryConfig();
  cacheManager.setCache("lotteryConfig", res);
  handleLotteryConfig(res);
  // 积分抽奖开关
  if (res.data.jifen_alert_text) {
    uni.$showModal({
      title: "提示",
      content: res.data.jifen_alert_text,
      showCancel: false,
      success: function (data) {
        if (data.confirm) {
          setTimeout(() => {
            setAddress(res);
          }, 600);
        }
      },
    });
    return;
  }
  setAddress(res);
};

const handleWinList = (res) => {
  try {
    wheelListStr.value = "";
    remain_count.value = res.remain_count;
    res.list1.forEach((item) => {
      wheelListStr.value += `恭喜${item.moneylog_user} ${item.moneylog_notice}　`;
    });
    ruleStr.value = res.list2;
    loading.value = false;
  } catch (error) {
    loading.value = false;
  }
};

// 获取中奖名单
const getWinListData = async () => {
  const res = await getWinList();
  handleWinList(res);
  cacheManager.setCache("lotteryWinList", res);
};

const handleUserInfo = (res) => {
  try {
    lottery_status.value = res.lottery_status;
    user_jifen.value = res.integral;
    fucard_switch.value = res.fucard_switch;
  } catch (error) {
    console.error("请求失败", error);
    loading.value = false;
  }
};

// 获取用户信息
const getUserInfoNew = async () => {
  const res = await getUserInfo();
  handleUserInfo(res);
  cacheManager.setCache("lotteryUserInfo", res);
};

// 开始抽奖
const startLottery = async () => {
  if (loading.value || isLotteryRunning.value) return;
  loading.value = true;
  loadingText.value = "加载中...";
  try {
    const res = await startLotteryApi();
    if (res.state == 0) {
      uni.$showModal({
        title: "提示",
        showCancel: false,
        content: res.msg,
      });
      loading.value = false;
      return;
    }
    if (res.state == 1) {
      isLotteryRunning.value = true;
      speed.value = 33;
      animateLottery();
      getWinListData();

      prizes.value.forEach((item, index) => {
        if (item.prize == res.msg) {
          finalIndex.value = index;
          finalIndex_x.value = index;
          decelerationPhase.value = true;
        }
      });
    }
    getUserInfoNew();
  } catch (error) {
    console.error("请求失败", error);
    loading.value = false;
  }
};

// 动画逻辑
const animateLottery = () => {
  timer.value = setInterval(() => {
    currentHighlightIndex.value =
      (currentHighlightIndex.value + 1) % prizes.value.length;

    if (decelerationPhase.value) {
      clearInterval(timer.value);

      if (
        currentHighlightIndex.value === finalIndex.value &&
        speed.value >= 200
      ) {
        isLotteryRunning.value = false;
        loading.value = false;
        resetLottery();
        zjObj.value = prizes.value[finalIndex_x.value];
        zjShow.value = true;
      } else {
        speed.value += decelerationStep.value;
        animateLottery();
      }
    }
  }, speed.value);
};

// 重置抽奖
const resetLottery = () => {
  clearInterval(timer.value);
  timer.value = null;
  speed.value = 100;
  finalIndex.value = null;
  decelerationPhase.value = false;
};

// 页面显示时初始化
onShow(() => {
  init();
});
</script>

<style lang="scss">
.lottery-container {
  // height: 100vh;
  // background-color: #f5f5f5;
  position: relative;
  .lottery-img-bg {
    width: 100%;
    height: auto;
    display: block;
  }
}
.ci_shu {
  background: #FFC63C;
  border-radius: 24rpx;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
  min-width: 300rpx;
  display: inline-block;
  color: #010101;
  font-size: 24rpx;
  text-align: center;
  padding: 20rpx 28rpx;
  margin-top: -20rpx;
}
.ci_border {
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 0px;
}
.grid-container {
  width: 100%;
  border-radius: 28px;
  padding: 0;
  box-sizing: border-box;
  // border: 6rpx solid #B676FF;
  // background: linear-gradient(21deg, #003DA0 4.25%, #8A5BFF 58.07%, #8A5BFF 97.54%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  // box-shadow: 0px 0px 8px 0px rgba(255, 255, 255, 0.25) inset;
}
.grid-container-inner{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 4rpx;
  width: 590rpx;
  height: 560rpx;
  margin: 0 32rpx;
  margin: 32rpx auto;
  border-radius: 28px;
  box-sizing: border-box;
}


.grid-item:nth-child(1) {
  grid-area: 1 / 1;
}
.grid-item:nth-child(2) {
  grid-area: 1 / 2;
}
.grid-item:nth-child(3) {
  grid-area: 1 / 3;
}
.grid-item:nth-child(4) {
  grid-area: 1 / 4;
}
.grid-item:nth-child(5) {
  grid-area: 2 / 4;
}
.grid-item:nth-child(6) {
  grid-area: 3 / 4;
}
.grid-item:nth-child(7) {
  grid-area: 4 / 4;
}
.grid-item:nth-child(8) {
  grid-area: 4 / 3;
}
.grid-item:nth-child(9) {
  grid-area: 4 / 2;
}
.grid-item:nth-child(10) {
  grid-area: 4 / 1;
}
.grid-item:nth-child(11) {
  grid-area: 3 / 1;
}
.grid-item:nth-child(12) {
  grid-area: 2 / 1;
}

.grid-item {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 120rpx;
  height: 120rpx;
  overflow: hidden;
  border: 6rpx solid transparent;
  border-radius: 24rpx;
  background: #00000049;
}

.grid-item.highlight {
  border-color: #FFF7AB; /* 高亮显示的样式 */
}

.prize-image {
  width: 100%;
  height: 100%;
}

.prize-text {
  position: absolute;
  bottom: 0;
  left: 0;
  text-align: center;
  width: 100%;
  background: #00000050;
  height: 38rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  font-weight: 500;
  font-size: 20rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lottery-button {
  grid-area: 2 / 2 / 4 / 4; /* 占据中间2x2区域 */
  width: 256rpx;
  height: 256rpx;
  background-color: transparent;
  color: white;
  font-size: 16px;
  text-align: center;
  border-color: transparent;
  line-height: 100px;
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.zj_zs_box {
  background-color: rgba(0, 0, 0, 0.1);
  // background-color: transparent;
  border-radius: 12rpx;
  position: absolute;
  width: 366rpx;
  top: 117vw;
  height: 6vw;
  left: 8vw;
  right: 8vw;
  margin: auto;
}
.look_log {
  background: #6fd727;
  margin: 32rpx auto;
  border-radius: 100rpx;
  border-bottom: 6rpx solid #212121;
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  line-height: 1;
  padding: 24rpx 60rpx;
}
.rule-bg {
  padding: 0 32rpx;
  padding-bottom: 24rpx;
  background: #FFE3A5;
  padding-top: 260rpx;
}
.rule_box {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 32rpx 48rpx;
  margin: auto;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 32rpx;
  overflow: hidden;
  background: #FF7C22;
  .rule_box_title {
    color: #FFFFFF80;
    display: inline-block;
    font-size: 32rpx;
    font-weight: 600;
    line-height: 1;
    padding: 24rpx 0rpx;
  }
  .rule_box_content {
    // margin-top: 40rpx;
    display: block;
    font-size: 28rpx;
    line-height: 1.6;
    padding-bottom: 20rpx;
    color: #FFFFFF;
  }
}
.zj_box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 24rpx;
  box-sizing: border-box;
  // background: #FFFFFF;
  
  // border-radius: 16rpx;
  border-radius: 0px;
  .zj_img {
    width: 204rpx;
    height: 204rpx;
  }
  .zj_str {
    padding: 24rpx 12rpx;
    font-size: 32rpx;
    color: #010101;
  }
  .zj_btn {
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 88rpx;
    font-weight: bold;
    border-radius: 24rpx;
    color: #000;
    font-size: 34rpx;
  }
}

:deep .fui-modal__inner {
    // background:theme('colors.neutral.cardBg') !important;
    border-radius: 24rpx !important;
    // border: 1px solid rgba(255, 255, 255, 0.10) !important;
    // 方法2：通过深度选择器设置渐变色背景（如果使用此方法，需要移除 background prop）
    // background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

// 小卡片样式
.small-card {
  position: relative;
  border-radius: 12rpx;
  transition: all 0.3s;
}

.small-card:active {
  transform: scale(0.95);
}

.small-card-image {
  width: 80rpx;
  height: 80rpx;
}

.card-count-badge {
  position: absolute;
  top: -8rpx;
  min-width: 32rpx;
  height: 32rpx;
  right: -8rpx;
  background-color: #ff4d4f;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 360px;
  border: 0.5px solid #f6d875;
  background: linear-gradient(0deg, #FFEACC 0%, #FFE3A5 51.8%), #FFE3A5;
  background-blend-mode: soft-light, normal, normal;
}

.card-count-badge text {
  color: #fff;
  font-size: 20rpx;
  font-weight: bold;
}
</style>
