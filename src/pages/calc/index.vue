<template>
  <layout navTitle="计算器" bgType="bg-main1" :isLottie="false">
    <view class="px-[32rpx] pt-[24rpx] box-border w-full flex flex-col">
      <view
        class="mt-[32rpx] flex flex-col justify-between bg-black p-[32rpx] rounded-[32rpx] shadow-[0_0_16px_0_#266AFF_inset]">
        <view
          class="flex flex-row justify-between border-solid border-[rgba(255,255,255,0.25)] border-t-0 border-l-0 border-r-0 border-b-[0.5px]">
          <view class="w-[200rpx] flex flex-row items-center justify-between">
            <text class="text-base leading-6 text-white font-normal">投资金额（{{ symbolStore.symbol }}）</text>
          </view>

          <view class="flex flex-row items-center justify-center h-[112rpx] pr-[16rpx] rounded-[16rpx]">
            <uv-input class="h-[96rpx] items-right" maxlength="7" v-model="params.money" type="digit" inputAlign="right"
              placeholder="请输入投资金额" border="0" :placeholderStyle="{
                color: $colors.placeholder,
                fontSize: '28rpx',
              }" fontSize="28rpx" :color="$colors.DEFAULT" @input="handleAmountInput" />
          </view>

        </view>

        <view
          class="flex flex-row justify-between border-solid border-[rgba(255,255,255,0.25)] border-t-0 border-l-0 border-r-0 border-b-[0.5px]">
          <view class="flex flex-row items-center justify-between">
            <text class="text-base leading-6 text-white font-normal">投资模式</text>
          </view>

          <view class="flex flex-row items-center justify-center h-[112rpx] rounded-[16rpx]">
            <wk-picker style="width: 100%;" @change="handleChangeMethod" rangeKey="title" :range="methodList">
              <view class="flex flex-row justify-end">
                <text class="text-base text-neutral-placeholder" v-if="currentMethodIndex == -1">请选择投资模式</text>
                <text class="text-base font-semibold text-neutral" v-if="currentMethodIndex >= 0">{{
                  methodList[currentMethodIndex].title }}</text>


              </view>
            </wk-picker>

            <view class="flex flex-row items-center">
              <uv-icon class="ml-[10rpx]" size="28rpx" :color="$colors.placeholder" name="arrow-right"></uv-icon>
            </view>
          </view>

        </view>


        <view
          class="flex flex-row justify-between border-solid border-[rgba(255,255,255,0.25)] border-t-0 border-l-0 border-r-0 border-b-[0.5px]">
          <view class="flex flex-row items-center justify-between">
            <text class="text-base leading-6 text-white font-normal">利率（%）</text>
          </view>

          <view class="flex flex-row items-center justify-center h-[112rpx] pr-[16rpx] rounded-[16rpx]">
            <uv-input class="h-[96rpx]" v-model="params.lilv" type="digit" inputAlign="right" placeholder="请输入利率"
              border="0" :placeholderStyle="{
                color: $colors.placeholder,
                fontSize: '28rpx',
              }" fontSize="28rpx" :color="$colors.DEFAULT" @input="handleRateInput" />


          </view>
        </view>

        <view
          class="flex flex-row justify-between border-solid border-[rgba(255,255,255,0.25)] border-t-0 border-l-0 border-r-0 border-b-[0.5px]">
          <view class="flex flex-row items-center justify-between">
            <text class="text-base leading-6 text-white font-normal">时间（{{ getTimeUnit }}）</text>
          </view>

          <view class="flex flex-row items-center justify-center h-[112rpx] pr-[16rpx] rounded-[16rpx]">
            <uv-input class="h-[96rpx]" v-model="params.day" type="number" inputAlign="right" maxlength="3"
              placeholder="请输入时间" border="0" :placeholderStyle="{
                color: $colors.placeholder,
                fontSize: '28rpx',
              }" fontSize="28rpx" :color="$colors.DEFAULT" @input="handleDaysInput" />


          </view>
        </view>

        <template v-if="
          currentMethodIndex >= 0 &&
          (methodList[currentMethodIndex].id == 2 ||
            methodList[currentMethodIndex].id == 7 ||
            methodList[currentMethodIndex].id == 9)
        ">
          <view
            class="flex flex-row justify-between border-[length:1rpx] border-solid border-neutral-divider border-t-0 border-l-0 border-r-0">
            <view class="flex flex-row items-center justify-between">
              <text class="text-base leading-6 font-medium">周期</text>
            </view>

            <view class="flex flex-row items-center justify-center h-[112rpx] pr-[16rpx] rounded-[16rpx]">
              <uv-input class="h-[96rpx]" v-model="params.zhouqi" type="number" inputAlign="right" placeholder="请输入周期"
                border="0" :placeholderStyle="{
                  color: $colors.placeholder,
                  fontSize: '28rpx',
                }" fontSize="28rpx" :color="$colors.DEFAULT" />
            </view>
          </view>
        </template>

        <!-- 按钮 -->
        <view class="pt-[44rpx] pb-[24rpx]">
          <wk-button height="80rpx" fontSize="30rpx" @submit="calc">
            计算收益
          </wk-button>
        </view>


      </view>

      <!-- 结果弹窗 -->
      <uv-popup ref="resultPopup" type="bottom" bgColor="transparent" :safeAreaInsetBottom="true">
        <view class="flex flex-col bg-[rgba(31,25,125,1)] overflow-hidden rounded-t-[24rpx]" v-if="result.list.length > 0">
          <!-- 总计本息区域 -->
          <view
            class="w-full border-b border-[rgba(71,81,84,0.2)] border-solid border-[0.5px] box-border flex flex-col items-center py-[26rpx]">
            <view class="flex flex-col justify-center items-center">
              <text class="text-white text-lg leading-[44rpx] font-medium text-center">总计本息</text>
              <text class="text-white text-xl leading-[48rpx] font-bold text-center mt-[8rpx]">
                {{ result.zongshouyi }} {{ symbolStore.symbol }}
              </text>
            </view>
          </view>
          <scroll-view scroll-y class="w-full flex flex-col" :style="{ maxHeight: '800rpx' }">
            <!-- 表格区域 -->
            <view class="w-full box-border flex flex-col items-center px-[32rpx]">
              <view class="w-full box-border  overflow-hidden rounded-[32rpx] bg-[rgba(18,30,62,1)] flex flex-col">
                <!-- 表头 -->
                <view
                  class="w-full box-border overflow-hidden border-[rgba(255,255,255,0.25)] border-solid border-b-[0.5px] border-t-0 border-l-0 border-r-0 box-border flex flex-row justify-end items-center px-[32rpx] py-[22rpx]">
                  <view class="w-full flex flex-row justify-start items-center">
                    <text class="w-[155.5rpx] text-white text-[30rpx] leading-[48rpx] font-normal text-left">收款日期</text>
                    <text
                      class="w-[155.5rpx] text-white text-[30rpx] leading-[48rpx] font-normal text-center">收回本金</text>
                    <text
                      class="w-[155.5rpx] text-white text-[30rpx] leading-[48rpx] font-normal text-center">收回利息</text>
                    <text
                      class="w-[155.5rpx] text-white text-[30rpx] leading-[48rpx] font-normal text-right">剩余本金</text>
                  </view>
                </view>

                <!-- 数据行 -->
                <view
                  class="w-full overflow-hidden border-[rgba(12,5,47,1)] border-solid border-b-[0.5px] border-t-0 border-l-0 border-r-0 box-border flex flex-row items-center px-[32rpx] py-[22rpx]"
                  v-for="(item, index) in result.list" :key="index">
                  <view class="w-full flex flex-row justify-start items-center">
                    <text
                      class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-left whitespace-nowrap">{{
                        item.shoukuanriqi
                      }}</text>
                    <text class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-center">{{
                      item.shouhuibenjin }}</text>
                    <text class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-center">{{
                      item.shouhuilixi }}</text>
                    <text class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-right">{{
                      item.shengyubenjin }}</text>
                  </view>
                </view>

                <!-- 总计行 -->
                <view
                  class="w-full overflow-hidden border-b border-[rgba(12,5,47,1)] border-solid border-[0.5px] box-border flex flex-row items-center px-[32rpx] py-[22rpx]">
                  <view class="w-full flex flex-row justify-start items-center">
                    <text class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-left">总结</text>
                    <text class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-center">{{
                      result.money
                      }}</text>
                    <text class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-center">{{
                      result.sumnum }}</text>
                    <text class="w-[155.5rpx] text-white text-[28rpx] leading-[40rpx] font-normal text-right">{{
                      result.list[result.list.length - 1]?.shengyubenjin || 0 }}</text>
                  </view>
                </view>
              </view>
            </view>

            <!-- 提示文字 -->
            <view class="w-full flex flex-row justify-center items-center py-[16rpx]">
              <text class="text-[#B676FF] text-sm leading-[36rpx] font-normal">计算结果仅供参考！投资收益以真实数据为准</text>
            </view>
          </scroll-view>

          <!-- 按钮区域 -->
          <view class="w-full flex flex-col items-center">
            <view class="w-full box-border flex flex-col items-center py-[16rpx] px-[64rpx]">
              <wk-button height="80rpx" fontSize="30rpx" @submit="closeResultPopup">我知道了</wk-button>

            </view>

          </view>
        </view>
      </uv-popup>
    </view>
  </layout>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useSymbolStore } from "@/stores/symbolStore";
