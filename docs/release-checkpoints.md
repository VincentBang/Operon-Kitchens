# Operon Kitchens Release Checkpoints

Last updated: 2 June 2026

Use this before any approved push, deploy or production verification.

## Current Default

No deploy.

Vincent is low on Netlify credits. Work locally until a checkpoint is explicitly approved.

## Baseline Local Gate

Before any release checkpoint:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Confirm:

- all writes are inside `/Users/daibang/Documents/operon-kitchens/**`
- no Operon Flooring files changed
- no Oz Timber files changed
- no parent/root shared config changed
- no Netlify settings changed
- no production Supabase settings changed directly
- no secrets committed
- no supplier costs, internal rates, margins, lead scores, admin priority, internal notes or service keys are public
- no final fixed quote, guaranteed savings, legal approval or compliance approval claims were introduced

## Checkpoint 1: Domain / Email / Resend Setup

Purpose: prepare professional controlled testing.

Ready when:

- domain is purchased
- Netlify domain/DNS setup is planned or completed by Vincent
- Resend verified domain/sender is configured
- Netlify email env vars are set
- one approved production test lead confirms email delivery
- `/admin/leads` shows the same lead

Deploy: only after Vincent approves.

## Checkpoint 2: Controlled Testing Fixes

Purpose: fix only real blockers found by trusted testers.

Examples:

- request-review form confusion
- quote-review submission friction
- admin lead readability
- mobile usability blocker
- privacy/terms clarity issue

Avoid:

- broad feature expansion
- SEO sprawl
- payment
- full CRM

Deploy: batch fixes into one approved release.

## Checkpoint 3: File Upload MVP

Purpose: complete safe file handling.

Scope:

- private bucket verified
- request-review upload stores file object and metadata
- admin metadata visible
- signed download workflow designed and approved
- deletion and retention rules documented

Do not add public file URLs or browser-side Supabase writes.

Deploy: only after local tests and explicit approval.

## Checkpoint 4: Paid Quote Review / Service Packaging

Purpose: define commercial offer before payment.

Scope:

- quote-review report template
- inclusions/exclusions
- service ladder copy
- refund/cancellation draft
- no live checkout until approved

Deploy: optional after service copy is approved.

## Checkpoint 5: Broader SEO / Content Rollout

Purpose: expand public acquisition only after operational readiness.

Scope:

- stronger guide pages
- suburb/area quality review
- internal links
- no doorway pages
- no fake proof

Deploy: only after controlled testing proves lead handling is stable.

## Final Report Requirement

Every release or local-hardening report must state:

- Deployment required, optional or not needed
- What was changed
- What was tested
- What remains deferred
- Recommended next local-only task
