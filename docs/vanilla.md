# Vanilla

Use the vanilla entrypoint when you want a small utility wrapper in plain JavaScript or TypeScript.

```ts
import { getDate } from '@samline/date/vanilla'

const value = await getDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY',
  output: 'YYYY-MM-DD'
})
```

When you need to reuse locale state or configuration, create a formatter instance:

```ts
import { createDateFormatter } from '@samline/date/vanilla'

const formatter = createDateFormatter({ locale: 'en' })

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
- `getDate(props?, config?)`
- `parseDate(props, config?)`
- `isValidDate(props, config?)`
- `formatter.getDate(props?)`
- `formatter.parseDate(props)`
- `formatter.isValidDate(props)`
- `formatter.setLocale(locale)`
- `formatter.getCurrentLocale()`
- `formatter.getSupportedLocales()`
- `formatter.ready`

Each formatter instance keeps its own locale state.

The top-level one-shot helpers load the needed locale automatically and use `strict: true` by default.

Per-call `locale` overrides work after that locale has been loaded by any formatter instance.
