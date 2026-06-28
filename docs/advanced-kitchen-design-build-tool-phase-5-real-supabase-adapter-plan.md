# Advanced Tool Phase 5 - Real Supabase Adapter Plan

Last updated: 27 June 2026

Deployment status: not needed.

## Status

This is a planning spec and mocked contract-test layer for a future real Supabase storage adapter for:

```text
public.kitchen_advanced_review_payloads
POST /.netlify/functions/kitchen-advanced-review-payload
```

No Supabase adapter code, Supabase SQL application, production environment change, admin UI, browser submission wiring, deploy, push or production verification is approved by this document.

The current wrapper remains disabled/no-write and should keep returning safe storage-unavailable responses until Vincent separately approves a storage implementation and release checkpoint.

## Supabase Notes Reviewed

The adapter plan follows current Supabase guidance that:

- tables in exposed schemas such as `public` should have Row Level Security enabled
- grants and RLS need to be considered together because grants control role access and RLS controls row access
- newer Supabase projects may not expose new public tables to the Data API automatically, so table exposure/grants must be checked deliberately

The plan keeps all writes server-mediated through Netlify Functions and avoids browser-side Supabase writes.

## Purpose

The inactive local adapter is designed to let the hidden advanced tools attach structured review context to an existing request-review lead after wrapper replacement and SQL are separately approved.

It should store only the already-projected, customer-safe `AdvancedReviewConsolePayload`, so operators can later review:

- design-brief facts
- scope-builder facts
- allowance and quote-risk flags
- missing inclusions
- customer-ready questions
- site-measure preparation
- recommended operator action

It is not a customer portal, quote generator, payment workflow, supplier ordering system or full CRM.

## Existing Local Foundation

Already implemented locally:

