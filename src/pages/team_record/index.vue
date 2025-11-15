<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="我的团队"
    bgType="bg-main"
    @reachBottom="handleReachBottom"
  >
    <view class="px-[32rpx] pb-[24rpx] box-border w-full flex flex-col">
      <!-- start 列表 -->
      <wk-stroke-bg shadow class="flex flex-col rounded-[16rpx] p-[24rpx] my-[24rpx]" bgColor="#FFFFFF">
        <template
          v-for="(list, chunkIndex) in chunk(
            fields.filter((item) => item.mtype == -1 || item.mtype == mtype),
            2
          )"
          :key="`b-${chunkIndex}`"
        >
          <view class="flex flex-row items-center justify-start">
            <template v-for="item in list" :key="item.field">
              <view
                :class="[
                  'flex flex-col w-[48%] justify-center items-start rounded-[16rpx] py-[16rpx] px-[8rpx]',
                ]"
                v-if="item.mtype == -1 || item.mtype == mtype"
                @click="item.click && item.click()"
              >
                <text class="text-sm text-neutral-theme">{{
                  item.title
                }}</text>
                <text
                  :class="[
                    'text-lg text-neutral font-bold mt-[8rpx]',
                    item.click ? 'underline' : '',
                  ]"
                  >{{ statInfo[item.field] }} {{ item.unit }}</text
                >
              </view>
            </template>
          </view>

          <view
            class="flex flex-row h-[1rpx] bg-neutral-inputBorder"
            v-if="
              chunkIndex <
              fields.filter((item) => item.mtype == -1 || item.mtype == mtype)
                .length /
                2 -
                1
            "
          ></view>
        </template>
        <!-- </view> -->
      </wk-stroke-bg>
      <!-- end 列表 -->


       <!-- start 列表 -->
       <wk-stroke-bg shadow class="flex flex-col rounded-[16rpx] p-[24rpx] my-[24rpx]" bgColor="#FFFFFF">
        <template
          v-for="(list, chunkIndex) in chunk(
            teamFields.filter((item) => item.mtype == -1 || item.mtype == mtype),
            2
          )"
          :key="`b-${chunkIndex}`"
        >
          <view class="flex flex-row items-center justify-start">
            <template v-for="item in list" :key="item.field">
              <view
                :class="[
                  'flex flex-col w-[48%] justify-center items-start rounded-[16rpx] py-[16rpx] px-[8rpx]',
                ]"
                v-if="item.mtype == -1 || item.mtype == mtype"
                @click="item.click && item.click()"
              >
                <text class="text-sm text-neutral-theme">{{
                  item.title
                }}</text>
                <text
                  :class="[
                    'text-lg text-neutral font-bold mt-[8rpx]',
                    item.click ? 'underline' : '',
                  ]"
                  >{{ statInfo[item.field] }} {{ item.unit }}</text
                >
              </view>
            </template>
          </view>

          <view
            class="flex flex-row h-[1rpx] bg-neutral-inputBorder"
            v-if="
              chunkIndex <
                teamFields.filter((item) => item.mtype == -1 || item.mtype == mtype)
                .length /
                2 -
                1
            "
          ></view>
        </template>
        <!-- </view> -->
      </wk-stroke-bg>
      <!-- end 列表 -->

      <!-- 筛选 -->
      <view class="flex flex-row justify-between items-center">
        <uv-search
          class=" flex flex-row items-center w-[100%] h-[88rpx]"
          bgColor="transparent"
          placeholder="请输入账号查询"
          shape="square"
          @blur="blur"
          @cancel="cancel"
          cancelButton="none"
          @search="search"
          @custom="reset"
          searchIconSize="48rpx"
          searchIconColor="#010101"
          placeholderColor="#010101"
          :color="$colors.DEFAULT"
          height="68rpx"
          :showAction="true"
          :clearabled="true"
          actionText="取消"
          :actionStyle="{
            color: '#010101',
            fontSize: '28rpx',
            width: keyword ? '108rpx' : '0rpx',
            height: '68rpx',
            lineHeight: '68rpx',
            backgroundColor: '#FFFFFF',
            borderRadius: '48rpx',
          }"
          :customStyle="{
            border: '0px solid ' + '#000000',
          }"
          :boxStyle="{
            borderRadius: '48rpx',
            border: '1rpx solid rgba(0, 0, 0, 0.10)',
            backgroundColor: '#FFFFFF',
          }"
          v-model="keyword"
        >
        </uv-search>
      </view>
      <!-- 筛选 -->

      <!-- 标签筛选 -->
      <view class="flex flex-row my-[25rpx] mt-[25rpx] justify-between">
        <scroll-view
          scroll-x="true"
          class="w-[100%] h-[76rpx] flex flex-row whitespace-nowrap flex-nowrap"
        >
          <view
            class="inline-flex items-center mr-[12rpx]"
            v-for="(item, index) in filterList"
            :key="index"
            @click="changeFilterLevel(item)"
          >
            <view class="flex flex-row gap-[20rpx] items-center">
              <view
                :class="[
                  'flex flex-col items-center',
                  currentLevel == item.level
                    ? 'bg-neutral border-[length:2rpx] border-solid border-white/10 px-[24rpx] rounded-full text-base'
                    : 'bg-[transparent] border-[length:2rpx] border-solid border-white/10 px-[24rpx] rounded-full text-base',
                ]"
              >
                <text
                  class="text-base py-[15rpx]"
                  :class="
                    currentLevel == item.level
                      ? 'text-white'
                      : 'text-neutral-regular'
                  "
                  >{{
                    currentLevel == item.level ? "取消查看" : item.title
                  }}</text
                >
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <!-- 标签筛选 -->

      <!-- 下级列表 -->
      <view class="flex flex-col">
        <wk-stroke-bg
          shadow
          size="small"
          class="flex flex-col min-h-[200rpx] p-[24rpx] mb-[24rpx]"
          bgColor="#FFFFFF"
          v-for="item in dataList"
          :key="'no__l' + item.id"
        >
          <view class="flex flex-col">
            <view class="flex flex-row justify-between items-center">
              <view class="flex flex-row justify-between">
                <view
                  class="flex flex-row items-center w-[48rpx] h-[48rpx] mr-[12rpx]"
                >
                  <image
                    class="w-[48rpx] h-[48rpx] rounded-full"
                    src="/static/images/user/logo.png"
                  />
                </view>
                <text class="text-lg font-medium text-neutral">
                  <text v-if="item.realname">{{ item.realname }}</text>
                </text>
              </view>
              <view
                class="flex flex-row justify-center items-center my-[10rpx]"
              >
                <view class="flex flex-row items-center mr-[24rpx]">
                  <text class="text-sm">团队总人数</text>
                  <text class="text-sm text-neutral-theme ml-[5rpx]">
                    {{ item.invest_nunber }}
                  </text>
                  <text class="text-sm text-neutral-theme"
                    >/{{ item.register_nunber }}
                  </text>
                </view>
                <view class="flex flex-row items-center" @click="viewId(item)">
                  <text class="text-sm text-neutral-regular">一级总人数</text>
                  <text class="text-sm text-neutral-theme ml-[5rpx]">{{
                    item.invite_direct_count
                  }}</text>
                  <uv-icon
                    class="ml-[5rpx]"
                    size="24rpx"
                    :color="$colors.theme"
                    name="arrow-right"
                  ></uv-icon>
                </view>
              </view>
            </view>

            <view class="flex flex-row justify-between items-center mt-[10rpx]">
              <text>{{ item.username }}</text>
              <text class="text-sm text-neutral">
                总投资({{ symbolStore.code }}) {{ item.touzi }}
              </text>
            </view>
          </view>

          <view
            class="flex flex-row my-[16rpx] h-[2rpx] bg-neutral-black/10"
          ></view>

          <view class="flex flex-row justify-between items-center leading-5">
            <view class="flex flex-col w-[33%]">
              <text class="text-lg text-neutral font-bold">{{
                item.nextrecharges
              }}</text>
              <text class="text-sm text-neutral-theme"
                >充值({{ symbolStore.code }})</text
              >
            </view>

            <view class="flex flex-col w-[33%]">
              <text class="text-lg text-neutral font-bold">{{
                item.nextwithdrawals
              }}</text>
              <text class="text-sm text-neutral-theme"
                >提现({{ symbolStore.code }})</text
              >
            </view>

            <view class="flex flex-col w-[33%]">
              <text class="text-lg text-neutral font-bold">{{
                item.nexttransfer
              }}</text>
              <text class="text-sm text-neutral-theme"
                >转账({{ symbolStore.code }})</text
              >
            </view>
          </view>

          <template v-if="mtype == 1">
            <view
              class="flex flex-row my-[16rpx] h-[2rpx] bg-neutral-black/10"
            ></view>

            <view class="flex flex-row justify-between items-center leading-5">
              <view class="flex flex-col w-[33%]">
                <text class="text-lg text-neutral font-bold">{{
                  item.tixian
                }}</text>
                <text class="text-sm text-neutral-theme"
                  >可提({{ symbolStore.code }})</text
                >
              </view>

              <view class="flex flex-col w-[33%]">
                <text class="text-lg text-neutral font-bold">{{
                  item.amount
                }}</text>
                <text class="text-sm text-neutral-theme"
                  >可投({{ symbolStore.code }})</text
                >
              </view>

              <view class="flex flex-col w-[33%]">
                <text class="text-lg text-neutral font-bold">{{
                  item.yuebao
                }}</text>
                <text class="text-sm text-neutral-theme"
                  >余额宝({{ symbolStore.code }})</text
                >
              </view>
            </view>
          </template>
          <template v-if="mtype == 1">
            <view
              class="flex flex-row my-[16rpx] h-[2rpx] bg-neutral-black/10"
            ></view>

            <view class="flex flex-row justify-between items-center leading-5">
              <view class="flex flex-col w-[33%]">
                <text class="text-lg text-neutral font-bold">{{
                  item.integral
                }}</text>
                <text class="text-sm text-neutral-theme">积分(分)</text>
              </view>

              <view class="flex flex-col w-[33%]">
                <text class="text-lg text-neutral font-bold">{{
                  item.integral_used
                }}</text>
                <text class="text-sm text-neutral-theme">已兑换(分)</text>
              </view>

              <view class="flex flex-col w-[33%]">
                <text class="text-lg text-neutral font-bold">{{
                  item.invite_direct_invest_count
                }}</text>
                <text class="text-sm text-neutral-theme">直推(人)</text>
              </view>
            </view>
          </template>
          <view class="flex flex-row my-[16rpx] h-[2rpx] bg-neutral-black/10">
          </view>
          <view class="flex flex-row justify-between items-center">

            <view class="flex flex-col w-[33%]">
              <text class="text-lg text-neutral font-bold">{{
                item.zaitou
              }}</text>
              <text class="text-sm text-neutral-theme"
                >在投({{ symbolStore.code }})</text
              >
            </view>
          </view>
          <view
            class="flex flex-row my-[16rpx] h-[2rpx] bg-neutral-black/10"
          ></view>
          <view class="flex flex-row justify-between items-center">
            <text class="text-sm text-neutral-regular"
              >注册时间：{{ item.created_at }}</text
            >
          </view>
        </wk-stroke-bg>
      </view>
      <!-- 下级列表 -->
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import ValidateUtils from "@/utils/validate";
import {
  getPromotionInfo as getPromotionInfoApi,
  getPromotionList as getPromotionListApi,
} from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const cacheDataList = cacheManager.getCache("promoRecordList");
const cacheDataInfo = cacheManager.getCache("promoRecordInfo");
const page = ref(1);
const dataList = ref([]);
const layoutRef = ref(null);
const symbolStore = useSymbolStore();
const keyword = ref("");
const loading = ref(false);
const loadingText = ref("");
const filterList = [
  {
    title: "查看一层下级",
    level: 1,
  },

  {
    title: "查看二层下级",
    level: 2,
  },

  {
    title: "查看三层下级",
    level: 3,
  },

  // {
  //   title : '查看四层下级',
  //   level : 4,
  // },

  // {
  //   title : '查看五层下级',
  //   level : 5,
  // },
];
const fields = computed(() => {
  return [
    {
      title: "一级累计投资人数",
      field: "onetzrs",
      unit: "人",
      mtype: -1,
    },

    {
      title: "一级累计投资金额",
      field: "onecz",
      unit: symbolStore.unit,
      mtype: -1,
    },

    {
      title: "一级正在投资人数",
      field: "oneinvestzrs",
      unit: "人",
      mtype: -1,
    },

    {
      title: "一级正在投资金额",
      field: "oneinvestcz",
      unit: symbolStore.unit,
      mtype: -1,
    },

    {
      title: "今日新增一级投资人数",
      field: "todayonetzrs",
      unit: "人",
      mtype: -1,
    },

    // {
    //   title: "今日新增一级有效会员",
    //   field: "todayeffonetzrs",
    //   unit: '人',
    //   mtype: -1,
    // },
    
    // {
    //   title: "今日一级新增二次投资人数",
    //   field: "todayonerebuytzrs",
    //   unit: "人",
    //   mtype: -1,
    // },

    {
      title: "今日新增一级会员投资金额",
      field: "todayeffonetzcz",
      unit: symbolStore.unit,
      mtype: -1,
    },

    {
      title: "二级累计投资人数",
      field: "twouzrs",
      unit: "人",
      mtype: -1,
    },

    {
      title: "二级累计投资金额",
      field: "twoucz",
      unit: symbolStore.unit,
      mtype: -1,
    },

    {
      title: "三级累计投资人数",
      field: "threezrs",
      unit: "人",
      mtype: -1,
    },

    {
      title: "三级累计投资金额",
      field: "threecz",
      unit: symbolStore.unit,
      mtype: -1,
    },

    {
      title: "三级内总计投资",
      field: "hebicz",
      unit: symbolStore.unit,
      mtype: -1,
    },

    {
      title: "三级内总计提现",
      field: "hebizrs",
      unit: symbolStore.unit,
      mtype: -1,
    },

    //  {
    //   title: "一级投资人数列表",
    //   field: "onetzrs",
    //   unit: "人",
    //   mtype: 1,
    //   click: () => changeFilterLevel({ level: 10 }),
    // },

    {
      title: "今日一级签到人数",
      field: "qiandaorenshu",
      unit: "人",
      mtype: 1,
      click: () => viewTouziCount(7),
    },

    {
      title: "投资1次人数",
      field: "tzone",
      unit: "人",
      mtype: 1,
      click: () => viewTouziCount(1),
    },

    {
      title: "投资2次人数",
      field: "tztwo",
      unit: "人",
      mtype: 1,
      click: () => viewTouziCount(2),
    },

    {
      title: "投资3次人数",
      field: "tzthree",
      unit: "人",
      mtype: 1,
      click: () => viewTouziCount(3),
    },

    {
      title: "投资4次人数",
      field: "tzfour",
      unit: "人",
      mtype: 1,
      click: () => viewTouziCount(4),
    },

    {
      title: "投资5次或以上人数",
      field: "tzfive",
      unit: "人",
      mtype: 1,
      click: () => viewTouziCount(5),
    },

    {
      title: "高级会员人数",
      field: "vip",
      unit: "人",
      mtype: 1,
      click: () => viewTouziCount(6),
    },

   
  ];
});


