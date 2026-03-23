# @samline/date

Small date formatting package built on top of Day.js with a shared core API, framework wrappers, and browser usage.

This package uses Day.js as its date engine. We are grateful for the existence of the package and will make good use of it in this project.

Repository: https://github.com/iamkun/dayjs

## Features

- format dates with configurable input and output patterns
- default locale is English
- load and switch supported locales on demand
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
import { getDate, setDayjs } from '@samline/date'

await setDayjs('es-mx')

const date = getDate({
  date: '23/03/2026',
  input: 'DD/MM/YYYY',
  output: 'MMMM D, YYYY'
})
```

## API

### getDate

```ts
getDate(props?: {
  date?: string
  input?: string
  output?: string
}): string
```

Returns the current date in `YYYY-MM-DD` when no props are provided.

Returns `Invalid Date` when the input cannot be parsed.

### setDayjs

```ts
setDayjs(locale: string): Promise<void>
```

Loads a supported locale if needed and sets it as the active locale.

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

Use `await setDayjs('es-mx')` before calling `getDate` when you need a locale other than English.

## Documentation

- [docs/vanilla.md](docs/vanilla.md)
- [docs/browser.md](docs/browser.md)
- [docs/react.md](docs/react.md)
- [docs/vue.md](docs/vue.md)
- [docs/svelte.md](docs/svelte.md)

## License

MIT
