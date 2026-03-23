import { get, writable } from 'svelte/store'

import { getCurrentLocale, getDate, getSupportedLocales, setDayjs, type GetDateOptions, type SupportedLocale } from '../index.js'

export type CreateDateFormatterStoreOptions = {
  locale?: SupportedLocale
}

export const createDateFormatterStore = (options?: CreateDateFormatterStoreOptions) => {
  const locale = writable<SupportedLocale>(options?.locale ?? 'en')

  return {
    locale: {
      subscribe: locale.subscribe
    },
    currentLocale: () => getCurrentLocale(),
    getDate: (props?: GetDateOptions) => getDate(props),
    getSupportedLocales,
    setLocale: async (nextLocale: SupportedLocale) => {
      await setDayjs(nextLocale)
      locale.set(nextLocale)
    },
    getLocale: () => get(locale)
  }
}
