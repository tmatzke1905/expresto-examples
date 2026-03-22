const clockDemoJob: SchedulerModule = {
  id: "clockDemo",
  async run(ctx) {
    const now = new Date();
    const isoTime = now.toISOString();
    const timeLabel = formatTimeLabel(now);

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
