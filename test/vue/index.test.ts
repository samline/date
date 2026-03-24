import { describe, expect, it } from 'vitest'

import { useDateFormatter } from '../../src/vue/index.js'

describe('vue wrapper', () => {
  it('returns a locale ref', () => {
    const formatter = useDateFormatter()

    expect(formatter.locale.value).toBe('en')
    expect(formatter.getSupportedLocales()).toContain('pt-br')
    expect(typeof formatter.parseDate).toBe('function')
  })

  it('keeps currentLocale reactive and scoped to the composable instance', async () => {
    const formatter = useDateFormatter({ locale: 'en' })

    await formatter.ready
    await formatter.setLocale('de-at')

    expect(formatter.locale.value).toBe('de')
    expect(formatter.currentLocale.value).toBe('de')
    expect(
      formatter.getDate({
        date: '2026-12-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM'
      })
    ).toBe('Dezember')
  })

  it('exposes parseDate and isValidDate from the composable', async () => {
    const formatter = useDateFormatter({ locale: 'en', strict: true })

    await formatter.ready

    expect(
      formatter.parseDate({
        date: '23/03/2026',
        input: 'DD/MM/YYYY'
      }).isValid
    ).toBe(true)

    expect(
      formatter.isValidDate({
        date: '1970-00-00',
        input: 'YYYY-MM-DD',
        strict: true
      })
    ).toBe(false)
  })

  it('resolves the configured locale to a supported base locale', async () => {
    const formatter = useDateFormatter({ locale: 'pt-pt' })

    await formatter.ready

    expect(formatter.locale.value).toBe('pt')
    expect(formatter.currentLocale.value).toBe('pt')
  })
})
