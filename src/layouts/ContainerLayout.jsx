import { Outlet } from "react-router-dom";
import PagesHeader from "./PagesHeader";
import Sidebar from "./Sidebar";

export default function ContainerLayout () {
  return (
    <>
      <div className="bg-slate-100 min-h-screen">
        <PagesHeader />
        <div className="grid grid-cols-12">
          <Sidebar />
          <main className="py-4 px-8 pb-32 col-span-6 overflow-auto mdx">
            <Outlet />
          </main>
          <div className="col-span-3 sticky top-0 h-full flex">
          </div>
        </div>
      </div>
    </>
  )
}