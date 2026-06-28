# Advanced Tool Phase 5 - Wrapper-Only Implementation Plan

Last updated: 25 June 2026

Deployment status: not needed.

## Status

This document started as a wrapper-only implementation plan. The disabled/no-write wrapper file now exists locally:

```text
netlify/functions/kitchen-advanced-review-payload.ts
POST /.netlify/functions/kitchen-advanced-review-payload
```

The approved local slice creates the wrapper file with a disabled adapter only. No real Supabase adapter, Supabase SQL, admin UI, browser submission wiring, deploy, push or production verification is approved by this document.

## Purpose

The future wrapper should be a thin Netlify boundary around the already-tested helper:

```text
src/lib/advancedReviewPayloadFunction.ts
handleAdvancedReviewPayloadFunctionRequest
```

The wrapper should only translate a real Netlify `Request` and safe server context into the helper. It should not duplicate validation, storage mapping or response-shaping logic that already belongs to the helper.

## Current Local Foundation

Already implemented locally:

- `src/lib/advancedReviewConsole.ts` projects customer-safe advanced review payloads.
- `src/lib/advancedReviewStorage.ts` defines the future storage contract and validates payload shape.
- `test/helpers/advancedReviewStorageMockHarness.ts` simulates storage outcomes without writes.
- `src/lib/advancedReviewPayloadFunction.ts` maps request, JSON and adapter outcomes to safe response bodies.
- `test/fixtures/advancedReviewPayloadFunctionFixtures.ts` defines valid, raw-state, unsafe-field and oversized payload cases.
- `test/helpers/advancedReviewPayloadFunctionContractHelper.ts` delegates to the helper for contract tests.
- `test/advancedReviewPayloadFunctionContractHelper.test.ts` proves the helper behaviour without a Netlify wrapper.
- `test/advancedReviewPayloadWrapperContract.test.ts` proves the wrapper can pass Request-compatible objects to the helper and remains disabled/no-write.
- `netlify/functions/kitchen-advanced-review-payload.ts` contains the disabled/no-write wrapper.
- `test/advancedReviewPayloadDisabledWrapper.test.ts` proves the actual wrapper returns safe disabled responses and does not access Supabase or environment variables.
- `docs/advanced-kitchen-design-build-tool-phase-5-disabled-wrapper-creation-plan.md` defines the disabled/no-write wrapper safety contract.

## Wrapper Responsibilities

The wrapper should:

1. Use modern default export Netlify Function syntax.
2. Receive a standard Web API `Request`.
3. Create or inject a server-side adapter only after a storage slice is approved.
4. Pass the request and adapter to `handleAdvancedReviewPayloadFunctionRequest`.
5. Return the helper's safe `Response` unchanged.
6. Use safe diagnostic logging only.
7. Avoid exposing secrets, raw payloads, internal fields or admin notes.

The wrapper should not:

- validate the advanced payload directly
- create customer reports
- generate final quote language
- create browser-side Supabase clients
- write to Supabase until a separate storage adapter slice is approved
- read or return service role keys
- update `/admin/leads`
- expose hidden `/design-brief` or `/scope-builder` routes

## Recommended File Shape

The current disabled wrapper uses this modern Netlify Functions pattern:

```ts
import { handleAdvancedReviewPayloadFunctionRequest } from '../../src/lib/advancedReviewPayloadFunction';

export default async function handler(request: Request) {
  // Pass the request and disabled/no-write adapter to handleAdvancedReviewPayloadFunctionRequest.
}
```

Rules:

- use a default export
- do not use legacy `exports.handler`
- do not use a named `handler` export
- keep the default function route at `/.netlify/functions/kitchen-advanced-review-payload`
- use `Netlify.env.get` for any future Netlify Function environment variables
- do not use `process.env` inside the function wrapper
- do not import Supabase from browser-facing modules
- do not log full payloads, service keys or customer-sensitive document text

## Adapter Strategy

The first wrapper runtime slice should still avoid production writes.

Recommended sequence:

1. Wrapper contract tests only.
2. Wrapper file with disabled/no-write adapter. Completed locally.
3. Real Supabase adapter later, after SQL, RLS, env vars, admin display and release approval are separately reviewed.

Do not create a real Supabase adapter in the wrapper-only slice.

Safe disabled adapter behaviour:

- call `validateAdvancedReviewPayloadForStorage` before returning disabled storage responses
- return `advanced_review_payload_env_missing`
- return `stored: false`
- return HTTP `503` through the existing helper mapping
- never fake success

Test adapter behaviour:

- use `createAdvancedReviewStorageMockHarness`
- simulate stored, validation failure, env missing, lead not found and insert failed
- avoid real Supabase calls
- avoid Netlify deploys

## Safe Diagnostics

Allowed diagnostic categories:

- `advanced_review_payload_stored`
- `advanced_review_method_not_allowed`
- `advanced_review_payload_invalid`
- `advanced_review_payload_env_missing`
- `advanced_review_lead_not_found`
- `advanced_review_insert_failed`

Logging rules:

- log diagnostic category, request id if available and broad outcome only
- no raw payload logging
- no service role key logging
- no API key logging
- no full customer message logging
- no internal notes, supplier costs, internal rates, margins, lead scores or admin priority

## Response Contract

The wrapper must preserve the helper response shape.

Success:

```json
{
  "ok": true,
  "stored": true,
  "recordId": "safe-record-id",
  "diagnostic": "advanced_review_payload_stored"
}
```

Failure:

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
- hidden pricing logic
- file contents

## Wrapper Contract Tests

Implemented locally:

```text
test/advancedReviewPayloadWrapperContract.test.ts
```

These tests prove:

- the wrapper plan still points to `netlify/functions/kitchen-advanced-review-payload.ts`
- the actual wrapper file exists and uses modern default export syntax
- no `exports.handler` legacy syntax is approved
- the wrapper can pass a Request-compatible object to `handleAdvancedReviewPayloadFunctionRequest`
- non-POST requests return `405`
- invalid JSON returns `400`
- unsafe internal fields are rejected and never returned
- storage success returns `202`, `ok: true` and `stored: true`
- storage environment missing returns `503`, `ok: false` and `stored: false`
- response bodies do not expose secrets or internal pricing/admin fields
- the test adapter is mock-only and does not write to Supabase

These are wrapper contract tests. They are not approval to create a Supabase adapter, SQL migration, admin UI or production deployment.

## Acceptance Criteria Before Real Storage

Vincent should explicitly approve:

- replacing the disabled/no-write adapter with a real Supabase adapter
- whether the endpoint is hidden-tool-only, admin-only or unavailable from browser UI
- whether `202`, `409` and `503` mappings remain unchanged
- whether the function can be included in a future Netlify deploy
- whether any production storage SQL has been approved separately

## Explicitly Deferred

- real Supabase adapter implementation
- Supabase SQL migration
- RLS policy
- production environment variable changes
- `/scope-builder` browser submission wiring
- `/design-brief` browser submission wiring
- `/admin/leads` advanced payload display
- report generation
- payment
- customer accounts
- full CRM
- supplier workflow
- deploy, push or production verification

## Recommended Next Step

Human review the disabled/no-write wrapper, the wrapper contract tests and the disabled-wrapper runtime tests.

If approved later, the safest next local-only task is a real Supabase adapter planning spec only, still without implementing Supabase writes, admin UI, browser submission wiring or deployment.
