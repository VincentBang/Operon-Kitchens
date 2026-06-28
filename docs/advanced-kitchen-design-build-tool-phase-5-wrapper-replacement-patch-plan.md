# Advanced Tool Phase 5 - Wrapper Replacement Patch Plan

Last updated: 28 June 2026

Deployment status: not needed.

## Status

This is a patch plan only for a future approved runtime replacement of:

```text
netlify/functions/kitchen-advanced-review-payload.ts
```

No wrapper file was replaced. No SQL was applied. No admin UI was changed. No browser submission wiring was added. No deploy, push or production verification is approved.

Active-wrapper contract tests now exist in `test/advancedReviewPayloadActiveWrapperContract.test.ts`. They prove the intended future wrapper surface with `Netlify.env.get`, JSON/no-store response headers and mocked Supabase outcomes while keeping the actual wrapper disabled.

## Purpose

This plan turns the wrapper replacement implementation checklist into the smallest future patch shape, so the next approved runtime slice can be executed without rethinking scope.

The future patch should activate the existing server-only Supabase adapter for `kitchen-advanced-review-payload` while preserving the customer-safe function boundary.

## Preconditions Before Applying This Patch Later

Do not apply this patch unless all of these are true:

1. Vincent explicitly approves replacing the disabled wrapper.
2. `public.kitchen_advanced_review_payloads` exists or an approved non-production test mode is documented.
3. `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql` has been reviewed and, if production activation is intended, applied manually.
4. RLS is enabled on `public.kitchen_advanced_review_payloads`.
5. `anon` and `authenticated` have no table access.
6. `service_role` has the documented table access.
7. Netlify Functions have server-only access to:
   - `OPERON_KITCHENS_SUPABASE_URL`
   - `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`
8. No `NEXT_PUBLIC_` service-role variable exists.
9. Vincent separately approves one deploy and one controlled verification after the patch is committed.

## Patch Scope

The future runtime patch may modify:

```text
netlify/functions/kitchen-advanced-review-payload.ts
test/advancedReviewPayloadDisabledWrapper.test.ts
test/advancedReviewPayloadWrapperReplacementContract.test.ts
test/advancedReviewPayloadActiveWrapperContract.test.ts
test/advancedDesignBuildToolDocs.test.ts
docs/advanced-kitchen-design-build-tool-implementation-tracker.md
docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md
docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md
```

The future runtime patch must not modify:

- `src/pages/design-brief.tsx`
- `src/pages/scope-builder.tsx`
- `src/pages/admin/leads.tsx`
- public header, footer, chatbot or sitemap
- request-review lead intake
- file upload functions
- payment, auth, CRM or supplier workflow
- production Supabase settings directly
- Netlify site settings

## Intended Wrapper Diff Shape

This is the intended future change, not a patch to apply in this task.

```diff
 import {
   AdvancedReviewPayloadFunctionResponse,
   handleAdvancedReviewPayloadFunctionRequest,
 } from '../../src/lib/advancedReviewPayloadFunction';
-import type { AdvancedReviewStorageAdapter } from '../../src/lib/advancedReviewStorage';
-import { validateAdvancedReviewPayloadForStorage } from '../../src/lib/advancedReviewStorage';
+import { createAdvancedReviewSupabaseStorageAdapter } from '../../src/lib/advancedReviewSupabaseStorage';
@@
-const disabledAdvancedReviewStorageAdapter: AdvancedReviewStorageAdapter = {
-  async savePayload(request) {
-    const validation = validateAdvancedReviewPayloadForStorage(request.payload);
-    if (!validation.ok) {
-      return {
-        ok: false,
-        stored: false,
-        diagnostic: validation.diagnostic,
-        message: 'Advanced review payload could not be accepted.',
-      };
-    }
-
-    return {
-      ok: false,
-      stored: false,
-      diagnostic: 'advanced_review_payload_env_missing',
-      message: 'Advanced review storage is not enabled.',
-    };
-  },
-};
-
 async function toNetlifyResponse(response: AdvancedReviewPayloadFunctionResponse) {
@@
 export default async function handler(request: Request) {
   const response = await handleAdvancedReviewPayloadFunctionRequest(
     request,
-    disabledAdvancedReviewStorageAdapter,
+    createAdvancedReviewSupabaseStorageAdapter({
+      supabaseUrl: Netlify.env.get('OPERON_KITCHENS_SUPABASE_URL'),
+      serviceRoleKey: Netlify.env.get('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY'),
+    }),
   );
 
   return toNetlifyResponse(response);
 }
```

The future patch should keep the default `/.netlify/functions/kitchen-advanced-review-payload` route and should not add a `config.path` unless Vincent explicitly approves a route change.

## Expected Test Changes

When the future runtime patch is approved, update tests so they prove:

1. The wrapper imports `createAdvancedReviewSupabaseStorageAdapter`.
2. The wrapper no longer contains `disabledAdvancedReviewStorageAdapter`.
3. The wrapper uses `Netlify.env.get`.
4. The wrapper does not use `process.env`.
5. The wrapper still delegates to `handleAdvancedReviewPayloadFunctionRequest`.
6. JSON responses still include:
   - `Content-Type: application/json`
   - `Cache-Control: no-store`
7. Valid mocked storage success returns:
   - `202`
   - `ok: true`
   - `stored: true`
   - `advanced_review_payload_stored`
8. Missing env returns:
   - `503`
   - `advanced_review_payload_env_missing`
9. Missing linked lead returns:
   - `409`
   - `advanced_review_lead_not_found`
10. Insert failure returns:
   - `503`
   - `advanced_review_insert_failed`
11. Unsafe payloads are rejected before Supabase calls.
12. Responses do not expose service keys, supplier costs, internal rates, margins, lead scores, admin priority, internal notes or raw customer document text.

## Patch Execution Order For Later

Use this order only after Vincent approves runtime replacement:

1. Confirm the SQL/storage gate is satisfied.
2. Run the focused tests against the disabled wrapper and record baseline failures expected after activation.
3. Patch only `netlify/functions/kitchen-advanced-review-payload.ts`.
4. Update disabled-wrapper tests into active-wrapper tests.
5. Keep wrapper replacement contract tests mocked.
6. Update tracker/docs to say the wrapper is active locally but not deployed.
7. Run the full local gate.
8. Stop before commit/push/deploy unless Vincent separately approves.

## Local Gate For Later

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

## Safe Rollback For Later

If the future approved patch fails locally:

1. Restore `disabledAdvancedReviewStorageAdapter`.
2. Remove the active Supabase adapter import.
3. Remove direct `Netlify.env.get` calls from the wrapper.
4. Re-run focused wrapper tests.
5. Re-run the full local gate.

If the future approved patch fails after deploy, Vincent must approve one rollback deploy before changing production again.

## Explicitly Deferred

- applying this patch in the current task
- applying SQL
- changing Netlify environment variables
- changing `/admin/leads`
- wiring `/scope-builder` or `/design-brief` submissions
- exposing hidden advanced-tool routes
- report generation
- payment
- customer accounts
- full CRM
- supplier workflow
- deploy, push or production verification

## Recommended Next Step

Human review this patch plan with:

- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql`
- `docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md`

If approved later, the safest next local-only task is to prepare a wrapper activation readiness review, still without changing the actual wrapper, applying SQL, changing admin UI, wiring browser submissions, pushing or deploying.
