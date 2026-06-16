# Current Stage Execution Order

Last updated: 17 June 2026

Purpose: keep the current controlled-testing stage moving one step at a time without spending Netlify credits or mixing unrelated release risks.

Deployment status: not needed. This is a local planning document only.

## Current Stage

Operon Kitchens is in controlled testing / local hardening.

Phase 1 public conversion is complete locally. The next work should focus on controlled release discipline, operational reliability and small blocker fixes rather than reopening broad homepage/header/footer/chatbot work unless a tester reports a specific issue.

## One-By-One Order

### 1. Trust Polish Release Bundle

Status: locally committed.

Reference:

- [Trust polish release bundle](./trust-polish-release-bundle-2026-06-13.md)

Why first:

- lowest risk
- no database changes
- improves public trust wording and chatbot polish
- already has tests/build passing

Next action:

- keep local until Vincent approves one batched release
- do not deploy by itself unless it is bundled with another approved release

### 2. Visual System Release Review

Status: completed locally on 17 June 2026, release decision pending.

Reference:

- [Brand system](./brand-system.md)
- [Local hardening batch: 4 June 2026](./local-hardening-batch-2026-06-04.md)
- [Operon Flooring colour alignment](./operon-flooring-color-alignment.md)
- [Visual release review: 17 June 2026](./visual-release-review-2026-06-17.md)

Why second:

- customer-facing quality matters before wider controlled testing
- visual changes are easier to smoke-test than backend file operations
- can be bundled with trust polish if Vincent approves one public release

Next action:

- keep out of production until an approved release checkpoint
- if Vincent reports a specific visual issue, fix that targeted issue only
- otherwise move to file-upload MVP release prep

### 3. File Upload MVP Release Prep

Status: prepared locally, but deploy-sensitive.

Reference:

- [File upload release candidate summary](./file-upload-release-candidate-summary.md)
- [Signed download live verification checklist](./signed-download-live-verification-checklist.md)
- [Supabase file upload SQL checklist](./supabase-file-upload-sql-checklist.md)

Why third:

- it touches Netlify Functions and Supabase storage behaviour
- it needs one approved live verification after deploy
- it should not be mixed with cosmetic-only work unless Vincent deliberately approves a combined release

Next action:

- re-run local tests/build
- confirm required env vars and SQL are documented
- prepare a one-deploy verification script/checklist
- do not push or production-test until Vincent approves

### 4. Domain / Email / Resend Readiness

Status: local checklist refreshed on 17 June 2026; manual external setup deferred.

Reference:

- [Domain and email launch checklist](./domain-email-launch-checklist.md)

Why fourth:

- improves professionalism but depends on external domain/DNS/Resend setup
- email is notification only; Supabase and `/admin/leads` already cover lead recovery

Next action:

- keep checklist ready
- after Vincent buys/connects domain, verify sender/domain and one production test lead in a single approved release cycle

### 5. Quote Review Manual Trial

Status: manual trial worksheet added on 17 June 2026; product trial pending.

Reference:

- [Quote review report template](./quote-review-report-template.md)
- [Quote review report readiness checklist](./quote-review-report-readiness-checklist.md)
- [Quote review manual trial worksheet](./quote-review-manual-trial-worksheet.md)
- [Paid quote review service packaging](./paid-quote-review-service-packaging.md)

Why fifth:

- should use real controlled leads before payment or PDF automation
- lets Vincent validate what customers actually need from quote review

Next action:

- run unpaid/manual quote-review report trials from controlled leads
- refine report copy and operator workflow
- do not implement payment yet

## Current Recommended Next Local Task

Prepare the file-upload MVP release gate for signed downloads and soft delete:

- confirm current functions and tests are present
- confirm required env vars are documented
- confirm manual SQL/bucket prerequisites are documented
- prepare the one-approved-deploy verification steps
- do not push, deploy or production-test until Vincent approves

Do not deploy. Do not push. Do not perform production verification.

## Release Principle

Only spend a Netlify deploy when there is a clearly approved bundle. The cleanest next public release candidate is:

1. trust-polish bundle
2. visual-system fixes
3. only then file-upload signed-download/soft-delete if Vincent wants backend file operations in the same release

If Netlify credits are tight, release trust/visual polish first and keep file-upload operations for a separate approved checkpoint.
