import {
  AdvancedReviewStorageAdapter,
  AdvancedReviewStorageDiagnostic,
  StoreAdvancedReviewPayloadResult,
} from './advancedReviewStorage';

export type AdvancedReviewPayloadFunctionDiagnostic =
  | AdvancedReviewStorageDiagnostic
  | 'advanced_review_method_not_allowed';

export interface AdvancedReviewPayloadFunctionResponseBody {
  ok: boolean;
  stored: boolean;
  diagnostic: AdvancedReviewPayloadFunctionDiagnostic;
  message?: string;
  recordId?: string;
}

export interface AdvancedReviewPayloadFunctionRequest {
  method: string;
  headers: {
    get(name: string): string | null;
  };
  json(): Promise<unknown>;
}

export class AdvancedReviewPayloadFunctionResponse {
  constructor(
    private readonly body: AdvancedReviewPayloadFunctionResponseBody,
    public readonly status: number,
  ) {}

  async json() {
    return this.body;
  }

  async text() {
    return JSON.stringify(this.body);
  }

  clone() {
    return new AdvancedReviewPayloadFunctionResponse(this.body, this.status);
  }
}

export const advancedReviewPayloadFunctionStatus: Record<AdvancedReviewPayloadFunctionDiagnostic, number> = {
  advanced_review_method_not_allowed: 405,
  advanced_review_payload_invalid: 400,
  advanced_review_payload_env_missing: 503,
  advanced_review_lead_not_found: 409,
  advanced_review_insert_failed: 503,
  advanced_review_payload_stored: 202,
};

const safeErrorMessages: Record<Exclude<AdvancedReviewStorageDiagnostic, 'advanced_review_payload_stored'>, string> = {
  advanced_review_payload_invalid: 'Advanced review payload could not be accepted.',
  advanced_review_payload_env_missing: 'Advanced review storage is not available.',
  advanced_review_lead_not_found: 'Advanced review payload could not be linked.',
  advanced_review_insert_failed: 'Advanced review payload could not be stored.',
};

function createJsonResponse(body: AdvancedReviewPayloadFunctionResponseBody) {
  return new AdvancedReviewPayloadFunctionResponse(body, advancedReviewPayloadFunctionStatus[body.diagnostic]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function resultToResponse(result: StoreAdvancedReviewPayloadResult) {
  if (result.ok) {
    return createJsonResponse({
      ok: true,
      stored: true,
      diagnostic: result.diagnostic,
      recordId: result.recordId,
    });
  }

  return createJsonResponse({
    ok: false,
    stored: false,
    diagnostic: result.diagnostic,
    message: safeErrorMessages[result.diagnostic],
  });
}

function invalidPayloadResponse() {
  return createJsonResponse({
    ok: false,
    stored: false,
    diagnostic: 'advanced_review_payload_invalid',
    message: safeErrorMessages.advanced_review_payload_invalid,
  });
}

export async function handleAdvancedReviewPayloadFunctionRequest(
  request: AdvancedReviewPayloadFunctionRequest,
  adapter: AdvancedReviewStorageAdapter,
) {
  if (request.method !== 'POST') {
    return createJsonResponse({
      ok: false,
      stored: false,
      diagnostic: 'advanced_review_method_not_allowed',
      message: 'Method not allowed.',
    });
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return invalidPayloadResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalidPayloadResponse();
  }

  if (!isRecord(body) || !('payload' in body)) {
    return invalidPayloadResponse();
  }

  return resultToResponse(await adapter.savePayload({
    payload: body.payload as any,
    requestId: typeof body.requestId === 'string' ? body.requestId : undefined,
  }));
}

export async function readAdvancedReviewPayloadFunctionJson(response: AdvancedReviewPayloadFunctionResponse) {
  return response.json();
}
