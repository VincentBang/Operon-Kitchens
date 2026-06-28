# Advanced Tool Phase 5 - Thin Function Implementation Plan

Last updated: 25 June 2026

Deployment status: not needed.

## Status

This is an implementation plan only for a future thin Netlify Function wrapper:

```text
POST /.netlify/functions/kitchen-advanced-review-payload
```

The helper-only function boundary and disabled/no-write Netlify wrapper now exist locally. No real Supabase adapter, Supabase SQL, admin UI, browser submission wiring, deploy, push or production verification is approved by this document.

Current local foundations:

- `src/lib/advancedReviewConsole.ts` creates a customer-safe `AdvancedReviewConsolePayload`.
- `src/lib/advancedReviewStorage.ts` defines validation, diagnostics, record draft mapping and the future storage adapter contract.
- `src/lib/advancedReviewPayloadFunction.ts` implements the helper-only request/response boundary using an injected storage adapter.
- `test/helpers/advancedReviewStorageMockHarness.ts` simulates storage success and failure paths in memory only.
- `test/fixtures/advancedReviewPayloadFunctionFixtures.ts` defines request/response contract fixtures.
- `test/helpers/advancedReviewPayloadFunctionContractHelper.ts` simulates the future function boundary in tests only.
- `test/advancedReviewPayloadFunctionContractHelper.test.ts` proves the future function contract without creating the function.
- `docs/advanced-kitchen-design-build-tool-phase-5-netlify-function-contract-test-plan.md` defines the accepted request, response, status and diagnostic contract.
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md` defines how the Netlify wrapper should call the helper while remaining disabled/no-write.

## Purpose

The eventual runtime should be a very thin Netlify wrapper around already-tested validation and storage contracts.

The future function should:

1. Accept only `POST`.
2. Require JSON.
3. Parse a bounded body containing `payload: AdvancedReviewConsolePayload`.
4. Validate the payload.
5. Call an injected or server-created `AdvancedReviewStorageAdapter`.
6. Map adapter diagnostics to safe HTTP responses.
7. Return only safe acknowledgement fields.

It should not become a broad admin API, report generator, AI review service, customer portal, quote finalisation path or CRM.

## Implemented Helper-Only Slice

Implemented locally:

```text
src/lib/advancedReviewPayloadFunction.ts
test/advancedReviewPayloadFunctionContractHelper.test.ts
```

Current behaviour:

- accepts a request-like object with `method`, `headers.get()` and `json()`
- rejects non-POST requests with `405`
- rejects missing JSON content type, invalid JSON, missing payload and invalid payloads with `400`
- calls an injected `AdvancedReviewStorageAdapter`
- maps storage diagnostics to safe HTTP-style statuses
- returns safe JSON response bodies only
- performs no Supabase writes
- imports no Netlify runtime
- reads no production environment variables
- creates no Netlify Function file

This helper is not publicly exposed and is not wired to `/scope-builder`, `/design-brief`, `/admin/leads` or any Netlify Function.

## Recommended Future File Shape

If Vincent later approves the Netlify wrapper, prefer this structure:

```text
netlify/functions/kitchen-advanced-review-payload.ts
test/advancedReviewPayloadFunctionContract.test.ts
```

Why split the helper from the wrapper:

- the helper can be tested directly with the existing fixtures
- the Netlify wrapper stays small
- the storage adapter can be dependency-injected in tests
- no real Supabase or Netlify deploy is required for local contract tests

## Server Helper Contract

Future helper name suggestion:

```ts
handleKitchenAdvancedReviewPayloadRequest(request, adapter, context)
```

Inputs:

- standard Web API `Request` when available
- `AdvancedReviewStorageAdapter`
- optional safe request context, such as `requestId`

Outputs:

- standard Web API `Response`

The helper should own:

- method handling
- content-type checks
- JSON parsing
- body shape checks
- adapter call
- diagnostic-to-status mapping
- sanitized response shape

The helper should not own:

- Supabase client creation
- SQL migration
- admin display state
- customer report generation
- browser route wiring

## Netlify Wrapper Contract

Future wrapper should use modern Netlify Function syntax:

```ts
import type { Context } from '@netlify/functions';

