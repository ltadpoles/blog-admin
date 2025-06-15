import { createI18n } from 'vue-i18n'
import zhCN from 'element-plus/dist/locale/zh-cn'
import en from 'element-plus/dist/locale/en'
import localEn from './en'
import localZhCN from './zhCN'

const messages = {
  zhCN: {
    ...localZhCN,
    ...zhCN
  },
  en: {
    ...localEn,
    ...en
  }
}

const i18n = createI18n({
  locale: 'zhCN', // 设置当前语言类型
  legacy: false, // 如果要支持compositionAPI，此项必须设置为false;
  globalInjection: true, // 全局注册$t方法
  messages
})

export default i18n
