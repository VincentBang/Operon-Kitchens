import {
  AdvancedReviewStorageAdapter,
  StoreAdvancedReviewPayloadRequest,
  StoreAdvancedReviewPayloadResult,
  advancedReviewPayloadTableName,
  createAdvancedReviewStorageRecordDraft,
  validateAdvancedReviewPayloadForStorage,
} from './advancedReviewStorage';

export interface AdvancedReviewSupabaseStorageEnv {
  supabaseUrl?: string;
  serviceRoleKey?: string;
}

type AdvancedReviewSupabaseInsertRecord = ReturnType<typeof createAdvancedReviewStorageRecordDraft> & {
  storage_request_id?: string;
};

const requestReviewTableName = 'kitchen_request_reviews';

function cleanEnvValue(value: string | undefined) {
  return value?.trim() || undefined;
}

function normalizeSupabaseUrl(supabaseUrl: string) {
  return supabaseUrl.replace(/\/+$/, '');
}

function createSupabaseHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

function createFailure(
  diagnostic: Exclude<StoreAdvancedReviewPayloadResult['diagnostic'], 'advanced_review_payload_stored'>,
  message: string,
): StoreAdvancedReviewPayloadResult {
  return {
    ok: false,
    stored: false,
    diagnostic,
    message,
  };
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function hasLeadRow(value: unknown) {
  return Array.isArray(value) && value.some((item) => {
    return Boolean(item && typeof item === 'object' && 'id' in item && typeof item.id === 'string');
  });
}

function getStoredRecordId(value: unknown) {
  if (Array.isArray(value)) {
    const first = value[0];
    return first && typeof first === 'object' && 'id' in first && typeof first.id === 'string' ? first.id : null;
  }

  return value && typeof value === 'object' && 'id' in value && typeof value.id === 'string' ? value.id : null;
}

function cleanRequestId(value: string | undefined) {
  if (!value) return undefined;
  return value.replace(/\s+/g, ' ').trim().slice(0, 120) || undefined;
}

function createInsertRecord(request: StoreAdvancedReviewPayloadRequest): AdvancedReviewSupabaseInsertRecord {
  const record: AdvancedReviewSupabaseInsertRecord = createAdvancedReviewStorageRecordDraft(request.payload);
  const storageRequestId = cleanRequestId(request.requestId);
  if (storageRequestId) record.storage_request_id = storageRequestId;
  return record;
}

export function getAdvancedReviewSupabaseStorageEnv(): AdvancedReviewSupabaseStorageEnv {
  return {
    supabaseUrl: cleanEnvValue(process.env.OPERON_KITCHENS_SUPABASE_URL),
    serviceRoleKey: cleanEnvValue(process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY),
  };
}

export function createAdvancedReviewSupabaseStorageAdapter(
  env: AdvancedReviewSupabaseStorageEnv = getAdvancedReviewSupabaseStorageEnv(),
): AdvancedReviewStorageAdapter {
  return {
    async savePayload(request: StoreAdvancedReviewPayloadRequest): Promise<StoreAdvancedReviewPayloadResult> {
      const validation = validateAdvancedReviewPayloadForStorage(request.payload);
      if (!validation.ok) {
        return createFailure('advanced_review_payload_invalid', 'Advanced review payload was not accepted.');
      }

      const supabaseUrl = cleanEnvValue(env.supabaseUrl);
      const serviceRoleKey = cleanEnvValue(env.serviceRoleKey);
      if (!supabaseUrl || !serviceRoleKey) {
        return createFailure('advanced_review_payload_env_missing', 'Advanced review storage is not configured.');
      }

      const baseUrl = normalizeSupabaseUrl(supabaseUrl);
      const headers = createSupabaseHeaders(serviceRoleKey);
      const leadLookupUrl = `${baseUrl}/rest/v1/${requestReviewTableName}?id=eq.${encodeURIComponent(validation.payload.leadId)}&select=id&limit=1`;

      let leadResponse: Response;
      try {
        leadResponse = await fetch(leadLookupUrl, {
          method: 'GET',
          headers,
        });
      } catch {
        return createFailure('advanced_review_lead_not_found', 'Advanced review lead link could not be confirmed.');
      }

      if (!leadResponse.ok || !hasLeadRow(await readJson(leadResponse))) {
        return createFailure('advanced_review_lead_not_found', 'Advanced review lead link could not be confirmed.');
      }

      const insertUrl = `${baseUrl}/rest/v1/${advancedReviewPayloadTableName}`;
      const insertRecord = createInsertRecord({
        ...request,
        payload: validation.payload,
      });

      let insertResponse: Response;
      try {
        insertResponse = await fetch(insertUrl, {
          method: 'POST',
          headers: {
            ...headers,
            Prefer: 'return=representation',
          },
          body: JSON.stringify(insertRecord),
        });
      } catch {
        return createFailure('advanced_review_insert_failed', 'Advanced review payload could not be stored.');
      }

      const recordId = getStoredRecordId(await readJson(insertResponse));
      if (!insertResponse.ok || !recordId) {
        return createFailure('advanced_review_insert_failed', 'Advanced review payload could not be stored.');
      }

      return {
        ok: true,
        stored: true,
        recordId,
        diagnostic: 'advanced_review_payload_stored',
      };
    },
  };
}
