import type { FeatureMenuItem } from "./session";

export const APP_TITLE = "expresto-examples";

export function resolveFeatureFromHash(features: FeatureMenuItem[]): string | null {
  const hashValue = window.location.hash.replace(/^#/, "").trim();

  if (hashValue.length === 0) {
    return null;
  }

  return features.some(feature => feature.id === hashValue) ? hashValue : null;
}

export function updateFeatureHash(featureId: string): void {
  const nextHash = `#${featureId}`;

  if (window.location.hash === nextHash) {
    return;
  }

  window.history.replaceState(null, "", nextHash);
}
