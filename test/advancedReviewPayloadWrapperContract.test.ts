import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import {
  AdvancedReviewStorageAdapter,
  advancedReviewPayloadFunctionPath,
} from '../src/lib/advancedReviewStorage';
import {
  handleAdvancedReviewPayloadFunctionRequest,
  readAdvancedReviewPayloadFunctionJson,
} from '../src/lib/advancedReviewPayloadFunction';
import {
  advancedReviewPayloadFixtureLeadId,
  unsafeAdvancedReviewPayloadRequestBody,
  validAdvancedReviewPayloadRequestBody,
} from './fixtures/advancedReviewPayloadFunctionFixtures';
import { createAdvancedReviewStorageMockHarness } from './helpers/advancedReviewStorageMockHarness';

const futureWrapperPath = 'netlify/functions/kitchen-advanced-review-payload.ts';
const wrapperPlanPath = 'docs/advanced-kitchen-design-build-tool-phase-5-wrapper-implementation-plan.md';

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

function createWrapperContractRequest(options: {
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
  };
}

async function expectSafeResponse(response: { clone(): { text(): Promise<string> } }) {
  const lower = (await response.clone().text()).toLowerCase();

  for (const fragment of forbiddenResponseFragments) {
    expect(lower).not.toContain(fragment.toLowerCase());
  }
}

describe('advanced review payload Netlify wrapper contract', () => {
  it('keeps the approved wrapper thin, active and server-env mediated', () => {
    const wrapperPlan = readFileSync(join(process.cwd(), wrapperPlanPath), 'utf8');
    const wrapperSource = readFileSync(join(process.cwd(), futureWrapperPath), 'utf8');

    expect(existsSync(join(process.cwd(), futureWrapperPath))).toBe(true);
    expect(wrapperSource).toContain('export default async function handler');
    expect(wrapperSource).toContain('handleAdvancedReviewPayloadFunctionRequest');
    expect(wrapperSource).toContain('createAdvancedReviewSupabaseStorageAdapter');
    expect(wrapperSource).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_URL')");
    expect(wrapperSource).toContain("Netlify.env.get('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY')");
    expect(wrapperSource).not.toContain('disabledAdvancedReviewStorageAdapter');
    expect(wrapperSource).not.toContain('validateAdvancedReviewPayloadForStorage');
    expect(wrapperSource).not.toContain('exports.handler');
    expect(wrapperSource).not.toContain('@supabase/supabase-js');
    expect(wrapperSource).not.toContain('createClient');
    expect(wrapperSource).not.toContain('process.env');
    expect(wrapperPlan).toContain('disabled/no-write wrapper file now exists locally');
    expect(wrapperPlan).toContain('Wrapper Contract Tests');
    expect(wrapperPlan).toContain('modern default export');
    expect(wrapperPlan).toContain('handleAdvancedReviewPayloadFunctionRequest');
    expect(wrapperPlan).toContain('do not use `process.env` inside the function wrapper');
    expect(wrapperPlan).not.toContain('exports.handler =');
  });

  it('proves a future wrapper can pass a Request-compatible object to the helper without extra logic', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ knownLeadIds: [advancedReviewPayloadFixtureLeadId] });
    const response = await handleAdvancedReviewPayloadFunctionRequest(
      createWrapperContractRequest({ body: validAdvancedReviewPayloadRequestBody }),
      harness,
    );
    const json = await readAdvancedReviewPayloadFunctionJson(response);

    expect(response.status).toBe(202);
    expect(json).toEqual({
      ok: true,
      stored: true,
      diagnostic: 'advanced_review_payload_stored',
      recordId: 'mock-1',
    });
    expect(harness.getStoredDrafts()).toHaveLength(1);
    expect(harness.getStoredDrafts()[0]).toMatchObject({
      lead_id: advancedReviewPayloadFixtureLeadId,
      source: 'scopeBuilder',
      internal_review_status: 'not_started',
    });
    await expectSafeResponse(response);
  });

  it('preserves method and JSON validation expected from the future wrapper', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ knownLeadIds: [advancedReviewPayloadFixtureLeadId] });
    const getResponse = await handleAdvancedReviewPayloadFunctionRequest(
      createWrapperContractRequest({
        method: 'GET',
        body: validAdvancedReviewPayloadRequestBody,
      }),
      harness,
    );
    const textResponse = await handleAdvancedReviewPayloadFunctionRequest(
      createWrapperContractRequest({
        body: validAdvancedReviewPayloadRequestBody,
        contentType: 'text/plain',
      }),
      harness,
    );

    expect(getResponse.status).toBe(405);
    expect(textResponse.status).toBe(400);
    await expect(readAdvancedReviewPayloadFunctionJson(getResponse)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_method_not_allowed',
    });
    await expect(readAdvancedReviewPayloadFunctionJson(textResponse)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(harness.getStoredDrafts()).toEqual([]);
  });

  it('rejects unsafe internal fields and returns a sanitized response body', async () => {
    const harness = createAdvancedReviewStorageMockHarness({ knownLeadIds: [advancedReviewPayloadFixtureLeadId] });
    const response = await handleAdvancedReviewPayloadFunctionRequest(
      createWrapperContractRequest({ body: unsafeAdvancedReviewPayloadRequestBody }),
      harness,
    );
    const json = await readAdvancedReviewPayloadFunctionJson(response);

    expect(response.status).toBe(400);
    expect(json).toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_invalid',
    });
    expect(harness.getStoredDrafts()).toEqual([]);
    await expectSafeResponse(response);
  });

  it('defines the initial no-write wrapper adapter expectation without faking success', async () => {
    const disabledNoWriteAdapter: AdvancedReviewStorageAdapter = {
      async savePayload() {
        return {
          ok: false,
          stored: false,
          diagnostic: 'advanced_review_payload_env_missing',
          message: 'Advanced review storage is intentionally disabled for this wrapper contract test.',
        };
      },
    };
    const response = await handleAdvancedReviewPayloadFunctionRequest(
      createWrapperContractRequest({ body: validAdvancedReviewPayloadRequestBody }),
      disabledNoWriteAdapter,
    );

    expect(response.status).toBe(503);
    await expect(readAdvancedReviewPayloadFunctionJson(response)).resolves.toMatchObject({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_payload_env_missing',
    });
    await expectSafeResponse(response);
  });
});
