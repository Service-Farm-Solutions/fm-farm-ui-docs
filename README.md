# FM Farm UI Docs

React, Vite, and MDX documentation for FM Farm components and modules.

## Development

Run `npm ci`, copy `.env.example` to `.env`, and supply your Microsoft Entra
application and tenant IDs. Register the example redirect URI as a Single-page
application redirect URI in Entra. Run `npm run dev` and open the
`/fm-farm-ui-docs/` base path printed by Vite.

Run `npm run lint`, `npm test`, and `npm run build` to validate changes. The
same checks run in GitHub Actions for pull requests and pushes to `main`.

### Local development without sign-in

Add `VITE_APP_BYPASS_AUTH=true` to a git-ignored `.env.local` and restart
`npm run dev`. You can then read documentation without Entra configuration.
The bypass requires Vite development mode and a loopback hostname
(`localhost`, `127.0.0.1`, or `::1`). It is disabled by default.

Bypass mode shows "Local development - authentication bypassed", skips MSAL
initialization, and hides profile/sign-out controls. It does not request tokens
or call Microsoft Graph, and does not grant access to protected APIs.
Remove the flag or set it to `false` and restart to use real sign-in.

Production builds, including `npm run preview`, always use authentication,
even on localhost with the flag enabled. A development server accessed through
a LAN address or non-loopback hostname also requires authentication.
Run policy checks with `node --test tests/auth-bypass.test.js`.

## Authentication behavior

Real sign-in uses one selected account throughout documentation access, profile
requests, and sign-out. A successful popup sets the returned account as active.
On reload, a cached active account is retained; a sole cached account is selected
automatically. Multiple cached accounts without an active selection require a
user-initiated Microsoft account-selection popup.

Authentication buttons prevent overlapping actions. Popup cancellation returns
to the normal state; blocked popups and other failures show safe inline feedback.
Profile loading uses silent token acquisition. If interaction is required (or
Graph returns 401), use **Reconnect account** to open a popup explicitly.
Other profile failures show **Retry** without signing out or blocking documents.
There are no automatic retry loops. Requests are cancelled/ignored when the
selected account changes or the profile unmounts.

Run authentication and routing regression checks with `npm test`.

## Release documentation

`src/routes.js` is the release registry. Its `current` field explicitly selects
the current published release; release numbers are not sorted to infer it.
The initial documentation snapshot is **25.0**.

- Pinned pages use `/fm-farm-ui-docs/releases/25.0/modules/job-report`.
- Existing links such as `/fm-farm-ui-docs/modules/job-report` redirect to the
  same document in the current release.
- Section roots redirect to their first document.
- The header selector lists only published releases and preserves the document,
  query string, and anchor when switching. A release without that document is
  disabled and labeled "page unavailable"; there is no fallback to another release's content.
- Unknown releases and documents return the application's not-found page.
- Published documentation remains behind the existing Microsoft sign-in gate,
  except for the explicitly enabled local development bypass described above.
  Unpublished releases are excluded from routes and the selector; this is not an
  access-control mechanism, so do not include confidential drafts in a public build.

### Editing and adding releases

Each release has a self-contained folder at `src/Pages/releases/<release>/`.
Its `pages.js` defines section names, URL paths, document titles, and exact
case-sensitive MDX filenames. Routes and sidebar links use this same manifest.
Nested entries can have `children`; each document is rendered as a complete page,
so MDX files do not need an `Outlet`.

To prepare a release manually:

1. Copy the preceding release folder, including unchanged documentation, into a
   new folder such as `26.0`. Edit only the content affected by the new release.
2. Import its `pages.js` in `src/routes.js` and add
   `{ id: "26.0", published: false, pages: pages26 }` to `releases`.
3. When the documentation matches the shipped application, set `published: true`
   and change `current` to `"26.0"` in a reviewed PR. Record the corresponding
   application commit or tag in the release's documentation for traceability.

Keep older snapshots accurate for their releases. Do not replace their content
with current behavior. There is no snapshot-generation command.

`npm run build` validates that the current release exists and is published,
release IDs and document URLs are unique, and every referenced MDX file exists
with exact casing (including unpublished snapshots). Run routing checks with
`node --test tests/docs-releases.test.js`.

## Deployment

Run `npm run build` and deploy `dist`. The base path is set in `vite.config.js`.
The host must serve `index.html` for application URLs under that base path so
direct links and refreshes work, including `/releases/25.0/...`.
Static hosts without history fallback need an appropriate rewrite/fallback setup.
