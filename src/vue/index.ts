import { computed, ref } from 'vue'

import {
  createDateFormatter,
  getSupportedLocales,
  type CreateDateChainOptions,
  type DateChain,
  type DateFormatterConfig,
  type DateParsingOptions,
  type GetDateOptions,
  type LocaleInput,
  type SupportedLocale
} from '../index.js'

export type UseDateFormatterOptions = DateFormatterConfig

export const useDateFormatter = (options?: UseDateFormatterOptions) => {
  const formatter = createDateFormatter(options)
  const locale = ref<SupportedLocale>(formatter.getCurrentLocale())

  const setLocale = async (nextLocale: LocaleInput) => {
    await formatter.setLocale(nextLocale)
    locale.value = formatter.getCurrentLocale()
  }

  return {
    locale,
    currentLocale: computed(() => locale.value),
    createDateChain: (props?: CreateDateChainOptions): DateChain => formatter.createDateChain(props),
    getDate: (props?: GetDateOptions) => formatter.getDate(props),
    parseDate: (props: DateParsingOptions) => formatter.parseDate(props),
    isValidDate: (props: DateParsingOptions) => formatter.isValidDate(props),
    getSupportedLocales,
    ready: formatter.ready,
    setLocale
  }
}
