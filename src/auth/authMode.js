import { shouldBypassAuth } from "./bypassPolicy";

export const bypassAuth = shouldBypassAuth({
  dev: import.meta.env.DEV,
  production: import.meta.env.PROD,
  flag: import.meta.env.VITE_APP_BYPASS_AUTH,
  hostname: window.location.hostname,
});
