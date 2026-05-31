# Operon Kitchens Agent Policy

Source-of-truth status: active execution rules for Codex and future agents working on Operon Kitchens.

## Project Identity

Operon Kitchens is a separate customer-facing kitchen renovation brand. It must not be merged into Operon Flooring, Oz Timber Floor, or any shared/root web app.

Customer-facing language should focus on:

- clear kitchen renovation estimates
- quote confidence
- scope clarity
- assumptions and exclusions
- compliance-aware review
- professional next step before a final quote

Do not position Operon Kitchens as a gimmicky AI product. Technology is a backend advantage, not the public headline.

## Main Instruction

Codex may do whatever is reasonably required to build, fix, refactor, test, and improve Operon Kitchens, provided all write operations stay inside:

`/Users/daibang/Documents/operon-kitchens/**`

Codex does not need to ask permission for normal implementation work inside this folder after Vincent gives a task.

Codex may:

- create files
- edit files
- delete kitchen-only files
- rename kitchen-only files
- refactor kitchen-only code
- create kitchen-only tests
- fix kitchen-only errors
- improve kitchen-only UI/UX
- improve kitchen-only SEO
- improve kitchen-only quote logic
- create kitchen-only Supabase migrations, configs, and functions
- create kitchen-only docs
- run lint, tests, and build
- continue until the task is complete, blocked, or unsafe

## Hard Boundary

Codex must not edit anything outside:

`/Users/daibang/Documents/operon-kitchens`

Codex may read other repositories or folders for context only, including Operon Flooring or Oz Timber Floor, but must not modify them.

Forbidden write zones:

- Operon Flooring website/app
- Oz Timber Floor website/app
- global/root monorepo config
- global redirects
- global sitemap
- global Netlify config
- shared flooring quote logic
- shared flooring product data
- shared flooring Supabase functions
- production database objects used by Flooring or Oz Timber
- any file outside `/Users/daibang/Documents/operon-kitchens`

## Shared Infrastructure Rule

Codex may work with shared infrastructure only if the change is clearly isolated to Operon Kitchens and cannot affect other brands.

Allowed kitchen-scoped shared infrastructure work:

- create kitchen-specific Supabase tables
- create kitchen-specific Supabase migrations inside the Operon Kitchens folder
- create kitchen-specific Edge Functions inside the Operon Kitchens folder
- create kitchen-specific storage bucket rules or config files inside the Operon Kitchens folder
- create kitchen-specific lead models
- create kitchen-specific CRM statuses
- create kitchen-specific quote engine interfaces
- create kitchen-specific admin abstractions
- create kitchen-specific environment examples
- create kitchen-specific analytics events
- create kitchen-specific file upload handlers

Kitchen-specific names must be clearly isolated using naming such as:

- `kitchen_`
- `kitchens_`
- `operon_kitchens_`
- `project_type = "kitchens"`
- `vertical = "kitchens"`

Codex must not modify existing Flooring/Oz Timber Supabase tables, policies, functions, buckets, storage rules, triggers, or migrations.

If shared Supabase access is needed, Codex should create kitchen-only migrations/configuration inside the Operon Kitchens folder and document what must be applied later. Do not directly change production data or shared production resources unless Vincent explicitly approves.

Shared infrastructure must be kitchen-namespaced, additive, non-destructive, and reversible. Future shared backend patterns may be documented or scaffolded inside this repository only when they cannot affect Flooring, Oz Timber, production users, or shared production Supabase resources.

## Non-Destructive Database Rule

Codex must not:

- drop tables
- delete columns
- rename shared tables
- alter shared Flooring/Oz Timber tables
- change existing RLS policies used by other apps
- change shared storage buckets used by other apps
- modify production data
- overwrite existing migrations from other projects

If database work is needed, Codex should create additive kitchen-only migrations.

Examples of acceptable database changes:

