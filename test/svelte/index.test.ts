import { describe, expect, it } from 'vitest'

import { createDateFormatterStore } from '../../src/svelte/index.js'

describe('svelte wrapper', () => {
  it('returns a readable locale store wrapper', () => {
    const formatter = createDateFormatterStore()

    expect(formatter.getLocale()).toBe('en')
    expect(formatter.getSupportedLocales()).toContain('ja')
  })
})