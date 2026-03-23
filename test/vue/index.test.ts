import { describe, expect, it } from 'vitest'

import { useDateFormatter } from '../../src/vue/index.js'

describe('vue wrapper', () => {
  it('returns a locale ref', () => {
    const formatter = useDateFormatter()

    expect(formatter.locale.value).toBe('en')
    expect(formatter.getSupportedLocales()).toContain('pt-br')
  })
})
