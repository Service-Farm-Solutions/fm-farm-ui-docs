import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { createMemoryRouter } from "react-router-dom";
import registry from "../src/routes.js";
import { documentKey, documentsFor, releasePath, releaseTarget, validateReleases } from "../src/docs/releases.js";
import { createDocumentationRoutes } from "../src/docs/routing.js";

const pages = [
  {
    path: "modules", name: "Modules", dir: "Modules",
    children: [
      { path: "introduction", name: "Introduction", mdx: "Introduction" },
      {
        path: "calendar", name: "Calendar", mdx: "Calendar",
        children: [{ path: "configuration", name: "Configuration", mdx: "CalendarConfiguration" }],
      },
    ],
  },
];
const config = {
  current: "25.0",
  releases: [
    { id: "24.0", published: true, pages },
    { id: "25.0", published: true, pages },
    { id: "26.0", published: false, pages },
  ],
};
const available = config.releases.flatMap(release =>
  documentsFor(release.pages).map(document => documentKey(release.id, document.dir, document.mdx)));

async function open(t, path, registry = config) {
  const router = createMemoryRouter(
    [
      ...createDocumentationRoutes(registry, "layout", (release, document) => `${release.id}:${document.mdx}`, "error"),
      { path: "*", loader: () => { throw new Response("Page not found", { status: 404 }); }, errorElement: "error" },
    ],
    { basename: "/fm-farm-ui-docs", initialEntries: [`/fm-farm-ui-docs${path}`] },
  );
  t.after(() => router.dispose());
  if (!router.state.initialized || router.state.navigation.state !== "idle") {
    await new Promise(resolve => {
      const unsubscribe = router.subscribe(state => {
        if (state.initialized && state.navigation.state === "idle") {
          unsubscribe();
          resolve();
        }
      });
    });
  }
  return router;
}

test("the real 25.0 snapshot has all exact-case files and no old module version", () => {
  const files = readdirSync(new URL("../src/Pages/releases/", import.meta.url), { recursive: true })
    .filter(file => file.endsWith(".mdx"))
    .map(file => `./Pages/releases/${file.replaceAll("\\", "/")}`);
  validateReleases(registry, files);
  assert.equal(registry.current, "25.0");
  assert.equal(documentsFor(registry.releases[0].pages).length, 5);
  assert.ok(!files.some(file => file.includes("2.1.0")));
});

test("current must be a published release, not merely the highest number", () => {
  assert.doesNotThrow(() => validateReleases(config, available));
  for (const current of ["26.0", "99.0"]) {
    assert.throws(() => validateReleases({ ...config, current }, available), /must exist and be published/);
  }
});

test("missing and incorrectly cased MDX files are rejected, even in unpublished releases", () => {
  assert.throws(() => validateReleases(config, available.slice(0, -1)), /Missing documentation file/);
  assert.throws(() => validateReleases(config, available.map(key => key.replace("Calendar.mdx", "calendar.mdx"))),
    /case-sensitive/);
});

test("duplicate releases, duplicate URLs and empty snapshots are rejected", () => {
  assert.throws(() => validateReleases({ ...config, releases: [...config.releases, config.releases[0]] }, available),
    /duplicate documentation release/);
  const duplicate = { ...config.releases[1], pages: [...pages, ...pages] };
  assert.throws(() => validateReleases({ ...config, releases: [duplicate] }, available), /duplicate documentation path/);
  assert.throws(() => validateReleases({ ...config, releases: [{ ...duplicate, pages: [] }] }, available), /has no pages/);
});

test("nested documents are discovered without requiring an MDX Outlet", () => {
  assert.deepEqual(documentsFor(pages).map(document => document.path), [
    "modules/introduction", "modules/calendar", "modules/calendar/configuration",
  ]);
});

test("legacy document links redirect to current release and preserve query parameters", async t => {
  const router = await open(t, "/modules/calendar?example=weekly");
  assert.equal(router.state.location.pathname, "/fm-farm-ui-docs/releases/25.0/modules/calendar");
  assert.equal(router.state.location.search, "?example=weekly");
  assert.equal(router.state.errors, null);
});

test("legacy section roots redirect to the current section introduction", async t => {
  for (const path of ["/modules", "/modules/"]) {
    const router = await open(t, path);
    assert.equal(router.state.location.pathname, "/fm-farm-ui-docs/releases/25.0/modules/introduction");
    assert.equal(router.state.errors, null);
  }
});

test("pinned older release links remain on the requested release", async t => {
  const router = await open(t, "/releases/24.0/modules/calendar");
  assert.equal(router.state.location.pathname, "/fm-farm-ui-docs/releases/24.0/modules/calendar");
  assert.equal(router.state.matches.at(-1).route.element, "24.0:Calendar");
});

test("nested document routes render independently of their parent content", async t => {
  const router = await open(t, "/releases/25.0/modules/calendar/configuration");
  assert.equal(router.state.matches.at(-1).route.element, "25.0:CalendarConfiguration");
  assert.equal(router.state.errors, null);
});

test("release and section roots redirect to a document in that release", async t => {
  for (const path of ["/releases/24.0", "/releases/24.0/modules"]) {
    const router = await open(t, path);
    assert.equal(router.state.location.pathname, "/fm-farm-ui-docs/releases/24.0/modules/introduction");
  }
});

test("unknown and unpublished releases and missing documents are not served", async t => {
  for (const path of [
    "/releases/99.0/modules/calendar",
    "/releases/26.0/modules/calendar",
    "/releases/24.0/modules/missing",
    "/modules/missing",
  ]) {
    const router = await open(t, path);
    assert.equal(Object.values(router.state.errors)[0].status, 404);
  }
});

test("changing current moves legacy links but never pinned URLs", async t => {
  const updated = { ...config, current: "26.0", releases: config.releases.map(release => ({ ...release, published: true })) };
  const legacy = await open(t, "/modules/calendar", updated);
  assert.equal(legacy.state.location.pathname, "/fm-farm-ui-docs/releases/26.0/modules/calendar");
  const pinned = await open(t, "/releases/25.0/modules/calendar", updated);
  assert.equal(pinned.state.matches.at(-1).route.element, "25.0:Calendar");
});

test("selector targets preserve document paths and flag missing documents", () => {
  assert.equal(releaseTarget(config.releases[0], "modules/calendar"), releasePath("24.0", "modules/calendar"));
  assert.equal(releaseTarget(config.releases[0], "modules/calendar/configuration"),
    "/releases/24.0/modules/calendar/configuration");
  assert.equal(releaseTarget(config.releases[0], "modules/new-feature"), null);
});
