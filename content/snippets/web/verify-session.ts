export async function verifySession(token: string): Promise<SessionState> {
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
