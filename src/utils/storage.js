const Storage = {
  // 设置存储对json的处理
  set(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      uni.setStorageSync(key, jsonValue);
    } catch (e) {
      console.error(`设置存储失败: ${e}`);
    }
  },

  // 获取存储
  get(key) {
    try {
      const jsonValue = uni.getStorageSync(key);
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error(`获取存储失败: ${e}`);
      return null;
    }
  },

  // 移除指定的存储
  remove(key) {
    try {
      uni.removeStorageSync(key);
    } catch (e) {
      console.error(`移除存储失败: ${e}`);
    }
  },

  // 清除所有存储
  clear() {
    try {
      uni.clearStorageSync();
    } catch (e) {
      console.error(`清除存储失败: ${e}`);
    }
  },
};

export default Storage;
