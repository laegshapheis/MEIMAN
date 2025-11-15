<template>
  <layout
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="奖励与收益明细"
    bgType="bg-main"
    @reachBottom="handleReachBottom"
  >
  <template v-slot:navRight>
      <view class="flex flex-row w-full items-center justify-end">
        <wk-picker
          mode="date"
          :value="timeDate ? timeDate : Number(new Date())"
          :minDate="startDate"
          :maxDate="endDate"
          @change="handleChangeDate"
        >
          <view>
              <view v-if="time_date == 0" class="flex items-center justify-center bg-black/10 w-[64rpx] h-[64rpx] rounded-full">  
                <image
                    
                    src="/static/images/user/date_icon.svg"
                    class="w-[32rpx] h-[32rpx]"
                  ></image>
              </view>
              <text v-else class="text-base text-neutral">{{ time_date }}</text>
            </view>
        </wk-picker>
        <view v-if="time_date != 0" 
          class=""
          @click="handleResetDate"
        >
          <uv-icon name="close-circle" size="30rpx" :color="$colors.regular"></uv-icon>
        </view>
      </view>
    </template>
    <template v-slot:exp>
      <view class="mt-[24rpx] mx-[32rpx]">
        <wk-tabs
          :list="tabs"
          :scrollable="true"
          :isButton="true"
          :current="currentIndex"
          @change="handleChangeTab"
          :inactiveStyle="{
            border: '0px solid #00000010',
            backgroundColor: 'transparent',
          }"
          />
      </view>
    </template>
    <view
      class="px-[32rpx] pb-[30rpx] box-border w-full flex flex-col"
    >
      <Empty class="mt-[300rpx]" title="暂无相关记录" v-if="dataList.length == 0" :color="$colors.regular"></Empty>

      <!-- start 列表 -->
      <view class="flex flex-col mt-[24rpx]">
        <wk-stroke-bg
          class="flex flex-col min-h-[100rpx] mb-[24rpx]"
          v-for="item in dataList"
          :key="item.id"
        >
          <view class="flex flex-col">

            <view class="flex flex-row justify-between">
              <text class="text-xl font-semibold">{{
                item.moneylog_notice
              }}</text>

              <text :class="['text-2xl font-bold text-neutral-theme text-right w-[150rpx]', item.moneylog_status == '-' ? 'text-neutral-error' : '']">{{
                item.moneylog_status + "" + item.moneylog_money
              }}</text>
          </view>

            <view class="flex flex-row justify-between mt-[16rpx]">
              <text class="text-base text-neutral-regular">{{
                item.created_at
              }}</text>
             
            </view>
          </view>

          <template v-if="item.yuan_title">
            <view
              class="flex flex-row my-[12rpx] h-[2rpx] bg-neutral-black/10"
            ></view>

            <view
              class="flex flex-row justify-start items-center leading-5 border pt-[16rpx]"
            >
              <view class="flex flex-col min-w-[50%]">
                <text class="text-lg font-bold text-black">{{
                  item.moneylog_yuanamount
                }}</text>
                <text class="text-sm text-neutral-regular mt-[4rpx]">{{
                  item.yuan_title
                }}</text>
              </view>

              <view class="flex flex-col">
                <text class="text-lg font-bold text-black">{{
                  item.moneylog_houamount
                }}</text>
                <text class="text-sm text-neutral-regular mt-[4rpx]">{{
                  item.hou_title
                }}</text>
              </view>
            </view>
          </template>

          <template
            v-for="(extItemList, extIndex) in chunk(item.ext_item_list, 2)"
            :key="`ext-row-${extIndex}`"
          >
           

            <view
              class="flex flex-row justify-start items-center leading-5 py-[16rpx]"
            >
              <view
                :class="[
                  'flex',
                  'flex-col',
                  extItemIndex == 0 ? 'min-w-[50%]' : '',
                ]"
                v-for="(extItem, extItemIndex) in extItemList"
                :key="`ext-clo-${extItemIndex}`"
              >
                <text class="text-lg font-semibold text-black">{{ extItem.value }}</text>
                <text class="text-sm text-neutral-regular">{{ extItem.title }}</text>
              </view>

              <!-- <view class="flex flex-col">
                <text class="text-lg font-semibold">{{ extItem.value }}</text>
                <text class="text-base">{{ extItem.title }}</text>
              </view> -->
            </view>
          </template>
        </wk-stroke-bg>
      </view>
      <!-- end 列表 -->
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import Empty from "@/components/base/empty";
import { getAccountDetailList as getAccountDetailListApi } from "@/api/user";

const layoutRef = ref(null);
const tabs = [
  {
    name: "投资余额",
    type: "jiangli_amount",
  },
  {
    name: "提现余额",
    type: "jiangli_tixian",
  },
  {
    name: "余额宝收益",
    type: "yuebao_profit",
  }
];

const dataList = ref([]);
const type = ref("jiangli_amount");
const currentIndex = ref(0);
const page = ref(1);
const finished = ref(false);
const loading = ref(false);
const loadingText = ref('');
onLoad((options) => {
  type.value = options.type;
  currentIndex.value = tabs.findIndex((item) => item.type == type.value);
  getLogList();
});
const startDate = computed(() => {
  return getDate("start");
});

const endDate = computed(() => {
  return getDate("end");
});

const timeDate = ref(0);
const time_date = ref(0);
const lock = ref(false)
const handleReachBottom = () => {
  getLogList();
}
const handleChangeDate = (e) => {
  timeDate.value = e.detail.value;
  time_date.value = e.detail.value;
  dataList.value = [];
  page.value = 1;
  finished.value = false;
  getLogList();
};
const getDate = (type) => {
  const date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (type === "start") {
    year = year - 30;
  } else if (type === "end") {
    year = year + 80;
  }
  month = month > 9 ? month : "0" + month;
  day = day > 9 ? day : "0" + day;
  return `${year}-${month}-${day}`;
};
const handleRefresh = async () => {
  page.value = 1;
  dataList.value = [];
  finished.value = false;
  await getLogList();
  layoutRef.value.complete();
};

const getLogList = async () => {
  if(finished.value) {
    return;
  }
  loading.value = true;
  loadingText.value = '加载中...'
  const result = await getAccountDetailListApi({
    type: type.value,
    times: timeDate.value,
    page: page.value,
  });
  console.log(result);

  if (result.status && result.status != 0) {
    loading.value = false;
    uni.$showToast({
      title: result.msg,
      duration: 3000,
      icon: "none",
    });
    return;
  }
  dataList.value = result.data ? [...dataList.value, ...result.data.list] : [];
  if (dataList.value.length >= result.data.pagination.total) {
    finished.value = true;
  } else {
    page.value++;
  }
  loading.value = false;
};

const handleChangeTab = (item) => {
  currentIndex.value = item.index;
  type.value = item.type;
  page.value = 1;
  dataList.value = [];
  finished.value = false;
  getLogList();
};

const chunk = (a, n) =>
  [...Array(Math.ceil(a.length / n))].map((_, i) => a.slice(n * i, n + n * i));

const handleResetDate = () => {
  timeDate.value = 0;
  time_date.value = 0;
  dataList.value = [];
  page.value = 1;
  finished.value = false;
  getLogList();
}
</script>
