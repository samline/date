import { describe, expect, it } from 'vitest'

import { getDate, getSupportedLocales, setDayjs } from '../src/index.js'

describe('getDate', () => {
  it('returns the current date when called without args', () => {
    expect(getDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('formats an input date', () => {
    expect(
      getDate({
        date: '23/03/2026',
        input: 'DD/MM/YYYY',
        output: 'YYYY-MM-DD'
      })
    ).toBe('2026-03-23')
  })

  it('returns invalid date for unsupported input', () => {
    expect(
      getDate({
        date: 'not-a-date',
        input: 'DD/MM/YYYY',
        output: 'YYYY-MM-DD'
      })
    ).toBe('Invalid Date')
  })

  it('loads locales on demand', async () => {
    await setDayjs('es-mx')

    expect(
      getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM'
      })
    ).toBe('marzo')
  })

  it('exposes supported locales', () => {
    expect(getSupportedLocales()).toContain('en')
    expect(getSupportedLocales()).toContain('es-mx')
  })
})
