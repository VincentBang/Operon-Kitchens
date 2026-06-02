import {
  createKitchenAdminFileSignedDownload,
  getKitchenAdminFileAuthState,
  isUuid,
} from '../../src/lib/kitchenAdminFiles';

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

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed.' });
  }

  if (!getKitchenAdminFileAuthState(event.headers)) {
    return json(401, { ok: false, error: 'Unauthorised.' });
  }

  const body = parseBody(event.body);
  if (!isRecord(body)) {
    return json(400, { ok: false, error: 'Request body must be an object.' });
  }

  if (!isUuid(body.fileId)) {
    return json(400, { ok: false, error: 'A valid file id is required.' });
  }

  const result = await createKitchenAdminFileSignedDownload({ fileId: body.fileId });

  if (!result.configured) {
    console.warn('operon_kitchens_admin_file_download_storage_env_missing', {
      category: 'storage_env_missing',
    });
    return json(503, { ok: false, error: 'File storage is not configured.' });
  }

  if (!result.ok) {
    console.warn('operon_kitchens_admin_file_download_failed', {
      category: result.error,
      status: result.status,
    });
    if (result.status === 404) return json(404, { ok: false, error: 'File is unavailable.' });
    return json(502, { ok: false, error: 'File download is temporarily unavailable.' });
  }

  return json(200, {
    ok: true,
    fileId: result.fileId,
    fileName: result.fileName,
    downloadUrl: result.downloadUrl,
    expiresInSeconds: result.expiresInSeconds,
  });
}

