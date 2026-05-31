import {
  createCustomerRequestAcknowledgement,
  KitchenRequestReviewLead,
  validateKitchenRequestReview,
} from '../../src/lib/requestReview';
import { createHash } from 'node:crypto';
import { storeKitchenRequestReviewLead } from '../../src/lib/kitchenLeadStorage';
import { storeKitchenRequestReviewFiles } from '../../src/lib/kitchenFileStorage';

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

function safeLogLead(lead: KitchenRequestReviewLead) {
  console.info('operon_kitchens_request_review', {
    id: lead.id,
    createdAt: lead.createdAt,
    sourceRoute: lead.sourceRoute,
    suburb: lead.suburb,
    propertyType: lead.propertyType,
    projectStage: lead.projectStage,
    hasCurrentQuote: lead.hasCurrentQuote,
    hasPhotosPlans: lead.hasPhotosPlans,
    preferredNextStep: lead.preferredNextStep,
    marketingOptIn: lead.marketingOptIn,
  });
}

function getHeader(headers: NetlifyEvent['headers'], key: string) {
  if (!headers) return undefined;
  const lowerKey = key.toLowerCase();
  const matchedKey = Object.keys(headers).find((header) => header.toLowerCase() === lowerKey);
  return matchedKey ? headers[matchedKey] : undefined;
}

function getIpHash(event: NetlifyEvent) {
  const salt = process.env.OPERON_KITCHENS_IP_HASH_SALT;
  if (!salt) return undefined;
  const forwardedFor = getHeader(event.headers, 'x-forwarded-for');
  const netlifyIp = getHeader(event.headers, 'x-nf-client-connection-ip');
  const rawIp = (netlifyIp || forwardedFor?.split(',')[0] || '').trim();
  if (!rawIp) return undefined;
  return createHash('sha256').update(`${salt}:${rawIp}`).digest('hex');
}

function buildRequestReviewEmailText(lead: KitchenRequestReviewLead) {
  return [
    'New Operon Kitchens request-review lead',
    '',
    `Request ID: ${lead.id}`,
    `Created: ${lead.createdAt}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone || 'not supplied'}`,
    `Suburb: ${lead.suburb || 'not supplied'}`,
    `Property type: ${lead.propertyType}`,
    `Project stage: ${lead.projectStage}`,
    `Has current quote: ${lead.hasCurrentQuote}`,
    `Has photos/plans: ${lead.hasPhotosPlans}`,
    `Approximate budget range: ${lead.approximateBudgetRange || 'not supplied'}`,
    `Preferred next step: ${lead.preferredNextStep}`,
    `Marketing opt-in: ${lead.marketingOptIn ? 'yes' : 'no'}`,
    `Source route: ${lead.sourceRoute}`,
    `Landing page: ${lead.attribution.landingPage || 'not supplied'}`,
    `Referrer: ${lead.attribution.referrer || 'not supplied'}`,
    `UTM source: ${lead.attribution.utmSource || 'not supplied'}`,
    `UTM medium: ${lead.attribution.utmMedium || 'not supplied'}`,
    `UTM campaign: ${lead.attribution.utmCampaign || 'not supplied'}`,
    `Uploaded files: ${lead.files.length ? lead.files.map((file) => `${file.category}: ${file.name}`).join('; ') : 'none supplied'}`,
    '',
    'Message:',
    lead.message,
    '',
    'Next step:',
    'Open /admin/leads, fetch leads with the admin token, then update status and internal notes after follow-up.',
    '',
    'Reminder:',
    'Supabase is the source of truth. This email is a notification only and does not include uploaded files or final quote approval.',
  ].join('\n');
}

function getFileDeliveryStatus(fileStorage: {
  fileCount: number;
  configured: boolean;
  stored: boolean;
  stage?: string;
}) {
  if (fileStorage.fileCount === 0) return 'not_supplied';
  if (!fileStorage.configured) return 'not_configured';
  if (fileStorage.stored) return 'stored';
  return fileStorage.stage || 'not_stored';
}

