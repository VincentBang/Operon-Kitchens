import { KitchenRequestReviewLead } from './requestReview';

export interface KitchenLeadStorageMetadata {
  userAgent?: string;
  ipHash?: string;
}

export interface KitchenLeadStorageEnv {
  supabaseUrl?: string;
  serviceRoleKey?: string;
}

export interface KitchenRequestReviewStorageRecord {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  suburb: string | null;
  property_type: string;
  project_stage: string;
  has_current_quote: boolean | null;
  has_photos_or_plans: boolean | null;
  budget_range: string | null;
  preferred_next_step: string;
  message: string;
  marketing_opt_in: boolean;
  source_route: string;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_page: string | null;
  status: 'new';
  internal_notes: null;
  user_agent: string | null;
  ip_hash: string | null;
}

type KitchenRequestReviewLegacyStorageRecord = Omit<
  KitchenRequestReviewStorageRecord,
  'referrer' | 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term' | 'landing_page'
>;

export type KitchenLeadStorageResult =
  | { configured: false; stored: false; reason: 'missing_env' }
  | { configured: true; stored: true; id: string }
  | { configured: true; stored: false; error: string };

const attributionColumnNames = [
  'referrer',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'landing_page',
];

function yesNoToBoolean(value: KitchenRequestReviewLead['hasCurrentQuote'] | KitchenRequestReviewLead['hasPhotosPlans']) {
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return null;
}

function cleanMetadata(value: string | undefined, maxLength: number) {
  if (!value) return null;
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength) || null;
}

export function createKitchenRequestReviewStorageRecord(
  lead: KitchenRequestReviewLead,
  metadata: KitchenLeadStorageMetadata = {},
): KitchenRequestReviewStorageRecord {
  return {
    id: lead.id,
    created_at: lead.createdAt,
    name: lead.name,
    email: lead.email,
    phone: lead.phone || null,
    suburb: lead.suburb || null,
    property_type: lead.propertyType,
    project_stage: lead.projectStage,
    has_current_quote: yesNoToBoolean(lead.hasCurrentQuote),
    has_photos_or_plans: yesNoToBoolean(lead.hasPhotosPlans),
    budget_range: lead.approximateBudgetRange || null,
    preferred_next_step: lead.preferredNextStep,
    message: lead.message,
    marketing_opt_in: lead.marketingOptIn,
    source_route: lead.sourceRoute,
    referrer: lead.attribution.referrer || null,
    utm_source: lead.attribution.utmSource || null,
    utm_medium: lead.attribution.utmMedium || null,
    utm_campaign: lead.attribution.utmCampaign || null,
    utm_content: lead.attribution.utmContent || null,
    utm_term: lead.attribution.utmTerm || null,
    landing_page: lead.attribution.landingPage || null,
    status: 'new',
    internal_notes: null,
    user_agent: cleanMetadata(metadata.userAgent, 240),
    ip_hash: cleanMetadata(metadata.ipHash, 120),
  };
}

export function createLegacyKitchenRequestReviewStorageRecord(
  record: KitchenRequestReviewStorageRecord,
): KitchenRequestReviewLegacyStorageRecord {
  const {
    referrer,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    landing_page,
    ...legacyRecord
  } = record;
  void referrer;
  void utm_source;
  void utm_medium;
  void utm_campaign;
  void utm_content;
  void utm_term;
  void landing_page;
  return legacyRecord;
}

function isMissingAttributionColumnError(detail: string) {
  const lowerDetail = detail.toLowerCase();
  return lowerDetail.includes('pgrst204') || attributionColumnNames.some((column) => lowerDetail.includes(column));
}

function cleanEnvValue(value: string | undefined) {
  return value?.trim() || undefined;
}

async function insertKitchenLeadRecord(
  endpoint: string,
  serviceRoleKey: string,
  record: KitchenRequestReviewStorageRecord | KitchenRequestReviewLegacyStorageRecord,
) {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(record),
  });
}

export function getKitchenLeadStorageEnv(): KitchenLeadStorageEnv {
  return {
    supabaseUrl: cleanEnvValue(process.env.OPERON_KITCHENS_SUPABASE_URL),
    serviceRoleKey: cleanEnvValue(process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY),
  };
}

export async function storeKitchenRequestReviewLead(
  lead: KitchenRequestReviewLead,
  metadata: KitchenLeadStorageMetadata = {},
  env: KitchenLeadStorageEnv = getKitchenLeadStorageEnv(),
): Promise<KitchenLeadStorageResult> {
  const supabaseUrl = cleanEnvValue(env.supabaseUrl);
  const serviceRoleKey = cleanEnvValue(env.serviceRoleKey);

  if (!supabaseUrl || !serviceRoleKey) return { configured: false, stored: false, reason: 'missing_env' };

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/kitchen_request_reviews`;
  const record = createKitchenRequestReviewStorageRecord(lead, metadata);
  let response: Response;
  try {
    response = await insertKitchenLeadRecord(endpoint, serviceRoleKey, record);
  } catch (error) {
    return {
      configured: true,
      stored: false,
      error: `Supabase insert request failed: ${error instanceof Error ? error.message : 'fetch failed'}`,
    };
  }

  if (!response.ok) {
    const detail = await response.text();
    if (isMissingAttributionColumnError(detail)) {
      let fallbackResponse: Response;
      try {
        fallbackResponse = await insertKitchenLeadRecord(
          endpoint,
          serviceRoleKey,
          createLegacyKitchenRequestReviewStorageRecord(record),
        );
      } catch (error) {
        return {
          configured: true,
          stored: false,
          error: `Supabase legacy insert request failed: ${error instanceof Error ? error.message : 'fetch failed'}`,
        };
      }
      if (fallbackResponse.ok) return { configured: true, stored: true, id: lead.id };

      const fallbackDetail = await fallbackResponse.text();
      return {
        configured: true,
        stored: false,
        error: `Supabase insert failed with ${fallbackResponse.status}: ${fallbackDetail.slice(0, 180)}`,
      };
    }

    return {
      configured: true,
      stored: false,
      error: `Supabase insert failed with ${response.status}: ${detail.slice(0, 180)}`,
    };
  }

  return { configured: true, stored: true, id: lead.id };
}
