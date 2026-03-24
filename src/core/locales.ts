export const SUPPORTED_LOCALES = [
  'en',
  'es',
  'es-mx',
  'fr',
  'pt',
  'pt-br',
  'de',
  'it',
  'ja'
] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
export type LocaleInput = string

const loadedLocales = new Set<SupportedLocale>(['en'])

const localeLoaders: Record<SupportedLocale, (() => Promise<unknown>) | null> = {
  en: null,
  es: () => import('dayjs/locale/es.js'),
  'es-mx': () => import('dayjs/locale/es-mx.js'),
  fr: () => import('dayjs/locale/fr.js'),
  pt: () => import('dayjs/locale/pt.js'),
  'pt-br': () => import('dayjs/locale/pt-br.js'),
  de: () => import('dayjs/locale/de.js'),
  it: () => import('dayjs/locale/it.js'),
  ja: () => import('dayjs/locale/ja.js')
}

const normalizeLocale = (locale: string): string => {
  return locale.trim().toLowerCase().replace(/_/g, '-')
}

const asSupportedLocale = (locale: string): SupportedLocale | null => {
  if (!SUPPORTED_LOCALES.includes(locale as SupportedLocale)) {
    return null
  }

  return locale as SupportedLocale
}

export const isSupportedLocale = (locale: string): boolean => {
  return resolveLocale(locale) !== null
}

export const resolveLocale = (locale: LocaleInput): SupportedLocale | null => {
  const normalizedLocale = normalizeLocale(locale)
  const exactLocale = asSupportedLocale(normalizedLocale)

  if (exactLocale) {
    return exactLocale
  }

  const [baseLocale] = normalizedLocale.split('-')

  if (!baseLocale) {
    return null
  }

  return asSupportedLocale(baseLocale)
}

export const markLocaleAsLoaded = (locale: SupportedLocale): void => {
  loadedLocales.add(locale)
}

export const ensureLocaleLoaded = async (locale: SupportedLocale): Promise<void> => {
  if (loadedLocales.has(locale)) {
    return
  }

  const load = localeLoaders[locale]

  if (!load) {
    loadedLocales.add(locale)
    return
  }

  await load()
  loadedLocales.add(locale)
}
