import test from "node:test";
import assert from "node:assert/strict";
import { evaluate } from "@mdx-js/mdx";
import { createElement } from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import remarkHeadings from "../src/docs/remarkHeadings.js";
import { documentNeighbors, releasePath } from "../src/docs/releases.js";

test("MDX headings get stable, unique links and readable table-of-contents labels", async () => {
  const { default: Document } = await evaluate(
    "# Title\n\n## Setup *guide*\n\n### Setup `guide`\n\n## Setup guide\n\n## Main content\n\n## Café\n\n## !!!\n\n## ???",
    { ...jsxRuntime, remarkPlugins: [remarkHeadings] },
  );
  const html = renderToStaticMarkup(createElement(Document));
  assert.match(html, /id="setup-guide" tabindex="-1" data-toc-label="Setup guide"/);
  assert.match(html, /id="setup-guide-1" tabindex="-1" data-toc-label="Setup guide"/);
  assert.match(html, /id="setup-guide-2" tabindex="-1" data-toc-label="Setup guide"/);
  assert.match(html, /id="main-content-1"/);
  assert.match(html, /id="café"/);
  assert.match(html, /id="section"/);
  assert.match(html, /id="section-1"/);
  assert.match(html, /href="#setup-guide"[^>]*aria-label="Link to Setup guide"/);
});

test("dynamic MDX headings do not expose expression source as their label", async () => {
  const { default: Document } = await evaluate(
    'export const product = "FM Farm"\n\n## Using {product}',
    { ...jsxRuntime, remarkPlugins: [remarkHeadings] },
  );
  const html = renderToStaticMarkup(createElement(Document));
  assert.match(html, /id="using-product" tabindex="-1">Using FM Farm/);
  assert.match(html, /aria-label="Link to this heading"/);
  assert.doesNotMatch(html, /data-toc-label=/);
});

test("adjacent documents follow manifest order within the selected release", () => {
  const release = {
    id: "24.0",
    pages: [
      { path: "components", children: [
        { path: "start", name: "Start", mdx: "Start" },
        { path: "view", name: "View", mdx: "View", children: [
          { path: "details", name: "Details", mdx: "Details" },
        ] },
      ] },
      { path: "modules", children: [{ path: "intro", name: "Modules", mdx: "Modules" }] },
    ],
  };
  const first = documentNeighbors(release, "components/start");
  assert.equal(first.previous, null);
  assert.equal(releasePath(release.id, first.next.path), "/releases/24.0/components/view");
  const nested = documentNeighbors(release, "components/view/details");
  assert.equal(nested.previous.path, "components/view");
  assert.equal(nested.next.path, "modules/intro");
  assert.equal(documentNeighbors(release, "modules/intro").next, null);
  assert.deepEqual(documentNeighbors(release, "unknown"), { previous: null, next: null });
});
