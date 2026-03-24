# Browser

Use the browser build when you need the package without a bundler.

```html
<script type="module">
  import { DateKit } from './dist/browser/global.js'

  const quickValue = await DateKit.getDate({
    date: '23/03/2026',
    input: 'DD/MM/YYYY',
    output: 'YYYY-MM-DD'
  })

  const formatter = DateKit.createDateFormatter({ locale: 'fr-ca' })

  await formatter.ready

  console.log(formatter.getCurrentLocale())
  // fr

  console.log(DateKit.resolveLocale('en-us'))
  // en

  console.log(DateKit.isSupportedLocale('es-ar'))
  // true

  const value = formatter.getDate({
    date: '2026-03-23',
    input: 'YYYY-MM-DD',
    output: 'DD MMMM YYYY'
  })

  const parsed = formatter.parseDate({
    date: '23/03/2026',
    input: 'DD/MM/YYYY',
    strict: true
  })

  console.log(value)
  console.log(quickValue)
  console.log(parsed.isValid)
</script>
```

The browser global exports:

- `createDateFormatter`
- `getDate`
- `parseDate`
- `isValidDate`
- `getSupportedLocales`
- `resolveLocale`
- `isSupportedLocale`

The browser global is `window.DateKit`.

Use `DateKit.getDate`, `DateKit.parseDate`, or `DateKit.isValidDate` for one-shot calls.

Use `createDateFormatter` to create scoped instances. The browser bundle no longer exposes legacy global formatting helpers.

Regional locale input resolves to the exact supported locale when available and otherwise falls back to the base locale.
