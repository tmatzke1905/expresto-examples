import featureNavigationData from "../../../../content/features/navigation.json";
import previewAuthData from "../../../../content/preview/auth-session.json";

export type DemoCredentials = {
  hint: string;
  password: string;
  username: string;
};

export type FeatureMenuItem = {
  detail: string;
  id: string;
  package: string;
  status: string;
  summary: string;
  title: string;
};

export type SessionUser = {
  displayName: string;
  role: string;
  username: string;
};

export type SessionState = {
  claims: Record<string, unknown>;
  expiresIn: string;
  features: FeatureMenuItem[];
  issuedAt: string;
  mode: "preview" | "server";
  source: string;
  token: string;
  tokenType: string;
  user: SessionUser;
};

type SessionResponse = Omit<SessionState, "features" | "token">;

const TOKEN_STORAGE_KEY = "expresto-examples.jwt";

export const demoCredentials: DemoCredentials = previewAuthData.demoCredentials;
export const featureMenuItems: FeatureMenuItem[] = featureNavigationData.items;
export const previewSession = previewAuthData.session as SessionState;

function buildBasicAuthorizationHeader(username: string, password: string): string {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

function isPreviewMode(): boolean {
  return window.location.protocol === "file:";
}

function enrichSession(response: SessionResponse, token: string): SessionState {
  return {
    ...response,
    features: featureMenuItems,
    token
  };
}

async function parseApiError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: string };
    if (typeof data.message === "string" && data.message.length > 0) {
      return data.message;
    }
  } catch {
    return response.statusText || `HTTP ${response.status}`;
  }

  return response.statusText || `HTTP ${response.status}`;
}

export function clearStoredToken(): void {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function readStoredToken(): string | null {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function storeToken(token: string): void {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export async function loginWithBasic(username: string, password: string): Promise<SessionState> {
  if (isPreviewMode()) {
    if (
      username !== previewAuthData.demoCredentials.username ||
      password !== previewAuthData.demoCredentials.password
    ) {
      throw new Error("Preview login failed. Please use the displayed demo credentials.");
    }

    return {
      ...previewSession,
      features: featureMenuItems
    };
  }

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
}

export async function verifySession(token: string): Promise<SessionState> {
  if (isPreviewMode()) {
    if (token !== previewSession.token) {
      throw new Error("Preview token mismatch.");
    }

    return {
      ...previewSession,
      features: featureMenuItems
    };
  }

  const response = await fetch("/api/auth/session", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const data = (await response.json()) as SessionResponse;
  return enrichSession(data, token);
}
