import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

import { ensureLocaleLoaded, resolveLocale, SUPPORTED_LOCALES, type LocaleInput, type SupportedLocale } from './locales.js'

dayjs.extend(customParseFormat)
dayjs.locale('en')

export type DateValue = string | number | Date

type DateInputOptions = {
  input?: string | readonly string[]
  locale?: LocaleInput
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
  locale?: LocaleInput
  strict?: boolean
  invalid?: string
}

type ResolvedDateFormatterConfig = {
  locale: SupportedLocale
  strict: boolean
  invalid: string
}

export type DateFormatter = {
  getDate: (props?: GetDateOptions) => string
  parseDate: (props: DateParsingOptions) => ParseDateResult
  isValidDate: (props: DateParsingOptions) => boolean
  getSupportedLocales: () => readonly SupportedLocale[]
  getCurrentLocale: () => SupportedLocale
  setLocale: (locale: LocaleInput) => Promise<void>
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
const DEFAULT_STRICT = true

const createResolvedConfig = (
  locale: SupportedLocale,
  config?: DateFormatterConfig
): ResolvedDateFormatterConfig => ({
  locale,
  strict: config?.strict ?? DEFAULT_STRICT,
  invalid: config?.invalid ?? DEFAULT_INVALID_DATE
})

const getInvalidDateText = (config?: DateFormatterConfig, props?: GetDateOptions): string => {
  return props?.invalid ?? config?.invalid ?? DEFAULT_INVALID_DATE
}

const getTargetLocale = (currentLocale: SupportedLocale, props?: GetDateOptions): SupportedLocale => {
  if (!props?.locale) {
    return currentLocale
  }

  return resolveLocaleOrThrow(props.locale)
}

const getHelperLocale = <T extends { locale?: LocaleInput }>(
  config?: DateFormatterConfig,
  props?: T
): SupportedLocale => {
  if (props?.locale) {
    return resolveLocaleOrThrow(props.locale)
  }

  if (config?.locale) {
    return resolveLocaleOrThrow(config.locale)
  }

  return DEFAULT_LOCALE
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

const createFormatterParseDate = (getConfig: () => ResolvedDateFormatterConfig) => {
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

const createFormatterGetDate = (getConfig: () => ResolvedDateFormatterConfig) => {
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

function resolveLocaleOrThrow(locale: LocaleInput): SupportedLocale {
  const resolvedLocale = resolveLocale(locale)

  if (!resolvedLocale) {
    throw new Error(
      `Unsupported locale: ${locale}. The package tries an exact locale match first and then falls back to the base locale.`
    )
  }

  return resolvedLocale
}

export const getSupportedLocales = (): readonly SupportedLocale[] => SUPPORTED_LOCALES

export const getDate = async (props?: GetDateOptions, config?: DateFormatterConfig): Promise<string> => {
  const locale = getHelperLocale(config, props)
  const formatter = createDateFormatter({ ...config, locale })

  await formatter.ready

  return formatter.getDate(props)
}

export const parseDate = async (
  props: DateParsingOptions,
  config?: DateFormatterConfig
): Promise<ParseDateResult> => {
  const locale = getHelperLocale(config, props)
  const formatter = createDateFormatter({ ...config, locale })

  await formatter.ready

  return formatter.parseDate(props)
}

export const isValidDate = async (
  props: DateParsingOptions,
  config?: DateFormatterConfig
): Promise<boolean> => {
  const locale = getHelperLocale(config, props)
  const formatter = createDateFormatter({ ...config, locale })

  await formatter.ready

  return formatter.isValidDate(props)
}

export const createDateFormatter = (config?: DateFormatterConfig): DateFormatter => {
  let currentLocale = config?.locale ? resolveLocaleOrThrow(config.locale) : DEFAULT_LOCALE

  const getConfig = (): ResolvedDateFormatterConfig => createResolvedConfig(currentLocale, config)

  const ready = ensureLocaleLoaded(currentLocale)
  const parseDate = createFormatterParseDate(getConfig)

  return {
    getDate: createFormatterGetDate(getConfig),
    parseDate,
    isValidDate: createFormatterIsValidDate(parseDate),
    getSupportedLocales,
    getCurrentLocale: () => currentLocale,
    setLocale: async (locale: LocaleInput) => {
      const resolvedLocale = resolveLocaleOrThrow(locale)

      await ensureLocaleLoaded(resolvedLocale)
      currentLocale = resolvedLocale
    },
    ready
  }
}
