# Operon Kitchens Codex Tasks

Last updated: 27 June 2026

Read `AGENTS.md`, `PROJECT_BRIEF.md`, `DEPLOYMENT_RULES.md`, `DECISION_LOG.md` and `docs/release-checkpoints.md` before every implementation task.

## Current Phase

Controlled testing / local hardening while Netlify deploys are paused.

Vincent is low on Netlify credits. Do not deploy, push to `main`, create deploy previews, run clear-cache deploys or perform production verification unless explicitly approved.

## Current Priority

Make controlled customer testing operationally smoother without adding major runtime features.

Phase 1 conversion-grade public experience is complete locally. Do not keep re-opening homepage, quote/review positioning, FAQ, trust pages, header/footer or chatbot as broad Phase 1 work unless Vincent reports a specific blocker from testing.

## Advanced design-build tool stage gate

Use `docs/advanced-kitchen-design-build-tool-implementation-tracker.md` before any advanced design-build work.

Current status:

- Phase 0 baseline audit and source-of-truth plan are complete.
- Phase 1 structured design brief assistant is implemented locally and complete after Vincent approved Phase 2.
- Phase 2 kitchen scope builder is implemented locally and complete after Vincent approved Phase 3.
- Phase 2 automated local viewport metrics passed at 1440, 1280, 768, 390 and 360 widths with no horizontal overflow.
- Phase 3 allowance and quote-risk engine is implemented locally inside the hidden `/scope-builder` review step, has passed local viewport metrics and is approved for Phase 5 planning.
- Phase 5 internal review-console integration planning is documented locally.
- Phase 5 slice 1 local projection helpers are implemented in `src/lib/advancedReviewConsole.ts` with tests in `test/advancedReviewConsole.test.ts`.
- Phase 5 slice 2 storage-adapter planning is documented in `docs/advanced-kitchen-design-build-tool-phase-5-slice-2-storage-adapter-plan.md`.
- Phase 5 slice 2 storage-adapter interface sketch is implemented in `src/lib/advancedReviewStorage.ts` with tests in `test/advancedReviewStorage.test.ts`.
- Phase 5 slice 2 no-write mock adapter harness is implemented in `test/helpers/advancedReviewStorageMockHarness.ts` with tests in `test/advancedReviewStorageMockHarness.test.ts`.
- Phase 5 Netlify Function contract test plan for `kitchen-advanced-review-payload` is documented in `docs/advanced-kitchen-design-build-tool-phase-5-netlify-function-contract-test-plan.md`.
- Phase 5 `kitchen-advanced-review-payload` request/response contract fixtures and a thin test helper are implemented in `test/fixtures/advancedReviewPayloadFunctionFixtures.ts` and `test/helpers/advancedReviewPayloadFunctionContractHelper.ts`.
- Phase 5 thin function implementation plan is documented in `docs/advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md`.
- Phase 5 helper-only runtime slice is implemented in `src/lib/advancedReviewPayloadFunction.ts` with mock-adapter contract tests.
- Phase 5 wrapper-only implementation plan is documented in `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md`.
- Phase 5 wrapper contract tests are implemented in `test/advancedReviewPayloadWrapperContract.test.ts`.
- Phase 5 disabled/no-write wrapper creation plan is documented in `docs/advanced-kitchen-design-build-tool-phase-5-disabled-wrapper-creation-plan.md`.
- Phase 5 disabled/no-write Netlify wrapper is implemented in `netlify/functions/kitchen-advanced-review-payload.ts` with tests in `test/advancedReviewPayloadDisabledWrapper.test.ts`.
- Phase 5 real Supabase adapter planning is documented in `docs/advanced-kitchen-design-build-tool-phase-5-real-supabase-adapter-plan.md`.
- Phase 5 mocked Supabase adapter contract tests are implemented in `test/helpers/advancedReviewSupabaseAdapterContractHarness.ts` and `test/advancedReviewSupabaseAdapterContract.test.ts`.
- Phase 5 real adapter implementation planning is documented in `docs/advanced-kitchen-design-build-tool-phase-5-real-adapter-implementation-plan.md`.
- Phase 5 real Supabase adapter is implemented locally in `src/lib/advancedReviewSupabaseStorage.ts` with mocked-fetch tests in `test/advancedReviewSupabaseStorage.test.ts`.
- Phase 5 wrapper replacement planning is documented in `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md`.
- Phase 5 wrapper replacement contract tests are implemented in `test/advancedReviewPayloadWrapperReplacementContract.test.ts`.
- Phase 5 SQL migration and wrapper replacement activation checklists are documented in `docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md`.
- Phase 5 exact SQL-only approval packet is prepared in `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql`.
- Phase 5 wrapper replacement implementation checklist is prepared in `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md`.
- Phase 5 wrapper replacement patch plan is prepared in `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md`.
- Phase 5 active-wrapper contract tests are prepared in `test/advancedReviewPayloadActiveWrapperContract.test.ts`.
- Phase 5 wrapper activation readiness review is prepared in `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-activation-readiness-review.md`.
- Phase 5 local active wrapper replacement is implemented in `netlify/functions/kitchen-advanced-review-payload.ts` with mocked tests only.
- Phase 5 production persistence activation, Supabase migration, admin UI runtime and browser submission wiring have not started.
- `/design-brief` exists but is disabled by default behind `NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_DESIGN_BRIEF`.
- `/scope-builder` exists but is disabled by default behind `NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER`.
- Do not expose `/design-brief` in header, footer, chatbot or sitemap until Vincent approves it after local review.
- Do not expose `/scope-builder` in header, footer, chatbot or sitemap until Vincent approves it after local review.
- Keep Phase 1, Phase 2 and Phase 3 deterministic, feature-flagged off by default, customer-safe and non-persistent.
- Do not add AI summarisation, file-upload expansion, payment, full CRM, production Supabase migrations or production deploys as part of this advanced-tool work.
- Do not start Phase 5 slice 2 runtime storage implementation until the storage-adapter interface sketch and mock harness have been human reviewed and explicitly approved for coding.

