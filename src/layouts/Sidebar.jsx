import { NavLink, useMatches } from "react-router-dom";
import { documentsFor, releasePath } from "../docs/releases";

export default function Sidebar() {
  const release = useMatches().find(match => match.handle?.release)?.handle.release;
  return (
    <div className="col-span-3 sticky top-0 pt-6 flex">
      <div className="ml-auto">
        <aside title="Site Navigation">
          <nav aria-label="Documentation" className="w-64 p-4 border-r">
            {release.pages.map(section => (
              <div key={section.path}>
                <h2 className="mt-4 font-semibold text-slate-700">{section.name}</h2>
                <ul>
                  {documentsFor([section]).map(document => (
                    <li key={document.path}>
                      <NavLink end to={releasePath(release.id, document.path)} className={({ isActive }) =>
                        `block py-2 px-6 my-1 transition-colors border-l hover:border-slate-400 text-slate-500 hover:text-slate-900 ${isActive ? "border-l-black !text-slate-900" : ""}`}>
                        {document.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
