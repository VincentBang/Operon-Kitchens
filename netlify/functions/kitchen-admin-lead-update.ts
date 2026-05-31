import {
  cleanAdminNotes,
  getAdminAuthState,
  isAdminLeadStatus,
  updateKitchenAdminLead,
} from '../../src/lib/kitchenAdminLeads';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  headers?: Record<string, string | undefined>;
}

interface NetlifyResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
};

const forbiddenUpdateFields = new Set([
  'created_at',
  'email',
  'name',
  'phone',
  'margin',
  'markup',
  'supplierCost',
  'supplierCosts',
  'internalRate',
  'internalRates',
  'leadScore',
  'leadPriority',
  'adminPriority',
  'quoteLineItems',
  'lineItemCosts',
]);

function json(statusCode: number, body: Record<string, unknown>): NetlifyResponse {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body),
  };
}

function parseBody(body: string | null) {
  if (!body) return null;
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasForbiddenUpdateField(input: Record<string, unknown>) {
  return Object.keys(input).some((key) => forbiddenUpdateFields.has(key));
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed.' });
  }

  if (!getAdminAuthState(event.headers)) {
    return json(401, { ok: false, error: 'Unauthorised.' });
  }

  const body = parseBody(event.body);
  if (!isRecord(body)) {
    return json(400, { ok: false, error: 'Request body must be an object.' });
  }

  if (hasForbiddenUpdateField(body)) {
    return json(400, { ok: false, error: 'Unsupported lead update fields.' });
  }

  if (!isUuid(body.id)) {
    return json(400, { ok: false, error: 'A valid lead id is required.' });
  }

  const hasStatus = Object.prototype.hasOwnProperty.call(body, 'status');
  const hasNotes = Object.prototype.hasOwnProperty.call(body, 'internal_notes');
  if (!hasStatus && !hasNotes) {
    return json(400, { ok: false, error: 'Status or internal notes are required.' });
  }

  if (hasStatus && !isAdminLeadStatus(body.status)) {
    return json(400, { ok: false, error: 'Unsupported lead status.' });
  }

  const result = await updateKitchenAdminLead({
    id: body.id,
    status: hasStatus && isAdminLeadStatus(body.status) ? body.status : undefined,
    internalNotes: hasNotes ? cleanAdminNotes(body.internal_notes) ?? null : undefined,
  });

  if (!result.configured) {
    console.warn('operon_kitchens_admin_lead_update_storage_env_missing', {
      category: 'storage_env_missing',
    });
    return json(503, { ok: false, error: 'Lead storage is not configured.' });
  }

  if (!result.ok) {
    console.warn('operon_kitchens_admin_lead_update_failed', {
      category: 'storage_update_failed',
      error: result.error,
    });
    return json(502, { ok: false, error: 'Lead update is temporarily unavailable.' });
  }

  return json(200, { ok: true, lead: result.lead });
}
