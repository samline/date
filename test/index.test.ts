import { describe, expect, it } from 'vitest'

import {
  createDateChain,
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

  it('creates a chainable date helper from the root api', async () => {
    const chain = createDateChain({
      date: '23/03/2026',
      input: 'DD/MM/YYYY'
    })

    await chain.ready

    expect(chain.add(3, 'month').format('YYYY-MM-DD')).toBe('2026-06-23')
    expect(chain.set('day', 1).format('YYYY-MM-DD')).toBe('2026-06-01')
    expect(chain.toTimestamp()).toBeTypeOf('number')
    expect(chain.isSame('2026-06-01', 'day')).toBe(true)
  })

  it('creates a chainable date helper from a formatter instance', async () => {
    const formatter = createDateFormatter({ locale: 'fr', strict: true })

    await formatter.ready

    const chain = formatter.createDateChain({
      date: '2026-03-23',
      input: 'YYYY-MM-DD'
    })

    await chain.ready

    expect(chain.format('MMMM')).toBe('mars')
    expect(chain.endOf('month').format('YYYY-MM-DD')).toBe('2026-03-31')
  })

  it('preserves invalid chain state and exposes it through toState', async () => {
    const chain = createDateChain({
      date: '31/02/2026',
      input: 'DD/MM/YYYY',
      strict: true,
      invalid: 'Fecha invalida'
    })

    await chain.ready

    expect(chain.isValid()).toBe(false)
    expect(chain.add(1, 'month').format('YYYY-MM-DD')).toBe('Fecha invalida')
    expect(chain.toISOString()).toBeNull()
    expect(chain.toTimestamp()).toBeNull()

    const state = chain.toState()

    expect(state.isValid).toBe(false)

    if (!state.isValid) {
      expect(state.error).toBe('Fecha invalida')
    }
  })

  it('waits for locale loading when creating a chain for an unloaded locale', async () => {
    const chain = createDateChain({
      date: '2026-03-23',
      input: 'YYYY-MM-DD',
      locale: 'es-mx'
    })

    await chain.ready

    expect(chain.format('MMMM')).toBe('marzo')
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

  it('throws when using an unloaded locale chain before it is ready', () => {
    const chain = createDateChain({
      date: '2026-03-23',
      input: 'YYYY-MM-DD',
      locale: 'pt-br'
    })

    expect(() => chain.format('MMMM')).toThrow(
      'Date chain is not ready. Await chain.ready before using it with locales that may need to load.'
    )
  })
})
