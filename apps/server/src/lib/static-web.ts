import express, { type Express } from "express";
import { access } from "node:fs/promises";
import { resolve } from "node:path";

type Logger = {
  info?: (message: string, context?: unknown) => void;
  warn?: (message: string, context?: unknown) => void;
};

type StaticWebOptions = {
  app: Express;
  excludedPrefixes: string[];
  logger?: Logger;
  webDistPath: string;
};

function isExcludedPath(pathname: string, excludedPrefixes: string[]): boolean {
  return excludedPrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function attachStaticWebApp({
  app,
  excludedPrefixes,
  logger,
  webDistPath
}: StaticWebOptions): void {
  const indexFilePath = resolve(webDistPath, "index.html");

  app.use(express.static(webDistPath, { index: false }));

  app.use(async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    if (isExcludedPath(req.path, excludedPrefixes)) {
      next();
      return;
    }

    const acceptHeader = req.headers.accept ?? "";
    if (!acceptHeader.includes("text/html")) {
      next();
      return;
    }

    try {
      await access(indexFilePath);
      res.sendFile(indexFilePath);
    } catch {
      logger?.warn?.("Web build missing, cannot serve index.html", {
        expectedPath: indexFilePath
      });
      res.status(503).json({
        message: "The web build is missing. Run `npm run build` before starting the server.",
        expectedPath: indexFilePath
      });
    }
  });

  logger?.info?.("Static web delivery attached", {
    excludedPrefixes,
    webDistPath
  });
}
