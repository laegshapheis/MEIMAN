<template>
  <layout
    navTitle=""
    :bgType="bgType"
    ref="layoutRef"
    mode="white"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <z-swiper
      ref="mySwiper"
      class="my-[98rpx] h-[276rpx]"
      v-model="vip_icons"
      slidesPerView="auto"
      centeredSlides
      :spaceBetween="30"
      grabCursor
      @slideChange="onChange"
    >
      <z-swiper-item v-for="(item, index) in vip_icons" :key="index" :custom-style="{width:'276rpx'}">
        <view class="flex justify-center items-center">
          <image
            class="h-[200rpx] w-[240rpx]"
            :class="[
              index === activeIndex
                ? 'opacity-100 scale-[1]'
                : 'opacity-50 scale-[0.8]',
            ]"
            :src="item"
            mode="widthFix"
          >
          </image>
        </view>
        
      </z-swiper-item>
    </z-swiper>

    <view class="px-[32rpx] -mt-[180rpx] mb-[32rpx]">
          <image
            :src="`/static/images/user/vip/line_${activeIndex}.png`"
            mode="widthFix"
            class="w-full h-[97px]"
          />
    </view>
    
    <view class="px-[32rpx] pb-[24rpx] box-border w-full -mt-[20rpx]">
      <view class="rounded-[32rpx] relative p-[32rpx] mt-[16rpx]" :style="`background: ${cardBackground};`">
        <view class="flex flex-col">
          <!-- <view
            class="mb-[10rpx] text-neutral-white text-base flex flex-row items-center justify-between"
          >
            <text class="text-base">您已单笔最大充值</text>
            <text class="text-base font-medium">
              {{ " " + single_recharge_amount + " " }} {{ symbolStore.code }}
            </text>
          </view> -->
          <view
            class="mb-[10rpx] text-white/50 text-base flex flex-row items-center justify-between"
            style="border-bottom: 1rpx solid #FFFFFF1A;"
          >
            <text>您当前的等级</text>
            <view
              class="text-neutral-white text-base flex-row items-center justify-between pb-[16rpx]"
            >
              <image
                src="/static/images/vip/vip_icon.svg"
                mode="widthFix"
                class="w-[32rpx] h-[32rpx] mr-[4rpx]"
              />
              {{ level }}
            </view>
          </view>
          <view
            class="mb-[10rpx] text-neutral-white text-base flex flex-row items-center justify-between pb-[16rpx]"
            style="border-bottom: 1rpx solid #FFFFFF1A;"
          >
            <text class="text-base text-white/50">您已累计投资</text>
            <text class="text-base font-medium">
              {{ " " + buymoney + " " }} {{ symbolStore.code }}
            </text>
          </view>
          <view
            v-if="mylevel && mylevel === lastlevel"
            class="text-neutral-white text-lg font-medium mt-[10rpx] text-center"
          >
            恭喜您已达到最高等级！
          </view>
          <view v-else>
            <view
              class="mb-[10rpx] text-neutral-white text-base flex flex-row items-center justify-between pb-[16rpx]"
              style="border-bottom: 1rpx solid #FFFFFF1A;"
            >
              <text class="text-base text-white/50"> 距离升级还需投资 </text>
              <template v-if="list.length != 0">
                <text v-if="mylevel == lastlevel" class="text-base font-medium">
                  {{ " 0 " }} {{ symbolStore.code }}
                </text>
                <text v-else class="text-base font-medium">
                  {{ " " + touzi + " " }} {{ symbolStore.code }}
                </text>
              </template>
              <text v-else class="text-base font-medium">
                {{ " " + touzi + " " }} {{ symbolStore.code }}
              </text>
            </view>
            <!-- <view
              class="mb-[10rpx] text-neutral-black text-base flex flex-row items-center justify-between"
            >
              <text class="text-base"> 距离升级还需单笔最大充值</text>
              <template v-if="list.length">
                <text v-if="mylevel == lastlevel" class="text-base font-medium">
                  {{ " 0 " }} {{ symbolStore.code }}
                </text>
                <text v-else class="text-base font-medium">
                  {{ " " + single_recharge_amount }} {{ symbolStore.code }}
                </text>
              </template>
              <text v-else class="text-base font-medium">
                {{ " " + single_recharge_amount + " " }} {{ symbolStore.code }}
              </text>
            </view> -->
            <view
              v-if="config.member_next === 1"
              class="mb-[10rpx] text-neutral-white text-base flex flex-row items-center justify-between"
            >
              <text class="text-base text-white/50"> 距离升级还需 </text>
              <template v-if="list.length">
                <text v-if="mylevel == lastlevel" class="text-base font-medium">
                  {{ " 0 个一级有效人数" }}
                </text>
                <text v-else class="text-base font-medium">
                  {{ " " + number }} 个一级有效人数
                </text>
              </template>
              <text v-else class="text-base font-medium">
                {{ " " + number + " 个一级有效人数" }}
              </text>
            </view>
            <view
              v-if="config.member_next == 1"
              class="mt-[16rpx] text-neutral-white rounded-full py-1 px-2 text-sm bg-[#FFFFFF]/20"
            >
              <text class="flex-1 text-sm">单个一级会员需投资</text>
              <text class="text-sm mx-[4rpx] text-[#98EDFB]">{{
                invite_min_invest_amount
              }}</text>
              <text class="text-sm mr-[4rpx] text-[#98EDFB]">{{
                symbolStore.code
              }} </text>
              <text class="flex-1 text-sm">才能成为有效人数</text>
            </view>
          </view>
        </view>
        <view class="flex flex-row mt-[32rpx] justify-between">
          <view
            class="mr-[16rpx] px-[24rpx] py-[8rpx] rounded-[66rpx] btn-bg"
            @click="navigateTo(routes.accountDetails)"
          >
            <text class="text-base">投资记录</text>
          </view>
          <view
            class="mr-[16rpx] px-[24rpx] py-[8rpx] rounded-[66rpx] btn-bg"
            @click="openTips('vipshuoming')"
          >
            <text class="text-base">升级/降级机制</text>
          </view>
          <view
            class="px-[24rpx] py-[8rpx] rounded-[66rpx] btn-bg"
            @click="navigateTo(routes.promoRecord)"
          >
            <text class="text-base">我的团队</text>
          </view>
        </view>
      </view>
      <view class="flex flex-col items-center mt-6">
        <view class="text-lg font-medium flex flex-row items-center mb-6">
          <image
            class="w-[24rpx] h-[24rpx]"
            src="/static/images/user/hy_level.svg"
            mode="widthFix"
          />
          <text class="text-neutral-theme mx-2 gradient-text"> 会员等级奖励 </text>
          <image
            class="w-[24rpx] h-[24rpx]"
            src="/static/images/user/hy_level.svg"
            mode="widthFix"
          />
        </view>
        <view v-if="list.length !== 0" class="w-full">
          <view
            class="flex flex-col p-[32rpx] mb-[32rpx] rounded-[24rpx] bg-[#FFFFFF]"
            v-for="item in mylevel && mylevel === lastlevel
              ? [list[list.length - 1]]
              : list"
            :key="item.id"
          >
            <view class="flex flex-row items-center justify-center mb-[20rpx]">
              <image
                class="w-[32rpx] h-[32rpx] mr-[10rpx]"
                src="/static/images/user/vip_title_icon.svg"
                mode="widthFix"
              />
              <text class="gradient-text text-lg">{{ item.name }}</text>
            </view>
            <view class="flex flex-col text-sm">
              <template v-for="reward in rewards" :key="reward.key">
                <view
                  class="w-full flex flex-row items-start mb-[20rpx]"
                  v-if="config[reward.configKey] === 1"
                >
                  <view
                    :style="`width: ${
                      reward.labelWidth ? reward.labelWidth : '220rpx'
                    }`"
                    class="text-[#8C3400CC] text-base flex flex-row items-center"
                    @click="reward.action && reward.action()"
                  >
                    <text class="text-[#8C3400CC]">{{ reward.label }}</text>
                    <uv-icon
                      v-if="reward.labelIcon"
                      class="w-[30rpx] h-[30rpx] ml-[4rpx]"
                      name="question-circle"
                      size="14"
                      color="#FFFFFF50"
                    />
                  </view>
                  <view class="flex flex-col flex-1 text-right justify-end">
                    <text class="text-[#8C3400CC] text-base font-medium">
                      {{ reward.value(item, config) }}
                    </text>
                    <text class="text-base text-[#8C3400CC]">
                      {{ reward.descKey ? config[reward.descKey] : "" }}
                    </text>
                  </view>
                </view>
                <view
                  v-if="
                    config[reward.configKey] === 1 &&
                    index !== rewards.length - 1
                  "
                  class="w-full mb-[15rpx]"
                  style="border-bottom: 0.5px dashed rgba(255, 255, 255, 0.50);"
                ></view>
              </template>
            </view>
            <view class="p-[32rpx] rounded-[16rpx] bg-[#F0EAE2] mt-[48rpx]">
              <view
                class="text-base font-medium text-center text-[#8C3400CC]"
                v-if="mylevel && mylevel === lastlevel"
              >
                恭喜您已达到最高等级！
              </view>
              <template v-else>
                <view class="mb-[16rpx] text-neutral-black text-base flex">
                  同时满足以下2个条件即可升级
                </view>
                <view class="flex items-center"
                style="border-bottom: 0.5px dashed rgba(255, 255, 255, 0.50);">
                  <text class="text-[#8C3400CC] text-base font-medium px-[8rpx] py-[4rpx] rounded-[8rpx]"
                  style="background: linear-gradient(0deg, #FFF2E6 0%, #FFF2E6 100%), #FD9227;">条件1</text>
                  <view class="text-[#8C3400CC]">
                    <text class="text-base font-medium ml-[20rpx]">个人累计投资</text>
                    <text class="ml-1.5 text-base font-medium">
                      {{ item.selfmoney }} {{ symbolStore.code }}</text>
                  </view>
                  
                </view>
                <view class="flex items-center mt-2.5" v-if="config.member_next == 1" 
                style="border-bottom: 0.5px dashed rgba(255, 255, 255, 0.50);">
                  <text
                    class="text-[#8C3400CC] text-base font-medium px-[8rpx] py-[4rpx] rounded-[8rpx]"
                    style="background: linear-gradient(0deg, #FFF2E6 0%, #FFF2E6 100%), #FD9227;">条件2</text>
                  <view class="text-[#8C3400CC]">
                  <text class="text-base font-medium ml-[20rpx]">直推一级有效人数</text>
                    <text class="ml-1.5 text-base font-medium">
                      {{ item.inte }} 人</text>
                  </view>
                </view>
                <view class="flex items-center mt-2.5" v-if="config.member_single_recharge_amount == 1"
                style="border-bottom: 0.5px dashed rgba(255, 255, 255, 0.50);">
                  <text class="text-[#8C3400CC] text-base font-medium px-[8rpx] py-[4rpx] rounded-[8rpx]"
                  style="background: linear-gradient(0deg, #FFF2E6 0%, #FFF2E6 100%), #FD9227;">条件2</text>
                  <view class="text-[#8C3400CC]">
                    <text class="text-base font-medium ml-[20rpx]">单笔充值</text>
                    <text class="ml-1.5 text-base font-medium">
                      {{ item.single_recharge_amount }} {{ symbolStore.code }}</text>
                  </view>
                </view>

              </template>
            </view>
          </view>
        </view>
      </view>
    </view>
    <wk-modal ref="wkPopupRef" title="说明">
      <uv-parse
        :show-img-menu="false"
        container-style="white-space: pre-wrap"
        :content="strings"
      ></uv-parse>
    </wk-modal>
    <!-- <wk-loading v-if="loading" :loadingText="loadingText" /> -->
  </layout>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getMemberlevel } from "@/api/user";
import { navigateTo } from "@/utils/navigation";
import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";
import { cacheManager } from "@/utils/cacheManager";
import { vipIcons } from "./data";

const cacheData = cacheManager.getCache("membershipLevel");
const symbolStore = useSymbolStore();
// VIP图标数组
const vip_icons = computed(() => {
  return list.value.map(item => vipIcons.find(val => val.id === item.id)?.icon);
});
const levelIcon = computed(() => {
  return vipIcons.find(item => item.id === levelid.value)?.icon;
});

// 奖励 配置
const rewards = computed(() => {
  return [
    {
      key: "rate",
      configKey: "always_show",
      label: "叠加利率",
      labelWidth: "180rpx",
      labelIcon: "/static/images/user/vip_help.svg",
      value: (item) => `${item.rate}%`,
      action: () => {
        openTips("vip_diejia_rate");
      },
    },
    {
      key: "yuebao_rate",
      configKey: "member_yuebao_rate",
      label: "余额宝利率",
      value: (item) => `${item.yuebao_rate}%`
    },
    {
      key: "pipelinelist",
      configKey: "member_pipeline",
      label: "管道收益",
      labelWidth: "180rpx",
      labelIcon: "/static/images/user/vip_help.svg",
      value: (item) => {
        return item.pipelinelist
          .map((item) => {
            return item;
          })
          .join(" ");
      },
      action: () => {
        openTips("vip_pipeline_income");
      },
    },
    {
      key: "daysalary",
      configKey: "member_daysalary",
      label: "每日额外奖励",
      descKey: "member_time",
      value: (item) => `${item.daysalary} ${symbolStore.code}`,
    },
    {
      key: "salary",
      configKey: "member_salary",
      descKey: "member_salarydata",
      label: "每月领取工资",
      value: (item) => `${item.salary} ${symbolStore.code}`,
    },
    {
      key: "daymoeny",
      configKey: "member_qiandao",
      label: "每日签到奖励",
      value: (item) => `${item.daymoeny} ${symbolStore.code}`,
    },
    {
      key: "lianxumoeny",
      configKey: "member_lxqiandao",
      label: "连续签到奖励",
      value: (item, config) =>
        `连续签到${config.member_lxqday}天奖励 ${item.lianxumoeny} ${symbolStore.code}`,
    },
    {
      key: "resign_times",
      configKey: "member_resign_switch",
      label: "每月补签次数",
      labelIcon: "/static/images/user/vip_help.svg",
      value: (item) => `${item.resign_times} 次`,
      action: () => {
        openTips("resign_rule");
      },
    },
    {
      key: "free_lottery",
      configKey: "member_free_lottery",
      label: "幸运转盘次数",
      value: (item) => `${item.free_lottery} 次`,
    },
  ];
});
const strings = ref("");
const level = ref("");
const levelid = ref("");
const mylevel = ref("");
const lastlevel = ref("");
const touzi = ref("");
const buymoney = ref(0);
const number = ref(0);
const selfnumber = ref(0);
const single_recharge_amount = ref(0);
const invite_min_invest_amount = ref(0);
const wkPopupRef = ref(null);
const loading = ref(false);
const result = ref({});
const config = reactive({
  always_show: 1,
  member_daysalary: 0,
  member_resign_switch: 0,
  member_next: 0,
  member_qiandao: 0,
  member_lxqiandao: 0,
  member_salary: 0,
  member_salarydata: 0,
  member_lxqday: 0,
});

const list = ref([]);

const activeIndex = ref(0);
const mySwiper = ref(null);
const layoutRef = ref(null);
const loadingText = ref("");
const handleRefresh = async () => {
  await getmMemberlevel();
  layoutRef.value.complete();
};

// 方法
watch(level, (newVal) => {
  list.value.map((item, index) => {
    if (item.name === newVal) {
      mySwiper.value && mySwiper.value.swiper.slideTo(index);
    }
  });
});
const openTips = (type) => {
  strings.value = result.value[type];
  wkPopupRef.value.open();
};

const getmMemberlevel = async () => {
  if (loading.value) return;
  loading.value = true;
  loadingText.value = "加载中...";
  try {
    const res = await getMemberlevel();
    level.value = res.level;
    levelid.value = res.levelid;
    handleResData(res);
    cacheManager.setCache("membershipLevel", res);
  } catch (error) {
    console.error("请求失败", error);
    loading.value = false;
  }
};
const handleResData = (res) => {
  console.log(res);
  result.value = res;
  mylevel.value = res.mylevel;
  touzi.value = res.touzi;
  buymoney.value = res.buymoney;
  number.value = res.number;
  single_recharge_amount.value = res.single_recharge_amount;
  selfnumber.value = res.selfnumber;
  lastlevel.value = res.lastlevel;
  list.value = res.list;
  invite_min_invest_amount.value = res.invite_min_invest_amount;
  Object.assign(config, res.config);
  loading.value = false;
};
onLoad(() => {
  if (cacheData) {
    handleResData(cacheData);
  }
  getmMemberlevel();
});

const bgType = computed(() => {
  const index = activeIndex.value + 1; // activeIndex从0开始，图片从01开始
  return `bg-vip-bg${String(index).padStart(2, '0')}`;
});

// 根据activeIndex动态计算背景渐变
const cardBackground = computed(() => {
  const gradients = {
    0: 'linear-gradient(180deg, #2755ED 0%, #3C6BEC 100%)',
    1: 'linear-gradient(180deg, #0071BD 0%, #008ED4 100%)',
    2: 'linear-gradient(180deg, #EF4200 0%, #F07800 100%)',
    3: 'linear-gradient(180deg, #E31F2A 0%, #E34418 100%)',
    4: 'linear-gradient(180deg, #002DF3 0%, #0079F2 100%)',
    5: 'linear-gradient(128deg, rgba(20, 149, 255, 0.28) 6.32%, rgba(0, 45, 112, 0.00) 45.17%, rgba(56, 100, 219, 0.33) 85.54%), linear-gradient(180deg, #101B5E 0.13%, #000E38 96.99%)',
    6: 'linear-gradient(128deg, rgba(173, 20, 255, 0.28) 6.32%, rgba(0, 5, 58, 0.00) 45.17%, rgba(203, 56, 219, 0.33) 85.54%), linear-gradient(180deg, #2B105E 0.13%, #0D0038 96.99%)',
    7: 'linear-gradient(227deg, rgba(255, 178, 45, 0.00) 19.29%, rgba(5, 94, 145, 0.40) 100.94%), linear-gradient(127deg, rgba(33, 58, 255, 0.58) 6.37%, rgba(0, 5, 58, 0.00) 53.67%, rgba(87, 49, 255, 0.68) 102.83%), linear-gradient(180deg, #2B105E 0.13%, #0D0038 96.99%)'
  };
  return gradients[activeIndex.value] || gradients[0];
});

// 修改切换处理函数
const onChange = (swiper) => {
  activeIndex.value = swiper.activeIndex;
};
</script>

<style lang="scss" scoped>
.vip-bg {
  background: var(
    --card_color,
    linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%),
    linear-gradient(256deg, #27395b 16.29%, #0c1838 92.09%)
  );
}
.bg-membership-gradient {
  border-radius: 66rpx;
  background: linear-gradient(90deg, #fbf6ef 0%, #f9d7c5 100%);
}
.vip-title {
  background: linear-gradient(358deg, #b27a5a 16.95%, #f9e0d1 81.2%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.custom-gradient {
  border-radius: var(--radius-m, 8px);
  background: #d2c5c5;
}
.level-text {
  background: var(
    --Linear,
    linear-gradient(358deg, #f7c3aa 16.95%, #fbf9f3 81.2%)
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.tj-bg {
  background: linear-gradient(90deg, #fbf6ef 0%, #f9d7c5 100%);
}
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.text-bg {
  color: theme('colors.neutral.DEFAULT');
}
.gradient-text {
  background: linear-gradient(110deg, #897D5B 6.48%, #C7A487 83.04%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.btn-bg{
  background: transparent;
  border: 1rpx solid #FFFFFF;
  color:#FFFFFF;
}
.title-bg {
  background: url('/static/images/bg/title_bg.png') no-repeat center center;
  background-size: 100% 100%;
}
</style>
