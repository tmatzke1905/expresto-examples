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
