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
- [Current stage execution order](./current-stage-execution-order.md): one-by-one order for trust polish, visual review, file-upload MVP, domain/email and quote-review trials.
- [Next 30 local tasks: 17 June 2026](./next-30-local-tasks-2026-06-17.md): local execution queue for controlled-testing hardening while deploys remain paused.
- [Next 30 local tasks: controlled testing handoff batch](./next-30-local-tasks-2026-06-17-handoff-batch.md): second approved no-deploy queue for the operator handoff, request/admin audit, file-operation checklists and quote-review manual trial pack.
- [Next 100 local tasks: controlled testing readiness](./next-100-local-tasks-2026-06-17.md): no-deploy execution batch covering release gates, file upload, domain/email, quote-review trials, admin operations, SEO backlog and risks.
- [Next 100 local tasks: release decision and visual polish](./next-100-local-tasks-2026-06-17-release-decision-visual-batch.md): no-deploy batch for release-choice clarity, safer public wording, homepage proof hierarchy, compact navigation and visual guardrails.
- [Next 100 local tasks: viewport and release readiness](./next-100-local-tasks-2026-06-17-viewport-release-readiness.md): no-deploy browser-backed viewport review, customer-safe strata wording pass and release smoke-pack preparation.
- [Next 100 local tasks: controlled feedback capture and release bundling](./next-100-local-tasks-2026-06-20-controlled-feedback.md): no-deploy batch for tester findings, CTA visibility capture and next release-bundle tracking.
- [Next 500 local tasks: 23 June 2026](./next-500-local-tasks-2026-06-23.md): grouped no-deploy execution map for quote-review trials, controlled operations, file-upload prep, domain/email readiness and SEO rollout.
- [Local viewport review: 17 June 2026](./local-viewport-review-2026-06-17.md): local route/viewport result for homepage, quote review, request review, site measure and admin leads.
- [Release smoke check pack: 17 June 2026](./release-smoke-check-pack-2026-06-17.md): one-approved-deploy smoke-check sequence for the next release checkpoint.
- [Trust / visual release candidate summary: 20 June 2026](./trust-visual-release-candidate-summary-2026-06-20.md): concise approval summary for one future trust/visual deploy without file-upload backend scope.
- [Phase 1 conversion completion](./phase-1-conversion-completion.md): local completion record for the public homepage, quote, quote review, FAQ, trust and shared layout experience.
- [Trust polish release bundle: 13 June 2026](./trust-polish-release-bundle-2026-06-13.md): local release-candidate note for chatbot, quote-review wording, layout consistency and public copy guardrails.

## Advanced Design-Build Tool

