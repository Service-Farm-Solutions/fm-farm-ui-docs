export function releasePath(id, documentPath = "") {
  return `/releases/${id}${documentPath ? `/${documentPath}` : ""}`;
}

export function documentKey(id, dir, mdx) {
  return `./Pages/releases/${id}/${dir}/${mdx}.mdx`;
}

// Flatten nested document groups so MDX pages never need a routing Outlet.
export function documentsFor(pages) {
  function visit(nodes, parent, dir) {
    return nodes.flatMap(node => {
      const path = parent ? `${parent}/${node.path}` : node.path;
      const directory = node.dir ?? dir;
      return [
        ...(node.mdx ? [{ ...node, path, dir: directory }] : []),
        ...visit(node.children ?? [], path, directory),
      ];
    });
  }
  return visit(pages, "", undefined);
}

export function validateReleases(config, availableDocuments) {
  const ids = new Set();
  for (const release of config.releases) {
    if (!/^\d+\.\d+$/.test(release.id) || ids.has(release.id)) {
      throw new Error(`Invalid or duplicate documentation release: ${release.id}`);
    }
    ids.add(release.id);
    const documents = documentsFor(release.pages);
    if (!documents.length) {
      throw new Error(`Documentation release ${release.id} has no pages`);
    }
    const paths = new Set();
    for (const document of documents) {
      if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(document.path) || paths.has(document.path)) {
        throw new Error(`Invalid or duplicate documentation path: ${release.id}/${document.path}`);
      }
      paths.add(document.path);
      const key = documentKey(release.id, document.dir, document.mdx);
      if (!availableDocuments.includes(key)) {
        throw new Error(`Missing documentation file (case-sensitive): ${key}`);
      }
    }
    for (const section of release.pages) {
      if (!documents.some(document => document.path.startsWith(`${section.path}/`))) {
        throw new Error(`Documentation section ${release.id}/${section.path} has no pages`);
      }
    }
  }
  if (!config.releases.some(release => release.id === config.current && release.published)) {
    throw new Error(`Current documentation release must exist and be published: ${config.current}`);
  }
}

export function releaseTarget(release, documentPath) {
  return documentsFor(release.pages).some(document => document.path === documentPath)
    ? releasePath(release.id, documentPath)
    : null;
}

export function documentNeighbors(release, documentPath) {
  const documents = documentsFor(release.pages);
  const index = documents.findIndex(document => document.path === documentPath);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: documents[index - 1] ?? null,
    next: documents[index + 1] ?? null,
  };
}
