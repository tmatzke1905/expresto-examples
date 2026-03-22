import type { FormEvent } from "react";

import type { RuntimeSnapshot } from "../../lib/runtime-snapshot";
import type { DemoCredentials } from "../../lib/session";

type LoadState = "error" | "loading" | "ready";

type LoginScreenProps = {
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
      <section className="hero hero--login">
        <div className="hero__eyebrow">{modeLabel}</div>
        <h1>{runtimeSnapshot?.title ?? "Login demo is loading"}</h1>
        <p className="hero__copy">
          {runtimeSnapshot?.message ??
            "Loading the runtime and the first authentication flow for expresto-examples."}
        </p>
      </section>

      <section className="auth-grid">
        <article className="panel credential-panel">
          <div className="panel__header">
            <h2>Demo Credentials</h2>
            <p>
              These static credentials are intentionally displayed on the page for the AP3 login
              flow.
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
          </div>
        </article>

        <article className="panel login-panel">
          <div className="panel__header">
            <h2>Sign In</h2>
            <p>
              The login endpoint uses HTTP Basic Auth and returns a JWT that unlocks the protected
              application shell.
            </p>
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

            <button className="primary-button" disabled={isSubmitting} type="submit">
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
      </section>
    </main>
  );
}
