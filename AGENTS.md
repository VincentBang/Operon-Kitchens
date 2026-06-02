# Operon Kitchens Agent Policy

Source of truth for Codex and future agents working in this repository.

## Project Boundary

All write operations must stay inside:

`/Users/daibang/Documents/operon-kitchens/**`

Codex may read other projects for context only. Do not modify:

- Operon Flooring files
- Oz Timber Floor files
- parent/root shared configs outside this repository
- shared production Supabase resources
- Netlify site settings
- production environment variables

If a task requires writes outside the Operon Kitchens folder, stop and ask Vincent.

## Brand Separation

Operon Kitchens is a separate customer-facing Sydney kitchen renovation quote clarity and quote review platform. It is not Operon Flooring, not Oz Timber Floor, and not a generic renovation brochure site.

Use Operon Flooring only as a structural quality reference when explicitly useful. Do not copy shared production logic or edit Flooring files.

## Deployment Discipline

Vincent is low on Netlify credits.

Default rule: do not deploy.

Do not:

- push to `main` unless Vincent explicitly approves
- trigger Netlify deploys
- create deploy previews
- run clear-cache deploys
- do production verification unless Vincent explicitly approves

Prefer local tests, local lint, local build, static export checks and documentation. Every final report must say whether deployment is required, optional or not needed.

## Product Guardrails

Operon Kitchens may provide:

- planning estimate ranges
- quote confidence and review risk guidance
- quote review intake
- request-review lead capture
- staged next steps toward site measure, written scope and project delivery

Do not promise:

- final fixed quote
- guaranteed savings
- legal approval
- compliance approval
- HBC approval
- strata approval
- certified/compliant outcome
- instant custom kitchen ordering before site measure and written scope

Use safe language:

- planning estimate
- indicative range
- requires review
- may require confirmation
- subject to site measure
- written scope confirmation required
- general guidance only
- not legal advice
- not a final quote

## Internal Field Protection

Never expose customer-facing pages, browser responses, emails, public docs or public logs containing:

- supplier costs
- internal rates
- margin or markup logic
- hidden pricing logic
- line item cost stack
- lead score
- lead priority
- admin priority
- internal follow-up priority
- internal notes
- service role keys
- API keys
- database credentials

Customer-facing quote summaries must use customer-safe projection objects, not raw pricing/admin objects.

## Lead And Notification Rules

Supabase is the source of truth for request-review leads.

Email is notification only. If email is disabled or fails, the lead must still be durable in Supabase before a customer-facing success response claims the request was received.

Do not fake success if neither storage nor notification succeeds.

## Explicit Approval Required

The following require explicit Vincent approval before implementation or deployment:

- file upload product expansion beyond current safe scaffolding
- admin file download/deletion workflows
- payment or paid checkout
- full CRM
- customer accounts or auth expansion
- supplier API integration
- aggressive SEO expansion
- production Supabase changes outside documented kitchen-only SQL
- Netlify deploys or pushes to `main`

## Normal Local Work

For approved local tasks, Codex may:

- edit kitchen-only files
- add kitchen-only docs/tests
- improve local UX/code safely
- run `npm test -- --runInBand`
- run `npm run lint`
- run `npm run build`
- run `git diff --check`

Do not commit unless useful. Do not push unless explicitly approved.

## Reporting Format

Final reports should include:

1. Files created
2. Files modified
3. Files deleted, if any
4. Tests/lint/build run and result
5. Deployment status: required, optional or not needed
6. Supabase/database changes proposed, if any
7. Confirmation no Operon Flooring or Oz Timber files were modified
8. Anything deferred
9. Recommended next local-only task
