import { handler } from '../netlify/functions/kitchen-request-review';
import { createKitchenRequestReviewStorageRecord, storeKitchenRequestReviewLead } from '../src/lib/kitchenLeadStorage';
import { validateKitchenRequestReview } from '../src/lib/requestReview';

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
    expect(body.delivery).toEqual({ stored: true, notificationPrepared: false });
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
    expect(body.delivery).toEqual({ stored: false, notificationPrepared: true });
    expect(fetchMock).toHaveBeenCalledWith('https://api.resend.com/emails', expect.objectContaining({ method: 'POST' }));
  });

  it('does not fake success when storage and email are both unavailable', async () => {
    const response = await handler({
      httpMethod: 'POST',
      body: JSON.stringify(validPayload),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(503);
    expect(body.ok).toBe(false);
    expect(body.error).toContain('temporarily unavailable');
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
});
