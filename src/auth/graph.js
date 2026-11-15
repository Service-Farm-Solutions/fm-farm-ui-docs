export class GraphError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "GraphError";
    this.status = status;
  }
}

export async function callMsGraph(accessToken, signal) {
  const response = await fetch("https://graph.microsoft.com/v1.0/me?$select=id,displayName,givenName,surname", {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal,
  });
  if (!response.ok) {
    throw new GraphError("Microsoft Graph profile request failed", response.status);
  }
  let profile;
  try {
    profile = await response.json();
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new GraphError("Microsoft Graph returned invalid JSON", response.status);
  }
  if (!profile || typeof profile !== "object" || typeof profile.id !== "string" || !profile.id ||
    ["displayName", "givenName", "surname"].some(key => profile[key] != null && typeof profile[key] !== "string")) {
    throw new GraphError("Microsoft Graph returned an invalid profile", response.status);
  }
  return profile;
}
