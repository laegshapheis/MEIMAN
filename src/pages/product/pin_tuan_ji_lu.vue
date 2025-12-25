<template>
  <layout ref="layoutRef" :refresher="true" @onRefresh="handleRefresh" navTitle="拼团记录" bgType="bg-main1"
    :isLottie="false" @reachBottom="handleReachBottom" :isNavLeftBackClick="false" @navLeftClick="handleNavLeftClick">
    <template v-slot:navRight>
      <view class="flex flex-row items-center bg-white/10 rounded-full px-[16rpx] py-[8rpx] pt-[5rpx]">
        <text class="text-white text-base" @click="handleRuleShow">拼团规则</text>
      </view>
    </template>
    <template v-slot:exp>
      <view class="px-[32rpx] mt-[24rpx]">
        <wk-tabs :list="navList" :current="listIdx" @change="setNav" mode="card" :inactiveStyle="{
          width: '100%',
          textAlign: 'center',
        }" :activeStyle="{
          width: '100%',
          textAlign: 'center',
        }" :scrollable="false"></wk-tabs>
      </view>
    </template>
    <!-- 内容区域 => 开始 -->
    <view class="px-[32rpx] pt-[24rpx]">
      <!-- 我发起的 -->
      <template v-for="item in dataAList" :key="item.id">
        <view shadow v-if="listIdx == 0" class="mb-[24rpx] bg-black p-[32rpx] rounded-[32rpx] shadow-[0_0_16px_0_#266AFF_inset]" size="small">
          <view class="">
            <view class="text-neutral text-xl font-medium">{{item.title}}</view>
          </view>
          <view class="flex flex-row justify-between mt-[24rpx]">
            <view class="flex items-center">
              <text class="text-neutral-regular/80 text-sm">记录编号:</text>
              <text class="text-neutral-regular/80 text-sm ml-[16rpx]">{{
                item.orderid
              }}</text>
            </view>
            <view :class="[
              'text-sm',
              item.status == 0
                ? 'text-neutral'
                : item.status == 1
                  ? 'text-neutral-theme'
                  : 'text-neutral-error',
            ]">{{
              item.status == 0
                ? "拼团中"
                : item.status == 1
                  ? "拼团成功"
                  : "拼团失败"
            }}</view>
          </view>
          <view class="">
            <text class="text-neutral-regular/80 text-sm">发起时间:</text>
            <text class="text-neutral-regular/80 text-sm ml-[16rpx]">{{
              item.created_at
            }}</text>
          </view>
          <view
            class="gap-[16rpx] rounded-[16rpx] p-[24rpx] mt-[24rpx] py-[24rpx] flex flex-col flex-wrap mb-[16rpx] bg-[#1F197D]">
            <view
              class="flex flex-row justify-between items-center pb-[16rpx] border-[length:1rpx] border-white/10 border-solid border-t-0 border-l-0 border-r-0">
              <view class="text-neutral-regular/80 text-sm">投资金额</view>
              <view>
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.selfmoney
                }}</text>
                <text class="text-neutral text-base">{{
                  symbolStore.code
                }}</text>
              </view>
            </view>
            <view
              class="flex flex-row justify-between items-center pb-[16rpx] border-[length:1rpx] border-white/10 border-solid border-t-0 border-l-0 border-r-0">
              <view class="text-neutral-regular/80 text-sm">每人最低投资金额</view>
              <view>
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.money
                }}</text>
                <text class="text-neutral text-base">{{
                  symbolStore.code
                }}</text>
              </view>
            </view>
            <view
              class="flex flex-row justify-between items-center pb-[16rpx] border-[length:1rpx] border-white/10 border-solid border-t-0 border-l-0 border-r-0">
              <view class="text-neutral-regular/80 text-sm">计划参与人数</view>
              <view>
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.participant_limit
                }}</text>
                <text class="text-neutral text-base">人</text>
              </view>
            </view>
            <view
              class="flex flex-row justify-between items-center pb-[16rpx] border-[length:1rpx] border-white/10 border-solid border-t-0 border-l-0 border-r-0">
              <view class="text-neutral-regular/80 text-sm">当前参与人数</view>
              <view>
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.bugnumber
                }}</text>
                <text class="text-neutral text-base">人</text>
              </view>
            </view>
            <view class="flex flex-row justify-between items-center">
              <view class="text-neutral-regular/80 text-sm">团队总投资金额</view>
              <view>
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.allmoney
                }}</text>
                <text class="text-neutral text-base">{{
                  symbolStore.code
                }}</text>
              </view>
            </view>
            <view class="flex flex-row justify-between" v-if="false">
              <view class="text-neutral-regular text-base">拼团口令</view>
              <view>
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.group_buy_code
                }}</text>
              </view>
            </view>
          </view>
          <sx-count-down :updatedAt="item.updated_at"></sx-count-down>
          <wk-button type="none" background="transparent" borderColor="#fff" height="80rpx" class="mt-[12rpx]" @submit="$sxCopyText(item.group_buy_code)">
            拼团口令：{{ item.group_buy_code }}
            <image src="/static/images/user/copy_white.svg" mode="widthFix" class="w-[40rpx] h-[40rpx] ml-[8rpx]">
            </image>
          </wk-button>
          <view
            class="bg-[#1F197D] text-neutral-regular/80 rounded-[24rpx] px-[16rpx] py-[8rpx] flex flex-row justify-between items-center mt-[24rpx]">
            <view class="text-sm">发起人信息</view>
            <view class="flex flex-row items-center">
              <image class="w-[32rpx] h-[32rpx] rounded-[40rpx]" src="/static/images/user/logo.png"></image>
              <text class="text-sm ml-[16rpx]">{{
                item.relaname
              }}</text>
              <text class="text-sm ml-[16rpx]">{{
                item.tele
              }}</text>
            </view>
          </view>
        </view>
      </template>
      <!-- 我参与 -->
      <template v-for="item in dataBList" :key="item.id">
        <view shadow v-if="listIdx == 1" class="mb-[24rpx] bg-black p-[32rpx] rounded-[32rpx] shadow-[0_0_16px_0_#266AFF_inset]" size="small">
          <view class="">
            <view class="text-neutral text-xl font-medium">{{
              item.title
            }}</view>
          </view>
          <view class="flex flex-row justify-between mt-[24rpx]">
            <view class="flex flex-row items-center">
              <text class="text-neutral-regular/80 text-sm">记录编号</text>
              <text class="text-neutral-regular text-base ml-[16rpx]">{{
                item.orderid
              }}</text>
            </view>
            <view :class="[
              'text-base',
              item.status == 0
                ? 'text-neutral'
                : item.status == 1
                  ? 'text-neutral-theme'
                  : 'text-neutral-error',
            ]">{{
              item.status == 0
                ? "拼团中"
                : item.status == 1
                  ? "拼团成功"
                  : "拼团失败"
            }}</view>
          </view>
          <view class="line-m-str">
            <text class="text-neutral-regular/80 text-sm">参与时间</text>
            <text class="text-neutral-regular text-base ml-[16rpx]">{{
              item.created_at
            }}</text>
          </view>
          <view
            class="rounded-[16rpx] p-[24rpx] gap-[16rpx] mt-[24rpx] py-[24rpx] flex flex-col bg-[#1F197D]">
            <view
              class="flex flex-row justify-between items-center pb-[16rpx] border-[length:1rpx] border-white/10 border-solid border-t-0 border-l-0 border-r-0">
              <view class="text-neutral-regular/80 text-sm">投资金额</view>
              <view class="flex flex-row">
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.selfmoney
                }}</text>
                <text class="text-neutral text-base">{{
                  symbolStore.code
                }}</text>
              </view>
            </view>
            <view
              class="flex flex-row justify-between items-center pb-[16rpx] border-[length:1rpx] border-white/10 border-solid border-t-0 border-l-0 border-r-0">
              <view class="text-neutral-regular/80 text-sm">每人最低投资金额</view>
              <view class="flex flex-row">
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.money
                }}</text>
                <text class="text-neutral text-base">{{
                  symbolStore.code
                }}</text>
              </view>
            </view>
            <view
              class="flex flex-row justify-between items-center pb-[16rpx] border-[length:1rpx] border-white/10 border-solid border-t-0 border-l-0 border-r-0">
              <view class="text-neutral-regular/80 text-sm">计划参与人数</view>
              <view class="flex flex-row">
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.renshu
                }}</text>
                <text class="text-neutral text-base">人</text>
              </view>
            </view>
            <view
              class="flex flex-row justify-between items-center pb-[16rpx] border-[length:1rpx] border-white/10 border-solid border-t-0 border-l-0 border-r-0">
              <view class="text-neutral-regular/80 text-sm">当前参与人数</view>
              <view class="flex flex-row">
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.renshu2
                }}</text>
                <text class="text-neutral text-base">人</text>
              </view>
            </view>
            <view class="flex flex-row justify-between items-center">
              <view class="text-neutral-regular/80 text-sm">团队总投资金额</view>
              <view class="flex flex-row">
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.allmoney
                }}</text>
                <text class="text-neutral text-base">{{
                  symbolStore.code
                }}</text>
              </view>
            </view>
            <view class="flex flex-row justify-between" v-if="false">
              <view class="text-neutral-regular text-base">拼团口令</view>
              <view class="flex flex-row">
                <text class="text-neutral text-base font-bold mr-[8rpx]">{{
                  item.group_buy_code
                }}</text>
              </view>
            </view>
          </view>
          <wk-button type="none" background="transparent" borderColor="#fff" height="80rpx" class="mt-[24rpx]" @submit="$sxCopyText(item.group_buy_code)">
            拼团口令：{{ item.group_buy_code }}
            <image src="/static/images/user/copy_white.svg" mode="widthFix" class="w-[40rpx] h-[40rpx] ml-[8rpx]">
            </image>
          </wk-button>
          <view class="text-base mt-[24rpx]">参与人信息</view>
          <view v-for="itemx in item.joinlist"
            class="bg-[#1F197D] text-neutral-regular/80 rounded-[24rpx] px-[16rpx] py-[8rpx] flex flex-row items-center justify-between mt-[15rpx]"
            :key="itemx.id">
            <view class="flex flex-row items-center">
              <image class="w-[32rpx] h-[32rpx] rounded-[40rpx]" src="/static/images/user/logo.png"></image>
              <text class="text-sm ml-[16rpx]">{{
                itemx.relaname
              }}</text>
              <text class="text-sm ml-[16rpx]">{{
                itemx.tele
              }}</text>
            </view>
            <view class="text-sm text-white">{{ itemx.money }} {{ symbolStore.code }}</view>
          </view>
        </view>
      </template>
      <Empty class="mt-[300rpx]" v-if="
        (listIdx == 0 && dataAList.length == 0) ||
        (listIdx == 1 && dataBList.length == 0)
      " />
    </view>
    <!-- 内容区域 => 结束 -->
    <wk-modal ref="wkPopupRef" :title="noticeTitle || '拼团规则'">
      <uv-parse :show-img-menu="false" container-style="white-space: pre-wrap" :content="noticeText"></uv-parse>
    </wk-modal>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onBackPress } from "@dcloudio/uni-app";
