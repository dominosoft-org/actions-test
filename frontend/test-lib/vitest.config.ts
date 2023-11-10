import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  base: './tests',
  test: {
    globals: true,
    setupFiles: 'tests/ut/setup.ts',
    include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      all: false,
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, './tests') },
      { find: 'src', replacement: resolve(__dirname, './src') },
    ],
  },
});
