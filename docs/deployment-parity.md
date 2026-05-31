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

## Publish directory diagnosis

Detected build mode on 2026-05-31:

- `next.config.js` sets `output: 'export'`.
- `package.json` uses `npm run build` with `next build`; it does not call `next export` separately because Next 14 writes the static export when `output: 'export'` is enabled.
- `npm run build` creates both `.next/` and `out/`.
- `.next/` is the intermediate Next build folder.
- `out/` is the deployable static site output.
- `out/deploy-check.html` exists after build and contains the expected version, hero, chatbot and footer-spacing markers.
- `.next/server/pages/deploy-check.html` also exists as an intermediate prerendered artifact, but `.next` should not be the Netlify publish directory for the current static deployment.

Correct Netlify setting for the current app:

- Runtime/build framework: Next.js is fine for detection, but the publish directory must be `out`.
- Base directory: Operon Kitchens repository root.
- Build command: `npm run build`.
- Publish directory: `out`.

If Netlify UI shows publish directory `.next`, the UI setting is stale or overriding the repository `netlify.toml`. Change the Netlify site build setting from `.next` to `out`, then clear cache and deploy again. This is a Netlify UI/deployment setting and must be done manually by Vincent because it is outside the kitchen repository.

## Live production parity confirmation

Confirmed on 2026-05-31 after the Netlify publish directory was changed from `.next` to `out`:

- Netlify is now serving the static export from `out`.
- `/deploy-check` is publicly visible.
- The homepage contains `Clear kitchen renovation estimates for Sydney homes — before the site visit.`
- The chatbot launcher contains `Need help with scope? Ask Operon` on public pages where the chatbot is shown.
- The stale homepage text `Clear kitchen renovation estimates before you book a site visit` was not found on checked routes.
- The stale chatbot text `Need help with scope??Ask Operon` was not found on checked routes.
- The stale footer spacing bug `brand.Planning guidance only` was not found on checked routes.

Live URLs checked:

- `https://operonkitchens.netlify.app/deploy-check` returned `200`
- `https://operonkitchens.netlify.app/` returned `200`
- `https://operonkitchens.netlify.app/quote` returned `200`
- `https://operonkitchens.netlify.app/quote/review` returned `200`
- `https://operonkitchens.netlify.app/privacy` returned `200`
- `https://operonkitchens.netlify.app/terms` returned `200`
- `https://operonkitchens.netlify.app/faqs` returned `200`
- `https://operonkitchens.netlify.app/areas` returned `200`

No remaining live/local production mismatch was found in this route group.

## Request-review function verification

Checked on 2026-05-31 after Supabase and Netlify environment variables were reported as configured:

- `https://operonkitchens.netlify.app/request-review` returned `200`.
- `https://operonkitchens.netlify.app/.netlify/functions/kitchen-request-review` returned `404`.
- A production test payload was not submitted because the function route is not live.

Local diagnosis:

- `netlify.toml` declares `[functions] directory = "netlify/functions"`.
- `netlify/functions/kitchen-request-review.ts` exists locally.
- `src/lib/requestReview.ts` and `src/lib/kitchenLeadStorage.ts` exist locally.
- These request-review function/storage files are currently untracked in Git, so they are not part of the latest deployed commit.

Required deployment action:

1. Commit and push the request-review function, storage adapter, request-review schema, docs and tests to the branch Netlify deploys.
2. Trigger a fresh Netlify deploy.
3. Recheck `https://operonkitchens.netlify.app/.netlify/functions/kitchen-request-review`.
4. After the function returns from Netlify, submit a clearly labelled test lead and confirm:
   - the response is a safe acknowledgement,
   - `delivery.stored` is `true`,
   - `delivery.notificationPrepared` reflects the Resend result,
   - a row exists in `kitchen_request_reviews`,
   - the row status defaults to `new`,
   - no client-controlled internal notes/status/admin fields are stored,
   - Netlify logs do not contain missing environment variable warnings, Supabase errors, Resend errors or secrets.

Netlify Function note:

The site can publish the static app from `out` while still deploying functions from `netlify/functions`. If the function remains `404` after the files are committed and deployed, check whether the Netlify site is connected to the correct repository/branch and whether the deploy log includes function bundling for `kitchen-request-review`.

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

## Previous live deployment mismatch checks

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