- create table `kitchen_leads`
- create table `kitchen_quotes`
- create table `kitchen_quote_files`
- create table `kitchen_rate_cards`
- create table `kitchen_admin_notes`
- create table `kitchen_project_events`
- create bucket `operon-kitchens-files`
- create kitchen-only RLS policies
- create kitchen-only Edge Function scaffold

Examples of unacceptable database changes:

- editing `flooring_leads`
- editing `flooring_quotes`
- changing shared `quote_files` bucket used by Flooring
- modifying existing production RLS policies
- changing shared users/auth logic without approval
- deleting or renaming existing tables

## Shared Code Rule

If Codex needs functionality from another app, it may read it for reference, but must not edit the original shared file.

Preferred approach:

1. Read existing implementation for context.
2. Recreate or adapt a kitchen-specific version inside `/Users/daibang/Documents/operon-kitchens`.
3. Keep the kitchen implementation isolated.
4. Document later opportunities for shared infrastructure.

Do not create tight coupling between Operon Kitchens and Operon Flooring.

## Dependencies And Config Rule

Codex may install or configure dependencies only if the dependency files are inside:

`/Users/daibang/Documents/operon-kitchens`

If the project requires root-level `package.json`, root `tsconfig`, root build config, root Netlify config, or other files outside the kitchen folder, Codex must stop and ask Vincent first.

Do not edit:

- root `package.json`
- root `package-lock.json`
- root `pnpm-lock.yaml`
- root `tsconfig`
- root `next.config`
- root `tailwind.config`
- root `netlify.toml`
- global redirects
- global sitemap
- global environment files

unless Vincent explicitly approves.

## Environment Variable Rule

Codex may create or update kitchen-only environment examples such as:

`/Users/daibang/Documents/operon-kitchens/.env.example`

Codex must not edit real production environment files or root environment files.

Allowed examples:

- `NEXT_PUBLIC_OPERON_KITCHENS_SUPABASE_URL`
- `NEXT_PUBLIC_OPERON_KITCHENS_SUPABASE_ANON_KEY`
- `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`
- `OPERON_KITCHENS_RESEND_API_KEY`
- `OPERON_KITCHENS_STORAGE_BUCKET`

Do not reuse ambiguous shared names if they may affect Flooring or Oz Timber.

## Autonomy Rule

After Vincent gives a task, Codex should proceed without repeatedly asking permission for normal kitchen-only implementation work.

Codex should only stop and ask if:

1. The required change touches outside `/Users/daibang/Documents/operon-kitchens`
2. The required change affects Operon Flooring
3. The required change affects Oz Timber Floor
4. The required change affects shared production Supabase resources
5. The required change modifies root/global config
6. The required change changes deployment settings
7. The required change requires destructive database operations
8. The task requires committing or pushing to Git
9. The task requires secrets, credentials, or production access
10. The task creates risk of breaking another web app

## Blast-Radius Check

Before making any change involving shared infrastructure, Codex must perform a blast-radius check:

- Does this change affect only Operon Kitchens?
- Is the file inside `/Users/daibang/Documents/operon-kitchens`?
- Is the database/table/function/storage bucket kitchen-namespaced?
- Could this break Operon Flooring?
- Could this break Oz Timber Floor?
- Could this affect production users?
- Is the change additive and reversible?

If the answer is uncertain, Codex must stop and ask Vincent.

## Implementation Standard

For every task, Codex should:

- inspect relevant kitchen files
- make kitchen-only changes
- keep implementation clean and professional
- avoid overbuilding
- avoid exposing internal costs or margins
- keep customer-facing copy premium and clear
- maintain separation from Operon Flooring
- run available tests, lint, and build
- fix kitchen-only errors introduced by the task

## Phase 1 Product Guardrails

Phase 1 is quote intake, quote review, budget estimate range, confidence scoring, assumptions, exclusions, compliance flags, professional review routing, and lead capture.

Codex must not add or imply the following in Phase 1 unless Vincent explicitly approves a later phase:

