import { NavLink, useMatches } from "react-router-dom";
import PropTypes from "prop-types";
import { documentsFor, releasePath } from "../docs/releases";

export default function Sidebar({ onNavigate }) {
  const release = useMatches().find(match => match.handle?.release)?.handle.release;
  return (
    <nav aria-label="Documentation" className="space-y-8">
      {release.pages.map(section => (
        <div key={section.path}>
          <h2 className="mb-3 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase">{section.name}</h2>
          <ul className="space-y-1">
            {documentsFor([section]).map(document => (
              <li key={document.path}>
                <NavLink end onClick={onNavigate} to={releasePath(release.id, document.path)} className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-emerald-50 font-semibold text-emerald-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>
                  {document.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

Sidebar.propTypes = {
  onNavigate: PropTypes.func,
};
