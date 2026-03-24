import { describe, expect, it } from 'vitest'

import { DateKit } from '../../src/browser/global.js'

describe('browser global', () => {
  it('exposes the browser api object', () => {
    expect(DateKit.getSupportedLocales()).toContain('en')
    expect(typeof DateKit.createDateFormatter).toBe('function')
  })

  it('exposes formatter creation in the browser build', async () => {
    const formatter = DateKit.createDateFormatter({ locale: 'fr', strict: true })

    await formatter.ready

    expect(
      formatter.getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM'
      })
    ).toBe('mars')
  })

  it('exposes parseDate and isValidDate in the browser build', () => {
    expect(
      DateKit.createDateFormatter({ locale: 'en', strict: true }).parseDate({
        date: '23/03/2026',
        input: 'DD/MM/YYYY',
        strict: true
      }).isValid
    ).toBe(true)

    expect(
      DateKit.createDateFormatter({ locale: 'en', strict: true }).isValidDate({
        date: '1970-00-00',
        input: 'YYYY-MM-DD',
        strict: true
      })
    ).toBe(false)
  })
})
