import {
  AdvancedReviewConsolePayload,
  AdvancedReviewConsoleSource,
  RecommendedOperatorAction,
} from './advancedReviewConsole';
import { allowanceRiskSafetyMessage } from './allowanceRisk';

export const advancedReviewPayloadTableName = 'kitchen_advanced_review_payloads' as const;
export const advancedReviewPayloadFunctionPath = '/.netlify/functions/kitchen-advanced-review-payload' as const;

export const advancedReviewInternalStatuses = [
  'not_started',
  'needs_customer_clarification',
  'ready_for_manual_review',
  'site_measure_recommended',
  'written_scope_draft_needed',
  'closed',
] as const;

export type AdvancedReviewInternalStatus = (typeof advancedReviewInternalStatuses)[number];

export const advancedReviewStorageDiagnostics = [
  'advanced_review_payload_invalid',
  'advanced_review_payload_env_missing',
  'advanced_review_lead_not_found',
  'advanced_review_insert_failed',
  'advanced_review_payload_stored',
] as const;

export type AdvancedReviewStorageDiagnostic = (typeof advancedReviewStorageDiagnostics)[number];

export interface AdvancedReviewStorageRecordDraft {
  lead_id: string;
  source: AdvancedReviewConsoleSource;
  created_at: string;
  customer_safe_payload: AdvancedReviewConsolePayload;
  internal_review_status: AdvancedReviewInternalStatus;
}

export interface StoreAdvancedReviewPayloadRequest {
  payload: AdvancedReviewConsolePayload;
  requestId?: string;
}

export type StoreAdvancedReviewPayloadResult =
  | {
      ok: true;
      stored: true;
      recordId: string;
      diagnostic: 'advanced_review_payload_stored';
    }
  | {
      ok: false;
      stored: false;
      diagnostic: Exclude<AdvancedReviewStorageDiagnostic, 'advanced_review_payload_stored'>;
      message: string;
    };

export interface AdvancedReviewStorageAdapter {
  savePayload(request: StoreAdvancedReviewPayloadRequest): Promise<StoreAdvancedReviewPayloadResult>;
}

export type AdvancedReviewStorageValidationResult =
  | {
      ok: true;
      payload: AdvancedReviewConsolePayload;
    }
  | {
      ok: false;
      diagnostic: 'advanced_review_payload_invalid';
      issues: string[];
    };

const allowedSources: AdvancedReviewConsoleSource[] = ['requestReview', 'designBrief', 'scopeBuilder', 'quoteReview'];
const allowedOperatorActions: RecommendedOperatorAction[] = [
  'review_scope',
  'request_missing_information',
  'offer_site_measure',
  'prepare_quote_review',
  'mark_not_ready',
];

const allowedTopLevelFields = new Set([
  'leadId',
  'source',
  'createdAt',
  'designBriefSummary',
  'scopeSummary',
  'allowanceRiskFlags',
  'missingInclusions',
  'customerQuestions',
  'siteMeasurePreparation',
  'recommendedOperatorAction',
  'safetyMessage',
]);

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function isStringArray(value: unknown, maxItems = 30) {
  return Array.isArray(value) && value.length <= maxItems && value.every((item) => typeof item === 'string' && item.trim().length > 0 && item.length <= 320);
}

function hasOnlyAllowedTopLevelFields(record: Record<string, unknown>) {
  return Object.keys(record).every((key) => allowedTopLevelFields.has(key));
}

function isRiskFlagArray(value: unknown) {
  if (!Array.isArray(value) || value.length > 30) return false;
  return value.every((item) => {
    if (!isPlainRecord(item)) return false;
    return (
      typeof item.id === 'string' &&
      typeof item.category === 'string' &&
      typeof item.label === 'string' &&
      typeof item.customerSafePrompt === 'string' &&
      typeof item.requiresHumanReview === 'boolean' &&
      item.id.length <= 80 &&
      item.label.length <= 160 &&
      item.customerSafePrompt.length <= 320
    );
  });
}

export function validateAdvancedReviewPayloadForStorage(value: unknown): AdvancedReviewStorageValidationResult {
  const issues: string[] = [];

  if (!isPlainRecord(value)) {
    return {
      ok: false,
      diagnostic: 'advanced_review_payload_invalid',
      issues: ['Payload must be a plain object.'],
    };
  }

  if (!hasOnlyAllowedTopLevelFields(value)) issues.push('Payload contains unsupported fields.');
  if (typeof value.leadId !== 'string' || !value.leadId.trim() || value.leadId.length > 80) issues.push('leadId is required.');
  if (typeof value.source !== 'string' || !allowedSources.includes(value.source as AdvancedReviewConsoleSource)) issues.push('source is invalid.');
  if (typeof value.createdAt !== 'string' || value.createdAt.length > 40) issues.push('createdAt is required.');
  if (typeof value.recommendedOperatorAction !== 'string' || !allowedOperatorActions.includes(value.recommendedOperatorAction as RecommendedOperatorAction)) issues.push('recommendedOperatorAction is invalid.');
  if (value.safetyMessage !== allowanceRiskSafetyMessage) issues.push('safetyMessage must match the approved safe wording.');

  if (value.designBriefSummary !== undefined && !isStringArray(value.designBriefSummary)) issues.push('designBriefSummary must be a bounded string array.');
  if (value.scopeSummary !== undefined && !isStringArray(value.scopeSummary)) issues.push('scopeSummary must be a bounded string array.');
  if (value.missingInclusions !== undefined && !isStringArray(value.missingInclusions)) issues.push('missingInclusions must be a bounded string array.');
  if (value.customerQuestions !== undefined && !isStringArray(value.customerQuestions)) issues.push('customerQuestions must be a bounded string array.');
  if (value.siteMeasurePreparation !== undefined && !isStringArray(value.siteMeasurePreparation)) issues.push('siteMeasurePreparation must be a bounded string array.');
  if (value.allowanceRiskFlags !== undefined && !isRiskFlagArray(value.allowanceRiskFlags)) issues.push('allowanceRiskFlags must be a bounded safe risk-flag array.');

  if (issues.length) {
    return {
      ok: false,
      diagnostic: 'advanced_review_payload_invalid',
      issues,
    };
  }

  return {
    ok: true,
    payload: value as unknown as AdvancedReviewConsolePayload,
  };
}

export function createAdvancedReviewStorageRecordDraft(payload: AdvancedReviewConsolePayload): AdvancedReviewStorageRecordDraft {
  return {
    lead_id: payload.leadId,
    source: payload.source,
    created_at: payload.createdAt,
    customer_safe_payload: payload,
    internal_review_status: 'not_started',
  };
}
