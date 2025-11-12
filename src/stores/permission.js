import { defineStore } from 'pinia';
import { getConfig } from '@/api/index'; // 假设从 API 获取权限的函数
import { useSymbolStore } from '@/stores/symbolStore';
export const usePermissionStore = defineStore('permission', {
  state: () => ({
    permissions: {},
  }),
  actions: {
    // 异步获取权限数据
    async fetchPermissions() {
      try {
        const symbolStore = useSymbolStore();
        const apiUrl = uni.getStorageSync('api_url');
        if(!apiUrl) return;
        const response = await getConfig();
        console.log(response);
        this.permissions = response.data;
        symbolStore.setSymbol({
          code: response.data.currency_code,
          name: response.data.currency_name,
          symbol: response.data.currency_symbol,
          unit: response.data.currency_unit,
          value: response.data.currency_value
        });
      } catch (error) {
        console.error('获取权限失败:', error);
      }
    },
  },
  getters: {
    getPermissions: (state) => {
      return state.permissions;
    },
    // 判断是否有某个权限
    hasPermission: (state) => (permission) => {
      return Boolean(state.permissions[permission]);
    },
    getPermission: (state) => (permission) => {
      return state.permissions[permission];
    },
  },
});