import Empty from "../../components/base/empty.vue";
import { useSymbolStore } from "@/stores/symbolStore";
import { getGroupList, getJoinGroupList } from "@/api/user";
import { cacheManager } from "@/utils/cacheManager";

const cacheData = cacheManager.getCache("pinTuanJiLu");
const cacheDataJoin = cacheManager.getCache("pinTuanJiLuJoin");

const symbolStore = useSymbolStore();
const layoutRef = ref(null);
const wkPopupRef = ref(null);

const noticeTitle = ref("");
const noticeText = ref("");
const listIdx = ref(0);
const navList = ref([
  { name: "我发起的", id: 0 },
  { name: "我参与的", id: 1 },
]);

const dataAList = ref([]);
const dataBList = ref([]);
const finishedA = ref(false);
const finishedB = ref(false);
const page = ref(1);
const path = ref("");
const loading = ref(false);
const loadingText = ref("");

// 方法定义
const handleNavLeftClick = () => {
  if (path.value) {
    uni.switchTab({ url: path.value });
  } else {
    uni.navigateBack();
  }
};

const handleReachBottom = () => {
  page.value++;
  if (listIdx.value == 0) {
    grouplist();
  }
  if (listIdx.value == 1) {
    joingrouplist();
  }
};

const initData = () => {
  page.value = 1;
  if (listIdx.value == 0) {
    if (cacheData) {
      handleGroupList(cacheData);
    }
    finishedA.value = false;
    dataAList.value = [];
    grouplist();
  }
  if (listIdx.value == 1) {
    if (cacheDataJoin) {
      handleJoinGroupList(cacheDataJoin);
    }
    finishedB.value = false;
    dataBList.value = [];
    joingrouplist();
  }
};

