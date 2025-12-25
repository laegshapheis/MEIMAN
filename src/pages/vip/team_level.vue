<template>
  <layout
    navTitle="团队等级"
    bgType="team-level"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
  >
    <!-- 动态背景层 -->
    <!-- <view 
      class="fixed inset-0">
    </view> -->
    <z-swiper
      ref="swiperRef"
      class="my-[16rpx] h-[320rpx] relative z-10"
      v-model="vip_icons"
      @slideChange="onChange"
      slidesPerView="auto"
      centeredSlides
      :spaceBetween="-30"
      grabCursor
    >
      <z-swiper-item v-for="(item, index) in vip_icons" :key="index" :custom-style="{width:'320rpx'}">
        <view class="flex flex-col justify-end items-center relative">
          <image
            class="w-[240rpx] h-[208rpx] mt-[80rpx]"
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
    <!-- <view class="px-[32rpx] -mt-[60rpx] mb-[32rpx] relative z-10">
          <image
            :src="lineImage"
            mode="widthFix"
            class="w-full"
          />
    </view> -->
    <view class="relative pb-[24rpx] box-border w-full z-10">
      <view
        class="rounded-[32rpx] box-border relative p-[32rpx] mx-[32rpx] flex flex-col justify-between"
        :style="{ background: cardBackgroundGradient }"
      >
        <view
          class="mb-[16rpx] flex flex-row w-full items-center justify-between"
        >
          <text class="text-base text-neutral-white">您当前的等级</text>
          <view class="text-lg flex flex-row items-center text-neutral-white">
            <image
              :src="levelIcon"
              mode="widthFix"
              class="w-[48rpx] h-[48rpx] mr-[4rpx]"
            />
            {{ Currentlevel.agentname }}
          </view>
        </view>
        <view
          class="mb-[32rpx] bg-white/20 rounded-[16rpx] box-border p-[10rpx] flex flex-row w-full items-center justify-between"
        >
          <view class="text-sm text-white/70">
            温馨提示：如果各项数据都显示已达标，等级却没有更新，请点击
            “我的团队”
            即可更新等级状态

          </view>
        </view>
        <view class="flex flex-row justify-between">
          <view
            @click="navigateTo(routes.promoRecord)"
            class="px-[32rpx] py-[10rpx] rounded-[66rpx] border-[length:2rpx] border-solid border-[#FFF] bg-[transparent]"
          >
            <text class="text-base text-neutral-white">我的团队</text>
          </view>
          <view
            @click="openTips"
            class="px-[32rpx] py-[10rpx] mx-[16rpx] rounded-[66rpx] border-[length:2rpx] border-solid border-[#FFF] bg-[transparent]"
          >
            <text class="text-base text-neutral-white">规则说明</text>
          </view>
          <view
            @click="jumpJiangli"
            class="px-[32rpx] py-[10rpx] rounded-[66rpx] border-[length:2rpx] border-solid border-[#FFF] bg-[transparent]"
          >
            <text class="text-base text-neutral-white">查看奖励</text>
          </view>
        </view>
      </view>

      <view class="bg-[#F6FAFE] rounded-t-[32rpx] p-[32rpx] mt-[32rpx]">
        <view
          class="text-lg font-medium flex flex-row items-center my-[48rpx] mt-[16rpx] justify-center"
        >
          <image
            class="w-[24rpx] h-[24rpx]"
            src="/static/images/user/hy_level_black.svg"
            mode="widthFix"
          />
          <text class="mx-2 text-xl"> 升级评估 </text>
          <image
            class="w-[24rpx] h-[24rpx]"
            src="/static/images/user/hy_level_black.svg"
            mode="widthFix"
          />
        </view>
        <view class="flex-col fb-align-center">
          <view
            v-if="list.length && lastteams === list[list.length - 1]['id']"
            class="text-neutral-warning text-xl font-medium mb-[20rpx] text-center"
          >
            您已升级到最高等级！
          </view>
          <view class="flex flex-col w-full">
            <template v-for="item in teamLevelItems" :key="item.title">
              <teamLevelItem
                v-if="config[item.configKey] == 1"
                :title="item.titleKey ? nextlevel[item.titleKey] : item.title"
                :unit="item.unit"
                :levelReq="nextlevel[item.levelReqKey]"
                :levelGap="
                  nextlevel[item.levelReqKey] > Currentlevel[item.currentValueKey]
                    ? (nextlevel[item.levelReqKey] * 100 -
                        Currentlevel[item.currentValueKey] * 100) /
                      100
                    : '已达标'
                "
                :currentValue="Currentlevel[item.currentValueKey]"
              />
            </template>
          </view>
        </view>
    </view>
    </view>
    <!-- 规则弹出层 -->
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
import { navigateTo } from "@/utils/navigation";
import teamLevelItem from "./components/team-level-item.vue";
import { ref, reactive, computed, watch } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { getMemberteams } from "@/api/user";
import { routes } from "@/config/routes";
import { useSymbolStore } from "@/stores/symbolStore";
import { cacheManager } from "@/utils/cacheManager";
import { teamIcons } from "./data";

