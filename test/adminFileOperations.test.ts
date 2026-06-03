import { handler as downloadHandler } from '../netlify/functions/kitchen-admin-file-download';
import { handler as deleteHandler } from '../netlify/functions/kitchen-admin-file-delete';

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

  it('normalises Supabase signed object paths that omit the storage prefix', async () => {
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
          signedURL: `/object/sign/${uploadBucketName}/${sampleFile.object_path}?token=safe-test-token`,
        }),
        text: async () => '',
      });
    global.fetch = fetchMock as typeof fetch;

    const response = await downloadHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: sampleFileId }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(200);
    expect(body.downloadUrl).toBe(
      `https://kitchens.supabase.co/storage/v1/object/sign/${uploadBucketName}/${sampleFile.object_path}?token=safe-test-token`,
    );
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

  it('rejects deleted file metadata before creating signed downloads', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ ...sampleFile, retention_status: 'deleted', deleted_at: '2026-06-03T00:00:00.000Z' }],
      text: async () => '',
    });
    global.fetch = fetchMock as typeof fetch;

    const response = await downloadHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: sampleFileId }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(409);
    expect(body).toEqual({ ok: false, error: 'File has been deleted.' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
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

describe('admin file soft-delete function', () => {
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
    const response = await deleteHandler({
      httpMethod: 'GET',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: null,
    });

    expect(response.statusCode).toBe(405);
  });

  it('rejects missing or invalid admin token before metadata lookup', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as typeof fetch;

    const response = await deleteHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'wrong-token' },
      body: JSON.stringify({ fileId: sampleFileId, deleteReason: 'duplicate' }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(401);
    expect(body.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(JSON.stringify(body)).not.toContain('kitchen-quote.pdf');
  });

  it('rejects malformed file IDs and unsupported delete reasons', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as typeof fetch;

    const badIdResponse = await deleteHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: '../storage/object/path', deleteReason: 'duplicate' }),
    });
    const badReasonResponse = await deleteHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: sampleFileId, deleteReason: 'delete_everything' }),
    });

    expect(badIdResponse.statusCode).toBe(400);
    expect(JSON.parse(badIdResponse.body).error).toContain('valid file id');
    expect(badReasonResponse.statusCode).toBe(400);
    expect(JSON.parse(badReasonResponse.body).error).toContain('delete reason');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rejects unsafe browser-supplied mutation fields', async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as typeof fetch;

    const response = await deleteHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({
        fileId: sampleFileId,
        deleteReason: 'duplicate',
        bucket: 'attacker-bucket',
        object_path: 'attacker/path.pdf',
        leadScore: 99,
        supplierCost: 1,
        margin: 1,
        serviceRoleKey: 'service-role-test-key',
      }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(400);
    expect(body.error).toContain('unsupported');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(JSON.stringify(body)).not.toContain('service-role-test-key');
  });

  it('soft-deletes metadata with an allowed reason and does not accept browser object paths', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [sampleFile],
        text: async () => '',
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ ...sampleFile, retention_status: 'deleted' }],
        text: async () => '',
      });
    global.fetch = fetchMock as typeof fetch;

    const response = await deleteHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: sampleFileId, deleteReason: 'duplicate' }),
    });
    const body = JSON.parse(response.body);
    const metadataUrl = String(fetchMock.mock.calls[0][0]);
    const updateUrl = String(fetchMock.mock.calls[1][0]);
    const updateBody = JSON.parse(String(fetchMock.mock.calls[1][1]?.body));

    expect(response.statusCode).toBe(200);
    expect(body).toEqual({
      ok: true,
      fileId: sampleFileId,
      deleted: true,
      retentionStatus: 'deleted',
    });
    expect(metadataUrl).toContain('/rest/v1/kitchen_request_review_files?');
    expect(metadataUrl).toContain(`id=eq.${sampleFileId}`);
    expect(updateUrl).toContain('/rest/v1/kitchen_request_review_files?');
    expect(updateUrl).toContain(`id=eq.${sampleFileId}`);
    expect(updateBody.retention_status).toBe('deleted');
    expect(updateBody.delete_reason).toBe('duplicate');
    expect(updateBody.deleted_by).toBe('admin');
    expect(updateBody.object_path).toBeUndefined();
    expect(updateBody.bucket).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(body)).not.toContain('service-role-test-key');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('suppliercost');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('margin');
  });

  it('returns a safe conflict when metadata is already deleted', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => [{ ...sampleFile, retention_status: 'deleted', deleted_at: '2026-06-03T00:00:00.000Z' }],
      text: async () => '',
    });
    global.fetch = fetchMock as typeof fetch;

    const response = await deleteHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: sampleFileId, deleteReason: 'duplicate' }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(409);
    expect(body).toEqual({ ok: false, error: 'File is already deleted.' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not expose raw Supabase errors or service keys when metadata update fails', async () => {
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
        text: async () => 'service-role-test-key table internal failure',
      });
    global.fetch = fetchMock as typeof fetch;

    const response = await deleteHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: sampleFileId, deleteReason: 'irrelevant' }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(502);
    expect(body).toEqual({ ok: false, error: 'File deletion is temporarily unavailable.' });
    expect(JSON.stringify(body)).not.toContain('service-role-test-key');
    expect(JSON.stringify(body).toLowerCase()).not.toContain('table internal failure');
  });

  it('returns service unavailable when storage env vars are missing', async () => {
    delete process.env.OPERON_KITCHENS_SUPABASE_URL;
    delete process.env.OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY;
    const fetchMock = jest.fn();
    global.fetch = fetchMock as typeof fetch;

    const response = await deleteHandler({
      httpMethod: 'POST',
      headers: { 'x-operon-admin-token': 'admin-token' },
      body: JSON.stringify({ fileId: sampleFileId, deleteReason: 'duplicate' }),
    });
    const body = JSON.parse(response.body);

    expect(response.statusCode).toBe(503);
    expect(body).toEqual({ ok: false, error: 'File storage is not configured.' });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
