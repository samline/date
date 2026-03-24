# @samline/date

Small date formatting package built on top of Day.js with a shared core API, framework wrappers, and browser usage.

This package uses Day.js as its date engine. We are grateful for the existence of the package and will make good use of it in this project.

Repository: https://github.com/iamkun/dayjs

## Features

- format dates with configurable input and output patterns
- default locale is English
- load and switch supported locales on demand
- create formatter instances with isolated locale state
- enable strict parsing globally per formatter or per call
- parse and validate dates with explicit result objects
- use the same API from core, vanilla, React, Vue, Svelte, or browser global builds

## Installation

```bash
npm install @samline/date
```

## Entrypoints

| Entrypoint | Purpose |
| --- | --- |
| `@samline/date` | shared core API |
| `@samline/date/vanilla` | utility wrapper for plain TypeScript or JavaScript |
| `@samline/date/react` | React hook |
| `@samline/date/vue` | Vue composable |
| `@samline/date/svelte` | Svelte store helpers |
| `@samline/date/browser` | browser global build |

## Quick Start

```ts
import { createDateFormatter } from '@samline/date'

const formatter = createDateFormatter({ locale: 'es-mx', strict: true })

await formatter.ready

const date = formatter.getDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY',
  output: 'MMMM D, YYYY'
})
```

## API

### createDateFormatter

```ts
createDateFormatter(config?: {
  locale?: SupportedLocale
  strict?: boolean
  invalid?: string
}): {
  getDate(props?: GetDateOptions): string
  parseDate(props: DateParsingOptions): ParseDateResult
  isValidDate(props: DateParsingOptions): boolean
  getSupportedLocales(): readonly SupportedLocale[]
  getCurrentLocale(): SupportedLocale
  setLocale(locale: SupportedLocale): Promise<void>
  ready: Promise<void>
}
```

Creates a formatter instance with its own locale state. This avoids coupling framework wrappers and utility calls to the global Day.js locale.

Use `strict: true` to make parsing fail when the input does not match the provided format exactly.

If you override `locale` per call, make sure that locale was already loaded by a formatter instance.

The formatter instance exposes:

- `getDate(props?)`
- `parseDate(props)`
- `isValidDate(props)`
- `getCurrentLocale()`
- `setLocale(locale)`
- `getSupportedLocales()`
- `ready`

### parseDate

```ts
formatter.parseDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY',
  strict: true
})
```

Returns a structured result.

- Valid parse: `isValid`, `date`, `iso`, `timestamp`, `format(output?)`
- Invalid parse: `isValid: false`, `error`, and null date fields

### isValidDate

```ts
formatter.isValidDate({
  date: '1970-00-00',
  input: 'YYYY-MM-DD',
  strict: true
})
```

Returns a boolean when you only need validation without formatting.

## Supported Locales

The package ships helper support for these locale keys:

- `en`
- `es`
- `es-mx`
- `fr`
- `pt`
- `pt-br`
- `de`
- `it`
- `ja`

Use `createDateFormatter({ locale: 'es-mx' })` when you need a locale other than English.

## Documentation

- [docs/vanilla.md](docs/vanilla.md)
- [docs/browser.md](docs/browser.md)
- [docs/react.md](docs/react.md)
- [docs/vue.md](docs/vue.md)
- [docs/svelte.md](docs/svelte.md)

## License

MIT
