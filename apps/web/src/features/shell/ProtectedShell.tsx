import { useEffect, useState } from "react";

import {
  FeaturePageTemplate,
  PageStatePanel
} from "../pages/FeaturePageTemplate";
import { getFeaturePageDescriptor } from "../pages/feature-page-content";
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

function getUserInitials(displayName: string): string {
  return displayName
    .split(" ")
    .map(part => part.slice(0, 1).toUpperCase())
    .join("")
    .slice(0, 2);
}

function renderFeatureDemo(
  feature: FeatureMenuItem,
  runtimeSnapshot: RuntimeSnapshot | null,
  session: SessionState
) {
  if (feature.id === "overview") {
    return (
      <div className="card-grid card-grid--feature-status">
        {session.features.map(entry => (
          <article className="feature-card" key={entry.id}>
            <span className="feature-card__tag">{entry.package}</span>
            <h3>{entry.title}</h3>
            <p>{entry.summary}</p>
            <span className="source-chip">Status: {entry.status}</span>
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
      </div>
    );
  }

  if (feature.id === "controllers") {
    return (
      <div className="endpoint-list">
        {[
          {
            path: "/api/system/health",
            method: "GET",
            security: "public"
          },
          {
            path: "/api/auth/login",
            method: "POST",
            security: "basic"
          },
          {
            path: "/api/auth/session",
            method: "GET",
            security: "jwt"
          }
        ].map(endpoint => (
          <article className="endpoint-card" key={endpoint.path}>
            <span className="endpoint-card__method">{endpoint.method}</span>
            <strong>{endpoint.path}</strong>
            <span>{endpoint.security}</span>
          </article>
        ))}
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
      </div>
    );
  }

  if (feature.id === "event-system") {
    return (
      <div className="demo-stack">
        <div className="demo-button-row">
          <button className="secondary-button" disabled type="button">
            Greeting
          </button>
          <button className="secondary-button" disabled type="button">
            Warning
          </button>
          <button className="secondary-button" disabled type="button">
            Info
          </button>
        </div>

        <textarea
          className="token-viewer demo-textarea"
          readOnly
          value="AP6/AP7 will route the EventBus result into this text field."
        />
      </div>
    );
  }

  if (feature.id === "scheduler") {
    return (
      <div className="auth-flow-grid">
        <article className="detail-card">
          <span className="detail-card__label">Demo interval</span>
          <strong>Every 10 seconds</strong>
          <p>The planned scheduler job emits one visible clock-tick event.</p>
        </article>
        <article className="detail-card">
          <span className="detail-card__label">Latest preview value</span>
          <strong>--:--:--</strong>
          <p>AP7 will replace this placeholder with the live server time feed.</p>
        </article>
      </div>
    );
  }

  if (feature.id === "websocket") {
    return (
      <div className="auth-flow-grid">
        <article className="detail-card">
          <span className="detail-card__label">Connection state</span>
          <strong>Planned</strong>
          <p>The future socket view will show live connection state and transport errors.</p>
        </article>
        <article className="detail-card">
          <span className="detail-card__label">Shared feed</span>
          <strong>Clock + EventBus</strong>
          <p>Scheduler ticks and EventBus updates will arrive through one visible message feed.</p>
        </article>
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
  const page = selectedFeature ? getFeaturePageDescriptor(selectedFeature) : null;
  const userInitials = getUserInitials(session.user.displayName);

  function handleFeatureSelection(featureId: string) {
    setIsNavigationOpen(false);
    onSelectFeature(featureId);
  }

  useEffect(() => {
    setIsNavigationOpen(false);
  }, [selectedFeature?.id]);

  return (
    <main className="shell shell--app">
      <section className="workspace-grid">
        <button
          aria-hidden={!isNavigationOpen}
          className={`drawer-scrim${isNavigationOpen ? " drawer-scrim--visible" : ""}`}
          onClick={() => setIsNavigationOpen(false)}
          tabIndex={isNavigationOpen ? 0 : -1}
          type="button"
        />

        <aside className={`panel navigation-panel${isNavigationOpen ? " navigation-panel--open" : ""}`}>
          <div className="panel__header">
            <h2>Feature menu</h2>
            <p>{session.features.length} pages are already wired into the protected workspace.</p>
          </div>

          {session.features.length > 0 ? (
            <nav className="feature-nav">
              {session.features.map(feature => (
                <button
                  className={`feature-nav__item${
                    feature.id === selectedFeature?.id ? " feature-nav__item--active" : ""
                  }`}
                  key={feature.id}
                  onClick={() => handleFeatureSelection(feature.id)}
                  type="button"
                >
                  <span>{feature.title}</span>
                  <small>{feature.status}</small>
                </button>
              ))}
            </nav>
          ) : (
            <PageStatePanel
              body="No features are currently available in the shared navigation registry."
              title="Feature registry is empty"
            />
          )}
        </aside>

        <section className="app-chrome workspace-topbar">
          <div className="app-brand">
            <span className="app-brand__title">{applicationTitle}</span>
            <span className="app-brand__subtitle">Example workspace for expresto-server</span>
          </div>

          <div className="app-chrome__actions">
            <span className="hero__eyebrow">{modeLabel}</span>

            <button
              aria-expanded={isNavigationOpen}
              className="secondary-button nav-toggle"
              onClick={() => setIsNavigationOpen(open => !open)}
              type="button"
            >
              {isNavigationOpen ? "Close menu" : "Feature menu"}
            </button>

            <button className="secondary-button" onClick={onLogout} type="button">
              Sign out
            </button>
          </div>
        </section>

        <section className="hero hero--app workspace-hero">
          <div className="app-hero__content">
            <div>
              <div className="hero__eyebrow">Authenticated workspace</div>
              <h1>{selectedFeature?.title ?? "Feature map pending"}</h1>
              <p className="hero__copy">
                {selectedFeature?.summary ??
                  "The application could not resolve a feature entry. Check the shared navigation data."}
              </p>
              <p className="hero__supporting-copy">
                The AP4 shell keeps every feature page consistent across title, demo area, code
                examples, and documentation notes.
              </p>
            </div>

            <div className="session-summary">
              <span className="session-summary__label">Signed in as</span>
              <div className="session-summary__identity">
                <span className="session-avatar">{userInitials || "EX"}</span>
                <div>
                  <strong>{session.user.displayName}</strong>
                  <span>{session.user.username}</span>
                  <span>{session.user.role}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="content-stack content-stack--feature">
          {selectedFeature && page ? (
            <FeaturePageTemplate
              demoContent={renderFeatureDemo(selectedFeature, runtimeSnapshot, session)}
              feature={selectedFeature}
              page={page}
              runtimeSnapshot={runtimeSnapshot}
            />
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

        <aside className="info-rail">
          <article className="panel panel--compact">
            <div className="panel__header">
              <h2>Runtime</h2>
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
          </article>

          <article className="panel panel--compact">
            <div className="panel__header">
              <h2>JWT session</h2>
              <p>The generated token is reused for protected requests and later live demos.</p>
            </div>

            <textarea className="token-viewer" readOnly value={session.token} />
          </article>

          <article className="panel panel--compact">
            <div className="panel__header">
              <h2>Session metadata</h2>
              <p>Current user, issue time, and verification source.</p>
            </div>

            <div className="session-meta">
              <span>User: {session.user.username}</span>
              <span>Issued: {session.issuedAt}</span>
              <span>Source: {session.source}</span>
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}
