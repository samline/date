# @samline/date

Small date formatting package built on top of Day.js with strict parsing, locale-aware formatting, and a shared API for core, vanilla, React, Vue, Svelte, and browser usage.

This package uses Day.js as its date engine. Thanks to the Day.js project for making that foundation available.

Day.js repository: https://github.com/iamkun/dayjs

## Features

- format dates with configurable input and output patterns
- default locale is English
- load and switch supported locales on demand
- manipulate and compare dates through a chainable helper
- create formatter instances with isolated locale state
- enable strict parsing globally per formatter or per call
- parse and validate dates with explicit result objects
- use the same API from core, vanilla, React, Vue, Svelte, or browser global builds

## Table of Contents

- [Installation](#installation)
- [CDN / Browser](#cdn--browser)
- [Entrypoints](#entrypoints)
- [Quick Start](#quick-start)
- [API](#api)
- [Supported Locales](#supported-locales)
- [Documentation](#documentation)
- [License](#license)

## Installation

Use the package manager that matches your project. The published package targets Node 20 or newer.

```bash
npm install @samline/date
```

```bash
pnpm add @samline/date
```

```bash
yarn add @samline/date
```

```bash
bun add @samline/date
```

## CDN / Browser

Use the browser bundle when your project loads scripts directly in the page and cannot compile npm modules.

This is useful in environments such as Shopify themes, WordPress templates, or plain HTML pages with no build step.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/date@2.2.0/dist/browser/date.global.js"></script>
```

Then use it from a normal script:

```html
<script>
  ;(async () => {
    const value = await window.DateKit.getDate({
      date: '23/03/2026',
      input: 'DD/MM/YYYY',
      output: 'MMMM D, YYYY'
    })

    console.log(value)
    console.log(window.DateKit.resolveLocale('en-us'))
  })()
</script>
```

After the CDN script loads, the browser build exposes `window.DateKit`.

Use one of the package manager commands above when your project has a build step. If you are working in Shopify, WordPress, or any browser-only template without compilation, use the browser bundle described in [docs/browser.md](docs/browser.md).

## Entrypoints

| Entrypoint | Main API | Purpose |
| --- | --- | --- |
| `@samline/date` | `createDateChain`, `createDateFormatter`, `getDate`, `parseDate`, `isValidDate` | shared core API |
| `@samline/date/vanilla` | same exports as root | utility wrapper for plain TypeScript or JavaScript |
| `@samline/date/react` | `useDateFormatter` | React hook with scoped formatter and chain state |
| `@samline/date/vue` | `useDateFormatter` | Vue composable with reactive formatter and chain state |
| `@samline/date/svelte` | `createDateFormatterStore` | Svelte store-driven formatter and chain API |
| `@samline/date/browser` | `DateKit` | browser global build for projects without a bundler |

## Quick Start

Use the one-shot helpers when you only need a single async operation.

```ts
import { getDate } from '@samline/date'

const date = await getDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY',
  output: 'MMMM D, YYYY'
})
```

If you need repeated formatting, parsing, or locale changes, create one formatter instance and reuse it.

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

You can also inspect the effective locale before formatting:

```ts
import { getSupportedLocales, resolveLocale } from '@samline/date'

getSupportedLocales()
// ['en', 'es', 'es-mx', 'fr', 'pt', 'pt-br', 'de', 'it', 'ja']

resolveLocale('es-mx')
// es-mx

resolveLocale('en-us')
// en

resolveLocale('zz-zz')
// null
```

## API

The shared root entrypoint exports:

- `createDateChain(props?, config?)`
- `createDateFormatter(config?)`
- `getDate(props?, config?)`
- `parseDate(props, config?)`
- `isValidDate(props, config?)`
- `getSupportedLocales()`
- `SUPPORTED_LOCALES`
- `resolveLocale(locale)`
- `isSupportedLocale(locale)`

### createDateFormatter

```ts
createDateFormatter(config?: {
  locale?: LocaleInput
  strict?: boolean
  invalid?: string
}): {
  createDateChain(props?: CreateDateChainOptions): DateChain
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

- `createDateChain(props?)`
- `getDate(props?)`
- `parseDate(props)`
- `isValidDate(props)`
- `getCurrentLocale()`
- `setLocale(locale)`
- `getSupportedLocales()`
- `ready`

### Locale helpers

```ts
SUPPORTED_LOCALES: readonly SupportedLocale[]
getSupportedLocales(): readonly SupportedLocale[]
resolveLocale(locale: LocaleInput): SupportedLocale | null
isSupportedLocale(locale: string): boolean
```

Use `SUPPORTED_LOCALES` or `getSupportedLocales()` when you need the list of locale keys exposed by the package.

Use `resolveLocale` when you want to know the effective locale before creating a formatter or calling a helper.

Use `isSupportedLocale` when you only need a boolean check after the package applies its exact-match and base-locale fallback rules.

These helpers are also available in the browser build through `DateKit.getSupportedLocales()`, `DateKit.resolveLocale(...)`, and `DateKit.isSupportedLocale(...)`.

### One-shot helpers

```ts
createDateChain(props?: CreateDateChainOptions, config?: DateFormatterConfig): DateChain
getDate(props?: GetDateOptions, config?: DateFormatterConfig): Promise<string>
parseDate(props: DateParsingOptions, config?: DateFormatterConfig): Promise<ParseDateResult>
isValidDate(props: DateParsingOptions, config?: DateFormatterConfig): Promise<boolean>
```

Use these helpers when you only need a single operation and do not want to create a formatter instance manually.

All three helpers are async because they can load locale data before running the operation.

| Helper | Returns | Use it when you need |
| --- | --- | --- |
| `createDateChain(...)` | chainable date helper | a one-shot manipulation or comparison flow with multiple date operations |
| `getDate(...)` | formatted string | a final display value |
| `parseDate(...)` | structured parse result | validation details, `Date`, `iso`, `timestamp`, or deferred formatting |
| `isValidDate(...)` | boolean | only a yes or no validation check |

```ts
import { createDateChain, getDate, isValidDate, parseDate } from '@samline/date'

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

const parsed = await parseDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY'
})

const valid = await isValidDate({
  date: '1970-00-00',
  input: 'YYYY-MM-DD'
})
```

`getDate`, `parseDate`, and `isValidDate` are async because they can load locale data before running the operation.

`createDateChain` is also a valid one-shot helper. It returns immediately, but you must `await chain.ready` before using it when the locale may need to load.

All of these helpers use `strict: true` by default.

If you call `getDate()` without props, it returns the current date formatted with the default formatter settings.

### createDateChain

```ts
const chain = createDateChain({
  date: '23/03/2026',
  input: 'DD/MM/YYYY',
  locale: 'es',
  strict: true,
  invalid: 'Fecha invalida'
})

await chain.ready

chain
  .add(3, 'month')
  .set('day', 1)
  .format('YYYY-MM-DD')
```

Use this helper when you want to parse a date and then manipulate or compare it in the same flow.

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

`set('day', value)` is the public way to change the day of the month. Internally it maps to Day.js `set('date', value)` so the behavior stays aligned with Day.js while the public API stays clearer.

`toState()` returns the current structured state of the chain:

- valid state: `isValid`, `locale`, `date`, `iso`, `timestamp`
- invalid state: `isValid`, `locale`, `date: null`, `iso: null`, `timestamp: null`, `error`

Example:

```ts
const chain = createDateChain({
  date: '23/03/2026',
  input: 'DD/MM/YYYY'
})

await chain.ready

const finalState = chain
  .add(3, 'month')
  .endOf('month')
  .toState()
```

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

This makes `parseDate` the right choice when you need validation details, an ISO value, a timestamp, or deferred formatting from the same parsed input.

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

The package ships helper support for these locale keys through `SUPPORTED_LOCALES` and `getSupportedLocales()`:

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

- [docs/vanilla.md](docs/vanilla.md) for the shared API in plain TypeScript or JavaScript
- [docs/browser.md](docs/browser.md) for browser-only usage without a bundler
- [docs/react.md](docs/react.md) for the React hook entrypoint
- [docs/vue.md](docs/vue.md) for the Vue composable entrypoint
- [docs/svelte.md](docs/svelte.md) for the Svelte store entrypoint

## License

MIT
