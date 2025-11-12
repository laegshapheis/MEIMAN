<template>
  <layout
    navTitle="团队等级"
    bgType="bg-main7"
    ref="layoutRef"
    :refresher="true"
    mode="white"
    @onRefresh="handleRefresh"
  >
    <z-swiper
      ref="swiperRef"
      class="my-[16rpx] h-[402rpx]"
      v-model="vip_icons"
      @slideChange="onChange"
      slidesPerView="auto"
      centeredSlides
      :spaceBetween="-30"
      grabCursor
    >
      <z-swiper-item v-for="(item, index) in vip_icons" :key="index" :custom-style="{width:'402rpx'}">
        <view class="flex flex-col justify-end items-center relative">
          <image
            class="w-[320rpx] h-[320rpx] mt-[80rpx]"
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
    <!-- <view class="px-[32rpx]">
      <image
        src="/static/images/user/vip_icon_line.png"
        mode="widthFix"
        class="w-full h-[66rpx]"
      />
    </view> -->
    <view class="relative px-[32rpx] pb-[24rpx] box-border w-full z-10 mt-[100rpx]">
      <view
        class="rounded-[32rpx] box-border relative p-[32rpx] pt-[0] flex flex-col justify-between" style="
        border: 0.5px solid #FFE7CA;
        background: linear-gradient(131deg, #7E7771 -5.2%, #4C4439 21.59%, #382D1F 44.33%, #5B5348 105.18%);"
      >
        <view
          class="mb-[16rpx] flex flex-col w-full items-center py-[8rpx]"
          style="background: url('/static/images/user/vip/vip_title_bg.png') no-repeat center center;background-size: auto 100%;"
        >
          <text class="text-sm gradient-text">当前等级</text>
          <view class="text-base gradient-text">
            {{ Currentlevel.agentname }}
          </view>
        </view>
        <view
          class="mb-[32rpx] rounded-[16rpx] box-border p-[28rpx] flex flex-row w-full items-center justify-between"
        >
          <view class="text-sm text-white/75 text-center">
            温馨提示：如果各项数据都显示已达标，等级却没有更新，请点击
            <text class="gradient-text">“我的团队”</text>
            即可更新等级状态
          </view>
        </view>
        <view class="flex flex-row justify-between">
          <view
            @click="navigateTo(routes.promoRecord)"
            class="px-[32rpx] py-[10rpx] rounded-[66rpx] border-[length:2rpx] border-solid border-[#E8EBF0] bg-[transparent]"
          >
            <text class="text-base text-[#E8EBF0]">我的团队</text>
          </view>
          <view
            @click="openTips"
            class="px-[32rpx] py-[10rpx] mx-[16rpx] rounded-[66rpx] border-[length:2rpx] border-solid border-[#E8EBF0] bg-[transparent]"
          >
            <text class="text-base text-[#E8EBF0]">规则说明</text>
          </view>
          <view
            @click="jumpJiangli"
            class="px-[32rpx] py-[10rpx] rounded-[66rpx] border-[length:2rpx] border-solid border-[#E8EBF0] bg-[transparent]"
          >
            <text class="text-base text-[#E8EBF0]">查看奖励</text>
          </view>
        </view>
      </view>
      <view
        class="text-lg font-medium flex flex-row items-center my-[48rpx] justify-center"
      >
        <image
          class="w-[24rpx] h-[24rpx]"
          src="/static/images/user/hy_level.svg"
          mode="widthFix"
        />
        <text class="gradient-text mx-2 text-xl"> 升级评估 </text>
        <image
          class="w-[24rpx] h-[24rpx]"
          src="/static/images/user/hy_level.svg"
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
