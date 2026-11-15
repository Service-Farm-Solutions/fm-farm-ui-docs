import { useEffect, useState } from "react";
import { InteractionStatus } from "@azure/msal-browser";
import { CircularProgress } from "@heroui/progress";
import { loginRequest } from "../auth/authConfig";
import { useAuthSession } from "../auth/session";
import { loadProfile, needsReconnect } from "../auth/profile";

export default function UserProfile() {
  const { instance, account, inProgress, busy, reconnect } = useAuthSession();
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(null);

  useEffect(() => {
    if (!account || inProgress !== InteractionStatus.None) return;
    const controller = new AbortController();
    setState({ account, loading: true });
    loadProfile(instance, account, loginRequest.scopes, controller.signal).then(
      profile => {
        if (!controller.signal.aborted) setState({ account, profile });
      },
      error => {
        if (!controller.signal.aborted) setState({ account, error });
      },
    );
    return () => controller.abort();
  }, [instance, account, inProgress, attempt]);

  if (!account) return null;
  const current = state?.account === account ? state : null;
  if (!current || current.loading) {
    return <CircularProgress size="sm" aria-label="Loading user details" />;
  }
  if (current.error) {
    const reconnectRequired = needsReconnect(current.error);
    return (
      <div className="flex items-center gap-2 text-sm">
        <span role="status">{reconnectRequired ? "Account reconnection required." : "Profile unavailable."}</span>
        <button className="underline" disabled={busy} onClick={async () => {
          if (reconnectRequired) {
            if (await reconnect()) setAttempt(value => value + 1);
          }
          else setAttempt(value => value + 1);
        }}>{reconnectRequired ? "Reconnect account" : "Retry"}</button>
      </div>
    );
  }
  const name = [current.profile.givenName, current.profile.surname].filter(Boolean).join(" ") ||
    current.profile.displayName || account.name || account.username;
  return <div className="flex gap-1 mr-2 items-center">Hi{name ? `, ${name}` : ""}!</div>;
}
