import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  handleAdvancedReviewPayloadFunctionRequest,
  readAdvancedReviewPayloadFunctionJson,
} from '../src/lib/advancedReviewPayloadFunction';
import { advancedReviewPayloadTableName } from '../src/lib/advancedReviewStorage';
import { createAdvancedReviewSupabaseStorageAdapter } from '../src/lib/advancedReviewSupabaseStorage';
import {
  advancedReviewPayloadFixtureLeadId,
  advancedReviewPayloadFixtureRequestId,
  unsafeAdvancedReviewPayloadRequestBody,
  validAdvancedReviewPayloadRequestBody,
} from './fixtures/advancedReviewPayloadFunctionFixtures';
import { createAdvancedReviewPayloadContractRequest } from './helpers/advancedReviewPayloadFunctionContractHelper';

const planPath = 'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-plan.md';
const activeWrapperPath = 'netlify/functions/kitchen-advanced-review-payload.ts';

const testEnv = {
  supabaseUrl: 'https://kitchens.supabase.co/',
  serviceRoleKey: 'service-role-wrapper-replacement-test-key',
};

const forbiddenResponseFragments = [
  'service-role-wrapper-replacement-test-key',
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

function getFetchMock() {
  return global.fetch as jest.MockedFunction<typeof fetch>;
}

async function expectSafeResponse(response: { clone(): { text(): Promise<string> } }) {
  const lower = (await response.clone().text()).toLowerCase();

  for (const fragment of forbiddenResponseFragments) {
    expect(lower).not.toContain(fragment.toLowerCase());
  }
}

function createFutureReplacementAdapter(env = testEnv) {
  return createAdvancedReviewSupabaseStorageAdapter(env);
}

async function runFutureReplacementRequest(options: {
  method?: string;
  body?: unknown;
  contentType?: string;
  env?: typeof testEnv | {};
} = {}) {
  return handleAdvancedReviewPayloadFunctionRequest(
    createAdvancedReviewPayloadContractRequest({
      method: options.method,
      body: options.body ?? validAdvancedReviewPayloadRequestBody,
      contentType: options.contentType,
    }),
    createFutureReplacementAdapter(options.env ?? testEnv),
  );
}

describe('advanced review payload wrapper replacement contract', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('documents the wrapper replacement and confirms the actual wrapper is active locally', () => {
    const plan = readFileSync(join(process.cwd(), planPath), 'utf8');
    const activeWrapper = readFileSync(join(process.cwd(), activeWrapperPath), 'utf8');

    expect(existsSync(join(process.cwd(), planPath))).toBe(true);
    expect(plan).toContain('Wrapper Replacement Plan');
    expect(plan).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(plan).toContain('Do not replace the disabled wrapper in this slice.');
    expect(plan).toContain('No SQL application, admin UI change, browser submission wiring, deploy, push or production verification is approved.');
    expect(plan).toContain('advanced_review_payload_stored');
    expect(plan).toContain('advanced_review_payload_env_missing');
    expect(activeWrapper).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(activeWrapper).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_URL')");
    expect(activeWrapper).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY')");
    expect(activeWrapper).not.toContain('disabledAdvancedReviewStorageAdapter');
    expect(activeWrapper).not.toContain('process.env');
  });

  it('proves the future replacement path can store through the real adapter with mocked Supabase only', async () => {
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse([{ id: 'advanced-wrapper-row-1' }], 201));

    const response = await runFutureReplacementRequest();
    const json = await readAdvancedReviewPayloadFunctionJson(response);

    expect(response.status).toBe(202);
    expect(json).toEqual({
      ok: true,
      stored: true,
      diagnostic: 'advanced_review_payload_stored',
      recordId: 'advanced-wrapper-row-1',
    });
    expect(getFetchMock()).toHaveBeenCalledTimes(2);
    expect(getFetchMock().mock.calls[0][0]).toBe(
      'https://kitchens.supabase.co/rest/v1/kitchen_request_reviews?id=eq.0993f583-2d91-4d4c-bf3f-afd71d4ebb30&select=id&limit=1',
    );
    expect(getFetchMock().mock.calls[1][0]).toBe(
      `https://kitchens.supabase.co/rest/v1/${advancedReviewPayloadTableName}`,
    );
    await expectSafeResponse(response);
  });

  it('maps missing server env to a safe 503 without calling Supabase', async () => {
    const response = await runFutureReplacementRequest({ env: {} });
    const json = await readAdvancedReviewPayloadFunctionJson(response);

    expect(response.status).toBe(503);
    expect(json).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_env_missing',
    });
    expect(getFetchMock()).not.toHaveBeenCalled();
    await expectSafeResponse(response);
  });

  it('maps missing linked leads to a safe 409 and does not insert', async () => {
    getFetchMock().mockResolvedValueOnce(jsonResponse([]));

    const response = await runFutureReplacementRequest();
    const json = await readAdvancedReviewPayloadFunctionJson(response);

    expect(response.status).toBe(409);
    expect(json).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_lead_not_found',
    });
    expect(getFetchMock()).toHaveBeenCalledTimes(1);
    await expectSafeResponse(response);
  });

  it('maps insert failures to a safe 503 without faking success', async () => {
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse({ message: 'insert failed' }, 500));

    const response = await runFutureReplacementRequest();
    const json = await readAdvancedReviewPayloadFunctionJson(response);

    expect(response.status).toBe(503);
    expect(json).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_insert_failed',
    });
    expect(getFetchMock()).toHaveBeenCalledTimes(2);
    await expectSafeResponse(response);
  });

  it('preserves method, content-type and unsafe-field rejection before any storage call', async () => {
    const getResponse = await runFutureReplacementRequest({ method: 'GET' });
    const textResponse = await runFutureReplacementRequest({ contentType: 'text/plain' });
    const unsafeResponse = await runFutureReplacementRequest({ body: unsafeAdvancedReviewPayloadRequestBody });

    expect(getResponse.status).toBe(405);
    expect(textResponse.status).toBe(400);
    expect(unsafeResponse.status).toBe(400);
    expect(await readAdvancedReviewPayloadFunctionJson(getResponse)).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_method_not_allowed',
    });
    expect(await readAdvancedReviewPayloadFunctionJson(textResponse)).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(await readAdvancedReviewPayloadFunctionJson(unsafeResponse)).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(getFetchMock()).not.toHaveBeenCalled();
    await expectSafeResponse(unsafeResponse);
  });

  it('would pass a bounded storage_request_id to the future adapter insert only after lead lookup', async () => {
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse([{ id: 'advanced-wrapper-row-2' }], 201));

    const response = await runFutureReplacementRequest({
      body: {
        ...validAdvancedReviewPayloadRequestBody,
        requestId: `  ${advancedReviewPayloadFixtureRequestId}  `,
      },
    });

    expect(response.status).toBe(202);
    const insertOptions = getFetchMock().mock.calls[1][1] as RequestInit;
    expect(JSON.parse(insertOptions.body as string)).toMatchObject({
      lead_id: advancedReviewPayloadFixtureLeadId,
      source: 'scopeBuilder',
      internal_review_status: 'not_started',
      storage_request_id: advancedReviewPayloadFixtureRequestId,
    });
    await expectSafeResponse(response);
  });
});
