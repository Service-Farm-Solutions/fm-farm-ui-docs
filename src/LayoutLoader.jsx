import { lazy, Suspense } from "react";
import releases from "./routes";
import { documentKey, validateReleases } from "./docs/releases";

const documents = import.meta.glob("./Pages/releases/**/*.mdx");
validateReleases(releases, Object.keys(documents));
const lazyDocuments = Object.fromEntries(
  Object.entries(documents).map(([key, load]) => [key, lazy(load)]),
);

export function loadDocument(release, document) {
  const Document = lazyDocuments[documentKey(release.id, document.dir, document.mdx)];
  return (
    <Suspense fallback="Loading...">
      <Document />
    </Suspense>
  );
}
