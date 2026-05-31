import { KitchenRequestReviewLead } from './requestReview';

export interface KitchenLeadStorageMetadata {
  userAgent?: string;
  ipHash?: string;
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
  status: 'new';
  internal_notes: null;
  user_agent: string | null;
  ip_hash: string | null;
}

export type KitchenLeadStorageResult =
  | { configured: false; stored: false; reason: 'missing_env' }
  | { configured: true; stored: true; id: string }
  | { configured: true; stored: false; error: string };

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
    status: 'new',
    internal_notes: null,
    user_agent: cleanMetadata(metadata.userAgent, 240),
    ip_hash: cleanMetadata(metadata.ipHash, 120),
  };
}

export async function storeKitchenRequestReviewLead(
  lead: KitchenRequestReviewLead,
  metadata: KitchenLeadStorageMetadata = {},
): Promise<KitchenLeadStorageResult> {
  const supabaseUrl = process.env.OPERON_KITCHENS_SUPABASE_URL;
  const serviceRoleKey = process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) return { configured: false, stored: false, reason: 'missing_env' };

  const endpoint = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/kitchen_request_reviews`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(createKitchenRequestReviewStorageRecord(lead, metadata)),
  });

  if (!response.ok) {
    const detail = await response.text();
    return {
      configured: true,
      stored: false,
      error: `Supabase insert failed with ${response.status}: ${detail.slice(0, 180)}`,
    };
  }

  return { configured: true, stored: true, id: lead.id };
}
