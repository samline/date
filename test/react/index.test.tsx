import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useDateFormatter } from '../../src/react/index.js'

describe('react wrapper', () => {
  it('returns formatting helpers', () => {
    const { result } = renderHook(() => useDateFormatter())

    expect(result.current.locale).toBe('en')
    expect(result.current.getSupportedLocales()).toContain('es')
    expect(typeof result.current.parseDate).toBe('function')
  })

  it('updates locale without relying on the global formatter state', async () => {
    const { result } = renderHook(() => useDateFormatter({ locale: 'en' }))

    await act(async () => {
      await result.current.ready
      await result.current.setLocale('fr-ca')
    })

    expect(result.current.locale).toBe('fr')
    expect(result.current.currentLocale).toBe('fr')
    expect(
      result.current.getDate({
        date: '2026-03-23',
        input: 'YYYY-MM-DD',
        output: 'MMMM'
      })
    ).toBe('mars')
  })

  it('exposes parseDate and isValidDate from the hook', async () => {
    const { result } = renderHook(() => useDateFormatter({ locale: 'en', strict: true }))

    await act(async () => {
      await result.current.ready
    })

    const parsed = result.current.parseDate({
      date: '23/03/2026',
      input: 'DD/MM/YYYY'
    })

    expect(parsed.isValid).toBe(true)
    expect(
      result.current.isValidDate({
        date: '1970-00-00',
        input: 'YYYY-MM-DD',
        strict: true
      })
    ).toBe(false)
  })

  it('resolves the initial locale to a supported base locale', async () => {
    const { result } = renderHook(() => useDateFormatter({ locale: 'en-us' }))

    await act(async () => {
      await result.current.ready
    })

    expect(result.current.locale).toBe('en')
    expect(result.current.currentLocale).toBe('en')
  })
})
