# Operon Kitchens Deployment Rules

Last updated: 31 May 2026

## Main Rule

Minimise Netlify deploys because Netlify credits are limited.

Do not deploy unless deployment is unavoidable or Vincent explicitly asks for commit/push/deploy. Prefer local tests, local build, static export checks and documentation.

Always report whether deployment is:

- required
- optional
- not needed

## Current Deployment Mode

Operon Kitchens is deployed as a static export.

Required Netlify settings:

- Base directory: Operon Kitchens repository root.
- Build command: `npm run build`.
- Publish directory: `out`.
- Node version: `22`.
- Netlify Functions directory: `netlify/functions`.

Important:

- `.next` is an intermediate Next build folder.
- `out` is the deployable public site output.
- `next.config.js` uses `output: 'export'`.
- Static export public pages cannot rely on Next API routes at runtime.
- Netlify Functions can still run from `netlify/functions`.

## Before Any Deploy

Run:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Confirm:

- no files outside `/Users/daibang/Documents/operon-kitchens/**` changed
- no Operon Flooring files changed
- no Oz Timber files changed
- no secrets are committed
- no customer-facing internal fields are exposed
- no final fixed quote, compliance approval, legal approval or guaranteed savings claims were introduced

## Local Static Export Checks

After `npm run build`, inspect `out` before deploy:

- `out/index.html`
- `out/quote.html`
- `out/quote/review.html`
- `out/request-review.html`
- `out/admin/leads.html`
- `out/deploy-check.html`

Use `rg` against `out` to check stale copy and unsafe wording.

## Deploy Required

Deployment is required when:

- a production bug fix must reach customers
- Netlify Function behaviour changed and must run live
- Vincent explicitly asks to commit/push/redeploy
- live production parity must be verified for a runtime issue

## Deploy Optional

Deployment is optional when:

- docs changed only
- tests changed only
- non-customer-facing internal refactors changed
- a feature is ready but not yet approved for release

## Deploy Not Needed

Deployment is not needed when:

- the task is a local QA/review
- the task is documentation-only
- the task produces a plan
- no files changed
- only local static export output was checked

## Live Verification

Use sparingly to conserve deploy credits.

Recommended URLs:

- `https://operonkitchens.netlify.app/deploy-check`
- `https://operonkitchens.netlify.app/`
- `https://operonkitchens.netlify.app/request-review`
- `https://operonkitchens.netlify.app/.netlify/functions/kitchen-request-review`
- `https://operonkitchens.netlify.app/admin/leads`

Do not ask Vincent to paste admin tokens or secrets into chat. Use browser/session context or local environment only when safely available.

## Manual Netlify Changes

Codex must not edit Netlify UI settings directly. If a Netlify setting outside the repository is needed, report exact manual action for Vincent.

Common manual checks:

- correct Git repo
- correct branch
- correct base directory
- build command `npm run build`
- publish directory `out`
- Node version `22`
- latest deploy commit hash
- no old deploy pinned
- environment variables present
- Netlify Function logs clean
