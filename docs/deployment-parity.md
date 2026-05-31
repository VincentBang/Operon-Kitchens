# Deployment Parity Check

Last checked: 2026-05-31

This note documents the local build state for Operon Kitchens and the likely causes when the live site does not match the local app.

## Kitchen-only build settings

The Operon Kitchens repository contains its own `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `out`
- Node version: `22`
- Build database mode: `OPERON_KITCHENS_BUILD_DB=memory`
- Next output mode: `output: 'export'`

The local `.nvmrc` also pins Node `22`.

The public Netlify deployment is now configured as a static export. This avoids the Netlify serverless runtime for public pages, which removes the SQLite/server-function path that caused the live Internal Server Error. Admin, account and database-backed API functionality are intentionally not active on this public static deployment.

## Local route status

The latest local build completed successfully with 107 generated pages exported to `out/`. These routes are included in the successful build output:

- `/`
- `/how-it-works`
- `/quote-review-service`
- `/site-measure`
- `/design-specification-package`
- `/request-review`
- `/contact`
- `/faqs`
- `/quote`
- `/quote/review`
- `/privacy`
- `/terms`
- `/areas`
- `/areas/[slug]`
- key service and guide pages
- `/deploy-check`
- `/admin/faqs` as a static noindex admin-disabled notice

This means the previous Netlify `/admin/faqs` page-data failure and the reported live `/faqs` 500 are not reproducible from the current local kitchen source. Netlify should publish static HTML from `out/` for the customer-facing app.

## Local production smoke check

The built app was served locally with `next start` and these routes returned `200`:

- `/`
- `/quote`
- `/quote/review`
- `/quote/test-route-check`
- `/faqs`
- `/privacy`
- `/terms`
- `/areas`
- `/areas/mosman`
- `/kitchen-renovation-cost-sydney`
- `/kitchen-quote-sydney`
- `/kitchen-quote-review`
- `/full-kitchen-renovation-sydney`
- `/small-kitchen-renovation-sydney`
- `/luxury-kitchen-renovation-sydney`
- `/apartment-kitchen-renovation-sydney`
- `/kitchen-pc-sums-and-provisional-sums`
- `/kitchen-benchtop-options-after-engineered-stone-ban`
- `/design`
- `/advice`
- `/how-it-works`
- `/quote-review-service`
- `/site-measure`
- `/design-specification-package`
- `/request-review`
- `/contact`

On 2026-05-31, the same local smoke check also confirmed these visible page details:

- `/` renders the H1 `Clear kitchen renovation estimates for Sydney homes — before the site visit.`
- `/faqs` renders `200` with the FAQ page H1.
- The local footer sentence includes the required spacing: `brand. Planning guidance only.`
- The local chatbot launcher reads `Need help with scope? Ask Operon`.

## Live deployment mismatch checks for Vincent

`https://operonkitchens.netlify.app` was checked for `/`, `/quote`, `/quote/review`, `/faqs`, `/privacy`, `/terms` and `/areas`. The homepage returned plain HTTP `500` while static Next.js chunks returned HTTP `200`, and the local built app returned `200` for the same route group.

That means the current live deploy does not match the local production build result, or the deployed environment is failing before rendering public pages. Because Netlify UI settings and published deploy selection live outside `/Users/daibang/Documents/operon-kitchens`, they require Vincent to check manually.

The kitchen-only SQLite scaffold is intentionally memory-backed during Netlify/serverless runtime. If Netlify function logs mention `node:sqlite`, `Cannot find module 'node:sqlite'`, database locking, or read-only filesystem errors, deploy a commit that includes the runtime-safe fallback in `src/lib/db.ts`.

If the live site still shows older copy, a 6-step wizard, “Recent projects,” or `/faqs` errors after this code is deployed, check Netlify manually:

1. The site is deploying the `main` branch after the latest merge.
2. The deploy timestamp is newer than the latest pushed commit.
3. Base directory points to the Operon Kitchens repository root, not the old Operon Flooring project.
4. Build command is `npm run build`.
5. Publish directory is `out`.
6. Node version is `22`.
7. `@netlify/plugin-nextjs` is enabled and using a current supported version.
8. No stale deploy is pinned as the published deploy.
9. No environment variable overrides point the app at old build or shared project files.
10. Runtime/function logs do not show a `node:sqlite` or local filesystem crash before public page rendering. Static public pages should not require Netlify Functions to render.

## Deployment fingerprint

After deployment, check:

- `https://operonkitchens.netlify.app/deploy-check`

Expected public markers:

- Static app version: `2026-05-31-quote-safety-pass`
- Hero: `Clear kitchen renovation estimates for Sydney homes — before the site visit.`
- Chatbot: `Need help with scope? Ask Operon`
- Footer spacing fixed: `yes`

Any required Netlify UI or production deployment setting change is outside this repository and should be done manually by Vincent.
