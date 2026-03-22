import type { FormEvent } from "react";

import type { RuntimeSnapshot } from "../../lib/runtime-snapshot";
import type { DemoCredentials } from "../../lib/session";

type LoadState = "error" | "loading" | "ready";

const clientLoginSnippet = `
const response = await fetch("/api/auth/login", {
  headers: {
    Authorization: buildBasicAuthorizationHeader(username, password)
  },
  method: "POST"
});

if (!response.ok) {
  throw new Error(await parseApiError(response));
}

const data = (await response.json()) as Omit<SessionState, "features">;
return {
  ...data,
  features: featureMenuItems
};
`.trim();

const serverLoginSnippet = `
{
  method: "post",
  path: "/login",
  secure: "basic",
  handler: async (req: AuthenticatedRequest, res: ExtResponse) => {
    const sessionUser = normalizeSessionUser(req.user);
    const claims = createJwtClaims(sessionUser.username);
    const token = await signToken(
      claims,
      demoJwtConfig.secret,
      demoJwtConfig.algorithm,
      demoJwtConfig.expiresIn
    );

    res.json({
      claims,
      expiresIn: demoJwtConfig.expiresIn,
      issuedAt: new Date().toISOString(),
      token,
      tokenType: "Bearer",
      user: sessionUser
    });
  }
}
`.trim();

const sessionRestoreSnippet = `
const nextSession = await loginWithBasic(username, password);
storeToken(nextSession.token);
setSession(nextSession);
setSelectedFeatureId(
  resolveFeatureFromHash(nextSession.features) ?? nextSession.features[0]?.id ?? ""
);
setAuthState("authenticated");
`.trim();

type LoginScreenProps = {
  applicationTitle: string;
  credentials: DemoCredentials;
  errorMessage: string;
  isSubmitting: boolean;
  loadState: LoadState;
  loginError: string;
  modeLabel: string;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUsernameChange: (value: string) => void;
  password: string;
  runtimeSnapshot: RuntimeSnapshot | null;
  username: string;
};

