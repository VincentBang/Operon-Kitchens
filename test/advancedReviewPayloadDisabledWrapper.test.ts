import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import handler from '../netlify/functions/kitchen-advanced-review-payload';
import {
  advancedReviewPayloadFunctionPath,
  advancedReviewPayloadTableName,
} from '../src/lib/advancedReviewStorage';
import {
  advancedReviewPayloadFixtureLeadId,
  advancedReviewPayloadFixtureRequestId,
  unsafeAdvancedReviewPayloadRequestBody,
  validAdvancedReviewPayloadRequestBody,
} from './fixtures/advancedReviewPayloadFunctionFixtures';

const wrapperPath = 'netlify/functions/kitchen-advanced-review-payload.ts';

const testEnv = {
  OPERON_KITCHENS_SUPABASE_URL: 'https://kitchens.supabase.co/',
  OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY: 'active-wrapper-real-file-service-key',
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

const originalResponse = globalThis.Response;
const originalFetch = global.fetch;
const originalNetlify = (globalThis as unknown as { Netlify?: unknown }).Netlify;

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

function installMockNetlifyEnv(env: Record<string, string | undefined>) {
  const get = jest.fn((key: string) => env[key]);
  (globalThis as unknown as { Netlify: { env: { get: jest.Mock } } }).Netlify = {
    env: { get },
  };
  return get;
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

async function expectJsonHeaders(response: Response) {
  expect(response.headers.get('Content-Type')).toContain('application/json');
  expect(response.headers.get('Cache-Control')).toBe('no-store');
}

async function expectSafeResponse(response: { clone(): { text(): Promise<string> } }) {
  const lower = (await response.clone().text()).toLowerCase();

  for (const fragment of forbiddenResponseFragments) {
    expect(lower).not.toContain(fragment.toLowerCase());
  }
}

describe('active advanced review payload Netlify wrapper', () => {
  it('uses a modern default-export wrapper with server-only Netlify env access', () => {
    const source = readFileSync(join(process.cwd(), wrapperPath), 'utf8');

    expect(existsSync(join(process.cwd(), wrapperPath))).toBe(true);
    expect(source).toContain('export default async function handler');
    expect(source).toContain('handleAdvancedReviewPayloadFunctionRequest');
    expect(source).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(source).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_URL')");
    expect(source).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY')");
    expect(source).not.toContain('disabledAdvancedReviewStorageAdapter');
    expect(source).not.toContain('validateAdvancedReviewPayloadForStorage');
    expect(source).not.toContain('exports.handler');
    expect(source).not.toContain('@supabase/supabase-js');
    expect(source).not.toContain('createClient');
    expect(source).not.toContain('process.env');
  });

  it('stores a valid payload through mocked Supabase only', async () => {
    const envGet = installMockNetlifyEnv(testEnv);
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse([{ id: 'real-wrapper-row-1' }], 201));

    const response = await handler(createRequest({ body: validAdvancedReviewPayloadRequestBody }));
    const json = await response.json();

    expect(response.status).toBe(202);
    expect(json).toEqual({
      ok: true,
      stored: true,
      diagnostic: 'advanced_review_payload_stored',
      recordId: 'real-wrapper-row-1',
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
    await expectJsonHeaders(response);
    await expectSafeResponse(response);
  });

  it('returns safe storage unavailable when Netlify env is missing', async () => {
    const envGet = installMockNetlifyEnv({});

    const response = await handler(createRequest({ body: validAdvancedReviewPayloadRequestBody }));
    const json = await response.json();

    expect(response.status).toBe(503);
    expect(json).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_env_missing',
    });
    expect(envGet).toHaveBeenCalledWith('OPERON_KITCHENS_SUPABASE_URL');
    expect(envGet).toHaveBeenCalledWith('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY');
    expect(getFetchMock()).not.toHaveBeenCalled();
    await expectJsonHeaders(response);
    await expectSafeResponse(response);
  });

  it('maps missing linked leads and insert failures without faking success', async () => {
    installMockNetlifyEnv(testEnv);
    getFetchMock().mockResolvedValueOnce(jsonResponse([]));

    const missingLeadResponse = await handler(createRequest({ body: validAdvancedReviewPayloadRequestBody }));
    expect(missingLeadResponse.status).toBe(409);
    expect(await missingLeadResponse.json()).toMatchObject({
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

    const insertFailedResponse = await handler(createRequest({ body: validAdvancedReviewPayloadRequestBody }));
    expect(insertFailedResponse.status).toBe(503);
    expect(await insertFailedResponse.json()).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_insert_failed',
    });
    expect(getFetchMock()).toHaveBeenCalledTimes(2);
    await expectSafeResponse(insertFailedResponse);
  });

  it('keeps method, JSON and unsafe-field rejection delegated before Supabase calls', async () => {
    installMockNetlifyEnv(testEnv);

    const getResponse = await handler(createRequest({
      method: 'GET',
      body: validAdvancedReviewPayloadRequestBody,
    }));
    const textResponse = await handler(createRequest({
      body: validAdvancedReviewPayloadRequestBody,
      contentType: 'text/plain',
    }));
    const unsafeResponse = await handler(createRequest({ body: unsafeAdvancedReviewPayloadRequestBody }));

    expect(getResponse.status).toBe(405);
    expect(await getResponse.json()).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_method_not_allowed',
    });
    expect(textResponse.status).toBe(400);
    expect(await textResponse.json()).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(unsafeResponse.status).toBe(400);
    expect(await unsafeResponse.json()).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(getFetchMock()).not.toHaveBeenCalled();
    await expectSafeResponse(unsafeResponse);
  });

  it('passes a bounded request id to the insert after lead lookup', async () => {
    installMockNetlifyEnv(testEnv);
    getFetchMock()
      .mockResolvedValueOnce(jsonResponse([{ id: advancedReviewPayloadFixtureLeadId }]))
      .mockResolvedValueOnce(jsonResponse([{ id: 'real-wrapper-row-2' }], 201));

    const response = await handler(createRequest({
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
