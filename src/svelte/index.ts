import { get, writable } from 'svelte/store'

import {
  createDateFormatter,
  getSupportedLocales,
  type DateFormatterConfig,
  type DateParsingOptions,
  type GetDateOptions,
  type LocaleInput,
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
    setLocale: async (nextLocale: LocaleInput) => {
      await formatter.setLocale(nextLocale)
      locale.set(formatter.getCurrentLocale())
    },
    getLocale: () => get(locale)
  }
}
