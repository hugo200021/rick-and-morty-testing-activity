import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@': path.resolve(import.meta.dirname, './src'), // 👈 Se cambió __dirname por import.meta.dirname
    },
    coverage: {
      provider: 'v8',
      reporter: ['json-summary', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'next.config.ts',
        'postcss.config.mjs',
        'eslint.config.mjs',
        'vitest.config.ts',
        'vitest.setup.ts',
        'src/types/**',
        '.next/**',
      ],
    },
  },
});