async function notifyByResend(lead: KitchenRequestReviewLead) {
  const apiKey = process.env.OPERON_KITCHENS_RESEND_API_KEY;
  const to = process.env.OPERON_KITCHENS_REQUEST_REVIEW_TO_EMAIL;
  const from = process.env.OPERON_KITCHENS_REQUEST_REVIEW_FROM_EMAIL || 'Operon Kitchens <onboarding@resend.dev>';
  if (!apiKey || !to) return { configured: false, sent: false as const, reason: 'email_env_missing' as const };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: 'New Operon Kitchens request-review lead',
      text: buildRequestReviewEmailText(lead),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    return {
      configured: true,
      sent: false as const,
      reason: 'email_send_failed' as const,
      status: response.status,
      detail: detail.slice(0, 240),
    };
  }

  return { configured: true, sent: true as const };
}

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed.' });
  }

  const validation = validateKitchenRequestReview(parseBody(event.body));
  if (!validation.ok) {
    return json(validation.status, { ok: false, errors: validation.errors });
  }

  const lead = validation.data;
  safeLogLead(lead);

  const storage = await storeKitchenRequestReviewLead(lead, {
    userAgent: getHeader(event.headers, 'user-agent'),
    ipHash: getIpHash(event),
  });
  const fileStorage = storage.stored
    ? await storeKitchenRequestReviewFiles(lead)
    : { configured: false as const, stored: false as const, reason: 'lead_not_stored' as const, fileCount: lead.files.length };

  if (!storage.configured) {
    console.warn('operon_kitchens_request_review_storage_env_missing', {
      category: 'storage_env_missing',
      message: 'Missing Supabase storage environment variables.',
    });
  } else if (!storage.stored) {
    console.warn('operon_kitchens_request_review_storage_insert_failed', {
      category: 'storage_insert_failed',
      error: storage.error,
    });
  }

  if (lead.files.length > 0) {
    if (!fileStorage.configured) {
      console.warn('operon_kitchens_request_review_file_storage_env_missing', {
        category: 'file_storage_env_missing',
        fileCount: lead.files.length,
      });
    } else if (!fileStorage.stored) {
      console.warn('operon_kitchens_request_review_file_storage_failed', {
        category: 'file_storage_failed',
        stage: fileStorage.stage,
        status: fileStorage.status,
        safeError: fileStorage.safeError,
      });
    }
  }

  let notificationPrepared = false;
  try {
    const email = await notifyByResend(lead);
    notificationPrepared = email.sent;
    if (!email.configured) {
      console.warn('operon_kitchens_request_review_email_env_missing', {
        category: 'email_env_missing',
        message: 'Missing Resend notification environment variables.',
      });
    } else if (!email.sent) {
      console.warn('operon_kitchens_request_review_email_send_failed', {
        category: 'email_send_failed',
        status: email.status,
        detail: email.detail,
      });
    }
  } catch (error) {
    console.warn('operon_kitchens_request_review_notification_error', {
      category: 'email_send_failed',
      message: error instanceof Error ? error.message : 'Unknown notification error',
    });
  }

  if (!storage.stored && !notificationPrepared) {
    console.warn('operon_kitchens_request_review_no_durable_path_available', {
      category: 'no_durable_path_available',
      storageConfigured: storage.configured,
      storageStored: storage.stored,
      notificationPrepared,
    });
    return json(503, {
      ok: false,
      error: 'Request intake is temporarily unavailable. Please try again later or use the estimate and quote review pathways to prepare your details.',
    });
  }

  return json(202, {
    ok: true,
    request: createCustomerRequestAcknowledgement(lead),
    delivery: {
      stored: storage.stored,
      filesStored: fileStorage.stored,
      fileDeliveryStatus: getFileDeliveryStatus(fileStorage),
      fileCount: lead.files.length,
      notificationPrepared,
    },
  });
}
