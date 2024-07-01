import { Link, NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {

  const sidebarConfig = [{
    name: "Components",
    path: "/components",
    children: [
      {
        name: "Introduction",
        path: "/introduction",
      },
      {
        name: "Table View",
        path: "/table-view",
      },
      {
        name: "Filters View",
        path: "/filters-view",
      }
    ]
  }]

  return (
    <div className="col-span-3 sticky top-0 pt-6 flex">
      <div className="ml-auto">
        <aside title="Site Navigation">
          <nav aria-labelledby="grid-left" className="w-64 p-4 border-r">
            {sidebarConfig.map((conf, index) => (
              <ul key={index}>
                <h2 className="mt-4 font-semibold text-slate-700">{conf.name}</h2>
                {conf.children.map((child, index) => (
                  <li key={index} className="">
                    <NavLink to={`${conf.path}${child.path}`} className={({ isActive }) =>
                      `block py-2 px-6  my-1 transition-colors border-l hover:border-slate-400 text-slate-500 hover:text-slate-900 ${isActive ? "border-l-black !text-slate-900" : ""}`}>{child.name}</NavLink>
                  </li>
                ))}
              </ul>
            ))}
          </nav>
        </aside>

      </div>
    </div>
  )
}