Core docs:

- `docs/advanced-kitchen-design-build-tool-master-plan.md`
- `docs/advanced-kitchen-design-build-tool-implementation-tracker.md`
- `docs/advanced-kitchen-design-build-tool-product-architecture.md`
- `docs/advanced-kitchen-design-build-tool-data-contracts.md`
- `docs/advanced-kitchen-design-build-tool-decisions.md`
- `docs/advanced-kitchen-design-build-tool-phase-1-spec.md`
- `docs/advanced-kitchen-design-build-tool-phase-2-spec.md`
- `docs/advanced-kitchen-design-build-tool-phase-2-viewport-review.md`
- `docs/advanced-kitchen-design-build-tool-phase-3-spec.md`
- `docs/advanced-kitchen-design-build-tool-phase-3-viewport-review.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-planning-spec.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-slice-2-storage-adapter-plan.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-netlify-function-contract-test-plan.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-disabled-wrapper-creation-plan.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-real-supabase-adapter-plan.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-real-adapter-implementation-plan.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-activation-readiness-review.md`
- `docs/advanced-kitchen-design-build-tool-phase-0-baseline-audit.md`

Use `docs/current-stage-execution-order.md` for the one-by-one order of the current stage. The current sequence is:

1. trust polish release bundle
2. local visual-system release review
3. file-upload MVP release prep
4. domain/email/Resend readiness
5. quote-review manual trial

Use `docs/next-30-local-tasks-2026-06-17.md` for the current no-deploy execution queue.

Use `docs/controlled-testing-handoff.md` as the daily operator-facing summary before opening the deeper controlled-testing docs.

Use `docs/next-30-local-tasks-2026-06-17-handoff-batch.md` for the second approved no-deploy queue covering the handoff, request-review/admin audit, file-operation checklists and manual quote-review trial pack.

Use `docs/next-100-local-tasks-2026-06-17.md` for the current 100-task no-deploy readiness batch covering release gates, file upload, domain/email, manual quote-review trials, admin operations, SEO backlog and risk tracking.

Use `docs/release-decision-note-vincent-2026-06-17.md` when Vincent asks what should be released next or whether file-upload backend operations should be bundled with the trust/visual polish release.

Use `docs/next-100-local-tasks-2026-06-17-release-decision-visual-batch.md` for the latest no-deploy release-decision and visual-polish batch.

