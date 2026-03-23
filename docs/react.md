# React

Use the React wrapper when you want locale state and formatting helpers inside components.

```tsx
import { useDateFormatter } from '@samline/date/react'

export function Example() {
  const { locale, setLocale, getDate } = useDateFormatter({ locale: 'en' })

  return (
    <div>
      <button onClick={() => void setLocale('es-mx')}>{locale}</button>
      <span>{getDate({ date: '2026-03-23', input: 'YYYY-MM-DD', output: 'MMMM D, YYYY' })}</span>
    </div>
  )
}
```
