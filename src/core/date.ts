import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import dayjs from 'dayjs'

import { ensureLocaleLoaded, isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from './locales.js'

dayjs.extend(customParseFormat)
dayjs.locale('en')

export type GetDateOptions = {
  date?: string
  input?: string
  output?: string
}

export type DateFormatterConfig = {
  locale?: SupportedLocale
}

const DEFAULT_FORMAT = 'YYYY-MM-DD'

export const getDate = (props?: GetDateOptions): string => {
  if (!props) {
    return dayjs().format(DEFAULT_FORMAT)
  }

  const { date, input, output = DEFAULT_FORMAT } = props

  if (!date) {
    return dayjs().format(output)
  }

  const parsed = input ? dayjs(date, input) : dayjs(date)

  if (!parsed.isValid()) {
    return 'Invalid Date'
  }

  return parsed.format(output)
}

export const setDayjs = async (locale: string): Promise<void> => {
  if (!isSupportedLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`)
  }

  await ensureLocaleLoaded(locale)
  dayjs.locale(locale)
}

export const getSupportedLocales = (): readonly SupportedLocale[] => SUPPORTED_LOCALES

export const getCurrentLocale = (): string => dayjs.locale()

export const createDateFormatter = (config?: DateFormatterConfig) => {
  const initialLocale = config?.locale ?? 'en'

  return {
    getDate,
    getSupportedLocales,
    getCurrentLocale,
    setLocale: async (locale: SupportedLocale) => {
      await setDayjs(locale)
    },
    ready: setDayjs(initialLocale)
  }
}