const teamFields = computed(() => {
  return [
    
    {
      title: "团队总注册人数",
      field: "totltzhuce",
      unit: "人",
      mtype: -1,
    },

    {
      title: "团队累计投资人数",
      field: "totltzrs",
      unit: "人",
      mtype: -1,
    },

    {
      title: "团队在投人数",
      field: "teaminvestzrs",
      unit: "人",
      mtype: -1,
    },

    // {
    //   title: "团队在投金额",
    //   field: "teaminvestcz",
    //   unit: symbolStore.unit,
    //   mtype: -1,
    // },

    {
      title: "团队当月总投资",
      field: "team_this_month_invest",
      unit: symbolStore.unit,
      mtype: -1,
    },
    {
      title: "团队当月总提现",
      field: "team_this_month_Withdraw",
      unit: symbolStore.unit,
      mtype: -1,
    },

    {
      title: "团队累计投资金额",
      field: "totltz",
      unit: symbolStore.unit,
      mtype: -1,
    },

    {
      title: "团队总计充值",
      field: "team_total_recharge",
      unit: symbolStore.unit,
      mtype: -1,
    },


    {
      title: "团队总计提现",
      field: "team_total_withdraw", 
      unit: symbolStore.unit,
      mtype: -1,
    },

    // {
    //   title: "团队总计转账", 
    //   field: "team_total_transfer",
    //   unit: symbolStore.unit,
    //   mtype: -1,
    // },

    {
      title: "团队U总计充值",
      field: "totlusdtcz",
      unit: "U",
      mtype: 1,
    },

    {
      title: "团队U总计提现",
      field: "totlusdttx",
      unit: "U",
      mtype: 1,
    },

    // {
    //   title: "团队U充值笔数",
    //   field: "team_Number_recharges",
    //   mtype: 1,
    // },
    // {
    //   title: "团队U提现笔数",
    //   field: "team_Number_withdrawal",
    //   mtype: 1,
    // },

    {
      title: "团队人民币总计充值",
      field: "totlcz",
      unit: "CNY",
      mtype: 1,
    },
    {
      title: "团队人民币总计提现",
      field: "totltx",
      unit: "CNY",
      mtype: 1,
    },
    // {
    //   title: "人民币充值手续费",
    //   field: "recharge_fee",
    //   unit: "CNY",
    //   mtype: 1,
    // },
    {
      title: "人民币提现手续费",
      field: "withdraw_fee",
      unit: "CNY",
      mtype: 1,
    },

    //  {
    //   title: "团队总可投余额",
    //   field: "team_total_amount",
    //   unit: symbolStore.unit,
    //   mtype: 1,
    // },
    {
      title: "团队总在投金额",
      field: "weifanhuibenjin",
      unit: symbolStore.unit,
      mtype: 1,
    },

    {
      title: "团队余额宝总额",
      field: "yuebao",
      unit: symbolStore.unit,
      mtype: 1,
    },

    {
      title: "团队可提现金额",
      field: "ketixianjine",
      unit: symbolStore.unit,
      mtype: 1,
    },

    //  {
    //   title: "积分兑换商品消耗",
    //   field: "totlejifen",
    //   unit: "分",
    //   mtype: 1,
    // },
    // {
    //   title: "团队总可用积分",
    //   field: "teamtotaljifen",
    //   unit: "分",
    //   mtype: 1,
    // },

    {
      title: "今日团队新增投资人数",
      field: "todayteamefftzrs",
      unit: "人",
      mtype: -1,
    },
    {
      title: "今日团队新增投资金额",
      field: "todayteamtzcz",
      unit: symbolStore.unit,
      mtype: -1,
    },

    // {
    //   title: "今日团队新增有效会员",
    //   field: "todayteamefftzrs",
    //   unit: "人",
    //   mtype: -1,
    // },
    // {
    //   title: "今日团队新增二次投资人数",
    //   field: "todayteamrebuytzrs",
    //   unit: "人",
    //   mtype: -1,
    // },

    // {
    //   title: "团队U总计充值",
    //   field: "totlusdtcz",
    //   unit: "U",
    //   mtype: 1,
    // },
    // {
    //   title: "团队U总计提现",
    //   field: "totlusdttx",
    //   unit: "U",
    //   mtype: 1,
    // },
    // {
    //   title: "团队U充值笔数",
    //   field: "team_Number_recharges",
    //   mtype: 1,
    // },
    // {
    //   title: "团队U提现笔数",
    //   field: "team_Number_withdrawal",
    //   mtype: 1,
    // },
    // {
    //   title: "团队人民币总计充值",
    //   field: "totlcz",
    //   unit: "CNY",
    //   mtype: 1,
    // },
    // {
    //   title: "团队人民币总计提现",
    //   field: "totltx",
    //   unit: "CNY",
    //   mtype: 1,
    // },
    // {
    //   title: "人民币充值手续费",
    //   field: "recharge_fee",
    //   unit: "CNY",
    //   mtype: 1,
    // },
    // {
    //   title: "人民币提现手续费",
    //   field: "withdraw_fee",
    //   unit: "CNY",
    //   mtype: 1,
    // },

    // {
    //   title: "团队总可投余额",
    //   field: "team_total_amount",
    //   unit: symbolStore.unit,
    //   mtype: 1,
    // },
    // {
    //   title: "团队总在投金额",
    //   field: "weifanhuibenjin",
    //   unit: symbolStore.unit,
    //   mtype: 1,
    // },
    // {
    //   title: "团队余额宝总额",
    //   field: "yuebao",
    //   unit: symbolStore.unit,
    //   mtype: 1,
    // },

    // {
    //   title: "团队可提现金额",
    //   field: "ketixianjine",
    //   unit: symbolStore.unit,
    //   mtype: 1,
    // },
    // {
    //   title: "积分兑换商品消耗",
    //   field: "totlejifen",
    //   unit: "分",
    //   mtype: 1,
    // },
    // {
    //   title: "团队总可用积分",
    //   field: "teamtotaljifen",
    //   unit: "分",
    //   mtype: 1,
    // },

    // {
    //   title: "一级投资人数列表",
    //   field: "onetzrs",
    //   unit: "人",
    //   mtype: 1,
    //   click: () => changeFilterLevel({ level: 10 }),
    // },

    // {
    //   title: "今日一级签到人数",
    //   field: "qiandaorenshu",
    //   unit: "人",
    //   mtype: 1,
    //   click: () => viewTouziCount(7),
    // },

    // {
    //   title: "投资1次人数",
    //   field: "tzone",
    //   unit: "人",
    //   mtype: 1,
    //   click: () => viewTouziCount(1),
    // },

    // {
    //   title: "投资2次人数",
    //   field: "tztwo",
    //   unit: "人",
    //   mtype: 1,
    //   click: () => viewTouziCount(2),
    // },

    // {
    //   title: "投资3次人数",
    //   field: "tzthree",
    //   unit: "人",
    //   mtype: 1,
    //   click: () => viewTouziCount(3),
    // },

    // {
    //   title: "投资4次人数",
    //   field: "tzfour",
    //   unit: "人",
    //   mtype: 1,
    //   click: () => viewTouziCount(4),
    // },

    // {
    //   title: "投资5次或以上人数",
    //   field: "tzfive",
    //   unit: "人",
    //   mtype: 1,
    //   click: () => viewTouziCount(5),
    // },

    // {
    //   title: "高级会员人数",
    //   field: "vip",
    //   unit: "人",
    //   mtype: 1,
    //   click: () => viewTouziCount(6),
    // },
  ];
});

