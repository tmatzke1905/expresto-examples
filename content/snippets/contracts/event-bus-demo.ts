type DemoEventMessage = {
  kind: "event-bus-demo";
  preset: "Greeting" | "Warning" | "Info";
  text: string;
};
