import { browserLocalesReady } from './preload-locales.js'
import { DateKit } from './global.js'

if (!browserLocalesReady) {
	throw new Error('Browser locales failed to preload')
}

if (typeof globalThis !== 'undefined') {
	;(globalThis as typeof globalThis & { DateKit?: typeof DateKit }).DateKit = DateKit
}