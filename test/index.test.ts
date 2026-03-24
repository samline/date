import { describe, expect, it } from 'vitest'

import {
  createDateFormatter,
  getDate,
  getSupportedLocales,
  isSupportedLocale,
  isValidDate,
  parseDate,
  resolveLocale
} from '../src/index.js'

describe('createDateFormatter', () => {
  it('returns the current date when called without args', async () => {
    const formatter = createDateFormatter()

    await formatter.ready

    expect(formatter.getDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('formats an input date', async () => {
    const formatter = createDateFormatter()

    await formatter.ready

    expect(
      formatter.getDate({
        date: '23/03/2026',
        input: 'DD/MM/YYYY',
        output: 'YYYY-MM-DD'
      })
    ).toBe('2026-03-23')
  })

  it('returns invalid date for unsupported input', async () => {
    const formatter = createDateFormatter()

    await formatter.ready

    expect(
      formatter.getDate({
        date: 'not-a-date',
        input: 'DD/MM/YYYY',
        output: 'YYYY-MM-DD'
      })
    ).toBe('Invalid Date')
  })

  it('uses strict parsing by default', async () => {
    const formatter = createDateFormatter()

    await formatter.ready

    expect(
      formatter.getDate({
        date: '1970-00-00',
        input: 'YYYY-MM-DD',
        output: 'YYYY-MM-DD'
      })
    ).toBe('Invalid Date')
  })

  it('loads locales on demand inside the formatter instance', async () => {
    const formatter = createDateFormatter({ locale: 'es-mx' })

    await formatter.ready

    expect(
      formatter.getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM'
      })
    ).toBe('marzo')
  })

  it('falls back from a regional locale to its supported base locale', async () => {
    const formatter = createDateFormatter({ locale: 'en-us' })

    await formatter.ready

    expect(formatter.getCurrentLocale()).toBe('en')
    expect(
      formatter.getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM'
      })
    ).toBe('March')
  })

  it('exposes supported locales', () => {
    expect(getSupportedLocales()).toContain('en')
    expect(getSupportedLocales()).toContain('es-mx')
  })

  it('exposes locale resolution helpers', () => {
    expect(resolveLocale('es-mx')).toBe('es-mx')
    expect(resolveLocale('en-us')).toBe('en')
    expect(resolveLocale('es_AR')).toBe('es')
    expect(resolveLocale('zz-zz')).toBeNull()
    expect(isSupportedLocale('fr')).toBe(true)
    expect(isSupportedLocale('fr-ca')).toBe(true)
    expect(isSupportedLocale('zz-zz')).toBe(false)
  })

  it('supports strict parsing through formatter config', async () => {
    const formatter = createDateFormatter({ locale: 'en', strict: true })

    await formatter.ready

    expect(
      formatter.getDate({
        date: '1970-00-00',
        input: 'YYYY-MM-DD',
        output: 'YYYY-MM-DD'
      })
    ).toBe('Invalid Date')
  })

  it('allows overriding strict parsing per call', async () => {
    const formatter = createDateFormatter({ locale: 'en', strict: true })

    await formatter.ready

    expect(
      formatter.getDate({
        date: '1970-00-00',
        input: 'YYYY-MM-DD',
        output: 'YYYY-MM-DD',
        strict: false
      })
    ).toBe('1970-01-01')
  })

  it('keeps locale isolated per formatter instance', async () => {
    const englishFormatter = createDateFormatter({ locale: 'en' })
    const frenchFormatter = createDateFormatter({ locale: 'fr' })

    await Promise.all([englishFormatter.ready, frenchFormatter.ready])

    expect(
      englishFormatter.getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM'
      })
    ).toBe('March')

    expect(
      frenchFormatter.getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM'
      })
    ).toBe('mars')
  })

  it('supports locale overrides per call without mutating the formatter', async () => {
    const formatter = createDateFormatter({ locale: 'en' })
    const spanishFormatter = createDateFormatter({ locale: 'es' })

    await Promise.all([formatter.ready, spanishFormatter.ready])
    await formatter.setLocale('fr')

    expect(
      formatter.getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM',
        locale: 'es'
      })
    ).toBe('marzo')

    expect(formatter.getCurrentLocale()).toBe('fr')
  })

  it('resolves per-call regional locales to a supported base locale', async () => {
    const formatter = createDateFormatter({ locale: 'en' })
    const frenchFormatter = createDateFormatter({ locale: 'fr' })

    await Promise.all([formatter.ready, frenchFormatter.ready])

    expect(
      formatter.getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM',
        locale: 'fr-ca'
      })
    ).toBe('mars')

    expect(formatter.getCurrentLocale()).toBe('en')
  })

  it('returns a structured parse result for valid dates', async () => {
    const formatter = createDateFormatter({ locale: 'en', strict: true })

    await formatter.ready

    const parsed = formatter.parseDate({
      date: '23/03/2026',
      input: 'DD/MM/YYYY',
      strict: true
    })

    expect(parsed.isValid).toBe(true)

    if (parsed.isValid) {
      expect(parsed.locale).toBe('en')
      expect(parsed.timestamp).toBeTypeOf('number')
      expect(parsed.format('YYYY-MM-DD')).toBe('2026-03-23')
    }
  })

  it('returns a structured parse failure for invalid dates', async () => {
    const formatter = createDateFormatter({ locale: 'en', strict: true })

    await formatter.ready

    const parsed = formatter.parseDate({
      date: '1970-00-00',
      input: 'YYYY-MM-DD',
      strict: true
    })

    expect(parsed.isValid).toBe(false)

    if (!parsed.isValid) {
      expect(parsed.error).toBe('Invalid Date')
      expect(parsed.date).toBeNull()
    }
  })

  it('exposes boolean validation through isValidDate', async () => {
    const formatter = createDateFormatter({ locale: 'en', strict: true })

    await formatter.ready

    expect(
      formatter.isValidDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        strict: true
      })
    ).toBe(true)

    expect(
      formatter.isValidDate({
        date: '1970-00-00',
        input: 'YYYY-MM-DD',
        strict: true
      })
    ).toBe(false)
  })

  it('supports one-shot helper functions without creating a formatter manually', async () => {
    expect(
      await getDate({
        date: '23/03/2026',
        input: 'DD/MM/YYYY',
        output: 'YYYY-MM-DD'
      })
    ).toBe('2026-03-23')

    const parsed = await parseDate({
      date: '23/03/2026',
      input: 'DD/MM/YYYY'
    })

    expect(parsed.isValid).toBe(true)

    expect(
      await isValidDate({
        date: '1970-00-00',
        input: 'YYYY-MM-DD'
      })
    ).toBe(false)
  })

  it('loads locales on demand for one-shot helper functions', async () => {
    expect(
      await getDate(
        {
          date: '2026-03-23',
          input: 'YYYY-MM-DD',
          output: 'MMMM',
          locale: 'fr'
        },
        { invalid: 'Invalid Date' }
      )
    ).toBe('mars')
  })

  it('falls back to the base locale for one-shot helper functions', async () => {
    expect(
      await getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM',
        locale: 'pt-pt'
      })
    ).toBe('março')
  })

  it('throws when neither the regional locale nor the base locale is supported', () => {
    expect(() => createDateFormatter({ locale: 'zz-zz' })).toThrow(
      'Unsupported locale: zz-zz. The package tries an exact locale match first and then falls back to the base locale.'
    )
  })
})
