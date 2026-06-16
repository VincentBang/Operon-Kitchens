# File Upload Approved Release Runbook

Last updated: 17 June 2026

Purpose: guide one future approved release for Operon Kitchens file upload signed downloads and metadata soft delete.

Deployment status: not needed until Vincent explicitly approves the file-upload release.

## Current Intended Release Scope

Allowed in the next file-operation release:

- private Supabase Storage bucket usage
- request-review file object storage
- request-review file metadata storage
- admin file metadata display
- token-gated signed-download function
- admin download button
- token-gated metadata soft-delete function

Still deferred:

- visible delete button
- physical Storage object deletion
- retention automation
- public file URLs
- customer file portal
- browser-side Supabase writes
- full CRM

## Required Manual Preconditions

Vincent confirms in Netlify:

```text
OPERON_KITCHENS_SUPABASE_URL
OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY
OPERON_KITCHENS_ADMIN_TOKEN
OPERON_KITCHENS_UPLOAD_BUCKET
```

Vincent confirms in Supabase:

- bucket named by `OPERON_KITCHENS_UPLOAD_BUCKET` exists
- bucket is private
- `public.kitchen_request_reviews` exists
- `public.kitchen_request_review_files` exists
- retention metadata columns exist if soft-delete is included
- RLS is enabled
- no anonymous public read policy exists for lead or file metadata

## Approved Verification Flow

After one approved deploy:

1. Submit one `/request-review` test lead with a small PDF or PNG.
2. Confirm response has `ok: true`.
3. Confirm response has `delivery.stored: true`.
4. Confirm response has `delivery.filesStored: true`.
5. Open `/admin/leads`.
6. Enter the admin token.
7. Confirm the test lead appears.
8. Confirm file metadata appears.
9. Click `Download`.
10. Confirm the signed URL opens the file.
11. Optionally call the soft-delete function with one test file only.
12. Confirm deleted file cannot be downloaded.

Stop after one controlled verification unless Vincent approves more.

## Failure Handling

If lead storage fails:

- stop file verification
- check Netlify Function logs
- do not fake success

If file storage fails but lead storage succeeds:

- keep the lead as durable
- document the safe file warning
- check bucket name, private bucket, table columns and object path mapping

If signed download fails:

- check signed URL path normalization
- check metadata object path
- check bucket name
- do not expose raw Supabase errors publicly

If soft delete fails:

- check retention metadata SQL
- check allowed delete reason
- check admin token
- do not retry repeatedly in production

