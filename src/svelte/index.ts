import { get, writable } from 'svelte/store'

import {
  createDateFormatter,
  getSupportedLocales,
  type DateFormatterConfig,
  type DateParsingOptions,
  type GetDateOptions,
  type SupportedLocale
} from '../index.js'

export type CreateDateFormatterStoreOptions = DateFormatterConfig

export const createDateFormatterStore = (options?: CreateDateFormatterStoreOptions) => {
  const formatter = createDateFormatter(options)
  const locale = writable<SupportedLocale>(formatter.getCurrentLocale())

  return {
    locale: {
      subscribe: locale.subscribe
    },
    currentLocale: () => get(locale),
    getDate: (props?: GetDateOptions) => formatter.getDate(props),
    parseDate: (props: DateParsingOptions) => formatter.parseDate(props),
    isValidDate: (props: DateParsingOptions) => formatter.isValidDate(props),
    getSupportedLocales,
    ready: formatter.ready,
    setLocale: async (nextLocale: SupportedLocale) => {
      await formatter.setLocale(nextLocale)
      locale.set(nextLocale)
    },
    getLocale: () => get(locale)
  }
}
