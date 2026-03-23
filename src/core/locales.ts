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

export const isSupportedLocale = (locale: string): locale is SupportedLocale => {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}

export const ensureLocaleLoaded = async (locale: SupportedLocale): Promise<void> => {
  const load = localeLoaders[locale]

  if (!load) {
    return
  }

  await load()
}