Use `docs/next-100-local-tasks-2026-06-17-viewport-release-readiness.md` for the latest no-deploy viewport and release-readiness batch.

Use `docs/next-100-local-tasks-2026-06-20-controlled-feedback.md` for the latest no-deploy controlled-feedback batch that captures tester findings, CTA visibility issues and release-bundle decisions.

Use `docs/next-500-local-tasks-2026-06-23.md` when Vincent asks to "work on the next 500 tasks" or similar broad continuation prompts. Treat it as a grouped local execution map, not deployment approval.

Use `docs/local-viewport-review-2026-06-17.md` for the current local viewport result across `/`, `/quote/review`, `/request-review`, `/site-measure` and `/admin/leads`.

Use `docs/release-smoke-check-pack-2026-06-17.md` only after Vincent explicitly approves one deploy.

Use `docs/trust-visual-release-candidate-summary-2026-06-20.md` when Vincent asks what is in the next trust/visual release candidate or wants a concise approval summary.

Current local file-upload status:

- admin signed-download function and `/admin/leads` download button are prepared locally
- Supabase signed URL normalisation fix is prepared locally after live download returned `requested path is invalid`
- token-gated soft-delete function and tests are prepared locally
- file retention SQL and deletion design guardrails are documented
- no delete button, physical object deletion, retention automation or customer file portal is live
- next decision: approve one release for signed download + soft-delete function, or keep working local-only

Current quote-review packaging status:

- quote-review report template and readiness checklist are documented
- Paid quote-review service packaging is documented for future detailed review
- first unpaid manual quote-review trial prep is documented in `docs/quote-review-first-manual-trial-prep.md`
- first fake no-customer-data filled trial example is documented in `docs/quote-review-first-trial-filled-example.md`
- second fake service-relocation trial example is documented in `docs/quote-review-second-trial-service-relocation-example.md`
- quote-review manual worksheet now has optional operator-only service-relocation prompts for plumbing, electrical, gas, make-good and older-property review
- real controlled-lead service-relocation tracking is documented in `docs/quote-review-controlled-lead-trial-log.md`
- service-relocation wording snippets are added to `docs/quote-review-wording-snippets.md` for manual reports
- one-page manual quote-review response draft is documented in `docs/quote-review-manual-response-draft.md`
- next-500 grouped local execution map is documented in `docs/next-500-local-tasks-2026-06-23.md`
- payment, checkout, PDF automation, customer accounts and full CRM remain deferred
- next quote-review decision: decide whether to refine the worksheet service-relocation prompts after two or three controlled leads, then refine report copy before any paid-service implementation

Current 100-task readiness status:

- release gate decision note is documented
- Vincent-facing release decision note is documented for trust/visual-only versus file-upload backend release choices
- release-decision and visual-polish 100-task batch is documented
- file-upload approved-release runbook is documented
- domain/email/Resend verification runbook is documented
- quote-review manual trial runbook is documented
- controlled testing feedback scorecard is documented
- admin weekly operations review is documented
- SEO controlled rollout backlog is documented
- operations risk register is documented
- no deploy, no push and no production verification are approved by this local batch

Current visual-system status:

- Operon Kitchens branch logo refresh is prepared locally using PNG assets generated from Vincent's approved raster logo reference
- white Operon Flooring-style header/page chrome is prepared locally
- rounded dark footer container with white spacing is prepared locally
- primary CTA/button ink now follows the Operon Flooring footer colour `#142f38`
- current Operon System visual alignment audit is documented in `docs/operon-system-visual-alignment-audit.md`
- Operon System palette aliases are present in global CSS for navy, gold, warm white, charcoal, borders, cards and soft shadow
- footer Company links include Projects/examples while `/admin/leads` remains excluded from public navigation
- chatbot styling has a tighter navy/gold brand shell with separated prompt buttons and safe guidance copy
- visual-system regression tests are prepared locally
- no visual bundle has been pushed or deployed
- next visual decision: review `/`, `/request-review`, `/quote/review` and `/admin/leads` locally at desktop and mobile widths, then decide whether to include this in one approved release checkpoint
- latest viewport review: `/`, `/quote/review`, `/request-review`, `/site-measure` and `/admin/leads` were checked locally at 1440, 1280, 768, 390 and 360 widths with no horizontal overflow found
- latest copy tightening: public strata wording now uses approval-review / owners-corporation-review language rather than implying Operon grants approval
- latest controlled-testing capture: homepage final CTA ghost buttons are fixed locally, tracked in `docs/controlled-testing-findings-log.md`, and waiting for the next approved trust/visual release
- latest release summary: `docs/trust-visual-release-candidate-summary-2026-06-20.md` is the one-page approval note for the next trust/visual deploy
- latest public trust gate: footer links are organised into Quote & review, Services, Guides and Areas & company; `/pc-sums-provisional-sums` is a short alias to the canonical PC sums guide; `docs/public-trust-gate-operon-kitchens.md` records the local no-deploy trust gate

