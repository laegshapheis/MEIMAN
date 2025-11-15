<template>
  <layout
    :isNav="true"
    bgType="bg-main4"
    ref="layoutRef"
    :refresher="true"
    @onRefresh="handleRefresh"
    navTitle="任务奖励"
    @navLeftClick="handleNavLeftClick"
    :isNavLeftBack="true"
    mode="white"
  >
    <!-- 已获取奖励 -->
    <view class="px-[32rpx] pt-[32rpx]">
      <view class="text-neutral-white text-[32rpx] font-semibold mb-[24rpx] w-full text-center">
        已获取奖励
      </view>
      
      <!-- 第一行：投资金额统计 -->
      <view class="flex flex-row justify-between mb-[16rpx]">
        <view class="bg-[#FFFFFF] rounded-[32rpx] p-[24rpx] flex-1 mr-[8rpx]">
          <view class="text-neutral-theme text-[24rpx] mb-[8rpx]">今日获得投资金额</view>
          <view class="text-black text-[32rpx] font-bold">{{ userStat.today_amount || '0.00' }} {{ symbolStore.code }}</view>
        </view>
        <view class="bg-[#FFFFFF] rounded-[32rpx] p-[24rpx] flex-1 ml-[8rpx]">
          <view class="text-neutral-theme text-[24rpx] mb-[8rpx]">累计获得投资金额</view>
          <view class="text-black text-[32rpx] font-bold">{{ userStat.total_amount || '0.00' }} {{ symbolStore.code }}</view>
        </view>
      </view>
      
      <!-- 第二行：提现金额统计 -->
      <view class="flex flex-row justify-between mb-[48rpx]">
        <view class="bg-[#FFFFFF] rounded-[32rpx] p-[24rpx] flex-1 mr-[8rpx]">
          <view class="text-neutral-theme text-[24rpx] mb-[8rpx]">今日获得提现金额</view>
          <view class="text-black text-[32rpx] font-bold">{{ userStat.today_money || '0.00' }} {{ symbolStore.code }}</view>
        </view>
        <view class="bg-[#FFFFFF] rounded-[32rpx] p-[24rpx] flex-1 ml-[8rpx]">
          <view class="text-neutral-theme text-[24rpx] mb-[8rpx]">累计获得提现金额</view>
          <view class="text-black text-[32rpx] font-bold">{{ userStat.total_money || '0.00' }} {{ symbolStore.code }}</view>
        </view>
      </view>
    </view>

    <!-- 正在进行中的任务 -->
    <view class="px-[32rpx] bg-[#FFFFFF] pt-[32rpx] rounded-[32rpx] rounded-b-none pb-[20rpx]">
      <view class="text-neutral-theme text-[32rpx] font-semibold text-center mb-[32rpx]">
        <text class="text-[#9AEEDE]">•</text> 正在进行中的任务 <text class="text-[#9AEEDE]">•</text>
      </view>
      
      <!-- 任务列表 -->
      <view class="space-y-[12rpx]">
        <!-- 直推新用户任务 -->
        <view 
          v-for="task in inviteActiveUsers" 
          :key="'invite_active_' + task.target_value"
          class="bg-[#F3F5FC] rounded-[16rpx] p-[32rpx] mb-[24rpx]"
        >
          <!-- 顶部标题和奖励金额 -->
          <view class="flex flex-row items-center mb-[16rpx] justify-between">
            <view class="flex flex-row items-center justify-center">
              <image src="@/static/images/task/task_invite.svg" class="w-[48rpx] h-[48rpx] mr-[16rpx]"/>
              <text class="text-neutral-theme text-sm font-semibold">{{ task.name }}</text>
            </view>
            <view v-if="task.now_value >= task.target_value" class="text-[#00C851] text-[24rpx]">
              已完成
            </view>
            <view v-else class="text-[#FF6B6B] text-[24rpx]">
              未完成
            </view>
          </view>
          <view class="w-full h-[1px] bg-[#000]/10 mb-[16rpx]"></view>
          <view class="text-black text-lg mb-[16rpx] w-full text-center bg-[#FFF] py-[8rpx] rounded-full">
            {{ task.title }}
          </view>
          <!-- 任务完成情况 -->
          <view class="bg-[#F3F5FC] rounded-[24rpx] rounded-b-none p-[24rpx] ">
            <view class="flex flex-row items-center justify-between">
              <text class="text-black text-sm">{{ task.task_title }}</text>
              <view class="flex flex-row items-center">
                <wk-button
                  size="small"
                  width="auto"
                  height="60rpx"
                  fontSize="24rpx"
                  borderRadius="40rpx"
                  :buttonStyle="{ padding: '0 24rpx', marginLeft: '16rpx' }"
                  @submit="handleInviteClick"
                >
                  邀请用户
                </wk-button>
              </view>
            </view>
          </view>
          
          <!-- 奖励规则说明 -->
          <view class="bg-[#F3F5FC] rounded-[24rpx] p-[24rpx] rounded-t-none">
            <view 
              v-for="(reward, index) in task.reward" 
              :key="index"
              class="text-[#252C2F]/75 text-sm leading-[32rpx] mb-[8rpx]"
            >
              <text>• {{ reward }}</text>
            </view>
          </view>
        </view>

        <!-- 复购用户任务 -->
        <view 
          v-for="task in inviteRepurchaseUsers" 
          :key="'invite_repurchase_' + task.target_value"
          class="bg-[#F3F5FC] rounded-[16rpx] p-[32rpx] mb-[24rpx]"
        >
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <view class="flex flex-row items-center justify-center">
              <view class="rounded-full flex items-center justify-center">
                <image src="@/static/images/task/task_invite.svg" class="w-[48rpx] h-[48rpx] mr-[16rpx]"/>
              </view>
              <text class="text-neutral-theme text-sm font-semibold">{{ task.name }}</text>
            </view>
            <view v-if="task.now_value >= task.target_value" class="text-[#00C851] text-[24rpx]">
              已完成
            </view>
            <view v-else class="text-[#FF6B6B] text-[24rpx]">
              未完成
            </view>
          </view>
          <view class="w-full h-[1px] bg-[#000]/10 mb-[16rpx]"></view>
          <view class="text-black text-lg mb-[16rpx] w-full text-center bg-[#FFF] py-[8rpx] rounded-full">
            {{ task.title }}
          </view>
          
          <!-- 奖励信息 -->
          <view class="bg-[#F3F5FC] rounded-[24rpx] rounded-b-none p-[24rpx] ">
            <view class="flex flex-row items-center justify-between">
              <text class="text-black text-sm">{{ task.task_title }}</text>
              <view class="flex flex-row items-center">
                <wk-button
                  size="small"
                  width="auto"
                  height="60rpx"
                  fontSize="24rpx"
                  borderRadius="40rpx"
                  :buttonStyle="{ padding: '0 24rpx', marginLeft: '16rpx' }"
                  @submit="handleInviteClick"
                >
                  邀请用户
                </wk-button>
              </view>
            </view>
          </view>
          <view class="bg-[#F3F5FC] rounded-[24rpx] p-[24rpx] rounded-t-none">
            <view 
              v-for="(reward, index) in task.reward" 
              :key="index"
              class="text-[#252C2F]/75 text-sm leading-[32rpx] mb-[8rpx]"
            >
              <text>• {{ reward }}</text>
            </view>
          </view>
        </view>

        <!-- 团队复购任务 -->
        <view 
          v-for="task in teamRepurchaseToday" 
          :key="'team_repurchase_' + task.target_value"
          class="bg-[#F3F5FC] rounded-[16rpx] p-[32rpx] mb-[24rpx]"
        >
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <view class="flex flex-row items-center">
              <view class="w-[48rpx] h-[48rpx] rounded-full flex items-center justify-center mr-[16rpx]">
                <image src="@/static/images/task/task_team.svg" class="w-[48rpx] h-[48rpx]"/>
              </view>
              <text class="text-neutral-theme text-sm font-semibold">{{ task.name }}</text>
            </view>
            <view v-if="task.now_value >= task.target_value" class="text-[#00C851] text-[24rpx]">
              已完成
            </view>
            <view v-else class="text-[#FF6B6B] text-[24rpx]">
              未完成
            </view>
          </view>
          <view class="w-full h-[1px] bg-[#000]/10 mb-[16rpx]"></view>
          
          <view class="text-black text-lg mb-[16rpx] w-full text-center bg-[#FFF] py-[8rpx] rounded-full">
            {{ task.title }}
          </view>
          
          <!-- 奖励信息 --> 
          <view class="bg-[#F3F5FC] rounded-[24rpx] rounded-b-none p-[24rpx] ">
            <view class="flex flex-row items-center justify-between">
              <text class="text-black text-sm">{{ task.task_title }}</text>
            </view>
          </view>
          <view class="bg-[#F3F5FC] rounded-[24rpx] p-[24rpx] rounded-t-none">
            <view 
              v-for="(reward, index) in task.reward" 
              :key="index"
              class="text-[#252C2F]/75 text-sm leading-[32rpx] mb-[8rpx]"
            >
              <text>• {{ reward }}</text>
            </view>
          </view>
        </view>

        <!-- 直推新用户今日任务 -->
        <view 
          v-for="task in directNewUserToday" 
          :key="'direct_new_' + task.target_value"
          class="bg-[#F3F5FC] rounded-[16rpx] p-[32rpx] mb-[24rpx]"
        >
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <view class="flex items-center justify-center">
              <view class="rounded-full flex items-center justify-center">
                <image src="@/static/images/task/task_invite.svg" class="w-[48rpx] h-[48rpx] mr-[16rpx]"/>
              </view>
              <text class="text-neutral-theme text-sm font-semibold">{{ task.name }}</text>
            </view>
            <view v-if="task.now_value >= task.target_value" class="text-[#00C851] text-[24rpx]">
              已完成
            </view>
            <view v-else class="text-[#FF6B6B] text-[24rpx]">
              未完成
            </view>
          </view>
          <view class="w-full mt-[16rpx] h-[1px] bg-[#333333] mb-[16rpx]"></view>
          <view class="text-black text-lg mb-[16rpx] w-full text-center bg-[#FFF] py-[8rpx] rounded-full">
            {{ task.title }}
          </view>
           <!-- 奖励信息 -->
           <view class="bg-[#F3F5FC] rounded-[24rpx] rounded-b-none p-[24rpx] ">
            <view class="flex flex-row items-center justify-between">
              <text class="text-black text-sm">{{ task.task_title }}</text>
              <view class="flex flex-row items-center">
                <wk-button
                  size="small"
                  width="auto"
                  height="60rpx"
                  fontSize="24rpx"
                  borderRadius="40rpx"
                  :buttonStyle="{ padding: '0 24rpx', marginLeft: '16rpx' }"
                  @submit="handleInviteClick"
                >
                  邀请用户
                </wk-button>
              </view>
            </view>
          </view>
          <view class="bg-[#F3F5FC] rounded-[24rpx] p-[24rpx] rounded-t-none">
            <view 
              v-for="(reward, index) in task.reward" 
              :key="index"
              class="text-[#252C2F]/75 text-sm leading-[32rpx] mb-[8rpx]"
            >
              <text>• {{ reward }}</text>
            </view>
          </view>
        </view>

        <!-- 团队新用户今日任务 -->
        <view 
          v-for="task in teamNewUserToday" 
          :key="'team_new_' + task.target_value"
          class="bg-[#F3F5FC] rounded-[16rpx] p-[32rpx] mb-[24rpx]"
        >
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <view class="flex flex-row items-center">
              <view class="w-[48rpx] h-[48rpx] rounded-full flex items-center justify-center mr-[16rpx]">
                <image src="@/static/images/task/task_team.svg" class="w-[48rpx] h-[48rpx]"/>
              </view>
              <text class="text-neutral-theme text-sm font-semibold">{{ task.name }}</text>
            </view>
            <view v-if="task.now_value >= task.target_value" class="text-[#00C851] text-[24rpx]">
              已完成
            </view>
            <view v-else class="text-[#FF6B6B] text-[24rpx]">
              未完成
            </view>
          </view>
          <view class="w-full h-[1px] bg-[#000]/10 mb-[16rpx]"></view>
          <view class="text-black text-lg mb-[16rpx] w-full text-center bg-[#FFF] py-[8rpx] rounded-full">
            {{ task.title }}
          </view>
          
          <!-- 奖励信息 -->
          <view class="bg-[#F3F5FC] rounded-[24rpx] rounded-b-none p-[24rpx] ">
            <view class="flex flex-row items-center justify-between">
              <text class="text-black text-sm">{{ task.task_title }}</text>
              <view class="flex flex-row items-center">
                <wk-button
                  size="small"
                  width="auto"
                  height="60rpx"
                  fontSize="24rpx"
                  borderRadius="40rpx"
                  :buttonStyle="{ padding: '0 24rpx', marginLeft: '16rpx' }"
                  @submit="handleInviteClick"
                >
                  邀请用户
                </wk-button>
              </view>
            </view>
          </view>
          <view class="bg-[#F3F5FC] rounded-[24rpx] p-[24rpx] rounded-t-none">
            <view 
              v-for="(reward, index) in task.reward" 
              :key="index"
              class="text-[#252C2F]/75 text-sm leading-[32rpx] mb-[8rpx]"
            >
              <text>• {{ reward }}</text>
            </view>
          </view>
        </view>

        <!-- 个人投资任务 -->
        <view 
          v-for="task in selfInvestTotalToday" 
          :key="'self_invest_' + task.target_value"
          class="bg-[#F3F5FC] rounded-[16rpx] p-[32rpx] mb-[24rpx]"
        >
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <view class="flex flex-row items-center">
              <view class="w-[48rpx] h-[48rpx] rounded-full flex items-center justify-center mr-[16rpx]">
                <image src="@/static/images/task/task_invest.svg" class="w-[48rpx] h-[48rpx]"/>
              </view>
              <text class="text-neutral-theme text-sm font-semibold">{{ task.name }}</text>
            </view>
            <view v-if="task.now_value >= task.target_value" class="text-[#00C851] text-[24rpx]">
              已完成
            </view>
            <view v-else class="text-[#FF6B6B] text-[24rpx]">
              未完成
            </view>
          </view>
          <view class="w-full h-[1px] bg-[#000]/10 mb-[16rpx]"></view>
          <view class="text-black text-lg mb-[16rpx] w-full text-center bg-[#FFF] py-[8rpx] rounded-full">
            {{ task.title }}
          </view>
          
          <!-- 奖励信息 -->
          <view class="mb-[16rpx]">
           
          <view class="bg-[#F3F5FC] rounded-[24rpx] p-[24rpx]">
            <view 
              v-for="(reward, index) in task.reward" 
              :key="index"
              class="text-[#252C2F]/75 text-sm leading-[32rpx] mb-[8rpx]"
            >
              <text>• {{ reward }}</text>
            </view>
            <view class="flex flex-row justify-between">
              <view class="text-black text-sm mt-[16rpx]">{{ task.task_title }}</view>
              <wk-button
                size="small"
                width="auto"
                height="60rpx"
                fontSize="24rpx"
                borderRadius="40rpx"
                :buttonStyle="{ padding: '0 24rpx' }"
                @submit="handleInvestClick"
              >
                去投资
              </wk-button>
          </view>
          <!-- 进度条 -->
          <view class="mt-[16rpx]">
            <sx-progress-anim :val="getProgressPercentage(parseFloat(task.now_value), task.target_value) + '%'" />
          </view>
          </view>
          
          </view>
          
          
        </view>

        <!-- 在投会员投资任务 -->
        <view 
          v-for="task in activeUsersInvestTotalToday" 
          :key="'active_invest_' + task.target_value"
          class="bg-[#F3F5FC] rounded-[16rpx] p-[32rpx] mb-[24rpx]"
        >
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <view class="flex flex-row items-center">
              <view class="w-[48rpx] h-[48rpx] rounded-full flex items-center justify-center mr-[16rpx]">
                <image src="@/static/images/task/task_invest.svg" class="w-[48rpx] h-[48rpx]"/>
              </view>
              <text class="text-neutral-theme text-sm font-semibold">{{ task.name }}</text>
            </view>
            <view v-if="parseFloat(task.now_value) >= task.target_value" class="text-[#00C851] text-[24rpx]">
              已完成
            </view>
            <view v-else class="text-[#FF6B6B] text-[24rpx]">
              未完成
            </view>
          </view>
          <view class="w-full h-[1px] bg-[#000]/10 mb-[16rpx]"></view>  
          <view class="text-black text-lg mb-[16rpx] w-full text-center bg-[#FFF] py-[8rpx] rounded-full">
            {{ task.title }}
          </view>
          
          <!-- 奖励信息 -->
          <view class="mb-[16rpx]">
            <view class="bg-[#F3F5FC] rounded-[24rpx] p-[24rpx]">
              <view 
                v-for="(reward, index) in task.reward" 
                :key="index"
                class="text-[#252C2F]/75 text-sm leading-[32rpx] mb-[8rpx]"
              >
                <text>• {{ reward }}</text>
              </view>
              <view class="flex flex-row justify-between">
                <view class="text-black text-sm mt-[16rpx]">{{ task.task_title }}</view>
                <wk-button
                  size="small"
                  width="auto"
                  height="60rpx"
                  fontSize="24rpx"
                  borderRadius="40rpx"
                  :buttonStyle="{ padding: '0 24rpx' }"
                  @submit="handleInvestClick"
                >
                  去投资
                </wk-button>
              </view>
              <!-- 进度条 -->
              <view class="mt-[16rpx]">
                <sx-progress-anim :val="getProgressPercentage(parseFloat(task.now_value), task.target_value) + '%'" />
              </view>
            </view>
          </view> 
        </view>

        <!-- 团队投资任务 -->
        <view 
          v-for="task in teamInvestTotalToday" 
          :key="'team_invest_' + task.target_value"
          class="bg-[#F3F5FC] rounded-[16rpx] p-[32rpx] mb-[24rpx] "
        >
          <view class="flex flex-row items-center justify-between mb-[16rpx]">
            <view class="flex flex-row items-center">
              <view class="rounded-full flex items-center justify-center">
                <image src="@/static/images/task/task_team.svg" class="w-[48rpx] h-[48rpx] mr-[16rpx]"/>
                <text class="text-neutral-theme text-sm font-semibold">{{ task.name }}</text>
              </view>
            </view>
            <view v-if="task.now_value >= task.target_value" class="text-[#00C851] text-[24rpx]">
              已完成
            </view>
            <view v-else class="text-[#FF6B6B] text-[24rpx]">
              未完成
            </view>
          </view>
          <view class="w-full h-[1px] bg-[#000]/10 mb-[16rpx]"></view>
          
          <view class="text-black text-lg mb-[16rpx] w-full text-center bg-[#FFF] py-[8rpx] rounded-full">
            {{ task.title }}
          </view>
          
          <!-- 奖励信息 -->
          <view class="mb-[16rpx]">
            <view class="bg-[#F3F5FC] rounded-[24rpx] p-[24rpx]">
              <view 
                v-for="(reward, index) in task.reward" 
                :key="index"
                class="text-[#252C2F]/75 text-sm leading-[32rpx] mb-[8rpx]"
              >
                <text>• {{ reward }}</text>
              </view>
              <view class="flex flex-row justify-between">
                <view class="text-black text-sm mt-[16rpx]">{{ task.task_title }}</view>
                <wk-button
                  size="small"
                  width="auto"
                  height="60rpx"
                  fontSize="24rpx"
                  borderRadius="40rpx"
                  :buttonStyle="{ padding: '0 24rpx' }"
                  @submit="handleInvestClick"
                >
                  去投资
                </wk-button>
              </view>
              <!-- 进度条 -->
              <view class="mt-[16rpx]">
                <sx-progress-anim :val="getProgressPercentage(parseFloat(task.now_value), task.target_value) + '%'" />
              </view>
            </view>
          </view> 
        </view>
      </view>
    </view>
  </layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getSpecializedTask } from '@/api/user'
