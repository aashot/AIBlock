import { build } from "vite";
import { resolve } from "path";
import { cp, rm } from "fs/promises";

const root = resolve(import.meta.dirname, "..");
const extSrc = resolve(root, "extension/src");

// Clean dist/
await rm(resolve(root, "dist"), { recursive: true, force: true });

// ── Extension ────────────────────────────────────────────

// 1. Content script — IIFE bundle (Chrome can't load ES modules in content scripts)
await build({
  configFile: false,
  root,
  build: {
    outDir: "dist/extension",
    emptyOutDir: false,
    lib: {
      entry: resolve(extSrc, "content/index.js"),
      name: "FeedFilter",
      fileName: () => "content.js",
      formats: ["iife"],
    },
    rollupOptions: {
      output: { extend: true },
    },
    minify: false,
  },
  publicDir: resolve(root, "extension/public"),
});

// 2. Background service worker — IIFE bundle
await build({
  configFile: false,
  root,
  build: {
    outDir: "dist/extension",
    emptyOutDir: false,
    lib: {
      entry: resolve(extSrc, "background/index.js"),
      name: "Background",
      fileName: () => "background.js",
      formats: ["iife"],
    },
    rollupOptions: {
      output: { extend: true },
    },
    minify: false,
  },
  publicDir: false,
});

// 3. Popup — HTML entry (extension pages support ES modules)
await build({
  configFile: false,
  root,
  build: {
    outDir: "dist/extension",
    emptyOutDir: false,
    modulePreload: { polyfill: false },
    rollupOptions: {
      input: { popup: resolve(extSrc, "popup/popup.html") },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    minify: false,
  },
  publicDir: false,
});

// Move popup.html from nested build path to extension root
const nestedHtml = resolve(root, "dist/extension/extension/src/popup/popup.html");
await cp(nestedHtml, resolve(root, "dist/extension/popup.html"));
await rm(resolve(root, "dist/extension/extension"), { recursive: true, force: true });

// ── Landing Page ─────────────────────────────────────────

// Static HTML site — Vite processes CSS and copies assets
await build({
  configFile: false,
  root: resolve(root, "landing-page"),
  build: {
    outDir: resolve(root, "dist/landing-page"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(root, "landing-page/index.html"),
        privacy: resolve(root, "landing-page/privacy.html"),
      },
      output: {
        assetFileNames: "assets/[name].[ext]",
      },
    },
    minify: false,
  },
  publicDir: false,
});

// Copy logo.svg (referenced via src= in HTML, not as a module import)
await cp(
  resolve(root, "landing-page/logo.svg"),
  resolve(root, "dist/landing-page/logo.svg"),
);

console.log("\n✓ Build complete");
console.log("  Extension → dist/extension/ (load as unpacked in Chrome)");
console.log("  Landing   → dist/landing-page/");