const pullType = ref("");
const lock = ref(false);
onLoad((options) => {
  if (cacheDataList) {
    handleResDataList(cacheDataList);
  }
  if (cacheDataInfo) {
    handleResDataInfo(cacheDataInfo);
  }
  getLogList();
  getStatInfo();
});

const handleRefresh = () => {
  pullType.value = "down";
  page.value = 1;
  loadFinish.value = false;
  getLogList();
  getStatInfo();
};

// 上拉加载
const handleReachBottom = () => {
  if (loadFinish.value) return;
  if (lock.value) return;
  console.log("上拉加载");
  pullType.value = "up";

  page.value++;

  getLogList();
};

const currentLevel = ref(null);
const currentId = ref("");
const touziCount = ref();
const loadFinish = ref(false);
const getLogList = async (showLoading = true) => {
  if (lock.value) return;
  lock.value = true;
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }
  const result = await getPromotionListApi({
    sokey: keyword.value, // 搜索关键字
    page: page.value,
    lerve: currentLevel.value,
    tzcount: touziCount.value, //投资人数
    id: currentId.value,
  });
  lock.value = false;
  if (page.value == 1) {
    cacheManager.setCache("promoRecordList", result);
  }
  loading.value = false;
  handleResDataList(result, showLoading);
};

const handleResDataList = (result, showLoading) => {
  console.log("下级列表", result);
  layoutRef.value && layoutRef.value.complete();
  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });

    return;
  }
  if (pullType.value == "down" || page.value == 1) {
    dataList.value = [];
  }

  if (showLoading) {
    if (!result.list.data) {
      uni.$showToast({
        title: "无结果！请核对！",
        icon: "none",
      });

      return;
    }
  }

  const usernameList = dataList.value.map((item) => item.username);

  const temp = result.list.data.filter((item) => {
    return !usernameList.includes(item.username);
  });

  dataList.value = dataList.value.concat(temp);

  if (result.list.current_page >= result.list.last_page) {
    loadFinish.value = true;
  }

  console.log("下级列表", result);

  loading.value = false;
};
const statInfo = ref({
  hebicz: 0,
  hebizrs: 0,
  threecz: 0,
  threezrs: 0,
  twoucz: 0,
  twouzrs: 0,
  onecz: 0,
  onetzrs: 0,
  totltz: 0,
  totltzrs: 0,
  totlcz: 0,
  totlusdtcz: 0,
  totlusdttx: 0,
  team_total_withdraw: 0,
  totltzhuce: 0,
  totltx: 0,
  tzone: 0,
  tztwo: 0,
  tzthree: 0,
  tzfour: 0,
  tzfive: 0,
  vipnum: 0,
  fourzrs: 0,
  fourcz: 0,
  fivezrs: 0,
  sixzrs: 0,
  sixcz: 0,
  fivecz: 0,
  one_five_buy: 0,
  one_five_Withdraw: 0,
  team_total_amount: 0,
  teamtotaljifen: 0,
});
const userInfo = ref({});
const mtype = ref(0);
const getStatInfo = async (showLoading = true) => {
  if (showLoading) {
    loading.value = true;
    loadingText.value = "加载中...";
  }
  const result = await getPromotionInfoApi({});
  handleResDataInfo(result, showLoading);
};
const handleResDataInfo = (result, showLoading) => {
  layoutRef.value && layoutRef.value.complete();

  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });

    return;
  }
  cacheManager.setCache("promoRecordInfo", result);
  statInfo.value = result.data;
  mtype.value = result.mtype;
  userInfo.value = result.user_info;

  console.log("推广数据", result);

  loading.value = false;
};

