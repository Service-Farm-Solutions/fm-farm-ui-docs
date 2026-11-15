import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MobileNavigation() {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const location = useLocation();

  function closeNavigation() {
    if (dialogRef.current?.open) dialogRef.current.close();
  }

  useEffect(() => {
    closeNavigation();
  }, [location]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    function onResize(event) {
      if (event.matches) closeNavigation();
    }
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, []);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Open documentation navigation"
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
      >
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="mobile-navigation-title"
        onClose={() => triggerRef.current?.focus()}
        className="mobile-navigation fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(20rem,85vw)] max-w-none overflow-y-auto border-0 bg-white p-0 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <h2 id="mobile-navigation-title" className="text-sm font-semibold text-slate-900">Documentation</h2>
          <button type="button" onClick={closeNavigation} aria-label="Close documentation navigation" className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">
            Close
          </button>
        </div>
        <div className="px-5 py-6">
          <Sidebar onNavigate={closeNavigation} />
        </div>
      </dialog>
    </div>
  );
}
