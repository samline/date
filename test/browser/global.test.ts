import { describe, expect, it } from 'vitest'

import { DateKit } from '../../src/browser/global.js'

describe('browser global', () => {
  it('exposes the browser api object', () => {
    expect(DateKit.getSupportedLocales()).toContain('en')
    expect(typeof DateKit.createDateFormatter).toBe('function')
    expect(typeof DateKit.getDate).toBe('function')
    expect(typeof DateKit.parseDate).toBe('function')
    expect(typeof DateKit.isValidDate).toBe('function')
    expect(typeof DateKit.resolveLocale).toBe('function')
    expect(typeof DateKit.isSupportedLocale).toBe('function')
  })

  it('exposes formatter creation in the browser build', async () => {
    const formatter = DateKit.createDateFormatter({ locale: 'fr-ca', strict: true })

    await formatter.ready

    expect(formatter.getCurrentLocale()).toBe('fr')

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

  it('exposes one-shot helpers in the browser build', async () => {
    expect(
      await DateKit.getDate({
        date: '23/03/2026',
        input: 'DD/MM/YYYY',
        output: 'YYYY-MM-DD'
      })
    ).toBe('2026-03-23')

    expect(
      (
        await DateKit.parseDate({
          date: '23/03/2026',
          input: 'DD/MM/YYYY'
        })
      ).isValid
    ).toBe(true)

    expect(
      await DateKit.isValidDate({
        date: '1970-00-00',
        input: 'YYYY-MM-DD'
      })
    ).toBe(false)
  })

  it('falls back to the base locale in one-shot browser helpers', async () => {
    expect(
      await DateKit.getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM',
        locale: 'en-us'
      })
    ).toBe('March')
  })

  it('exposes locale resolution helpers in the browser build', () => {
    expect(DateKit.resolveLocale('es-mx')).toBe('es-mx')
    expect(DateKit.resolveLocale('en-us')).toBe('en')
    expect(DateKit.resolveLocale('zz-zz')).toBeNull()
    expect(DateKit.isSupportedLocale('fr-ca')).toBe(true)
    expect(DateKit.isSupportedLocale('zz-zz')).toBe(false)
  })
})
