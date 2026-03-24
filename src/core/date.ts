import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

import {
  ensureLocaleLoaded,
  isLocaleLoaded,
  resolveLocale,
  SUPPORTED_LOCALES,
  type LocaleInput,
  type SupportedLocale
} from './locales.js'

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

export type CreateDateChainOptions = DateInputOptions & {
  date?: DateValue
  invalid?: string
}

export type DateFormatterConfig = {
  locale?: LocaleInput
  strict?: boolean
  invalid?: string
}

export type DateChainManipulateUnit =
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'

export type DateChainBoundaryUnit =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'

export type DateChainCompareUnit = DateChainBoundaryUnit | 'millisecond'

export type DateChainSetUnit =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'

type ResolvedDateFormatterConfig = {
  locale: SupportedLocale
  strict: boolean
  invalid: string
}

export type DateChainSuccessState = {
  isValid: true
  locale: SupportedLocale
  date: Date
  iso: string
  timestamp: number
}

export type DateChainFailureState = {
  isValid: false
  locale: SupportedLocale
  date: null
  iso: null
  timestamp: null
  error: string
}

export type DateChainState = DateChainSuccessState | DateChainFailureState

export type DateChain = {
  ready: Promise<void>
  add: (value: number, unit: DateChainManipulateUnit) => DateChain
  subtract: (value: number, unit: DateChainManipulateUnit) => DateChain
  set: (unit: DateChainSetUnit, value: number) => DateChain
  startOf: (unit: DateChainBoundaryUnit) => DateChain
  endOf: (unit: DateChainBoundaryUnit) => DateChain
  format: (output?: string) => string
  toDate: () => Date | null
  toISOString: () => string | null
  toTimestamp: () => number | null
  isValid: () => boolean
  isBefore: (other: DateChainComparable, unit?: DateChainCompareUnit) => boolean
  isAfter: (other: DateChainComparable, unit?: DateChainCompareUnit) => boolean
  isSame: (other: DateChainComparable, unit?: DateChainCompareUnit) => boolean
  toState: () => DateChainState
}

export type DateChainComparable = DateValue | DateChain

