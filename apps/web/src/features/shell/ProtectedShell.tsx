import { useEffect, useState } from "react";

import {
  FeaturePageTemplate,
  PageStatePanel
} from "../pages/FeaturePageTemplate";
import { getFeaturePageDescriptor } from "../pages/feature-page-content";
import {
  emitCoreFeaturePreset,
  loadCoreFeatureRuntime,
  type CoreFeatureRuntime
} from "../../lib/core-feature-runtime";
import { loadLiveDemoRuntime, type LiveDemoRuntime } from "../../lib/live-demo-runtime";
import { runtimeFeatureCards, type RuntimeSnapshot } from "../../lib/runtime-snapshot";
import type { FeatureMenuItem, SessionState } from "../../lib/session";

type ProtectedShellProps = {
  applicationTitle: string;
  modeLabel: string;
  onLogout: () => void;
  onSelectFeature: (featureId: string) => void;
  runtimeSnapshot: RuntimeSnapshot | null;
  selectedFeature: FeatureMenuItem | null;
  session: SessionState;
};

type CoreFeatureLoadState = "error" | "loading" | "ready";
type LiveDemoLoadState = "error" | "loading" | "ready";

function formatStatusLabel(value: string): string {
  if (value === "implemented") {
    return "Implemented";
  }

  if (value === "planned") {
    return "Planned";
  }

  return value;
}

function getFeatureShortCode(title: string): string {
  const words = title.split(/[^a-z0-9]+/i).filter(Boolean);

  if (words.length >= 2) {
    return `${words[0]?.slice(0, 1) ?? ""}${words[1]?.slice(0, 1) ?? ""}`.toUpperCase();
  }

  return title.replace(/\s+/g, "").slice(0, 2).toUpperCase();
}

function getUserInitials(displayName: string): string {
  return displayName
    .split(" ")
    .map(part => part.slice(0, 1).toUpperCase())
    .join("")
    .slice(0, 2);
}

function renderCoreFeatureStatePanel(
  loadState: CoreFeatureLoadState,
  errorMessage: string,
  featureTitle: string
) {
  if (loadState === "loading") {
    return (
      <PageStatePanel
        body={`The ${featureTitle} runtime data is loading from the current environment.`}
        title="Runtime data pending"
        tone="loading"
      />
    );
  }

  if (loadState === "error") {
    return (
      <PageStatePanel
        body={errorMessage || `The ${featureTitle} runtime data could not be loaded.`}
        title="Runtime data unavailable"
        tone="error"
      />
    );
  }

  return null;
}

