import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  AdvancedReviewPayloadFunctionResponse,
  handleAdvancedReviewPayloadFunctionRequest,
} from '../src/lib/advancedReviewPayloadFunction';
import { advancedReviewPayloadFunctionPath, advancedReviewPayloadTableName } from '../src/lib/advancedReviewStorage';
import { createAdvancedReviewSupabaseStorageAdapter } from '../src/lib/advancedReviewSupabaseStorage';
import {
  advancedReviewPayloadFixtureLeadId,
  advancedReviewPayloadFixtureRequestId,
  unsafeAdvancedReviewPayloadRequestBody,
  validAdvancedReviewPayloadRequestBody,
} from './fixtures/advancedReviewPayloadFunctionFixtures';

const activeWrapperPath = 'netlify/functions/kitchen-advanced-review-payload.ts';
const patchPlanPath = 'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md';

const testEnv = {
  OPERON_KITCHENS_SUPABASE_URL: 'https://kitchens.supabase.co/',
  OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY: 'active-wrapper-contract-service-key',
};

const forbiddenResponseFragments = [
  testEnv.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY,
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
  'raw customer document',
];

class TestHeaders {
  private readonly values: Record<string, string>;

  constructor(headers: Record<string, string>) {
    this.values = Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
    );
  }

  get(name: string) {
    return this.values[name.toLowerCase()] ?? null;
  }
}

class TestResponse {
  readonly status: number;
  readonly headers: TestHeaders;

  constructor(
    private readonly bodyText: string,
    init: { status: number; headers: Record<string, string> },
  ) {
    this.status = init.status;
    this.headers = new TestHeaders(init.headers);
  }

  async text() {
    return this.bodyText;
  }

  async json() {
    return JSON.parse(this.bodyText);
  }

  clone() {
    return new TestResponse(this.bodyText, {
      status: this.status,
      headers: {
        'Content-Type': this.headers.get('Content-Type') ?? '',
        'Cache-Control': this.headers.get('Cache-Control') ?? '',
      },
    });
  }
}

function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return body;
    },
  } as Response;
}

function createRequest(options: {
  method?: string;
  body?: unknown;
  contentType?: string;
} = {}) {
  const method = options.method ?? 'POST';
  const body = method === 'GET' || method === 'HEAD'
    ? undefined
    : options.body === undefined
      ? undefined
      : JSON.stringify(options.body);

  return {
    method,
    url: `https://operon-kitchens.test${advancedReviewPayloadFunctionPath}`,
    headers: {
      get(name: string) {
        return name.toLowerCase() === 'content-type'
          ? options.contentType ?? 'application/json'
          : null;
      },
    },
    async json() {
      if (body === undefined) return undefined;
      return JSON.parse(body);
    },
  } as unknown as Request;
}

function installMockNetlifyEnv(env: Record<string, string | undefined>) {
  const get = jest.fn((key: string) => env[key]);
  (globalThis as unknown as { Netlify: { env: { get: jest.Mock } } }).Netlify = {
    env: { get },
  };
  return get;
}