const cacheData = cacheManager.getCache("teamLevel");
const symbolStore = useSymbolStore();
const loading = ref(false);
const loadingText = ref("");
// VIP图标数组
const vip_icons = computed(() => {
  console.log('list', list.value)
  return list.value.map(item => teamIcons.find(val => val.id === item.id)?.icon);
});
const levelIcon = computed(() => {
  return teamIcons.find(item => item.id === teams_levelid.value)?.icon;
});

const teamLevelItems = computed(() => {
  return [
    // 推荐人数
    {
      configKey: "teams_teamsinviters", // 从config字段取值，控制是否显示
      titleKey: "teamsinviters_name", // 推荐人数
      unit: "人",
      levelReqKey: "teamsinviters", // 升级要求，从nextlevel字段取值
      currentValueKey: "teamsinviters", // 当前统计，从Currentlevel字段取值
    },
    {
      configKey: "teams_teamsperformance", // 从config字段取值，控制是否显示
      title: "团队总业绩", // 标题
      unit: symbolStore.code, // 单位
      levelReqKey: "teamsperformance", // 升级要求，从nextlevel字段取值
      currentValueKey: "teamsperformance", // 当前统计，从Currentlevel字段取值
    },
    {
      configKey: "teams_selfmoney", // 从config字段取值，控制是否显示
      title: "个人累计投资", // 标题
      unit: symbolStore.code, // 单位
      levelReqKey: "selfmoney", // 升级要求，从nextlevel字段取值
      currentValueKey: "selfmoney", // 当前统计，从Currentlevel字段取值
    },
    {
      configKey: "teams_teameffectiveuser", // 从config字段取值，控制是否显示
      title: "团队有效人数", // 标题
      unit:  "人", // 单位
      levelReqKey: "teameffectiveuser", // 升级要求，从nextlevel字段取值
      currentValueKey: "teameffectiveuser", // 当前统计，从Currentlevel字段取值
    },
    {
      configKey: "teams_teampositions", // 从config字段取值，控制是否显示
      title: "团队持仓金额", // 标题
      unit:  symbolStore.code, // 单位
      levelReqKey: "teampositions", // 升级要求，从nextlevel字段取值
      currentValueKey: "teampositions", // 当前统计，从Currentlevel字段取值
    },
    {
      configKey: "teams_onezrs", // 从config字段取值，控制是否显示
      title: "一级投资人数", // 标题
      unit: "人", // 单位
      levelReqKey: "onezrs", // 升级要求，从nextlevel字段取值
      currentValueKey: "onetzrs", // 当前统计，从Currentlevel字段取值
    },
    {
      configKey: "teams_twouzrs",
      title: "二级投资人数",
      unit: "人",
      levelReqKey: "twouzrs",
      currentValueKey: "twozrs",
    },
    {
      configKey: "teams_threezrs",
      title: "三级投资人数",
      unit: "人",
      levelReqKey: "threezrs",
      currentValueKey: "threezrs",
    },
    {
      configKey: "teams_fourzrs",
      title: "四级投资人数",
      unit: "人",
      levelReqKey: "fourzrs",
      currentValueKey: "fourzrs",
    },
    {
      configKey: "teams_fivezrs",
      title: "五级投资人数",
      unit: "人",
      levelReqKey: "fivezrs",
      currentValueKey: "fivezrs",
    },
    {
      configKey: "teams_totltzrs",
      title: "三级内总投资人数",
      unit: "人",
      levelReqKey: "totltzrs",
      currentValueKey: "totltzrs",
    },
    {
      configKey: "teams_totlttzmoeny",
      title: "三级内总投资金额",
      unit: symbolStore.code,
      levelReqKey: "totlttzmoeny",
      currentValueKey: "totlttzmoeny",
    },
    {
      configKey: "teams_teamstotleren",
      title: "团队总投资人数",
      unit: "人",
      levelReqKey: "teamstotleren",
      currentValueKey: "teamstotleren",
    },
    {
      configKey: "teams_teamsmoney",
      title: "团队总投资金额",
      unit: symbolStore.code,
      levelReqKey: "teamsmoney",
      currentValueKey: "teamsmoney",
    },
  ];
});
const strings = ref("");
const teamsid = ref(0);
const teams = ref("");
const list = ref([]);
const wkPopupRef = ref(null);
const nextlevel = reactive({
  name: "",
  rate: "",
  inte: "",
  onezrs: "",
  threezrs: "",
  twouzrs: "",
  totlttzmoeny: "",
  totltzrs: "",
  teamsmoney: "",
  teamstotleren: "",
  uplervermoney: "",
  salary: "",
});
const Currentlevel = reactive({
  onetzrs: "",
  twozrs: "",
  threezrs: "",
  totlttzmoeny: "",
  totltzrs: "",
  teamsmoney: "",
  teamstotleren: "",
  agentname: "",
  myteams: "",
});
const agentname = ref("");
const teams_levelid = ref("");
const config = reactive({
  teams_inte: 0,
  teams_onezrs: 0,
  teams_rate: 0,
  teams_salary: 0,
  teams_salarydata: 0,
  teams_teamsmoney: 0,
  teams_teamstotleren: 0,
  teams_threezrs: 0,
  teams_totlttzmoeny: 0,
  teams_totltzrs: 0,
  teams_twouzrs: 0,
  teams_uplervermoney: 0,
  teams_teampositions: 0,
  teams_teameffectiveuser: 0,
});
const myteams = ref(null);
const lastteams = ref(0);
const activeIndex = ref(0);
const swiperRef = ref(null);
const layoutRef = ref(null);
const handleRefresh = async () => {
  await getmMemberlevel();
  layoutRef.value.complete();
};
const bgType = computed(() => {
  return `bg-team-vip${activeIndex.value}`;
});
// 根据activeIndex计算背景图片路径
const backgroundImage = computed(() => {
  const index = activeIndex.value;
  if (index >= 0 && index <= 3) {
    return '/static/images/user/vip/team_00.png';
  } else if (index >= 4 && index <= 6) {
    return '/static/images/user/vip/team_01.png';
  } else if (index === 7) {
    return '/static/images/user/vip/team_02.png';
  } else if (index === 8) {
    return '/static/images/user/vip/team_03.png';
  } else if (index === 9) {
    return '/static/images/user/vip/team_04.png';
  }
  // 默认背景
  return '/static/images/user/vip/team_00.png';
});
// 根据activeIndex计算卡片背景渐变
const cardBackgroundGradient = computed(() => {
  const index = activeIndex.value;
  if (index >= 0 && index <= 3) {
    return 'linear-gradient(180deg, #002DF3 0%, #0079F2 100%)';
  } else if (index >= 4 && index <= 6) {
    return 'linear-gradient(180deg, #0183C0 0%, #008ED4 100%)';
  } else if (index === 7) {
    return 'linear-gradient(128deg, rgba(20, 149, 255, 0.28) 6.32%, rgba(0, 45, 112, 0.00) 45.17%, rgba(56, 100, 219, 0.33) 85.54%), linear-gradient(180deg, #101B5E 0.13%, #000E38 96.99%)';
  } else if (index === 8) {
    return 'linear-gradient(128deg, rgba(173, 20, 255, 0.28) 6.32%, rgba(0, 5, 58, 0.00) 45.17%, rgba(203, 56, 219, 0.33) 85.54%), linear-gradient(180deg, #2B105E 0.13%, #0D0038 96.99%)';
  } else if (index === 9) {
    return 'linear-gradient(227deg, rgba(255, 178, 45, 0.00) 19.29%, rgba(5, 94, 145, 0.40) 100.94%), linear-gradient(127deg, rgba(33, 58, 255, 0.58) 6.37%, rgba(0, 5, 58, 0.00) 53.67%, rgba(87, 49, 255, 0.68) 102.83%), linear-gradient(180deg, #2B105E 0.13%, #0D0038 96.99%)';
  }
  // 默认渐变
  return 'linear-gradient(180deg, #002DF3 0%, #0079F2 100%)';
});
// 根据activeIndex计算line图片路径（确保索引在0-9范围内）
const lineImage = computed(() => {
  const index = Math.min(Math.max(activeIndex.value, 0), 9);
  const paddedIndex = String(index).padStart(2, '0');
  return `/static/images/user/vip/team_line_${paddedIndex}.png`;
});
const onChange = (swiper) => {
  activeIndex.value = swiper.activeIndex;
};
const openTips = () => {
  wkPopupRef.value.open();
};
const jumpJiangli = () => {
  uni.navigateTo({
    url: routes.teamLevelJiangli,
  });
};

