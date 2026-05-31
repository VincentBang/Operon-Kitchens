import { handler } from '../netlify/functions/kitchen-request-review';
import { storeKitchenRequestReviewFiles } from '../src/lib/kitchenFileStorage';
import { createKitchenRequestReviewStorageRecord, storeKitchenRequestReviewLead } from '../src/lib/kitchenLeadStorage';
import { validateKitchenRequestReview } from '../src/lib/requestReview';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const validPayload = {
  name: 'Vincent',
  email: 'vincent@example.com',
  phone: '0400000000',
  suburb: 'Mosman',
  propertyType: 'house',
  projectStage: 'quoteInHand',
  hasCurrentQuote: 'yes',
  hasPhotosPlans: 'yes',
  approximateBudgetRange: '$40k-$60k',
  preferredNextStep: 'quoteReview',
  message: 'Please review my kitchen quote scope and allowance wording.',
  privacyAcknowledged: true,
  termsAcknowledged: true,
  marketingOptIn: false,
  sourceRoute: '/request-review',
};

const validFilePayload = {
  name: 'kitchen-quote.pdf',
  category: 'existingQuote',
  mimeType: 'application/pdf',
  size: 11,
  contentBase64: Buffer.from('hello quote').toString('base64'),
};

describe('request review intake validation', () => {
  it('accepts a customer-safe request review payload', () => {
    const result = validateKitchenRequestReview(validPayload);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected valid payload');
    expect(result.data).toEqual(expect.objectContaining({
      name: 'Vincent',
      email: 'vincent@example.com',
      propertyType: 'house',
      projectStage: 'quoteInHand',
      hasCurrentQuote: 'yes',
      hasPhotosPlans: 'yes',
      preferredNextStep: 'quoteReview',
      privacyAcknowledged: true,
      termsAcknowledged: true,
      sourceRoute: '/request-review',
    }));
    expect(result.data.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(result.data.createdAt).toEqual(expect.any(String));
  });

  it('accepts and sanitises customer-safe attribution fields', () => {
    const result = validateKitchenRequestReview({
      ...validPayload,
      referrer: 'https://google.com/search?q=kitchen quote',
      utm_source: `${'newsletter '.repeat(30)}extra`,
      utm_medium: 'email',
      utm_campaign: 'winter-kitchens',
      utm_content: 'hero-cta',
      utm_term: 'kitchen quote sydney',
      landing_page: `${'https://operonkitchens.netlify.app/request-review?'.padEnd(520, 'a')}`,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected valid payload');
    expect(result.data.attribution.referrer).toContain('google.com');
    expect(result.data.attribution.utmSource).toHaveLength(120);
    expect(result.data.attribution.utmMedium).toBe('email');
    expect(result.data.attribution.utmCampaign).toBe('winter-kitchens');
    expect(result.data.attribution.utmContent).toBe('hero-cta');
    expect(result.data.attribution.utmTerm).toBe('kitchen quote sydney');
    expect(result.data.attribution.landingPage).toHaveLength(500);
  });

  it('works without attribution fields', () => {
    const result = validateKitchenRequestReview(validPayload);

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected valid payload');
    expect(result.data.attribution).toEqual({
      referrer: undefined,
      utmSource: undefined,
      utmMedium: undefined,
      utmCampaign: undefined,
      utmContent: undefined,
      utmTerm: undefined,
      landingPage: undefined,
    });
  });

  it('accepts and sanitises safe upload file payloads', () => {
    const result = validateKitchenRequestReview({
      ...validPayload,
      files: [validFilePayload],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected valid payload');
    expect(result.data.files).toHaveLength(1);
    expect(result.data.files[0]).toEqual(expect.objectContaining({
      name: 'kitchen-quote.pdf',
      category: 'existingQuote',
      mimeType: 'application/pdf',
      size: 11,
      contentBase64: validFilePayload.contentBase64,
    }));
    expect(result.data.files[0].id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('rejects unsafe upload file payloads', () => {
    const result = validateKitchenRequestReview({
      ...validPayload,
      files: [{
        name: 'script.svg',
        category: 'other',
        mimeType: 'image/svg+xml',
        size: 13,
        contentBase64: Buffer.from('<svg></svg>').toString('base64'),
      }],
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('Expected invalid payload');
    expect(result.errors).toContain('Uploaded files must be PDF or common image files.');
  });

  it('rejects missing required fields and invalid email', () => {
    const result = validateKitchenRequestReview({
      ...validPayload,
      name: '',
      email: 'not-an-email',
      privacyAcknowledged: false,
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('Expected invalid payload');
    expect(result.errors).toEqual(expect.arrayContaining([
      'Name is required.',
      'A valid email is required.',
      'Privacy acknowledgement is required.',
    ]));
  });

  it('rejects spam-like and internal fields', () => {
    const result = validateKitchenRequestReview({
      ...validPayload,
      margin: 0.25,
      leadScore: 'hot',
      message: 'https://one.test https://two.test https://three.test https://four.test',
    });

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('Expected unsafe payload');
    expect(result.errors).toEqual(expect.arrayContaining([
      'Submission includes unsupported internal fields.',
    ]));
  });
});

describe('kitchen-request-review Netlify function', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
    delete process.env.OPERON_KITCHENS_SUPABASE_URL;
    delete process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.OPERON_KITCHENS_RESEND_API_KEY;
    delete process.env.OPERON_KITCHENS_REQUEST_REVIEW_TO_EMAIL;
    delete process.env.OPERON_KITCHENS_IP_HASH_SALT;
    delete process.env.OPERON_KITCHENS_UPLOAD_BUCKET;
    jest.restoreAllMocks();
    jest.spyOn(console, 'info').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it('stores through Supabase when storage env vars are configured', async () => {
    process.env.OPERON_KITCHENS_SUPABASE_URL = 'https://kitchens.supabase.co';
    process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
    const fetchMock = jest.fn(async () => ({ ok: true, text: async () => '' }));
    global.fetch = fetchMock as typeof fetch;

    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify(validPayload),
      headers: {
        'user-agent': 'Jest browser',
      },
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(202);
    expect(body.ok).toBe(true);
    expect(body.request.requestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(body.delivery).toEqual(expect.objectContaining({ stored: true, filesStored: true, fileCount: 0, notificationPrepared: false }));
    expect(fetchMock).toHaveBeenCalledWith(
      'https://kitchens.supabase.co/rest/v1/kitchen_request_reviews',
      expect.objectContaining({ method: 'POST' }),
    );
    const bodySent = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(bodySent).toEqual(expect.objectContaining({
      status: 'new',
      internal_notes: null,
      has_current_quote: true,
      has_photos_or_plans: true,
      user_agent: 'Jest browser',
    }));
    expect(JSON.stringify(body).toLowerCase()).not.toContain('margin');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('leadscore');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('service-role-test-key');
  });

  it('uses email as fallback when storage env vars are missing', async () => {
    process.env.OPERON_KITCHENS_RESEND_API_KEY = 'resend-test-key';
    process.env.OPERON_KITCHENS_REQUEST_REVIEW_TO_EMAIL = 'ops@example.com';
    const fetchMock = jest.fn(async () => ({ ok: true, text: async () => '' }));
    global.fetch = fetchMock as typeof fetch;

    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify(validPayload),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(202);
    expect(body.delivery).toEqual(expect.objectContaining({ stored: false, filesStored: false, fileCount: 0, notificationPrepared: true }));
    expect(fetchMock).toHaveBeenCalledWith('https://api.resend.com/emails', expect.objectContaining({ method: 'POST' }));
    const resendPayload = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(resendPayload.subject).toBe('New Operon Kitchens request-review lead');
    expect(resendPayload.text).toContain('Request ID:');
    expect(resendPayload.text).toContain('Name: Vincent');
    expect(resendPayload.text).toContain('Email: vincent@example.com');
    expect(resendPayload.text).toContain('Phone: 0400000000');
    expect(resendPayload.text).toContain('Suburb: Mosman');
    expect(resendPayload.text).toContain('Property type: house');
    expect(resendPayload.text).toContain('Project stage: quoteInHand');
    expect(resendPayload.text).toContain('Has current quote: yes');
    expect(resendPayload.text).toContain('Has photos/plans: yes');
    expect(resendPayload.text).toContain('Approximate budget range: $40k-$60k');
    expect(resendPayload.text).toContain('Preferred next step: quoteReview');
    expect(resendPayload.text).toContain('Marketing opt-in: no');
    expect(resendPayload.text).toContain('Open /admin/leads');
    expect(resendPayload.text).toContain('Supabase is the source of truth');
    expect(resendPayload.text).not.toContain('supplier cost');
    expect(resendPayload.text).not.toContain('margin');
    expect(resendPayload.text).not.toContain('lead score');
    expect(resendPayload.text).not.toContain('admin priority');
  });

  it('stores successfully when email is missing and does not expose notification internals', async () => {
    process.env.OPERON_KITCHENS_SUPABASE_URL = 'https://kitchens.supabase.co';
    process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
    const fetchMock = jest.fn(async () => ({ ok: true, text: async () => '' }));
    global.fetch = fetchMock as typeof fetch;

    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify(validPayload),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(202);
    expect(body.delivery).toEqual(expect.objectContaining({ stored: true, filesStored: true, fileCount: 0, notificationPrepared: false }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(body).toLowerCase()).not.toContain('resend');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('service-role-test-key');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('internalrate');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('suppliercost');
  });

  it('does not fake success when storage and email are both unavailable', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify(validPayload),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(503);
    expect(body.ok).toBe(false);
    expect(body.error).toContain('temporarily unavailable');
    expect(warnSpy).toHaveBeenCalledWith(
      'operon_kitchens_request_review_storage_env_missing',
      expect.objectContaining({ category: 'storage_env_missing' }),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      'operon_kitchens_request_review_email_env_missing',
      expect.objectContaining({ category: 'email_env_missing' }),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      'operon_kitchens_request_review_no_durable_path_available',
      expect.objectContaining({ category: 'no_durable_path_available' }),
    );
  });

  it('logs safe diagnostic categories when Supabase insert fails', async () => {
    process.env.OPERON_KITCHENS_SUPABASE_URL = 'https://kitchens.supabase.co';
    process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    global.fetch = jest.fn(async () => ({
      ok: false,
      status: 404,
      text: async () => '{"message":"relation public.kitchen_request_reviews does not exist"}',
    })) as typeof fetch;

    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify(validPayload),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(503);
    expect(body.ok).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      'operon_kitchens_request_review_storage_insert_failed',
      expect.objectContaining({
        category: 'storage_insert_failed',
        error: expect.stringContaining('Supabase insert failed with 404'),
      }),
    );
    expect(JSON.stringify(warnSpy.mock.calls).toLowerCase()).not.toContain('service-role-test-key');
  });

  it('returns validation errors as safe JSON', async () => {
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ ...validPayload, message: '', termsAcknowledged: false }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errors).toEqual(expect.arrayContaining([
      'Message must include at least 10 characters.',
      'Terms acknowledgement is required.',
    ]));
  });

  it('stores lead files when upload storage env vars are configured', async () => {
    process.env.OPERON_KITCHENS_SUPABASE_URL = 'https://kitchens.supabase.co';
    process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
    process.env.OPERON_KITCHENS_UPLOAD_BUCKET = 'operon-kitchens-request-review-files';
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, text: async () => '' })
      .mockResolvedValueOnce({ ok: true, text: async () => '' })
      .mockResolvedValueOnce({ ok: true, text: async () => '' });
    global.fetch = fetchMock as typeof fetch;

    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify({ ...validPayload, files: [validFilePayload] }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(202);
    expect(body.delivery).toEqual(expect.objectContaining({
      stored: true,
      filesStored: true,
      fileCount: 1,
      notificationPrepared: false,
    }));
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/storage/v1/object/operon-kitchens-request-review-files/request-reviews/'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer service-role-test-key',
          'Content-Type': 'application/pdf',
          'x-upsert': 'false',
        }),
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      'https://kitchens.supabase.co/rest/v1/kitchen_request_review_files',
      expect.objectContaining({ method: 'POST' }),
    );
    const metadataBody = JSON.parse(String(fetchMock.mock.calls[2][1]?.body));
    expect(metadataBody[0]).toEqual(expect.objectContaining({
      bucket: 'operon-kitchens-request-review-files',
      file_name: 'kitchen-quote.pdf',
      file_type: 'application/pdf',
      file_size: 11,
      category: 'existingQuote',
    }));
    expect(JSON.stringify(body).toLowerCase()).not.toContain('service-role-test-key');
  });
});

describe('kitchen request review storage adapter', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
    delete process.env.OPERON_KITCHENS_SUPABASE_URL;
    delete process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it('creates a kitchen-namespaced storage record from a validated lead', () => {
    const validation = validateKitchenRequestReview(validPayload);
    expect(validation.ok).toBe(true);
    if (!validation.ok) throw new Error('Expected valid payload');

    const record = createKitchenRequestReviewStorageRecord(validation.data, {
      userAgent: 'Unit test',
      ipHash: 'hashed-ip',
    });

    expect(record).toEqual(expect.objectContaining({
      id: validation.data.id,
      name: 'Vincent',
      email: 'vincent@example.com',
      property_type: 'house',
      project_stage: 'quoteInHand',
      has_current_quote: true,
      has_photos_or_plans: true,
      budget_range: '$40k-$60k',
      preferred_next_step: 'quoteReview',
      status: 'new',
      internal_notes: null,
      referrer: null,
      utm_source: null,
      landing_page: null,
      user_agent: 'Unit test',
      ip_hash: 'hashed-ip',
    }));
    expect(JSON.stringify(record).toLowerCase()).not.toContain('leadscore');
  });

  it('reports missing storage configuration without throwing', async () => {
    const validation = validateKitchenRequestReview(validPayload);
    if (!validation.ok) throw new Error('Expected valid payload');

    await expect(storeKitchenRequestReviewLead(validation.data)).resolves.toEqual({
      configured: false,
      stored: false,
      reason: 'missing_env',
    });
  });

  it('posts only the server-created storage record to Supabase', async () => {
    const validation = validateKitchenRequestReview(validPayload);
    if (!validation.ok) throw new Error('Expected valid payload');
    process.env.OPERON_KITCHENS_SUPABASE_URL = 'https://kitchens.supabase.co/';
    process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
    const fetchMock = jest.fn(async () => ({ ok: true, text: async () => '' }));
    global.fetch = fetchMock as typeof fetch;

    await expect(storeKitchenRequestReviewLead(validation.data)).resolves.toEqual({
      configured: true,
      stored: true,
      id: validation.data.id,
    });
    const record = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    expect(record.status).toBe('new');
    expect(record.internal_notes).toBeNull();
    expect(record).not.toHaveProperty('leadScore');
    expect(record).not.toHaveProperty('adminPriority');
  });

  it('falls back to legacy storage columns if attribution migration has not been applied yet', async () => {
    const validation = validateKitchenRequestReview({
      ...validPayload,
      utm_source: 'google',
      landing_page: 'https://operonkitchens.netlify.app/request-review?utm_source=google',
    });
    if (!validation.ok) throw new Error('Expected valid payload');
    process.env.OPERON_KITCHENS_SUPABASE_URL = 'https://kitchens.supabase.co/';
    process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'PGRST204 Could not find the utm_source column of kitchen_request_reviews',
      })
      .mockResolvedValueOnce({ ok: true, text: async () => '' });
    global.fetch = fetchMock as typeof fetch;

    await expect(storeKitchenRequestReviewLead(validation.data)).resolves.toEqual({
      configured: true,
      stored: true,
      id: validation.data.id,
    });
    const firstRecord = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));
    const fallbackRecord = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));
    expect(firstRecord).toHaveProperty('utm_source', 'google');
    expect(fallbackRecord).not.toHaveProperty('utm_source');
    expect(fallbackRecord).not.toHaveProperty('landing_page');
    expect(fallbackRecord.status).toBe('new');
  });

  it('keeps the documented Supabase SQL aligned with the storage record mapping', () => {
    const validation = validateKitchenRequestReview(validPayload);
    if (!validation.ok) throw new Error('Expected valid payload');
    const record = createKitchenRequestReviewStorageRecord(validation.data);
    const documentedSql = readFileSync(
      join(process.cwd(), 'docs', 'supabase-kitchen-request-reviews.md'),
      'utf8',
    );

    expect(documentedSql).toContain('create table if not exists public.kitchen_request_reviews');
    for (const column of Object.keys(record)) {
      expect(documentedSql).toContain(column);
    }
    expect(documentedSql).toContain("property_type text not null check (property_type in ('house', 'townhouse', 'apartment', 'strataApartment', 'notSure'))");
    expect(documentedSql).toContain("project_stage text not null check (project_stage in ('planning', 'quoteInHand', 'readyForMeasure', 'urgent', 'notSure'))");
    expect(documentedSql).toContain("preferred_next_step text not null check (preferred_next_step in ('planningEstimate', 'quoteReview', 'siteMeasure', 'scopeDiscussion'))");
    expect(documentedSql).toContain("'site_measure_booked'");
    expect(documentedSql).toContain('utm_source text');
    expect(documentedSql).toContain('landing_page text');
  });
});

describe('kitchen request review file storage adapter', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
    delete process.env.OPERON_KITCHENS_SUPABASE_URL;
    delete process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.OPERON_KITCHENS_UPLOAD_BUCKET;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it('reports missing upload storage configuration when files are present', async () => {
    const validation = validateKitchenRequestReview({ ...validPayload, files: [validFilePayload] });
    if (!validation.ok) throw new Error('Expected valid payload');

    await expect(storeKitchenRequestReviewFiles(validation.data)).resolves.toEqual({
      configured: false,
      stored: false,
      reason: 'missing_env',
      fileCount: 1,
    });
  });

  it('does not require upload storage when no files are present', async () => {
    const validation = validateKitchenRequestReview(validPayload);
    if (!validation.ok) throw new Error('Expected valid payload');

    await expect(storeKitchenRequestReviewFiles(validation.data)).resolves.toEqual({
      configured: true,
      stored: true,
      fileCount: 0,
      files: [],
    });
  });
});
