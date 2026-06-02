# Operon Kitchens Codex Tasks

Last updated: 2 June 2026

Read `AGENTS.md`, `PROJECT_BRIEF.md`, `DEPLOYMENT_RULES.md`, `DECISION_LOG.md` and `docs/release-checkpoints.md` before every implementation task.

## Current Phase

Controlled testing / local hardening while Netlify deploys are paused.

Vincent is low on Netlify credits. Do not deploy, push to `main`, create deploy previews, run clear-cache deploys or perform production verification unless explicitly approved.

## Current Priority

Make controlled customer testing operationally smoother without adding major runtime features.

Current local file-upload status:

- admin signed-download function and `/admin/leads` download button are prepared locally
- file retention SQL and deletion design guardrails are documented
- no delete button, delete runtime, retention automation or customer file portal is live
- next decision: deploy signed downloads once, or continue local-only with delete-function tests and function

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

5. Prepare file-upload architecture spec without new runtime implementation.
   - Current storage path.
   - Private bucket posture.
   - Admin metadata display.
   - Future signed downloads.
   - Future deletion and retention rules.
   - Keep the file upload MVP completion plan aligned before runtime file operations.

8. Prepare the next file-operation slice.
   - Option A: approved one-deploy signed-download release and verification.
   - Option B: local-only delete-function tests and token-gated soft-delete function.
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
