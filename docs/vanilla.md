# Vanilla

Use the vanilla entrypoint when you want a small utility wrapper in plain JavaScript or TypeScript.

```ts
import { createDateChain, getDate } from '@samline/date/vanilla'

const chain = createDateChain({
  date: '23/03/2026',
  input: 'DD/MM/YYYY'
})

await chain.ready

const moved = chain
  .add(3, 'month')
  .set('day', 1)
  .format('YYYY-MM-DD')

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

await formatter.setLocale('en-us')
formatter.getCurrentLocale()
// en

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

const formatterChain = formatter.createDateChain({
  date: '2026-03-23',
  input: 'YYYY-MM-DD'
})

await formatterChain.ready

formatterChain.startOf('month').format('YYYY-MM-DD')
```

## API

- `createDateFormatter(options?)`
- `createDateChain(props?, config?)`
- `getDate(props?, config?)`
- `parseDate(props, config?)`
- `isValidDate(props, config?)`
- `formatter.getDate(props?)`
- `formatter.createDateChain(props?)`
- `formatter.parseDate(props)`
- `formatter.isValidDate(props)`
- `formatter.setLocale(locale)`
- `formatter.getCurrentLocale()`
- `formatter.getSupportedLocales()`
- `formatter.ready`

Each formatter instance keeps its own locale state.

The top-level one-shot helpers load the needed locale automatically and use `strict: true` by default.

`createDateChain(...)` also works as a one-shot helper. It returns a chainable object immediately, and you should `await chain.ready` before using it when the locale may need to load.

The chainable helper exposes:

- `add(value, unit)`
- `subtract(value, unit)`
- `set(unit, value)`
- `startOf(unit)`
- `endOf(unit)`
- `format(output?)`
- `toDate()`
- `toISOString()`
- `toTimestamp()`
- `isValid()`
- `isBefore(other, unit?)`
- `isAfter(other, unit?)`
- `isSame(other, unit?)`
- `toState()`
- `ready`

Per-call `locale` overrides work after that effective locale has been loaded by any formatter instance.

Locale resolution tries an exact match first and then falls back to the base locale before the hyphen. For example, `es-mx` stays `es-mx`, while `fr-ca` resolves to `fr`.
