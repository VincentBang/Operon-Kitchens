import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  advancedReviewPayloadFixtureLeadId,
  oversizedAdvancedReviewPayloadRequestBody,
  rawScopeBuilderStateRequestBody,
  unsafeAdvancedReviewPayloadRequestBody,
  validAdvancedReviewPayloadRequestBody,
} from './fixtures/advancedReviewPayloadFunctionFixtures';
import {
  createAdvancedReviewPayloadContractRequest,
  handleAdvancedReviewPayloadContractRequest,
  readAdvancedReviewPayloadContractJson,
} from './helpers/advancedReviewPayloadFunctionContractHelper';
import { createAdvancedReviewStorageMockHarness } from './helpers/advancedReviewStorageMockHarness';

const forbiddenResponseFragments = [
  'service_role',
  'service role',
  'supplier cost',
  'internal rate',
  'margin',
  'markup',
  'lead score',
  'leadscore',
  'admin priority',
  'adminpriority',
  'internal notes',
  'internalnotes',
];

async function expectSafeResponse(response: { clone(): { text(): Promise<string> } }) {
  const text = await response.clone().text();
  const lower = text.toLowerCase();

  for (const fragment of forbiddenResponseFragments) {
    expect(lower).not.toContain(fragment);
  }
}

describe('advanced review payload Netlify Function contract fixtures', () => {
  it('keeps the helper and fixtures testable while the disabled wrapper exists separately', () => {
    expect(existsSync(join(process.cwd(), 'netlify/functions/kitchen-advanced-review-payload.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'src/lib/advancedReviewPayloadFunction.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/helpers/advancedReviewPayloadFunctionContractHelper.ts'))).toBe(true);
    expect(existsSync(join(process.cwd(), 'test/fixtures/advancedReviewPayloadFunctionFixtures.ts'))).toBe(true);
  });

  it('returns a safe stored response for a valid POST fixture', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ knownLeadIds: [advancedReviewPayloadFixtureLeadId] });
    const response = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: validAdvancedReviewPayloadRequestBody }),
      harness,
    );
    const json = await readAdvancedReviewPayloadContractJson(response);

    expect(response.status).toBe(202);
    expect(json).toEqual({
      ok: true,
      stored: true,
      recordId: 'mock-1',
      diagnostic: 'advanced_review_payload_stored',
    });
    expect(harness.getStoredDrafts()).toHaveLength(1);
    expect(harness.getStoredDrafts()[0]).toMatchObject({
      lead_id: advancedReviewPayloadFixtureLeadId,
      source: 'scopeBuilder',
      internal_review_status: 'not_started',
    });
    await expectSafeResponse(response);
  });

  it('rejects non-POST methods without calling storage', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ knownLeadIds: [advancedReviewPayloadFixtureLeadId] });
    const response = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({
        method: 'GET',
        body: validAdvancedReviewPayloadRequestBody,
      }),
      harness,
    );
    const json = await readAdvancedReviewPayloadContractJson(response);

    expect(response.status).toBe(405);
    expect(json).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_method_not_allowed',
    });
    expect(harness.getStoredDrafts()).toEqual([]);
    expect(harness.getDiagnostics()).toEqual([]);
    await expectSafeResponse(response);
  });

  it('rejects missing JSON content type and invalid JSON without storage', async () => {
    const harness = createAdvancedReviewStorageMockHarness();
    const missingJsonResponse = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({
        body: validAdvancedReviewPayloadRequestBody,
        contentType: 'text/plain',
      }),
      harness,
    );
    const invalidJsonResponse = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({
        body: '{',
      }),
      harness,
    );

    expect(missingJsonResponse.status).toBe(400);
    expect(invalidJsonResponse.status).toBe(400);
    expect(await readAdvancedReviewPayloadContractJson(missingJsonResponse)).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(await readAdvancedReviewPayloadContractJson(invalidJsonResponse)).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(harness.getStoredDrafts()).toEqual([]);
    expect(harness.getDiagnostics()).toEqual([]);
  });

  it('rejects missing payload, raw scope-builder state and unsupported internal fields', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ knownLeadIds: [advancedReviewPayloadFixtureLeadId] });
    const missingPayloadResponse = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: { requestId: 'missing-payload' } }),
      harness,
    );
    const rawStateResponse = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: rawScopeBuilderStateRequestBody }),
      harness,
    );
    const unsafeResponse = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: unsafeAdvancedReviewPayloadRequestBody }),
      harness,
    );

    expect(missingPayloadResponse.status).toBe(400);
    expect(rawStateResponse.status).toBe(400);
    expect(unsafeResponse.status).toBe(400);
    expect(await readAdvancedReviewPayloadContractJson(rawStateResponse)).toMatchObject({
      diagnostic: 'advanced_review_payload_invalid',
      stored: false,
    });
    expect(await readAdvancedReviewPayloadContractJson(unsafeResponse)).toMatchObject({
      diagnostic: 'advanced_review_payload_invalid',
      stored: false,
    });
    expect(harness.getStoredDrafts()).toEqual([]);
    await expectSafeResponse(unsafeResponse);
  });

  it('maps storage failure modes to safe HTTP responses without faking success', async () => {
    const envMissing = createAdvancedReviewStorageMockHarness({ mode: 'envMissing' });
    const leadNotFound = createAdvancedReviewStorageMockHarness({ knownLeadIds: ['different-lead'] });
    const insertFailed = createAdvancedReviewStorageMockHarness({ mode: 'insertFailed' });

    const envMissingResponse = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: validAdvancedReviewPayloadRequestBody }),
      envMissing,
    );
    const leadNotFoundResponse = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: validAdvancedReviewPayloadRequestBody }),
      leadNotFound,
    );
    const insertFailedResponse = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: validAdvancedReviewPayloadRequestBody }),
      insertFailed,
    );

    expect(envMissingResponse.status).toBe(503);
    expect(leadNotFoundResponse.status).toBe(409);
    expect(insertFailedResponse.status).toBe(503);

    await expect(readAdvancedReviewPayloadContractJson(envMissingResponse)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_env_missing',
    });
    await expect(readAdvancedReviewPayloadContractJson(leadNotFoundResponse)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_lead_not_found',
    });
    await expect(readAdvancedReviewPayloadContractJson(insertFailedResponse)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_insert_failed',
    });

    await expectSafeResponse(envMissingResponse);
    await expectSafeResponse(leadNotFoundResponse);
    await expectSafeResponse(insertFailedResponse);
  });

  it('rejects oversized fixtures before storage success', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ knownLeadIds: [advancedReviewPayloadFixtureLeadId] });
    const response = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: oversizedAdvancedReviewPayloadRequestBody }),
      harness,
    );

    expect(response.status).toBe(400);
    await expect(readAdvancedReviewPayloadContractJson(response)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(harness.getStoredDrafts()).toEqual([]);
  });

  it('keeps contract helper and fixtures free of production Netlify or Supabase dependencies', () => {
    const runtimeHelper = readFileSync(join(process.cwd(), 'src/lib/advancedReviewPayloadFunction.ts'), 'utf8');
    const helper = readFileSync(join(process.cwd(), 'test/helpers/advancedReviewPayloadFunctionContractHelper.ts'), 'utf8');
    const fixtures = readFileSync(join(process.cwd(), 'test/fixtures/advancedReviewPayloadFunctionFixtures.ts'), 'utf8');

    for (const source of [runtimeHelper, helper, fixtures]) {
      expect(source).not.toContain('@supabase/supabase-js');
      expect(source).not.toContain('createClient');
      expect(source).not.toContain('process.env');
      expect(source).not.toContain('Netlify.env');
      expect(source).not.toContain('netlify/functions/kitchen-advanced-review-payload.ts');
    }
  });
});
