export async function loadLiveDemoRuntime(): Promise<LiveDemoRuntime> {
  if (isPreviewMode()) {
    return structuredClone(previewLiveDemoRuntime);
  }

  const response = await fetch("/api/demo/live-demo");

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  return (await response.json()) as LiveDemoRuntime;
}
