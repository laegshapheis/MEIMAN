import { requestApi } from '@/utils/request'

// 获取集卡列表
export const getCardListApi = () => {
  return requestApi({
    url: '/api/v2/fucards/getlist',
    method: 'POST'
  })
}

