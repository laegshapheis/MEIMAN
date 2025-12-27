<template>
  <layout navTitle="每日答题" bgType="bg-question" :isLottie="false" mode="white" :refresher="false"
    :isNavLeftBackClick="false" @navRightClick="goToRewardRecord" @navLeftClick="handleNavLeftClick">
    <template v-slot:navRight>
      <view class="text-white text-base">奖励记录</view>
    </template>

    <!-- 主要内容区域 -->
    <view class="py-4">
      <!-- 介绍页面 -->
      <view v-if="currentState === 'intro'" class="flex flex-col items-center justify-center">
        <view class="card">
          <view class="w-[160rpx] h-[160rpx] absolute top-[-80rpx]">
            <image src="/static/images/daily_quiz/logo.png" class="w-[160rpx] h-[160rpx]" mode="aspectFit" />
          </view>
          <view class="bg-gradient-quiz bg-clip-text text-transparent text-2xl font-semibold">智慧挑战 答题有益</view>
          <text class="text-white text-lg leading-6 mt-[32rpx]">
            {{ firstQuestionDesc || '' }}
          </text>

          <view class="mt-auto w-full">
            <wk-button @submit="startQuiz" height="86rpx" fontSize="30rpx" :disabled="todayFinish">
              {{ todayFinish ? '今日已答题' : '开始答题' }}
            </wk-button>
          </view>
        </view>
      </view>

      <!-- 答题页面 -->
      <view v-if="currentState === 'quiz'" class="card">
        <view class="w-[160rpx] h-[160rpx] absolute top-[-80rpx]">
          <image src="/static/images/daily_quiz/logo.png" class="w-[160rpx] h-[160rpx]" mode="aspectFit" />
        </view>
        <!-- 题目类型和进度 -->
        <view class="flex items-center justify-between mb-4 w-full">
          <text class="font-medium">单选题</text>
          <text class="font-bold text-2xl  text-[#5493FF]">{{ currentQuestionIndex + 1 }}<text
              class="text-white/60">/{{ questions.length }}</text></text>
        </view>

        <!-- 进度条 -->
        <view class="w-full bg-[rgba(84,147,255,.5)] rounded-full h-2 mb-6">
          <view class="h-2 rounded-full transition-all duration-300"
            style="background: linear-gradient(90deg, #00B7FF 1.58%, #E8A5FF 99.19%)"
            :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"></view>
        </view>

        <!-- 题目内容 -->
        <view class="mb-6 w-full">
          <text class="text-white text-lg leading-6">
            {{ currentQuestionIndex + 1 }}.{{ currentQuestion.question_text }}
          </text>
        </view>

        <!-- 选项 -->
        <view class="space-y-3 mb-8 w-full">
          <view v-for="option in currentQuestion.options" :key="option.key" @click="selectOption(option.key)"
            class="my-4 p-2 transition-all duration-200 box-border rounded-[16rpx]" :class="getOptionClass(option.key)">
            <text class="text-white font-medium">
              {{ option.key }}. {{ option.value }}
            </text>
          </view>
        </view>

      </view>

      <!-- 完成页面 -->
      <view v-if="currentState === 'result'" class="flex flex-col items-center justify-center">

        <view class="card_short">
          <view class="w-[200rpx] h-[200rpx] absolute top-[-100rpx] left-0 right-0 mx-auto">
            <image src="/static/images/daily_quiz/icon_left.png" class="w-20 h-20" mode="aspectFit" />
          </view>
          <text class="text-[#B676FF] text-3xl font-semibold mb-[32rpx]">{{ resultData.title || `答对了` }}</text>
          <text class="text-white text-lg mb-[32rpx]">{{ resultData.sub_title || '获得金额' }}</text>
          <text class="text-[#B676FF] text-7xl font-bold mb-8">{{ resultData.reward_amount || rewardAmount }}</text>
          <wk-button height="86rpx" @submit="goToRewardRecord" backgroundColor="#D5E638" color="#fff" borderRadius="32rpx"
            fontSize="30rpx" class="w-full mt-[auto]">查看奖励记录</wk-button>
        </view>
      </view>
    </view>

    <!-- 底部固定按钮区域 -->
    <view v-if="currentState === 'quiz'" class="fixed bottom-[0rpx] left-0 right-0 px-4 py-4 bg-[#171717]">
      <view class="flex space-x-4 gap-4">
        <view v-if="currentQuestionIndex > 0" class="flex-1">
          <wk-button type="none" height="86rpx" @submit="previousQuestion" background="rgba(28,36,255,.32)" color="#fff"
            borderColor="#0051FF" shadow="none" fontSize="30rpx">
            上一题
          </wk-button>
        </view>
        <view v-if="currentQuestionIndex < questions.length - 1" class="flex-1">
          <wk-button type="none" height="86rpx" @submit="nextQuestion" shadow="none" background="rgba(28,36,255,.32)"
            borderColor="#0051FF" :color="isCurrentQuestionAnswered ? '#fff' : 'rgba(255,255,255,.6)'" fontSize="30rpx"
            :disabled="!isCurrentQuestionAnswered">
            下一题
          </wk-button>
        </view>
        <view v-if="currentQuestionIndex === questions.length - 1" class="flex-1">
          <wk-button type="none" height="86rpx" @submit="submitQuiz" shadow="none" background="rgba(28,36,255,.32)"
            borderColor="#0051FF" :color="areAllQuestionsAnswered ? '#fff' : 'rgba(255,255,255,.6)'" fontSize="30rpx"
            :disabled="!areAllQuestionsAnswered">
            提交答案
          </wk-button>
        </view>
      </view>
    </view>
    <wk-loading v-if="loading" :loadingText="loadingText" />
  </layout>

  <!-- 退出确认弹框 -->
  <view v-if="showExitModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <view class="confirm-wrap">
      <view class="text-center flex flex-col items-center justify-center w-full">
        <view class="flex flex-col items-center justify-center bg-white w-[528rpx] h-[326rpx] rounded-[24rpx]">
          <text class="text-gray-800 text-2xl font-medium mt-4">离奖励就差一点了</text>
          <text class="text-gray-800 font-medium text-2xl">确定退出嘛?</text>
        </view>
        
        <view class="flex w-full gap-4 mt-[40rpx]">
          <view class="flex-1">
            <wk-button type="none" height="96rpx" @submit="confirmExit" borderRadius="64rpx" color="rgba(255,255,255,.6)" background="rgba(28,36,255,.3)"
              fontSize="32rpx">
              退出答题
            </wk-button>
          </view>
          <view class="flex-1">
            <wk-button type="small" height="96rpx" @submit="cancelExit" backgroundColor="#00BCFF" color="#fff" borderRadius="64rpx"
              fontSize="32rpx">
              继续答题
            </wk-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onBackPress } from '@dcloudio/uni-app'
