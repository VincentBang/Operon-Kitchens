import { KitchenRequestReviewFile, KitchenRequestReviewLead } from './requestReview';

export interface KitchenRequestReviewFileRecord {
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

export type KitchenFileStorageResult =
  | { configured: false; stored: false; reason: 'missing_env'; fileCount: number }
  | { configured: true; stored: true; fileCount: number; files: KitchenRequestReviewFileRecord[] }
  | { configured: true; stored: false; fileCount: number; error: string };

function getSupabaseConfig() {
  const supabaseUrl = process.env.OPERON_KITCHENS_SUPABASE_URL;
  const serviceRoleKey = process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.OPERON_KITCHENS_UPLOAD_BUCKET;

  if (!supabaseUrl || !serviceRoleKey || !bucket) return null;

  const root = supabaseUrl.replace(/\/$/, '');
  return {
    storageRoot: `${root}/storage/v1/object/${encodeURIComponent(bucket)}`,
    metadataEndpoint: `${root}/rest/v1/kitchen_request_review_files`,
    serviceRoleKey,
    bucket,
  };
}

function serviceHeaders(serviceRoleKey: string, contentType = 'application/json') {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': contentType,
  };
}

function safePathSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'file';
}

function buildObjectPath(lead: KitchenRequestReviewLead, file: KitchenRequestReviewFile) {
  const day = lead.createdAt.slice(0, 10);
  return `request-reviews/${day}/${lead.id}/${file.id}-${safePathSegment(file.name)}`;
}

function decodeBase64(contentBase64: string) {
  return Buffer.from(contentBase64, 'base64');
}

async function uploadFileObject(options: {
  storageRoot: string;
  serviceRoleKey: string;
  file: KitchenRequestReviewFile;
  objectPath: string;
}) {
  return fetch(`${options.storageRoot}/${options.objectPath}`, {
    method: 'POST',
    headers: {
      ...serviceHeaders(options.serviceRoleKey, options.file.mimeType),
      'x-upsert': 'false',
      'Cache-Control': '3600',
    },
    body: decodeBase64(options.file.contentBase64),
  });
}

async function insertFileMetadata(options: {
  metadataEndpoint: string;
  serviceRoleKey: string;
  records: KitchenRequestReviewFileRecord[];
}) {
  return fetch(options.metadataEndpoint, {
    method: 'POST',
    headers: {
      ...serviceHeaders(options.serviceRoleKey),
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(options.records),
  });
}

export async function storeKitchenRequestReviewFiles(
  lead: KitchenRequestReviewLead,
): Promise<KitchenFileStorageResult> {
  if (lead.files.length === 0) {
    return { configured: true, stored: true, fileCount: 0, files: [] };
  }

  const config = getSupabaseConfig();
  if (!config) {
    return { configured: false, stored: false, reason: 'missing_env', fileCount: lead.files.length };
  }

  const records: KitchenRequestReviewFileRecord[] = [];

  for (const file of lead.files) {
    const objectPath = buildObjectPath(lead, file);
    const uploadResponse = await uploadFileObject({
      storageRoot: config.storageRoot,
      serviceRoleKey: config.serviceRoleKey,
      file,
      objectPath,
    });

    if (!uploadResponse.ok) {
      const detail = await uploadResponse.text();
      return {
        configured: true,
        stored: false,
        fileCount: lead.files.length,
        error: `Supabase file upload failed with ${uploadResponse.status}: ${detail.slice(0, 180)}`,
      };
    }

    records.push({
      id: file.id,
      lead_id: lead.id,
      created_at: lead.createdAt,
      bucket: config.bucket,
      object_path: objectPath,
      file_name: file.name,
      file_type: file.mimeType,
      file_size: file.size,
      category: file.category,
    });
  }

  const metadataResponse = await insertFileMetadata({
    metadataEndpoint: config.metadataEndpoint,
    serviceRoleKey: config.serviceRoleKey,
    records,
  });

  if (!metadataResponse.ok) {
    const detail = await metadataResponse.text();
    return {
      configured: true,
      stored: false,
      fileCount: lead.files.length,
      error: `Supabase file metadata insert failed with ${metadataResponse.status}: ${detail.slice(0, 180)}`,
    };
  }

  return { configured: true, stored: true, fileCount: lead.files.length, files: records };
}
