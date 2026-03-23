import { ref } from 'vue'

import { getCurrentLocale, getDate, getSupportedLocales, setDayjs, type GetDateOptions, type SupportedLocale } from '../index.js'

export type UseDateFormatterOptions = {
  locale?: SupportedLocale
}

export const useDateFormatter = (options?: UseDateFormatterOptions) => {
  const locale = ref<SupportedLocale>(options?.locale ?? 'en')

  const setLocale = async (nextLocale: SupportedLocale) => {
    await setDayjs(nextLocale)
    locale.value = nextLocale
  }

  return {
    locale,
    currentLocale: getCurrentLocale,
    getDate: (props?: GetDateOptions) => getDate(props),
    getSupportedLocales,
    setLocale
  }
}
