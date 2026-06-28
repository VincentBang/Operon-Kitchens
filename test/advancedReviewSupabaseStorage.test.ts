import { readFileSync } from 'fs';
import { join } from 'path';
import {
  advancedReviewPayloadFixture,
  advancedReviewPayloadFixtureLeadId,
  advancedReviewPayloadFixtureRequestId,
  unsafeAdvancedReviewPayloadRequestBody,
} from './fixtures/advancedReviewPayloadFunctionFixtures';
import {
  createAdvancedReviewStorageRecordDraft,
} from '../src/lib/advancedReviewStorage';
import {
  createAdvancedReviewSupabaseStorageAdapter,
  getAdvancedReviewSupabaseStorageEnv,
} from '../src/lib/advancedReviewSupabaseStorage';

const testEnv = {
  supabaseUrl: 'https://kitchens.supabase.co/',
  serviceRoleKey: 'service-role-test-key',
};

const forbiddenResponseFragments = [
  'service-role-test-key',
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

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return body;
    },
  } as Response;
}

function expectSafeResult(result: unknown) {
  const lower = JSON.stringify(result).toLowerCase();

  for (const fragment of forbiddenResponseFragments) {
    expect(lower).not.toContain(fragment.toLowerCase());
  }
}

function getFetchMock() {
  return global.fetch as jest.MockedFunction<typeof fetch>;
}

