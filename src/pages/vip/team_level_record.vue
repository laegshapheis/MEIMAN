<template>
  <layout navTitle="团队等级奖励" bgType="bg-main4" ref="layoutRef" :refresher="true" mode="white" :isLottie="false"
    @onRefresh="handleRefresh">
    <view class="p-[22rpx]">
      <view v-for="item in list" :key="item.id" class="flex flex-col mb-[32rpx] rounded-[16rpx]">
        <view class="flex flex-row justify-center items-center mb-[32rpx]">
          <image class="w-[40rpx] h-[40rpx] mr-2" src="/static/images/user/hy_icon.png" mode="widthFix"></image>
          <text class="text-white text-xl font-medium">{{ item.name }}</text>
        </view>
        <view class="flex-col flex rounded-[24rpx] bg-gradient-vip border-[#0188FE] border-solid border-[0.5px]">
          <view class="flex flex-col p-[32rpx]">
            <view class="text-white text-md font-medium py-[16rpx]">升级条件</view>
            <view class="w-full flex flex-row flex-wrap basis-0 flex-wrap border-white/15 border-solid border-b-[0.5px] border-t-0 border-l-0 border-r-0">
              <template v-for="(val, index) in dataList" :key="val.value">
                <view v-if="config[val.auth] === 1"
                  :class="[
                    'flex flex-col py-[24rpx] items-start justify-between border-white/15 border-solid border-t-[0.5px] border-b-0 border-l-0 border-r-0',
                    getItemWidth(val, index)
                  ]">
                  <view class="text-white/80 text-base mb-[8rpx]">{{ val.labelKey ? item[val.labelKey] : val.label }}({{
                    val.unit }})</view>
                  <view class="text-lg font-bold text-white">
                    {{ item[val.value] }}
                  </view>
                </view>
              </template>
            </view>
          </view>
          <view class="px-[32rpx] py-[24rpx]">
            <view class="text-white text-md font-medium py-[16rpx] mb-[16rpx]">奖励制度</view>
            <view class="rounded-[16rpx] box-border p-[24rpx] mb-[16rpx] bg-gradient-reward">
              <template v-for="val in rewardsList" :key="val.label">
                <view v-if="config[val.auth] === 1">
                  <view class="flex flex-row items-center">
                    <!-- <view class="h-[10rpx] w-[10rpx] bg-[#010101] rounded-full mr-[8rpx]"></view> -->
                    <text class="text-base text-white">{{ val.label }}</text>
                    <text class="text-[#FFBD84] ml-[10rpx] text-base">{{
                      val.filterValue(item[val.value])
                    }}</text>
                  </view>
                  <view class="flex flex-row text-white/55 text-sm mt-[5rpx]" v-if="val.desc">
                    <!-- <view class="h-[10rpx] w-[10rpx] bg-[#010101] rounded-full mr-[8rpx] flex-shrink-0 mt-[10rpx]">
                    </view> -->
                    {{ val.desc }}
                  </view>
                  <view class="text-white text-sm mt-[5rpx]" v-if="val.descKey">{{ config[val.descKey] }}
                  </view>
                </view>
              </template>
            </view>
            <text v-if="config.teams_salarydata" class="text-[#5493FF] text-sm mt-[5rpx]">{{
              config.teams_salarydata
            }}</text>
          </view>
        </view>


      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getMemberteams } from "@/api/user";
import { useSymbolStore } from "@/stores/symbolStore";
import { cacheManager } from "@/utils/cacheManager";
const cacheData = cacheManager.getCache("teamLevel");
const symbolStore = useSymbolStore();
const teamsid = ref(0);
const teams = ref("");
const list = ref([]);
const loading = ref(false);
const loadingText = ref("");