export default async function handler(request: Request, context: Context) {
  // create server-side adapter only after runtime storage is approved
  // pass request and adapter to the server helper
}
```

Rules:

- use default export
- avoid legacy `exports.handler`
- use standard `Request` and `Response`
- use `Netlify.env.get(...)` for future server-side environment variables
- do not expose service role keys to browser bundles
- keep function path at `/.netlify/functions/kitchen-advanced-review-payload` unless Vincent approves a custom path

## Fixture Mapping

The future contract test should reuse or migrate these local fixtures:

| Current fixture/helper | Future use |
| --- | --- |
| `validAdvancedReviewPayloadRequestBody` | confirms successful storage maps to `202` and `stored: true` |
| `rawScopeBuilderStateRequestBody` | confirms raw advanced-tool state is rejected |
| `unsafeAdvancedReviewPayloadRequestBody` | confirms internal fields are rejected and never returned |
| `oversizedAdvancedReviewPayloadRequestBody` | confirms bounds still protect the endpoint |
| `createAdvancedReviewPayloadContractRequest` | can become a standard `Request` builder if Jest supports Web APIs |
| `handleAdvancedReviewPayloadContractRequest` | can be replaced by the real helper or used as a behavioural reference |
| `createAdvancedReviewStorageMockHarness` | remains the first adapter test double |

Do not replace the mock harness with real Supabase calls in contract tests.

## Diagnostic Mapping

Preserve the current mapping unless Vincent explicitly approves a change:

| Condition | Diagnostic | Status |
| --- | --- | --- |
| Success | `advanced_review_payload_stored` | `202` |
| Invalid method | `advanced_review_method_not_allowed` | `405` |
| Invalid JSON/content/payload | `advanced_review_payload_invalid` | `400` |
| Missing storage environment | `advanced_review_payload_env_missing` | `503` |
| Lead link cannot be confirmed | `advanced_review_lead_not_found` | `409` |
| Insert path fails | `advanced_review_insert_failed` | `503` |

Do not return success unless the adapter returns `stored: true`.

## Safe Response Shape

Successful response:

```json
{
  "ok": true,
  "stored": true,
  "recordId": "safe-record-id",
  "diagnostic": "advanced_review_payload_stored"
}
```

Failure response:

```json
{
  "ok": false,
  "stored": false,
  "diagnostic": "safe_diagnostic_category",
  "message": "Safe customer-neutral message."
}
```

Never return:

- service role keys
- API keys
- raw request payload
- internal notes
- operator notes
- supplier costs
- internal rates
- margin or markup logic
- lead score
- admin priority
- file contents

## Runtime Adapter Boundary Later

The first implementation slice, if approved, should still use a mock adapter in tests.

A real Supabase adapter should remain a later separate slice because it needs:

- approved SQL for `kitchen_advanced_review_payloads`
- approved RLS policy
- server-side `OPERON_KITCHENS_SUPABASE_URL`
- server-side `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`
- safe log handling
- production deployment approval

Do not combine the first wrapper implementation with real Supabase writes.

## Completed Runtime Slice

Completed locally:

1. Created `src/lib/advancedReviewPayloadFunction.ts`.
2. Moved behaviour from `test/helpers/advancedReviewPayloadFunctionContractHelper.ts` into the server helper.
3. Updated the test helper to delegate to the server helper.
4. Kept the no-write mock harness as the adapter.
5. Confirmed no `@supabase/supabase-js`, `Netlify.env` or production environment import in this slice.
6. Created only the disabled/no-write Netlify wrapper after explicit local approval.

The next slice after the disabled/no-write wrapper should be a real Supabase adapter plan only. Any actual Supabase adapter, SQL, admin UI or browser submission wiring remains separately gated.

## Acceptance Criteria Before Any Runtime Coding

Before creating the Netlify wrapper, Vincent should approve:

- this completed helper-only slice
- whether the next slice is wrapper-only with a disabled/no-write adapter or waits for Supabase adapter planning
- whether `202` remains the success status
- whether `409` remains the lead-link failure status
- whether payload size should be enforced as `400` or `413`
- whether function invocation is hidden-tool-only or admin-only for the first pilot
- whether any Netlify deploy is allowed

## Explicitly Deferred

- `netlify/functions/kitchen-advanced-review-payload.ts`
- real Supabase adapter
- SQL migration
- RLS policy
- `/scope-builder` submission wiring
- `/design-brief` submission wiring
- `/admin/leads` advanced payload display
- report generation
- payment
- customer accounts
- full CRM
- supplier workflow
- production verification

## Wrapper Plan Status

The wrapper-only implementation plan now exists in:

```text
docs/advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md
```

That document keeps the next runtime step gated: no real Supabase adapter, SQL, admin UI, deploy or browser submission wiring is approved.

Wrapper contract tests now exist in:

```text
test/advancedReviewPayloadWrapperContract.test.ts
```

Those tests use Request-compatible objects and a mock/no-write adapter expectation without creating the actual Netlify wrapper.

## Recommended Next Step

Human review the helper-only runtime slice, wrapper-only plan and wrapper contract tests.

If approved later, the next local-only task should be a real Supabase adapter planning spec for `kitchen-advanced-review-payload`, still without implementing Supabase writes, admin UI, browser submission wiring or deployment until Vincent explicitly approves that runtime slice.
