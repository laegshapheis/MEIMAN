// store/symbolStore.js
import { defineStore } from "pinia";

export const useRegisterStore = defineStore("register", {
  state: () => ({
    email: "",
    mobile: "",
    mobile_2: "",
    password: "",
    invitation_code: "",
    captcha_id: "",
    ckey: "",
    yaoqingren: "",
    code: "",
    clientid: "",
    lange: "",
    type: 2
  }),

  actions: {
    setRegisterData(data) {
      this.email = data.email || '';
      this.mobile = data.mobile || '';
      this.mobile_2 = data.mobile_2 || '';
      this.password = data.password || '';
      this.invitation_code = data.invitation_code || '';
      this.captcha_id = data.captcha_id || '';
      this.ckey = data.ckey || '';
      this.yaoqingren = data.yaoqingren || '';
      this.code = data.code || '';
      this.clientid = data.clientid || '';
      this.lange = data.lange || '';
      this.type = data.type || 2;
      this.saveToStorage();  // 保存到存储
    },
    
    clearRegisterData() {
      this.email = '';
      this.mobile = '';
      this.mobile_2 = '';
      this.password = '';
      this.invitation_code = '';
      this.captcha_id = '';
      this.ckey = '';
      this.yaoqingren = '';
      this.code = '';
      this.clientid = '';
      this.lange = '';
      this.type = 2;
      this.saveToStorage();  // 保存到存储
    },

    saveToStorage() {
      try {
        uni.setStorageSync('register_store', {
          email: this.email,
          mobile: this.mobile,
          mobile_2: this.mobile_2,
          password: this.password,
          invitation_code: this.invitation_code,
          captcha_id: this.captcha_id,
          ckey: this.ckey,
          yaoqingren: this.yaoqingren,
          code: this.code,
          clientid: this.clientid,
          lange: this.lange,
          type: this.type
        });
      } catch (e) {
        console.error('Error saving to storage', e);
      }
    },

    loadFromStorage() {
      try {
        const data = uni.getStorageSync('register_store');
        console.log('data', data);
        if (data) {
          this.$patch(data);
        }
      } catch (e) {
        console.error('Error loading from storage', e);
      }
    }
  }
});

// 在应用启动时调用loadFromStorage以恢复状态
// const registerStore = useRegisterStore();
// registerStore.loadFromStorage();
