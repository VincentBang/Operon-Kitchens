# Advanced Tool Phase 5 - Netlify Function Contract Test Plan

Last updated: 25 June 2026

Deployment status: not needed.

## Status

This is a contract test plan only for a future Netlify Function:

```text
POST /.netlify/functions/kitchen-advanced-review-payload
```

The disabled/no-write Netlify wrapper now exists locally. No real Supabase adapter, Supabase SQL, admin UI, browser submission wiring, deploy, push or production verification is approved by this document.

The current local foundations are:

- `src/lib/advancedReviewConsole.ts` creates the customer-safe `AdvancedReviewConsolePayload`.
- `src/lib/advancedReviewStorage.ts` defines the future storage contract, validation and record draft mapping.
- `test/helpers/advancedReviewStorageMockHarness.ts` simulates storage outcomes in tests only.
- `src/lib/advancedReviewPayloadFunction.ts` implements the helper-only function boundary with an injected storage adapter.
- `test/fixtures/advancedReviewPayloadFunctionFixtures.ts` defines request/response contract fixtures.
- `test/helpers/advancedReviewPayloadFunctionContractHelper.ts` defines a thin test-only request builder and delegates to the runtime helper.
- `test/advancedReviewPayloadFunctionContractHelper.test.ts` validates the future function contract without implementing the function.
- `docs/advanced-kitchen-design-build-tool-phase-5-slice-2-storage-adapter-plan.md` documents the server-mediated storage plan.
- `docs/advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md` maps these fixtures to a future helper-first implementation without approving runtime code.

## Purpose

The future function should attach a bounded advanced-review payload to an existing request-review lead so operators can review structured project context later.

The contract tests should prove the function boundary before any production storage implementation is added.

The function is not a public quote generator, customer portal, payment flow, full CRM, AI document review system or supplier workflow.

## Function Contract Under Test

Future function name:

```text
netlify/functions/kitchen-advanced-review-payload.ts
```

Future public path:

```text
/.netlify/functions/kitchen-advanced-review-payload
```

Preferred Netlify syntax for the eventual implementation:

- modern default export
- standard Web API `Request`
- standard Web API `Response`
- optional `Config` only if a custom path is needed
- `Netlify.env.get(...)` for server-side environment variables

Do not use a browser-side Supabase client for this flow.

## Request Contract

Allowed method:

- `POST`

Required headers:

- `content-type: application/json`

Required JSON body:

```ts
{
  "payload": AdvancedReviewConsolePayload
}
```

Optional JSON body:

```ts
{
  "requestId": "safe-client-or-server-correlation-id"
}
```

The future function must validate the projected payload with the same rules as `validateAdvancedReviewPayloadForStorage`.

The future function must reject raw advanced-tool form objects and unsupported internal fields.

## Allowed Payload Boundary

The future function may accept only the projected `AdvancedReviewConsolePayload` fields:

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

The future function must reject or ignore unsupported client fields such as:

- `supplierCost`
- `internalRate`
- `margin`
- `markup`
- `leadScore`
- `leadPriority`
- `adminPriority`
- `internalNotes`
- `operatorNotes`
- `internal_review_status`
- `serviceRoleKey`
- `rawDesignBrief`
- `rawScopeBuilderState`
- `rawAllowanceInputs`

## Response Contract

Successful storage:

```json
{
  "ok": true,
  "stored": true,
  "recordId": "uuid-or-safe-record-id",
  "diagnostic": "advanced_review_payload_stored"
}
```

Invalid payload:

```json
{
  "ok": false,
  "stored": false,
  "diagnostic": "advanced_review_payload_invalid",
  "message": "Payload could not be stored."
}
```

Missing storage environment:

```json
{
  "ok": false,
  "stored": false,
  "diagnostic": "advanced_review_payload_env_missing",
  "message": "Advanced review storage is not available."
}
```

Referenced lead not found or cannot be linked:

```json
{
  "ok": false,
  "stored": false,
  "diagnostic": "advanced_review_lead_not_found",
  "message": "Advanced review payload could not be linked."
}
```

Insert failure:

```json
{
  "ok": false,
  "stored": false,
  "diagnostic": "advanced_review_insert_failed",
  "message": "Advanced review payload could not be stored."
}
```

The response must never include service keys, raw customer payloads, supplier costs, internal rates, margin logic, lead score, admin priority or hidden pricing logic.

## HTTP Status Contract

Recommended statuses for contract tests:

- `200` or `202` for successful storage.
- `400` for invalid JSON, invalid content type or invalid payload.
- `405` for non-POST methods.
- `409` or `404` for safe lead-linking failures.
- `413` if payload size exceeds the bounded limit chosen during implementation.
- `503` when storage is required but not configured or unavailable.

Do not return success unless the storage adapter returns `stored: true`.

## Safe Diagnostics And Logging

Allowed diagnostic categories:

- `advanced_review_payload_invalid`
- `advanced_review_payload_env_missing`
- `advanced_review_lead_not_found`
- `advanced_review_insert_failed`
- `advanced_review_payload_stored`

