import { requestApi } from '@/utils/request'

// 获取抽奖配置
export const getLotteryConfig = () => {
  return requestApi({
    url: '/api/wheel/LotteryPeizhi',
    method: 'POST'
  })
}

// 获取中奖名单
export const getWinList = () => {
  return requestApi({
    url: '/api/wheel/winlist',
    method: 'POST'
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return requestApi({
    url: '/api/user/index',
    method: 'GET'
  })
}

// 点击抽奖
export const startLottery = () => {
  return requestApi({
    url: '/api/wheel/click',
    method: 'POST'
  })
} 