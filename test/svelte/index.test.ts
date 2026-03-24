import { describe, expect, it } from 'vitest'

import { createDateFormatterStore } from '../../src/svelte/index.js'

describe('svelte wrapper', () => {
  it('returns a readable locale store wrapper', () => {
    const formatter = createDateFormatterStore()

    expect(formatter.getLocale()).toBe('en')
    expect(formatter.getSupportedLocales()).toContain('ja')
    expect(typeof formatter.parseDate).toBe('function')
  })

  it('updates the store locale and formatter output together', async () => {
    const formatter = createDateFormatterStore({ locale: 'en' })

    await formatter.ready
    await formatter.setLocale('it-ch')

    expect(formatter.getLocale()).toBe('it')
    expect(formatter.currentLocale()).toBe('it')
    expect(
      formatter.getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM'
      })
    ).toBe('marzo')
  })

  it('exposes parseDate and isValidDate from the store api', async () => {
    const formatter = createDateFormatterStore({ locale: 'en', strict: true })

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

  it('resolves the initial locale to a supported base locale', async () => {
    const formatter = createDateFormatterStore({ locale: 'fr-ca' })

    await formatter.ready

    expect(formatter.getLocale()).toBe('fr')
    expect(formatter.currentLocale()).toBe('fr')
  })
})