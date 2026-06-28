# Phase 0 Baseline Audit: Advanced Kitchen Design-Build Tool

Last updated: 23 June 2026

Deployment status: not needed.

## Framework And Scripts

The repository is a Next.js Pages Router application:

- Next.js `^14.2.35`
- React `18.2.0`
- TypeScript
- static export via `next.config.js` `output: 'export'`
- images unoptimised for export compatibility
- Node engine `>=22 <23`

Available scripts:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm test`
- `npm run test:ci`

`npm run build` runs `next build` and `scripts/verify-build-content.js`.

## Routing Model

Public routes use `src/pages`. Key routes inspected:

- `/`
- `/quote`
- `/quote/[id]`
- `/quote/review`
- `/request-review`
- `/site-measure`
- `/quote-review-service`
- `/how-it-works`
- `/design`
- `/advice`
- `/faqs`
- `/privacy`
- `/terms`
- `/areas`
- `/areas/[slug]`
- education/service pages such as `/kitchen-renovation-cost-sydney`, `/kitchen-quote-review`, `/kitchen-renovation-process`, `/kitchen-pc-sums-and-provisional-sums`

Admin/internal routes:

- `/admin/leads`
- additional local CMS admin pages
- `/auth/signin`
- `/account`

## Current `/quote` Flow

`/quote` renders `QuoteWizard`.

The wizard already captures project, property, layout, inclusions, finishes, services, quote details, contact and estimate summary. It has conversion copy and a safe trust line that planning estimates are not contract pricing.

Data and logic:

- input type: `QuoteInput`
- defaults: `src/lib/quoteDefaults.ts`
- pricing: `src/lib/pricing.ts`
- customer projection: `src/lib/quotePresentation.ts`
- final summary: `src/components/steps/EstimateSummaryStep.tsx`

Important boundary: raw `PricingResult` contains internal fields such as line items, margin, subtotal and lead quality. Customer components should consume `CustomerQuoteSummary`.

## Current `/quote/review` Flow

`/quote/review` is a productised review intake. It captures checklist answers, job details, contact details, acknowledgements and optional files, then can submit through `kitchen-request-review`.

Logic:

- `src/lib/quoteReview.ts`
- deterministic review readiness
- scope clarity, allowance risk, missing information and review readiness
- customer questions, manual review flags and compliance prompts

## Current `/request-review` Flow

`/request-review` collects:

- contact details
- suburb
- property type
- project stage
- current quote status
- photos/plans status
- budget range
- preferred next step
- message
- privacy and terms acknowledgement
- marketing opt-in
- source route and attribution
- optional files

Validation and sanitisation live in `src/lib/requestReview.ts`.

Runtime function:

- `netlify/functions/kitchen-request-review.ts`

Server storage:

- `src/lib/kitchenLeadStorage.ts`
- `src/lib/kitchenFileStorage.ts`

## Current `/site-measure` Flow

`/site-measure` explains measurement, access, services, appliance fit, strata/access and written-scope review. It routes customers to request review, estimate or quote review.

## Current `/admin/leads` Workflow

Admin-lite lead operations use:

- `/admin/leads`
- `netlify/functions/kitchen-admin-leads.ts`
- `netlify/functions/kitchen-admin-lead-update.ts`
- `netlify/functions/kitchen-admin-file-download.ts`
- `netlify/functions/kitchen-admin-file-delete.ts`
- `src/lib/kitchenAdminLeads.ts`
- `src/lib/kitchenAdminFiles.ts`

Security posture:

- simple `OPERON_KITCHENS_ADMIN_TOKEN`
- service role key stays server-side
- admin page is not public navigation
- admin updates are limited to approved status/internal note/file operations

## Supabase Schema And Service Layer

Documented tables:

- `public.kitchen_request_reviews`
- `public.kitchen_request_review_files`

Service adapters use Supabase REST with service role keys server-side only.

Production Supabase changes are not applied by this run.

## Netlify Functions

Functions present:

- `kitchen-request-review`
- `kitchen-admin-leads`
- `kitchen-admin-lead-update`
- `kitchen-admin-file-download`
- `kitchen-admin-file-delete`

These are the production runtime path for a static-export app.

## Chatbot Integration

`KitchenChatbot` is a customer-facing assistant with quick prompts and route CTAs. It uses safe wording around scope, quote and site-measure guidance and does not provide final pricing or legal advice.

## Copy Guardrails

`test/publicCopy.test.ts` scans customer-facing code for internal/commercial and unsafe wording, including margin, supplier cost, internal rate, final price, final fixed quote, MVP, scope??, lead score, guaranteed quote, order instantly and related phrases.

## Test Structure

Tests live under `test/` and cover:

- admin data and admin pages
- admin lead/file operations
- brand assets and visual system
- chatbot
- compliance and material compliance
- controlled-testing docs
- file retention design
- pricing
- privacy notices
- public copy and public structure
- quote presentation
- quote review
- quote wizard
- request-review validation and page
- SEO docs and education

## Analytics And Attribution

`src/lib/analytics.ts` defines event names and dispatches browser custom events. No external analytics vendor is connected.

Request-review captures simple attribution fields without cookies:

- referrer
- UTM source/medium/campaign/content/term
- landing page

## Existing Documentation

The repo has strong operating docs for:

- agent policy
- deployment rules
- controlled testing
- release checkpoints
- file upload architecture
- quote-review manual trial workflow
- domain/email readiness
- SEO rollout
- visual system
- Supabase lead/file storage

This Phase 0 adds the advanced design-build tool source-of-truth docs.

## Technical Constraints

- Static export means public pages must not depend on SSR.
- Next API routes under `src/pages/api` are not the preferred production runtime for Netlify static export.
- Netlify Functions should handle runtime request/review/admin storage.
- Netlify credits are limited; no deploy unless approved.
- Production Supabase changes are manual/approval-gated.
- Customer-safe boundaries must be preserved.

## Data Already Captured

Current flows capture:

- estimate/project basics
- property/access details
- layout/size
- scope inclusions
- finishes and allowances
- service and risk flags
- quote review checklist and job details
- request-review contact/project details
- files when configured
- attribution
- admin status and internal notes

## Data Gaps For Advanced Tool

Phase 1 design brief gaps:

- current kitchen problems
- must-have outcomes
- style direction
- storage priorities
- appliance intentions
- explicit quote-status category for design brief routing
- readiness state separate from quote confidence
- missing-information checklist tied to pathway routing

Phase 2 scope gaps:

- structured room/wall dimensions
- ceiling height
- window/door positions
- cabinet zones independent of pricing quantities
- appliance location map
- make-good interfaces
- service-change records with licensed review prompts

Phase 3 risk gaps:

- first-class allowance item list
- first-class risk flags independent of raw pricing
- customer questions tied to risk categories
- human-review flags designed for admin handoff

## Public Trust Gate

Source review found the major historic public trust blockers appear addressed locally:

- chatbot component no longer contains the old `scope??Ask` text
- footer is consolidated in `PublicLayout`
- `/faqs` exists as a static page
- quote/review pages use planning/review language rather than final quote language
- public copy guardrails exist

The command gate must still pass before Phase 0 is treated as local-QA ready.
