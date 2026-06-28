import {
  AdvancedReviewStorageAdapter,
  AdvancedReviewStorageDiagnostic,
  AdvancedReviewStorageRecordDraft,
  StoreAdvancedReviewPayloadRequest,
  StoreAdvancedReviewPayloadResult,
  createAdvancedReviewStorageRecordDraft,
  validateAdvancedReviewPayloadForStorage,
} from '../../src/lib/advancedReviewStorage';

interface MockSupabaseError {
  message: string;
  code?: string;
}

interface MockSupabaseResponse<T> {
  data: T | null;
  error: MockSupabaseError | null;
}

export interface AdvancedReviewSupabaseAdapterContractHarness extends AdvancedReviewStorageAdapter {
  getDiagnostics(): AdvancedReviewStorageDiagnostic[];
  getInsertDrafts(): AdvancedReviewStorageRecordDraft[];
  getLeadLookups(): string[];
}

export interface AdvancedReviewSupabaseAdapterContractHarnessOptions {
  storageConfigured?: boolean;
  leadLookupResponse?: MockSupabaseResponse<{ id: string }>;
  insertResponse?: MockSupabaseResponse<{ id: string }>;
}

function fail(
  diagnostics: AdvancedReviewStorageDiagnostic[],
  diagnostic: Exclude<AdvancedReviewStorageDiagnostic, 'advanced_review_payload_stored'>,
  message: string,
): StoreAdvancedReviewPayloadResult {
  diagnostics.push(diagnostic);

  return {
    ok: false,
    stored: false,
    diagnostic,
    message,
  };
}

export function createAdvancedReviewSupabaseAdapterContractHarness(
  options: AdvancedReviewSupabaseAdapterContractHarnessOptions = {},
): AdvancedReviewSupabaseAdapterContractHarness {
  const storageConfigured = options.storageConfigured ?? true;
  const diagnostics: AdvancedReviewStorageDiagnostic[] = [];
  const leadLookups: string[] = [];
  const insertDrafts: AdvancedReviewStorageRecordDraft[] = [];

  return {
    async savePayload(request: StoreAdvancedReviewPayloadRequest): Promise<StoreAdvancedReviewPayloadResult> {
      const validation = validateAdvancedReviewPayloadForStorage(request.payload);
      if (!validation.ok) {
        return fail(diagnostics, 'advanced_review_payload_invalid', 'Advanced review payload was not accepted.');
      }

      if (!storageConfigured) {
        return fail(diagnostics, 'advanced_review_payload_env_missing', 'Advanced review storage is not configured.');
      }

      leadLookups.push(validation.payload.leadId);
      const leadLookupResponse = options.leadLookupResponse ?? {
        data: { id: validation.payload.leadId },
        error: null,
      };

      if (leadLookupResponse.error || !leadLookupResponse.data) {
        return fail(diagnostics, 'advanced_review_lead_not_found', 'Advanced review lead link could not be confirmed.');
      }

      const draft = createAdvancedReviewStorageRecordDraft(validation.payload);
      insertDrafts.push(draft);
      const insertResponse = options.insertResponse ?? {
        data: { id: 'mock-advanced-review-payload-1' },
        error: null,
      };

      if (insertResponse.error || !insertResponse.data?.id) {
        return fail(diagnostics, 'advanced_review_insert_failed', 'Advanced review payload could not be stored.');
      }

      diagnostics.push('advanced_review_payload_stored');

      return {
        ok: true,
        stored: true,
        recordId: insertResponse.data.id,
        diagnostic: 'advanced_review_payload_stored',
      };
    },
    getDiagnostics() {
      return [...diagnostics];
    },
    getInsertDrafts() {
      return [...insertDrafts];
    },
    getLeadLookups() {
      return [...leadLookups];
    },
  };
}
