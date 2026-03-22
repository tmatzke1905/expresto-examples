import { type FormEvent, useEffect, useState } from "react";

import { LoginScreen } from "../features/auth/LoginScreen";
import { ProtectedShell } from "../features/shell/ProtectedShell";
import { APP_TITLE, resolveFeatureFromHash, updateFeatureHash } from "../lib/app-config";
import { type RuntimeSnapshot, loadRuntimeSnapshot } from "../lib/runtime-snapshot";
import {
  clearStoredToken,
  demoCredentials,
  featureMenuItems,
  readStoredToken,
  storeToken,
  type SessionState,
  verifySession,
  loginWithBasic
} from "../lib/session";

type AuthState = "authenticated" | "checking" | "logged_out";
type LoadState = "error" | "loading" | "ready";

export function App() {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [password, setPassword] = useState(demoCredentials.password);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [runtimeSnapshot, setRuntimeSnapshot] = useState<RuntimeSnapshot | null>(null);
  const [selectedFeatureId, setSelectedFeatureId] = useState(
    () => resolveFeatureFromHash(featureMenuItems) ?? featureMenuItems[0]?.id ?? ""
  );
  const [session, setSession] = useState<SessionState | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState(demoCredentials.username);

  useEffect(() => {
    document.title = APP_TITLE;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const snapshot = await loadRuntimeSnapshot();
        const token = readStoredToken();

        if (cancelled) {
          return;
        }

        setRuntimeSnapshot(snapshot);
        setLoadState("ready");

        if (!token) {
          setAuthState("logged_out");
          return;
        }

        try {
          const restoredSession = await verifySession(token);
          if (cancelled) {
            return;
          }

          setSession(restoredSession);
          setSelectedFeatureId(
            resolveFeatureFromHash(restoredSession.features) ?? restoredSession.features[0]?.id ?? ""
          );
          setAuthState("authenticated");
        } catch {
          clearStoredToken();
          if (!cancelled) {
            setAuthState("logged_out");
          }
        }
      } catch (error) {
        if (cancelled) {
          return;
        }
        const message = error instanceof Error ? error.message : "Unknown runtime error";
        setErrorMessage(message);
        setLoadState("error");
        setAuthState("logged_out");
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (authState !== "authenticated" || !session) {
      return;
    }

    const hasSelectedFeature = session.features.some(feature => feature.id === selectedFeatureId);

    if (!hasSelectedFeature) {
      const fallbackFeatureId = resolveFeatureFromHash(session.features) ?? session.features[0]?.id ?? "";

      if (fallbackFeatureId !== selectedFeatureId) {
        setSelectedFeatureId(fallbackFeatureId);
      }
      return;
    }

    if (selectedFeatureId.length > 0) {
      updateFeatureHash(selectedFeatureId);
    }
  }, [authState, selectedFeatureId, session]);

  const modeLabel =
    runtimeSnapshot?.mode === "preview" ? "Repository Preview" : "Live expresto-server Runtime";

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setLoginError("");

    try {
      const nextSession = await loginWithBasic(username, password);
      storeToken(nextSession.token);
      setSession(nextSession);
      setSelectedFeatureId(
        resolveFeatureFromHash(nextSession.features) ?? nextSession.features[0]?.id ?? ""
      );
      setAuthState("authenticated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      setLoginError(message);
      setAuthState("logged_out");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleLogout() {
    clearStoredToken();
    setSession(null);
    setLoginError("");
    setAuthState("logged_out");
  }

  function handleSelectFeature(featureId: string) {
    setSelectedFeatureId(featureId);
  }

  const selectedFeature =
    session?.features.find(feature => feature.id === selectedFeatureId) ?? session?.features[0] ?? null;

  if (authState === "authenticated" && session) {
    return (
      <ProtectedShell
        applicationTitle={APP_TITLE}
        modeLabel={modeLabel}
        onLogout={handleLogout}
        onSelectFeature={handleSelectFeature}
        runtimeSnapshot={runtimeSnapshot}
        selectedFeature={selectedFeature}
        session={session}
      />
    );
  }

  return (
    <LoginScreen
      applicationTitle={APP_TITLE}
      credentials={demoCredentials}
      errorMessage={errorMessage}
      isSubmitting={isSubmitting || authState === "checking"}
      loadState={loadState}
      loginError={loginError}
      modeLabel={modeLabel}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      onUsernameChange={setUsername}
      password={password}
      runtimeSnapshot={runtimeSnapshot}
      username={username}
    />
  );
}

export default App;
