# Advanced Tool Phase 5 Slice 2 Plan — Server-Mediated Storage Adapter

Last updated: 24 June 2026

Deployment status: not needed.

## Status

This document now includes a completed local interface sketch.

The follow-on Netlify Function contract test plan is documented in `docs/advanced-kitchen-design-build-tool-phase-5-netlify-function-contract-test-plan.md`, with request/response fixtures in `test/fixtures/advancedReviewPayloadFunctionFixtures.ts`, a helper-only boundary in `src/lib/advancedReviewPayloadFunction.ts`, a thin test helper in `test/helpers/advancedReviewPayloadFunctionContractHelper.ts`, and a helper-first implementation plan in `docs/advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md`.

No Supabase adapter implementation, Netlify Function change, Supabase migration, admin UI change, production environment variable, deploy, push or production verification is approved by this document.

Phase 5 slice 1 is complete locally: `src/lib/advancedReviewConsole.ts` projects design brief, kitchen scope and allowance-risk outputs into a customer-safe `AdvancedReviewConsolePayload`.

Slice 2 should not start as runtime storage implementation until Vincent explicitly approves it after reviewing this plan and interface sketch.

## Local Interface Sketch

Implemented locally:

- `src/lib/advancedReviewStorage.ts`
- `test/advancedReviewStorage.test.ts`

Current behaviour:

- defines the future table and function path constants
- defines `AdvancedReviewStorageAdapter`
- defines future storage result and diagnostic types
- validates only projected `AdvancedReviewConsolePayload` objects
- rejects raw design-builder objects and unsupported internal fields
- creates a record draft for the proposed table shape
- imports no Supabase client and performs no network, file, database or function writes

This is a contract sketch, not a storage adapter implementation.

## Local Mock Harness

Implemented locally:

- `test/helpers/advancedReviewStorageMockHarness.ts`
- `test/advancedReviewStorageMockHarness.test.ts`

Current behaviour:

- simulates successful storage in memory only
- simulates validation failure
- simulates missing storage environment
- simulates lead-link failure
- simulates insert failure
- records safe diagnostic categories
- stores no data outside the test process
- imports no Supabase client, Netlify Function runtime, `fetch` or environment variables

This is a test harness only. It is not production storage code and must not be imported into runtime files.

## Purpose

The future slice 2 should define how an `AdvancedReviewConsolePayload` could be saved through a server-mediated path so the hidden advanced tools can later attach structured context to a request-review lead.

The aim is a durable internal review handoff, not a public customer portal and not a full CRM.

## Non-Negotiable Boundaries

Future slice 2 runtime must:

- keep Supabase service role keys server-side only
- use Netlify Functions or another server-mediated kitchen-only path
- persist only customer-safe projected payloads from `src/lib/advancedReviewConsole.ts`
- avoid browser-side Supabase writes
- avoid raw design-builder form objects in the database unless separately approved
- avoid public exposure of advanced review payloads
- keep `/design-brief` and `/scope-builder` hidden until separately approved
- keep `/admin/leads` token-gated
- avoid payment, customer login, full CRM, supplier API and automated quote approval

Future slice 2 runtime must not store or expose:

- supplier costs
- internal rates
- margin or markup logic
- line item cost stacks
- hidden pricing logic
- lead score
- lead priority
- admin priority
- service role keys
- API keys
- raw storage paths in public responses

## Recommended Data Contract

Use the slice 1 projection as the only accepted payload:

```ts
AdvancedReviewConsolePayload
```

The server should reject unsupported fields rather than accepting raw advanced-tool form state.

Allowed top-level fields:

- `leadId`
- `source`
- `createdAt`
- `designBriefSummary`
- `scopeSummary`
- `allowanceRiskFlags`
- `missingInclusions`
- `customerQuestions`
- `siteMeasurePreparation`
- `recommendedOperatorAction`
- `safetyMessage`

Any future internal state should be stored separately and guarded by admin-token or stronger auth:

- `internal_review_status`
- `operator_notes`
- `last_reviewed_at`
- `last_reviewed_by`

Do not include internal state in a customer-facing payload.

## Recommended Future Persistence Option

Recommended direction: separate table, not JSON columns on `kitchen_request_reviews`.

