import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'vanilla/index': 'src/vanilla/index.ts',
      'react/index': 'src/react/index.ts',
      'vue/index': 'src/vue/index.ts',
      'svelte/index': 'src/svelte/index.ts',
      'browser/global': 'src/browser/global.ts'
    },
    format: ['esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    splitting: false,
    target: 'es2020',
    outDir: 'dist'
  },
  {
    entry: {
      'browser/date': 'src/browser/cdn.ts'
    },
    format: ['iife'],
    clean: false,
    sourcemap: true,
    splitting: false,
    target: 'es2020',
    outDir: 'dist'
  }
])
