import { defineConfig } from '@nubuild/cli'

export default defineConfig({
  entrypoints: ['./src/index.ts'],
  clean: true,
  dts: true,
  format: 'esm',
  sourcemap: 'external',
  minify: true,
  swc: {
    jsc: { target: 'es2015' },
  },
})
