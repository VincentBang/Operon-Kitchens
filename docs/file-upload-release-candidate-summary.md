# File Upload Release Candidate Summary

Last updated: 3 June 2026

Purpose: summarise the local file-upload/admin-download batch before Vincent decides whether it is worth one approved Netlify deploy.

Deployment status: optional. Do not push or deploy unless Vincent explicitly approves this release candidate.

## What Would Go Live

If approved and deployed, this release would add:

- token-gated admin signed file download function
- `/admin/leads` download buttons for uploaded file metadata
- short-lived Supabase signed download links generated on demand
- a fix for Supabase signed URL paths that omit `/storage/v1`
- clearer admin copy that files are private and links expire shortly
- retention-status display for file metadata where the SQL columns exist
- a token-gated soft-delete function prepared locally
- deletion guardrail tests without a public delete button

## Runtime Changes

New Netlify Function:

```text
POST /.netlify/functions/kitchen-admin-file-download
```

Local Netlify Function prepared, but not exposed through a delete button yet:

```text
POST /.netlify/functions/kitchen-admin-file-delete
```

Behaviour:

- requires `x-operon-admin-token`
- validates `fileId`
- fetches file metadata from `public.kitchen_request_review_files`
- signs only the metadata-owned bucket/object path
- returns a short-lived signed URL
- normalises Supabase signed paths that are returned as `/object/sign/...`
- does not expose service role keys, raw Supabase errors, internal notes, supplier costs, margins, lead scores or admin priority

Soft-delete behaviour:

- requires `x-operon-admin-token`
- validates `fileId` and delete reason
- rejects unsafe browser-supplied fields such as bucket, object path, margin, supplier cost, lead score, admin priority or service keys
- marks metadata as `retention_status = 'deleted'`
- does not physically delete Supabase Storage objects in this release candidate

## Admin UI Changes

`/admin/leads` would show:

- file category label
- readable file size
- MIME type
- internal object path behind admin token access
- `Download` button for each uploaded file
- file retention status where available
- deleted-file label where available
- copy that deletion and retention workflows remain deferred

No public navigation links are added.

## Supabase Manual SQL Needed

Before delete controls launch, apply the retention metadata SQL from:

- [Supabase request-review storage notes](./supabase-kitchen-request-reviews.md)

For signed downloads only, no new table is required if:

- `public.kitchen_request_review_files` already exists
- uploaded file metadata is being stored
- Supabase Storage bucket is private and configured

## Environment Variables

Required for live signed downloads:

```text
OPERON_KITCHENS_SUPABASE_URL
OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY
OPERON_KITCHENS_ADMIN_TOKEN
OPERON_KITCHENS_UPLOAD_BUCKET
```

Do not expose these values in browser copy, logs or chat.

## Local Verification Completed

Current local gate:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Expected result before release approval: all pass.

## Manual Verification After One Approved Deploy

Use the [Signed download live verification checklist](./signed-download-live-verification-checklist.md).

Minimum live checks:

1. Submit one request-review lead with a small PDF/image.
2. Confirm Supabase lead row exists.
3. Confirm file metadata exists.
4. Open `/admin/leads` with token.
5. Click `Download` for one file.
6. Confirm the signed URL opens the file.
7. Confirm browser/network responses do not expose service keys or internal pricing/admin fields.

## Do Not Include In This Release

- delete button
- physical object deletion
- retention automation
- customer file portal
- public file URLs
- browser-side Supabase uploads
- payment
- customer auth
- full CRM

## Decision

Recommended release decision:

- approve one deploy only if Vincent wants admin signed downloads live for controlled testing
- otherwise keep this local until the next approved release checkpoint