watch(agentname, (newVal) => {
  list.value.map((item, index) => {
    if (item.name === newVal) {
      swiperRef.value && swiperRef.value.swiper.slideTo(index);
    }
  });
});
const getmMemberlevel = async () => {
  loading.value = true;
  loadingText.value = "";
  const res = await getMemberteams();
  console.log(res);
  if (res.status === 0) {
    agentname.value = res.Currentlevel.agentname;
    teams_levelid.value = res.teams_levelid;
    handleResData(res);
    cacheManager.setCache("teamLevel", res);
  }
  loading.value = false;
};
const handleResData = (res) => {
  teamsid.value = res.teamsid;
  teams.value = res.teams;
  list.value = res.list;
  Object.assign(nextlevel, res.nextlevel);
  Object.assign(Currentlevel, res.Currentlevel);
  myteams.value = res.myteams;
  lastteams.value = res.lastteams;
  Object.assign(config, res.config);
  strings.value = res.teamshuoming;
};
onShow(() => {
  if (cacheData) {
    handleResData(cacheData);
  }
  getmMemberlevel();
});
</script>

<style lang="scss" scoped>
.bg-gradient-team-level {
  background: linear-gradient(90deg, #fbf6ef 0%, #f9d7c5 100%);
}
.text-bg {
  color: #000;
}
.vip-bg {
  border-radius: 20px;
  border: 0.5px solid rgba(224, 194, 160, 0.4);
  background: rgba(255, 255, 255, 0.1);
}
.vip-name {
  background: linear-gradient(271deg, #a0def9 4.47%, #e1faff 99.47%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.vip-title {
  background: linear-gradient(358deg, #b27a5a 16.95%, #f9e0d1 81.2%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.custom-gradient {
  background: rgba(255, 255, 255, 0.39);
}
.gradient-text {
  background: linear-gradient(110deg, #FFF 6.48%, #FFDABD 83.04%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
