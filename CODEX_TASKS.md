# Operon Kitchens Codex Tasks

Last updated: 4 June 2026

Read `AGENTS.md`, `PROJECT_BRIEF.md`, `DEPLOYMENT_RULES.md`, `DECISION_LOG.md` and `docs/release-checkpoints.md` before every implementation task.

## Current Phase

Controlled testing / local hardening while Netlify deploys are paused.

Vincent is low on Netlify credits. Do not deploy, push to `main`, create deploy previews, run clear-cache deploys or perform production verification unless explicitly approved.

## Current Priority

Make controlled customer testing operationally smoother without adding major runtime features.

Phase 1 conversion-grade public experience is complete locally. Do not keep re-opening homepage, quote/review positioning, FAQ, trust pages, header/footer or chatbot as broad Phase 1 work unless Vincent reports a specific blocker from testing.

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
- payment, checkout, PDF automation, customer accounts and full CRM remain deferred
- next quote-review decision: run manual unpaid report trials from controlled leads, then refine report copy before any paid-service implementation

Current 100-task readiness status:

- release gate decision note is documented
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
- visual-system regression tests are prepared locally
- no visual bundle has been pushed or deployed
- next visual decision: review `/`, `/request-review`, `/quote/review` and `/admin/leads` locally at desktop and mobile widths, then decide whether to include this in one approved release checkpoint

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