import { usePermissionStore } from "@/stores/permission";

const { hasPermission } = usePermissionStore();

const symbolStore = useSymbolStore();
const methodList = computed(() => {
  const baseList = [
    {
      id: 0,
      title: "按天付收益，到期返本",
    },

    {
      id: 1,
      title: "按天付收益，等额本息返还",
    },

    {
      id: 2,
      title: "按周期(天)付收益，到期返本",
    },

    {
      id: 3,
      title: "每日复利，保本保息",
    },

    {
      id: 4,
      title: "工作日付收益，到期返本",
    },

    {
      id: 7,
      title: "按周期(天)付收益，等额本息返还",
    },
  ];

  // 当 calc_hour_switch 为 1 时添加小时相关选项
  if (hasPermission("calc_hour_switch")) {
    baseList.push(
      {
        id: 8,
        title: "按小时付收益，到期返本",
      },
      {
        id: 9,
        title: "按周期(小时)付收益，到期返本",
      }
    );
  }

  return baseList;
});
const currentMethodIndex = ref(-1); // 联系人列表弹窗
const params = ref({});
const code = ref("");
const resultPopup = ref(null);

onLoad((options) => {
  const { type } = options;
  code.value = type;
});

const closeResultPopup = () => {
  if (resultPopup.value) {
    resultPopup.value.close();
  }
};

