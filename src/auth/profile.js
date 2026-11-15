import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { callMsGraph } from "./graph.js";

export async function loadProfile(instance, account, scopes, signal) {
  const response = await instance.acquireTokenSilent({ account, scopes });
  signal.throwIfAborted();
  return callMsGraph(response.accessToken, signal);
}

export function needsReconnect(error) {
  return error instanceof InteractionRequiredAuthError || error.status === 401;
}
