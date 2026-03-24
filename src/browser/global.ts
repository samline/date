import { createDateFormatter, getDate, getSupportedLocales, isValidDate, parseDate } from '../index.js'

export const DateKit = {
  createDateFormatter,
  getDate,
  getSupportedLocales
  ,
  parseDate,
  isValidDate
}

declare global {
  interface Window {
    DateKit: typeof DateKit
  }
}

if (typeof window !== 'undefined') {
  window.DateKit = DateKit
}
