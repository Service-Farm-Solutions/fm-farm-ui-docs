import { Link } from "react-router-dom";

export default function Brand() {
  return (
    <Link to="/" className="inline-flex min-w-0 items-center gap-3 rounded-sm text-slate-950">
      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-xs font-bold tracking-tight text-white">
        FM
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-semibold">FM Farm</span>
        <span className="block text-xs text-slate-500">UI documentation</span>
      </span>
    </Link>
  );
}
