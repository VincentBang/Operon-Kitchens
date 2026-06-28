import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function readDoc(relativePath: string) {
  return readFileSync(join(process.cwd(), relativePath), 'utf8');
}

describe('advanced review wrapper activation readiness review', () => {
  const reviewPath = 'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-activation-readiness-review.md';

  it('documents activation as a gated review only', () => {
    const review = readDoc(reviewPath);

    expect(review).toContain('Wrapper Activation Readiness Review');
    expect(review).toContain('No SQL was applied.');
    expect(review).toContain('No admin UI was changed. No browser submission wiring was added.');
    expect(review).toContain('No push, deploy or production verification is approved.');
    expect(review).toContain('The current wrapper is active locally.');
    expect(review).toContain('reads server-only Netlify Function environment values with `Netlify.env.get`');
    expect(review).toContain('does not fake success');
  });

  it('lists the required approval, SQL, Supabase and Netlify gates', () => {
    const review = readDoc(reviewPath);

    expect(review).toContain('Vincent explicitly approves any push/deploy of the active wrapper.');
    expect(review).toContain('public.kitchen_advanced_review_payloads');
    expect(review).toContain('public.kitchen_request_reviews');
    expect(review).toContain('RLS is enabled');
    expect(review).toContain('anon` has no table access');
    expect(review).toContain('authenticated` has no table access');
    expect(review).toContain('service_role` has only the documented server-side table access');
    expect(review).toContain('No public policy is created.');
    expect(review).toContain('No browser-side Supabase write path is created.');
    expect(review).toContain('No `SECURITY DEFINER` helper is added');
    expect(review).toContain('OPERON_KITCHENS_SUPABASE_URL');
    expect(review).toContain('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY');
    expect(review).toContain('No browser-facing environment variable contains the service-role key.');
  });

  it('protects the future wrapper shape and response contract', () => {
    const review = readDoc(reviewPath);

    expect(review).toContain('It imports `handleAdvancedReviewPayloadFunctionRequest`.');
    expect(review).toContain('It imports `createAdvancedReviewSupabaseStorageAdapter`.');
    expect(review).toContain('It uses `Netlify.env.get`, not `process.env`.');
    expect(review).toContain('It keeps the default `/.netlify/functions/kitchen-advanced-review-payload` route');
    expect(review).toContain('advanced_review_method_not_allowed');
    expect(review).toContain('advanced_review_payload_invalid');
    expect(review).toContain('advanced_review_payload_env_missing');
    expect(review).toContain('advanced_review_lead_not_found');
    expect(review).toContain('advanced_review_insert_failed');
    expect(review).toContain('advanced_review_payload_stored');
    expect(review).toContain('Success responses may include only');
    expect(review).toContain('safe `recordId`');
  });

  it('keeps internal fields, product exposure and rollout actions blocked', () => {
    const review = readDoc(reviewPath);

    expect(review).toContain('No response, log, fixture, email, browser output or customer-facing surface may expose');
    expect(review).toContain('supplier costs');
    expect(review).toContain('internal rates');
    expect(review).toContain('margin or markup logic');
    expect(review).toContain('lead score');
    expect(review).toContain('admin priority');
    expect(review).toContain('internal notes');
    expect(review).toContain('raw customer document text');
    expect(review).toContain('/design-brief` remains disabled by default.');
    expect(review).toContain('/scope-builder` remains disabled by default.');
    expect(review).toContain('Browser submission wiring from `/design-brief` or `/scope-builder` remains out of scope.');
    expect(review).toContain('/admin/leads` advanced payload display remains out of scope.');
    expect(review).toContain('payment');
    expect(review).toContain('full CRM');
  });

  it('includes focused tests, rollback steps and no-go triggers before activation', () => {
    const review = readDoc(reviewPath);

    expect(review).toContain('npm test -- test/advancedReviewPayloadActiveWrapperContract.test.ts --runInBand');
    expect(review).toContain('npm test -- test/advancedReviewPayloadWrapperReplacementContract.test.ts --runInBand');
    expect(review).toContain('npm test -- --runInBand');
    expect(review).toContain('npm run lint');
    expect(review).toContain('npm run build');
    expect(review).toContain('git diff --check');
    expect(review).toContain('Restore `disabledAdvancedReviewStorageAdapter`.');
    expect(review).toContain('Remove the active Supabase adapter import.');
    expect(review).toContain('Remove direct `Netlify.env.get` calls from the wrapper.');
    expect(review).toContain('No-Go Triggers');
    expect(review).toContain('The service-role key is present in any `NEXT_PUBLIC_` variable.');
    expect(review).toContain('A deploy or production verification is needed but not approved.');
  });
});
