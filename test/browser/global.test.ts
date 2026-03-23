import { describe, expect, it } from 'vitest'

import { SamlineDate } from '../../src/browser/global.js'

describe('browser global', () => {
  it('exposes the browser api object', () => {
    expect(SamlineDate.getSupportedLocales()).toContain('en')
    expect(typeof SamlineDate.getDate).toBe('function')
    expect(typeof SamlineDate.setDayjs).toBe('function')
  })
})
