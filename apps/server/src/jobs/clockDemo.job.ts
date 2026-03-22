import { createEventPayload, type SchedulerModule } from "expresto-server";

import { SCHEDULER_TICK_EVENT } from "../lib/live-demo-runtime.js";

const CLOCK_JOB_SOURCE = "apps/server/src/jobs/clockDemo.job.ts";

function formatTimeLabel(value: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(value);
}

const clockDemoJob: SchedulerModule = {
  id: "clockDemo",
  async run(ctx) {
    const now = new Date();
    const isoTime = now.toISOString();
    const timeLabel = formatTimeLabel(now);

    ctx.logger.app.info("clockDemo scheduler tick emitted", {
      isoTime,
      timeLabel
    });

    await ctx.eventBus?.emitAsync(
      SCHEDULER_TICK_EVENT,
      createEventPayload(CLOCK_JOB_SOURCE, {
        isoTime,
        jobName: "clockDemo",
        source: "scheduler",
        timeLabel
      })
    );
  }
};

export default clockDemoJob;
