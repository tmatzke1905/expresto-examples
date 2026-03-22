import previewLiveDemoRuntime from "../../../../content/preview/live-runtime.json";

export type LiveDemoRuntime = {
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

function isPreviewMode(): boolean {
  return window.location.protocol === "file:";
}

async function parseApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };

    if (typeof data.message === "string" && data.message.length > 0) {
      return data.message;
    }
  } catch {
    return response.statusText || `HTTP ${response.status}`;
  }

  return response.statusText || `HTTP ${response.status}`;
}

export async function loadLiveDemoRuntime(): Promise<LiveDemoRuntime> {
  if (isPreviewMode()) {
    return structuredClone(previewLiveDemoRuntime) as LiveDemoRuntime;
  }

  const response = await fetch("/api/demo/live-demo");

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as LiveDemoRuntime;
}
