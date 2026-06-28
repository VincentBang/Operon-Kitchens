import {
  AdvancedReviewStorageAdapter,
  AdvancedReviewStorageDiagnostic,
  AdvancedReviewStorageRecordDraft,
  StoreAdvancedReviewPayloadRequest,
  StoreAdvancedReviewPayloadResult,
  createAdvancedReviewStorageRecordDraft,
  validateAdvancedReviewPayloadForStorage,
} from '../../src/lib/advancedReviewStorage';

export type AdvancedReviewStorageMockMode = 'success' | 'envMissing' | 'leadNotFound' | 'insertFailed';

export interface AdvancedReviewStorageMockHarness extends AdvancedReviewStorageAdapter {
  getStoredDrafts(): AdvancedReviewStorageRecordDraft[];
  getDiagnostics(): AdvancedReviewStorageDiagnostic[];
}

export function createAdvancedReviewStorageMockHarness(options: {
  mode?: AdvancedReviewStorageMockMode;
  knownLeadIds?: string[];
} = {}): AdvancedReviewStorageMockHarness {
  const mode = options.mode ?? 'success';
  const knownLeadIds = new Set(options.knownLeadIds ?? []);
  const storedDrafts: AdvancedReviewStorageRecordDraft[] = [];
  const diagnostics: AdvancedReviewStorageDiagnostic[] = [];

  function fail(
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

  return {
    async savePayload(request: StoreAdvancedReviewPayloadRequest): Promise<StoreAdvancedReviewPayloadResult> {
      const validation = validateAdvancedReviewPayloadForStorage(request.payload);
      if (!validation.ok) {
        return fail('advanced_review_payload_invalid', 'Advanced review payload was not stored because validation failed.');
      }

      if (mode === 'envMissing') {
        return fail('advanced_review_payload_env_missing', 'Advanced review payload was not stored because storage configuration is unavailable.');
      }

      if (mode === 'leadNotFound' || (knownLeadIds.size > 0 && !knownLeadIds.has(validation.payload.leadId))) {
        return fail('advanced_review_lead_not_found', 'Advanced review payload was not stored because the lead link could not be confirmed.');
      }

      if (mode === 'insertFailed') {
        return fail('advanced_review_insert_failed', 'Advanced review payload was not stored because the insert path failed.');
      }

      const draft = createAdvancedReviewStorageRecordDraft(validation.payload);
      storedDrafts.push(draft);
      diagnostics.push('advanced_review_payload_stored');

      return {
        ok: true,
        stored: true,
        recordId: `mock-${storedDrafts.length}`,
        diagnostic: 'advanced_review_payload_stored',
      };
    },
    getStoredDrafts() {
      return [...storedDrafts];
    },
    getDiagnostics() {
      return [...diagnostics];
    },
  };
}