describe('advanced review real Supabase storage adapter', () => {
  const originalFetch = global.fetch;
  const originalSupabaseUrl = process.env.OPERON_KITCHENS_SUPABASE_URL;
  const originalServiceRoleKey = process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;

  beforeEach(() => {
    global.fetch = jest.fn();
    delete process.env.OPERON_KITCHENS_SUPABASE_URL;
    delete process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalSupabaseUrl === undefined) {
      delete process.env.OPERON_KITCHENS_SUPABASE_URL;
    } else {
      process.env.OPERON_KITCHENS_SUPABASE_URL = originalSupabaseUrl;
    }
    if (originalServiceRoleKey === undefined) {
      delete process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;
    } else {
      process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY = originalServiceRoleKey;
    }
  });

  it('reads server-only Supabase env values without NEXT_PUBLIC fallbacks', () => {
    process.env.OPERON_KITCHENS_SUPABASE_URL = ' https://kitchens.supabase.co/ ';
    process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY = ' service-role-test-key ';
    process.env.NEXT_PUBLIC_OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY = 'must-not-be-used';

    expect(getAdvancedReviewSupabaseStorageEnv()).toEqual({
      supabaseUrl: 'https://kitchens.supabase.co/',
      serviceRoleKey: 'service-role-test-key',
    });
  });

  it('returns missing-env safely before any fetch call', async () => {
    const adapter = createAdvancedReviewSupabaseStorageAdapter({});
    const result = await adapter.savePayload({
      payload: advancedReviewPayloadFixture,
      requestId: advancedReviewPayloadFixtureRequestId,
    });

    expect(result).toEqual({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_env_missing',
      message: 'Advanced review storage is not configured.',
    });
    expect(getFetchMock()).not.toHaveBeenCalled();
    expectSafeResult(result);
  });

  it('rejects unsupported internal fields before any fetch call', async () => {
    const adapter = createAdvancedReviewSupabaseStorageAdapter(testEnv);
    const result = await adapter.savePayload({
      payload: unsafeAdvancedReviewPayloadRequestBody.payload as any,
      requestId: advancedReviewPayloadFixtureRequestId,
    });

    expect(result).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(getFetchMock()).not.toHaveBeenCalled();
    expectSafeResult(result);
  });

  it('checks the linked kitchen_request_reviews lead before insert', async () => {
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse([{ id: 'advanced-payload-row-1' }], 201));

    const adapter = createAdvancedReviewSupabaseStorageAdapter(testEnv);
    const result = await adapter.savePayload({
      payload: advancedReviewPayloadFixture,
      requestId: advancedReviewPayloadFixtureRequestId,
    });

    expect(result).toMatchObject({
      ok: true,
      stored: true,
      recordId: 'advanced-payload-row-1',
      diagnostic: 'advanced_review_payload_stored',
    });
    expect(getFetchMock()).toHaveBeenCalledTimes(2);
    expect(getFetchMock().mock.calls[0][0]).toBe(
      'https://kitchens.supabase.co/rest/v1/kitchen_request_reviews?id=eq.0993f583-2d91-4d4c-bf3f-afd71d4ebb30&select=id&limit=1',
    );
    expect(getFetchMock().mock.calls[1][0]).toBe(
      'https://kitchens.supabase.co/rest/v1/kitchen_advanced_review_payloads',
    );
    expectSafeResult(result);
  });

  it('maps missing linked leads to lead-not-found without insert', async () => {
    getFetchMock().mockResolvedValueOnce(jsonResponse([]));

    const adapter = createAdvancedReviewSupabaseStorageAdapter(testEnv);
    const result = await adapter.savePayload({
      payload: advancedReviewPayloadFixture,
      requestId: advancedReviewPayloadFixtureRequestId,
    });

    expect(result).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_lead_not_found',
    });
    expect(getFetchMock()).toHaveBeenCalledTimes(1);
    expectSafeResult(result);
  });

  it('maps lead lookup fetch failures to lead-not-found', async () => {
    getFetchMock().mockResolvedValueOnce(jsonResponse({ message: 'not found' }, 404));

    const adapter = createAdvancedReviewSupabaseStorageAdapter(testEnv);
    const result = await adapter.savePayload({
      payload: advancedReviewPayloadFixture,
      requestId: advancedReviewPayloadFixtureRequestId,
    });

    expect(result).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_lead_not_found',
    });
    expect(getFetchMock()).toHaveBeenCalledTimes(1);
    expectSafeResult(result);
  });

  it('maps insert failures to safe insert-failed diagnostics', async () => {
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse({ message: 'insert failed' }, 500));

    const adapter = createAdvancedReviewSupabaseStorageAdapter(testEnv);
    const result = await adapter.savePayload({
      payload: advancedReviewPayloadFixture,
      requestId: advancedReviewPayloadFixtureRequestId,
    });

    expect(result).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_insert_failed',
    });
    expect(getFetchMock()).toHaveBeenCalledTimes(2);
    expectSafeResult(result);
  });

  it('sends the storage record draft plus request id using service-role headers', async () => {
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse([{ id: 'advanced-payload-row-2' }], 201));

    const adapter = createAdvancedReviewSupabaseStorageAdapter(testEnv);
    const result = await adapter.savePayload({
      payload: advancedReviewPayloadFixture,
      requestId: `  ${advancedReviewPayloadFixtureRequestId}  `,
    });

    expect(result).toMatchObject({
      ok: true,
      stored: true,
      recordId: 'advanced-payload-row-2',
    });

    const insertOptions = getFetchMock().mock.calls[1][1] as RequestInit;
    expect(insertOptions.method).toBe('POST');
    expect(insertOptions.headers).toMatchObject({
      apikey: 'service-role-test-key',
      Authorization: 'Bearer service-role-test-key',
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    });
    expect(JSON.parse(insertOptions.body as string)).toEqual({
      ...createAdvancedReviewStorageRecordDraft(advancedReviewPayloadFixture),
      storage_request_id: advancedReviewPayloadFixtureRequestId,
    });
    expectSafeResult(result);
  });

  it('keeps the adapter server-only and active only through the Netlify wrapper', () => {
    const adapterSource = readFileSync(
      join(process.cwd(), 'src/lib/advancedReviewSupabaseStorage.ts'),
      'utf8',
    );
    const wrapperSource = readFileSync(
      join(process.cwd(), 'netlify/functions/kitchen-advanced-review-payload.ts'),
      'utf8',
    );

    expect(adapterSource).not.toContain('@supabase/supabase-js');
    expect(adapterSource).not.toContain('createClient');
    expect(adapterSource).not.toContain('NEXT_PUBLIC_OPERON_KITCHENS_SUPABASE');
    expect(adapterSource).not.toContain('console.log');
    expect(adapterSource).not.toContain('console.warn');
    expect(wrapperSource).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(wrapperSource).toContain('Netlify.env.get');
    expect(wrapperSource).not.toContain('disabledAdvancedReviewStorageAdapter');
    expect(wrapperSource).not.toContain('process.env');
  });
});