## Local-Only Task Queue

1. Review and maintain the controlled-launch checklist.
   - Keep manual test steps clear.
   - Ensure daily `/admin/leads` checks are covered while email is off.
   - Ensure no internal fields leak.

2. Improve request-review and admin usability locally only.
   - Small copy, spacing, state and readability improvements are acceptable.
   - Do not deploy until Vincent approves a release checkpoint.

3. Prepare domain/email/Resend checklist.
   - Domain purchase.
   - Netlify DNS/domain connection later.
   - Resend verified domain/sender.
   - Netlify env vars for email.
   - One production lead test after approval.

4. Prepare quote-review report template.
   - Scope clarity.
   - Allowance risk.
   - Missing information.
   - Customer questions.
   - Compliance prompts.
   - Recommended next step.
   - No legal approval or final quote claims.
   - Keep the paid quote-review service packaging aligned with the report template before payment is considered.

5. Prepare file-upload architecture spec without new runtime implementation.
   - Current storage path.
   - Private bucket posture.
   - Admin metadata display.
   - Future signed downloads.
   - Future deletion and retention rules.
   - Keep the file upload MVP completion plan aligned before runtime file operations.

8. Prepare the next file-operation slice.
   - Option A: approved one-deploy signed-download + soft-delete function release and verification.
   - Option B: local-only delete-button UI design/tests without runtime deployment.
   - Option C: pause file operations and return to quote-review service packaging.

6. Prepare lead handling playbook.
   - Status meanings.
   - Follow-up timing.
   - Internal notes style.
   - When to request site measure.
   - What not to promise.

7. Keep docs aligned.
   - `PROJECT_BRIEF.md`
   - `DEPLOYMENT_RULES.md`
   - `DECISION_LOG.md`
   - `docs/release-checkpoints.md`
   - `docs/controlled-testing-playbook.md`

9. Review the local visual release candidate.
   - Homepage white header and logo.
   - Operon Flooring-style rounded footer.
   - Button colour consistency.
   - Mobile hero and sticky CTA wrapping.
   - Request-review and quote-review form spacing.
   - Admin lead readability.
   - Do not deploy until Vincent approves a release checkpoint.

10. Use the release smoke-check pack only when Vincent approves one deploy.
   - Check `/`, `/quote/review`, `/request-review`, `/site-measure`, `/faqs` and `/admin/leads`.
   - Include file-upload signed-download verification only if Vincent chooses the file bundle.
   - Stop after one smoke-check cycle.

## Explicitly Deferred

Do not implement unless Vincent explicitly approves:

- deployment or push to `main`
- production verification
- file upload expansion beyond current safe scaffolding
- admin file download/deletion workflows
- retention automation
- payment or checkout
- customer auth/login expansion
- full CRM
- supplier APIs
- full AI document review
- broad SEO page expansion
- custom domain and branded email changes
- production Supabase changes outside documented manual SQL

## Local Verification Commands

Run before reporting completion for implementation work:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

For docs-only work, still run the commands when requested by Vincent.

## Reporting Format

Final reports should include:

1. Files created
2. Files modified
3. Files deleted, if any
4. Tests/lint/build result
5. Deployment status: required, optional or not needed
6. Supabase/database changes proposed, if any
7. Confirmation no Operon Flooring or Oz Timber files were modified
8. Recommended next local-only task