- [Advanced kitchen design-build tool master plan](./advanced-kitchen-design-build-tool-master-plan.md): approved strategic baseline, roadmap phases, stage gates, safety constraints and deferred features.
- [Advanced tool implementation tracker](./advanced-kitchen-design-build-tool-implementation-tracker.md): durable stage status, dependencies, tests, blockers, deployment status and next-stage recommendation.
- [Advanced tool product architecture](./advanced-kitchen-design-build-tool-product-architecture.md): current route/component/service/database architecture and proposed advanced-tool architecture.
- [Advanced tool data contracts](./advanced-kitchen-design-build-tool-data-contracts.md): conceptual TypeScript-style contracts for design brief, scope, allowance, risk, site-measure and report records.
- [Advanced tool technical decisions](./advanced-kitchen-design-build-tool-decisions.md): architecture decision record for structured data, feature flags, persistence, privacy, AI boundaries and human review.
- [Advanced tool Phase 0 baseline audit](./advanced-kitchen-design-build-tool-phase-0-baseline-audit.md): repository audit for framework, routes, quote/review/request/admin flows, Supabase, functions, tests and data gaps.
- [Advanced tool Phase 1 spec](./advanced-kitchen-design-build-tool-phase-1-spec.md): locally implemented structured design brief assistant spec, disabled by default and awaiting human review before exposure.
- [Advanced tool Phase 2 spec](./advanced-kitchen-design-build-tool-phase-2-spec.md): locally implemented kitchen scope builder spec, disabled by default and awaiting human review before exposure.
- [Advanced tool Phase 2 viewport review](./advanced-kitchen-design-build-tool-phase-2-viewport-review.md): local browser-metric review for `/scope-builder` at desktop, tablet and mobile widths.
- [Advanced tool Phase 3 spec](./advanced-kitchen-design-build-tool-phase-3-spec.md): locally implemented allowance and quote-risk engine spec, surfaced only inside hidden `/scope-builder` and awaiting human review.
- [Advanced tool Phase 3 viewport review](./advanced-kitchen-design-build-tool-phase-3-viewport-review.md): local browser-metric review for the Phase 3 risk prompts, including the mobile chatbot overlap fix.
- [Advanced tool Phase 5 planning spec](./advanced-kitchen-design-build-tool-phase-5-planning-spec.md): internal review-console integration plan; slice 1 local projection helpers are implemented, while persistence, admin UI and functions remain gated.
- [Advanced tool Phase 5 slice 2 storage-adapter plan](./advanced-kitchen-design-build-tool-phase-5-slice-2-storage-adapter-plan.md): server-mediated storage adapter plan; local interface sketch and no-write mock harness exist, while Supabase writes, functions and admin UI remain gated.
- [Advanced tool Phase 5 Netlify Function contract test plan](./advanced-kitchen-design-build-tool-phase-5-netlify-function-contract-test-plan.md): contract tests planned for the future `kitchen-advanced-review-payload` function; request/response fixtures and a thin test helper exist, while the function, Supabase adapter and admin UI remain gated.
- [Advanced tool Phase 5 thin function implementation plan](./advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md): helper-first plan for mapping the test fixtures to a future `kitchen-advanced-review-payload` wrapper; the local helper exists, while the Netlify wrapper, Supabase adapter and admin UI remain gated.
- [Advanced tool Phase 5 wrapper-only implementation plan](./advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md): original Netlify wrapper plan for `netlify/functions/kitchen-advanced-review-payload.ts`; active wrapper tests now cover the local replacement, while admin UI, browser wiring and deploy remain unapproved.
- [Advanced tool Phase 5 disabled wrapper creation plan](./advanced-kitchen-design-build-tool-phase-5-disabled-wrapper-creation-plan.md): historical disabled/no-write wrapper baseline; the local wrapper is now active through the server-only adapter, while SQL, admin UI, browser wiring and deploy remain unapproved.
- [Advanced tool Phase 5 real Supabase adapter plan](./advanced-kitchen-design-build-tool-phase-5-real-supabase-adapter-plan.md): planning spec and mocked contract-test layer for future `kitchen_advanced_review_payloads` storage; no Supabase writes, SQL application, admin UI, browser wiring or deploy is approved.
- [Advanced tool Phase 5 real adapter implementation plan](./advanced-kitchen-design-build-tool-phase-5-real-adapter-implementation-plan.md): implementation record for the local server-only REST/fetch adapter and mocked tests; SQL, admin UI, browser wiring and deploy remain unapproved.
- [Advanced tool Phase 5 wrapper replacement plan](./advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md): contract and activation plan for replacing the disabled `kitchen-advanced-review-payload` wrapper with the real adapter; local replacement is complete, while SQL, admin UI, browser wiring and deploy remain unapproved.
- [Advanced tool Phase 5 activation checklists](./advanced-kitchen-design-build-tool-phase-5-activation-checklists.md): side-by-side SQL migration and wrapper replacement checklists; both remain approval-gated and inactive.
- [Advanced tool Phase 5 SQL approval packet](./advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql): copy-paste-safe SQL packet for future `public.kitchen_advanced_review_payloads` storage; not applied, no wrapper replacement, admin UI, browser wiring or deploy approved.
- [Advanced tool Phase 5 wrapper replacement implementation checklist](./advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md): active Netlify wrapper implementation checklist; documents `Netlify.env.get`, response contract, tests and rollback.
- [Advanced tool Phase 5 wrapper replacement patch plan](./advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md): patch shape used for replacing the disabled wrapper; documents the diff, test sequence and rollback.
- [Advanced tool Phase 5 wrapper activation readiness review](./advanced-kitchen-design-build-tool-phase-5-wrapper-activation-readiness-review.md): go/no-go gate review for SQL, Supabase RLS/grants, Netlify env, response contract, safety boundary, product exposure and rollback before the local active wrapper can be pushed, deployed or production-verified.
- Active wrapper contract tests: `../test/advancedReviewPayloadActiveWrapperContract.test.ts` proves the active Netlify wrapper surface with `Netlify.env.get`, no-store JSON responses and mocked Supabase only.

## Controlled Testing

