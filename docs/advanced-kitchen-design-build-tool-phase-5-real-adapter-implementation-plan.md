# Advanced Tool Phase 5 - Real Adapter Implementation Plan

Last updated: 27 June 2026

Deployment status: not needed.

## Status

This document records the local implementation shape for the real Supabase adapter behind:

```text
POST /.netlify/functions/kitchen-advanced-review-payload
public.kitchen_advanced_review_payloads
```

Implemented locally:

- `src/lib/advancedReviewSupabaseStorage.ts`
- `test/advancedReviewSupabaseStorage.test.ts`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md`
- `test/advancedReviewPayloadWrapperReplacementContract.test.ts`

Still not approved or implemented:

- active Supabase writes through the disabled Netlify wrapper
- SQL application
- actual replacement of the disabled/no-write wrapper
- `/admin/leads` changes
- browser submission wiring
- deploy, push or production verification

The existing disabled wrapper must remain disabled until Vincent separately approves the runtime storage slice and a release checkpoint.

In short: adapter code and wrapper replacement contract tests exist locally, but no SQL, actual wrapper replacement, admin UI, browser wiring or deploy is approved by this slice.

## Exact Server-Only File

The server-only adapter file is:

```text
src/lib/advancedReviewSupabaseStorage.ts
```

The file exports:

```ts
export interface AdvancedReviewSupabaseStorageEnv {
  supabaseUrl?: string;
  serviceRoleKey?: string;
}

export function getAdvancedReviewSupabaseStorageEnv(): AdvancedReviewSupabaseStorageEnv;

