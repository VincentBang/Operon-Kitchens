# Local Release Bundle Checklist

Last updated: 4 June 2026

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

## Current Waiting Bundle: File Upload Admin Controls

Prepared locally and suitable for one future approved deploy:

- Supabase signed URL normalisation fix for admin downloads
- token-gated admin signed download function and `/admin/leads` button
- file retention status display in `/admin/leads`
- token-gated soft-delete function and tests
- delete-button UI design/tests
- no delete button yet
- no physical object deletion yet
- no retention automation yet

Use the [file upload release candidate summary](./file-upload-release-candidate-summary.md) and [signed download live verification checklist](./signed-download-live-verification-checklist.md) before asking Vincent to spend a deploy.

## Proposed Next Bundle: Brand, Header And Admin File Controls

Prepared locally as a single possible release candidate. Deployment remains optional and requires Vincent approval.

Customer-facing polish:

- Operon Kitchens branch logo asset system under `public/brand/`
- active header, footer, emblem and favicon PNGs generated from Vincent's approved logo reference
- dedicated compact header logo with larger `OPERON` and readable `KITCHENS`
- footer/full-lockup logo usage retained for larger brand placements
- header and footer logo lockups tightened so `OPERON` and `KITCHENS` read as one branch brand rather than separated labels
- white Operon Flooring-style page/header chrome
- exact Operon Flooring footer ink colour `#142f38` applied to the rounded footer container and primary CTA surfaces
- footer changed to a rounded dark container with white spacing around it
- mobile/short-screen chatbot launcher reduced to a compact icon so it does not cover the homepage sample estimate preview
- homepage/header responsive QA completed at `1280`, `1440`, `390` and `360` widths
- visual-system regression tests added for brand assets, footer colour, footer spacing and mobile sticky CTA behaviour

Admin/file-control batch:

- Supabase signed URL normalisation fix for admin downloads
- token-gated admin signed download function
- `/admin/leads` download button for stored file metadata
- admin file retention/status display where retention columns exist
- token-gated soft-delete function and tests prepared locally
- delete-button UI design documented only; visible delete control remains deferred

Safety guardrails:

- no public file URLs
- no browser-side Supabase writes
- no service keys exposed to browser responses
- no supplier costs, margins, lead scores, admin priority or hidden pricing logic exposed
- no payment, customer auth, full CRM, physical file deletion or retention automation

Recommended release decision:

- approve one deploy only if Vincent wants both the public visual polish and admin signed-download/soft-delete backend available for controlled testing
- otherwise keep the bundle local and continue polishing docs/UI without spending Netlify credits

Manual verification after one approved deploy:

1. Confirm homepage header logo and mobile chatbot behavior.
2. Submit one `/request-review` test with a small PDF/image.
3. Confirm Supabase lead and file metadata rows exist.
4. Open `/admin/leads` with the admin token.
5. Confirm uploaded file metadata is visible.
6. Click `Download` and confirm the signed URL opens the file.
7. Confirm unsafe fields and service keys are absent from browser/network responses.

## Exclude Unless Separately Approved

Do not include without explicit approval:

- production Supabase setting changes
- Netlify setting changes
- file download/deletion features outside the approved file-upload release candidate
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
