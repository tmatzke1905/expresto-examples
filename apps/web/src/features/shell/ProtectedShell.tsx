import type { FeatureMenuItem, SessionState } from "../../lib/session";
import type { RuntimeSnapshot } from "../../lib/runtime-snapshot";

type ProtectedShellProps = {
  modeLabel: string;
  onLogout: () => void;
  onSelectFeature: (featureId: string) => void;
  runtimeSnapshot: RuntimeSnapshot | null;
  selectedFeature: FeatureMenuItem;
  session: SessionState;
};

export function ProtectedShell({
  modeLabel,
  onLogout,
  onSelectFeature,
  runtimeSnapshot,
  selectedFeature,
  session
}: ProtectedShellProps) {
  return (
    <main className="shell shell--app">
      <section className="hero hero--app">
        <div className="hero__eyebrow">{modeLabel}</div>
        <div className="app-hero__content">
          <div>
            <h1>Protected Example Workspace</h1>
            <p className="hero__copy">
              The application now runs behind a JWT-backed session and exposes the first feature
              navigation shell for the remaining work packages.
            </p>
          </div>

          <div className="session-summary">
            <span className="session-summary__label">Signed in as</span>
            <strong>{session.user.displayName}</strong>
            <span>{session.user.username}</span>
            <span>{session.user.role}</span>
          </div>
        </div>
      </section>

      <section className="app-layout">
        <aside className="panel navigation-panel">
          <div className="panel__header">
            <h2>Feature Menu</h2>
            <p>All planned expresto-server feature pages are listed here from AP3 onward.</p>
          </div>

          <nav className="feature-nav">
            {session.features.map(feature => (
              <button
                className={`feature-nav__item${
                  feature.id === selectedFeature.id ? " feature-nav__item--active" : ""
                }`}
                key={feature.id}
                onClick={() => onSelectFeature(feature.id)}
                type="button"
              >
                <span>{feature.title}</span>
                <small>{feature.status}</small>
              </button>
            ))}
          </nav>

          <button className="secondary-button" onClick={onLogout} type="button">
            Sign out
          </button>
        </aside>

        <section className="content-stack">
          <article className="panel">
            <div className="panel__header">
              <h2>{selectedFeature.title}</h2>
              <p>{selectedFeature.summary}</p>
            </div>

            <div className="detail-grid">
              <div className="detail-card">
                <span className="detail-card__label">Package</span>
                <strong>{selectedFeature.package}</strong>
              </div>
              <div className="detail-card">
                <span className="detail-card__label">Status</span>
                <strong>{selectedFeature.status}</strong>
              </div>
              <div className="detail-card">
                <span className="detail-card__label">API Root</span>
                <strong>{runtimeSnapshot?.contextRoot ?? "/api"}</strong>
              </div>
            </div>

            <div className="selected-feature-body">
              <p>{selectedFeature.detail}</p>
            </div>
          </article>

          <article className="panel">
            <div className="panel__header">
              <h2>JWT Session</h2>
              <p>
                This token is generated after the Basic Auth login and reused for protected
                endpoints in the next work packages.
              </p>
            </div>

            <textarea className="token-viewer" readOnly value={session.token} />
          </article>

          <article className="panel panel--compact">
            <div className="panel__header">
              <h2>Session Metadata</h2>
              <p>Session verification source and issue timestamp.</p>
            </div>

            <div className="session-meta">
              <span>Source: {session.source}</span>
              <span>Issued: {session.issuedAt}</span>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
