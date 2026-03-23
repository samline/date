import { getDate, getSupportedLocales, setDayjs } from '../index.js'

export const SamlineDate = {
  getDate,
  getSupportedLocales,
  setDayjs
}

declare global {
  interface Window {
    SamlineDate: typeof SamlineDate
  }
}

if (typeof window !== 'undefined') {
  window.SamlineDate = SamlineDate
}
