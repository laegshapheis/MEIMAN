import { requestApi } from '@/utils/request'

// 获取盲盒列表
export const getBoxListApi = () => {
  return requestApi({
    url: '/api/v2/boxes/boxeslist',
    method: 'POST'
  })
}

// 获取盲盒记录
export const getBoxRecordApi = () => {
  return requestApi({
    url: '/api/v2/boxes/boxesrecord',
    method: 'POST'
  })
}

// 获取盲盒投奖次数获取记录
export const getFreeBoxLotteryRecordApi = () => {
  return requestApi({
    url: '/api/v2/boxes/getFreeBoxLotteryRecord',
    method: 'GET'
  })
}

// 盲盒抽奖
export const drawBoxApi = () => {
  return requestApi({
    url: '/api/v2/boxes/draw',
    method: 'POST'
  })
}

