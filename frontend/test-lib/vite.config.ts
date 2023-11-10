import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      // eslint-disable-next-line no-undef
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Test-lib',
      fileName: (format) => `test-lib.${format}.js`,
      formats: ['es', 'umd'],
    },
  },
  resolve: {
    alias: [{ find: 'src', replacement: resolve(__dirname, 'src/') }],
  },
});
