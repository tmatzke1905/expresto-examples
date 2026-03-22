import previewSnapshot from "../../../../content/preview/bootstrap.json";

export type RuntimeSnapshot = {
  appName: string;
  contextRoot: string;
  healthEndpoint: string;
  message: string;
  mode: "preview" | "server";
  previewIndex: string;
  source: string;
  status: string;
  timestamp: string;
  title: string;
  webDelivery: string;
};

export const runtimeFeatureCards = [
  {
    description:
      "The server workspace bootstraps expresto-server and exposes the first API endpoint at /api/system/health.",
    tag: "Server",
    title: "createServer() Runtime"
  },
  {
    description:
      "The React app is built into apps/web/dist and attached to the same Express runtime for direct delivery.",
    tag: "Web",
    title: "Shared Delivery"
  },
  {
    description:
      "A second build target writes preview/index.html with relative assets so the repository preview opens without setup.",
    tag: "Preview",
    title: "Static Preview Build"
  }
] as const;

function isPreviewMode(): boolean {
  return window.location.protocol === "file:";
}

export async function loadRuntimeSnapshot(): Promise<RuntimeSnapshot> {
  if (isPreviewMode()) {
    return previewSnapshot as RuntimeSnapshot;
  }

  const response = await fetch("/api/system/health");
  if (!response.ok) {
    throw new Error(`Bootstrap health request failed with status ${response.status}.`);
  }

  return (await response.json()) as RuntimeSnapshot;
}
