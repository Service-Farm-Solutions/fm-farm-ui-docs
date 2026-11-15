import { Outlet } from "react-router-dom";
import PagesHeader from "./PagesHeader";
import Sidebar from "./Sidebar";
import { useAuthSession } from "../auth/session";
import { bypassAuth } from "../auth/authMode";

export default function ContainerLayout() {
  return (
    <div className="bg-slate-100 min-h-screen">
      <PagesHeader />
      {bypassAuth ? <DocumentationContent /> : <AuthenticatedContent />}
    </div>
  );
}

function DocumentationContent() {
  return (
    <div className="grid grid-cols-12">
      <Sidebar />
      <main className="py-4 px-8 pb-32 col-span-6 overflow-auto mdx">
        <Outlet />
      </main>
      <div className="col-span-3 sticky top-0 h-full flex" />
    </div>
  );
}

function AuthenticatedContent() {
  const { account, busy, signIn } = useAuthSession();
  if (account) return <DocumentationContent />;

  return (
    <>
          <main className="py-4 px-8 pb-32 grid grid-cols-12 overflow-auto mdx">
            <div className=" col-span-6 col-start-4 flex items-center justify-center gap-10">
              <div className="flex-auto border-r-1 px-10">
                <img src={`${import.meta.env.BASE_URL}Login.svg`} alt="Login to FM Farm UI Docs" className="" />
              </div>
              <div className="flex-none">
                <h1 className="text-2xl">FM Farm - UI Docs</h1>
                <div>Usage guide for Rapid Development</div>
                {busy ? <p role="status">Authentication in progress...</p> : null}
                <button onClick={signIn} disabled={busy} aria-busy={busy} className="my-6 flex items-center gap-2 hover:animate-btn rounded-full px-6 py-2 bg-slate-900 shadow-md shadow-slate-900 text-white ">
                  Sign In to Continue <svg className="h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>	
                </button>
              </div>
            </div>
          </main>
    </>
  )
}