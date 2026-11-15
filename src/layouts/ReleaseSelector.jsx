import { useLocation, useMatches, useNavigate } from "react-router-dom";
import releases from "../routes";
import { releasePath, releaseTarget } from "../docs/releases";

export default function ReleaseSelector() {
  const release = useMatches().find(match => match.handle?.release)?.handle.release;
  const location = useLocation();
  const navigate = useNavigate();
  if (!release) return null;

  const documentPath = location.pathname.slice(releasePath(release.id).length + 1).replace(/\/$/, "");
  const options = releases.releases.filter(item => item.published).map(item => ({
    ...item,
    target: releaseTarget(item, documentPath),
  }));

  return (
    <label className="flex items-center gap-2 text-sm">
      Release
      <select
        className="rounded border border-slate-300 bg-white px-2 py-1 text-slate-900"
        value={release.id}
        onChange={event => {
          const option = options.find(item => item.id === event.target.value);
          if (option?.target) navigate(`${option.target}${location.search}${location.hash}`);
        }}
      >
        {options.map(option => (
          <option key={option.id} value={option.id} disabled={!option.target}>
            {option.id}{option.id === releases.current ? " (Current)" : ""}
            {!option.target ? " - page unavailable" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
