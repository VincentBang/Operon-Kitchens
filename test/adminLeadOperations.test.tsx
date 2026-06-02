import { fireEvent, render, screen } from '@testing-library/react';
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
  referrer: 'https://example.com/planning-guide',
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'controlled_launch',
  utm_content: 'hero',
  utm_term: 'kitchen_quote',
  landing_page: 'https://operonkitchens.netlify.app/request-review?utm_source=google',
  status: 'new',
  internal_notes: null,
  user_agent: 'Jest',
  ip_hash: null,
  files: [],
};

const uploadBucketName = ['operon', 'kitchens', 'request', 'review', 'files'].join('-');

const sampleLeadFile = {
  id: '1993f583-2d91-4d4c-bf3f-afd71d4ebb30',
  lead_id: sampleLead.id,
  created_at: '2026-05-31T10:01:00.000Z',
  bucket: uploadBucketName,
  object_path: `request-reviews/2026-05-31/${sampleLead.id}/kitchen-quote.pdf`,
  file_name: 'kitchen-quote.pdf',
  file_type: 'application/pdf',
  file_size: 2048,
  category: 'existingQuote',
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
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ ...sampleLead, files: undefined }],
        text: async () => '',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [sampleLeadFile],
        text: async () => '',
      });
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
    expect(body.leads).toEqual([{ ...sampleLead, files: [sampleLeadFile] }]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/rest/v1/kitchen_request_reviews?'),
      expect.objectContaining({ method: 'GET' }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/rest/v1/kitchen_request_review_files?'),
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
    expect(screen.getByText(/check this page daily during controlled testing/i)).toBeInTheDocument();
    expect(screen.getByText('Daily check')).toBeInTheDocument();
    expect(screen.getByText('Update status')).toBeInTheDocument();
    expect(screen.getByText('Notes style')).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY');
  });

  it('renders attribution fields when a lead is loaded without exposing secrets', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ ok: true, leads: [{ ...sampleLead, files: [sampleLeadFile] }] }),
    })) as typeof fetch;

    render(<LeadsAdminPage />);
    fireEvent.change(screen.getByLabelText('Admin token'), { target: { value: 'admin-token' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch leads' }));

    expect(await screen.findByText(/1 lead loaded/i)).toBeInTheDocument();
    expect(screen.getByText(/Source: google/i)).toBeInTheDocument();
    expect(screen.getByText(/1 uploaded file/i)).toBeInTheDocument();
    expect(screen.getByText('kitchen-quote.pdf')).toBeInTheDocument();
    expect(screen.getAllByText('Apartment').length).toBeGreaterThan(0);
    expect(screen.getAllByText('I have a quote').length).toBeGreaterThan(0);
    expect(screen.getByText('Quote review')).toBeInTheDocument();
    expect(screen.getByText('Lead source')).toBeInTheDocument();
    expect(screen.getByText('/request-review')).toBeInTheDocument();
    expect(screen.getByText('google / cpc / controlled_launch')).toBeInTheDocument();
    expect(screen.getByText(/Suggested handling/i)).toBeInTheDocument();
    expect(screen.getByText(/Files are private. Download links are generated on demand and expire shortly/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(screen.getByText('hero')).toBeInTheDocument();
    expect(screen.getByText('kitchen_quote')).toBeInTheDocument();
    expect(document.body.textContent).not.toContain('service-role-test-key');
  });

  it('creates a signed download link for a selected file without exposing secrets', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true, leads: [{ ...sampleLead, files: [sampleLeadFile] }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ok: true,
          fileId: sampleLeadFile.id,
          fileName: sampleLeadFile.file_name,
          downloadUrl: 'https://kitchens.supabase.co/storage/v1/object/sign/private-file?token=safe',
          expiresInSeconds: 600,
        }),
      });
    global.fetch = fetchMock as typeof fetch;

    render(<LeadsAdminPage />);
    fireEvent.change(screen.getByLabelText('Admin token'), { target: { value: 'admin-token' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch leads' }));

    expect(await screen.findByText(/1 lead loaded/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Download' }));

    expect(await screen.findByText(/Download link created for kitchen-quote.pdf/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/.netlify/functions/kitchen-admin-file-download',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'x-operon-admin-token': 'admin-token' }),
        body: JSON.stringify({ fileId: sampleLeadFile.id }),
      }),
    );
    expect(openSpy).toHaveBeenCalledWith(
      'https://kitchens.supabase.co/storage/v1/object/sign/private-file?token=safe',
      '_blank',
      'noopener,noreferrer',
    );
    expect(document.body.textContent).not.toContain('service-role-test-key');
    expect(document.body.textContent?.toLowerCase()).not.toContain('leadscore');
  });

  it('shows a clear no-results state after fetching an empty filtered list', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ ok: true, leads: [] }),
    })) as typeof fetch;

    render(<LeadsAdminPage />);
    fireEvent.change(screen.getByLabelText('Admin token'), { target: { value: 'admin-token' } });
    fireEvent.click(screen.getByRole('button', { name: 'Fetch leads' }));

    expect(await screen.findByText(/0 leads loaded/i)).toBeInTheDocument();
    expect(screen.getByText(/No leads matched this filter/i)).toBeInTheDocument();
  });
});
