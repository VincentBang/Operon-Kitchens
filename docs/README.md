# Operon Kitchens Docs Index

Last updated: 2 June 2026

Use this index to choose the right document before starting work. Operon Kitchens is currently in controlled testing / local hardening mode. Default rule: no deploy, no push to `main`, no production verification unless Vincent explicitly approves a release checkpoint.

## Start Here

- [Agent policy](../AGENTS.md): permanent Codex rules, file boundaries, no-deploy posture and customer-safe guardrails.
- [Project brief](../PROJECT_BRIEF.md): what Operon Kitchens is, current MVP status and safe customer journey.
- [Codex tasks](../CODEX_TASKS.md): current local-only task queue and deferred work.
- [Deployment rules](../DEPLOYMENT_RULES.md): Netlify credit discipline, static export notes and release gates.
- [Decision log](../DECISION_LOG.md): major architecture and operating decisions already made.
- [Release checkpoints](./release-checkpoints.md): approved future release gates.
- [Local release bundle checklist](./local-release-bundle-checklist.md): how to batch local fixes before asking Vincent to approve one deploy.

## Controlled Testing

- [Controlled launch checklist](./controlled-launch-checklist.md): hub checklist for local testing, manual Supabase/admin checks and approved release checkpoints.
- [Controlled testing playbook](./controlled-testing-playbook.md): how Vincent and trusted testers should submit fake enquiries and record confusion points.
- [Request-review and admin mobile QA](./request-review-admin-mobile-qa.md): local visual checklist for `/request-review` and `/admin/leads` screenshots, spacing and usability.
- [Lead handling playbook](./lead-handling-playbook.md): lead statuses, follow-up timing, internal notes style, site-measure triggers and what not to promise.

## Quote Review

- [Quote review report template](./quote-review-report-template.md): customer-safe future report structure covering scope clarity, allowance risk, missing information, questions, compliance prompts and recommended next step.
- [Quote review report readiness checklist](./quote-review-report-readiness-checklist.md): manual trial checklist before paid review, PDF export, payment or CRM workflows.

## File Uploads

- [File upload architecture spec](./file-upload-architecture-spec.md): current server-mediated storage path, private bucket posture, admin metadata display and future signed download/deletion/retention design.
- [File upload MVP completion plan](./file-upload-mvp-completion-plan.md): implementation-ready sequence for admin signed downloads, deletion controls and retention metadata before runtime work.
- [File upload release candidate summary](./file-upload-release-candidate-summary.md): what the signed-download batch would release and how to verify it.
- [Signed download live verification checklist](./signed-download-live-verification-checklist.md): one-deploy production verification steps after approval.
- [Supabase file upload SQL checklist](./supabase-file-upload-sql-checklist.md): manual bucket/table/retention SQL checks for Vincent.
- [File upload runtime slice decision](./file-upload-runtime-slice-decision.md): choose between deploying signed downloads, continuing local delete-function work, or pausing file ops.
- [Supabase request-review storage notes](./supabase-kitchen-request-reviews.md): manual SQL, request-review lead storage, file metadata table and upload troubleshooting.

## Domain, Email And Operations

- [Domain and email launch checklist](./domain-email-launch-checklist.md): future domain, DNS and Resend setup steps.
- [Analytics events](./analytics-events.md): analytics event names and intended future usage.
- [Operational readiness](./operational-readiness.md): future operational path and backend readiness notes.
- [Deployment parity](./deployment-parity.md): static export and Netlify publish-directory parity notes.
- [Architecture](./architecture.md): broader system architecture and roadmap notes.

## Quick Rules

- Work only inside `/Users/daibang/Documents/operon-kitchens/**`.
- Do not edit Operon Flooring or Oz Timber Floor.
- Do not deploy or push unless explicitly approved.
- Supabase is the source of truth for leads.
- Email is notification only.
- Do not expose supplier costs, internal rates, margins, lead scores, admin priority, internal notes, service keys or hidden pricing logic.
- Do not promise final fixed quote, legal approval, compliance approval, HBC approval, strata approval, guaranteed savings or instant custom kitchen ordering.
