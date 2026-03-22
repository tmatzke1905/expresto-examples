import { access } from "node:fs/promises";

const requiredPaths = [
  ".editorconfig",
  ".nvmrc",
  "package.json",
  "tsconfig.base.json",
  "docs/ap1-foundation.md",
  "docs/ap2-bootstrap.md",
  "apps/server/package.json",
  "apps/server/tsconfig.json",
  "apps/server/config/middleware.config.json",
  "apps/server/src",
  "apps/web/package.json",
  "apps/web/tsconfig.json",
  "apps/web/vite.config.ts",
  "apps/web/src",
  "content/features",
  "content/snippets",
  "content/preview",
  "content/preview/bootstrap.json",
  "preview/README.md",
  "scripts/prepare-preview-dir.mjs"
];

const missing = [];

for (const path of requiredPaths) {
  try {
    await access(path);
  } catch {
    missing.push(path);
  }
}

if (missing.length > 0) {
  console.error("AP1 foundation check failed. Missing paths:");
  for (const path of missing) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log("Repository structure looks good.");
