import { Link, useMatches } from "react-router-dom";
import { documentNeighbors, releasePath } from "../docs/releases";

export default function DocumentNavigation() {
  const matches = useMatches();
  const release = matches.find(match => match.handle?.release)?.handle.release;
  const document = matches.find(match => match.handle?.document)?.handle.document;
  if (!release || !document) return null;

  const { previous, next } = documentNeighbors(release, document.path);
  if (!previous && !next) return null;
  const label = item => `${release.pages.find(section => item.path === section.path || item.path.startsWith(`${section.path}/`)).name} / ${item.name}`;

  return (
    <nav aria-label="Adjacent documentation pages" className="mt-14 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2">
      {previous ? (
        <Link rel="prev" to={releasePath(release.id, previous.path)} state={{ focusDocument: true }} className="rounded-xl border border-slate-200 p-4 hover:border-emerald-300 hover:bg-emerald-50/40">
          <span className="block text-xs font-medium text-slate-500">Previous</span>
          <span className="mt-1 block text-sm font-semibold text-slate-900">{label(previous)}</span>
        </Link>
      ) : <span aria-hidden="true" className="hidden sm:block" />}
      {next ? (
        <Link rel="next" to={releasePath(release.id, next.path)} state={{ focusDocument: true }} className="rounded-xl border border-slate-200 p-4 text-right hover:border-emerald-300 hover:bg-emerald-50/40">
          <span className="block text-xs font-medium text-slate-500">Next</span>
          <span className="mt-1 block text-sm font-semibold text-slate-900">{label(next)}</span>
        </Link>
      ) : null}
    </nav>
  );
}
