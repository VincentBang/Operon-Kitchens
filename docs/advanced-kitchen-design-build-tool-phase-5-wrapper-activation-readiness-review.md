# Advanced Tool Phase 5 - Wrapper Activation Readiness Review

Last updated: 28 June 2026

Deployment status: not needed.

## Status

This is the readiness review and local activation record for:

```text
netlify/functions/kitchen-advanced-review-payload.ts
```

No SQL was applied. No admin UI was changed. No browser submission wiring was added. No push, deploy or production verification is approved.

The current wrapper is active locally. It validates request payloads through the helper boundary, reads server-only Netlify Function environment values with `Netlify.env.get`, calls the server-only Supabase REST adapter, and returns safe diagnostics for missing env, missing linked leads and insert failures. It does not fake success.

## Purpose

This review lists the exact go/no-go gates before the local active wrapper can be treated as production-ready.

It should be read with:

- `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql`
- `docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md`
- `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md`
- `test/advancedReviewPayloadActiveWrapperContract.test.ts`

## Current Active Wrapper Baseline

The current baseline is acceptable only because production persistence is still gated:

- `netlify/functions/kitchen-advanced-review-payload.ts` uses modern Netlify default export syntax.
- It keeps the default `/.netlify/functions/kitchen-advanced-review-payload` path.
- It delegates request handling to `handleAdvancedReviewPayloadFunctionRequest`.
- It uses `createAdvancedReviewSupabaseStorageAdapter`.
- It reads `OPERON_KITCHENS_SUPABASE_URL` through `Netlify.env.get`.
- It reads `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY` through `Netlify.env.get`.
- It rejects invalid or unsafe payloads before Supabase calls.
- It returns JSON responses with `Cache-Control: no-store`.
- It does not use `process.env`.
- It calls Supabase only through the server-side adapter.
- It writes to `public.kitchen_advanced_review_payloads` only when the required server env, linked lead and Supabase insert all succeed.

## Go Gates Before Production Activation

All gates must be true before the local active wrapper can be pushed, deployed or production-verified.

### 1. Approval Gate

- Vincent explicitly approves any push/deploy of the active wrapper.
- Vincent explicitly confirms whether the activation is non-production or production-bound.
- If production-bound, Vincent separately approves one deploy and one controlled production verification.
- The activation scope remains limited to the wrapper, tests and docs needed for the wrapper replacement.

### 2. SQL And Table Gate

- The SQL packet has been reviewed from `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql`.
- If production activation is intended, the SQL packet has been manually applied by Vincent or another approved operator.
- `public.kitchen_advanced_review_payloads` exists.
- `public.kitchen_request_reviews` exists and remains untouched except for the foreign-key relationship.
- `lead_id` references `public.kitchen_request_reviews(id)`.
- `customer_safe_payload` stores only the projected `AdvancedReviewConsolePayload`.
- `internal_review_status` defaults to `not_started`.
- Required indexes exist for `lead_id`, `created_at desc` and `internal_review_status`.
- The table-specific updated-at trigger exists.

### 3. Supabase Security Gate

- RLS is enabled on `public.kitchen_advanced_review_payloads`.
- `anon` has no table access.
- `authenticated` has no table access.
- `service_role` has only the documented server-side table access.
- No public policy is created.
- No browser-side Supabase write path is created.
- No `SECURITY DEFINER` helper is added for this activation.
- No service-role key is stored in a `NEXT_PUBLIC_` variable.

### 4. Netlify Environment Gate

- Netlify Functions have server-only access to `OPERON_KITCHENS_SUPABASE_URL`.
- Netlify Functions have server-only access to `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`.
- No browser-facing environment variable contains the service-role key.
- Environment values are not printed, logged, committed or pasted into chat.
- If production env vars changed, Vincent confirms a fresh deploy will be required before live testing.

### 5. Wrapper Shape Gate

The active wrapper must remain thin:

- It imports `handleAdvancedReviewPayloadFunctionRequest`.
- It imports `createAdvancedReviewSupabaseStorageAdapter`.
- It uses `Netlify.env.get`, not `process.env`.
- It passes only `OPERON_KITCHENS_SUPABASE_URL` and `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY` into the adapter.
- It keeps response construction limited to status, JSON body and no-store headers.
- It does not duplicate JSON parsing, payload validation, lead lookup, insert mapping or diagnostic-to-status mapping.
- It keeps the default `/.netlify/functions/kitchen-advanced-review-payload` route unless Vincent explicitly approves a route change.

### 6. Response Contract Gate

The active wrapper must preserve these outcomes:

