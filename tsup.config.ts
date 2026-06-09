import { defineConfig } from "tsup";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURE: set `platform` in each entry to match your package target
//
//   'neutral'  → universal (works in both Node and browser)   ← default
//   'node'     → server-side only (can use Node built-ins)
//   'browser'  → client-side only (no Node built-ins)
//
// Also set the matching environment in vitest.config.ts:
//   'node'     → server / universal
//   'jsdom'    → browser / client
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig([
  // ESM (Browser + Node)
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    outExtension({ format }) {
      return { js: ".mjs" };
    },
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "build/esm",
    target: "esnext",
    platform: "neutral", // CONFIGURE: 'neutral' | 'node' | 'browser'
    minify: true,
  },

  // CommonJS (Node)
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    outExtension({ format }) {
      return { js: ".cjs" };
    },
    dts: true,
    sourcemap: true,
    clean: false,
    outDir: "build/cjs",
    target: "es2019",
    platform: "node",
    minify: true,
  },

  // Universal JS (.js)
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    outExtension({ format }) {
      return { js: ".js" };
    },
    dts: true,
    sourcemap: true,
    clean: false,
    outDir: "build/js",
    target: "es2020",
    platform: "browser", // CONFIGURE: 'neutral' | 'node' | 'browser'
    minify: true,
  },
]);
