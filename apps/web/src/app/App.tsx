import { useEffect, useState } from "react";

import {
  loadRuntimeSnapshot,
  type RuntimeSnapshot,
  runtimeFeatureCards
} from "../lib/runtime-snapshot";

type LoadState = "loading" | "ready" | "error";

export function App() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [runtimeSnapshot, setRuntimeSnapshot] = useState<RuntimeSnapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const snapshot = await loadRuntimeSnapshot();
        if (cancelled) {
          return;
        }
        setRuntimeSnapshot(snapshot);
        setLoadState("ready");
      } catch (error) {
        if (cancelled) {
          return;
        }
        const message = error instanceof Error ? error.message : "Unknown runtime error";
        setErrorMessage(message);
        setLoadState("error");
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const modeLabel =
    runtimeSnapshot?.mode === "preview" ? "Repository Preview" : "Live expresto-server Runtime";

  return (
    <main className="shell">
      <section className="hero">
        <div className="hero__eyebrow">{modeLabel}</div>
        <h1>{runtimeSnapshot?.title ?? "Bootstrapping expresto-examples"}</h1>
        <p className="hero__copy">
          {runtimeSnapshot?.message ??
            "Loading the first combined server and React delivery setup."}
        </p>
      </section>

      <section className="status-strip">
        <article className={`status-card status-card--${loadState}`}>
          <span className="status-card__label">State</span>
          <strong>{loadState === "ready" ? runtimeSnapshot?.status : loadState}</strong>
          <span className="status-card__detail">
            {loadState === "ready"
              ? `Updated at ${runtimeSnapshot?.timestamp ?? "-"}`
              : "The application is resolving its runtime source."}
          </span>
        </article>

        <article className="status-card">
          <span className="status-card__label">API Root</span>
          <strong>{runtimeSnapshot?.contextRoot ?? "/api"}</strong>
          <span className="status-card__detail">
            First bootstrap endpoint: {runtimeSnapshot?.healthEndpoint ?? "/api/system/health"}
          </span>
        </article>

        <article className="status-card">
          <span className="status-card__label">Static Delivery</span>
          <strong>{runtimeSnapshot?.webDelivery ?? "apps/web/dist"}</strong>
          <span className="status-card__detail">
            Preview entry: {runtimeSnapshot?.previewIndex ?? "preview/index.html"}
          </span>
        </article>
      </section>

      {loadState === "error" ? (
        <section className="panel panel--error">
          <h2>Runtime unavailable</h2>
          <p>
            The React application was built correctly, but it could not load the expected bootstrap
            runtime payload.
          </p>
          <pre>{errorMessage}</pre>
        </section>
      ) : null}

      <section className="panel">
        <div className="panel__header">
          <h2>AP2 Deliverables</h2>
          <p>
            This build proves the foundation for a combined API plus React delivery flow with a
            versioned repository preview.
          </p>
        </div>

        <div className="card-grid">
          {runtimeFeatureCards.map(card => (
            <article className="feature-card" key={card.title}>
              <span className="feature-card__tag">{card.tag}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel panel--compact">
        <div className="panel__header">
          <h2>Source</h2>
          <p>Current runtime metadata source for this page.</p>
        </div>

        <div className="source-chip">
          <span>{runtimeSnapshot?.source ?? "Loading source information..."}</span>
        </div>
      </section>
    </main>
  );
}

export default App;