export function createAdvancedReviewSupabaseStorageAdapter(
  env?: AdvancedReviewSupabaseStorageEnv,
): AdvancedReviewStorageAdapter;
```

The adapter must implement the existing `AdvancedReviewStorageAdapter` contract from:

```text
src/lib/advancedReviewStorage.ts
```

Do not import this adapter from:

- `/design-brief`
- `/scope-builder`
- public React components
- static pages
- tests that run in `jsdom` browser context

The adapter may be imported only by server-side tests and, after a separate approval, the Netlify Function wrapper.

## Dependency Strategy

Default strategy: use direct Supabase REST calls with `fetch`, matching the existing request-review storage pattern in:

```text
src/lib/kitchenLeadStorage.ts
```

Do not add `@supabase/supabase-js` for the first real adapter slice unless Vincent separately approves a dependency change.

Reason:

- the current repo has no Supabase client dependency
- existing lead storage already uses REST with service-role headers
- no `package.json` or lockfile change is needed for the first adapter slice
- tests can mock `global.fetch` directly

If a later task chooses `@supabase/supabase-js`, that task must:

- pin the package version
- commit the lockfile change
- prove the client is imported only in server/function paths
- re-run the Supabase security checklist before implementation

## Environment Access Pattern

The adapter reads only these server-side variables:

```text
OPERON_KITCHENS_SUPABASE_URL
OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY
```

Use this pattern:

1. `getAdvancedReviewSupabaseStorageEnv()` reads `process.env.OPERON_KITCHENS_SUPABASE_URL` and `process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`.
2. Trim values before use.
3. Treat a missing or blank value as `advanced_review_payload_env_missing`.
4. Do not log variable values.
5. Do not return variable values in JSON responses.
6. Do not create `NEXT_PUBLIC_` equivalents.
7. Do not read Supabase secrets in browser-facing files.

The function wrapper should continue delegating request parsing to:

```text
src/lib/advancedReviewPayloadFunction.ts
```

The wrapper should receive the adapter instance only after wrapper replacement is explicitly approved.

## REST Endpoint Shape

The adapter builds endpoints by trimming a trailing slash from `supabaseUrl`.

Lead existence check:

```text
GET {SUPABASE_URL}/rest/v1/kitchen_request_reviews?id=eq.{leadId}&select=id&limit=1
```

Advanced payload insert:

```text
POST {SUPABASE_URL}/rest/v1/kitchen_advanced_review_payloads
```

Use headers:

```text
apikey: {serviceRoleKey}
Authorization: Bearer {serviceRoleKey}
Content-Type: application/json
Prefer: return=representation
```

The insert response should be accepted only when it returns a stored row id. If the API returns no id, map to:

```text
advanced_review_insert_failed
```

Do not use browser-side Supabase clients.

## Local Implementation Completed

Completed in this slice:

1. Added `src/lib/advancedReviewSupabaseStorage.ts`.
2. Added mocked-fetch unit tests in `test/advancedReviewSupabaseStorage.test.ts`.
3. Kept `netlify/functions/kitchen-advanced-review-payload.ts` disabled.
4. Did not apply SQL.
5. Did not update `/admin/leads`.
6. Did not wire `/scope-builder` or `/design-brief` browser submissions.
7. Did not deploy.

Do not combine adapter implementation with admin UI, browser submission wiring, or SQL application unless Vincent explicitly combines those scopes.

## Test Changes Implemented

Created:

```text
test/advancedReviewSupabaseStorage.test.ts
```

Use mocked `global.fetch` responses only. Do not call Supabase.

Implemented tests:

1. missing env returns `advanced_review_payload_env_missing` and makes no fetch calls
2. unsupported/internal payload fields return `advanced_review_payload_invalid` and make no fetch calls
3. valid payload checks `kitchen_request_reviews` before insert
4. missing lead maps to `advanced_review_lead_not_found`
5. lead lookup fetch failure maps to `advanced_review_lead_not_found`
6. insert fetch failure maps to `advanced_review_insert_failed`
7. insert success returns `advanced_review_payload_stored` and safe `recordId`
8. insert body equals `createAdvancedReviewStorageRecordDraft(payload)` plus any approved server-only metadata
9. headers include `apikey` and `Authorization` in the request object but test output and response bodies never expose the values
10. no response body contains service role keys, supplier costs, internal rates, margins, lead scores, admin priority or internal notes
11. source file does not import the future adapter into public components
12. disabled wrapper remains separate until wrapper replacement is separately approved

Update existing tests:

- `test/advancedReviewSupabaseAdapterContract.test.ts`: keep as contract coverage and adjust only if the real adapter introduces a deliberate, approved contract change.
- `test/advancedReviewPayloadDisabledWrapper.test.ts`: keep expecting disabled/no-write behaviour until wrapper replacement is approved.
- `test/advancedDesignBuildToolDocs.test.ts`: require this implementation plan and runtime deferral wording.

## Safe Logging And Response Rules

Allowed logs:

- `advanced_review_payload_invalid`
- `advanced_review_payload_env_missing`
- `advanced_review_lead_not_found`
- `advanced_review_insert_failed`
- `advanced_review_payload_stored`

Do not log:

- service role keys
- API keys
- raw full payloads
- full Supabase response bodies if they could contain sensitive content
- customer document contents
- internal notes
- supplier costs
- internal rates
- margin or markup logic
- lead score
- admin priority

Customer/browser responses may include only:

- `ok`
- `stored`
- safe `recordId`
- safe diagnostic category
- generic message when failure occurs

## Future Wrapper Replacement Gate

Replacing the disabled wrapper is a separate task. The replacement plan and mocked contract tests now exist locally, but the real wrapper file has not been replaced.

Do not update:

```text
netlify/functions/kitchen-advanced-review-payload.ts
```

until Vincent approves actual wrapper replacement.

The wrapper replacement contract tests already prove:

- valid POST can reach the real adapter
- missing env still returns safe `503`
- missing lead still returns safe `409`
- insert failure still returns safe `503`
- stored payload returns safe `202`
- non-POST still returns `405`
- unsafe/internal payloads still return `400`

## Future SQL And Production Gate

This document assumes the SQL from:

```text
docs/advanced-kitchen-design-build-tool-phase-5-real-supabase-adapter-plan.md
```

is still pending and must not be applied by Codex without explicit approval.

Before production use, Vincent must approve:

- SQL migration or manual SQL application
- Netlify env var availability
- wrapper replacement
- one deployment
- one controlled production verification

## Explicitly Deferred

- applying SQL
- replacing the disabled wrapper
- browser submission wiring from `/scope-builder` or `/design-brief`
- `/admin/leads` advanced payload display
- admin download/delete/report workflows for advanced payloads
- customer accounts
- payment
- full CRM
- supplier workflow
- deployment or production verification

## Recommended Next Step

Human review this local adapter implementation and the wrapper replacement plan in:

```text
docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md
```

If approved later, the safest next local-only task is to prepare the SQL migration checklist and wrapper replacement implementation checklist side by side, still without applying SQL, changing admin UI, wiring browser submissions or deploying.
