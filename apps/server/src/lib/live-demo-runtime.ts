import { LifecycleHook, hookManager, type AppConfig, type EventBus, type ServiceRegistry } from "expresto-server";

export type LiveDemoRuntimeResponse = {
  metrics: {
    endpointPath: string;
    sampleLines: string[];
    sampleMetricNames: string[];
    source: string;
    status: "available" | "unavailable";
    updatedAt: string | null;
  };
  scheduler: {
    enabled: boolean;
    intervalLabel: string;
    latestTick: string;
    recentTicks: Array<{
      isoTime: string;
      recordedAt: string;
      source: string;
      timeLabel: string;
    }>;
    source: string;
  };
  transport: {
    messages: Array<{
      kind: "clock-tick" | "event-bus-demo";
      recordedAt: string;
      source: string;
      summary: string;
    }>;
    note: string;
    source: string;
    status: string;
  };
  websocket: {
    authMode: string;
    note: string;
    path: string;
    status: string;
  };
};

type ClockTickPayload = {
  isoTime?: string;
  source?: string;
  timeLabel?: string;
  ts?: string;
};

type EventBusMessagePayload = {
  label?: string;
  source?: string;
  text?: string;
  ts?: string;
};

type TransportFeedEntry = LiveDemoRuntimeResponse["transport"]["messages"][number];
type SchedulerTickEntry = LiveDemoRuntimeResponse["scheduler"]["recentTicks"][number];

const LIVE_DEMO_SOURCE = "apps/server/src/lib/live-demo-runtime.ts";
const DEFAULT_TICK_LABEL = "Waiting for the first tick";
const MAX_RECENT_TICKS = 6;
const MAX_TRANSPORT_MESSAGES = 8;

export const EVENT_SYSTEM_DEMO_EVENT_NAME = "expresto-examples.demo.event-system.message";
export const SCHEDULER_TICK_EVENT = "expresto-examples.demo.scheduler.clock-tick";

class LiveDemoFeedService {
  private latestTick = DEFAULT_TICK_LABEL;
  private recentTicks: SchedulerTickEntry[] = [];
  private transportMessages: TransportFeedEntry[] = [];

  private prependLimited<T>(entries: T[], nextEntry: T, maxEntries: number): T[] {
    return [nextEntry, ...entries].slice(0, maxEntries);
  }

  recordEventBusMessage(payload: EventBusMessagePayload): void {
    const recordedAt = payload.ts ?? new Date().toISOString();
    const summary = `event-bus-demo · ${payload.label ?? "message"} · ${payload.text ?? ""}`.trim();

    this.transportMessages = this.prependLimited(
      this.transportMessages,
      {
        kind: "event-bus-demo",
        recordedAt,
        source: payload.source ?? LIVE_DEMO_SOURCE,
        summary
      },
      MAX_TRANSPORT_MESSAGES
    );
  }

  recordSchedulerTick(payload: ClockTickPayload): void {
    const recordedAt = payload.ts ?? new Date().toISOString();
    const timeLabel = payload.timeLabel ?? DEFAULT_TICK_LABEL;
    const isoTime = payload.isoTime ?? recordedAt;

    this.latestTick = timeLabel;
    this.recentTicks = this.prependLimited(
      this.recentTicks,
      {
        isoTime,
        recordedAt,
        source: payload.source ?? LIVE_DEMO_SOURCE,
        timeLabel
      },
      MAX_RECENT_TICKS
    );
    this.transportMessages = this.prependLimited(
      this.transportMessages,
      {
        kind: "clock-tick",
        recordedAt,
        source: payload.source ?? LIVE_DEMO_SOURCE,
        summary: `clock-tick · ${timeLabel} · scheduler`
      },
      MAX_TRANSPORT_MESSAGES
    );
  }

  reset(): void {
    this.latestTick = DEFAULT_TICK_LABEL;
    this.recentTicks = [];
    this.transportMessages = [];
  }

  snapshot() {
    return {
      latestTick: this.latestTick,
      recentTicks: this.recentTicks,
      transportMessages: this.transportMessages
    };
  }
}

const liveDemoFeedService = new LiveDemoFeedService();

let liveDemoHooksRegistered = false;
let liveDemoRuntimeConfig: AppConfig | null = null;
let liveDemoRuntimeServices: ServiceRegistry | null = null;
let liveDemoRuntimeBound = false;

