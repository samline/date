import { describe, expect, it } from 'vitest'

import { createDateFormatter, getDate, getSupportedLocales, isValidDate, parseDate } from '../src/index.js'

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

  it('exposes supported locales', () => {
    expect(getSupportedLocales()).toContain('en')
    expect(getSupportedLocales()).toContain('es-mx')
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
})
