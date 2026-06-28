# Advanced Tool Phase 5 Planning Spec — Internal Review Console Integration

Last updated: 24 June 2026

Deployment status: not needed.

## Status

Phase 5 planning is documented locally. Slice 1 is implemented locally as pure projection helpers and tests only. Slice 2 is documented locally as a server-mediated storage-adapter plan only. No Supabase persistence, Netlify Function change, public route change, admin UI change, customer account, payment, supplier workflow, CRM expansion or deploy is approved by this document.

Phase 3 has been approved for planning progression. Vincent approved Phase 5 planning, the first local-only runtime slice, and a planning-only slice 2 storage-adapter document. Any persistence, admin display, server function, production migration or deploy still requires separate explicit approval.

## Purpose

Phase 5 should connect the structured design-build data from the hidden advanced tools to the existing internal `/admin/leads` workflow so Vincent can review better project context without losing the current controlled-launch safety posture.

The intended outcome is a lightweight internal review-console layer, not a full CRM.

## Existing System To Reuse

Reuse the current kitchen-only admin and storage boundaries:

- `/admin/leads`
- `GET /.netlify/functions/kitchen-admin-leads`
- `POST /.netlify/functions/kitchen-admin-lead-update`
- `POST /.netlify/functions/kitchen-admin-file-download`
- `src/lib/kitchenAdminLeads.ts`
- `src/lib/kitchenLeadStorage.ts`
- `src/lib/requestReview.ts`
- `public.kitchen_request_reviews`
- `public.kitchen_request_review_files`

Supabase remains the source of truth for request-review leads. Email remains notification only.

## Proposed Admin Review Console Scope

Future Phase 5 runtime may add an internal review panel that shows:

- lead contact and project basics
- source route and attribution
- uploaded file metadata and signed-download actions where already approved
- design brief summary, if attached
- scope builder summary, if attached
- allowance and quote-risk flags
- missing inclusions
- customer questions
- site-measure preparation checklist
- recommended operator next action
- internal review status
- internal notes

## Admin-Only Fields

The following may exist only in server-side or admin-token-protected contexts:

- internal notes
- internal review status
- operator checklist state
- manual review outcome
- site-measure readiness note
- customer follow-up draft
- report draft status

Do not expose these fields to public pages, public emails, browser responses without admin token, analytics payloads or customer-facing components.

## Customer-Safe Fields

Customer-facing future output may only receive projected safe fields such as:

- design brief summary
- kitchen scope summary
- allowance and quote-risk prompts
- missing inclusions to confirm
- customer questions
- site-measure preparation prompts
- recommended next step
- safety message

Customer-facing components must not receive raw admin review records.

## Proposed Data Shape

Conceptual only:

```ts
interface AdvancedReviewConsolePayload {
  leadId: string;
  source: 'requestReview' | 'designBrief' | 'scopeBuilder' | 'quoteReview';
  createdAt: string;
  designBriefSummary?: string[];
  scopeSummary?: string[];
  allowanceRiskFlags?: Array<{
    id: string;
    label: string;
    customerSafePrompt: string;
    requiresHumanReview: boolean;
  }>;
  missingInclusions?: string[];
  customerQuestions?: string[];
  siteMeasurePreparation?: string[];
  recommendedOperatorAction:
    | 'review_scope'
    | 'request_missing_information'
    | 'offer_site_measure'
    | 'prepare_quote_review'
    | 'mark_not_ready';
  safetyMessage: 'Planning guidance only. Site measure and written scope confirmation are required before contract pricing. This is not legal advice.';
}
```

Internal-only companion state:

```ts
interface AdvancedReviewInternalState {
  leadId: string;
  reviewStatus:
    | 'not_started'
    | 'needs_customer_clarification'
    | 'ready_for_manual_review'
    | 'site_measure_recommended'
    | 'written_scope_draft_needed'
    | 'closed';
  operatorNotes?: string;
  lastReviewedAt?: string;
  lastReviewedBy?: string;
}
```

## Possible Persistence Options

These are proposals only and must not be applied without approval.

Option A: attach JSON fields to `kitchen_request_reviews`.

- fastest to implement
- fewer joins
- less flexible for versioning
- requires careful JSON projection so public code never receives raw admin state

Option B: create a separate `kitchen_advanced_review_payloads` table.

- cleaner versioning
- can record source route and payload type
- safer for future report generation
- requires additive SQL, adapter and admin query changes

Recommended future direction: Option B, after the admin data contract is reviewed.

## Proposed Future Table

Documentation only:

```sql
create table if not exists public.kitchen_advanced_review_payloads (
  id uuid primary key,
  lead_id uuid not null references public.kitchen_request_reviews(id) on delete cascade,
  created_at timestamptz not null default now(),
  source text not null check (source in ('requestReview', 'designBrief', 'scopeBuilder', 'quoteReview')),
  customer_safe_payload jsonb not null,
  internal_review_status text not null default 'not_started' check (internal_review_status in (
    'not_started',
    'needs_customer_clarification',
    'ready_for_manual_review',
    'site_measure_recommended',
    'written_scope_draft_needed',
    'closed'
  )),
  operator_notes text,
  last_reviewed_at timestamptz,
  last_reviewed_by text
);

create index if not exists kitchen_advanced_review_payloads_lead_id_idx
  on public.kitchen_advanced_review_payloads (lead_id);

create index if not exists kitchen_advanced_review_payloads_status_idx
  on public.kitchen_advanced_review_payloads (internal_review_status);

alter table public.kitchen_advanced_review_payloads enable row level security;
```

Do not apply this SQL until Vincent explicitly approves a Phase 5 runtime task.

## Proposed Runtime Slices

Slice 1: local adapter and tests only. Implemented locally.

- create pure projection helpers for advanced-tool payloads
- test that internal fields are not included in customer-safe payloads
- no Supabase writes
- no admin UI changes

Implemented files:

- `src/lib/advancedReviewConsole.ts`
- `test/advancedReviewConsole.test.ts`

Current behaviour:

- `createAdvancedReviewConsolePayload` accepts already-computed design brief, kitchen scope and allowance-risk results.
- `createScopeBuilderReviewPayload` creates a payload for hidden `/scope-builder` review output.
- The helpers project summaries, risk flags, missing inclusions, customer questions, site-measure preparation and recommended operator action.
- Unsupported internal/admin-like fields are ignored.
- No data is persisted or rendered in `/admin/leads`.

Slice 2: server-mediated storage proposal.

- add Netlify Function or extend existing request-review function only after approval
- store customer-safe payload server-side
- require service role server-side only
- no browser-side Supabase writes

Slice 2 planning is documented in `docs/advanced-kitchen-design-build-tool-phase-5-slice-2-storage-adapter-plan.md`.

That plan covers:

- recommended separate Netlify Function path
- recommended separate `kitchen_advanced_review_payloads` table strategy
- allowed payload fields from `AdvancedReviewConsolePayload`
- validation rules
- safe diagnostic categories
- failure behaviour
- future admin read boundaries
- acceptance gates before runtime coding

Slice 3: admin display.

- add read-only advanced review panel to `/admin/leads`
- show summary, risk flags, missing inclusions and customer questions
- keep update controls limited to existing safe admin status/notes unless separately approved

Slice 4: internal review status.

- add internal review status only after data contract review
- never expose internal status to customer-facing pages

## Out Of Scope

- public exposure of `/design-brief` or `/scope-builder`
- customer accounts
- customer portal
- payment
- supplier ordering
- full CRM
- automated quote approval
- AI-generated final reports
- direct browser Supabase writes
- production Supabase migration
- Netlify deploy
- admin file deletion/retention expansion

## Security And Privacy Rules

Phase 5 runtime must:

- require `OPERON_KITCHENS_ADMIN_TOKEN` or a stronger future admin auth layer
- keep service role keys inside Netlify Functions only
- avoid raw customer data in analytics events
- avoid sensitive free-text payloads in logs
- return `401` for missing/invalid admin token
- never reveal whether leads exist without a valid token
- reject or ignore unsupported client fields
- keep public pages free of internal review data

## Forbidden Fields

Do not accept or expose:

- supplier costs
- internal rates
- margin or markup logic
- line item costs
- hidden pricing logic
- lead score
- lead priority
- admin priority
- service role keys
- API keys
- raw storage paths in public responses

## Acceptance Criteria For Future Runtime

Before implementation is considered complete, future Phase 5 runtime should have tests for:

- valid admin token required
- invalid token returns `401`
- customer-safe advanced payload projection excludes internal fields
- public pages do not link advanced admin payloads
- `/admin/leads` does not expose service keys
- internal review status values are validated
- unsupported fields are rejected
- no final quote, legal approval, compliance approval or guaranteed savings wording
- build remains compatible with static export and Netlify Functions

## Recommended Next Step

Stop at this planning spec and the slice 2 storage-adapter plan unless Vincent explicitly approves the next Phase 5 runtime slice.

The safest next local-only task would be a test-first storage adapter interface sketch, still without Supabase writes, Netlify Function changes or admin UI changes.