// 团队等级奖励
const dataList = computed(() => {
  return [
    // 推荐人数
    {
      labelKey: "teamsinviters_name", // 推荐人数
      value: "teamsinviters",
      unit: "人",
      auth: "teams_teamsinviters",
    },
    {
      label: "团队总业绩",
      value: "teamsperformance",
      unit: symbolStore.code,
      auth: "teams_teamsperformance",
    },
    {
      label: "个人累计投资",
      value: "selfmoney",
      unit: symbolStore.code,
      auth: "teams_selfmoney",
    },
    {
      label: "团队有效人数",
      value: "teameffectiveuser",
      unit: "人",
      auth: "teams_teameffectiveuser",
    },
    {
      label: "团队持仓金额",
      value: "teampositions",
      unit: symbolStore.code,
      auth: "teams_teampositions",
    },
    {
      label: "一级投资人数", // 投资人数
      value: "onezrs", // list取对应值
      unit: "人", // 单位
      auth: "teams_onezrs", // 权限, config获取
    },
    {
      label: "二级投资人数",
      value: "twouzrs",
      unit: "人",
      auth: "teams_twouzrs",
    },
    {
      label: "三级投资人数",
      value: "threezrs",
      unit: "人",
      auth: "teams_threezrs",
    },
    {
      label: "三级内总投资人数",
      value: "totltzrs",
      unit: "人",
      auth: "teams_totltzrs",
    },
    {
      label: "三级内总投资金额",
      value: "totlttzmoeny",
      unit: symbolStore.code,
      auth: "teams_totlttzmoeny",
    },
    {
      label: "团队总投资人数",
      value: "teamstotleren",
      unit: "人",
      auth: "teams_teamstotleren",
    },
    {
      label: "团队总投资金额",
      value: "teamsmoney",
      unit: symbolStore.code,
      auth: "teams_teamsmoney",
    },
    {
      label: "团队当月实际投资金额",
      value: "teamstotaltixianmoney",
      unit: symbolStore.code,
      auth: "teams_teamstotaltixianmoney",
    },
  ];
});
// 奖励制度
const rewardsList = computed(() => {
  return [
    {
      label: "每日签到奖励",
      value: "checkin_money",
      auth: "teams_checkin_money",
      filterValue(value) {
        return `${value} ${symbolStore.code}`;
      },
    },
    {
      label: "升级后一次性奖励",
      value: "uplervermoney",
      auth: "teams_uplervermoney",
      filterValue(value) {
        return `${value} ${symbolStore.code}`;
      },
    },
    {
      label: "奖励团队成员每笔投资收益金额的",
      value: "umbrella",
      auth: "teams_umbrella",
      filterValue(value) {
        return `${value}%`;
      },
    },
    {
      label: "奖励团队总投资金额的",
      value: "teamspercent",
      auth: "teams_teamspercent",
      filterValue(value) {
        return `${value}%`;
      },
    },
    {
      label: "奖励团队当月总投资金额的",
      value: "rate",
      auth: "teams_rate",
      filterValue(value) {
        return `${value}%`;
      },
    },
    {
      label: "奖励团队当月实际投资金额的",
      desc: "团队当月总投资金额减去团队当月总提现金额等于团队当月实际投资金额",
      value: "inte",
      auth: "teams_inte",
      filterValue(value) {
        return `${value}%`;
      },
    },
    {
      label: "每月可领取扶持资金",
      value: "salary",
      auth: "teams_salary",
      filterValue(value) {
        return `${value} ${symbolStore.code}`;
      },
    },
    {
      label: "奖励团队总业绩的",
      value: "total_inte",
      auth: "teams_total_inte",
      desc: "团队总充值金额减去团队总提现金额等于团队总业绩",
      filterValue(value) {
        return `${value}%`;
      },
    },
  ];
});
const nextlevel = reactive({
  wheels: "",
  companyday: "",
  companymoney: "",
  xzmoney: "",
  inte: "",
});
const Currentlevel = reactive({
  one: "",
  recharges: "",
  three: "",
  two: "",
});
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
const lastteams = ref(null);
const layoutRef = ref(null);

// 计算符合条件的项目数量
const getVisibleCount = () => {
  return dataList.value.filter(val => config[val.auth] === 1).length;
};

// 获取当前项目在可见项目中的索引
const getVisibleIndex = (currentVal, currentIndex) => {
  let visibleIndex = 0;
  for (let i = 0; i <= currentIndex; i++) {
    if (config[dataList.value[i].auth] === 1) {
      if (dataList.value[i] === currentVal) {
        return visibleIndex;
      }
      visibleIndex++;
    }
  }
  return visibleIndex;
};

// 计算项目宽度
const getItemWidth = (val, index) => {
  const visibleCount = getVisibleCount();
  const visibleIndex = getVisibleIndex(val, index);
  
  // 如果是最后一个且总数是奇数，占整行
  if (visibleIndex === visibleCount - 1 && visibleCount % 2 === 1) {
    return 'w-full';
  }
  return 'w-[50%]';
};
const handleRefresh = async () => {
  await getmMemberlevel();
  layoutRef.value.complete();
};
const getmMemberlevel = async () => {
  loading.value = true;
  loadingText.value = "加载中...";
  try {
    const res = await getMemberteams();
    console.log(res);
    handleResData(res);
    cacheManager.setCache("teamLevel", res);
  } catch (error) {
    console.error("请求失败", error);
    loading.value = false;
  }
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
  loading.value = false;
};
onLoad(() => {
  if (cacheData) {
    handleResData(cacheData);
  }
  getmMemberlevel();
});
</script>

<style lang="scss" scoped>
.custom-gradient {
  background: linear-gradient(270deg,
      rgba(1, 18, 23, 0.87) 44%,
      rgba(1, 18, 75, 0.87) 91%);
  border-width: 4rpx;
  border-style: solid;
  border-image: linear-gradient(269deg, #0453a1 0%, #6cccfe 47%, #0453a1 100%);
  border-image-slice: 1;
}

.vip-title {
  background: linear-gradient(358deg, #b8d7f4 16.95%, #fff 81.2%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.gradient-text {
  background: linear-gradient(110deg, #FFF 6.48%, #FFDABD 83.04%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
