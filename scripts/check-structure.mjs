import { access } from "node:fs/promises";

const requiredPaths = [
  ".editorconfig",
  ".nvmrc",
  "package.json",
  "tsconfig.base.json",
  "docs/ap1-foundation.md",
  "apps/server/package.json",
  "apps/server/src",
  "apps/web/package.json",
  "apps/web/src",
  "content/features",
  "content/snippets",
  "content/preview",
  "preview/README.md"
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

console.log("AP1 foundation structure looks good.");
