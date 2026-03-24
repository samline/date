import {
  createDateChain,
  createDateFormatter,
  getDate,
  getSupportedLocales,
  isSupportedLocale,
  isValidDate,
  parseDate,
  resolveLocale
} from '../index.js'

export const DateKit = {
  createDateChain,
  createDateFormatter,
  getDate,
  getSupportedLocales,
  isSupportedLocale,
  parseDate,
  isValidDate,
  resolveLocale
}

declare global {
  interface Window {
    DateKit: typeof DateKit
  }
}

if (typeof window !== 'undefined') {
  window.DateKit = DateKit
}
