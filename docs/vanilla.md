# Vanilla

Use the vanilla entrypoint when you want a small utility wrapper in plain JavaScript or TypeScript.

```ts
import { createDateFormatter } from '@samline/date/vanilla'

const formatter = createDateFormatter({ locale: 'en' })

await formatter.setLocale('es')

formatter.getDate({
  date: '2026-03-23',
  input: 'YYYY-MM-DD',
  output: 'DD MMMM YYYY'
})
```

## API

- `createDateFormatter(options?)`
- `formatter.getDate(props?)`
- `formatter.setLocale(locale)`
- `formatter.getSupportedLocales()`
