type ClockTickMessage = {
  kind: "clock-tick";
  source: "scheduler";
  sentAt: string;
};