import { getQuizQuestions, submitQuizAnswers, getQuizConfig } from '@/api/index'

// 页面状态
const currentState = ref('intro') // intro, quiz, result
const questions = ref([])
const currentQuestionIndex = ref(0)
const selectedAnswers = ref({})
const showExitModal = ref(false)
const correctAnswers = ref(0)
const rewardAmount = ref(10)
const firstQuestionDesc = ref('')
const todayFinish = ref(false)
const loading = ref(false)
const loadingText = ref('加载中...')

// 接口返回的结果数据
const resultData = ref({
  title: '',
  sub_title: '',
  total_correct: 0,
  reward_amount: '0.00'
})

// 计算当前题目
const currentQuestion = computed(() => {
  return questions.value[currentQuestionIndex.value] || {}
})

// 计算当前题目是否已选择
const isCurrentQuestionAnswered = computed(() => {
  if (!currentQuestion.value.question_id) return false
  return selectedAnswers.value[currentQuestion.value.question_id] !== undefined
})

// 计算所有题目是否都已选择
const areAllQuestionsAnswered = computed(() => {
  if (questions.value.length === 0) return false
  return questions.value.every(question =>
    selectedAnswers.value[question.question_id] !== undefined
  )
})

// 获取选项样式
const getOptionClass = (optionKey) => {
  const selectedKey = selectedAnswers.value[currentQuestion.value.question_id]
  if (selectedKey === optionKey) {
    return 'bg-[#0053E0] border-[1px] border-[#5493FF] border-solid'
  } else if (selectedKey) {
    return 'bg-[#032257] border-[1px] border-[#5493FF] border-solid'
  } else {
    return 'bg-[#032257] border-[1px] border-[#5493FF] border-solid'
  }
}

// 预加载配置信息（仅加载介绍页面的描述）
const preloadConfig = async () => {
  try {
    // 获取配置信息
    const configResponse = await getQuizConfig()
    console.log('config response:', configResponse)
    if (configResponse.status === 0) {
      if (configResponse.data.question_desc) {
        firstQuestionDesc.value = configResponse.data.question_desc
      }
      if (configResponse.data.today_finish !== undefined) {
        todayFinish.value = configResponse.data.today_finish
      }
    }
  } catch (error) {
    console.error('预加载配置失败:', error)
  }
}

