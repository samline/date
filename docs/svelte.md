# Svelte

Use the Svelte wrapper when you want a store-driven API for locale and formatting.

```ts
import { createDateFormatterStore } from '@samline/date/svelte'

const formatter = createDateFormatterStore({ locale: 'en' })

await formatter.setLocale('de')

formatter.getDate({
  date: '2026-03-23',
  input: 'YYYY-MM-DD',
  output: 'DD MMMM YYYY'
})
```
