await runtimeEventBus.emitAsync(
  DEMO_EVENT_NAME,
  createEventPayload(EVENT_SOURCE, {
    label: preset.label,
    presetId: preset.id,
    text: preset.text,
    tone: preset.tone
  })
);