Logs may include:

- diagnostic category
- request id
- safe source value
- safe storage result

Logs must not include:

- service role keys
- API keys
- full request body
- raw free-text project details
- internal notes
- supplier costs
- internal rates
- margin or markup logic
- lead score
- admin priority
- file contents

## Contract Test Cases

Use the existing no-write mock harness for function-level tests until a real adapter is separately approved.

Planned tests:

1. `POST` with a valid `AdvancedReviewConsolePayload` returns a safe success response when the adapter stores.
2. `GET` returns `405` and does not call the adapter.
3. `PUT`, `PATCH` and `DELETE` return `405` and do not call the adapter.
4. Missing or non-JSON content type returns `400`.
5. Invalid JSON returns `400`.
6. Missing `payload` returns `400`.
7. Raw design brief object is rejected.
8. Raw scope builder state is rejected.
9. Unsupported internal fields are rejected or stripped before storage.
10. Invalid `leadId` returns `400`.
11. Invalid `source` returns `400`.
12. Invalid `recommendedOperatorAction` returns `400`.
13. Incorrect `safetyMessage` returns `400`.
14. Oversized arrays or strings return `400` or `413`.
15. Missing storage environment returns `503` with `advanced_review_payload_env_missing`.
16. Lead-link failure returns `404` or `409` with `advanced_review_lead_not_found`.
17. Insert failure returns `503` with `advanced_review_insert_failed`.
18. Successful storage returns `stored: true` and `advanced_review_payload_stored`.
19. Failed storage never returns `stored: true`.
20. Browser response never includes service keys or internal pricing/admin fields.
21. Safe logs include diagnostics only and do not include raw payloads or secrets.
22. Function imports no browser-only code and does not expose Supabase service role credentials to client bundles.

## Local Test Fixture Shape

Implemented locally:

- `test/fixtures/advancedReviewPayloadFunctionFixtures.ts`
- `test/helpers/advancedReviewPayloadFunctionContractHelper.ts`
- `test/advancedReviewPayloadFunctionContractHelper.test.ts`

Current behaviour:

- creates a valid `AdvancedReviewConsolePayload` fixture
- creates raw scope-builder and unsafe internal-field fixtures
- simulates the future request boundary with method, content-type and JSON parsing
- uses the no-write mock adapter harness for storage outcomes
- maps success and failure diagnostics to safe HTTP-style statuses
- returns safe JSON bodies only
- imports no Supabase client, no Netlify runtime and no production environment variables

This is a helper-only runtime slice and test fixture layer. It is not a Netlify Function implementation.

## Test Implementation Shape For Later

When the Netlify wrapper is approved, migrate or extend the existing contract tests in:

```text
test/advancedReviewPayloadFunctionContract.test.ts
```

Preferred test strategy:

- import the future function handler directly after it exists
- build standard Web API `Request` objects in tests if the Jest environment supports them, or keep the current test-boundary helper as an adapter
- use the no-write mock adapter or dependency injection
- assert `Response.status`
- assert sanitized JSON response
- assert adapter calls and diagnostics
- avoid real Supabase, real Netlify deploys and real environment variables

If the final implementation cannot support direct dependency injection, create a small server-only helper that accepts an adapter and returns a `Response`. Keep the Netlify wrapper thin.

The helper-first implementation sequence is documented in `docs/advanced-kitchen-design-build-tool-phase-5-thin-function-implementation-plan.md`, and the helper-only slice now exists in `src/lib/advancedReviewPayloadFunction.ts`.

The wrapper-only implementation sequence is documented in `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md`. It keeps `netlify/functions/kitchen-advanced-review-payload.ts` gated until wrapper contract tests and Vincent approval exist.

Wrapper contract tests now exist in `test/advancedReviewPayloadWrapperContract.test.ts`. They use Request-compatible objects and mock/no-write adapter expectations without creating the actual wrapper file.

## Approval Gate Before Function Coding

Before implementing `netlify/functions/kitchen-advanced-review-payload.ts`, Vincent should approve:

- this contract test plan
- exact success status: `200` or `202`
- exact lead-link failure status: `404` or `409`
- payload size limit
- whether the function is callable only from hidden advanced-tool routes or from admin-only tooling later
- table SQL and RLS plan for `kitchen_advanced_review_payloads`
- one local implementation slice and test plan
- whether any deployment is allowed

## Explicitly Deferred

- creating `netlify/functions/kitchen-advanced-review-payload.ts`
- implementing a Supabase adapter
- applying SQL for `kitchen_advanced_review_payloads`
- wiring `/scope-builder` or `/design-brief` to submit payloads
- adding advanced payload display to `/admin/leads`
- report generation
- customer accounts
- payment
- full CRM
- supplier workflow
- public exposure of hidden advanced-tool routes

## Recommended Next Step

Human review this function contract test plan, the wrapper-only implementation plan and the wrapper contract tests.

If approved later, the next local-only task should be a real Supabase adapter plan for `kitchen-advanced-review-payload`, still without implementing Supabase writes, admin UI, browser submission wiring or deployment.
