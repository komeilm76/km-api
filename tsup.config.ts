import { defineConfig } from "tsup";

/**
 * ------------------------------
 * 🏗️  TSUP Multi-format Build
 * ------------------------------
 * This config will build:
 *   ✅ CommonJS output (.cjs)
 *   ✅ ESM output (.mjs)
 *   ✅ Regular JS output (.js)
 *   ✅ Copy assets to ./dist/assets
 *
 * Run with: `tsup`
 */

export default defineConfig([
  // --------------------------
  // 1️⃣ ESM (for Browser + Node)
  // --------------------------
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    outExtension({ format }) {
      // Write as .mjs file
      return { js: ".mjs" };
    },
    dts: true,
    sourcemap: true,
    clean: true,
    outDir: "build/esm",
    target: "esnext",
    platform: "neutral", // works in both browser + node
    minify: true,
    async onSuccess() {
      // await fs.copy("src/assets", "dist/assets");
      console.log("✅ Copied assets to dist/assets");
    },
  },

  // --------------------------
  // 2️⃣ CommonJS (for Node)
  // --------------------------
  {
    entry: ["src/index.ts"],
    format: ["cjs"],
    outExtension({ format }) {
      // Write as .cjs file
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

  // --------------------------
  // 3️⃣ Regular JS (universal .js)
  // --------------------------
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    outExtension({ format }) {
      // Keep as .js
      return { js: ".js" };
    },
    dts: true,
    sourcemap: true,
    clean: false,
    outDir: "build/js",
    target: "es2020",
    platform: "browser",
    minify: true,
  },
]);
