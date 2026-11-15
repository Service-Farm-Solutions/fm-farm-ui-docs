import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import { useEffect, useRef } from "react";
import PagesHeader from "./PagesHeader";
import Sidebar from "./Sidebar";
import { useAuthSession } from "../auth/session";
import { bypassAuth } from "../auth/authMode";
import DocumentNavigation from "./DocumentNavigation";
import PageTableOfContents from "./PageTableOfContents";

export default function ContainerLayout() {
  return bypassAuth ? <DocumentationLayout /> : <AuthenticatedLayout />;
}

function DocumentationLayout() {
  const articleRef = useRef(null);
  const mainRef = useRef(null);
  const { pathname, hash, state } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "POP" && !hash) {
      window.scrollTo(0, 0);
      if (state?.focusDocument) mainRef.current.focus({ preventScroll: true });
    }
  }, [pathname, hash, navigationType, state]);

  return (
    <div className="min-h-screen bg-white">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <PagesHeader showNavigation />
      <div className="mx-auto flex max-w-screen-2xl">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 px-5 py-8 lg:block xl:w-72">
          <div className="docs-sidebar">
            <Sidebar />
          </div>
        </aside>
        <main ref={mainRef} id="main-content" tabIndex="-1" className="min-w-0 flex-1 px-5 py-10 sm:px-8 sm:py-14 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-6xl xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:items-start xl:gap-10">
            <PageTableOfContents articleRef={articleRef} />
            <div className="min-w-0 xl:col-start-1 xl:row-start-1">
              <article ref={articleRef} className="mdx mx-auto max-w-3xl">
                <Outlet />
              </article>
              <div className="mx-auto max-w-3xl">
                <DocumentNavigation />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function AuthenticatedLayout() {
  const { account, busy, signIn } = useAuthSession();
  if (account) return <DocumentationLayout />;

  return (
    <div className="min-h-screen bg-slate-50">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <PagesHeader />
      <main id="main-content" tabIndex="-1" className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-5xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-16">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">FM Farm documentation</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Sign in to continue</h1>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Access the component and module guides for your FM Farm release.
          </p>
          {busy ? <p role="status" className="mt-5 text-sm text-slate-600">Authentication in progress...</p> : null}
          <button onClick={signIn} disabled={busy} aria-busy={busy} className="mt-7 inline-flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">
            Sign in with Microsoft <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="hidden rounded-3xl border border-slate-200 bg-white p-8 md:block">
          <img src={`${import.meta.env.BASE_URL}Login.svg`} alt="" className="mx-auto w-full max-w-sm" />
        </div>
      </main>
    </div>
  );
}