const changeFilterLevel = (item) => {
  if (currentLevel.value === item.level) currentLevel.value = null;
  else currentLevel.value = item.level;

  touziCount.value = null;
  currentId.value = null;
  // dataList.value = [];
  page.value = 1;
  loadFinish.value = false;
  getLogList();
};

const viewId = (item) => {
  if (item.invite_direct_count == 0) {
    uni.$showToast({
      title: "无结果！请核对",
      icon: "none",
    });

    return;
  }

  keyword.value = item.invicode;
  currentId.value = item.id;
  page.value = 1;
  dataList.value = [];
  loadFinish.value = false;

  getLogList();
};

const viewTouziCount = (count) => {
  touziCount.value = count;
  currentLevel.value = null;

  keyword.value = null;
  page.value = 1;
  dataList.value = [];
  loadFinish.value = false;

  getLogList();
};

const search = (value) => {
  if (value == "") {
    uni.$showToast({
      title: "请输入账号查询",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  dataList.value = [];
  page.value = 1;
  loadFinish.value = false;
  getLogList();
};

const blur = (value) => {
  if (!value) return;
  if (value == "") {
    uni.$showToast({
      title: "请输入账号查询",
      duration: 3000,
      icon: "none",
    });
    return false;
  }

  keyword.value = value;

  dataList.value = [];
  page.value = 1;
  loadFinish.value = false;
  getLogList();

  getLogList();
};

const cancel = () => {
  keyword.value = "";
  currentId.value = "";
  dataList.value = [];

  page.value = 1;
  loadFinish.value = false;

  getLogList();
};

const reset = () => {
  currentLevel.value = null;
  keyword.value = "";
  currentId.value = "";
  dataList.value = [];
  loadFinish.value = false;

  page.value = 1;

  getLogList();
};

const chunk = (arr, size) =>
  // Use Array.from to create a new array with a length equal to the number of chunks needed
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    // For each element in the new array, slice the original array to extract a chunk of 'size' elements
    arr.slice(i * size, i * size + size)
  );
</script>

<style lang="scss" scoped>
.filterSelected {
  width: 58rpx;
  height: 6rpx;
  background-color: #252c2f;
}
</style>
