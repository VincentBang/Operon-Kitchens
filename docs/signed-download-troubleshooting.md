# Signed Download Troubleshooting

Last updated: 17 June 2026

Purpose: diagnose admin signed-download issues after an approved deploy.

Deployment status: not needed. Use only after a signed-download release is approved and deployed.

## Expected Flow

1. Operator opens `/admin/leads`.
2. Operator enters `OPERON_KITCHENS_ADMIN_TOKEN`.
3. Admin page fetches lead and file metadata.
4. Operator clicks `Download`.
5. Browser calls `POST /.netlify/functions/kitchen-admin-file-download`.
6. Function validates token and file ID.
7. Function fetches metadata from `public.kitchen_request_review_files`.
8. Function signs the stored bucket/object path.
9. Browser opens the short-lived signed URL.

## Common Failures

### 401

Likely causes:

- missing token
- wrong token
- Netlify env var not deployed

Check:

- `OPERON_KITCHENS_ADMIN_TOKEN`
- latest deploy timestamp

### 400

Likely causes:

- missing `fileId`
- malformed request
- unsupported fields sent by browser

Check browser network request body.

### 404

Likely causes:

- file metadata not found
- metadata row belongs to a different project/table
- Supabase URL points at the wrong project

Check `public.kitchen_request_review_files`.

### 409 Or Deleted File Message

Likely cause:

- metadata has `retention_status = 'deleted'`

Expected behaviour: do not generate a signed download.

### 502 Or Signed URL Failed

Likely causes:

- bucket missing
- object path wrong
- object was physically removed
- service role key cannot access the bucket
- Supabase signed path returned in an unexpected format

Check:

- bucket name
- object path
- object exists in Storage
- function logs show safe diagnostic category only

## Do Not Do

- do not make the bucket public
- do not paste service role keys into chat
- do not log raw file contents
- do not expose permanent file URLs
- do not retry repeatedly in production without checking logs and metadata
