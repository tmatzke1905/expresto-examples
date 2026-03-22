import previewCoreFeatureRuntime from "../../../../content/preview/core-features.json";

type EventPresetTone = "default" | "info" | "warning";
type CoreFeatureLoadResponse = CoreFeatureRuntime;

export type CoreFeatureRoute = {
  controller: string;
  method: "GET" | "POST";
  path: string;
  security: "basic" | "jwt" | "public";
  source: string;
  summary: string;
};

export type CoreFeatureHookEntry = {
  detail: string;
  hook: string;
  recordedAt: string;
  source: string;
};

export type CoreFeatureServiceEntry = {
  capabilities: string[];
  kind: string;
  name: string;
  registered: boolean;
  source: string;
  summary: string;
};

export type CoreFeatureEventPreset = {
  id: string;
  label: string;
  text: string;
  tone: EventPresetTone;
};

export type CoreFeatureEventRecord = {
  eventName: string;
  label: string;
  presetId: string;
  recordedAt: string;
  source: string;
  text: string;
};

export type CoreFeatureRuntime = {
  config: {
    authModes: string[];
    configPath: string;
    controllersPath: string;
    metricsEndpoint: string;
    schedulerMode: string;
    telemetryEnabled: boolean;
  };
  controllers: CoreFeatureRoute[];
  eventSystem: {
    eventName: string;
    lastPresetId: string;
    listenerSummary: string;
    presets: CoreFeatureEventPreset[];
    recentEvents: CoreFeatureEventRecord[];
    selectedText: string;
  };
  lifecycleHooks: {
    entries: CoreFeatureHookEntry[];
    registeredHooks: string[];
  };
  services: {
    entries: CoreFeatureServiceEntry[];
    registeredNames: string[];
  };
};

let previewState = structuredClone(previewCoreFeatureRuntime) as CoreFeatureRuntime;

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

export async function loadCoreFeatureRuntime(): Promise<CoreFeatureRuntime> {
  if (isPreviewMode()) {
    return structuredClone(previewState);
  }

  const response = await fetch("/api/demo/core-features");

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as CoreFeatureLoadResponse;
}

export async function emitCoreFeaturePreset(
  token: string,
  presetId: string
): Promise<CoreFeatureRuntime["eventSystem"]> {
  if (isPreviewMode()) {
    const preset = previewState.eventSystem.presets.find(entry => entry.id === presetId);

    if (!preset) {
      throw new Error(`Unknown preview preset "${presetId}".`);
    }

    previewState = {
      ...previewState,
      eventSystem: {
        ...previewState.eventSystem,
        lastPresetId: preset.id,
        selectedText: preset.text,
        recentEvents: [
          {
            eventName: previewState.eventSystem.eventName,
            label: preset.label,
            presetId: preset.id,
            recordedAt: new Date().toISOString(),
            source: "content/preview/core-features.json",
            text: preset.text
          },
          ...previewState.eventSystem.recentEvents
        ].slice(0, 6)
      }
    };

    return structuredClone(previewState.eventSystem);
  }

  const response = await fetch(`/api/demo/events/${encodeURIComponent(presetId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as CoreFeatureRuntime["eventSystem"];
}
