import {
  LifecycleHook,
  createEventPayload,
  hookManager,
  type AppConfig,
  type EventBus,
  type HookContext,
  type ServiceRegistry
} from "expresto-server";

type DemoSecurityMode = "basic" | "jwt" | "public";
type EventPresetTone = "default" | "info" | "warning";

type EventPresetContext = {
  label: string;
  presetId: string;
  text: string;
  tone: EventPresetTone;
};

type DemoEventPayload = ReturnType<typeof createEventPayload<EventPresetContext>>;

type HookTraceEntry = {
  detail: string;
  hook: string;
  recordedAt: string;
  source: string;
};

type ServiceEntry = {
  capabilities: string[];
  kind: string;
  name: string;
  registered: boolean;
  source: string;
  summary: string;
};

type RouteEntry = {
  controller: string;
  method: "GET" | "POST";
  path: string;
  security: DemoSecurityMode;
  source: string;
  summary: string;
};

type EventPreset = {
  id: string;
  label: string;
  text: string;
  tone: EventPresetTone;
};

type EventRecord = {
  eventName: string;
  label: string;
  presetId: string;
  recordedAt: string;
  source: string;
  text: string;
};

export type CoreFeatureRuntimeResponse = {
  config: {
    authModes: string[];
    configPath: string;
    controllersPath: string;
    metricsEndpoint: string;
    schedulerMode: string;
    telemetryEnabled: boolean;
  };
  controllers: RouteEntry[];
  eventSystem: {
    eventName: string;
    lastPresetId: string;
    listenerSummary: string;
    presets: EventPreset[];
    recentEvents: EventRecord[];
    selectedText: string;
  };
  lifecycleHooks: {
    entries: HookTraceEntry[];
    registeredHooks: string[];
  };
  services: {
    entries: ServiceEntry[];
    registeredNames: string[];
  };
};

const CONFIG_PATH = "apps/server/config/middleware.config.json";
const HOOK_SOURCE = "apps/server/src/main.ts";
const EVENT_SOURCE = "apps/server/src/controllers/demo.controller.ts";
const DEMO_EVENT_NAME = "expresto-examples.demo.event-system.message";
const HOOK_ORDER = [
  LifecycleHook.INITIALIZE,
  LifecycleHook.STARTUP,
  LifecycleHook.PRE_INIT,
  LifecycleHook.POST_INIT,
  LifecycleHook.SECURITY
] as const;
const MAX_HOOK_ENTRIES = 8;
const MAX_EVENT_ENTRIES = 6;

const routeCatalog: RouteEntry[] = [
  {
    method: "GET",
    path: "/api/system/health",
    security: "public",
    controller: "system.controller.ts",
    source: "apps/server/src/controllers/system.controller.ts",
    summary: "Bootstrap snapshot for the shared runtime and static app delivery."
  },
  {
    method: "POST",
    path: "/api/auth/login",
    security: "basic",
    controller: "auth.controller.ts",
    source: "apps/server/src/controllers/auth.controller.ts",
    summary: "Basic-authenticated login that issues the JWT used by the workspace."
  },
  {
    method: "GET",
    path: "/api/auth/session",
    security: "jwt",
    controller: "auth.controller.ts",
    source: "apps/server/src/controllers/auth.controller.ts",
    summary: "Protected session restore endpoint for the stored bearer token."
  },
  {
    method: "GET",
    path: "/api/demo/core-features",
    security: "public",
    controller: "demo.controller.ts",
    source: "apps/server/src/controllers/demo.controller.ts",
    summary: "Runtime-backed AP6 data for routes, hooks, services, and EventBus state."
  },
  {
    method: "POST",
    path: "/api/demo/events/:presetId",
    security: "jwt",
    controller: "demo.controller.ts",
    source: "apps/server/src/controllers/demo.controller.ts",
    summary: "Protected EventBus demo trigger that updates the visible message board."
  }
];