// 加载题目数据
const loadQuizQuestions = async () => {
  try {
    loading.value = true
    loadingText.value = '加载题目中...'

    // 获取题目数据
    const questionsResponse = await getQuizQuestions()
    console.log('questions response:', questionsResponse)
    if (questionsResponse.status === 0) {
      questions.value = questionsResponse.data.list
      return true
    } else {
      console.error('加载题目失败:', questionsResponse.msg)
      uni.showToast({ title: questionsResponse.msg || '加载题目失败', icon: 'none' })
      return false
    }
  } catch (error) {
    console.error('加载题目失败:', error)
    uni.showToast({ title: '网络错误，请重试', icon: 'none' })
    return false
  } finally {
    loading.value = false
  }
}

// 开始答题
const startQuiz = async () => {
  // 如果今日已完成答题，直接返回
  if (todayFinish.value) {
    return
  }

  // 如果题目数据已加载，直接开始答题
  if (questions.value.length > 0) {
    currentState.value = 'quiz'
    currentQuestionIndex.value = 0
    selectedAnswers.value = {}
    return
  }

  // 如果题目数据未加载，先加载题目数据
  const success = await loadQuizQuestions()
  if (success && questions.value.length > 0) {
    currentState.value = 'quiz'
    currentQuestionIndex.value = 0
    selectedAnswers.value = {}
  }
}

// 选择选项
const selectOption = (optionKey) => {
  selectedAnswers.value[currentQuestion.value.question_id] = optionKey
}

// 下一题
const nextQuestion = () => {
  // 检查当前题目是否已选择
  if (!isCurrentQuestionAnswered.value) {
    uni.showToast({ title: '请先选择答案', icon: 'none' })
    return
  }

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  }
}

// 上一题
const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

// 提交答案
const submitQuiz = async () => {
  // 检查所有题目是否都已选择
  if (!areAllQuestionsAnswered.value) {
    uni.showToast({ title: '请完成所有题目', icon: 'none' })
    return
  }

  try {
    loading.value = true
    loadingText.value = '提交中...'

    // 构建答案数据
    const answerData = Object.keys(selectedAnswers.value).map(questionId => ({
      question_id: parseInt(questionId),
      option: selectedAnswers.value[questionId]
    }))

    const response = await submitQuizAnswers({ answer: answerData })

    console.log('提交结果:', response)
    if (response.status === 0) {
      // 保存接口返回的结果数据
      resultData.value = {
        title: response.data.title || '',
        sub_title: response.data.sub_title || '',
        total_correct: response.data.total_correct || 0,
        reward_amount: response.data.reward_amount || '0.00'
      }

      // 更新本地变量以保持兼容性
      correctAnswers.value = response.data.total_correct || 0
      rewardAmount.value = response.data.reward_amount || '0.00'

      currentState.value = 'result'
    } else {
      uni.showToast({ title: response.msg || '提交失败', icon: 'none' })
    }
  } catch (error) {
    console.error('提交答案失败:', error)
    uni.showToast({ title: '网络错误，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 处理导航栏返回按钮点击
const handleNavLeftClick = () => {
  if (currentState.value === 'quiz') {
    showExitModal.value = true
  } else {
    uni.navigateBack()
  }
}

// 确认退出
const confirmExit = () => {
  showExitModal.value = false
  uni.navigateBack()
}

// 取消退出
const cancelExit = () => {
  showExitModal.value = false
}

// 查看奖励记录
const goToRewardRecord = () => {
  uni.navigateTo({
    url: '/pages/daily_quiz/reward_record'
  })
}

// 页面加载时处理返回按钮
onMounted(() => {
  // 预加载配置信息（仅加载介绍页面的描述）
  preloadConfig()
})

// 监听返回按钮
onBackPress(() => {
  if (currentState.value === 'quiz') {
    showExitModal.value = true
    return true // 阻止默认返回行为
  }
  return false
})
</script>

<style lang="scss" scoped>
/* 自定义样式 */
.card {
  background-image: url('@/static/images/daily_quiz/card_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 auto;
  margin-top: 102rpx;
  width: 654rpx;
  height: 972rpx;
  box-sizing: border-box;
  padding: 128rpx 48rpx 84rpx 48rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card_short {
  background-image: url('@/static/images/daily_quiz/card_short_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 auto;
  margin-top: 102rpx;
  width: 654rpx;
  height: 660rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  padding: 128rpx 48rpx 84rpx 48rpx;
  box-sizing: border-box;
}

.confirm-wrap{
  background-image: url('@/static/images/daily_quiz/confirm_bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  width: 630rpx;
  height:  772rpx;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding:  222rpx 10rpx 0 10rpx;
  box-sizing: border-box;
}
</style>
