# React

Use the React wrapper when you want locale state and formatting helpers inside components.

```tsx
import { useEffect, useState } from 'react'
import { useDateFormatter } from '@samline/date/react'

export function Example() {
  const { locale, currentLocale, setLocale, getDate, parseDate, isValidDate, createDateChain, ready } = useDateFormatter({
    locale: 'en-us',
    strict: true
  })
  const [movedDate, setMovedDate] = useState('')

  const parsed = parseDate({ date: '23/03/2026', input: 'DD/MM/YYYY' })

  useEffect(() => {
    void (async () => {
      await ready

      const chain = createDateChain({ date: '23/03/2026', input: 'DD/MM/YYYY' })

      await chain.ready
      setMovedDate(chain.add(3, 'month').set('day', 1).format('YYYY-MM-DD'))
    })()
  }, [createDateChain, ready])

  return (
    <div>
      <button onClick={() => void setLocale('es-mx')}>{locale}</button>
      <strong>{currentLocale}</strong>
      <span>{getDate({ date: '2026-03-23', input: 'YYYY-MM-DD', output: 'MMMM D, YYYY' })}</span>
      <small>{parsed.isValid ? parsed.format('YYYY-MM-DD') : 'invalid'}</small>
      <small>{movedDate || 'loading'}</small>
      <small>{String(isValidDate({ date: '1970-00-00', input: 'YYYY-MM-DD', strict: true }))}</small>
    </div>
  )
}
```

The hook exposes:

- `createDateChain(props?)`
- `getDate(props?)`
- `parseDate(props)`
- `isValidDate(props)`
- `setLocale(locale)`
- `locale`
- `currentLocale`
- `getSupportedLocales()`
- `ready`

Use `createDateChain(...)` when you need multiple date operations in the same hook flow. The chain inherits the hook's formatter configuration and locale rules.

If the locale may need to load, wait for both `ready` and `chain.ready` before calling chain methods.

The hook now uses an internal formatter instance, so locale changes stay scoped to the hook instead of mutating the shared global locale.

Regional locale input falls back to the supported base locale when the exact variant is not available. For example, `en-us` resolves to `en`, while `es-mx` stays `es-mx`.
