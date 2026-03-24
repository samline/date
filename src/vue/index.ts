import { computed, ref } from 'vue'

import {
  createDateFormatter,
  getSupportedLocales,
  type DateFormatterConfig,
  type DateParsingOptions,
  type GetDateOptions,
  type SupportedLocale
} from '../index.js'

export type UseDateFormatterOptions = DateFormatterConfig

export const useDateFormatter = (options?: UseDateFormatterOptions) => {
  const formatter = createDateFormatter(options)
  const locale = ref<SupportedLocale>(formatter.getCurrentLocale())

  const setLocale = async (nextLocale: SupportedLocale) => {
    await formatter.setLocale(nextLocale)
    locale.value = nextLocale
  }

  return {
    locale,
    currentLocale: computed(() => locale.value),
    getDate: (props?: GetDateOptions) => formatter.getDate(props),
    parseDate: (props: DateParsingOptions) => formatter.parseDate(props),
    isValidDate: (props: DateParsingOptions) => formatter.isValidDate(props),
    getSupportedLocales,
    ready: formatter.ready,
    setLocale
  }
}
