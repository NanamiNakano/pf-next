import cn from "./locales/cn.json"
import en from "./locales/en.json"

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "cn",
  messages: {
    cn: cn,
    en: en,
  },
  fallbackLocale: "cn",
}))