import { useSymbolStore } from '@/stores/symbolStore'
import { routes } from '@/config/routes'
import SxProgressAnim from '@/components/sx-progress-anim/sx-progress-anim.vue'
import WkButton from '@/components/wk-button/wk-button.vue'

const symbolStore = useSymbolStore()

// 页面引用
const layoutRef = ref(null)

// 数据状态
const loading = ref(false)
const userStat = ref({
  total_amount: 0,
  today_amount: 0,
  today_money: 0,
  total_money: 0
})

// 任务列表数据
const inviteActiveUsers = ref([])
const inviteRepurchaseUsers = ref([])
const teamRepurchaseToday = ref([])
const directNewUserToday = ref([])
const teamNewUserToday = ref([])
const selfInvestTotalToday = ref([])
const activeUsersInvestTotalToday = ref([])
const teamInvestTotalToday = ref([])

// 计算进度百分比
const getProgressPercentage = (nowValue, targetValue) => {
  if (!targetValue || targetValue <= 0) return 0
  return Math.min((nowValue / targetValue) * 100, 100)
}

// 获取任务数据
const fetchTaskData = async () => {
  try {
    loading.value = true
    const response = await getSpecializedTask()
    console.log('response', response)
    if (response.status === 0) {
      const data = response.data
      
      // 设置用户统计
      userStat.value = {
        total_amount: data.user_stat?.total_amount || 0,
        today_amount: data.user_stat?.today_amount || 0,
        today_money: data.user_stat?.today_money || 0,
        total_money: data.user_stat?.total_money || 0
      }
      
      // 设置任务列表，为每个任务添加name字段
      inviteActiveUsers.value = (data.task_list?.invite_active_users || []).map(task => ({
        ...task,
        name: '直推在投会员任务'
      }))
      inviteRepurchaseUsers.value = (data.task_list?.invite_repurchase_users || []).map(task => ({
        ...task,
        name: '直推在投会员复购任务'
      }))
      teamRepurchaseToday.value = (data.task_list?.team_repurchase_today || []).map(task => ({
        ...task,
        name: '团队在投会员复购任务'
      }))
      directNewUserToday.value = (data.task_list?.direct_new_user_today || []).map(task => ({
        ...task,
        name: '直推新人投资任务'
      }))
      teamNewUserToday.value = (data.task_list?.team_new_user_today || []).map(task => ({
        ...task,
        name: '团队新增新人投资任务'
      }))
      selfInvestTotalToday.value = (data.task_list?.self_invest_total_today || []).map(task => ({
        ...task,
        name: '当日投资任务'
      }))
      activeUsersInvestTotalToday.value = (data.task_list?.active_users_invest_total_today || []).map(task => ({
        ...task,
        name: '在投会员任务'
      }))
      teamInvestTotalToday.value = (data.task_list?.team_invest_total_today || []).map(task => ({
        ...task,
        name: '团队投资任务'
      }))
    }
  } catch (error) {
    console.error('获取任务数据失败:', error)
    uni.$showToast({
      title: '获取数据失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 处理下拉刷新
const handleRefresh = () => {
  fetchTaskData().finally(() => {
    if (layoutRef.value) {
      layoutRef.value.complete()
    }
  })
}

// 处理导航左侧点击
const handleNavLeftClick = () => {
  uni.navigateBack()
}

// 跳转到邀请页面
const handleInviteClick = () => {
  uni.navigateTo({
    url: '/pages/invite/index'
  })
}

// 跳转到产品列表页面
const handleInvestClick = () => {
  uni.switchTab({
    url: routes.productList
  })
}

// 页面生命周期
onMounted(() => {
  fetchTaskData()
})
</script>

<style lang="scss" scoped>
// 使用项目中的样式变量和设计模式
.space-y-12rpx > view:not(:last-child) {
  margin-bottom: 12rpx;
}
</style>
