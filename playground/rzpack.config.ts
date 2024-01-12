import { defineConfig, JSX_TOOLS } from 'rzpack'

export default defineConfig({
  assets: {
    jsxTools: JSX_TOOLS.ESBUILD,
  },
  html: {
    title: 'playground',
  },
  antdTheme: {
    file: './src/theme/index.ts',
  },
  lessVars: {
    file: './src/theme/globalVars.ts',
  },
})
