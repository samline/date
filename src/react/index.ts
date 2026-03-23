import { useEffect, useState } from 'react'

import { getCurrentLocale, getDate, getSupportedLocales, setDayjs, type GetDateOptions, type SupportedLocale } from '../index.js'

export type UseDateFormatterOptions = {
  locale?: SupportedLocale
}

export const useDateFormatter = (options?: UseDateFormatterOptions) => {
  const [locale, setLocaleState] = useState<SupportedLocale>(options?.locale ?? 'en')

  useEffect(() => {
    void setDayjs(locale)
  }, [locale])

  return {
    locale,
    currentLocale: getCurrentLocale(),
    getDate: (props?: GetDateOptions) => getDate(props),
    getSupportedLocales,
    setLocale: async (nextLocale: SupportedLocale) => {
      await setDayjs(nextLocale)
      setLocaleState(nextLocale)
    }
  }
}