- [Controlled testing handoff](./controlled-testing-handoff.md): one-page daily operating guide for admin checks, trusted testers, promises boundary, file status, quote-review trials and release checkpoints.
- [Controlled launch checklist](./controlled-launch-checklist.md): hub checklist for local testing, manual Supabase/admin checks and approved release checkpoints.
- [Controlled testing playbook](./controlled-testing-playbook.md): how Vincent and trusted testers should submit fake enquiries and record confusion points.
- [Trusted tester instructions](./trusted-tester-instructions.md): short script for 2-3 trusted controlled testers.
- [Tester feedback capture template](./tester-feedback-capture-template.md): structured way to record tester confusion, mobile issues and lead/admin checks.
- [Controlled testing findings log](./controlled-testing-findings-log.md): running log for tester findings, local fixes and release-bundle decisions.
- [No-email admin routine](./no-email-admin-routine.md): daily `/admin/leads` operating rhythm while Resend/domain email is deferred.
- [Admin token handling](./admin-token-handling.md): rules for using and protecting `OPERON_KITCHENS_ADMIN_TOKEN`.
- [Internal notes style guide](./internal-notes-style-guide.md): safe operator note examples and forbidden internal-note content.
- [Lead first response script](./lead-first-response-script.md): safe first-response wording for estimate, quote review and site-measure leads.
- [Site measure readiness checklist](./site-measure-readiness-checklist.md): operator checklist for deciding when to suggest site measure.
- [Release bundle decision matrix](./release-bundle-decision-matrix.md): local decision aid for trust, visual, file-upload and email release bundles.
- [Release gate: trust, visual and file upload](./release-gate-trust-visual-file-upload.md): decision note separating trust/visual polish from backend file-operation releases.
- [Release decision note for Vincent](./release-decision-note-vincent-2026-06-17.md): human-readable choice between trust/visual-only, file-upload backend, combined or local-only next steps.
- [Request-review and admin mobile QA](./request-review-admin-mobile-qa.md): local visual checklist for `/request-review` and `/admin/leads` screenshots, spacing and usability.
- [Request-review and admin handoff audit](./request-review-admin-handoff-audit-2026-06-17.md): local audit against the controlled-testing handoff, including remaining controlled-testing friction.
- [Operon Flooring UI alignment audit](./operon-flooring-ui-alignment.md): how Kitchens should follow the Operon family layout rhythm without copying Flooring content or weakening kitchen safety rules.
- [Operon Flooring colour alignment](./operon-flooring-color-alignment.md): Flooring-inspired navy/gold/warm-neutral token mapping for the Kitchens visual system.
- [Operon System visual alignment audit](./operon-system-visual-alignment-audit.md): current local audit against the public Operon Flooring visual standard for header, hero, cards, footer, chatbot and mobile rhythm.
- [Public trust gate](./public-trust-gate-operon-kitchens.md): local gate for footer, chatbot, logo, upload wording, public links and customer-safe public promises.
- [Brand asset system](./brand-system.md): Operon Kitchens logo variants, colours, usage guidance and final designer/vector work notes.
- [Sitewide professional polish audit](./sitewide-professional-polish-audit.md): local audit for quote-first conversion, footer, chatbot, upload wording, FAQ, areas and shared layout polish.
- [Sitewide layout QA](./sitewide-layout-qa.md): local visual checklist and notes for shared article spacing, footer, chatbot and mobile overlap checks.
- [Local hardening batch: 4 June 2026](./local-hardening-batch-2026-06-04.md): no-deploy 50-task execution log for logo, header, footer, button and visual regression guardrails.
- [Visual release review: 17 June 2026](./visual-release-review-2026-06-17.md): local static-export viewport check for homepage, quote review, request review, FAQ and admin leads.
- [Local viewport review: 17 June 2026](./local-viewport-review-2026-06-17.md): browser-backed local viewport check for the latest release candidate routes.
- [Lead handling playbook](./lead-handling-playbook.md): lead statuses, follow-up timing, internal notes style, site-measure triggers and what not to promise.
- [Controlled testing feedback scorecard](./controlled-testing-feedback-scorecard.md): scoring template for trusted-tester clarity, mobile friction, admin handling and next-step confidence.
- [Admin operations weekly review](./admin-operations-weekly-review.md): weekly internal review for lead statuses, notes, UTM/source, upload metadata and no-email fallback.
- [Operations risk register](./operations-risk-register.md): risk tracker for Netlify credits, Supabase storage, admin token handling, file retention, paid-service expectations and SEO rollout.

## Quote Review