export type DateFormatter = {
  getDate: (props?: GetDateOptions) => string
  parseDate: (props: DateParsingOptions) => ParseDateResult
  isValidDate: (props: DateParsingOptions) => boolean
  createDateChain: (props?: CreateDateChainOptions) => DateChain
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

type InternalDateChainState = {
  locale: SupportedLocale
  invalid: string
  current: Dayjs | null
  ready: boolean
  error: string | null
}

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

const getInvalidDateText = <T>(config?: DateFormatterConfig, props?: T): string => {
  if (typeof props === 'object' && props !== null && 'invalid' in props) {
    const invalid = (props as { invalid?: string }).invalid

    if (invalid !== undefined) {
      return invalid
    }
  }

  return config?.invalid ?? DEFAULT_INVALID_DATE
}

const getTargetLocale = <T extends { locale?: LocaleInput }>(
  currentLocale: SupportedLocale,
  props?: T
): SupportedLocale => {
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

const getCurrentDayjs = (locale: SupportedLocale): Dayjs => {
  return dayjs().locale(locale)
}

const createParseSuccess = (parsed: Dayjs, locale: SupportedLocale): ParseDateSuccess => {
  return {
    isValid: true,
    locale,
    date: parsed.toDate(),
    iso: parsed.toISOString(),
    timestamp: parsed.valueOf(),
    format: (output = DEFAULT_FORMAT) => parsed.format(output)
  }
}

const createParseFailure = (locale: SupportedLocale, error: string): ParseDateFailure => {
  return {
    isValid: false,
    locale,
    date: null,
    iso: null,
    timestamp: null,
    error
  }
}

const createDateChainSuccessState = (parsed: Dayjs, locale: SupportedLocale): DateChainSuccessState => {
  return {
    isValid: true,
    locale,
    date: parsed.toDate(),
    iso: parsed.toISOString(),
    timestamp: parsed.valueOf()
  }
}

const createDateChainFailureState = (locale: SupportedLocale, error: string): DateChainFailureState => {
  return {
    isValid: false,
    locale,
    date: null,
    iso: null,
    timestamp: null,
    error
  }
}

const mapChainSetUnit = (unit: DateChainSetUnit): 'year' | 'month' | 'date' | 'hour' | 'minute' | 'second' | 'millisecond' => {
  if (unit === 'day') {
    return 'date'
  }

  return unit
}

const createReadyError = (): Error => {
  return new Error('Date chain is not ready. Await chain.ready before using it with locales that may need to load.')
}

const assertDateChainReady = (state: InternalDateChainState): void => {
  if (!state.ready) {
    throw createReadyError()
  }
}

const getComparableDayjs = (value: DateChainComparable): Dayjs | null => {
  if (typeof value === 'object' && value !== null && 'toState' in value) {
    const state = value.toState()

    if (!state.isValid) {
      return null
    }

    return dayjs(state.date)
  }

  const comparable = dayjs(value)

  if (!comparable.isValid()) {
    return null
  }

  return comparable
}

const createDateChainApi = (state: InternalDateChainState, ready: Promise<void>): DateChain => {
  const applyMutation = (transform: (current: Dayjs) => Dayjs): DateChain => {
    assertDateChainReady(state)

    if (state.current) {
      state.current = transform(state.current)
    }

    return chain
  }

  const compare = (
    other: DateChainComparable,
    comparator: (current: Dayjs, comparable: Dayjs) => boolean
  ): boolean => {
    assertDateChainReady(state)

    if (!state.current) {
      return false
    }

    const comparable = getComparableDayjs(other)

    if (!comparable) {
      return false
    }

    return comparator(state.current, comparable)
  }

  const chain: DateChain = {
    ready,
    add: (value, unit) => applyMutation((current) => current.add(value, unit)),
    subtract: (value, unit) => applyMutation((current) => current.subtract(value, unit)),
    set: (unit, value) => applyMutation((current) => current.set(mapChainSetUnit(unit), value)),
    startOf: (unit) => applyMutation((current) => current.startOf(unit)),
    endOf: (unit) => applyMutation((current) => current.endOf(unit)),
    format: (output = DEFAULT_FORMAT) => {
      assertDateChainReady(state)

      if (!state.current) {
        return state.invalid
      }

      return state.current.format(output)
    },
    toDate: () => {
      assertDateChainReady(state)

      return state.current ? state.current.toDate() : null
    },
    toISOString: () => {
      assertDateChainReady(state)

      return state.current ? state.current.toISOString() : null
    },
    toTimestamp: () => {
      assertDateChainReady(state)

      return state.current ? state.current.valueOf() : null
    },
    isValid: () => {
      assertDateChainReady(state)

      return state.current !== null
    },
    isBefore: (other, unit) => compare(other, (current, comparable) => current.isBefore(comparable, unit)),
    isAfter: (other, unit) => compare(other, (current, comparable) => current.isAfter(comparable, unit)),
    isSame: (other, unit) => compare(other, (current, comparable) => current.isSame(comparable, unit)),
    toState: () => {
      assertDateChainReady(state)

      if (!state.current) {
        return createDateChainFailureState(state.locale, state.error ?? state.invalid)
      }

      return createDateChainSuccessState(state.current, state.locale)
    }
  }

  return chain
}

const createDateChainState = (
  locale: SupportedLocale,
  invalid: string,
  getInitialDate: () => Dayjs
): { state: InternalDateChainState; ready: Promise<void> } => {
  const state: InternalDateChainState = {
    locale,
    invalid,
    current: null,
    ready: false,
    error: invalid
  }

  const initialize = () => {
    const parsed = getInitialDate()

    state.ready = true

    if (!parsed.isValid()) {
      state.current = null
      state.error = invalid
      return
    }

    state.current = parsed
    state.error = null
  }

  if (isLocaleLoaded(locale)) {
    initialize()

    return {
      state,
      ready: Promise.resolve()
    }
  }

  return {
    state,
    ready: ensureLocaleLoaded(locale).then(() => {
      initialize()
    })
  }
}

const createDateChainFromResolvedConfig = (
  props: CreateDateChainOptions | undefined,
  config: ResolvedDateFormatterConfig
): DateChain => {
  const locale = getTargetLocale(config.locale, props)
  const invalid = getInvalidDateText(config, props)
  const strict = props?.strict ?? config.strict
  const getInitialDate = () => {
    if (props?.date === undefined) {
      return getCurrentDayjs(locale)
    }

    return parseDateValue(props.date, props.input, locale, strict)
  }

  const { state, ready } = createDateChainState(locale, invalid, getInitialDate)

  return createDateChainApi(state, ready)
}

const createFormatterParseDate = (getConfig: () => ResolvedDateFormatterConfig) => {
  return (props: DateParsingOptions): ParseDateResult => {
    const config = getConfig()
    const locale = getTargetLocale(config.locale, props)
    const parsed = parseDateValue(props.date, props.input, locale, props.strict ?? config.strict)

    if (!parsed.isValid()) {
      return createParseFailure(locale, getInvalidDateText(config, props))
    }

    return createParseSuccess(parsed, locale)
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
      return getCurrentDayjs(locale).format(DEFAULT_FORMAT)
    }

    if (props.date === undefined) {
      return getCurrentDayjs(locale).format(output)
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

const createFormatterCreateDateChain = (getConfig: () => ResolvedDateFormatterConfig) => {
  return (props?: CreateDateChainOptions): DateChain => {
    return createDateChainFromResolvedConfig(props, getConfig())
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

export const createDateChain = (props?: CreateDateChainOptions, config?: DateFormatterConfig): DateChain => {
  const locale = getHelperLocale(config, props)

  return createDateChainFromResolvedConfig(props, createResolvedConfig(locale, config))
}

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
    createDateChain: createFormatterCreateDateChain(getConfig),
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
