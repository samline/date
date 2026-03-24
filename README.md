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
import { getDate } from '@samline/date'

const date = await getDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY',
  output: 'MMMM D, YYYY'
})
```

You can also inspect the effective locale before formatting:

```ts
import { resolveLocale } from '@samline/date'

resolveLocale('es-mx')
// es-mx

resolveLocale('en-us')
// en

resolveLocale('zz-zz')
// null
```

For repeated work with the same locale or invalid text, create one formatter instance and reuse it:

```ts
import { createDateFormatter } from '@samline/date'

const formatter = createDateFormatter({ locale: 'es-mx' })

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
  locale?: LocaleInput
  strict?: boolean
  invalid?: string
}): {
  getDate(props?: GetDateOptions): string
  parseDate(props: DateParsingOptions): ParseDateResult
  isValidDate(props: DateParsingOptions): boolean
  getSupportedLocales(): readonly SupportedLocale[]
  getCurrentLocale(): SupportedLocale
  setLocale(locale: LocaleInput): Promise<void>
  ready: Promise<void>
}
```

Creates a formatter instance with its own locale state. This avoids coupling framework wrappers and utility calls to the global Day.js locale.

`strict` is `true` by default, so parsing fails when the input does not match the provided format exactly. Use `strict: false` only when you explicitly want lenient parsing.

If you override `locale` per call, make sure the effective locale was already loaded by a formatter instance.

Regional locale input falls back to the base locale when the exact variant is not supported by the package. For example, `en-us` resolves to `en`, while `es-mx` stays as `es-mx` because that locale is supported explicitly.

The formatter instance exposes:

- `getDate(props?)`
- `parseDate(props)`
- `isValidDate(props)`
- `getCurrentLocale()`
- `setLocale(locale)`
- `getSupportedLocales()`
- `ready`

### Locale helpers

```ts
resolveLocale(locale: LocaleInput): SupportedLocale | null
isSupportedLocale(locale: string): boolean
```

Use `resolveLocale` when you want to know the effective locale before creating a formatter or calling a helper.

Use `isSupportedLocale` when you only need a boolean check after the package applies its exact-match and base-locale fallback rules.

These helpers are also available in the browser build through `DateKit.resolveLocale(...)` and `DateKit.isSupportedLocale(...)`.

### One-shot helpers

```ts
getDate(props?: GetDateOptions, config?: DateFormatterConfig): Promise<string>
parseDate(props: DateParsingOptions, config?: DateFormatterConfig): Promise<ParseDateResult>
isValidDate(props: DateParsingOptions, config?: DateFormatterConfig): Promise<boolean>
```

Use these helpers when you only need a single operation and do not want to create a formatter instance manually.

| Helper | Returns | Use it when you need |
| --- | --- | --- |
| `getDate(...)` | formatted string | a final display value |
| `parseDate(...)` | structured parse result | validation details, `Date`, `iso`, `timestamp`, or deferred formatting |
| `isValidDate(...)` | boolean | only a yes or no validation check |

```ts
import { getDate, isValidDate, parseDate } from '@samline/date'

const value = await getDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY',
  output: 'YYYY-MM-DD'
})

const parsed = await parseDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY'
})

const valid = await isValidDate({
  date: '1970-00-00',
  input: 'YYYY-MM-DD'
})
```

They load the requested locale automatically and also use `strict: true` by default.

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

You can also pass regional locale input such as `en-us`, `fr-ca`, or `pt-pt`.

The resolution rule is:

- if the exact locale exists, use it
- otherwise, try the base locale before the hyphen
- if neither exists, throw an unsupported locale error

Examples:

- `es-mx` -> `es-mx`
- `es-ar` -> `es`
- `en-us` -> `en`
- `pt-pt` -> `pt`
- `zz-zz` -> error

Use a simple locale like `fr` or `en` when the base language is enough. Use a regional locale like `es-mx` or `pt-br` when you need a supported country-specific variant.

## Documentation

- [docs/vanilla.md](docs/vanilla.md)
- [docs/browser.md](docs/browser.md)
- [docs/react.md](docs/react.md)
- [docs/vue.md](docs/vue.md)
- [docs/svelte.md](docs/svelte.md)

## License

MIT
