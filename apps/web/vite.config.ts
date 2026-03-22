import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig(({ mode }) => ({
  base: mode === "preview" ? "./" : "/",
  build: {
    emptyOutDir: mode !== "preview",
    outDir:
      mode === "preview"
        ? resolve(repositoryRoot, "preview")
        : resolve(repositoryRoot, "apps/web/dist"),
    sourcemap: true
  },
  plugins: [react()],
  server: {
    fs: {
      allow: [repositoryRoot]
    }
  }
}));
