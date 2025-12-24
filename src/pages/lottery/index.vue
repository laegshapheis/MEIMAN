<template>
  <layout navTitle="" bgType="bg-main5" mode="black" :isLottie="false">
    <template v-slot:navRight>
      <view
        class="flex flex-row w-full items-center justify-end px-[16rpx] py-[4rpx] rounded-[24rpx]"
        @click="goLotteryRecord()"
      >
        <text class="text-sm mr-[2rpx] text-white">中奖记录</text>
      </view>
    </template>

    <!-- 背景图片 -->
    <view class="lottery-bg-container">
      <image
        src="/static/images/lottery/lottery_bg.png"
        class="lottery-bg-image"
        mode="aspectFill"
      ></image>
    </view>

    <!-- 内容区域 => 开始 -->
    <view class="lottery-container relative z-10">
      <view class="flex flex-col justify-center items-center relative z-10 px-[32rpx] relative h-[200rpx]">
        <!-- <text class="text-[3em] font-bold">幸运大抽奖</text> -->
        <!-- <image
          class="w-[390rpx] mt-[200rpx] z-0"
          src="/static/images/index/lottery_title_icon.png"
          mode="widthFix"
        ></image> -->
        <image
          class="w-[440rpx] absolute top-[66rpx]  z-1"
          src="/static/images/index/lottery_title_bg.png"
          mode="widthFix"
        ></image>
      </view>
      <view class="flex justify-center items-center relative z-10 top-[180rpx] left-[10rpx] z-0">
        <view class="ci_shu text-neutral-black rounded-b-[0rpx]">今日剩余抽奖次数：{{ remain_count }}</view>
      </view>
      <view class="grid-container relative -mt-[150rpx]">
        <c-lottie
          class="absolute top-0 left-0 w-full h-[1030rpx]"
          renderer="svg"
          :data="bgLotteryData"
          :loop="true"
          :autoPlay="true"
          width="100%"
          height="1030rpx"
        ></c-lottie>
        <!-- 奖项1 -->
         <view class="grid-container-inner relative top-[306rpx] left-[10rpx]">
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

          <view v-if="prizes.length > 0" class="grid-item lottery-button relative">
            <c-lottie
              @click="startLottery"
              class="w-[256rpx] h-[256rpx]"
              renderer="svg"
              :data="lotteryBtnData"
              :loop="true"
              :autoPlay="true"
              width="256rpx"
              height="256rpx"
            ></c-lottie>
            <image
              src="/static/images/lottery/lottery_go.png"
              class="lottery-go-image"
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
        class="z-10 relative px-[32rpx] py-[16rpx] inline-block rounded-full absolute top-[316rpx] left-[50%] translate-x-[-50%]"
        style="background: rgba(37, 44, 47, 0.15);"
      >
        <view class="text-white text-sm">可用积分 <text class="ml-[8rpx]">{{ user_jifen }}</text></view>
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

    <fui-modal :buttons="[]" :boxRadius="0" width="400" :show="zjShow">
      <view class="zj_box">
        <!-- 关闭按钮 -->
        <view class="zj_close_btn" @click="zjShow = false">×</view>
        
        <!-- 顶部机器人图标 -->
        <image 
          class="zj_robot_icon"
          src="/static/images/lottery/robot_icon.png"
          mode="aspectFit"
        ></image>
        
        <!-- 白色内容面板 -->
        <view class="zj_content_panel">
          <!-- 标题 -->
          <view class="zj_title">恭喜获得</view>
          
          <!-- 奖品名称 -->
          <view class="zj_prize_name">{{ zjObj.name }}</view>
          
          <!-- 奖品图片 -->
          <view class="zj_image_container">
            <image 
              class="zj_img" 
              :src="zjObj.img" 
              mode="aspectFit"
            ></image>
          </view>
          
          <!-- 用户信息 -->
          <!-- <view class="zj_user_info">
            <view class="zj_info_item">{{ userAddress.name_mask || '暂无姓名' }}</view>
            <view class="zj_info_item">{{ userAddress.phone_mask || '暂无电话' }}</view>
            <view class="zj_info_item zj_address">{{ hasAddress ? `${userAddress.location || ''} ${userAddress.address || ''}`.trim() : '暂无地址' }}</view>
          </view> -->
          
          <!-- 更换地址链接 -->
          <!-- <view class="zj_change_address" @click="handleChangeAddress">
            <text class="zj_change_text">{{ hasAddress ? '更换地址 >' : '选择收货地址' }}</text>
          </view> -->
          
          <!-- 说明文字 -->
          <!-- <view class="zj_tips">
            关于赠品的礼品,请稍候前往「商城」-「兑换记录」查看详情/兑换规则
          </view>
           -->
         
        </view>
        <!-- 保存按钮 -->
       <wk-button 
            @click="handleSavePrize" 
            class="zj_save_btn"
            type="gradient-lottery"
          >
            我知道了
          </wk-button>
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
import { getDefaultAddress } from "@/api/user";
import { getCardListApi } from "@/api/activity";
import { cacheManager } from "@/utils/cacheManager";
import bgLotteryData from "@/static/images/lottery/bg_lottery.json";
import lotteryBtnData from "@/static/images/lottery/lottery_btn.json";
// 响应式状态
const zjShow = ref(false);
const zjObj = ref({
  id: "",
  img: "",
  name: "",
  prize: "",
});
const userAddress = ref({
  name_mask: "",
  phone_mask: "",
  area_code: "",
  location: "",
  address: "",
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

// 判断是否有地址
const hasAddress = computed(() => {
  return userAddress.value.location || userAddress.value.address;
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
        // 获取默认地址
        getDefaultAddressInfo();
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

// 获取默认地址信息
const getDefaultAddressInfo = async () => {
  try {
    // 从 localStorage 读取 addressList
    const addressListStr = uni.getStorageSync('addressList');
    if (!addressListStr) {
      userAddress.value = {};
      return;
    }

    const addressListData = JSON.parse(addressListStr);
    const addressData = addressListData.data;
    
    // 检查数据是否有效
    if (!addressData || !addressData.list || addressData.list.length === 0) {
      userAddress.value = {};
      return;
    }

    // 查找默认地址 (is_default === 1)
    const defaultAddress = addressData.list.find(item => item.is_default === 1);
    
    if (defaultAddress) {
      userAddress.value = {
        name_mask: defaultAddress.name_mask || "",
        phone_mask: defaultAddress.phone_mask || "",
        area_code: defaultAddress.area_code || "",
        location: defaultAddress.location || "",
        address: defaultAddress.address || "",
      };
    } else {
      userAddress.value = {};
    }
  } catch (error) {
    console.error("获取默认地址失败", error);
    userAddress.value = {};
  }
};

// 更换地址
const handleChangeAddress = () => {
  zjShow.value = false;
  uni.navigateTo({
    url: routes.address + "?isChoice=1",
  });
};

// 保存奖品
const handleSavePrize = () => {
  zjShow.value = false;
  // 可以在这里添加保存逻辑
};

// 页面显示时初始化
onShow(() => {
  init();
});
</script>

<style lang="scss">
.lottery-bg-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.lottery-bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

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
  min-width: 300rpx;
  display: inline-block;
  color: #ffffff;
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
  border: 6rpx solid #33396F;
  border-radius: 24rpx;
  background: #ffffff;
}

.grid-item.highlight {
  border-color: #FF6B75; /* 高亮显示的样式 */
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
  background: #0C052F;
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

.lottery-go-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 76px;
  height: 34px;
  pointer-events: none;
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
  padding-top: 360rpx;
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
  border: 3rpx solid #202337;
  background: #0C052F;
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
  width: 566rpx;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  background-image: url('/static/images/lottery/lottery_nodel_bg.png');
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 32rpx;
  padding: 200rpx 32rpx 32rpx;
  min-height: 600rpx;
}

// 关闭按钮
.zj_close_btn {
  position: absolute;
  top: -20rpx;
  right: -20rpx;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #FFFFFF;
  z-index: 20;
  cursor: pointer;
}

// 顶部机器人图标
.zj_robot_icon {
  position: absolute;
  top: -60rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 120rpx;
  height: 120rpx;
  z-index: 10;
}

// 白色内容面板
.zj_content_panel {
  width: 100%;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 48rpx 32rpx 32rpx;
  box-sizing: border-box;
  margin-top: 20rpx;
}

// 标题
.zj_title {
  font-size: 48rpx;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(46deg, #7884FF 30%, #B97CFF 75.25%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

// 奖品名称
.zj_prize_name {
  font-size: 32rpx;
  color: #010101;
  text-align: center;
  font-weight: 500;
}

// 图片容器
.zj_image_container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32rpx;
  min-height: 180rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
}

.zj_img {
  width: 180rpx;
  height: 180rpx;
  object-fit: contain;
}

// 用户信息
.zj_user_info {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 24rpx;
  padding: 0 32rpx;
}

.zj_info_item {
  font-size: 28rpx;
  color: #010101;
  line-height: 1.5;
  word-break: break-all;
}

.zj_address {
  color: #010101;
  word-break: break-all;
  max-height: 80rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
}

// 更换地址
.zj_change_address {
  display: flex;
  justify-content: center;
  margin-bottom: 24rpx;
}

.zj_change_text {
  font-size: 28rpx;
  color: #299DF6;
  cursor: pointer;
}

// 说明文字
.zj_tips {
  font-size: 24rpx;
  color: rgba(37, 44, 47, 0.50);
  line-height: 1.6;
  text-align: center;
}

// 保存按钮
.zj_save_btn {
  width: 100%;
  margin-top: 20rpx;
}

:deep .fui-modal__inner {
    background: transparent !important;
    border-radius: 24rpx !important;
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
