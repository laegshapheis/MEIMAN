<template>
  <layout ref="layoutRef" navTitle="奖励记录" bgType="bg-question" mode="white" :isLottie="false" :refresher="true" @onRefresh="handleRefresh"
    @reachBottom="handleReachBottom">
    <view class="px-4 py-4">
      <!-- 奖励记录列表 -->
      <view v-if="rewardList.length > 0" class="space-y-3">
        <view v-for="item in rewardList" :key="item.id"
          class="rounded-xl p-3 shadow-sm border border-gray-100 mb-[24rpx]"
          :style="{
            border: '0.5px solid rgba(9, 91, 255, 0.26)',
            background: 'linear-gradient(90deg, rgba(9, 91, 255, 0.26) 0%, rgba(35, 31, 54, 0.00) 100%), radial-gradient(31.95% 175.57% at 50% 0%, rgba(3, 12, 65, 0.20) 0%, rgba(0, 13, 54, 0.00) 100%), radial-gradient(62.9% 93.78% at 64.37% 100%, rgba(0, 59, 186, 0.90) 0%, rgba(3, 0, 69, 0.00) 100%), linear-gradient(289deg, #00188F 11.52%, rgba(0, 4, 76, 0.00) 48.94%), radial-gradient(111.34% 65.45% at 5.1% 92.73%, rgba(0, 33, 141, 0.70) 0%, rgba(13, 11, 56, 0.00) 100%), radial-gradient(136.88% 57.56% at 10.78% 76.88%, rgba(38, 57, 110, 0.90) 0%, rgba(32, 34, 52, 0.00) 100%), linear-gradient(90deg, #0737FF 0%, #000E4E 20.91%, rgba(3, 11, 73, 0.00) 86.24%), linear-gradient(90deg, #20202B 0%, #232A3A 100%)'
          }">
          <view class="flex items-center justify-between mb-3 ">
            <view class="flex items-center">
              <view class="w-[80rpx] h-[80rpx] flex items-center justify-center mr-3">
                <image src="/static/images/daily_quiz/icon.png" class="w-[80rpx] h-[80rpx]" mode="aspectFit" />
              </view>
              <view>
                <text class="text-white text-lg">
                  奖励投资金额 {{ item.reward_amount }} {{ symbolStore.unit }}
                </text>
              </view>
            </view>
          </view>
          <view class="h-[2rpx] w-full" style="background-color: rgba(0, 178, 242, 0.10);"></view>

          <view class="ml-15 flex flex-col mt-[24rpx]">
            <text class="text-white/50 text-sm">
              答对题数: {{ item.total_correct }}
            </text>
            <text class="text-white/50 text-sm">
              获得时间: {{ formatTime(item.created_at) }}
            </text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <Empty title="暂无奖励记录" image="/static/images/daily_quiz/empty.png" width="320rpx" height="320rpx" color="#fff" v-if="!loading && rewardList.length === 0"  />

      <!-- 加载状态 -->
      <view v-if="loading && rewardList.length === 0" class="flex justify-center py-20">
        <text class="text-gray-500">加载中...</text>
      </view>

      <!-- 加载更多 -->
      <view v-if="loadingMore" class="flex justify-center py-4">
        <text class="text-gray-500 text-sm">加载更多...</text>
      </view>

      <!-- 没有更多数据 -->
      <view v-if="!hasMore && rewardList.length > 0" class="flex justify-center py-4">
        <text class="text-gray-400 text-sm">没有更多数据了</text>
      </view>
    </view>
  </layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getRewardRecords } from '@/api/index'
import Empty from '@/components/base/empty'
import { useSymbolStore } from '@/stores/symbolStore'

const symbolStore = useSymbolStore()

// 状态管理
const rewardList = ref([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)
const layoutRef = ref(null)

// 获取奖励记录
const fetchRewardRecords = async (page = 1, isRefresh = false) => {
  try {
    if (page === 1) {
      loading.value = true
    } else {
      loadingMore.value = true
    }

    const response = await getRewardRecords({
      page: page.toString(),
      pagesize: pageSize.value.toString()
    })
    console.log('获取奖励记录:', response)

    if (response.status === 0) {
      const { list, pagination } = response.data

      if (isRefresh || page === 1) {
        rewardList.value = list
      } else {
        rewardList.value.push(...list)
      }

      // 检查是否还有更多数据
      hasMore.value = pagination.page < pagination.total_page
      currentPage.value = parseInt(pagination.page)
    } else {
      uni.showToast({ title: response.msg || '获取数据失败', icon: 'none' })
    }
  } catch (error) {
    console.error('获取奖励记录失败:', error)
    uni.showToast({ title: '网络错误，请重试', icon: 'none' })
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

// 下拉刷新
const handleRefresh = async () => {
  currentPage.value = 1
  hasMore.value = true
  await fetchRewardRecords(1, true)
  // 完成下拉刷新
  if (layoutRef.value) {
    layoutRef.value.complete()
  }
}

// 上拉加载更多
const handleReachBottom = () => {
  if (hasMore.value && !loadingMore.value && !loading.value) {
    fetchRewardRecords(currentPage.value + 1)
  }
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`
}

// 页面加载时获取数据
onMounted(() => {
  fetchRewardRecords()
})
</script>

<style scoped>
/* 自定义样式 */
</style>
