# Advanced Tool Phase 5 - Disabled Wrapper Creation Plan

Last updated: 25 June 2026

Deployment status: not needed.

## Status

The disabled/no-write Netlify Function wrapper has now been implemented locally:

```text
netlify/functions/kitchen-advanced-review-payload.ts
POST /.netlify/functions/kitchen-advanced-review-payload
```

The approved local slice creates the wrapper file and tests only. It remains disabled/no-write and returns a safe storage-unavailable response for valid payloads.

No real Supabase adapter, Supabase SQL, admin UI, browser submission wiring, deploy, push or production verification is approved by this document.

## Purpose

The disabled wrapper proves the Netlify boundary can be created safely before any real persistence exists.

It:

1. Use modern Netlify default export syntax.
2. Receives the standard Netlify `Request`.
3. Creates a disabled/no-write adapter inside the server-only wrapper.
4. Passes the request and adapter to `handleAdvancedReviewPayloadFunctionRequest`.
5. Converts the helper response into a standard `Response`.
6. Returns safe `503` storage-unavailable responses for valid requests.
7. Never fakes success while storage is disabled.

It does not:

- write to Supabase
- import `@supabase/supabase-js`
- read service role keys
- expose service keys or environment values
- update `/admin/leads`
- wire `/scope-builder` or `/design-brief` submissions
- create report generation
- add payment, customer accounts, full CRM or supplier workflow

## Current Foundations

Already implemented locally:

- `src/lib/advancedReviewConsole.ts` projects customer-safe advanced review payloads.
- `src/lib/advancedReviewStorage.ts` defines the future storage adapter contract.
- `src/lib/advancedReviewPayloadFunction.ts` implements the helper-only request/response boundary.
- `netlify/functions/kitchen-advanced-review-payload.ts` implements the disabled/no-write wrapper.
- `test/helpers/advancedReviewStorageMockHarness.ts` simulates storage outcomes without writes.
- `test/fixtures/advancedReviewPayloadFunctionFixtures.ts` defines request/response contract fixtures.
- `test/advancedReviewPayloadFunctionContractHelper.test.ts` proves the helper contract.
- `test/advancedReviewPayloadWrapperContract.test.ts` proves Request-compatible wrapper expectations and disabled/no-write wrapper guardrails.
- `test/advancedReviewPayloadDisabledWrapper.test.ts` proves the actual wrapper remains disabled/no-write.
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md` defines the wrapper boundary.

## Implemented Disabled Wrapper Shape

The implemented wrapper stays intentionally small:

```ts
import {
  AdvancedReviewPayloadFunctionResponse,
  handleAdvancedReviewPayloadFunctionRequest,
} from '../../src/lib/advancedReviewPayloadFunction';
import type { AdvancedReviewStorageAdapter } from '../../src/lib/advancedReviewStorage';
import { validateAdvancedReviewPayloadForStorage } from '../../src/lib/advancedReviewStorage';

const disabledAdvancedReviewStorageAdapter: AdvancedReviewStorageAdapter = {
  async savePayload(request) {
    const validation = validateAdvancedReviewPayloadForStorage(request.payload);
    if (!validation.ok) {
      return {
        ok: false,
        stored: false,
        diagnostic: validation.diagnostic,
        message: 'Advanced review payload could not be accepted.',
      };
    }

    return {
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_env_missing',
      message: 'Advanced review storage is not enabled.',
    };
  },
};

async function toNetlifyResponse(response: AdvancedReviewPayloadFunctionResponse) {
  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export default async function handler(request: Request) {
  const response = await handleAdvancedReviewPayloadFunctionRequest(
    request,
    disabledAdvancedReviewStorageAdapter,
  );

  return toNetlifyResponse(response);
}
```

This wrapper does not read environment variables and does not import Supabase. A later real-storage slice must be separately approved.

## Required Wrapper Rules

The disabled wrapper must:

- use `export default async function handler(request: Request)`
- avoid legacy `exports.handler`
- avoid named `handler` export
- keep the default Netlify path at `/.netlify/functions/kitchen-advanced-review-payload`
- call `handleAdvancedReviewPayloadFunctionRequest`
- call `validateAdvancedReviewPayloadForStorage` before returning disabled storage responses
- keep adapter logic server-side only
- return `advanced_review_payload_env_missing` and `503` while disabled
- do not use `process.env` in the wrapper
- use `Netlify.env.get` only in a later real-storage slice if environment variables are needed
- avoid raw payload logging
- avoid secrets, service role keys, internal pricing/admin fields and customer document contents in responses/logs

## Expected Disabled Behaviour

Current disabled behaviour:

| Request | Expected response |
| --- | --- |
| `GET` | `405`, `advanced_review_method_not_allowed` |
| invalid JSON or unsupported payload | `400`, `advanced_review_payload_invalid` |
| valid payload while storage disabled | `503`, `advanced_review_payload_env_missing`, `stored: false` |

Never fake success while the disabled adapter is active.

Do not return:

- `ok: true`
- `stored: true`
- fake record ids
- raw payload content
- service role keys
- supplier costs
- internal rates
- margin or markup logic
- lead score
- admin priority
- internal notes

## Implemented Tests

Implemented tests prove:

- `netlify/functions/kitchen-advanced-review-payload.ts` exists in this approved local slice.
- the wrapper uses modern default export syntax.
- the wrapper does not contain `exports.handler`.
- the wrapper imports `handleAdvancedReviewPayloadFunctionRequest`.
- the wrapper does not import `@supabase/supabase-js`.
- the wrapper does not contain `process.env`.
- a valid payload maps to `503` and `advanced_review_payload_env_missing` while disabled.
- non-POST requests still map to `405`.
- unsafe payloads still map to `400`.
- responses do not expose service keys, supplier costs, margins, lead scores, admin priority or internal notes.

## Acceptance Criteria Before Real Storage

Vincent should explicitly approve:

- replacing the disabled adapter with a real server-side adapter
- the table name, SQL, RLS and retention posture for advanced-review payloads
- whether valid payloads may return `202` after durable storage succeeds
- keeping `/scope-builder` and `/design-brief` browser submission wiring off until separately approved
- keeping `/admin/leads` unchanged until a separate admin display slice is approved
- not deploying until a separate release checkpoint is approved

## Explicitly Deferred

- real Supabase adapter
- Supabase SQL migration
- RLS policy
- production environment variable changes
- browser submission wiring from `/scope-builder` or `/design-brief`
- `/admin/leads` advanced payload display
- report generation
- payment
- customer accounts
- full CRM
- supplier workflow
- deploy, push or production verification

## Recommended Next Step

Human review the disabled/no-write wrapper file and tests.

If approved later, the safest next local-only task is a real Supabase adapter plan only, still without implementing Supabase writes, admin UI, browser submission wiring, deploy or production verification.
