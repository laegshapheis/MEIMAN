import { requestApi } from '@/utils/request'

// 获取统计数据
export const getGameStats = () => {
  return requestApi({
    url: '/api/digitalLottery/stat',
    method: 'GET'
  })
}

// 获取游戏场次列表
export const getGameRounds = (data) => {
  return requestApi({
    url: '/api/digitalLottery/index',
    method: 'GET',
    data
  })
}

// 获取我的投注记录
export const getMyBets = (data) => {
  return requestApi({
    url: '/api/digitalLottery/mybets',
    method: 'GET',
    data
  })
}

// 获取场次详情
export const getRoundDetail = (data) => {
  return requestApi({
    url: '/api/digitalLottery/detail',
    method: 'GET',
    data
  })
}

// 投注
export const placeBet = (data) => {
  return requestApi({
    url: '/api/digitalLottery/bet',
    method: 'POST',
    data
  })
}

// 获取投注详情
export const getBetDetail = (data) => {
  return requestApi({
    url: '/api/digitalLottery/mybetdetail',
    method: 'GET',
    data
  })
}

