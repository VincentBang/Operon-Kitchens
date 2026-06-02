import { handler as downloadHandler } from '../netlify/functions/kitchen-admin-file-download';

const uploadBucketName = ['operon', 'kitchens', 'request', 'review', 'files'].join('-');
const sampleFileId = '1993f583-2d91-4d4c-bf3f-afd71d4ebb30';
const sampleLeadId = '0993f583-2d91-4d4c-bf3f-afd71d4ebb30';

const sampleFile = {
  id: sampleFileId,
  lead_id: sampleLeadId,
  created_at: '2026-05-31T10:01:00.000Z',
  bucket: uploadBucketName,
  object_path: `request-reviews/2026-05-31/${sampleLeadId}/kitchen-quote.pdf`,
  file_name: 'kitchen-quote.pdf',
  file_type: 'application/pdf',
  file_size: 2048,
  category: 'existingQuote',
};

describe('admin file signed download function', () => {
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

  it('rejects non-POST requests', async () => {
    const response = await downloadHandler({
      httpMethod: 'GET',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: null,
    });

    expect(response.statusCode).toBe(405);
  });

  it('rejects missing or invalid admin token without revealing file data', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as typeof fetch;

    const response = await downloadHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'wrong-token' },
      body: JSON.stringify({ fileId: sampleFileId }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(401);
    expect(body.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(JSON.stringify(body)).not.toContain('kitchen-quote.pdf');
  });

  it('rejects malformed file ids before Supabase lookup', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as typeof fetch;

    const response = await downloadHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: '../storage/object/path' }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(body.error).toContain('valid file id');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('creates a short-lived signed URL using metadata-owned bucket and object path', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [sampleFile],
        text: async () => '',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          signedURL: `/storage/v1/object/sign/${uploadBucketName}/${sampleFile.object_path}?token=safe-test-token`,
        }),
        text: async () => '',
      });
    global.fetch = fetchMock as typeof fetch;

    const response = await downloadHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({
        fileId: sampleFileId,
        bucket: 'attacker-bucket',
        object_path: 'attacker/path.pdf',
      }),
    });
    const body = JSON.parse(response.body);
    const metadataUrl = String(fetchMock.mock.calls[0][0]);
    const signUrl = String(fetchMock.mock.calls[1][0]);
    const signBody = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));

    expect(response.statusCode).toBe(200);
    expect(body).toEqual({
      ok: true,
      fileId: sampleFileId,
      fileName: 'kitchen-quote.pdf',
      downloadUrl: `https://kitchens.supabase.co/storage/v1/object/sign/${uploadBucketName}/${sampleFile.object_path}?token=safe-test-token`,
      expiresInSeconds: 600,
    });
    expect(metadataUrl).toContain('/rest/v1/kitchen_request_review_files?');
    expect(metadataUrl).toContain(`id=eq.${sampleFileId}`);
    expect(signUrl).toContain(`/storage/v1/object/sign/${uploadBucketName}/request-reviews/2026-05-31/${sampleLeadId}/kitchen-quote.pdf`);
    expect(signUrl).not.toContain('attacker-bucket');
    expect(signUrl).not.toContain('attacker/path.pdf');
    expect(signBody).toEqual({ expiresIn: 600 });
    expect(JSON.stringify(body)).not.toContain('service-role-test-key');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('leadscore');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('suppliercost');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('margin');
  });

  it('returns a safe unavailable response when file metadata is missing', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => [],
      text: async () => '',
    })) as typeof fetch;

    const response = await downloadHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: sampleFileId }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(404);
    expect(body).toEqual({ ok: false, error: 'File is unavailable.' });
    expect(JSON.stringify(body)).not.toContain(sampleFileId);
  });

  it('does not expose raw Supabase errors or service keys when signing fails', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [sampleFile],
        text: async () => '',
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
        text: async () => 'service-role-test-key bucket internal failure',
      });
    global.fetch = fetchMock as typeof fetch;

    const response = await downloadHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: sampleFileId }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(502);
    expect(body).toEqual({ ok: false, error: 'File download is temporarily unavailable.' });
    expect(JSON.stringify(body)).not.toContain('service-role-test-key');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('bucket internal failure');
  });

  it('returns service unavailable when Supabase storage env vars are missing', async () => {
    delete process.env.OPERON_KITCHENS_SUPABASE_URL;
    delete process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;
    const fetchMock = jest.fn();
    global.fetch = fetchMock as typeof fetch;

    const response = await downloadHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: sampleFileId }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(503);
    expect(body).toEqual({ ok: false, error: 'File storage is not configured.' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

