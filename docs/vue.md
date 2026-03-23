# Vue

Use the Vue wrapper when you want a composable with reactive locale state.

```ts
import { useDateFormatter } from '@samline/date/vue'

const formatter = useDateFormatter({ locale: 'en' })

await formatter.setLocale('pt-br')

formatter.getDate({
  date: '2026-03-23',
  input: 'YYYY-MM-DD',
  output: 'DD MMMM YYYY'
})
```
