# Browser

Use the browser build when your project loads scripts directly in the page and cannot compile npm modules.

This is useful in Shopify themes, WordPress templates, and browser-only environments with no bundler.

```html
<script src="https://cdn.jsdelivr.net/npm/@samline/date@2.2.1/dist/browser/date.global.js"></script>
<script>
  ;(async () => {
    const chain = window.DateKit.createDateChain({
      date: '23/03/2026',
      input: 'DD/MM/YYYY'
    })

    await chain.ready

    const quickValue = await window.DateKit.getDate({
      date: '23/03/2026',
      input: 'DD/MM/YYYY',
      output: 'YYYY-MM-DD'
    })

    const formatter = window.DateKit.createDateFormatter({ locale: 'fr-ca' })

    await formatter.ready

    console.log(formatter.getCurrentLocale())
    // fr

    console.log(window.DateKit.resolveLocale('en-us'))
    // en

    console.log(window.DateKit.isSupportedLocale('es-ar'))
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
    console.log(chain.add(3, 'month').set('day', 1).format('YYYY-MM-DD'))
    console.log(parsed.isValid)
  })()
</script>
```

After the CDN script loads, the browser build exposes `window.DateKit`.

Use the browser bundle when your project cannot run a build step. If your project can install and compile npm packages, prefer the package manager installation documented in the main [README.md](../README.md).

The browser global exports:

- `createDateChain`
- `createDateFormatter`
- `getDate`
- `parseDate`
- `isValidDate`
- `getSupportedLocales`
- `resolveLocale`
- `isSupportedLocale`

The browser global is `window.DateKit`.

Use `DateKit.getDate`, `DateKit.parseDate`, or `DateKit.isValidDate` for async one-shot calls.

Use `DateKit.createDateChain(...)` for one-shot manipulation or comparison flows. It returns immediately, and you should `await chain.ready` before calling chain methods when the locale may need to load.

Use `createDateFormatter` to create scoped instances. The browser bundle no longer exposes legacy global formatting helpers.

Regional locale input resolves to the exact supported locale when available and otherwise falls back to the base locale.