| Scenario | Status | Diagnostic |
| --- | --- | --- |
| Non-POST request | `405` | `advanced_review_method_not_allowed` |
| Invalid content type | `400` | `advanced_review_payload_invalid` |
| Invalid or unsafe payload | `400` | `advanced_review_payload_invalid` |
| Missing Supabase environment | `503` | `advanced_review_payload_env_missing` |
| Missing linked request-review lead | `409` | `advanced_review_lead_not_found` |
| Supabase insert failure | `503` | `advanced_review_insert_failed` |
| Stored success | `202` | `advanced_review_payload_stored` |

Success responses may include only:

- `ok`
- `stored`
- `diagnostic`
- safe `recordId`

Failure responses may include only:

- `ok`
- `stored`
- `diagnostic`
- generic customer-safe `message`

### 7. Safety Boundary Gate

No response, log, fixture, email, browser output or customer-facing surface may expose:

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

If logging is added later, it may log diagnostic categories only, such as:

- `advanced_review_payload_invalid`
- `advanced_review_payload_env_missing`
- `advanced_review_lead_not_found`
- `advanced_review_insert_failed`
- `advanced_review_payload_stored`

### 8. Product Exposure Gate

Activation of the wrapper does not approve product exposure:

- `/design-brief` remains disabled by default.
- `/scope-builder` remains disabled by default.
- Neither route is added to public header, footer, chatbot or sitemap.
- Browser submission wiring from `/design-brief` or `/scope-builder` remains out of scope.
- `/admin/leads` advanced payload display remains out of scope.
- Payment, customer accounts, supplier workflow, full CRM and AI report generation remain out of scope.

### 9. Test Gate

Before any approved wrapper replacement, run the focused local tests:

```bash
npm test -- test/advancedReviewPayloadActiveWrapperContract.test.ts --runInBand
npm test -- test/advancedReviewPayloadWrapperReplacementContract.test.ts --runInBand
npm test -- test/advancedReviewSupabaseStorage.test.ts --runInBand
npm test -- test/advancedReviewPayloadDisabledWrapper.test.ts --runInBand
npm test -- test/advancedDesignBuildToolDocs.test.ts --runInBand
```

Then run the full local gate:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

The wrapper tests now prove the real wrapper is active locally and safe under mocked Supabase outcomes.

### 10. Rollback Gate

Before activation, the rollback path must remain clear:

1. Restore `disabledAdvancedReviewStorageAdapter`.
2. Remove the active Supabase adapter import.
3. Remove direct `Netlify.env.get` calls from the wrapper.
4. Return safe `advanced_review_payload_env_missing` for otherwise valid payloads.
5. Keep unsafe-field rejection and no-store JSON responses intact.
6. Run the focused wrapper tests.
7. Run the full local gate.

If production activation later fails after deployment, Vincent must approve one rollback deploy before changing production again.

## No-Go Triggers

Stop and do not push, deploy or production-verify the active wrapper if any of these are true:

- Vincent has not explicitly approved deployment or production activation.
- SQL was copied from Markdown or chat instead of the SQL packet file.
- The SQL table does not exist for a production-bound activation.
- RLS or grants cannot be verified.
- `anon` or `authenticated` has table access.
- The service-role key is present in any `NEXT_PUBLIC_` variable.
- Netlify Function env vars are missing or stale.
- A patch would add browser submission wiring.
- A patch would change `/admin/leads`.
- A patch would expose `/design-brief` or `/scope-builder` publicly.
- A patch would duplicate storage validation or insert logic.
- Responses would include raw payloads, secrets, supplier costs, internal rates, margins, lead scores, admin priority or internal notes.
- Tests, lint, build or `git diff --check` fail.
- A deploy or production verification is needed but not approved.

## Future Activation Sequence

Use this sequence only after production activation approval:

1. Human-review this readiness review, the SQL packet and the patch plan.
2. Confirm the SQL/table/security gates for the intended environment.
3. Confirm the local wrapper patch and directly related tests/docs are ready.
4. Keep `/design-brief`, `/scope-builder`, `/admin/leads` and public navigation unchanged.
5. Run focused tests.
6. Run the full local gate.
7. Stop before commit, push or deploy unless Vincent separately approves.
8. If deploy is approved, do one controlled production POST verification and stop to protect Netlify credits.

## Explicitly Deferred

- applying SQL
- changing production Supabase
- replacing the wrapper again outside the approved local patch
- changing Netlify site settings
- changing Netlify environment variables
- wiring browser submissions
- changing `/admin/leads`
- exposing hidden advanced-tool routes
- report generation
- payment
- customer accounts
- full CRM
- supplier workflow
- push, deploy or production verification

## Recommended Next Step

Human review this readiness review with the SQL approval packet and wrapper replacement patch plan.

If approved later, the next local-only task should be a production activation checklist for the already-active local wrapper, still stopping before SQL execution, admin UI changes, browser submission wiring, push or deploy unless those gates are explicitly approved.
