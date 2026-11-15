import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./authConfig";
import SessionApp from "./SessionApp";

const msalInstance = new PublicClientApplication(msalConfig);

export default function AuthenticatedApp() {
  return (
    <MsalProvider instance={msalInstance}>
      <SessionApp />
    </MsalProvider>
  );
}
