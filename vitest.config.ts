import { defineConfig } from 'vitest/config';

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURE: choose the environment that matches your package type
//
//   'node'       → server-side / universal packages  (default)
//   'jsdom'      → browser / client-side packages that need the DOM
//   'happy-dom'  → lighter alternative to jsdom, also browser-compatible
//
// You can also override per-file with a docblock comment:
//   // @vitest-environment jsdom
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts'],
      thresholds: {
        branches: 80,
        functions: 85,
        lines: 85,
        statements: 85,
      },
    },
  },
});
