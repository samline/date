# Vue

Use the Vue wrapper when you want a composable with reactive locale state.

```ts
import { useDateFormatter } from '@samline/date/vue'

const formatter = useDateFormatter({ locale: 'pt-pt', strict: true })

await formatter.ready

formatter.currentLocale.value
// pt

await formatter.setLocale('pt-br')

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

The composable exposes:

- `createDateChain(props?)`
- `getDate(props?)`
- `parseDate(props)`
- `isValidDate(props)`
- `setLocale(locale)`
- `locale`
- `currentLocale`
- `getSupportedLocales()`
- `ready`

Use `createDateChain(...)` when you need chained manipulation or comparison while staying scoped to the composable's formatter configuration.

If the locale may need to load, wait for both `formatter.ready` and `chain.ready` before calling chain methods.

`formatter.currentLocale` is a computed ref tied to the formatter instance.

Regional input resolves to the exact supported locale when it exists and otherwise falls back to the base locale.
