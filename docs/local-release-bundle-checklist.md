# Local Release Bundle Checklist

Last updated: 2 June 2026

Purpose: batch local fixes into one controlled release candidate before Vincent approves any push/deploy. This protects Netlify credits and keeps controlled testing calm.

Default rule: no deploy. This checklist prepares a release candidate only.

## When To Use

Use this after local hardening work such as:

- request-review usability fixes
- admin-lite readability fixes
- privacy/terms wording fixes
- controlled-testing documentation updates
- small customer-safe copy changes
- test updates

Do not use this to sneak in major features.

## Include In A Bundle

Allowed bundle items:

- high-confidence mobile spacing fixes
- form clarity improvements
- admin empty/loading/error state improvements
- public copy safety fixes
- docs/playbook updates
- tests for changed behavior

## Exclude Unless Separately Approved

Do not include without explicit approval:

- production Supabase setting changes
- Netlify setting changes
- file download/deletion features
- retention automation
- payment or checkout
- customer auth/login expansion
- full CRM
- supplier APIs
- broad SEO expansion
- production verification loops

## Local Gate Before Asking Vincent To Approve Deploy

Run:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Confirm:

- all changes are inside `/Users/daibang/Documents/operon-kitchens/**`
- no Operon Flooring files changed
- no Oz Timber files changed
- no secrets are committed
- no service keys are exposed
- no supplier costs, internal rates, margins, lead scores, admin priority or hidden pricing logic are public
- no final fixed quote, guaranteed savings, legal approval or compliance approval wording was introduced
- admin routes remain out of public navigation
- `/admin/leads` remains `noindex,nofollow`

## Suggested Release Candidate Report

Before any approved deploy, report:

1. Files changed
2. Customer-facing changes
3. Admin/internal changes
4. Docs/tests changed
5. Tests/lint/build result
6. Deployment status: optional or required
7. Why deployment is worth one Netlify build
8. Manual verification Vincent should do after deploy

## After Approval Only

If Vincent approves:

1. Commit the bundle.
2. Push to the approved branch.
3. Let Netlify deploy once.
4. Verify only the affected live routes.
5. Stop; do not run repeated clear-cache deploys.
