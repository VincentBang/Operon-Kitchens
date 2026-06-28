# Advanced Tool Phase 5 - Activation Checklists

Last updated: 27 June 2026

Deployment status: not needed.

## Status

This document prepares the next approval gate for:

```text
public.kitchen_advanced_review_payloads
netlify/functions/kitchen-advanced-review-payload.ts
```

It is a checklist only.

No SQL was applied. No wrapper file was replaced. No admin UI was changed. No browser submission wiring was added. No deploy, push or production verification is approved.

## Purpose

Phase 5 now has:

- customer-safe advanced review projection helpers
- storage validation and record-draft mapping
- a disabled/no-write Netlify wrapper
- a server-only REST/fetch Supabase adapter
- mocked wrapper replacement contract tests
- an exact SQL-only approval packet at `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql`
- a wrapper replacement implementation checklist at `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md`
- a wrapper replacement patch plan at `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md`

The next risky step is not coding by default. The next safe step is deciding, side by side, what must be true before:

1. Vincent applies the future SQL.
2. Vincent approves replacing the disabled wrapper with the real adapter.

## Side-By-Side Activation Checklist

| Gate | SQL migration checklist | Wrapper replacement checklist |
| --- | --- | --- |
| Approval | Vincent explicitly approves a production database task for `public.kitchen_advanced_review_payloads`. | Vincent explicitly approves replacing the disabled/no-write `kitchen-advanced-review-payload` wrapper. |
| Source document | Use `docs/advanced-kitchen-design-build-tool-phase-5-real-supabase-adapter-plan.md` and `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql`. | Use `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md`, `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md` and `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md`. |
| Current state | SQL is documented only. No migration has been applied. | The wrapper remains disabled/no-write and returns safe `advanced_review_payload_env_missing`. |
| Table | Create `public.kitchen_advanced_review_payloads` only after review. | Do not change table shape in the wrapper slice. |
| RLS posture | Enable RLS on `public.kitchen_advanced_review_payloads`. | Assume RLS is enabled before production activation. |
| Grants | Revoke table access from `anon` and `authenticated`. Grant required access only to `service_role`. | Use service-role access only through the server-side adapter. Never expose service-role credentials to browser code. |
| Foreign key | Confirm `lead_id` references `public.kitchen_request_reviews(id)` and fails safely when no matching lead exists. | Keep the adapter lead lookup before insert. Missing lead must return `advanced_review_lead_not_found`. |
| Payload storage | Store only `customer_safe_payload jsonb`, not raw scope-builder state or internal pricing/admin fields. | Pass only validated `AdvancedReviewConsolePayload` through `handleAdvancedReviewPayloadFunctionRequest`. |
| Internal status | Start with `internal_review_status = 'not_started'`. | Do not add admin status UI in the wrapper replacement slice. |
| Updated-at helper | Check whether `public.set_updated_at()` already exists before creating or replacing it. | No updated-at logic belongs in the wrapper. |
| Environment | Confirm no database secrets are placed in `NEXT_PUBLIC_` variables. | Use only `OPERON_KITCHENS_SUPABASE_URL` and `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY` server-side. |
| Response safety | Not applicable to SQL directly. | Responses may include only `ok`, `stored`, safe `recordId`, safe diagnostic and generic message. |
| Logging | Do not create SQL functions that log payloads or secrets. | Log only safe diagnostic categories if logging is added later. No raw payloads or secrets. |
| Tests before approval | `npm test -- --runInBand`, `npm run lint`, `npm run build`, `git diff --check`. | Same local gate, plus wrapper replacement contract tests must pass before actual replacement. |
| Production verification | Only after Vincent approves one deploy. | Only after Vincent approves one deploy and one controlled POST verification. |

## SQL Migration Checklist

Before applying SQL, confirm:

1. The production task is explicitly approved by Vincent.
2. The SQL is copied from `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql`, not from chat fragments or Markdown docs.
3. The SQL contains no Markdown heading markers such as `#`.
4. `public.kitchen_request_reviews` already exists.
5. `gen_random_uuid()` is available in the project.
6. The table name is exactly `public.kitchen_advanced_review_payloads`.
7. Required columns exist:
   - `id`
   - `lead_id`
   - `created_at`
   - `updated_at`
   - `source`
   - `payload_schema_version`
   - `customer_safe_payload`
   - `internal_review_status`
   - `operator_notes`
   - `last_reviewed_at`
   - `last_reviewed_by`
   - `storage_request_id`
8. Indexes exist for:
   - `lead_id`
   - `created_at desc`
   - `internal_review_status`
