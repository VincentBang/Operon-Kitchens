# Advanced Tool Phase 5 - Wrapper Replacement Implementation Checklist

Last updated: 27 June 2026

Deployment status: not needed.

## Status

This is an implementation checklist only for a future approved replacement of:

```text
netlify/functions/kitchen-advanced-review-payload.ts
```

No wrapper file was replaced. No SQL was applied. No admin UI was changed. No browser submission wiring was added. No deploy, push or production verification is approved.

## Purpose

The future wrapper replacement will turn the existing disabled/no-write Netlify Function into a thin active wrapper around the server-only Supabase adapter.

It must store only a validated, customer-safe `AdvancedReviewConsolePayload` in:

```text
public.kitchen_advanced_review_payloads
```

It must not store raw scope-builder state, supplier costs, internal rates, margins, lead scores, admin priority, internal notes, service keys, raw customer file contents or hidden pricing logic.

## Current Disabled State

Current behaviour must remain unchanged until Vincent explicitly approves the runtime replacement:

- `netlify/functions/kitchen-advanced-review-payload.ts` uses modern Netlify default export syntax.
- It delegates request parsing and response mapping to `handleAdvancedReviewPayloadFunctionRequest`.
- It uses `disabledAdvancedReviewStorageAdapter`.
- It returns safe `503` storage-unavailable responses for otherwise valid payloads.
- It validates unsafe payloads before disabled responses.
- It does not import `advancedReviewSupabaseStorage`.
- It does not read `process.env`.
- It does not read `Netlify.env`.
- It does not call Supabase.
- It does not fake success.

## Required Approval Gates

Do not replace the disabled wrapper until all gates are true:

1. Vincent explicitly approves applying or confirming the SQL for `public.kitchen_advanced_review_payloads`.
2. The SQL-only approval packet has been manually reviewed:
   - `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql`
3. The SQL has been applied or an approved non-production test mode is documented.
4. Verification confirms:
   - `public.kitchen_advanced_review_payloads` exists
   - RLS is enabled
   - `anon` and `authenticated` have no table access
   - `service_role` has the required table access
   - the table has the documented indexes
   - the table-specific updated-at trigger exists
5. Netlify Functions have server-only access to:
   - `OPERON_KITCHENS_SUPABASE_URL`
   - `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`
6. No service-role key is added to a `NEXT_PUBLIC_` variable.
7. Vincent explicitly approves replacing the disabled wrapper.
8. Vincent explicitly approves one later deploy and one controlled production verification.

## Allowed Future Runtime Scope

When the replacement is approved, the runtime slice should touch only:

```text
netlify/functions/kitchen-advanced-review-payload.ts
```

Expected related tests/docs may be updated in the same approved slice:

```text
test/advancedReviewPayloadDisabledWrapper.test.ts
test/advancedReviewPayloadWrapperReplacementContract.test.ts
test/advancedReviewSupabaseStorage.test.ts
test/advancedDesignBuildToolDocs.test.ts
docs/advanced-kitchen-design-build-tool-implementation-tracker.md
docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md
docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md
```

Do not change:

- `/admin/leads`
- `/design-brief`
- `/scope-builder`
- public navigation, footer, chatbot or sitemap
- `public.kitchen_request_reviews`
- file upload functions
- payment, customer auth, CRM or supplier workflow

## Expected Wrapper Shape

The future active wrapper should remain thin:

```ts
import {
  AdvancedReviewPayloadFunctionResponse,
  handleAdvancedReviewPayloadFunctionRequest,
} from '../../src/lib/advancedReviewPayloadFunction';
import { createAdvancedReviewSupabaseStorageAdapter } from '../../src/lib/advancedReviewSupabaseStorage';

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

async function toNetlifyResponse(response: AdvancedReviewPayloadFunctionResponse) {
  return new Response(await response.text(), {
    status: response.status,
    headers: jsonHeaders,
  });
}

export default async function handler(request: Request) {
  const response = await handleAdvancedReviewPayloadFunctionRequest(
    request,
    createAdvancedReviewSupabaseStorageAdapter({
      supabaseUrl: Netlify.env.get('OPERON_KITCHENS_SUPABASE_URL'),
      serviceRoleKey: Netlify.env.get('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY'),
    }),
  );

  return toNetlifyResponse(response);
}
```

Keep the default `/.netlify/functions/kitchen-advanced-review-payload` route unless Vincent explicitly approves a custom `config.path`.

Do not duplicate:

- method handling
- JSON parsing
- payload validation
- lead lookup
- insert mapping
- diagnostic-to-status mapping
- response-body construction

Those remain inside:

```text
src/lib/advancedReviewPayloadFunction.ts
src/lib/advancedReviewSupabaseStorage.ts
src/lib/advancedReviewStorage.ts
```

## Response Contract

The future active wrapper must preserve these outcomes:

| Scenario | Expected status | Expected diagnostic |
| --- | --- | --- |
| Non-POST | `405` | `advanced_review_method_not_allowed` |
| Invalid content type | `400` | `advanced_review_payload_invalid` |
| Invalid or unsafe payload | `400` | `advanced_review_payload_invalid` |
| Missing storage env | `503` | `advanced_review_payload_env_missing` |
| Missing linked request-review lead | `409` | `advanced_review_lead_not_found` |
| Insert failure | `503` | `advanced_review_insert_failed` |
| Stored success | `202` | `advanced_review_payload_stored` |

Success may include only:

- `ok`
- `stored`
- `diagnostic`
- safe `recordId`

Failure may include only:

- `ok`
- `stored`
- `diagnostic`
- generic customer-safe `message`

## Safety Checks

No response, log, test fixture, email, browser output or public doc may expose:

- service role keys
- API keys
- database credentials
- Supabase project secrets
- supplier costs
- internal rates
- margin or markup logic
- hidden pricing logic
- lead score
- lead priority
- admin priority
- internal notes
- raw customer document text

If logging is added later, log only diagnostic categories such as:

- `advanced_review_payload_invalid`
- `advanced_review_payload_env_missing`
- `advanced_review_lead_not_found`
- `advanced_review_insert_failed`
- `advanced_review_payload_stored`

Do not log raw payloads or environment values.

## Test Update Checklist

Before approving the future runtime replacement, update or confirm tests so they prove:

1. The active wrapper imports `createAdvancedReviewSupabaseStorageAdapter`.
2. The active wrapper delegates to `handleAdvancedReviewPayloadFunctionRequest`.
3. The active wrapper uses `Netlify.env.get` for server-only env values.
4. The active wrapper does not use `process.env`.
5. The active wrapper returns JSON with `Cache-Control: no-store`.
6. Non-POST still returns `405`.
7. Invalid content type still returns `400`.
8. Unsafe internal fields are rejected before Supabase calls.
9. Missing env still returns `503`.
10. Missing linked lead still returns `409`.
11. Insert failure still returns `503` and does not fake success.
12. Stored success returns `202`, `ok: true`, `stored: true` and a safe record id.
13. Mocked Supabase fetch receives:
    - lead lookup first
    - insert second
    - `Prefer: return=representation`
    - `storage_request_id` only after bounded cleanup
14. Browser-facing responses contain no secrets or internal pricing/admin fields.
15. The old disabled-wrapper expectation is intentionally removed or rewritten only in the approved replacement slice.

## Local Gate Before Any Approved Replacement

Run:

```bash
npm test -- test/advancedReviewPayloadWrapperReplacementContract.test.ts --runInBand
npm test -- test/advancedReviewSupabaseStorage.test.ts --runInBand
npm test -- test/advancedReviewPayloadDisabledWrapper.test.ts --runInBand
npm test -- test/advancedDesignBuildToolDocs.test.ts --runInBand
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

## Rollback Plan

If the future approved active wrapper fails before deployment, restore the disabled adapter wrapper from the current local source and rerun the full local gate.

If the future approved active wrapper fails after deployment, Vincent must approve one rollback deploy. The rollback should:

1. Restore `disabledAdvancedReviewStorageAdapter`.
2. Remove the active adapter import.
3. Return safe `advanced_review_payload_env_missing` for otherwise valid payloads.
4. Keep validation and unsafe-field rejection intact.
5. Leave the SQL table in place unless a separately approved database rollback is required.

## Explicitly Deferred

- replacing the disabled wrapper in this task
- applying SQL
- changing Netlify environment variables
- changing `/admin/leads`
- wiring `/scope-builder` or `/design-brief` browser submissions
- exposing hidden advanced-tool routes
- report generation
- payment
- customer accounts
- full CRM
- supplier workflow
- deploy, push or production verification

## Recommended Next Step

Human review this wrapper replacement implementation checklist alongside:

- `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql`
- `docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md`

If Vincent approves a later runtime slice, use the patch plan to replace only the disabled wrapper and update the focused tests. Keep SQL application, admin UI, browser submission wiring and deployment separately gated.