- [Quote review report template](./quote-review-report-template.md): customer-safe future report structure covering scope clarity, allowance risk, missing information, questions, compliance prompts and recommended next step.
- [Quote review report readiness checklist](./quote-review-report-readiness-checklist.md): manual trial checklist before paid review, PDF export, payment or CRM workflows.
- [Quote review manual trial worksheet](./quote-review-manual-trial-worksheet.md): operator worksheet for unpaid controlled-lead quote-review trials.
- [Quote review first manual trial prep](./quote-review-first-manual-trial-prep.md): first controlled-lead trial sequence and quality gate before payment, PDF automation or CRM.
- [Quote review first trial filled example](./quote-review-first-trial-filled-example.md): fake no-customer-data filled example for training the first unpaid manual trial.
- [Quote review second trial service relocation example](./quote-review-second-trial-service-relocation-example.md): fake no-customer-data full-renovation scenario testing plumbing, electrical, gas, demolition and make-good prompts.
- [Quote review controlled lead trial log](./quote-review-controlled-lead-trial-log.md): real controlled-lead log template for tracking service-relocation prompt usage before changing public intake copy.
- [Quote review manual response draft](./quote-review-manual-response-draft.md): one-page copy/paste response format for the first real controlled quote-review lead.
- [Quote review manual trial pack](./quote-review-manual-trial-pack.md): one-page guide linking the worksheet, snippets, trial log, sample and paid-service packaging.
- [Quote review manual trial runbook](./quote-review-manual-trial-runbook.md): operator workflow for unpaid manual quote-review trials before payment or PDF automation.
- [Quote review sample trial](./quote-review-sample-trial.md): fake no-customer-data sample for training and template review.
- [Quote review trial log](./quote-review-trial-log.md): repeatable log for manual controlled quote-review trials.
- [Quote review wording snippets](./quote-review-wording-snippets.md): customer-safe snippets for scope clarity, allowance risk, site measure and compliance prompts.
- [Paid quote review service packaging](./paid-quote-review-service-packaging.md): future paid detailed review inclusions, exclusions, customer-safe report structure, delivery expectations and refund/cancellation principles without payment implementation.
- [Paid review launch blockers](./paid-review-launch-blockers.md): blockers that must be solved before paid detailed review goes live.
- [Report delivery workflow draft](./report-delivery-workflow-draft.md): future manual/paid report delivery flow without payment, PDF automation or CRM.

## File Uploads

- [File upload architecture spec](./file-upload-architecture-spec.md): current server-mediated storage path, private bucket posture, admin metadata display and future signed download/deletion/retention design.
- [File upload MVP completion plan](./file-upload-mvp-completion-plan.md): implementation-ready sequence for admin signed downloads, deletion controls and retention metadata before runtime work.
- [File upload release candidate summary](./file-upload-release-candidate-summary.md): what the signed-download batch would release and how to verify it.
- [File upload release preflight](./file-upload-release-preflight.md): pre-deploy checklist for env vars, private bucket, metadata table and local tests.
- [File upload approved release runbook](./file-upload-approved-release-runbook.md): one-approved-release flow for storage, metadata, signed download and metadata soft-delete verification.
- [Signed download live verification checklist](./signed-download-live-verification-checklist.md): one-deploy production verification steps after approval.
- [Signed download one-deploy checklist](./signed-download-one-deploy-checklist.md): compact release checklist for one future approved signed-download deploy.
- [Signed download troubleshooting](./signed-download-troubleshooting.md): safe diagnostic guide for admin signed-download failures.
- [Admin file delete UI design](./admin-file-delete-ui-design.md): future delete-button UX, confirmation copy and request guardrails without adding the live button yet.
- [Soft delete release preflight](./soft-delete-release-preflight.md): metadata-only soft-delete readiness checks before visible delete UI.
- [Soft delete one-deploy checklist](./soft-delete-one-deploy-checklist.md): compact verification checklist for one future approved metadata soft-delete function release.
- [File retention decision worksheet](./file-retention-decision-worksheet.md): decisions needed before retention automation or fixed retention periods.
- [Supabase file upload SQL checklist](./supabase-file-upload-sql-checklist.md): manual bucket/table/retention SQL checks for Vincent.
- [File upload runtime slice decision](./file-upload-runtime-slice-decision.md): choose between deploying signed downloads, continuing local delete-function work, or pausing file ops.
- [Supabase request-review storage notes](./supabase-kitchen-request-reviews.md): manual SQL, request-review lead storage, file metadata table and upload troubleshooting.

## Domain, Email And Operations

- [Domain and email launch checklist](./domain-email-launch-checklist.md): future domain, DNS and Resend setup steps.
- [Domain, email and Resend verification runbook](./domain-email-resend-verification-runbook.md): source-of-truth, env var, email content and failure-handling guide.
- [Analytics events](./analytics-events.md): analytics event names and intended future usage.
- [Operational readiness](./operational-readiness.md): future operational path and backend readiness notes.
- [Deployment parity](./deployment-parity.md): static export and Netlify publish-directory parity notes.
- [Architecture](./architecture.md): broader system architecture and roadmap notes.
- [SEO controlled rollout backlog](./seo-controlled-rollout-backlog.md): safe SEO sequence for existing quote-risk, materials, apartment/strata and area pages before new page expansion.

## Quick Rules

- Work only inside `/Users/daibang/Documents/operon-kitchens/**`.
- Do not edit Operon Flooring or Oz Timber Floor.
- Do not deploy or push unless explicitly approved.
- Supabase is the source of truth for leads.
- Email is notification only.
- Do not expose supplier costs, internal rates, margins, lead scores, admin priority, internal notes, service keys or hidden pricing logic.
- Do not promise final fixed quote, legal approval, compliance approval, HBC approval, strata approval, guaranteed savings or instant custom kitchen ordering.
