class CacheManager {
  constructor() {
    this.defaultExpireTime = 365 * 24 * 60 * 60 * 1000 // 默认365天过期
    this.cacheKeysStorageName = '_cache_manager_keys_' // 用于存储所有缓存键的键名
    this.initCacheKeys() // 初始化缓存键集合
  }

  // 初始化缓存键集合
  initCacheKeys() {
    try {
      const keysStr = uni.getStorageSync(this.cacheKeysStorageName)
      this.cacheKeys = keysStr ? JSON.parse(keysStr) : []
    } catch (e) {
      console.error('初始化缓存键集合失败:', e)
      this.cacheKeys = []
    }
  }

  // 保存缓存键集合
  saveCacheKeys() {
    try {
      uni.setStorageSync(this.cacheKeysStorageName, JSON.stringify(this.cacheKeys))
    } catch (e) {
      console.error('保存缓存键集合失败:', e)
    }
  }

  // 设置缓存
  setCache(key, value, expireTime) {
    try {
      const cacheData = {
        data: value,
        expireTime: Date.now() + (expireTime || this.defaultExpireTime)
      }
      uni.setStorageSync(key, JSON.stringify(cacheData))
      
      // 记录缓存键
      if (!this.cacheKeys.includes(key)) {
        this.cacheKeys.push(key)
        this.saveCacheKeys()
      }
    } catch (e) {
      console.error('缓存设置失败:', e)
    }
  }

  // 获取缓存
  getCache(key) {
    try {
      const cacheStr = uni.getStorageSync(key)
      if (!cacheStr) return null

      const cache = JSON.parse(cacheStr)
      if (cache.expireTime < Date.now()) {
        this.clearCache(key)
        return null
      }
      return cache.data
    } catch (e) {
      console.error('缓存获取失败:', e)
      return null
    }
  }

  // 清除指定缓存
  clearCache(key) {
    try {
      uni.removeStorageSync(key)
      
      // 从缓存键集合中移除
      const index = this.cacheKeys.indexOf(key)
      if (index > -1) {
        this.cacheKeys.splice(index, 1)
        this.saveCacheKeys()
      }
    } catch (e) {
      console.error('缓存删除失败:', e)
    }
  }

  // 清除所有过期缓存
  clearExpiredCache() {
    try {
      // 复制一份缓存键数组，因为在遍历过程中可能会修改原数组
      const keysToCheck = [...this.cacheKeys]
      keysToCheck.forEach(key => {
        this.getCache(key) // 获取缓存会自动清理过期数据
      })
    } catch (e) {
      console.error('清理过期缓存失败:', e)
    }
  }

  // 清除所有通过CacheManager设置的缓存
  clearAllCache() {
    try {
      // 复制一份缓存键数组，因为在遍历过程中会修改原数组
      const keysToRemove = [...this.cacheKeys]
      keysToRemove.forEach(key => {
        this.clearCache(key)
      })
      console.log('所有CacheManager缓存已清除')
    } catch (e) {
      console.error('清除CacheManager缓存失败:', e)
    }
  }
}

export const cacheManager = new CacheManager() 