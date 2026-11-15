import { redirect } from "react-router-dom";
import { documentsFor, releasePath } from "./releases.js";

export function createDocumentationRoutes(config, layoutElement, renderDocument, errorElement) {
  const published = config.releases.filter(release => release.published);
  const current = published.find(release => release.id === config.current);
  const sectionPaths = [...new Set(published.flatMap(release => release.pages.map(page => page.path)))];
  return [
    ...published.map(release => {
      const documents = documentsFor(release.pages);
      return {
        path: releasePath(release.id),
        element: layoutElement,
        errorElement,
        handle: { release },
        children: [
          { index: true, loader: () => redirect(releasePath(release.id, documents[0].path)) },
          ...release.pages.map(section => ({
            path: section.path,
            loader: () => redirect(releasePath(release.id,
              documents.find(document => document.path.startsWith(`${section.path}/`)).path)),
          })),
          ...documents.map(document => ({
            path: document.path,
            element: renderDocument(release, document),
            handle: { document },
          })),
        ],
      };
    }),
    ...sectionPaths.map(section => ({
      path: `/${section}/*`,
      loader: ({ request, params }) => {
        const url = new URL(request.url);
        const documentPath = `${section}${params["*"] ? `/${params["*"]}` : ""}`;
        return redirect(`${releasePath(current.id, documentPath)}${url.search}`);
      },
      errorElement,
    })),
  ];
}
