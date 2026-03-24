import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

import { ensureLocaleLoaded, isSupportedLocale, SUPPORTED_LOCALES, type SupportedLocale } from './locales.js'

dayjs.extend(customParseFormat)
dayjs.locale('en')

export type DateValue = string | number | Date

type DateInputOptions = {
  input?: string | readonly string[]
  locale?: SupportedLocale
  strict?: boolean
}

export type DateParsingOptions = DateInputOptions & {
  date: DateValue
}

export type GetDateOptions = DateInputOptions & {
  date?: DateValue
  output?: string
  invalid?: string
}

export type DateFormatterConfig = {
  locale?: SupportedLocale
  strict?: boolean
  invalid?: string
}

export type DateFormatter = {
  getDate: (props?: GetDateOptions) => string
  parseDate: (props: DateParsingOptions) => ParseDateResult
  isValidDate: (props: DateParsingOptions) => boolean
  getSupportedLocales: () => readonly SupportedLocale[]
  getCurrentLocale: () => SupportedLocale
  setLocale: (locale: SupportedLocale) => Promise<void>
  ready: Promise<void>
}

export type ParseDateSuccess = {
  isValid: true
  locale: SupportedLocale
  date: Date
  iso: string
  timestamp: number
  format: (output?: string) => string
}

export type ParseDateFailure = {
  isValid: false
  locale: SupportedLocale
  date: null
  iso: null
  timestamp: null
  error: string
}

export type ParseDateResult = ParseDateSuccess | ParseDateFailure

const DEFAULT_FORMAT = 'YYYY-MM-DD'
const DEFAULT_LOCALE: SupportedLocale = 'en'
const DEFAULT_INVALID_DATE = 'Invalid Date'

const getInvalidDateText = (config?: DateFormatterConfig, props?: GetDateOptions): string => {
  return props?.invalid ?? config?.invalid ?? DEFAULT_INVALID_DATE
}

const getTargetLocale = (currentLocale: SupportedLocale, props?: GetDateOptions): SupportedLocale => {
  return props?.locale ?? currentLocale
}

const parseDateValue = (
  value: DateValue,
  input: DateParsingOptions['input'],
  locale: SupportedLocale,
  strict: boolean
): Dayjs => {
  if (!input) {
    return dayjs(value).locale(locale)
  }

  if (typeof input === 'string') {
    return dayjs(value, input, locale, strict).locale(locale)
  }

  return dayjs(value, [...input], locale, strict).locale(locale)
}

const createFormatterParseDate = (getConfig: () => Required<DateFormatterConfig>) => {
  return (props: DateParsingOptions): ParseDateResult => {
    const config = getConfig()
    const locale = getTargetLocale(config.locale, props)
    const parsed = parseDateValue(props.date, props.input, locale, props.strict ?? config.strict)

    if (!parsed.isValid()) {
      return {
        isValid: false,
        locale,
        date: null,
        iso: null,
        timestamp: null,
        error: getInvalidDateText(config, props)
      }
    }

    return {
      isValid: true,
      locale,
      date: parsed.toDate(),
      iso: parsed.toISOString(),
      timestamp: parsed.valueOf(),
      format: (output = DEFAULT_FORMAT) => parsed.format(output)
    }
  }
}

const createFormatterIsValidDate = (parseDate: (props: DateParsingOptions) => ParseDateResult) => {
  return (props: DateParsingOptions): boolean => parseDate(props).isValid
}

const createFormatterGetDate = (getConfig: () => Required<DateFormatterConfig>) => {
  const parseDate = createFormatterParseDate(getConfig)

  return (props?: GetDateOptions): string => {
    const config = getConfig()
    const locale = getTargetLocale(config.locale, props)
    const output = props?.output ?? DEFAULT_FORMAT

    if (!props) {
      return dayjs().locale(locale).format(DEFAULT_FORMAT)
    }

    if (props.date === undefined) {
      return dayjs().locale(locale).format(output)
    }

    const parsed = parseDate({
      date: props.date,
      input: props.input,
      locale: props.locale,
      strict: props.strict
    })

    if (!parsed.isValid) {
      return props.invalid ?? parsed.error
    }

    return parsed.format(output)
  }
}

function assertSupportedLocale(locale: string): asserts locale is SupportedLocale {
  if (!isSupportedLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`)
  }
}

export const getSupportedLocales = (): readonly SupportedLocale[] => SUPPORTED_LOCALES

export const createDateFormatter = (config?: DateFormatterConfig): DateFormatter => {
  let currentLocale = config?.locale ?? DEFAULT_LOCALE

  const getConfig = (): Required<DateFormatterConfig> => ({
    locale: currentLocale,
    strict: config?.strict ?? false,
    invalid: config?.invalid ?? DEFAULT_INVALID_DATE
  })

  const ready = ensureLocaleLoaded(currentLocale)
  const parseDate = createFormatterParseDate(getConfig)

  return {
    getDate: createFormatterGetDate(getConfig),
    parseDate,
    isValidDate: createFormatterIsValidDate(parseDate),
    getSupportedLocales,
    getCurrentLocale: () => currentLocale,
    setLocale: async (locale: SupportedLocale) => {
      assertSupportedLocale(locale)
      await ensureLocaleLoaded(locale)
      currentLocale = locale
    },
    ready
  }
}
