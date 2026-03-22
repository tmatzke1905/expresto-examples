import previewLiveDemoData from "../../../../content/preview/live-demo.json";

export type PreviewDemoData = {
  eventSystem: {
    presets: Array<{
      label: string;
      text: string;
    }>;
    selectedText: string;
  };
  scheduler: {
    intervalLabel: string;
    latestTick: string;
    recentTicks: string[];
  };
  websocket: {
    connectionState: string;
    messages: string[];
    transportLabel: string;
  };
};

export const previewDemoData = previewLiveDemoData as PreviewDemoData;
