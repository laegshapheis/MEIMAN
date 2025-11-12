import { createI18n } from 'vue-i18n'
import en from './en'
import zhCN from './zh-CN'

const i18n = createI18n({
  locale: uni.getStorageSync('language') || 'zh',
  legacy: false,
  messages: {
    en,
    zh: zhCN
  }
})

export default i18n 