9. RLS is enabled.
10. `anon` and `authenticated` have no table access.
11. `service_role` has the required table access.
12. Do not create `NEXT_PUBLIC_` Supabase service-role variables.
13. The packet uses the table-specific `public.set_kitchen_advanced_review_payloads_updated_at()` trigger helper to avoid replacing a shared production helper.
14. No public policy is created.
15. No browser-side Supabase write is created.
16. SQL execution result and verification query output are captured manually for Vincent's records.

## SQL Approval Packet

The exact copy-paste SQL packet is:

```text
docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql
```

This packet:

- contains SQL comments only, not Markdown headings
- creates only `public.kitchen_advanced_review_payloads`
- links `lead_id` to `public.kitchen_request_reviews(id)`
- stores `customer_safe_payload jsonb`
- sets `internal_review_status` to `not_started` by default
- enables RLS
- revokes access from `anon` and `authenticated`
- grants table access only to `service_role`
- uses a table-specific updated-at trigger helper
- includes read-only verification queries

Do not run the packet until Vincent explicitly approves a production Supabase SQL task.

## SQL Rollback Planning Notes

Because this table is additive and future-only, the expected rollback approach should be decided before applying SQL.

Recommended manual rollback notes:

```sql
drop table if exists public.kitchen_advanced_review_payloads;
```

Do not drop `public.kitchen_request_reviews`.

Do not drop a shared `public.set_updated_at()` helper unless it was created solely for this table and no other table uses it.

## Wrapper Replacement Implementation Checklist

The detailed implementation checklist is:

```text
docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md
```

The patch plan is:

```text
docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md
```

Before replacing the disabled wrapper, confirm:

1. The SQL checklist is complete or intentionally deferred in a documented non-production test mode.
2. Vincent explicitly approves actual wrapper replacement.
3. `netlify/functions/kitchen-advanced-review-payload.ts` is the only runtime wrapper file touched for this slice.
4. The wrapper keeps modern Netlify default export syntax.
5. The wrapper imports:
   - `handleAdvancedReviewPayloadFunctionRequest`
   - `createAdvancedReviewSupabaseStorageAdapter`
6. The wrapper remains thin and does not duplicate:
   - JSON parsing rules
   - payload validation
   - lead lookup
   - Supabase insert mapping
   - diagnostic mapping
7. The wrapper returns a Web `Response` with:
   - `Content-Type: application/json`
   - `Cache-Control: no-store`
8. Non-POST still returns `405`.
9. Invalid payloads still return `400`.
10. Missing env still returns `503`.
11. Missing linked lead still returns `409`.
12. Insert failure still returns `503`.
13. Stored success returns `202`.
14. No response exposes:
   - service role keys
   - API keys
   - supplier costs
   - internal rates
   - margin or markup logic
   - lead score
   - admin priority
   - internal notes
15. The disabled-wrapper test expectations are deliberately updated only in the approved replacement slice.
16. Browser submission wiring from `/scope-builder` or `/design-brief` remains out of scope.
17. `/admin/leads` advanced payload display remains out of scope.
18. Payment, customer accounts, AI report generation and CRM remain out of scope.

## Local Test Checklist Before Any Future Runtime Replacement

Run:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Expected focused coverage:

- `test/advancedReviewPayloadWrapperReplacementContract.test.ts`
- `test/advancedReviewSupabaseStorage.test.ts`
- `test/advancedReviewPayloadDisabledWrapper.test.ts` until the actual replacement is approved
- `test/advancedDesignBuildToolDocs.test.ts`
- `test/publicCopy.test.ts`

## One-Deploy Verification Checklist For Later

Use only after Vincent approves deployment.

1. Confirm Netlify deploy timestamp and commit hash.
2. Confirm Netlify Functions have `OPERON_KITCHENS_SUPABASE_URL`.
3. Confirm Netlify Functions have `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`.
4. Submit one controlled payload referencing a known request-review lead.
5. Confirm response is `202`, `ok: true`, `stored: true`.
6. Confirm a row exists in `public.kitchen_advanced_review_payloads`.
7. Confirm row links to `public.kitchen_request_reviews`.
8. Confirm browser response contains no secrets or internal pricing/admin fields.
9. Confirm Netlify logs show no raw payloads, Supabase secrets or unsafe fields.
10. Stop after one verification cycle to protect Netlify credits.

## Explicitly Deferred

- applying SQL
- replacing the disabled wrapper
- changing Netlify environment variables
- wiring browser submissions
- changing `/admin/leads`
- adding report generation
- deploying
- production verification
- payment
- customer accounts
- full CRM
- supplier workflow

## Recommended Next Step

Human review this activation checklist, the real Supabase adapter plan, the wrapper replacement plan, the SQL approval packet, the wrapper replacement implementation checklist and the wrapper replacement patch plan.

If approved later, the safest next step is a manual SQL approval decision or a separately approved active-wrapper contract-test slice. Applying the SQL, replacing the disabled wrapper, changing admin UI, wiring browser submissions and deploying remain separately gated.
