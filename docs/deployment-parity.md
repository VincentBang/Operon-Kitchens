# Deployment Parity Check

Last checked: 2026-05-30

This note documents the local build state for Operon Kitchens and the likely causes when the live site does not match the local app.

## Kitchen-only build settings

The Operon Kitchens repository contains its own `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `22`
- Build database mode: `OPERON_KITCHENS_BUILD_DB=memory`

The local `.nvmrc` also pins Node `22`.

## Local route status

The latest local build completed successfully with 95 generated pages. These routes are included in the successful build output:

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
- `/admin/faqs`

This means the previous Netlify `/admin/faqs` page-data failure and the reported live `/faqs` 500 are not reproducible from the current local kitchen source.

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

## Live deployment mismatch checks for Vincent

`https://operonkitchens.netlify.app` was checked for `/`, `/quote`, `/quote/review`, `/faqs`, `/privacy`, `/terms` and `/areas`. Each returned HTTP `500` while the local built app returned `200` for the same route group.

That means the current live deploy does not match the local production build result, or the deployed environment is failing before rendering public pages. Because Netlify UI settings and published deploy selection live outside `/Users/daibang/Documents/operon-kitchens`, they require Vincent to check manually.

If the live site still shows older copy, a 6-step wizard, “Recent projects,” or `/faqs` errors after this code is deployed, check Netlify manually:

1. The site is deploying the `main` branch after the latest merge.
2. The deploy timestamp is newer than the latest pushed commit.
3. Base directory points to the Operon Kitchens repository root, not the old Operon Flooring project.
4. Build command is `npm run build`.
5. Publish directory is `.next`.
6. Node version is `22`.
7. `@netlify/plugin-nextjs` is enabled.
8. No stale deploy is pinned as the published deploy.
9. No environment variable overrides point the app at old build or shared project files.

Any required Netlify UI or production deployment setting change is outside this repository and should be done manually by Vincent.