- final fixed quote claims
- guaranteed pricing claims
- supplier cost exposure
- internal rate or margin exposure
- payment systems
- customer login/authentication expansion
- full 3D planner or production design tool
- live supplier API integrations
- production database changes
- destructive database migrations

The online estimate must be described as a planning estimate or estimate range. Final pricing must require site review, approved selections, licensed trade confirmation where relevant, and written professional confirmation.

## Current Controlled-Launch Status

As of 31 May 2026:

- Static export deployment is working from `out`.
- `/request-review` posts to `/.netlify/functions/kitchen-request-review`.
- Valid request-review leads are stored in Supabase table `public.kitchen_request_reviews`.
- `/admin/leads` is token-protected with `OPERON_KITCHENS_ADMIN_TOKEN`.
- Attribution fields are supported: `source_route`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, and `landing_page`.
- Resend email notification code exists but may be disabled until a branded sender/domain is ready.
- File uploads are not implemented for request-review storage.
- A known controlled-launch friction point is that `/quote/review` still has a legacy `/api/leads` submit path; for static export, prefer routing quote-review submission to `/request-review` or refactor it to the Netlify Function before sending broad traffic.

## Customer-Safe Quote Rules

Customer-facing pages and API responses may show only customer-safe quote fields:

- planning estimate range
- confidence score and label
- confidence reasons
- review risk score and label
- risk reasons
- included scope
- assumptions
- exclusions
- manual review flags
- compliance prompts
- recommended next step

Never expose customer-visible supplier costs, internal rates, line item cost stack, margin logic, markup, lead scores, lead priority, admin priority, internal notes, service role keys, API keys, or hidden pricing assumptions.

Use the customer-safe projection layer in `src/lib/quotePresentation.ts` when rendering quote summaries. Lead scoring is internal only.

## Compliance And Risk Wording

Use careful language:

- planning estimate
- indicative range
- requires review
- may require confirmation
- subject to site measure
- written scope confirmation required
- general guidance only
- not legal advice
- not a final quote

Avoid:

- final fixed quote
- guaranteed quote
- guaranteed savings
- approved
- certified
- compliant
- legal advice
- compliance approval
- order instantly
- order a full custom kitchen online

Prompts may mention written contract review over $5,000 including GST, 10% deposit guidance, HBC review over $20,000 including GST, licensed plumbing/electrical/gas review, strata/apartment review, DBP/class 2 screening, engineered-stone restrictions, older-property/asbestos review, final site measure, and written scope confirmation. These must remain general review flags, not legal/compliance certification.

## Netlify Deploy Minimisation Rule

Netlify credits are limited. Do not deploy unless deployment is unavoidable.

Default workflow:

1. Inspect local files.
2. Run local tests.
3. Run local lint.
4. Run local build/static export.
5. Verify files under `out` when route output matters.
6. Report whether deployment is required, optional, or not needed.

Do not run repeated clear-cache deploys unless production/runtime behaviour must be verified. If a deploy is requested, commit/push only when Vincent explicitly asks or the task explicitly requires it.

## Standard Commands

Run these before reporting completion unless the user explicitly scopes the task to documentation-only and no code behaviour changed:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

For static export route checks, inspect `out/*.html` after `npm run build`.

## Repo Operating Documents

Before a substantial task, read these files as needed:

- `PROJECT_BRIEF.md` for strategy and product status.
- `CODEX_TASKS.md` for current next tasks and deferrals.
- `DEPLOYMENT_RULES.md` for deploy constraints.
- `DECISION_LOG.md` for important decisions and rationale.
- `docs/release-checkpoints.md` for release gates.
- `docs/controlled-launch-checklist.md` for live controlled-test QA.

## Final Report

At the end of each task, Codex must report:

1. Files created
2. Files modified
3. Files deleted, if any
4. Tests run
5. Build/lint result
6. Supabase/database changes proposed or created
7. Any shared infrastructure touched
8. Confirmation that no Flooring or Oz Timber files were modified
9. Anything deferred
10. Any approval needed from Vincent