const eventPresets: EventPreset[] = [
  {
    id: "greeting",
    label: "Greeting",
    text: "Hello from the live EventBus demo. This text reached the workspace through the backend listener.",
    tone: "default"
  },
  {
    id: "warning",
    label: "Warning",
    text: "Warning preset emitted through the runtime EventBus. The text field reflects the latest protected event.",
    tone: "warning"
  },
  {
    id: "info",
    label: "Info",
    text: "Informational EventBus preset delivered from the server-side demo controller into the AP6 workspace page.",
    tone: "info"
  }
];

class FeatureCatalogService {
  constructor(private readonly routes: RouteEntry[]) {}

  listRoutes(): RouteEntry[] {
    return this.routes;
  }

  listRoutePaths(): string[] {
    return this.routes.map(route => route.path);
  }

  shutdown(): void {
    // The demo service is in-memory only, but it still exposes a shutdown method
    // so the service-registry page can point to graceful cleanup expectations.
  }
}

class DemoMessageBoardService {
  private selectedText = eventPresets[0]?.text ?? "";

  applyEvent(payload: DemoEventPayload): void {
    this.selectedText = payload.text;
  }

  getSelectedText(): string {
    return this.selectedText;
  }

  reset(text: string): void {
    this.selectedText = text;
  }

  shutdown(): void {
    this.selectedText = eventPresets[0]?.text ?? "";
  }
}

const featureCatalogService = new FeatureCatalogService(routeCatalog);
const messageBoardService = new DemoMessageBoardService();

let hooksRegistered = false;
let eventBusBound = false;
let runtimeConfig: AppConfig | null = null;
let runtimeServices: ServiceRegistry | null = null;
let runtimeEventBus: EventBus | null = null;
let hookEntries: HookTraceEntry[] = [];
let recentEvents: EventRecord[] = [];
let lastPresetId = eventPresets[0]?.id ?? "";

function prependLimited<T>(entries: T[], nextEntry: T, maxEntries: number): T[] {
  return [nextEntry, ...entries].slice(0, maxEntries);
}

function recordHook(hook: LifecycleHook, detail: string, source = HOOK_SOURCE): void {
  hookEntries = prependLimited(
    hookEntries,
    {
      hook,
      detail,
      source,
      recordedAt: new Date().toISOString()
    },
    MAX_HOOK_ENTRIES
  );
}

function recordEvent(payload: DemoEventPayload): void {
  recentEvents = prependLimited(
    recentEvents,
    {
      eventName: DEMO_EVENT_NAME,
      label: payload.label,
      presetId: payload.presetId,
      recordedAt: payload.ts,
      source: payload.source ?? EVENT_SOURCE,
      text: payload.text
    },
    MAX_EVENT_ENTRIES
  );
}

function createHookDescription(hook: LifecycleHook, context: HookContext): string {
  if (hook === LifecycleHook.INITIALIZE) {
    return `Loaded JSON configuration for ${context.config.contextRoot} and prepared the shared runtime.`;
  }

  if (hook === LifecycleHook.STARTUP) {
    return "Registered the AP6 demo services in the ServiceRegistry for route and message-board inspection.";
  }

  if (hook === LifecycleHook.PRE_INIT) {
    return `Prepared middleware before loading controllers from ${context.config.controllersPath}.`;
  }

  if (hook === LifecycleHook.POST_INIT) {
    return `Controllers are available and the API is reachable below ${context.config.contextRoot}.`;
  }

  if (hook === LifecycleHook.SECURITY) {
    const method = context.request?.method?.toUpperCase() ?? "UNKNOWN";
    const path = context.request?.originalUrl ?? context.request?.url ?? "unknown route";
    return `Validated the secured request ${method} ${path}.`;
  }

  return "Recorded lifecycle hook execution.";
}

function getAuthModes(): string[] {
  const authModes: string[] = [];

  if (runtimeConfig?.auth?.basic?.enabled) {
    authModes.push("basic");
  }

  if (runtimeConfig?.auth?.jwt?.enabled) {
    authModes.push("jwt");
  }

  return authModes;
}

function getSchedulerMode(): string {
  if (!runtimeConfig?.scheduler?.enabled) {
    return "disabled";
  }

  return runtimeConfig.scheduler.mode ?? "attached";
}

