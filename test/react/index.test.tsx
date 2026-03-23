import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useDateFormatter } from '../../src/react/index.js'

describe('react wrapper', () => {
  it('returns formatting helpers', () => {
    const { result } = renderHook(() => useDateFormatter())

    expect(result.current.locale).toBe('en')
    expect(result.current.getSupportedLocales()).toContain('es')
  })
})
