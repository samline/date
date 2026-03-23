# Browser

Use the browser build when you need the package without a bundler.

```html
<script type="module">
  import { SamlineDate } from './dist/browser/global.js'

  await SamlineDate.setDayjs('fr')

  const value = SamlineDate.getDate({
    date: '2026-03-23',
    input: 'YYYY-MM-DD',
    output: 'DD MMMM YYYY'
  })

  console.log(value)
</script>
```

The browser global exports:

- `getDate`
- `setDayjs`
- `getSupportedLocales`
