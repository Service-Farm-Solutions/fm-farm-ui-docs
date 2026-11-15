import { useAuthSession } from "../auth/session";
import { useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import UserProfile from "./UserProfile";
import ReleaseSelector from "./ReleaseSelector";
import { bypassAuth } from "../auth/authMode";
import Brand from "./Brand";
import MobileNavigation from "./MobileNavigation";

function AccountControls() {
  const { account, busy, operation, error, signOut } = useAuthSession();

  return (
    <>
      {account ? (
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-2 text-sm text-slate-600">
          <UserProfile />
          <button disabled={busy} aria-busy={operation === "signOut"} className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50" onClick={signOut}>
            {operation === "signOut" ? "Signing out..." : "Sign out"}
          </button>
        </div>
      ) : null}
      {error ? <span role="alert" className="min-w-0 max-w-full text-sm text-red-700 [overflow-wrap:anywhere]">{error}</span> : null}
    </>
  );
}

export default function PagesHeader({ showNavigation = false }) {
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const container = header.parentElement;
    const updateHeight = () => {
      container.style.setProperty("--docs-header-height", `${header.offsetHeight}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => {
      observer.disconnect();
      container.style.removeProperty("--docs-header-height");
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {showNavigation ? <MobileNavigation /> : null}
          <Brand />
        </div>
        <div className="flex min-w-0 max-w-full flex-wrap items-center justify-end gap-x-4 gap-y-2">
          <ReleaseSelector />
          {bypassAuth ? (
            <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
              Local development - authentication bypassed
            </span>
          ) : <AccountControls />}
          <a className="hidden text-sm font-medium text-slate-500 hover:text-emerald-700 sm:inline-flex" href="https://service.farm/fm-farm/" target="_blank" rel="noopener noreferrer">
            FM Farm <span aria-hidden="true" className="ml-1">↗</span><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </header>
  );
}

PagesHeader.propTypes = {
  showNavigation: PropTypes.bool,
};