function renderFeatureDemo(
  feature: FeatureMenuItem,
  runtimeSnapshot: RuntimeSnapshot | null,
  session: SessionState,
  coreFeatureRuntime: CoreFeatureRuntime | null,
  coreFeatureLoadState: CoreFeatureLoadState,
  coreFeatureErrorMessage: string,
  liveDemoRuntime: LiveDemoRuntime | null,
  liveDemoLoadState: LiveDemoLoadState,
  liveDemoErrorMessage: string,
  pendingPresetId: string | null,
  eventErrorMessage: string,
  onTriggerEventPreset: (presetId: string) => void
) {
  if (feature.id === "overview") {
    return (
      <div className="card-grid card-grid--feature-status">
        {session.features.map(entry => (
          <article className="feature-card" key={entry.id}>
            <span className="feature-card__tag">{entry.package}</span>
            <h3>{entry.title}</h3>
            <p>{entry.summary}</p>
            <span className="source-chip">Status: {formatStatusLabel(entry.status)}</span>
          </article>
        ))}
      </div>
    );
  }

  if (feature.id === "bootstrap") {
    return (
      <div className="demo-stack">
        <div className="card-grid">
          {runtimeFeatureCards.map(card => (
            <article className="feature-card" key={card.title}>
              <span className="feature-card__tag">{card.tag}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>

        <div className="detail-grid">
          <div className="detail-card">
            <span className="detail-card__label">Health endpoint</span>
            <strong>{runtimeSnapshot?.healthEndpoint ?? "Loading..."}</strong>
          </div>
          <div className="detail-card">
            <span className="detail-card__label">Web delivery</span>
            <strong>{runtimeSnapshot?.webDelivery ?? "Loading..."}</strong>
          </div>
          <div className="detail-card">
            <span className="detail-card__label">Preview entry</span>
            <strong>{runtimeSnapshot?.previewIndex ?? "preview/index.html"}</strong>
          </div>
        </div>

        {coreFeatureRuntime ? (
          <div className="detail-grid">
            <div className="detail-card">
              <span className="detail-card__label">Config file</span>
              <strong>{runtimeSnapshot?.configPath ?? coreFeatureRuntime.config.configPath}</strong>
            </div>
            <div className="detail-card">
              <span className="detail-card__label">Controllers path</span>
              <strong>{runtimeSnapshot?.controllersPath ?? coreFeatureRuntime.config.controllersPath}</strong>
            </div>
            <div className="detail-card">
              <span className="detail-card__label">Auth modes</span>
              <strong>{runtimeSnapshot?.authModes.join(", ") ?? coreFeatureRuntime.config.authModes.join(", ")}</strong>
            </div>
            <div className="detail-card">
              <span className="detail-card__label">Metrics endpoint</span>
              <strong>{runtimeSnapshot?.metricsEndpoint ?? coreFeatureRuntime.config.metricsEndpoint}</strong>
            </div>
            <div className="detail-card">
              <span className="detail-card__label">Scheduler mode</span>
              <strong>{runtimeSnapshot?.schedulerMode ?? coreFeatureRuntime.config.schedulerMode}</strong>
            </div>
            <div className="detail-card">
              <span className="detail-card__label">Telemetry</span>
              <strong>
                {runtimeSnapshot?.telemetryEnabled ?? coreFeatureRuntime.config.telemetryEnabled
                  ? "enabled"
                  : "disabled"}
              </strong>
            </div>
          </div>
        ) : (
          renderCoreFeatureStatePanel(
            coreFeatureLoadState,
            coreFeatureErrorMessage,
            "bootstrap"
          )
        )}
      </div>
    );
  }

  if (feature.id === "controllers") {
    if (!coreFeatureRuntime) {
      return renderCoreFeatureStatePanel(
        coreFeatureLoadState,
        coreFeatureErrorMessage,
        "controllers"
      );
    }

    return (
      <div className="demo-stack">
        <div className="auth-flow-grid">
          <article className="detail-card">
            <span className="detail-card__label">Routes</span>
            <strong>{coreFeatureRuntime.controllers.length}</strong>
            <p>The route catalog is loaded from the current runtime.</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Controller files</span>
            <strong>{new Set(coreFeatureRuntime.controllers.map(route => route.controller)).size}</strong>
            <p>Health, auth, and demo controllers now form one visible routing story.</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Security modes</span>
            <strong>{Array.from(new Set(coreFeatureRuntime.controllers.map(route => route.security))).join(", ")}</strong>
            <p>Public, Basic, and JWT handlers are shown together.</p>
          </article>
        </div>

        <div className="endpoint-list">
          {coreFeatureRuntime.controllers.map(route => (
            <article className="endpoint-card" key={`${route.method}-${route.path}`}>
              <span className="endpoint-card__method">{route.method}</span>
              <strong>{route.path}</strong>
              <span>{route.security}</span>
              <span>{route.controller}</span>
              <p className="endpoint-card__summary">{route.summary}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (feature.id === "security") {
    return (
      <div className="auth-flow-grid">
        <article className="detail-card">
          <span className="detail-card__label">Login gate</span>
          <strong>HTTP Basic Auth</strong>
          <p>Static demo credentials unlock the initial login request.</p>
        </article>
        <article className="detail-card">
          <span className="detail-card__label">Issued token</span>
          <strong>{session.tokenType}</strong>
          <p>{session.expiresIn} validity window from the server-side demo config.</p>
        </article>
        <article className="detail-card">
          <span className="detail-card__label">Validation source</span>
          <strong>{session.source}</strong>
          <p>Session restoration always verifies the stored JWT before the app shell opens.</p>
        </article>
        <article className="detail-card">
          <span className="detail-card__label">Protected feature calls</span>
          <strong>
            {coreFeatureRuntime?.controllers.filter(route => route.security === "jwt").length ?? 0}
          </strong>
          <p>JWT is reused for the EventBus trigger route as well.</p>
        </article>
      </div>
    );
  }

  if (feature.id === "lifecycle-hooks") {
    if (!coreFeatureRuntime) {
      return renderCoreFeatureStatePanel(
        coreFeatureLoadState,
        coreFeatureErrorMessage,
        "lifecycle hooks"
      );
    }

    return (
      <div className="demo-stack">
        <div className="auth-flow-grid">
          <article className="detail-card">
            <span className="detail-card__label">Registered hooks</span>
            <strong>{coreFeatureRuntime.lifecycleHooks.registeredHooks.length}</strong>
            <p>{coreFeatureRuntime.lifecycleHooks.registeredHooks.join(", ")}</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Latest trace entry</span>
            <strong>{coreFeatureRuntime.lifecycleHooks.entries[0]?.hook ?? "pending"}</strong>
            <p>{coreFeatureRuntime.lifecycleHooks.entries[0]?.recordedAt ?? "No hook has been recorded yet."}</p>
          </article>
        </div>

        <div className="preview-feed-list">
          {coreFeatureRuntime.lifecycleHooks.entries.map(entry => (
            <div className="preview-feed-item" key={`${entry.hook}-${entry.recordedAt}`}>
              <strong>{entry.hook}</strong>
              <span className="preview-feed-item__meta">{entry.recordedAt}</span>
              <span>{entry.detail}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (feature.id === "service-registry") {
    if (!coreFeatureRuntime) {
      return renderCoreFeatureStatePanel(
        coreFeatureLoadState,
        coreFeatureErrorMessage,
        "service registry"
      );
    }

    return (
      <div className="demo-stack">
        <div className="auth-flow-grid">
          <article className="detail-card">
            <span className="detail-card__label">Registered services</span>
            <strong>{coreFeatureRuntime.services.entries.filter(entry => entry.registered).length}</strong>
            <p>{coreFeatureRuntime.services.registeredNames.join(", ")}</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Registry source</span>
            <strong>Lifecycle startup hook</strong>
            <p>The services are registered before the workspace pages read them.</p>
          </article>
        </div>

        <div className="card-grid">
          {coreFeatureRuntime.services.entries.map(service => (
            <article className="feature-card" key={service.name}>
              <span className="feature-card__tag">{service.kind}</span>
              <h3>{service.name}</h3>
              <p>{service.summary}</p>
              <ul className="bullet-list bullet-list--compact">
                {service.capabilities.map(capability => (
                  <li key={capability}>{capability}</li>
                ))}
              </ul>
              <span className="source-chip">
                {service.registered ? "Registered" : "Missing"} · {service.source}
              </span>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (feature.id === "event-system") {
    if (!coreFeatureRuntime) {
      return renderCoreFeatureStatePanel(
        coreFeatureLoadState,
        coreFeatureErrorMessage,
        "event system"
      );
    }

    return (
      <div className="demo-stack">
        <div className="auth-flow-grid">
          <article className="detail-card">
            <span className="detail-card__label">Event name</span>
            <strong>{coreFeatureRuntime.eventSystem.eventName}</strong>
            <p>{coreFeatureRuntime.eventSystem.listenerSummary}</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Last preset</span>
            <strong>{coreFeatureRuntime.eventSystem.lastPresetId}</strong>
            <p>The visible text field always reflects the latest emitted preset.</p>
          </article>
        </div>

        <div className="demo-button-row">
          {coreFeatureRuntime.eventSystem.presets.map(preset => (
            <button
              className={`secondary-button${
                coreFeatureRuntime.eventSystem.lastPresetId === preset.id
                  ? " secondary-button--active"
                  : ""
              }`}
              disabled={pendingPresetId !== null}
              key={preset.id}
              onClick={() => onTriggerEventPreset(preset.id)}
              type="button"
            >
              {pendingPresetId === preset.id ? `Sending ${preset.label}...` : preset.label}
            </button>
          ))}
        </div>

        {eventErrorMessage ? (
          <div className="inline-message inline-message--error">{eventErrorMessage}</div>
        ) : null}

        <textarea
          className="token-viewer demo-textarea"
          readOnly
          value={coreFeatureRuntime.eventSystem.selectedText}
        />

        <div className="preview-feed-list">
          {coreFeatureRuntime.eventSystem.recentEvents.length > 0 ? (
            coreFeatureRuntime.eventSystem.recentEvents.map(entry => (
              <div className="preview-feed-item" key={`${entry.presetId}-${entry.recordedAt}`}>
                <strong>{entry.label}</strong>
                <span className="preview-feed-item__meta">{entry.recordedAt}</span>
                <span>{entry.text}</span>
              </div>
            ))
          ) : (
            <PageStatePanel
              body="Emit one of the presets to create the first visible EventBus entry."
              title="No EventBus messages yet"
            />
          )}
        </div>
      </div>
    );
  }

  if (feature.id === "metrics") {
    if (!liveDemoRuntime) {
      return renderCoreFeatureStatePanel(
        liveDemoLoadState,
        liveDemoErrorMessage,
        "metrics"
      );
    }

    return (
      <div className="demo-stack">
        <div className="auth-flow-grid">
          <article className="detail-card">
            <span className="detail-card__label">Metrics endpoint</span>
            <strong>{liveDemoRuntime.metrics.endpointPath}</strong>
            <p>The workspace reads a short preview directly from the running Prometheus export.</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Metric names</span>
            <strong>{liveDemoRuntime.metrics.sampleMetricNames.length}</strong>
            <p>{liveDemoRuntime.metrics.sampleMetricNames.join(", ") || "No metrics collected yet."}</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Preview status</span>
            <strong>{liveDemoRuntime.metrics.status}</strong>
            <p>{liveDemoRuntime.metrics.updatedAt ?? "No metrics preview has been loaded yet."}</p>
          </article>
        </div>

        <pre className="token-viewer">
          {liveDemoRuntime.metrics.sampleLines.join("\n") || "No metrics sample available yet."}
        </pre>
      </div>
    );
  }

  if (feature.id === "public-api") {
    return (
      <PageStatePanel
        body="The public API reference remains planned. The current pages already reuse real runtime code and shared snippets as the foundation."
        title="Public API page is planned"
      />
    );
  }

  if (feature.id === "scheduler") {
    if (!liveDemoRuntime) {
      return renderCoreFeatureStatePanel(
        liveDemoLoadState,
        liveDemoErrorMessage,
        "scheduler"
      );
    }

    return (
      <div className="demo-stack">
        <div className="auth-flow-grid">
          <article className="detail-card">
            <span className="detail-card__label">Demo interval</span>
            <strong>{liveDemoRuntime.scheduler.intervalLabel}</strong>
            <p>The running scheduler job emits one visible clock-tick event every ten seconds.</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Latest live tick</span>
            <strong>{liveDemoRuntime.scheduler.latestTick}</strong>
            <p>The scheduler page now reads the current backend tick instead of a prepared preview-only value.</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Recent ticks</span>
            <strong>{liveDemoRuntime.scheduler.recentTicks.length}</strong>
            <p>The backend keeps the recent clock feed available for the workspace.</p>
          </article>
        </div>

        <div className="preview-feed-list">
          {liveDemoRuntime.scheduler.recentTicks.map(entry => (
            <div className="preview-feed-item" key={`${entry.isoTime}-${entry.recordedAt}`}>
              <strong>{entry.timeLabel}</strong>
              <span className="preview-feed-item__meta">{entry.recordedAt}</span>
              <span>Source: {entry.source}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (feature.id === "websocket") {
    if (!liveDemoRuntime) {
      return renderCoreFeatureStatePanel(
        liveDemoLoadState,
        liveDemoErrorMessage,
        "websocket"
      );
    }

    return (
      <div className="demo-stack">
        <div className="auth-flow-grid">
          <article className="detail-card">
            <span className="detail-card__label">Connection state</span>
            <strong>{liveDemoRuntime.websocket.status}</strong>
            <p>{liveDemoRuntime.websocket.note}</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Socket path</span>
            <strong>{liveDemoRuntime.websocket.path}</strong>
            <p>The documented transport path is already visible in the workspace.</p>
          </article>
          <article className="detail-card">
            <span className="detail-card__label">Transport auth</span>
            <strong>{liveDemoRuntime.websocket.authMode}</strong>
            <p>The later socket bridge reuses the same JWT session that already protects the API.</p>
          </article>
        </div>

        <div className="detail-card">
          <span className="detail-card__label">Backend feed</span>
          <strong>{liveDemoRuntime.transport.status}</strong>
          <p>{liveDemoRuntime.transport.note}</p>
        </div>

        <div className="preview-feed-list">
          {liveDemoRuntime.transport.messages.map(message => (
            <div className="preview-feed-item" key={`${message.kind}-${message.recordedAt}-${message.summary}`}>
              <strong>{message.summary}</strong>
              <span className="preview-feed-item__meta">{message.recordedAt}</span>
              <span>Source: {message.source}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <PageStatePanel
      body={`${feature.title} already has a dedicated page and documentation structure. The deeper runtime demo is scheduled for ${feature.package}.`}
      title="Feature surface prepared"
    />
  );
}

export function ProtectedShell({
  applicationTitle,
  modeLabel,
  onLogout,
  onSelectFeature,
  runtimeSnapshot,
  selectedFeature,
  session
}: ProtectedShellProps) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [coreFeatureRuntime, setCoreFeatureRuntime] = useState<CoreFeatureRuntime | null>(null);
  const [coreFeatureLoadState, setCoreFeatureLoadState] = useState<CoreFeatureLoadState>("loading");
  const [coreFeatureErrorMessage, setCoreFeatureErrorMessage] = useState("");
  const [liveDemoRuntime, setLiveDemoRuntime] = useState<LiveDemoRuntime | null>(null);
  const [liveDemoLoadState, setLiveDemoLoadState] = useState<LiveDemoLoadState>("loading");
  const [liveDemoErrorMessage, setLiveDemoErrorMessage] = useState("");
  const [pendingPresetId, setPendingPresetId] = useState<string | null>(null);
  const [eventErrorMessage, setEventErrorMessage] = useState("");
  const page = selectedFeature ? getFeaturePageDescriptor(selectedFeature) : null;
  const userInitials = getUserInitials(session.user.displayName);

  function handleFeatureSelection(featureId: string) {
    setIsNavigationOpen(false);
    onSelectFeature(featureId);
  }

  async function handleTriggerEventPreset(presetId: string) {
    setPendingPresetId(presetId);
    setEventErrorMessage("");

    try {
      const eventSystem = await emitCoreFeaturePreset(session.token, presetId);
      setCoreFeatureRuntime(current =>
        current
          ? {
              ...current,
              eventSystem
            }
          : current
      );
      try {
        const nextLiveDemoRuntime = await loadLiveDemoRuntime();
        setLiveDemoRuntime(nextLiveDemoRuntime);
        setLiveDemoLoadState("ready");
      } catch {
        // Keep the EventBus interaction responsive even if the follow-up live feed refresh fails.
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "The EventBus preset could not be emitted.";
      setEventErrorMessage(message);
    } finally {
      setPendingPresetId(null);
    }
  }

  useEffect(() => {
    setIsNavigationOpen(false);
  }, [selectedFeature?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadFeatureRuntime() {
      setCoreFeatureLoadState("loading");
      setCoreFeatureErrorMessage("");

      try {
        const nextRuntime = await loadCoreFeatureRuntime();

        if (cancelled) {
          return;
        }

        setCoreFeatureRuntime(nextRuntime);
        setCoreFeatureLoadState("ready");
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "The runtime-backed feature data could not be loaded.";
        setCoreFeatureRuntime(null);
        setCoreFeatureErrorMessage(message);
        setCoreFeatureLoadState("error");
      }
    }

    void loadFeatureRuntime();

    return () => {
      cancelled = true;
    };
  }, [session.token]);

  useEffect(() => {
    let cancelled = false;

    async function refreshLiveRuntime(isInitialLoad: boolean) {
      if (isInitialLoad) {
        setLiveDemoLoadState("loading");
      }

      setLiveDemoErrorMessage("");

      try {
        const nextRuntime = await loadLiveDemoRuntime();

        if (cancelled) {
          return;
        }

        setLiveDemoRuntime(nextRuntime);
        setLiveDemoLoadState("ready");
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error ? error.message : "The live demo runtime data could not be loaded.";
        setLiveDemoRuntime(null);
        setLiveDemoErrorMessage(message);
        setLiveDemoLoadState("error");
      }
    }

    void refreshLiveRuntime(true);

    const intervalId = window.setInterval(() => {
      void refreshLiveRuntime(false);
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [session.token]);

  return (
    <main className="shell shell--app">
      <button
        aria-hidden={!isNavigationOpen}
        className={`drawer-scrim${isNavigationOpen ? " drawer-scrim--visible" : ""}`}
        onClick={() => setIsNavigationOpen(false)}
        tabIndex={isNavigationOpen ? 0 : -1}
        type="button"
      />

      <header className="app-chrome workspace-topbar">
        <div className="workspace-topbar__lead">
          <button
            aria-expanded={isNavigationOpen}
            className="secondary-button nav-toggle"
            onClick={() => setIsNavigationOpen(open => !open)}
            type="button"
          >
            {isNavigationOpen ? "Close menu" : "Open menu"}
          </button>

          <div className="app-brand app-brand--admin">
            <span className="app-brand__mark">EX</span>
            <div className="app-brand__copy">
              <span className="app-brand__title">{applicationTitle}</span>
              <span className="app-brand__subtitle">Admin workspace</span>
            </div>
          </div>
        </div>

        <div className="workspace-topbar__title">
          <span className="workspace-topbar__label">Current feature</span>
          <strong>{selectedFeature?.title ?? "Feature map pending"}</strong>
        </div>

        <div className="app-chrome__actions">
          <span className="hero__eyebrow hero__eyebrow--chrome">{modeLabel}</span>

          <div className="workspace-user-pill">
            <span className="workspace-user-pill__avatar">{userInitials || "EX"}</span>
            <span className="workspace-user-pill__name">{session.user.displayName}</span>
          </div>

          <button className="secondary-button" onClick={onLogout} type="button">
            Sign out
          </button>
        </div>
      </header>

      <section className="workspace-grid">
        <aside
          className={`panel navigation-panel navigation-panel--editorial${
            isNavigationOpen ? " navigation-panel--open" : ""
          }`}
        >
          <div className="navigation-panel__header">
            <h2>Menu</h2>
            <p>{session.features.length} resources</p>
          </div>

          {session.features.length > 0 ? (
            <nav className="feature-nav feature-nav--admin">
              {session.features.map(feature => (
                <button
                  className={`feature-nav__item${
                    feature.id === selectedFeature?.id ? " feature-nav__item--active" : ""
                  }`}
                  key={feature.id}
                  onClick={() => handleFeatureSelection(feature.id)}
                  type="button"
                >
                  <span className="feature-nav__glyph">{getFeatureShortCode(feature.title)}</span>
                  <span className="feature-nav__content">
                    <strong>{feature.title}</strong>
                    <small>
                      {feature.package} · {formatStatusLabel(feature.status)}
                    </small>
                  </span>
                </button>
              ))}
            </nav>
          ) : (
            <PageStatePanel
              body="No features are currently available in the shared navigation registry."
              title="Feature registry is empty"
              tone="loading"
            />
          )}

          <div className="navigation-panel__footer">
            <span>{session.user.username}</span>
            <span>{session.user.role}</span>
          </div>
        </aside>

        <section className="content-stack content-stack--feature">
          {selectedFeature && page ? (
            <>
              <article className="panel workspace-page-header">
                <div className="workspace-page-header__content">
                  <div>
                    <span className="feature-badge">{selectedFeature.package}</span>
                    <p className="workspace-page-header__summary">{selectedFeature.detail}</p>
                  </div>

                  <div className="workspace-page-header__meta">
                    <div className="detail-card">
                      <span className="detail-card__label">Status</span>
                      <strong>{formatStatusLabel(selectedFeature.status)}</strong>
                    </div>
                    <div className="detail-card">
                      <span className="detail-card__label">Runtime mode</span>
                      <strong>{runtimeSnapshot?.mode ?? session.mode}</strong>
                    </div>
                    <div className="detail-card">
                      <span className="detail-card__label">Signed in as</span>
                      <strong>{session.user.username}</strong>
                    </div>
                  </div>
                </div>
              </article>

              <FeaturePageTemplate
                demoContent={renderFeatureDemo(
                  selectedFeature,
                  runtimeSnapshot,
                  session,
                  coreFeatureRuntime,
                  coreFeatureLoadState,
                  coreFeatureErrorMessage,
                  liveDemoRuntime,
                  liveDemoLoadState,
                  liveDemoErrorMessage,
                  pendingPresetId,
                  eventErrorMessage,
                  presetId => {
                    void handleTriggerEventPreset(presetId);
                  }
                )}
                feature={selectedFeature}
                page={page}
                runtimeSnapshot={runtimeSnapshot}
              />

              <article className="panel workspace-utility-panel">
                <div className="workspace-utility-grid">
                  <section className="workspace-utility-card">
                    <div className="panel__header">
                      <h2>Runtime snapshot</h2>
                      <p>Bootstrap details for the current mode.</p>
                    </div>

                    {runtimeSnapshot ? (
                      <div className="session-meta">
                        <span>Status: {runtimeSnapshot.status}</span>
                        <span>Source: {runtimeSnapshot.source}</span>
                        <span>Updated: {runtimeSnapshot.timestamp}</span>
                      </div>
                    ) : (
                      <PageStatePanel
                        body="The runtime snapshot is still loading from the current environment."
                        title="Runtime snapshot pending"
                        tone="loading"
                      />
                    )}
                  </section>

                  <section className="workspace-utility-card">
                    <div className="panel__header">
                      <h2>JWT session</h2>
                      <p>The generated token is reused for protected requests and later live demos.</p>
                    </div>

                    <textarea className="token-viewer" readOnly value={session.token} />
                  </section>
                </div>
              </article>
            </>
          ) : (
            <article className="panel">
              <div className="panel__header">
                <h2>Empty state</h2>
                <p>The workspace is running, but no feature content could be resolved.</p>
              </div>

              <PageStatePanel
                body="Check content/features/navigation.json and the feature page mapping inside the web workspace."
                title="Feature selection could not be rendered"
              />
            </article>
          )}
        </section>
      </section>
    </main>
  );
}