- `src/lib/advancedReviewConsole.ts` creates `AdvancedReviewConsolePayload`.
- `src/lib/advancedReviewStorage.ts` defines `advancedReviewPayloadTableName`, validation, table-record draft mapping and adapter result types.
- `src/lib/advancedReviewPayloadFunction.ts` maps request and adapter outcomes to safe response bodies.
- `netlify/functions/kitchen-advanced-review-payload.ts` exists as disabled/no-write only.
- `test/helpers/advancedReviewStorageMockHarness.ts` simulates storage success/failure without writes.
- `test/advancedReviewPayloadDisabledWrapper.test.ts` protects the disabled wrapper boundary.
- `test/helpers/advancedReviewSupabaseAdapterContractHarness.ts` simulates Supabase lead lookup and insert responses in memory only.
- `test/advancedReviewSupabaseAdapterContract.test.ts` protects the real-adapter contract and disabled-wrapper separation.
- `docs/advanced-kitchen-design-build-tool-phase-5-real-adapter-implementation-plan.md` records the local implementation shape for the server-only adapter, dependency strategy, env access pattern and test changes.
- `src/lib/advancedReviewSupabaseStorage.ts` implements the server-only REST/fetch adapter locally.
- `test/advancedReviewSupabaseStorage.test.ts` covers the adapter with mocked `fetch` responses only.
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md` documents the future narrow wrapper replacement.
- `test/advancedReviewPayloadWrapperReplacementContract.test.ts` proves the future replacement path with mocked Supabase only.

## Local Adapter File Shape

The local server-only adapter file is:

```text
src/lib/advancedReviewSupabaseStorage.ts
```

The file:

1. uses direct REST/fetch calls only, with no Supabase client dependency
2. read `OPERON_KITCHENS_SUPABASE_URL` and `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY` only from the Netlify Function/runtime environment
3. validate with `validateAdvancedReviewPayloadForStorage`
4. create a draft with `createAdvancedReviewStorageRecordDraft`
5. confirm the linked `kitchen_request_reviews.id` exists before insert
6. insert into `public.kitchen_advanced_review_payloads`
7. return only the safe adapter result shape
8. log only safe diagnostic categories

Do not import this adapter into browser-facing components, `/design-brief`, `/scope-builder`, or static pages. The current disabled wrapper still does not import this adapter.

## Future Environment Variables

Reuse existing server-only storage variables:

- `OPERON_KITCHENS_SUPABASE_URL`
- `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`

Do not create a `NEXT_PUBLIC_` Supabase service-role variable.

Do not expose service role keys, API keys, connection strings, project refs, raw payloads or customer document contents in browser responses or logs.

## Proposed Table

Do not apply this SQL until Vincent explicitly approves a production database task.

```sql
create table if not exists public.kitchen_advanced_review_payloads (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.kitchen_request_reviews(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source text not null check (source in ('requestReview', 'designBrief', 'scopeBuilder', 'quoteReview')),
  payload_schema_version text not null default 'advanced-review-console-v1',
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
  last_reviewed_by text,
  storage_request_id text,
  constraint kitchen_advanced_review_payloads_payload_object
    check (jsonb_typeof(customer_safe_payload) = 'object')
);

create index if not exists kitchen_advanced_review_payloads_lead_id_idx
  on public.kitchen_advanced_review_payloads (lead_id);

create index if not exists kitchen_advanced_review_payloads_created_at_idx
  on public.kitchen_advanced_review_payloads (created_at desc);

create index if not exists kitchen_advanced_review_payloads_status_idx
  on public.kitchen_advanced_review_payloads (internal_review_status);

alter table public.kitchen_advanced_review_payloads enable row level security;

revoke all on table public.kitchen_advanced_review_payloads from anon;
revoke all on table public.kitchen_advanced_review_payloads from authenticated;
grant select, insert, update, delete on table public.kitchen_advanced_review_payloads to service_role;
```

Optional updated-at helper, only if the project does not already have a shared safe helper:

```sql
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_kitchen_advanced_review_payloads_updated_at
  on public.kitchen_advanced_review_payloads;

create trigger set_kitchen_advanced_review_payloads_updated_at
before update on public.kitchen_advanced_review_payloads
for each row
execute function public.set_updated_at();
```

If a broader production migration is approved later, review whether `public.set_updated_at` already exists before applying the helper.

## RLS And API Exposure Posture

Recommended posture:

- enable RLS on the table
- grant no table access to `anon` or `authenticated`
- do not create public browser policies
- use service-role access only inside server-mediated Netlify Functions
- keep admin reads token-gated or stronger-auth gated later
- do not expose the table through browser Supabase clients

If Supabase Data API exposure is disabled or new public tables are not auto-exposed in Vincent's project, that is acceptable for this server-mediated flow as long as the approved server path can insert using the service role. Document the actual project setting during the future implementation task.

## Future Adapter Flow

Proposed runtime sequence after explicit approval:

1. Netlify wrapper receives `POST`.
2. Function checks JSON content type and parses request.
3. Function validates the projected payload with `validateAdvancedReviewPayloadForStorage`.
4. Adapter checks storage env vars.
5. Adapter creates Supabase service-role client server-side.
6. Adapter checks `public.kitchen_request_reviews` for the referenced `leadId`.
7. Adapter inserts the record draft into `public.kitchen_advanced_review_payloads`.
8. Function returns `202`, `ok: true`, `stored: true` and safe record id only after insert success.

Do not return success unless Supabase insert returns a durable stored record.

## Safe Diagnostics

Allowed diagnostic categories:

- `advanced_review_payload_invalid`
- `advanced_review_payload_env_missing`
- `advanced_review_lead_not_found`
- `advanced_review_insert_failed`
- `advanced_review_payload_stored`

Do not log:

- service role keys
- API keys
- full raw payloads
- customer document text
- internal notes
- supplier costs
- internal rates
- margin or markup logic
- lead score
- admin priority

## Mocked Contract Tests Implemented

Implemented locally:

- `test/helpers/advancedReviewSupabaseAdapterContractHarness.ts`
- `test/advancedReviewSupabaseAdapterContract.test.ts`

These tests prove:

- `src/lib/advancedReviewSupabaseStorage.ts` exists locally
- the disabled wrapper is not replaced
- missing storage configuration maps to `advanced_review_payload_env_missing`
- unsupported internal fields are rejected before any mocked Supabase call
- missing linked leads map to `advanced_review_lead_not_found`
- mocked insert failures map to `advanced_review_insert_failed`
- mocked insert success returns `advanced_review_payload_stored`
- response bodies do not expose service keys, supplier costs, internal rates, margin, lead score, admin priority or internal notes
- no real Supabase client, `process.env`, `fetch` or runtime network code is imported

## Adapter Tests Implemented

Implemented locally:

- `test/advancedReviewSupabaseStorage.test.ts`

The tests cover:

- server-only env-variable resolution with safe missing-env behaviour
- invalid payload rejection before network calls
- request-review lead lookup before insert
- missing lead and lead lookup failure mapping
- insert failure mapping
- stored success with safe record id
- insert body matching `createAdvancedReviewStorageRecordDraft`
- service-role headers present only in mocked request options
- safe response bodies with no secrets or internal pricing/admin fields
- disabled wrapper remains separate from the adapter

## Manual Verification Required Later

After a separately approved deploy, verify once:

1. POST invalid payload returns `400`.
2. POST valid payload without configured storage returns safe `503`.
3. POST valid payload with configured storage returns `202`.
4. Supabase row exists in `public.kitchen_advanced_review_payloads`.
5. Row links to `public.kitchen_request_reviews`.
6. Browser response contains no secrets or internal pricing/admin fields.
7. Netlify logs show only safe diagnostic categories.

Do not perform production verification in this planning slice.

## Acceptance Gate Before Activating Storage

Before activating the real adapter through the wrapper, Vincent should explicitly approve:

- applying or preparing the SQL migration
- replacing the disabled wrapper adapter with the real adapter
- how `/scope-builder` or `/design-brief` will obtain a valid `leadId`
- whether `/admin/leads` should display advanced payload summaries
- one approved Netlify deploy for runtime verification

## Explicitly Deferred

- applying SQL to production Supabase
- modifying Netlify environment variables
- replacing the disabled wrapper adapter
- browser submission wiring from `/scope-builder` or `/design-brief`
- `/admin/leads` advanced payload display
- customer-facing advanced report generation
- AI summary
- payment
- customer accounts
- full CRM
- supplier workflow
- deploy, push or production verification

## Recommended Next Step

Human review this real Supabase adapter plan, the implementation-ready plan and the wrapper replacement plan in:

```text
docs/advanced-kitchen-design-build-tool-phase-5-real-adapter-implementation-plan.md
docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md
```

If approved later, the safest next local-only task is to prepare the SQL migration checklist and wrapper replacement implementation checklist side by side, still without applying SQL, replacing the disabled wrapper, adding admin UI, wiring browser submissions or deploying.
