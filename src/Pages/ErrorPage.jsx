import { Link, useRouteError } from "react-router-dom"
import PagesHeader from "../layouts/PagesHeader";

export default function ErrorPage() {

  const error = useRouteError();

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <div className="flex-none">
        <PagesHeader />
      </div>
      <div className="grid grid-cols-12 flex-1">
        <main className="py-4 px-8 pb-32 col-span-12 flex items-center justify-center flex-col">
          {error && error.status === 404 ? (
            <img src={`${import.meta.env.BASE_URL}404Error.svg`} className="h-96" alt="Page Not Found!" />
          ) : (
            <img src={`${import.meta.env.BASE_URL}500Error.svg`} className="h-96" alt="Unhandled Error!" />
          )}
          <div className="text-center">
            <div>Sorry, we are unable to load this page.</div>
            <Link className="underline text-blue-600" to="/">Back to Home</Link>
          </div>
        </main>
      </div>
    </div>
  )
}
