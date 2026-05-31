import {
  getAdminAuthState,
  isAdminLeadStatus,
  listKitchenAdminLeads,
  normaliseAdminLimit,
} from '../../src/lib/kitchenAdminLeads';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  headers?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined> | null;
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

function json(statusCode: number, body: Record<string, unknown>): NetlifyResponse {
  return {
    statusCode,
    headers: jsonHeaders,
    body: JSON.stringify(body),
  };
}

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  if (event.httpMethod !== 'GET') {
    return json(405, { ok: false, error: 'Method not allowed.' });
  }

  if (!getAdminAuthState(event.headers)) {
    return json(401, { ok: false, error: 'Unauthorised.' });
  }

  const status = event.queryStringParameters?.status;
  if (status && !isAdminLeadStatus(status)) {
    return json(400, { ok: false, error: 'Unsupported lead status filter.' });
  }

  const result = await listKitchenAdminLeads({
    status,
    limit: normaliseAdminLimit(event.queryStringParameters?.limit),
  });

  if (!result.configured) {
    console.warn('operon_kitchens_admin_leads_storage_env_missing', {
      category: 'storage_env_missing',
    });
    return json(503, { ok: false, error: 'Lead storage is not configured.' });
  }

  if (!result.ok) {
    console.warn('operon_kitchens_admin_leads_list_failed', {
      category: 'storage_query_failed',
      error: result.error,
    });
    return json(502, { ok: false, error: 'Lead list is temporarily unavailable.' });
  }

  return json(200, { ok: true, leads: result.leads });
}
