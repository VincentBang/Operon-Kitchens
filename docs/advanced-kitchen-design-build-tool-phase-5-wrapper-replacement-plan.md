# Advanced Tool Phase 5 - Wrapper Replacement Plan

Last updated: 27 June 2026

Deployment status: not needed.

## Status

This document records the future replacement plan for:

```text
netlify/functions/kitchen-advanced-review-payload.ts
```

The actual wrapper remains disabled/no-write in this slice.

Created locally:

- `test/advancedReviewPayloadWrapperReplacementContract.test.ts`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md`

Already available locally:

- `src/lib/advancedReviewPayloadFunction.ts`
- `src/lib/advancedReviewSupabaseStorage.ts`
- `netlify/functions/kitchen-advanced-review-payload.ts`

Do not replace the disabled wrapper in this slice.

No SQL application, admin UI change, browser submission wiring, deploy, push or production verification is approved.

## Purpose

The future wrapper replacement will connect the existing request parser and safe response helper to the inactive real Supabase adapter.

The replacement should let a server-side Netlify Function store a customer-safe `AdvancedReviewConsolePayload` into:

```text
public.kitchen_advanced_review_payloads
```

only after:

1. Vincent approves the Supabase SQL or migration task.
2. The storage table exists with the documented RLS and service-role posture.
3. The required server-only Supabase env vars are available.
4. Vincent approves replacing the disabled wrapper.
5. Vincent approves one deploy and controlled production verification.

## Current Disabled Wrapper

Current wrapper behaviour must stay unchanged until the replacement slice is explicitly approved:

- modern default export syntax
- delegates parsing to `handleAdvancedReviewPayloadFunctionRequest`
- uses a disabled adapter
- returns safe `503` with `advanced_review_payload_env_missing` for otherwise valid payloads
- validates unsafe payloads before the disabled response
- does not import `advancedReviewSupabaseStorage`
- does not read `process.env`
- does not read `Netlify.env`
- does not call Supabase
- does not fake success

## Future Replacement Shape

When Vincent approves the runtime replacement, the wrapper should make one narrow change:

```ts
import { createAdvancedReviewSupabaseStorageAdapter } from '../../src/lib/advancedReviewSupabaseStorage';
import { handleAdvancedReviewPayloadFunctionRequest } from '../../src/lib/advancedReviewPayloadFunction';

export default async function handler(request: Request) {
  const response = await handleAdvancedReviewPayloadFunctionRequest(
    request,
    createAdvancedReviewSupabaseStorageAdapter(),
  );

  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
```

The future slice should keep the wrapper thin. It should not duplicate validation, SQL mapping, lead lookup, insert logic or diagnostic mapping.

## Contract Tests Added

Created:

```text
test/advancedReviewPayloadWrapperReplacementContract.test.ts
```

The tests prove the future replacement path with mocked Supabase only:

1. the replacement plan exists
2. the actual disabled wrapper still imports no real adapter
3. valid POST can reach `createAdvancedReviewSupabaseStorageAdapter`
4. mocked lead lookup plus mocked insert returns `advanced_review_payload_stored`
5. missing env maps to safe `503`
6. missing linked lead maps to safe `409`
7. insert failure maps to safe `503`
8. non-POST maps to `405`
9. invalid content type maps to `400`
10. unsafe internal fields map to `400`
11. mocked insert receives bounded `storage_request_id`
12. response bodies do not expose service keys, supplier costs, internal rates, margin, markup, lead score, admin priority or internal notes

These tests do not call Supabase and do not replace the disabled wrapper.

## Required Runtime Gate Before Replacement

Do not replace the wrapper until these are all true:

1. SQL for `public.kitchen_advanced_review_payloads` is reviewed and approved.
2. SQL is applied manually or through an approved migration.
3. `OPERON_KITCHENS_SUPABASE_URL` is available to Netlify Functions.
4. `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY` is available to Netlify Functions.
5. `/scope-builder` or another approved server-side path has a valid request-review `leadId`.
6. The response contract remains customer-safe.
7. Vincent approves one deploy and one controlled verification.

Use the detailed implementation checklist before coding:

```text
docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md
```

Use the patch plan before editing the wrapper:

```text
docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md
```

## Safe Diagnostics

The future active wrapper may return only these diagnostic categories through the helper:

- `advanced_review_method_not_allowed`
- `advanced_review_payload_invalid`
- `advanced_review_payload_env_missing`
- `advanced_review_lead_not_found`
- `advanced_review_insert_failed`
- `advanced_review_payload_stored`

Do not return Supabase error bodies, service keys, raw payloads, internal notes, supplier costs, internal rates, margin logic, lead score or admin priority.

## Explicitly Deferred

- replacing the disabled wrapper
- applying SQL
- changing Netlify env vars
- browser submission wiring from `/scope-builder` or `/design-brief`
- `/admin/leads` advanced payload display
- report generation
- payment
- customer accounts
- full CRM
- supplier workflow
- deploy, push or production verification

## Recommended Next Step

Human review this wrapper replacement plan, implementation checklist, patch plan and contract test suite.

If approved later, the safest next local-only task is to write active-wrapper contract tests from the patch plan, still without replacing the wrapper, applying SQL, changing admin UI, wiring browser submissions or deploying.
