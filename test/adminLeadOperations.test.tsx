import { render, screen } from '@testing-library/react';
import LeadsAdminPage from '../src/pages/admin/leads';
import { handler as listHandler } from '../netlify/functions/kitchen-admin-leads';
import { handler as updateHandler } from '../netlify/functions/kitchen-admin-lead-update';

const sampleLead = {
  id: '0993f583-2d91-4d4c-bf3f-afd71d4ebb30',
  created_at: '2026-05-31T10:00:00.000Z',
  name: 'Operon Test Lead',
  email: 'operon.test@example.com',
  phone: '0400000000',
  suburb: 'Mosman',
  property_type: 'apartment',
  project_stage: 'quoteInHand',
  has_current_quote: true,
  has_photos_or_plans: true,
  budget_range: 'Verification only',
  preferred_next_step: 'quoteReview',
  message: 'Please review my kitchen quote.',
  marketing_opt_in: false,
  source_route: '/request-review',
  status: 'new',
  internal_notes: null,
  user_agent: 'Jest',
  ip_hash: null,
};

describe('admin-lite lead functions', () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    process.env = { ...originalEnv };
    global.fetch = originalFetch;
    process.env.OPERON_KITCHENS_ADMIN_TOKEN = 'admin-token';
    process.env.OPERON_KITCHENS_SUPABASE_URL = 'https://kitchens.supabase.co';
    process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY = 'service-role-test-key';
    jest.restoreAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  it('rejects lead list requests without the admin token', async () => {
    const response = await listHandler({
      httpMethod: 'GET',
      body: null,
      headers: {},
      queryStringParameters: null,
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(401);
    expect(body.ok).toBe(false);
    expect(JSON.stringify(body)).not.toContain('Operon Test Lead');
  });

  it('returns leads with a valid admin token', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => [sampleLead],
      text: async () => '',
    }));
    global.fetch = fetchMock as typeof fetch;

    const response = await listHandler({
      httpMethod: 'GET',
      body: null,
      headers: { 'x-operon-admin-token': 'admin-token' },
      queryStringParameters: { status: 'new', limit: '10' },
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.leads).toEqual([sampleLead]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/rest/v1/kitchen_request_reviews?'),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(JSON.stringify(body)).not.toContain('service-role-test-key');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('leadscore');
  });

  it('rejects lead updates without the admin token', async () => {
    const response = await updateHandler({
      httpMethod: 'POST',
      headers: {},
      body: JSON.stringify({ id: sampleLead.id, status: 'contacted' }),
    });

    expect(response.statusCode).toBe(401);
  });

  it('validates allowed status values', async () => {
    const response = await updateHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ id: sampleLead.id, status: 'needs_money' }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(body.error).toContain('Unsupported lead status');
  });

  it('allows status and internal notes updates only', async () => {
    const fetchMock = jest.fn(async () => ({
      ok: true,
      json: async () => [{ ...sampleLead, status: 'contacted', internal_notes: 'Called once.' }],
      text: async () => '',
    }));
    global.fetch = fetchMock as typeof fetch;

    const response = await updateHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({
        id: sampleLead.id,
        status: 'contacted',
        internal_notes: 'Called once.',
      }),
    });
    const body = JSON.parse(response.body);
    const payload = JSON.parse(String(fetchMock.mock.calls[0][1]?.body));

    expect(response.statusCode).toBe(200);
    expect(body.ok).toBe(true);
    expect(payload).toEqual({ status: 'contacted', internal_notes: 'Called once.' });
  });

  it('rejects unsafe admin update fields', async () => {
    const response = await updateHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({
        id: sampleLead.id,
        status: 'contacted',
        leadScore: 'hot',
        margin: 0.25,
      }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(body.error).toContain('Unsupported lead update fields');
  });
});

describe('admin-lite leads page', () => {
  it('renders the token-gated admin page without exposing service keys', () => {
    render(<LeadsAdminPage />);

    expect(screen.getByRole('heading', { name: 'Kitchen request-review leads' })).toBeInTheDocument();
    expect(screen.getByLabelText('Admin token')).toHaveAttribute('type', 'password');
    expect(screen.getByRole('button', { name: 'Fetch leads' })).toBeDisabled();
    expect(screen.getByText(/No lead data is loaded without a valid token/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY');
  });
});
