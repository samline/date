# Vue

Use the Vue wrapper when you want a composable with reactive locale state.

```ts
import { useDateFormatter } from '@samline/date/vue'

const formatter = useDateFormatter({ locale: 'en', strict: true })

await formatter.ready

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
```

`formatter.currentLocale` is a computed ref tied to the formatter instance.
