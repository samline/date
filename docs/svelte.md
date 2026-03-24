# Svelte

Use the Svelte wrapper when you want a store-driven API for locale and formatting.

```ts
import { createDateFormatterStore } from '@samline/date/svelte'

const formatter = createDateFormatterStore({ locale: 'fr-ca', strict: true })

await formatter.ready

formatter.currentLocale()
// fr

await formatter.setLocale('de')

formatter.getDate({
  date: '2026-03-23',
  input: 'YYYY-MM-DD',
  output: 'DD MMMM YYYY'
})

formatter.parseDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY'
})

formatter.isValidDate({
  date: '1970-00-00',
  input: 'YYYY-MM-DD',
  strict: true
})

const chain = formatter.createDateChain({
  date: '23/03/2026',
  input: 'DD/MM/YYYY'
})

await chain.ready

chain.add(3, 'month').set('day', 1).format('YYYY-MM-DD')
```

The store API exposes:

- `createDateChain(props?)`
- `getDate(props?)`
- `parseDate(props)`
- `isValidDate(props)`
- `setLocale(locale)`
- `locale`
- `currentLocale()`
- `getLocale()`
- `getSupportedLocales()`
- `ready`

Use `createDateChain(...)` when you need chained manipulation or comparison while keeping locale state scoped to the store instance.

If the locale may need to load, wait for both `formatter.ready` and `chain.ready` before calling chain methods.

The store keeps locale state aligned with the formatter instance and exposes `currentLocale()` and `ready`.

Regional locale input uses the exact variant when supported and otherwise falls back to the base locale.
