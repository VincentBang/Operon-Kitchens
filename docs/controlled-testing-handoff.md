# Controlled Testing Handoff

Last updated: 17 June 2026

Purpose: one-page operating handoff for controlled Operon Kitchens testing. Use this before opening the deeper playbooks.

Deployment status: not needed. This document does not approve push, deploy, production verification, Netlify setting changes or production Supabase changes.

## Current Mode

Operon Kitchens is in controlled testing / local hardening.

Use the site to test:

- planning estimate clarity
- quote-review positioning
- request-review intake
- admin lead handling
- file metadata / future signed-download readiness
- manual quote-review trial workflow

Do not treat this as a broad public launch, paid-service launch, final quote engine, CRM, legal/compliance approval tool or full custom kitchen ordering system.

## Current Local Fixes Waiting For Release

- Homepage final CTA ghost buttons above the footer now have visible white text and subtle borders in the local build.
- This fix should be bundled into the next approved trust/visual release instead of deployed alone.
- Until that release is deployed, live testers may still see low-contrast or empty-looking buttons in the final CTA band.
- Latest local capture pass found no additional blocker across `/`, `/quote`, `/quote/review`, `/request-review` and `/admin/leads`.

## Daily Admin Routine

While branded email is deferred:

1. Open `/admin/leads`.
2. Enter the admin token in the password field.
3. Fetch latest leads.
4. Filter for `new`.
5. Check trusted-tester and customer submissions.
6. Add a short factual internal note.
7. Move the lead to the next useful status.

Cadence:

- controlled testing: once daily
- active tester day: morning and evening
- after a known form test: immediately

Keep Supabase and `/admin/leads` as the source of truth. Email is notification only when enabled later.

## Trusted Tester Flow

Ask each tester to try one path:

1. Start a kitchen planning estimate.
2. Review an existing kitchen quote.
3. Submit a request-review enquiry.

Optional UTM test path:

```text
/request-review?utm_source=trusted_tester&utm_medium=manual&utm_campaign=controlled_testing
```

Capture:

- page started on
- device/browser
- whether the estimate/review/request path made sense
- confusing wording
- mobile friction
- whether site-measure and written-scope boundaries were understood
- whether the next step was clear

## What Not To Promise

Never promise:

- final fixed quote
- final price before site measure
- guaranteed savings
- legal advice
- compliance approval
- HBC approval
- strata approval
- certified or compliant outcome
- instant custom kitchen ordering
- supplier cost access
- margin/rate comparison

Use:

- planning estimate
- indicative range
- general guidance only
- not legal advice
- not a final quote
- may require confirmation
- subject to site measure
- written scope confirmation required

## Site-Measure Triggers

Suggest site measure when:

- customer is close to commitment
- measurements are missing or uncertain
- layout changes are likely
- service relocation may be needed
- apartment/strata access needs review
- older-property demolition risk may exist
- benchtop/splashback details are unclear
- appliance details are not confirmed
- exclusions could materially change scope
- written scope cannot be confirmed from supplied documents

Position it as a way to confirm project-specific details, not as final pricing by itself.

## File Upload Status

Current status:

- request-review can store file objects and metadata when Supabase bucket/table/env vars are configured
- files are stored through server-side Netlify Functions
- bucket should remain private
- `/admin/leads` can show metadata
- signed-download and soft-delete functions are prepared locally for a future approved release

Still deferred:

- visible delete button
- physical object deletion
- retention automation
- customer file portal
- public file URLs
- browser-side Supabase writes

Before any file-operation deploy, use:

- [File upload release preflight](./file-upload-release-preflight.md)
- [Signed download one-deploy checklist](./signed-download-one-deploy-checklist.md)
- [Signed download live verification checklist](./signed-download-live-verification-checklist.md)
- [Soft delete one-deploy checklist](./soft-delete-one-deploy-checklist.md)
- [Soft delete release preflight](./soft-delete-release-preflight.md)

## Manual Quote-Review Trial

Use controlled leads to trial the future quote-review report before payment.

Process:

1. Select a controlled lead from `/admin/leads`.
2. Use the [Quote review manual trial pack](./quote-review-manual-trial-pack.md).
3. Use the [Quote review manual trial worksheet](./quote-review-manual-trial-worksheet.md).
4. Copy only customer-safe details.
5. Choose readiness label: `Needs more detail`, `Basic review ready` or `Strong review ready`.
6. Complete scope clarity, allowance risk, missing information, customer questions and compliance prompts.
7. Add a recommended next step.
8. Log lessons in the [Quote review trial log](./quote-review-trial-log.md).

Do not include supplier costs, internal rates, margin logic, lead score, admin priority, internal notes, service keys or hidden pricing logic in customer-facing report drafts.

## Release Checkpoint Summary

Default: no deploy.

Use one approved release bundle at a time:

1. Trust + visual polish.
2. File upload signed-download + soft-delete backend.
3. Domain/email/Resend.
4. Quote-review service packaging.

Before any approved release:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Confirm:

- no secrets
- no Operon Flooring or Oz Timber changes
- no Netlify setting changes from Codex
- no production Supabase changes from Codex
- no public internal pricing/admin fields
- no final quote/legal/compliance approval claims
- live smoke-check steps are written before spending a deploy

## Deeper References

- [Controlled testing playbook](./controlled-testing-playbook.md)
- [No-email admin routine](./no-email-admin-routine.md)
- [Trusted tester instructions](./trusted-tester-instructions.md)
- [Tester feedback capture template](./tester-feedback-capture-template.md)
- [Admin token handling](./admin-token-handling.md)
- [Internal notes style guide](./internal-notes-style-guide.md)
- [Lead first response script](./lead-first-response-script.md)
- [Site measure readiness checklist](./site-measure-readiness-checklist.md)
- [Release bundle decision matrix](./release-bundle-decision-matrix.md)
- [Request-review and admin handoff audit](./request-review-admin-handoff-audit-2026-06-17.md)
