import { readdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const previewDirectory = resolve(repositoryRoot, "preview");
const preservedFiles = new Set(["README.md"]);

const entries = await readdir(previewDirectory, { withFileTypes: true });

for (const entry of entries) {
  if (preservedFiles.has(entry.name)) {
    continue;
  }

  await rm(resolve(previewDirectory, entry.name), {
    force: true,
    recursive: true
  });
}
