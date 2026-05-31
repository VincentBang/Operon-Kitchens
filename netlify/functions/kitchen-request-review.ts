import {
  createCustomerRequestAcknowledgement,
  KitchenRequestReviewLead,
  validateKitchenRequestReview,
} from '../../src/lib/requestReview';
import { createHash } from 'node:crypto';
import { storeKitchenRequestReviewLead } from '../../src/lib/kitchenLeadStorage';

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

async function notifyByResend(lead: KitchenRequestReviewLead) {
  const apiKey = process.env.OPERON_KITCHENS_RESEND_API_KEY;
  const to = process.env.OPERON_KITCHENS_REQUEST_REVIEW_TO_EMAIL;
  const from = process.env.OPERON_KITCHENS_REQUEST_REVIEW_FROM_EMAIL || 'Operon Kitchens <onboarding@resend.dev>';
  if (!apiKey || !to) return false;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject: `Operon Kitchens request review: ${lead.name}`,
      text: [
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
        `Source route: ${lead.sourceRoute}`,
        '',
        'Message:',
        lead.message,
      ].join('\n'),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.warn('operon_kitchens_request_review_email_failed', { status: response.status, detail: detail.slice(0, 240) });
    return false;
  }

  return true;
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

  if (!storage.configured) {
    console.warn('operon_kitchens_request_review_storage_not_configured', {
      message: 'Missing Supabase storage environment variables.',
    });
  } else if (!storage.stored) {
    console.warn('operon_kitchens_request_review_storage_failed', { error: storage.error });
  }

  let notificationPrepared = false;
  try {
    notificationPrepared = await notifyByResend(lead);
  } catch (error) {
    console.warn('operon_kitchens_request_review_notification_error', {
      message: error instanceof Error ? error.message : 'Unknown notification error',
    });
  }

  if (!storage.stored && !notificationPrepared) {
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
      notificationPrepared,
    },
  });
}
