import { useEffect, useRef, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { EventType, InteractionStatus } from "@azure/msal-browser";
import App from "../App";
import { loginRequest } from "./authConfig";
import { AuthSessionContext } from "./session";
import { authErrorMessage, selectAccount } from "./accountPolicy";

export default function SessionApp() {
  const { instance, accounts, inProgress } = useMsal();
  const [, refresh] = useState(0);
  const [operation, setOperation] = useState(null);
  const [error, setError] = useState(null);
  const locked = useRef(false);
  const account = selectAccount(accounts, instance.getActiveAccount());
  const busy = operation !== null || inProgress !== InteractionStatus.None;

  useEffect(() => {
    const id = instance.addEventCallback(event => {
      if (event.eventType === EventType.ACTIVE_ACCOUNT_CHANGED) refresh(value => value + 1);
      if (event.eventType === EventType.LOGIN_FAILURE) {
        setError(authErrorMessage(event.error ?? {}, "signIn"));
      }
    });
    return () => { if (id) instance.removeEventCallback(id); };
  }, [instance]);

  useEffect(() => {
    const active = instance.getActiveAccount();
    if (inProgress === InteractionStatus.None &&
      (active?.homeAccountId !== account?.homeAccountId ||
        active?.localAccountId !== account?.localAccountId ||
        active?.tenantId !== account?.tenantId)) {
      instance.setActiveAccount(account);
    }
  }, [instance, account, inProgress]);

  async function run(action) {
    if (locked.current || busy) return;
    locked.current = true;
    setOperation(action);
    setError(null);
    try {
      if (action === "signOut") {
        if (!account) throw new Error("No selected account");
        await instance.logoutRedirect({
          account,
          postLogoutRedirectUri: new URL(`${import.meta.env.BASE_URL}logout`, window.location.origin).href,
        });
      } else {
        if (action === "reconnect" && !account) throw new Error("No selected account");
        const result = action === "reconnect"
          ? await instance.acquireTokenPopup({ ...loginRequest, account })
          : await instance.loginPopup({
            ...loginRequest,
            ...(!account && accounts.length > 1 ? { prompt: "select_account" } : {}),
          });
        if (!result.account) throw new Error("Authentication returned no account");
        instance.setActiveAccount(result.account);
        refresh(value => value + 1);
      }
      return true;
    } catch (failure) {
      setError(authErrorMessage(failure, action));
      return false;
    } finally {
      locked.current = false;
      setOperation(null);
    }
  }

  return (
    <AuthSessionContext.Provider value={{
      account, instance, inProgress, busy, operation, error,
      signIn: () => run("signIn"),
      signOut: () => run("signOut"),
      reconnect: () => run("reconnect"),
    }}>
      <App />
    </AuthSessionContext.Provider>
  );
}
