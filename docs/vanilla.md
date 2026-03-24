# Vanilla

Use the vanilla entrypoint when you want a small utility wrapper in plain JavaScript or TypeScript.

```ts
import { createDateFormatter } from '@samline/date/vanilla'

const formatter = createDateFormatter({ locale: 'en', strict: true })

await formatter.ready

await formatter.setLocale('es')

formatter.getDate({
  date: '2026-03-23',
  input: 'YYYY-MM-DD',
  output: 'DD MMMM YYYY'
})

formatter.getDate({
  date: '1970-00-00',
  input: 'YYYY-MM-DD',
  output: 'YYYY-MM-DD'
})
// Invalid Date

const parsed = formatter.parseDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY'
})

if (parsed.isValid) {
  parsed.format('YYYY-MM-DD')
}

formatter.isValidDate({
  date: '1970-00-00',
  input: 'YYYY-MM-DD',
  strict: true
})
```

## API

- `createDateFormatter(options?)`
- `formatter.getDate(props?)`
- `formatter.parseDate(props)`
- `formatter.isValidDate(props)`
- `formatter.setLocale(locale)`
- `formatter.getCurrentLocale()`
- `formatter.getSupportedLocales()`
- `formatter.ready`

Each formatter instance keeps its own locale state.

Per-call `locale` overrides work after that locale has been loaded by any formatter instance.
