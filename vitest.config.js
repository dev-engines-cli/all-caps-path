/**
 * @file Vitest Configuration
 */

import { fileURLToPath, URL } from 'node:url';

/* eslint-disable-next-line import/extensions,import/no-unresolved */
import { defineConfig } from 'vitest/config';

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@@': fileURLToPath(new URL('./tests', import.meta.url))
    }
  },
  test: {
    coverage: {
      exclude: [
        './src/types.js'
      ],
      include: [
        './src/**/*'
      ],
      reportsDirectory: './tests/unit/coverage',
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    },
    globals: true,
    root: '.',
    setupFiles: [
      './tests/unit/setup.js'
    ]
  }
});

/* eslint-disable-next-line import/no-unused-modules */
export default config;
