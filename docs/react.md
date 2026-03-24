# React

Use the React wrapper when you want locale state and formatting helpers inside components.

```tsx
import { useDateFormatter } from '@samline/date/react'

export function Example() {
  const { locale, currentLocale, setLocale, getDate, parseDate, isValidDate } = useDateFormatter({
    locale: 'en',
    strict: true
  })

  const parsed = parseDate({ date: '23/03/2026', input: 'DD/MM/YYYY' })

  return (
    <div>
      <button onClick={() => void setLocale('es-mx')}>{locale}</button>
      <strong>{currentLocale}</strong>
      <span>{getDate({ date: '2026-03-23', input: 'YYYY-MM-DD', output: 'MMMM D, YYYY' })}</span>
      <small>{parsed.isValid ? parsed.format('YYYY-MM-DD') : 'invalid'}</small>
      <small>{String(isValidDate({ date: '1970-00-00', input: 'YYYY-MM-DD', strict: true }))}</small>
    </div>
  )
}
```

The hook now uses an internal formatter instance, so locale changes stay scoped to the hook instead of mutating the shared global locale.
