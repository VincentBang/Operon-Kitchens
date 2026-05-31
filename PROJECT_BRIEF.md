# Operon Kitchens Project Brief

Last updated: 31 May 2026

## Strategy

Operon Kitchens is a separate customer-facing Sydney kitchen renovation quote clarity, quote review, and staged-ordering platform under the broader Operon Group.

It is not a generic renovation brochure site and it must not be treated as part of Operon Flooring or Oz Timber Floor. It is the kitchen vertical proof layer for a future trade-focused operating system, Operon OS.

Public positioning:

- Check likely kitchen renovation price.
- Understand planning estimate range.
- Understand quote confidence.
- Upload quote/photos/plans when storage is ready.
- Review inclusions, exclusions, PC sums and provisional sums.
- Identify scope, risk and NSW review prompts.
- Move toward professional review, site measure, written scope and project delivery.

Customer promise:

`Check price, understand scope, review quotes, then order with confidence after site measure.`

Do not position the site as an AI gimmick. Technology is a backend advantage, not the public headline.

## Safe Customer Journey

The intended journey is:

1. Free planning estimate.
2. Upload quote/photos/plans or provide request-review details.
3. Basic quote review.
4. Optional detailed review later.
5. Site measure.
6. Design/specification.
7. Written quote.
8. Contract/deposit.
9. Project delivery.

Do not imply that a full custom kitchen can be ordered online before site measure and written scope confirmation.

## Current Controlled-Launch Status

Current status:

- Static export deployment is working from `out`.
- Netlify publish directory should be `out`, not `.next`.
- `/request-review` is live and posts to Netlify Function `kitchen-request-review`.
- Valid request-review leads are stored in Supabase table `public.kitchen_request_reviews`.
- `/admin/leads` is live and protected by `OPERON_KITCHENS_ADMIN_TOKEN`.
- Attribution/UTM tracking is supported and documented.
- Resend notification logic exists but email may remain disabled until a verified branded sender/domain is available.
- No custom domain yet.
- No file upload storage yet.
- No payment.
- No customer login.
- No full CRM.
- No supplier API.

Controlled-launch note:

- `/quote/review` has been refactored locally to submit through `/.netlify/functions/kitchen-request-review` instead of static-export API routes. Deploy this fix before sending broad traffic to `/quote/review`.

## Core Modules

- Public website: homepage, quote wizard, quote review, request-review, service pages, area pages, guides, FAQ, privacy and terms.
- Estimate engine: `src/lib/pricing.ts`.
- Customer-safe quote projection: `src/lib/quotePresentation.ts`.
- Quote review engine: `src/lib/quoteReview.ts`.
- Request-review validation: `src/lib/requestReview.ts`.
- Request-review storage: `src/lib/kitchenLeadStorage.ts`.
- Admin-lite lead operations: `src/lib/kitchenAdminLeads.ts`, `src/pages/admin/leads.tsx`, and Netlify admin functions.
- Analytics readiness: `src/lib/analytics.ts` and `docs/analytics-events.md`.

## Customer-Safe Output Rules

Customer-facing estimate output may show:

- `estimateLow`
- `estimateHigh`
- `confidenceScore`
- `confidenceLabel`
- confidence reasons
- `reviewRiskScore`
- `reviewRiskLabel`
- risk reasons
- included scope
- assumptions
- exclusions
- manual review flags
- compliance prompts
- recommended next step

Customer-facing pages and browser responses must not show:

- supplier costs
- internal rates
- line-item cost stack
- margin or markup logic
- lead score
- lead priority
- admin priority
- internal follow-up priority
- internal notes
- service role keys
- API keys
- production credentials

## Compliance And Risk Language

Use:

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

NSW review prompts can include written contract review over $5,000 including GST, 10% deposit guidance, HBC review over $20,000 including GST, licensed plumbing/electrical/gas review, strata/apartment review, DBP/class 2 screening, engineered-stone restrictions, older-property/asbestos review, final site measure and written scope confirmation.

## Important Docs

- `AGENTS.md`: strict execution policy.
- `CODEX_TASKS.md`: next tasks and deferred work.
- `DEPLOYMENT_RULES.md`: deploy minimisation and static export rules.
- `DECISION_LOG.md`: important decisions.
- `docs/release-checkpoints.md`: release gates.
- `docs/controlled-launch-checklist.md`: operational launch checklist.
- `docs/supabase-kitchen-request-reviews.md`: Supabase SQL and storage behaviour.