async function toPlannedActiveNetlifyResponse(response: AdvancedReviewPayloadFunctionResponse) {
  return new Response(await response.text(), {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

async function plannedActiveWrapperHandler(request: Request) {
  const netlifyEnv = (globalThis as unknown as { Netlify: { env: { get(key: string): string | undefined } } }).Netlify.env;
  const response = await handleAdvancedReviewPayloadFunctionRequest(
    request,
    createAdvancedReviewSupabaseStorageAdapter({
      supabaseUrl: netlifyEnv.get('OPERON_KITCHENS_SUPABASE_URL'),
      serviceRoleKey: netlifyEnv.get('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY'),
    }),
  );

  return toPlannedActiveNetlifyResponse(response);
}

function getFetchMock() {
  return global.fetch as jest.MockedFunction<typeof fetch>;
}

async function expectJsonResponse(response: Response) {
  expect(response.headers.get('Content-Type')).toContain('application/json');
  expect(response.headers.get('Cache-Control')).toBe('no-store');
  return response.json();
}

async function expectSafeResponse(response: Response) {
  const lower = (await response.clone().text()).toLowerCase();

  for (const fragment of forbiddenResponseFragments) {
    expect(lower).not.toContain(fragment.toLowerCase());
  }
}

describe('planned active advanced review payload Netlify wrapper contract', () => {
  const originalFetch = global.fetch;
  const originalNetlify = (globalThis as unknown as { Netlify?: unknown }).Netlify;
  const originalResponse = globalThis.Response;

  beforeAll(() => {
    if (!globalThis.Response) {
      (globalThis as unknown as { Response: typeof Response }).Response = TestResponse as unknown as typeof Response;
    }
  });

  afterAll(() => {
    if (!originalResponse) {
      delete (globalThis as unknown as { Response?: typeof Response }).Response;
    }
  });

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalNetlify === undefined) {
      delete (globalThis as unknown as { Netlify?: unknown }).Netlify;
    } else {
      (globalThis as unknown as { Netlify?: unknown }).Netlify = originalNetlify;
    }
  });

  it('documents the active-wrapper contract and confirms the real wrapper is active locally', () => {
    const patchPlan = readFileSync(join(process.cwd(), patchPlanPath), 'utf8');
    const activeWrapper = readFileSync(join(process.cwd(), activeWrapperPath), 'utf8');

    expect(patchPlan).toContain('Intended Wrapper Diff Shape');
    expect(patchPlan).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(patchPlan).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_URL')");
    expect(patchPlan).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY')");
    expect(patchPlan).toContain('The future patch should keep the default `/.netlify/functions/kitchen-advanced-review-payload` route');

    expect(activeWrapper).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(activeWrapper).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_URL')");
    expect(activeWrapper).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY')");
    expect(activeWrapper).not.toContain('disabledAdvancedReviewStorageAdapter');
    expect(activeWrapper).not.toContain('process.env');
  });

  it('uses Netlify.env, returns no-store JSON, and stores a valid payload with mocked Supabase only', async () => {
    const envGet = installMockNetlifyEnv(testEnv);
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse([{ id: 'active-wrapper-row-1' }], 201));

    const response = await plannedActiveWrapperHandler(createRequest({ body: validAdvancedReviewPayloadRequestBody }));
    const json = await expectJsonResponse(response);

    expect(response.status).toBe(202);
    expect(json).toEqual({
      ok: true,
      stored: true,
      diagnostic: 'advanced_review_payload_stored',
      recordId: 'active-wrapper-row-1',
    });
    expect(envGet).toHaveBeenCalledWith('OPERON_KITCHENS_SUPABASE_URL');
    expect(envGet).toHaveBeenCalledWith('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY');
    expect(getFetchMock()).toHaveBeenCalledTimes(2);
    expect(getFetchMock().mock.calls[0][0]).toBe(
      'https://kitchens.supabase.co/rest/v1/kitchen_request_reviews?id=eq.0993f583-2d91-4d4c-bf3f-afd71d4ebb30&select=id&limit=1',
    );
    expect(getFetchMock().mock.calls[1][0]).toBe(
      `https://kitchens.supabase.co/rest/v1/${advancedReviewPayloadTableName}`,
    );
    await expectSafeResponse(response);
  });

  it('maps missing Netlify env to a safe 503 without calling Supabase', async () => {
    const envGet = installMockNetlifyEnv({});

    const response = await plannedActiveWrapperHandler(createRequest({ body: validAdvancedReviewPayloadRequestBody }));
    const json = await expectJsonResponse(response);

    expect(response.status).toBe(503);
    expect(json).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_env_missing',
    });
    expect(envGet).toHaveBeenCalledWith('OPERON_KITCHENS_SUPABASE_URL');
    expect(envGet).toHaveBeenCalledWith('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY');
    expect(getFetchMock()).not.toHaveBeenCalled();
    await expectSafeResponse(response);
  });

  it('preserves method, content-type and unsafe-field rejection before Supabase calls', async () => {
    installMockNetlifyEnv(testEnv);

    const getResponse = await plannedActiveWrapperHandler(createRequest({ method: 'GET' }));
    const textResponse = await plannedActiveWrapperHandler(createRequest({
      body: validAdvancedReviewPayloadRequestBody,
      contentType: 'text/plain',
    }));
    const unsafeResponse = await plannedActiveWrapperHandler(createRequest({ body: unsafeAdvancedReviewPayloadRequestBody }));

    expect(getResponse.status).toBe(405);
    expect(await expectJsonResponse(getResponse)).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_method_not_allowed',
    });
    expect(textResponse.status).toBe(400);
    expect(await expectJsonResponse(textResponse)).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(unsafeResponse.status).toBe(400);
    expect(await expectJsonResponse(unsafeResponse)).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(getFetchMock()).not.toHaveBeenCalled();
    await expectSafeResponse(unsafeResponse);
  });

  it('maps linked-lead and insert failures without faking success', async () => {
    installMockNetlifyEnv(testEnv);
    getFetchMock().mockResolvedValueOnce(jsonResponse([]));

    const missingLeadResponse = await plannedActiveWrapperHandler(createRequest({ body: validAdvancedReviewPayloadRequestBody }));
    expect(missingLeadResponse.status).toBe(409);
    expect(await expectJsonResponse(missingLeadResponse)).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_lead_not_found',
    });
    expect(getFetchMock()).toHaveBeenCalledTimes(1);
    await expectSafeResponse(missingLeadResponse);

    getFetchMock().mockReset();
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse({ message: 'insert failed' }, 500));

    const insertFailureResponse = await plannedActiveWrapperHandler(createRequest({ body: validAdvancedReviewPayloadRequestBody }));
    expect(insertFailureResponse.status).toBe(503);
    expect(await expectJsonResponse(insertFailureResponse)).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_insert_failed',
    });
    expect(getFetchMock()).toHaveBeenCalledTimes(2);
    await expectSafeResponse(insertFailureResponse);
  });

  it('passes a bounded storage_request_id to the active insert after lead lookup', async () => {
    installMockNetlifyEnv(testEnv);
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse([{ id: 'active-wrapper-row-2' }], 201));

    const response = await plannedActiveWrapperHandler(createRequest({
      body: {
        ...validAdvancedReviewPayloadRequestBody,
        requestId: `  ${advancedReviewPayloadFixtureRequestId}  `,
      },
    }));

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
