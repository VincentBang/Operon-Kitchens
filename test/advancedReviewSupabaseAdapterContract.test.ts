import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  advancedReviewPayloadFixtureLeadId,
  unsafeAdvancedReviewPayloadRequestBody,
  validAdvancedReviewPayloadRequestBody,
} from './fixtures/advancedReviewPayloadFunctionFixtures';
import {
  createAdvancedReviewPayloadContractRequest,
  handleAdvancedReviewPayloadContractRequest,
  readAdvancedReviewPayloadContractJson,
} from './helpers/advancedReviewPayloadFunctionContractHelper';
import { createAdvancedReviewSupabaseAdapterContractHarness } from './helpers/advancedReviewSupabaseAdapterContractHarness';

const forbiddenResponseFragments = [
  'service_role',
  'service role',
  'supplier cost',
  'suppliercost',
  'internal rate',
  'internalrate',
  'margin',
  'markup',
  'lead score',
  'leadscore',
  'admin priority',
  'adminpriority',
  'internal notes',
  'internalnotes',
  'serviceRoleKey',
];

async function expectSafeResponse(response: { clone(): { text(): Promise<string> } }) {
  const lower = (await response.clone().text()).toLowerCase();

  for (const fragment of forbiddenResponseFragments) {
    expect(lower).not.toContain(fragment.toLowerCase());
  }
}

describe('advanced review real Supabase adapter contract tests', () => {
  it('keeps the real adapter server-only and called only by the Netlify wrapper', () => {
    const harnessSource = readFileSync(
      join(process.cwd(), 'test/helpers/advancedReviewSupabaseAdapterContractHarness.ts'),
      'utf8',
    );
    const adapterSource = readFileSync(
      join(process.cwd(), 'src/lib/advancedReviewSupabaseStorage.ts'),
      'utf8',
    );
    const wrapperSource = readFileSync(
      join(process.cwd(), 'netlify/functions/kitchen-advanced-review-payload.ts'),
      'utf8',
    );

    expect(existsSync(join(process.cwd(), 'src/lib/advancedReviewSupabaseStorage.ts'))).toBe(true);
    expect(harnessSource).toContain('createAdvancedReviewSupabaseAdapterContractHarness');
    expect(harnessSource).toContain('MockSupabaseResponse');
    expect(harnessSource).not.toContain('@supabase/supabase-js');
    expect(harnessSource).not.toContain('createClient');
    expect(harnessSource).not.toContain('process.env');
    expect(harnessSource).not.toContain('fetch(');
    expect(adapterSource).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(adapterSource).not.toContain('@supabase/supabase-js');
    expect(wrapperSource).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(wrapperSource).toContain('Netlify.env.get');
    expect(wrapperSource).not.toContain('disabledAdvancedReviewStorageAdapter');
    expect(wrapperSource).not.toContain('process.env');
  });

  it('maps missing storage configuration to safe 503 without lookup or insert calls', async () => {
    const harness = createAdvancedReviewSupabaseAdapterContractHarness({
      storageConfigured: false,
    });
    const response = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: validAdvancedReviewPayloadRequestBody }),
      harness,
    );

    expect(response.status).toBe(503);
    await expect(readAdvancedReviewPayloadContractJson(response)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_env_missing',
    });
    expect(harness.getLeadLookups()).toEqual([]);
    expect(harness.getInsertDrafts()).toEqual([]);
    await expectSafeResponse(response);
  });

  it('rejects unsupported internal fields before any mocked Supabase call', async () => {
    const harness = createAdvancedReviewSupabaseAdapterContractHarness();
    const response = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: unsafeAdvancedReviewPayloadRequestBody }),
      harness,
    );

    expect(response.status).toBe(400);
    await expect(readAdvancedReviewPayloadContractJson(response)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(harness.getLeadLookups()).toEqual([]);
    expect(harness.getInsertDrafts()).toEqual([]);
    await expectSafeResponse(response);
  });

  it('maps a missing linked request-review lead to safe 409 without insert', async () => {
    const harness = createAdvancedReviewSupabaseAdapterContractHarness({
      leadLookupResponse: { data: null, error: null },
    });
    const response = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: validAdvancedReviewPayloadRequestBody }),
      harness,
    );

    expect(response.status).toBe(409);
    await expect(readAdvancedReviewPayloadContractJson(response)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_lead_not_found',
    });
    expect(harness.getLeadLookups()).toEqual([advancedReviewPayloadFixtureLeadId]);
    expect(harness.getInsertDrafts()).toEqual([]);
    await expectSafeResponse(response);
  });

  it('maps mocked insert failure to safe 503 after creating the record draft', async () => {
    const harness = createAdvancedReviewSupabaseAdapterContractHarness({
      insertResponse: {
        data: null,
        error: { message: 'insert failed in mocked response' },
      },
    });
    const response = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: validAdvancedReviewPayloadRequestBody }),
      harness,
    );

    expect(response.status).toBe(503);
    await expect(readAdvancedReviewPayloadContractJson(response)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_insert_failed',
    });
    expect(harness.getLeadLookups()).toEqual([advancedReviewPayloadFixtureLeadId]);
    expect(harness.getInsertDrafts()).toHaveLength(1);
    expect(harness.getInsertDrafts()[0]).toMatchObject({
      lead_id: advancedReviewPayloadFixtureLeadId,
      source: 'scopeBuilder',
      internal_review_status: 'not_started',
    });
    await expectSafeResponse(response);
  });

  it('returns stored true only after mocked lead lookup and insert success', async () => {
    const harness = createAdvancedReviewSupabaseAdapterContractHarness({
      insertResponse: {
        data: { id: 'mock-payload-row-123' },
        error: null,
      },
    });
    const response = await handleAdvancedReviewPayloadContractRequest(
      createAdvancedReviewPayloadContractRequest({ body: validAdvancedReviewPayloadRequestBody }),
      harness,
    );

    expect(response.status).toBe(202);
    await expect(readAdvancedReviewPayloadContractJson(response)).resolves.toEqual({
      ok: true,
      stored: true,
      recordId: 'mock-payload-row-123',
      diagnostic: 'advanced_review_payload_stored',
    });
    expect(harness.getDiagnostics()).toEqual(['advanced_review_payload_stored']);
    expect(harness.getLeadLookups()).toEqual([advancedReviewPayloadFixtureLeadId]);
    expect(harness.getInsertDrafts()).toHaveLength(1);
    expect(harness.getInsertDrafts()[0].customer_safe_payload).toEqual(
      validAdvancedReviewPayloadRequestBody.payload,
    );
    await expectSafeResponse(response);
  });
});
