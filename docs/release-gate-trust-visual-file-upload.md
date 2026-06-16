# Release Gate: Trust, Visual And File Upload

Last updated: 17 June 2026

Purpose: decide what belongs in the next approved Operon Kitchens release without mixing low-risk polish and backend file operations accidentally.

Deployment status: not needed. This is a local release-gate note.

## Release Options

### Option 1: Trust And Visual Polish Only

Best when Vincent wants the safest public refresh.

Includes:

- trust copy polish
- footer/header/brand visual polish
- chatbot spacing/copy polish
- quote/review public wording polish
- docs-only controlled-testing improvements

Does not include:

- new file-operation verification
- new production Supabase checks
- domain/email verification
- paid quote-review product changes

Deploy status: optional after Vincent approves.

### Option 2: File Upload Backend Operations

Best when Vincent wants to verify the private upload workflow end to end.

Includes:

- signed download function
- admin download button
- signed URL normalization
- metadata soft-delete function
- private bucket/table/env var checks

Does not include:

- visible delete button
- physical object deletion
- retention automation
- public file URLs
- customer file portal

Deploy status: required for live verification after Vincent approves.

### Option 3: Combined Trust/Visual + File Operations

Best only when Vincent deliberately accepts one larger release.

Risk:

- customer-facing visual changes and backend file operations become harder to debug separately
- if file upload verification fails, it can distract from otherwise clean trust/visual polish

Recommendation:

- use Option 1 first if credits are tight and customer-facing polish is the priority
- use Option 2 separately when file download/deletion metadata needs live verification

## Smoke Check Routes

For trust/visual:

- `/`
- `/quote`
- `/quote/review`
- `/request-review`
- `/faqs`
- `/privacy`
- `/terms`

For admin/file operations:

- `/admin/leads`
- `/.netlify/functions/kitchen-request-review`
- `/.netlify/functions/kitchen-admin-file-download`
- `/.netlify/functions/kitchen-admin-file-delete`

## Stop Conditions

Stop before release if any public surface includes:

- final fixed quote claim
- legal approval claim
- compliance approval claim
- HBC approval claim
- strata approval claim
- guaranteed savings claim
- instant custom kitchen ordering claim
- supplier costs
- internal rates
- margin logic
- lead score
- admin priority
- service role key

Stop file-operation release if:

- bucket is public
- table SQL is missing
- admin token is missing
- signed download accepts browser object paths
- soft delete physically deletes files
- browser response exposes raw Supabase errors

## Final Approval Checklist

Before any approved push/deploy:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Then confirm:

- exact branch to deploy
- exact commit hash
- one smoke-check route list
- one controlled production test only
- no Netlify setting changes by Codex
- no production Supabase changes by Codex

