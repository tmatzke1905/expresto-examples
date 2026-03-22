for (const hook of HOOK_ORDER) {
  hookManager.on(hook, async context => {
    if (hook === LifecycleHook.STARTUP) {
      context.services.set("featureCatalog", featureCatalogService);
      context.services.set("demoMessageBoard", messageBoardService);
    }

    recordHook(hook, createHookDescription(hook, context));
  });
}