const handleRefresh = () => {
  initData();
};

const handleRuleShow = () => {
  wkPopupRef.value.open();
};

const setNav = ({ index }) => {
  listIdx.value = index;
  initData();
};

const handleGroupList = (res) => {
  if (res.list.data.length > 0) {
    dataAList.value = dataAList.value.concat(res.list.data);
    if (res.list.total == dataAList.value.length) {
      finishedA.value = true;
    }
  }
  noticeText.value = res.grouprules || "";
  loading.value = false;
};
const grouplist = async () => {
  if (finishedA.value || loading.value) return;
  loading.value = true;
  loadingText.value = "加载中...";
  const res = await getGroupList({ page: page.value });
  if (page.value == 1) {
    cacheManager.setCache("pinTuanJiLu", res);
  }
  layoutRef.value.complete();
  handleGroupList(res);
};

const handleJoinGroupList = (res) => {
  if (res.list.data.length > 0) {
    dataBList.value = dataBList.value.concat(res.list.data);
    if (res.list.total == dataBList.value.length) {
      finishedB.value = true;
    }
  }
  noticeText.value = res.grouprules || "";
  loading.value = false;
};
const joingrouplist = async () => {
  if (loading.value) return;
  loading.value = true;
  loadingText.value = "加载中...";
  const res = await getJoinGroupList({ page: page.value });
  if (page.value == 1) {
    cacheManager.setCache("pinTuanJiLuJoin", res);
  }
  layoutRef.value.complete();
  handleJoinGroupList(res);
};

onBackPress((event) => {
  if (event.from == "backbutton") {
    handleNavLeftClick();
    return true;
  }
  return false;
});
onLoad((options) => {
  path.value = options.path;
  if (options.index) {
    setNav({ index: options.index });
  } else {
    if (cacheData) {
      handleGroupList(cacheData);
    }
    grouplist();
  }
});
</script>
