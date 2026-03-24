import { useRef, useState } from 'react'

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
  const formatterRef = useRef(createDateFormatter(options))
  const [locale, setLocaleState] = useState<SupportedLocale>(formatterRef.current.getCurrentLocale())

  return {
    locale,
    currentLocale: locale,
    getDate: (props?: GetDateOptions) => formatterRef.current.getDate(props),
    parseDate: (props: DateParsingOptions) => formatterRef.current.parseDate(props),
    isValidDate: (props: DateParsingOptions) => formatterRef.current.isValidDate(props),
    getSupportedLocales,
    ready: formatterRef.current.ready,
    setLocale: async (nextLocale: SupportedLocale) => {
      await formatterRef.current.setLocale(nextLocale)
      setLocaleState(nextLocale)
    }
  }
}
