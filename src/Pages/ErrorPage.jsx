import { Link, useRouteError } from "react-router-dom";
import Brand from "../layouts/Brand";

export default function ErrorPage() {
  const error = useRouteError();
  const notFound = error?.status === 404;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 px-5 py-4 sm:px-8">
        <div className="mx-auto max-w-6xl"><Brand /></div>
      </header>
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-6 py-16">
        <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">{notFound ? "404 / Not found" : "Something went wrong"}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {notFound ? "We couldn't find that page." : "We couldn't load this page."}
        </h1>
        <p className="mt-4 max-w-lg leading-7 text-slate-600">
          {notFound ? "Check the address or return to the documentation home." : "Please try again, or return to the documentation home."}
        </p>
        <Link className="mt-8 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800" to="/">Back to home</Link>
      </main>
    </div>
  );
}
