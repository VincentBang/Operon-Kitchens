# Operon Kitchens Deployment Rules

Last updated: 2 June 2026

## Main Rule

Default: no deploy.

Vincent is low on Netlify credits. Do not trigger a deploy unless Vincent explicitly approves a release checkpoint or asks for a push/deploy.

Do not:

- push to `main` without explicit approval
- create deploy previews
- run clear-cache deploys
- trigger Netlify builds
- perform production verification loops
- edit Netlify site settings

Prefer:

- local tests
- local lint
- local build
- static export inspection
- documentation
- local commits only when useful

## Why This Matters

Pushing to `main` can trigger Netlify production deployment. Treat any push to `main` as a deployment action.

## Current Deployment Mode

Operon Kitchens is a static export.

Expected Netlify settings:

- Build command: `npm run build`
- Publish directory: `out`
- Node version: `22`
- Functions directory: `netlify/functions`

`next.config.js` uses static export. Public pages cannot rely on Next API routes in production. Runtime backend work must use Netlify Functions.

## Before Any Approved Deploy

Run locally:

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
- no supplier costs, internal rates, margins, lead scores, admin priority or service keys are exposed
- no final fixed quote, legal approval, compliance approval or guaranteed savings wording was introduced

## Deploy Required

Only mark deployment required when:

- Vincent explicitly approves a release
- a production customer blocker must be fixed live
- a Netlify Function change must be verified live
- a release checkpoint calls for one controlled production test

## Deploy Optional

Deployment is optional when:

- code is ready but not approved for release
- UX improvements are local and can wait
- docs/tests changed alongside non-critical code

## Deploy Not Needed

Deployment is not needed when:

- docs changed only
- the task is local QA
- the task produces a plan/spec/playbook
- only tests were added
- no customer-facing runtime change needs release

## Clear-Cache Deploy

Clear-cache deploy is a last resort. Use only when a production artifact/runtime mismatch is confirmed and Vincent approves.

## Reporting Requirement

Every final report must explicitly say one of:

- Deployment required
- Deployment optional
- Deployment not needed

If deployment is required or optional, explain why and what Vincent must approve.