export function LoginScreen({
  applicationTitle,
  credentials,
  errorMessage,
  isSubmitting,
  loadState,
  loginError,
  modeLabel,
  onPasswordChange,
  onSubmit,
  onUsernameChange,
  password,
  runtimeSnapshot,
  username
}: LoginScreenProps) {
  return (
    <main className="shell shell--auth">
      <header className="app-chrome app-chrome--simple auth-topbar">
        <div className="app-brand app-brand--admin">
          <span className="app-brand__mark">EX</span>
          <div className="app-brand__copy">
            <span className="app-brand__title">{applicationTitle}</span>
            <span className="app-brand__subtitle">Previewable login story for expresto-server</span>
          </div>
        </div>

        <div className="app-chrome__actions">
          <span className="hero__eyebrow hero__eyebrow--chrome">{modeLabel}</span>
        </div>
      </header>

      <section className="auth-layout">
        <article className="hero hero--login">
          <div className="workspace-hero__cover workspace-hero__cover--login">
            <div className="workspace-hero__author">
              <span className="session-avatar session-avatar--hero">AP</span>
              <div>
                <strong>Protected documentation</strong>
                <span>Sign in first, then open the feature docs and demos</span>
              </div>
            </div>

            <div className="workspace-hero__stats">
              <span>Login required</span>
              <span>Docs after sign in</span>
            </div>
          </div>

          <h1>Sign in to open the {applicationTitle} documentation workspace</h1>
          <p className="hero__copy">
            After login, the protected workspace reveals the feature documentation, code examples,
            runtime metadata, and the prepared demo surfaces for each framework topic.
          </p>
          <p className="hero__supporting-copy">
            {runtimeSnapshot?.message ??
              "Loading the runtime and the authentication flow for expresto-examples."} Until then,
            this start page only shows the access step and the visible demo credentials.
          </p>

          <div className="hero__actions">
            <a className="primary-button hero__jump-link" href="#login-process-code">
              Jump to login code documentation
            </a>
          </div>

          <div className="highlight-grid highlight-grid--auth">
            <div className="highlight-card">Feature documentation pages stay behind the protected shell.</div>
            <div className="highlight-card">Code examples and runtime notes appear only after successful sign-in.</div>
            <div className="highlight-card">The issued JWT restores the session before the documentation workspace opens.</div>
            <div className="highlight-card">Preview and live mode use the same gated entry point.</div>
          </div>

          <div className="auth-gate-strip">
            <div className="auth-gate-strip__item">
              <span>After login</span>
              <strong>Feature docs</strong>
            </div>
            <div className="auth-gate-strip__item">
              <span>After login</span>
              <strong>Code examples</strong>
            </div>
            <div className="auth-gate-strip__item">
              <span>After login</span>
              <strong>Runtime panels</strong>
            </div>
            <div className="auth-gate-strip__item">
              <span>After login</span>
              <strong>Demo surfaces</strong>
            </div>
          </div>
        </article>

        <aside className="auth-sidebar">
          <article className="panel login-panel">
            <div className="panel__header">
              <h2>Sign In</h2>
              <p>
                The login endpoint uses HTTP Basic Auth and returns a JWT that unlocks the protected
                documentation workspace.
              </p>
            </div>

            <div className="access-lock-banner">
              <strong>Documentation is locked before sign-in.</strong>
              <p>Use the demo account below to open the internal feature pages.</p>
            </div>

            <form className="login-form" onSubmit={onSubmit}>
              <label className="field">
                <span>Username</span>
                <input
                  autoComplete="username"
                  onChange={event => onUsernameChange(event.target.value)}
                  type="text"
                  value={username}
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  autoComplete="current-password"
                  onChange={event => onPasswordChange(event.target.value)}
                  type="password"
                  value={password}
                />
              </label>

              <button className="primary-button primary-button--full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Signing in..." : "Sign in with demo credentials"}
              </button>
            </form>

            {loginError ? (
              <div className="inline-message inline-message--error">{loginError}</div>
            ) : null}
            {loadState === "error" ? (
              <div className="inline-message inline-message--error">
                Runtime bootstrap failed: {errorMessage}
              </div>
            ) : null}
          </article>

          <article className="panel access-preview-panel">
            <div className="panel__header">
              <h2>What opens after login</h2>
              <p>The protected shell becomes the actual documentation area.</p>
            </div>

            <div className="access-preview-list">
              <div className="access-preview-item">
                <strong>Feature pages</strong>
                <span>Overview, Bootstrap, Controllers, Security, Scheduler, WebSocket, and more.</span>
              </div>
              <div className="access-preview-item">
                <strong>Code examples</strong>
                <span>Each page shows the current implementation first, with variants only when useful.</span>
              </div>
              <div className="access-preview-item">
                <strong>Runtime context</strong>
                <span>Session details, runtime snapshot data, and protected JWT-backed surfaces.</span>
              </div>
            </div>
          </article>

          <article className="panel credential-panel">
            <div className="panel__header">
              <h2>Demo Credentials</h2>
              <p>
                These static credentials are intentionally displayed on the public start page so the
                documentation area can be opened immediately.
              </p>
            </div>

            <div className="credential-panel__rows">
              <div className="credential-row">
                <span>Username</span>
                <strong>{credentials.username}</strong>
              </div>
              <div className="credential-row">
                <span>Password</span>
                <strong>{credentials.password}</strong>
              </div>
              <p className="credential-panel__hint">{credentials.hint}</p>
              <p className="credential-panel__hint">
                Fixed application title: <strong>{applicationTitle}</strong>
              </p>
            </div>
          </article>
        </aside>
      </section>

      <section className="auth-docs">
        <article className="panel">
          <div className="panel__header">
            <h2>Login process documentation</h2>
            <p>
              This public start page documents the authentication flow in code before the protected
              documentation workspace opens.
            </p>
          </div>

          <div className="auth-process-grid">
            <div className="detail-card">
              <span className="detail-card__label">Step 1</span>
              <strong>User submits demo credentials</strong>
              <p>The form sends username and password through HTTP Basic Auth to the login endpoint.</p>
            </div>
            <div className="detail-card">
              <span className="detail-card__label">Step 2</span>
              <strong>Server issues a JWT</strong>
              <p>The backend validates the Basic Auth user and returns claims, metadata, and a bearer token.</p>
            </div>
            <div className="detail-card">
              <span className="detail-card__label">Step 3</span>
              <strong>Frontend opens the workspace</strong>
              <p>The client stores the JWT, restores the session state, and then reveals the protected docs.</p>
            </div>
          </div>
        </article>

        <article className="panel" id="login-process-code">
          <div className="panel__header">
            <h2>Current implementation</h2>
            <p>The page documents the exact flow that unlocks the protected documentation shell.</p>
          </div>

          <div className="snippet-stack">
            <section className="snippet-card">
              <div className="snippet-card__header">
                <div>
                  <h3>Client request to the login endpoint</h3>
                  <p>The frontend builds a Basic Auth header and sends it to the protected login route.</p>
                </div>

                <div className="snippet-card__meta">
                  <span className="feature-badge">Current implementation</span>
                  <span className="snippet-path">apps/web/src/lib/session.ts</span>
                </div>
              </div>

              <pre className="snippet-block language-ts">
                <code>{clientLoginSnippet}</code>
              </pre>
            </section>

            <section className="snippet-card">
              <div className="snippet-card__header">
                <div>
                  <h3>Server-side JWT creation</h3>
                  <p>The login controller validates the authenticated user and signs the JWT response.</p>
                </div>

                <div className="snippet-card__meta">
                  <span className="feature-badge">Current implementation</span>
                  <span className="snippet-path">apps/server/src/controllers/auth.controller.ts</span>
                </div>
              </div>

              <pre className="snippet-block language-ts">
                <code>{serverLoginSnippet}</code>
              </pre>
            </section>

            <section className="snippet-card">
              <div className="snippet-card__header">
                <div>
                  <h3>Session handoff into the protected workspace</h3>
                  <p>After a successful login, the client stores the token and opens the documentation shell.</p>
                </div>

                <div className="snippet-card__meta">
                  <span className="feature-badge">Current implementation</span>
                  <span className="snippet-path">apps/web/src/app/App.tsx</span>
                </div>
              </div>

              <pre className="snippet-block language-ts">
                <code>{sessionRestoreSnippet}</code>
              </pre>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
