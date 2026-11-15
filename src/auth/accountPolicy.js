export function selectAccount(accounts, active) {
  const cached = active && accounts.find(account =>
    account.homeAccountId === active.homeAccountId &&
    account.localAccountId === active.localAccountId &&
    account.tenantId === active.tenantId);
  return cached || (accounts.length === 1 ? accounts[0] : null);
}

export function authErrorMessage(error, action) {
  if (error?.errorCode === "user_cancelled") return null;
  if (error?.errorCode === "popup_window_error" || error?.errorCode === "empty_window_error") {
    return "The sign-in popup could not open. Allow popups for this site and try again.";
  }
  if (error?.errorCode === "interaction_in_progress") {
    return "Another authentication action is in progress. Wait for it to finish and try again.";
  }
  if (action === "signOut") return "Sign-out failed. Your session may still be active. Please try again.";
  if (action === "reconnect") return "Account reconnection failed. Please try again.";
  return "Sign-in failed. Please try again.";
}
