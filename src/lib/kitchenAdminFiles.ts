import { getAdminAuthState } from './kitchenAdminLeads';

export interface KitchenAdminFileMetadata {
  id: string;
  lead_id: string;
  created_at: string;
  bucket: string;
  object_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  category: string;
}

export type KitchenAdminSignedDownloadResult =
  | { configured: false; ok: false; reason: 'missing_env' }
  | { configured: true; ok: false; status: 404; error: 'file_not_found' }
  | { configured: true; ok: false; status: number; error: 'metadata_lookup_failed' | 'signed_url_failed' }
  | {
      configured: true;
      ok: true;
      fileId: string;
      fileName: string;
      downloadUrl: string;
      expiresInSeconds: number;
    };

const adminFileColumns = [
  'id',
  'lead_id',
  'created_at',
  'bucket',
  'object_path',
  'file_name',
  'file_type',
  'file_size',
  'category',
].join(',');

const defaultSignedUrlExpirySeconds = 600;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function getKitchenAdminFileAuthState(headers: Record<string, string | undefined> | undefined) {
  return getAdminAuthState(headers);
}

function getSupabaseConfig() {
  const supabaseUrl = process.env.OPERON_KITCHENS_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceRoleKey) return null;
  const root = supabaseUrl.replace(/\/$/, '');
  return {
    root,
    metadataEndpoint: `${root}/rest/v1/kitchen_request_review_files`,
    serviceRoleKey,
  };
}

function serviceHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };
}

function encodeObjectPath(objectPath: string) {
  return objectPath.split('/').map((part) => encodeURIComponent(part)).join('/');
}

function buildSignEndpoint(root: string, file: KitchenAdminFileMetadata) {
  const bucket = encodeURIComponent(file.bucket);
  const objectPath = encodeObjectPath(file.object_path);
  return `${root}/storage/v1/object/sign/${bucket}/${objectPath}`;
}

function normaliseSignedUrl(root: string, signedPath: unknown) {
  if (typeof signedPath !== 'string' || !signedPath.trim()) return null;
  const cleaned = signedPath.trim();
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  return `${root}${cleaned.startsWith('/') ? '' : '/'}${cleaned}`;
}

async function fetchFileMetadata(options: {
  endpoint: string;
  serviceRoleKey: string;
  fileId: string;
}) {
  const params = new URLSearchParams({
    select: adminFileColumns,
    id: `eq.${options.fileId}`,
    limit: '1',
  });
  return fetch(`${options.endpoint}?${params.toString()}`, {
    method: 'GET',
    headers: serviceHeaders(options.serviceRoleKey),
  });
}

async function createSignedDownload(options: {
  endpoint: string;
  serviceRoleKey: string;
  expiresInSeconds: number;
}) {
  return fetch(options.endpoint, {
    method: 'POST',
    headers: serviceHeaders(options.serviceRoleKey),
    body: JSON.stringify({ expiresIn: options.expiresInSeconds }),
  });
}

export async function createKitchenAdminFileSignedDownload(options: {
  fileId: string;
  expiresInSeconds?: number;
}): Promise<KitchenAdminSignedDownloadResult> {
  const config = getSupabaseConfig();
  if (!config) return { configured: false, ok: false, reason: 'missing_env' };

  const metadataResponse = await fetchFileMetadata({
    endpoint: config.metadataEndpoint,
    serviceRoleKey: config.serviceRoleKey,
    fileId: options.fileId,
  });

  if (!metadataResponse.ok) {
    await metadataResponse.text();
    return { configured: true, ok: false, status: metadataResponse.status, error: 'metadata_lookup_failed' };
  }

  const files = (await metadataResponse.json()) as KitchenAdminFileMetadata[];
  const file = files[0];
  if (!file) return { configured: true, ok: false, status: 404, error: 'file_not_found' };

  const expiresInSeconds = options.expiresInSeconds ?? defaultSignedUrlExpirySeconds;
  const signResponse = await createSignedDownload({
    endpoint: buildSignEndpoint(config.root, file),
    serviceRoleKey: config.serviceRoleKey,
    expiresInSeconds,
  });

  if (!signResponse.ok) {
    await signResponse.text();
    return { configured: true, ok: false, status: signResponse.status, error: 'signed_url_failed' };
  }

  const signedBody = (await signResponse.json()) as { signedURL?: unknown; signedUrl?: unknown };
  const downloadUrl = normaliseSignedUrl(config.root, signedBody.signedURL ?? signedBody.signedUrl);
  if (!downloadUrl) return { configured: true, ok: false, status: 502, error: 'signed_url_failed' };

  return {
    configured: true,
    ok: true,
    fileId: file.id,
    fileName: file.file_name,
    downloadUrl,
    expiresInSeconds,
  };
}