function resolveMetricsHost(config: AppConfig): string {
  if (config.host && config.host !== "0.0.0.0") {
    return config.host;
  }

  return "127.0.0.1";
}

function collectMetricNames(metricLines: string[]): string[] {
  const names = new Set<string>();

  for (const line of metricLines) {
    const metricName = line.split(/[{\s]/, 1)[0];

    if (metricName) {
      names.add(metricName);
    }
  }

  return [...names];
}

async function loadMetricsPreview(config: AppConfig): Promise<LiveDemoRuntimeResponse["metrics"]> {
  const endpointPath = config.metrics?.endpoint ?? "/__metrics";
  const metricsUrl = `http://${resolveMetricsHost(config)}:${config.port}${endpointPath}`;

  try {
    const response = await fetch(metricsUrl);

    if (!response.ok) {
      throw new Error(`Metrics endpoint returned ${response.status}.`);
    }

    const text = await response.text();
    const sampleLines = text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith("#"))
      .slice(0, 8);

    return {
      endpointPath,
      sampleLines,
      sampleMetricNames: collectMetricNames(sampleLines),
      source: LIVE_DEMO_SOURCE,
      status: "available",
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The metrics endpoint could not be read.";

    return {
      endpointPath,
      sampleLines: [message],
      sampleMetricNames: [],
      source: LIVE_DEMO_SOURCE,
      status: "unavailable",
      updatedAt: new Date().toISOString()
    };
  }
}

export function registerLiveDemoHooks(): void {
  if (liveDemoHooksRegistered) {
    return;
  }

  liveDemoHooksRegistered = true;

  hookManager.on(LifecycleHook.STARTUP, async context => {
    context.services.set("liveDemoFeed", liveDemoFeedService);
  });
}

export function bindLiveDemoRuntime(
  config: AppConfig,
  services: ServiceRegistry,
  eventBus: EventBus
): void {
  liveDemoRuntimeConfig = config;
  liveDemoRuntimeServices = services;

  if (liveDemoRuntimeBound) {
    return;
  }

  eventBus.on<ClockTickPayload>(SCHEDULER_TICK_EVENT, payload => {
    liveDemoFeedService.recordSchedulerTick(payload);
  });
  eventBus.on<EventBusMessagePayload>(EVENT_SYSTEM_DEMO_EVENT_NAME, payload => {
    liveDemoFeedService.recordEventBusMessage(payload);
  });

  liveDemoRuntimeBound = true;
}

export async function getLiveDemoRuntime(): Promise<LiveDemoRuntimeResponse> {
  const snapshot = liveDemoFeedService.snapshot();
  const schedulerEnabled = Boolean(liveDemoRuntimeConfig?.scheduler?.enabled);
  const metrics = liveDemoRuntimeConfig
    ? await loadMetricsPreview(liveDemoRuntimeConfig)
    : {
        endpointPath: "/__metrics",
        sampleLines: ["The runtime configuration is not available yet."],
        sampleMetricNames: [],
        source: LIVE_DEMO_SOURCE,
        status: "unavailable" as const,
        updatedAt: new Date().toISOString()
      };

  return {
    metrics,
    scheduler: {
      enabled: schedulerEnabled,
      intervalLabel: schedulerEnabled ? "Every 10 seconds" : "Scheduler disabled",
      latestTick: snapshot.latestTick,
      recentTicks: snapshot.recentTicks,
      source: LIVE_DEMO_SOURCE
    },
    transport: {
      messages: snapshot.transportMessages,
      note:
        "This combined feed already shows the backend messages that the later live socket transport will forward to connected clients.",
      source: LIVE_DEMO_SOURCE,
      status:
        snapshot.transportMessages.length > 0
          ? "Backend feed active"
          : "Waiting for scheduler or EventBus activity"
    },
    websocket: {
      authMode: liveDemoRuntimeConfig?.auth?.jwt?.enabled ? "jwt" : "not configured",
      note:
        liveDemoRuntimeServices?.has("websocketManager")
          ? "A websocket manager is registered in the runtime."
          : "The custom createServer() bootstrap is already producing the backend feed, while the dedicated socket bridge is the next step.",
      path: liveDemoRuntimeConfig?.websocket?.path ?? "/socket.io",
      status: liveDemoRuntimeServices?.has("websocketManager")
        ? "Configured on the shared HTTP server"
        : "Socket bridge not bound yet"
    }
  };
}
