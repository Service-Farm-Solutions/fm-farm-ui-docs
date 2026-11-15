import { Link } from "react-router-dom";
import Brand from "../layouts/Brand";

const sections = [
  {
    to: "/components/introduction",
    title: "Components",
    number: "01",
    description: "Explore the building blocks and dynamic views used across FM Farm.",
  },
  {
    to: "/modules/introduction",
    title: "Modules",
    number: "02",
    description: "Find release-specific documentation for FM Farm modules.",
  },
];

export default function Root() {
  return (
    <div className="min-h-screen bg-white">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Brand />
          <a href="https://service.farm/fm-farm/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-500 hover:text-emerald-700">
            FM Farm <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </header>
      <main id="main-content" tabIndex="-1" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="max-w-3xl pt-20 pb-14 sm:pt-28 sm:pb-20">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">FM Farm documentation</p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Build with clarity and consistency.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Guides to the components and modules that make up FM Farm, organized by application release.
          </p>
        </div>
        <section aria-labelledby="explore-title" className="border-t border-slate-200 pt-8">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="explore-title" className="text-lg font-semibold text-slate-950">Explore the docs</h2>
            <span className="text-xs font-medium tracking-wide text-slate-400 uppercase">Getting started</span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {sections.map(section => (
              <Link key={section.to} to={section.to} className="group flex min-h-48 flex-col rounded-2xl border border-slate-200 p-6 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40">
                <span className="text-xs font-semibold tracking-wider text-emerald-700">{section.number} / GUIDE</span>
                <span className="mt-7 flex items-center justify-between text-xl font-semibold text-slate-950">
                  {section.title}<span aria-hidden="true" className="text-slate-400 group-hover:text-emerald-700">→</span>
                </span>
                <span className="mt-2 text-sm leading-6 text-slate-600">{section.description}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