function buildServiceEntries(): ServiceEntry[] {
  const knownServices: Array<Omit<ServiceEntry, "registered">> = [
    {
      name: "featureCatalog",
      kind: "FeatureCatalogService",
      source: "apps/server/src/lib/core-feature-demo.ts",
      summary: "Keeps the documented AP6 route catalog aligned with the controller layer.",
      capabilities: [
        "List documented controller routes",
        "Expose route paths for the UI and documentation snippets",
        "Participate in graceful shutdown"
      ]
    },
    {
      name: "demoMessageBoard",
      kind: "DemoMessageBoardService",
      source: "apps/server/src/lib/core-feature-demo.ts",
      summary: "Stores the currently selected EventBus text that is rendered in the workspace textarea.",
      capabilities: [
        "Persist the latest selected message in memory",
        "Update state from protected EventBus presets",
        "Reset state during shutdown"
      ]
    }
  ];

  return knownServices.map(entry => ({
    ...entry,
    registered: runtimeServices?.has(entry.name) ?? false
  }));
}

export function registerCoreFeatureHooks(): void {
  if (hooksRegistered) {
    return;
  }

  hooksRegistered = true;

  for (const hook of HOOK_ORDER) {
    hookManager.on(hook, async context => {
      if (hook === LifecycleHook.STARTUP) {
        context.services.set("featureCatalog", featureCatalogService);
        context.services.set("demoMessageBoard", messageBoardService);
      }

      recordHook(hook, createHookDescription(hook, context));
    });
  }
}

export function bindCoreFeatureRuntime(
  config: AppConfig,
  services: ServiceRegistry,
  eventBus: EventBus
): void {
  runtimeConfig = config;
  runtimeServices = services;
  runtimeEventBus = eventBus;

  if (!eventBusBound) {
    eventBus.on<DemoEventPayload>(DEMO_EVENT_NAME, payload => {
      messageBoardService.applyEvent(payload);
      recordEvent(payload);
    });

    eventBusBound = true;
  }

  messageBoardService.reset(eventPresets[0]?.text ?? "");
}

export function getCoreFeatureRuntime(): CoreFeatureRuntimeResponse {
  return {
    config: {
      authModes: getAuthModes(),
      configPath: CONFIG_PATH,
      controllersPath: runtimeConfig?.controllersPath ?? "apps/server/dist/controllers",
      metricsEndpoint: runtimeConfig?.metrics?.endpoint ?? "/__metrics",
      schedulerMode: getSchedulerMode(),
      telemetryEnabled: Boolean(runtimeConfig?.telemetry?.enabled)
    },
    controllers: routeCatalog,
    lifecycleHooks: {
      entries: hookEntries,
      registeredHooks: [...HOOK_ORDER]
    },
    services: {
      entries: buildServiceEntries(),
      registeredNames: runtimeServices?.list() ?? buildServiceEntries().map(entry => entry.name)
    },
    eventSystem: {
      eventName: DEMO_EVENT_NAME,
      lastPresetId,
      listenerSummary: runtimeEventBus
        ? `1 runtime listener bound to ${DEMO_EVENT_NAME}`
        : "Runtime listener not bound yet",
      presets: eventPresets,
      recentEvents,
      selectedText: messageBoardService.getSelectedText()
    }
  };
}

export async function emitEventPreset(presetId: string): Promise<CoreFeatureRuntimeResponse["eventSystem"]> {
  const preset = eventPresets.find(entry => entry.id === presetId);

  if (!preset) {
    throw new Error(`Unknown event preset "${presetId}".`);
  }

  if (!runtimeEventBus) {
    throw new Error("EventBus runtime is not available yet.");
  }

  lastPresetId = preset.id;

  await runtimeEventBus.emitAsync(
    DEMO_EVENT_NAME,
    createEventPayload<EventPresetContext>(EVENT_SOURCE, {
      label: preset.label,
      presetId: preset.id,
      text: preset.text,
      tone: preset.tone
    })
  );

  return getCoreFeatureRuntime().eventSystem;
}
