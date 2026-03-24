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

  const formatter = DateKit.createDateFormatter({ locale: 'fr' })

  await formatter.ready

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

The browser global is `window.DateKit`.

Use `DateKit.getDate`, `DateKit.parseDate`, or `DateKit.isValidDate` for one-shot calls.

Use `createDateFormatter` to create scoped instances. The browser bundle no longer exposes legacy global formatting helpers.
