import { ref } from 'vue'
import { cacheManager } from '@/utils/cacheManager'

export function usePageData(options) {
  const {
    cacheKey, // 缓存key
    fetchFunction, // 获取数据的函数
    immediate = true, // 是否立即获取数据
    expireTime = 5 * 60 * 1000, // 过期时间，默认5分钟
    onSuccess = () => {}, // 成功回调
    onError = () => {} // 错误回调
  } = options

  const loading = ref(false)
  const data = ref(null)

  // 获取数据并更新缓存
  const fetchData = async (showLoading = true) => {
    try {
      if (showLoading) {
        loading.value = true
      }
      const res = await fetchFunction()
      data.value = res
      cacheManager.setCache(cacheKey, res, expireTime)
      await onSuccess(res)
      return res
    } catch (error) {
      console.error('获取数据失败:', error)
      await onError(error)
      uni.showToast({
        title: error.message || '获取数据失败',
        icon: 'none'
      })
    } finally {
      loading.value = false
    }
  }

  // 初始化数据
  const initData = () => {
    // 获取缓存数据
    const cachedData = cacheManager.getCache(cacheKey)
    if (cachedData) {
      data.value = cachedData
      onSuccess(cachedData)
    }
    
    // 无感更新
    if (immediate) {
      fetchData(false)
    }
  }

  return {
    loading,
    data,
    initData,
    fetchData,
    refresh: () => fetchData(true)
  }
} 