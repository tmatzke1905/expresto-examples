export const demoCredentials = {
  password: "showcase-2026!",
  username: "demo"
} as const;

export const demoJwtConfig = {
  algorithm: "HS256",
  expiresIn: "1h",
  secret: "expresto_examples_runtime_secret_2026_live_auth"
} as const;

export const demoUserProfile = {
  displayName: "Demo User",
  role: "demo-admin"
} as const;

export function createJwtClaims(username: string): Record<string, unknown> {
  return {
    auth: "jwt",
    displayName: demoUserProfile.displayName,
    mode: "server",
    role: demoUserProfile.role,
    scope: [
      "examples:read",
      "examples:preview",
      "examples:navigate"
    ],
    sub: username,
    username
  };
}

export function normalizeSessionUser(user: Record<string, unknown> | undefined): {
  displayName: string;
  role: string;
  username: string;
} {
  const username = typeof user?.username === "string" ? user.username : demoCredentials.username;
  const role = typeof user?.role === "string" ? user.role : demoUserProfile.role;
  const displayName =
    typeof user?.displayName === "string" ? user.displayName : demoUserProfile.displayName;

  return {
    displayName,
    role,
    username
  };
}
