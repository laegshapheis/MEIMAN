import { defineStore } from 'pinia';
import { getCardsApi } from '@/api/store';
import { cacheManager } from "@/utils/cacheManager";

export const useUserCardInfoStore = defineStore('userCardInfo', {
  state: () => ({
    userCardInfo: cacheManager.getCache('userCardInfo') || {},
  }),
  actions: {
    async getUserCardInfo() {
      const res = await getCardsApi({});
      cacheManager.setCache('userCardInfo', res);
      if (res.status !== 0) {
        uni.showToast({
          title: res.msg,
          icon: 'none',
        });
        return;
      }
      this.userCardInfo = res;
    },
  },
});