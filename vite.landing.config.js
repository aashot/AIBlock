import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "landing-page",
  server: {
    open: true,
  },
  build: {
    outDir: resolve(import.meta.dirname, "dist/landing-page"),
    emptyOutDir: true,
  },
});
