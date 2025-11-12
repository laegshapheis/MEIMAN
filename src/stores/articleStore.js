import { defineStore } from "pinia";

export const useArticleStore = defineStore("article", {
  state: () => ({
    articles: {}
  }),
  
  actions: {
    setArticleDetails(data, type) {
      if (!type) return;
      
      // 动态创建或更新文章数据
      this.articles[type] = {
        article: data.article,
        title: data.title,
        updateTime: Date.now() // 添加更新时间，用于缓存控制
      };
    },
    
    getArticleDetails(type) {
      return this.articles[type] || { article: {}, title: "", updateTime: 0 };
    },
    
    clearArticleDetails(type) {
      if (!type) {
        // 清除所有
        this.articles = {};
      } else {
        // 清除指定类型
        delete this.articles[type];
      }
    },

    // 清除过期的缓存数据
    clearExpiredCache(expireTime = 30 * 60 * 1000) { // 默认30分钟
      const now = Date.now();
      Object.keys(this.articles).forEach(key => {
        const article = this.articles[key];
        if (now - article.updateTime > expireTime) {
          delete this.articles[key];
        }
      });
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['articles']
      }
    ]
  }
});