Proposed table from the Phase 5 planning spec:

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
```

Do not apply this SQL until Vincent explicitly approves a future runtime/database task.

## Future Server-Mediated Flow

Proposed only:

1. Hidden advanced tool computes design brief, kitchen scope and allowance-risk results locally.
2. Existing projection helper creates an `AdvancedReviewConsolePayload`.
3. Customer chooses to request review or attach the structured context to an existing request-review lead.
4. Browser sends the projected payload to a kitchen-only Netlify Function.
5. Function validates origin, method, content type, payload shape and allowed fields.
6. Function authenticates the storage path using server-side environment variables only.
7. Function confirms the referenced `leadId` exists before insert.
8. Function inserts the payload into `kitchen_advanced_review_payloads`.
9. Function returns a safe acknowledgement with `stored: true` and a request id.
10. Admin-side code may later read the payload only through token-gated functions.

## Future Function Shape

If approved later, prefer a new narrowly scoped function:

```text
POST /.netlify/functions/kitchen-advanced-review-payload
```

Why a separate function:

- isolates advanced-tool storage from the current request-review lead intake
- keeps the current production lead form stable
- makes tests and logs easier to reason about
- allows stricter payload schema validation

Alternative:

- extend `kitchen-request-review` only if Vincent wants advanced-tool context submitted at the same time as the request-review form.

Default recommendation:

- start with a separate function for controlled testing.

## Future Environment Variables

Reuse existing storage variables where possible:

- `OPERON_KITCHENS_SUPABASE_URL`
- `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`

No new public browser environment variable should be required for storage.

If a new variable is ever added, document it before implementation.

## Validation Rules For Future Runtime

Future runtime should validate:

- `leadId` is a UUID-like string or matches the internal request id format chosen later
- `source` is one of `requestReview`, `designBrief`, `scopeBuilder`, `quoteReview`
- `createdAt` is an ISO-like timestamp or replaced server-side
- arrays are bounded, for example max 30 items
- strings are trimmed and length-limited
- `safetyMessage` matches the approved safe wording
- `recommendedOperatorAction` is one of the approved values
- unsupported fields are rejected or ignored with a safe diagnostic
- payload size has a strict upper bound

Do not log full payloads. Log diagnostic categories only.

## Safe Diagnostic Categories

Future function logs may use categories such as:

- `advanced_review_payload_env_missing`
- `advanced_review_payload_invalid`
- `advanced_review_lead_not_found`
- `advanced_review_insert_failed`
- `advanced_review_payload_stored`

Do not log:

- service role keys
- API keys
- full customer payload
- internal notes
- file contents
- supplier costs
- pricing internals

## Failure Behaviour

Future runtime should return safe responses:

- `400` for invalid payload
- `401` if a future admin-token-only path is used and token is missing or invalid
- `404` or `409` for safe lead-linking failures, without revealing unnecessary lead data
- `503` only if storage is required and unavailable

Do not fake success if the payload was not stored.

## Admin Read Path Later

Admin display is not part of slice 2.

When approved later, slice 3 may read advanced payloads through:

- `GET /.netlify/functions/kitchen-admin-leads`
- or a new token-gated `GET /.netlify/functions/kitchen-admin-advanced-review`

The admin read path must require `OPERON_KITCHENS_ADMIN_TOKEN` or stronger future auth and must never return service keys or hidden pricing fields.

## Tests Required Before Runtime Slice 2 Is Complete

Future implementation should add tests for:

- accepts only `AdvancedReviewConsolePayload`
- rejects unsupported internal fields
- rejects raw design brief or raw scope objects if submitted directly
- rejects missing or invalid `leadId`
- rejects invalid `source`
- bounds string and array lengths
- uses service role server-side only
- inserts into the approved kitchen-namespaced table
- does not fake success when storage fails
- response does not expose secrets, supplier costs, internal rates, margin, lead score or admin priority
- logs only safe diagnostic categories

## Acceptance Gate Before Coding Slice 2

Before runtime work begins, Vincent should approve:

- table strategy: separate table versus JSON on existing lead row
- exact SQL migration
- whether slice 2 links to existing request-review leads only
- whether hidden `/scope-builder` can submit payloads during controlled testing
- failure behaviour if a lead cannot be linked
- admin read strategy for future slice 3
- whether any production deployment is allowed

## Explicitly Deferred

- Supabase migration
- Netlify Function implementation
- browser submission wiring
- `/admin/leads` display
- internal status workflow
- report generation
- customer portal
- payment
- full CRM
- supplier workflow
- public exposure of `/design-brief` or `/scope-builder`

## Recommended Next Step

Human review this slice 2 storage-adapter plan and the Netlify Function contract test plan.

If approved later, the next local-only task should be a wrapper-only implementation plan for `netlify/functions/kitchen-advanced-review-payload.ts`, still without Supabase writes, Netlify Function changes or admin UI.
