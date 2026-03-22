async function main(): Promise<void> {
  registerCoreFeatureHooks();
  registerLiveDemoHooks();

  const config = await loadConfig();
  const runtime = await createServer(config);
  const host = config.host ?? "0.0.0.0";

  bindCoreFeatureRuntime(runtime.config, runtime.services, runtime.eventBus);
  bindLiveDemoRuntime(runtime.config, runtime.services, runtime.eventBus);

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
