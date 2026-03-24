import { createDateFormatter, getSupportedLocales } from '../index.js'

export const DateKit = {
  createDateFormatter,
  getSupportedLocales
}

declare global {
  interface Window {
    DateKit: typeof DateKit
  }
}

if (typeof window !== 'undefined') {
  window.DateKit = DateKit
}
