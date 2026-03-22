type LiveDemoMessage =
  | { kind: "clock-tick"; sentAt: string; source: "scheduler" }
  | { kind: "event-bus-demo"; preset: "Greeting" | "Warning" | "Info"; text: string };