const handleAmountInput = (val) => {
  setTimeout(() => {
    params.value.money = parseInt(val);
  }, 0);
};

const handleRateInput = (val) => {
  let rateVal = val;
  if (val.includes(".")) {
    const parts = val.split(".");
    if (parts[1].length > 2) {
      rateVal = parts[0] + "." + parts[1].slice(0, 2);
    }
  }
  const numVal = parseFloat(val);
  if (numVal > 30) {
    rateVal = 30;
  }
  setTimeout(() => {
    params.value.lilv = rateVal;
  }, 0);
};

const handleDaysInput = (val) => {
  setTimeout(() => {
    params.value.day = parseInt(val);
  }, 0);
};

const handleChangeMethod = (e) => {
  currentMethodIndex.value = e.detail.value;
};
const formatDate = (date) => {
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isHoliday = (date) => {
  return date.getDay() === 0 || date.getDay() === 6;
};

const truncateDecimal = (value, decimalPlaces) => {
  const stringValue = value.toString();
  const decimalIndex = stringValue.indexOf(".");
  if (decimalIndex === -1) {
    return stringValue; // 没有小数点，直接返回原始值
  }
  return stringValue.slice(0, decimalIndex + decimalPlaces + 1);
};

const result = ref({
  list: [],
});

const getTimeUnit = computed(() => {
  if (currentMethodIndex.value >= 0) {
    const methodId = methodList.value[currentMethodIndex.value].id;
    if (methodId === 4) return "工作日";
    if ([8, 9].includes(methodId)) return "小时";
    return "天";
  }
  return "天";
});

const calc = () => {
  if (!params.value.money) {
    return uni.$showToast({
      title: "请输入投资金额",
      duration: 3000,
      icon: "none",
    });
  }

  if (currentMethodIndex.value == -1) {
    return uni.$showToast({
      title: "请选择投资方式",
      duration: 3000,
      icon: "none",
    });
  }

  if (!params.value.lilv) {
    return uni.$showToast({
      title: "请输入利率",
      duration: 3000,
      icon: "none",
    });
  }

  if (!params.value.day) {
    return uni.$showToast({
      title: "请输入时间",
      duration: 3000,
      icon: "none",
    });
  }

  if (
    [2, 7, 9].includes(methodList.value[currentMethodIndex.value].id) &&
    !params.value.zhouqi
  ) {
    return uni.$showToast({
      title: "请输入周期",
      duration: 3000,
      icon: "none",
    });
  }

  const money = params.value.money * 1;

  const { lilv, day, zhouqi } = params.value;

  const methodType = methodList.value[currentMethodIndex.value].id;

  let data = {
    money,
    list: [],
  };

  if (methodType == 3) {
    data.sumnum = truncateDecimal(
      money * Math.pow(1 + lilv / 100, day) - money,
      2
    );
  } else if (methodType == 5) {
    data.sumnum = truncateDecimal(((lilv * money) / 100) * day, 2);
  } else if (methodType == 2 || methodType == 7 || methodType == 9) {
    data.sumnum = truncateDecimal(((lilv * money) / 100) * day * zhouqi, 2);
  } else {
    data.sumnum = truncateDecimal(((lilv * money) / 100) * day, 2);
  }

  if (methodType == 0) {
    for (let i = 1; i <= day - 1; i++) {
      data.list.push({
        shoukuanriqi: formatDate(
          new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
        ),
        shoukuanjine: truncateDecimal((lilv * money) / 100, 2),
        shouhuibenjin: 0,
        shouhuilixi: truncateDecimal((lilv * money) / 100, 2),
        shengyubenjin: money,
      });
    }

    if (methodType == 0 || methodType == 2) {
      data.list.push({
        shoukuanriqi: formatDate(
          new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000)
        ),
        shoukuanjine: truncateDecimal((lilv * money) / 100 + money, 2),
        shouhuibenjin: money,
        shouhuilixi: truncateDecimal((lilv * money) / 100, 2),
        shengyubenjin: 0,
      });
    } else {
      data.list.push({
        shoukuanriqi: formatDate(
          new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000)
        ),
        shoukuanjine: truncateDecimal(
          (lilv * money) / 100 + money + (money * baifenbi) / 100,
          2
        ),
        shouhuibenjin: money,
        shouhuilixi: truncateDecimal(
          (lilv * money) / 100 + (money * baifenbi) / 100,
          2
        ),
        shengyubenjin: 0,
      });
    }
  }

  if (methodType == 1 || methodType == 5) {
    for (let i = 1; i <= day - 1; i++) {
      data.list.push({
        shoukuanriqi: formatDate(
          new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
        ),
        shoukuanjine: truncateDecimal((data.sumnum * 1 + money) / day, 2),
        shouhuibenjin: truncateDecimal(money / day, 2),
        shouhuilixi: truncateDecimal((data.sumnum * 1) / day, 2),
        shengyubenjin: truncateDecimal(money - (money / day) * i, 2),
      });
    }
    data.list.push({
      shoukuanriqi: formatDate(
        new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000)
      ),
      shoukuanjine: truncateDecimal((data.sumnum * 1 + money) / day, 2),
      shouhuibenjin: truncateDecimal(money / day, 2),
      shouhuilixi: 0,
      shengyubenjin: 0,
    });
  }
  if (methodType == 4) {
    var count = 0;
    var date = new Date(new Date().getTime() + count * 24 * 60 * 60 * 1000);
    while (count < day - 1) {
      if (!isHoliday(date)) {
        data.list.push({
          shoukuanriqi: formatDate(date),
          shoukuanjine: truncateDecimal((lilv * money) / 100, 2),
          shouhuibenjin: 0,
          shouhuilixi: truncateDecimal((lilv * money) / 100, 2),
          shengyubenjin: money,
        });
        count++;
      }
      date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    }

    while (isHoliday(date)) {
      date = new Date(date.getTime() + 24 * 60 * 60 * 1000);
    }
    data.list.push({
      shoukuanriqi: formatDate(
        // new Date(date + 24 * 60 * 60 * 1000)
        date
      ),
      shoukuanjine: truncateDecimal((lilv * money) / 100 + money, 2),
      shouhuibenjin: money,
      shouhuilixi: truncateDecimal((lilv * money) / 100, 2),
      shengyubenjin: 0,
    });
  }

  if (methodType == 3) {
    data.summoney = money;
    for (let i = 1; i <= day - 1; i++) {
      data.list.push({
        shoukuanriqi: formatDate(
          new Date(new Date().getTime() + i * 24 * 60 * 60 * 1000)
        ),
        shoukuanjine: truncateDecimal((lilv * data.summoney) / 100, 2),
        shouhuibenjin: 0,
        shouhuilixi: truncateDecimal((lilv * data.summoney) / 100, 2),
        shengyubenjin: truncateDecimal(data.summoney, 2),
      });
      data.summoney =
        truncateDecimal(data.summoney * 1 + (lilv * data.summoney) / 100, 2) *
        1;
    }

    data.list.push({
      shoukuanriqi: formatDate(
        new Date(new Date().getTime() + day * 24 * 60 * 60 * 1000)
      ),
      shoukuanjine: truncateDecimal(data.sumnum * 1 + money, 2),
      shouhuibenjin: data.summoney,
      shouhuilixi: truncateDecimal((lilv * data.summoney) / 100, 2),
      shengyubenjin: 0,
    });
  }

  if (methodType == 2) {
    for (let i = 1; i <= zhouqi - 1; i++) {
      data.list.push({
        shoukuanriqi: formatDate(
          new Date(new Date().getTime() + i * day * 24 * 60 * 60 * 1000)
        ),
        shoukuanjine: truncateDecimal((lilv * money) / 100, 2),
        shouhuibenjin: 0,
        shouhuilixi: truncateDecimal(((lilv * money) / 100) * day, 2),
        shengyubenjin: money,
      });
    }
    data.list.push({
      shoukuanriqi: formatDate(
        new Date(new Date().getTime() + zhouqi * day * 24 * 60 * 60 * 1000)
      ),
      shoukuanjine: truncateDecimal((lilv * money) / 100 + money, 2),
      shouhuibenjin: money,
      shouhuilixi: truncateDecimal(((lilv * money) / 100) * day, 2),
      shengyubenjin: 0,
    });
  }

  if (methodType == 7) {
    // 计算每期应还金额(本息)
    const totalAmount = money + data.sumnum * 1; // 总本息
    const periodPayment = truncateDecimal(totalAmount / zhouqi, 2); // 每期还款金额
    const periodPrincipal = truncateDecimal(money / zhouqi, 2); // 每期本金

    let remainingPrincipal = money; // 剩余本金

    for (let i = 1; i <= zhouqi; i++) {
      const isLastPeriod = i === zhouqi;
      const currentPeriodPrincipal = isLastPeriod
        ? remainingPrincipal
        : periodPrincipal;
      const currentPeriodInterest = isLastPeriod
        ? truncateDecimal(totalAmount - periodPayment * (zhouqi - 1), 2) -
        currentPeriodPrincipal
        : truncateDecimal(periodPayment - periodPrincipal, 2);

      data.list.push({
        shoukuanriqi: formatDate(
          new Date(new Date().getTime() + i * day * 24 * 60 * 60 * 1000)
        ),
        shoukuanjine: truncateDecimal(
          currentPeriodPrincipal + currentPeriodInterest,
          2
        ),
        shouhuibenjin: currentPeriodPrincipal,
        shouhuilixi: currentPeriodInterest,
        shengyubenjin: truncateDecimal(
          remainingPrincipal - currentPeriodPrincipal,
          2
        ),
      });

      remainingPrincipal = truncateDecimal(
        remainingPrincipal - currentPeriodPrincipal,
        2
      );
    }
  }

  if (methodType === 8) {
    // 按小时付收益，到期返本
    for (let i = 1; i <= day - 1; i++) {
      data.list.push({
        shoukuanriqi: formatDateWithHour(
          new Date(new Date().getTime() + i * 60 * 60 * 1000)
        ),
        shoukuanjine: truncateDecimal((lilv * money) / 100, 2),
        shouhuibenjin: 0,
        shouhuilixi: truncateDecimal((lilv * money) / 100, 2),
        shengyubenjin: money,
      });
    }

    // 最后一次返还本金
    data.list.push({
      shoukuanriqi: formatDateWithHour(
        new Date(new Date().getTime() + day * 60 * 60 * 1000)
      ),
      shoukuanjine: truncateDecimal((lilv * money) / 100 + money, 2),
      shouhuibenjin: money,
      shouhuilixi: truncateDecimal((lilv * money) / 100, 2),
      shengyubenjin: 0,
    });
  } else if (methodType === 9) {
    // 按周期(小时)付收益，到期返本
    for (let i = 1; i <= zhouqi - 1; i++) {
      data.list.push({
        shoukuanriqi: formatDateWithHour(
          new Date(new Date().getTime() + i * day * 60 * 60 * 1000)
        ),
        shoukuanjine: truncateDecimal((lilv * money * day) / 100, 2),
        shouhuibenjin: 0,
        shouhuilixi: truncateDecimal((lilv * money * day) / 100, 2),
        shengyubenjin: money,
      });
    }

    // 最后一次返还本金
    data.list.push({
      shoukuanriqi: formatDateWithHour(
        new Date(new Date().getTime() + zhouqi * day * 60 * 60 * 1000)
      ),
      shoukuanjine: truncateDecimal((lilv * money * day) / 100 + money, 2),
      shouhuibenjin: money,
      shouhuilixi: truncateDecimal((lilv * money * day) / 100, 2),
      shengyubenjin: 0,
    });
  }

  data.zongshouyi = truncateDecimal(
    data.sumnum * 1 + money,
    // this.sumnum * 1,
    2
  );

  result.value = data;

  // 打开结果弹窗
  if (resultPopup.value) {
    resultPopup.value.open("bottom");
  }
};

// 添加新的日期格式化函数，包含小时显示
const formatDateWithHour = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  return `${month}-${day} ${hour}:00`;
};
</script>

<style lang="scss" scoped></style>