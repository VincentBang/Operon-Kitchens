export const adminLeadStatuses = [
  'new',
  'review_needed',
  'contacted',
  'site_measure_offered',
  'site_measure_booked',
  'quoted',
  'won',
  'lost',
  'spam',
] as const;

export type AdminLeadStatus = typeof adminLeadStatuses[number];

export interface KitchenAdminLead {
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
  status: AdminLeadStatus | string;
  internal_notes: string | null;
  user_agent: string | null;
  ip_hash: string | null;
}

export type AdminLeadListResult =
  | { configured: false; ok: false; reason: 'missing_env' }
  | { configured: true; ok: true; leads: KitchenAdminLead[] }
  | { configured: true; ok: false; error: string };

export type AdminLeadUpdateResult =
  | { configured: false; ok: false; reason: 'missing_env' }
  | { configured: true; ok: true; lead: KitchenAdminLead | null }
  | { configured: true; ok: false; error: string };

const adminLeadColumns = [
  'id',
  'created_at',
  'name',
  'email',
  'phone',
  'suburb',
  'property_type',
  'project_stage',
  'has_current_quote',
  'has_photos_or_plans',
  'budget_range',
  'preferred_next_step',
  'message',
  'marketing_opt_in',
  'source_route',
  'referrer',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'landing_page',
  'status',
  'internal_notes',
  'user_agent',
  'ip_hash',
].join(',');

const legacyAdminLeadColumns = [
  'id',
  'created_at',
  'name',
  'email',
  'phone',
  'suburb',
  'property_type',
  'project_stage',
  'has_current_quote',
  'has_photos_or_plans',
  'budget_range',
  'preferred_next_step',
  'message',
  'marketing_opt_in',
  'source_route',
  'status',
  'internal_notes',
  'user_agent',
  'ip_hash',
].join(',');

const attributionColumnNames = [
  'referrer',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'landing_page',
];

function isMissingAttributionColumnError(detail: string) {
  const lowerDetail = detail.toLowerCase();
  return lowerDetail.includes('pgrst204') || attributionColumnNames.some((column) => lowerDetail.includes(column));
}

function normaliseAdminLead(lead: Partial<KitchenAdminLead>): KitchenAdminLead {
  return {
    ...lead,
    referrer: lead.referrer ?? null,
    utm_source: lead.utm_source ?? null,
    utm_medium: lead.utm_medium ?? null,
    utm_campaign: lead.utm_campaign ?? null,
    utm_content: lead.utm_content ?? null,
    utm_term: lead.utm_term ?? null,
    landing_page: lead.landing_page ?? null,
  } as KitchenAdminLead;
}

export function isAdminLeadStatus(value: unknown): value is AdminLeadStatus {
  return typeof value === 'string' && adminLeadStatuses.includes(value as AdminLeadStatus);
}

export function normaliseAdminLimit(value: unknown) {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : NaN;
  if (!Number.isFinite(parsed)) return 25;
  return Math.min(Math.max(parsed, 1), 100);
}

export function cleanAdminNotes(value: unknown) {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(/\s+/g, ' ').trim().slice(0, 2000);
  return cleaned || null;
}

export function getAdminAuthState(headers: Record<string, string | undefined> | undefined) {
  const expected = process.env.OPERON_KITCHENS_ADMIN_TOKEN;
  const provided = getHeader(headers, 'x-operon-admin-token');
  if (!expected || provided !== expected) return false;
  return true;
}

export function getHeader(headers: Record<string, string | undefined> | undefined, key: string) {
  if (!headers) return undefined;
  const lowerKey = key.toLowerCase();
  const matchedKey = Object.keys(headers).find((header) => header.toLowerCase() === lowerKey);
  return matchedKey ? headers[matchedKey] : undefined;
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.OPERON_KITCHENS_SUPABASE_URL;
  const serviceRoleKey = process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return null;
  return {
    baseUrl: `${supabaseUrl.replace(/\/$/, '')}/rest/v1/kitchen_request_reviews`,
    serviceRoleKey,
  };
}

function serviceHeaders(serviceRoleKey: string, prefer?: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export async function listKitchenAdminLeads(options: {
  status?: string;
  limit?: number;
}): Promise<AdminLeadListResult> {
  const config = getSupabaseConfig();
  if (!config) return { configured: false, ok: false, reason: 'missing_env' };

  const params = new URLSearchParams({
    select: adminLeadColumns,
    order: 'created_at.desc',
    limit: String(options.limit ?? 25),
  });
  if (options.status && isAdminLeadStatus(options.status)) {
    params.set('status', `eq.${options.status}`);
  }

  let response = await fetch(`${config.baseUrl}?${params.toString()}`, {
    method: 'GET',
    headers: serviceHeaders(config.serviceRoleKey),
  });

  if (!response.ok) {
    const detail = await response.text();
    if (isMissingAttributionColumnError(detail)) {
      params.set('select', legacyAdminLeadColumns);
      response = await fetch(`${config.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: serviceHeaders(config.serviceRoleKey),
      });
      if (response.ok) {
        const legacyLeads = (await response.json()) as Partial<KitchenAdminLead>[];
        return { configured: true, ok: true, leads: legacyLeads.map(normaliseAdminLead) };
      }
    }

    return {
      configured: true,
      ok: false,
      error: `Supabase lead list failed with ${response.status}: ${detail.slice(0, 180)}`,
    };
  }

  const leads = (await response.json()) as Partial<KitchenAdminLead>[];
  return { configured: true, ok: true, leads: leads.map(normaliseAdminLead) };
}

export async function updateKitchenAdminLead(options: {
  id: string;
  status?: AdminLeadStatus;
  internalNotes?: string | null;
}): Promise<AdminLeadUpdateResult> {
  const config = getSupabaseConfig();
  if (!config) return { configured: false, ok: false, reason: 'missing_env' };

  const body: Record<string, string | null> = {};
  if (options.status) body.status = options.status;
  if (options.internalNotes !== undefined) body.internal_notes = options.internalNotes;

  const params = new URLSearchParams({
    id: `eq.${options.id}`,
    select: adminLeadColumns,
  });

  let response = await fetch(`${config.baseUrl}?${params.toString()}`, {
    method: 'PATCH',
    headers: serviceHeaders(config.serviceRoleKey, 'return=representation'),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    if (isMissingAttributionColumnError(detail)) {
      params.set('select', legacyAdminLeadColumns);
      response = await fetch(`${config.baseUrl}?${params.toString()}`, {
        method: 'PATCH',
        headers: serviceHeaders(config.serviceRoleKey, 'return=representation'),
        body: JSON.stringify(body),
      });
      if (response.ok) {
        const legacyLeads = (await response.json()) as Partial<KitchenAdminLead>[];
        return { configured: true, ok: true, lead: legacyLeads[0] ? normaliseAdminLead(legacyLeads[0]) : null };
      }
    }

    return {
      configured: true,
      ok: false,
      error: `Supabase lead update failed with ${response.status}: ${detail.slice(0, 180)}`,
    };
  }

  const leads = (await response.json()) as Partial<KitchenAdminLead>[];
  return { configured: true, ok: true, lead: leads[0] ? normaliseAdminLead(leads[0]) : null };
}
