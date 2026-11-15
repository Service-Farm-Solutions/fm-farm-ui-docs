export default function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-sm font-bold tracking-tight text-white">
          FM
        </span>
        <p className="mt-4 text-base font-semibold text-slate-950">FM Farm</p>
        <p className="mt-1 text-sm text-slate-500">UI documentation</p>
        <div role="status" className="mt-8 flex items-center gap-3 text-sm text-slate-600">
          <span aria-hidden="true" className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent motion-reduce:animate-none" />
          <span>Preparing your session...</span>
        </div>
      </div>
    </main>
  );
}
