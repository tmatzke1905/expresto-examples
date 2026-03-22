import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createServer, type AppConfig } from "expresto-server";

import { attachStaticWebApp } from "./lib/static-web.js";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(currentDirectory, "../../..");
const configFilePath = resolve(repositoryRoot, "apps/server/config/middleware.config.json");
const controllersDistPath = resolve(repositoryRoot, "apps/server/dist/controllers");
const webDistPath = resolve(repositoryRoot, "apps/web/dist");

async function loadConfig(): Promise<AppConfig> {
  const rawConfig = await readFile(configFilePath, "utf8");
  const parsedConfig = JSON.parse(rawConfig) as AppConfig;

  return {
    ...parsedConfig,
    controllersPath: controllersDistPath
  };
}

async function main(): Promise<void> {
  const config = await loadConfig();
  const runtime = await createServer(config);
  const host = config.host ?? "0.0.0.0";

  attachStaticWebApp({
    app: runtime.app,
    excludedPrefixes: [config.contextRoot, config.metrics?.endpoint ?? "/__metrics", "/socket.io"],
    logger: runtime.logger.app,
    webDistPath
  });

  runtime.app.listen(config.port, host, () => {
    runtime.logger.app.info("expresto-examples runtime ready", {
      apiRoot: config.contextRoot,
      host,
      port: config.port,
      webDistPath
    });
  });
}

main().catch(error => {
  console.error("Failed to start expresto-examples", error);
  process.exit(1);
});
