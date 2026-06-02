# File Upload MVP Completion Plan

Last updated: 3 June 2026

Purpose: turn the existing file upload architecture into an implementation-ready MVP plan for admin signed downloads, deletion and retention rules without building runtime file operations yet.

Default rule: no deploy. Do not implement signed downloads, deletion, retention automation, customer auth, full CRM or payment from this plan without explicit Vincent approval.

## Current State

Operon Kitchens currently has safe file upload scaffolding for request-review intake:

- customer file payloads are sent through `POST /.netlify/functions/kitchen-request-review`
- upload validation lives in `src/lib/requestReview.ts`
- file object storage is handled server-side through `src/lib/kitchenFileStorage.ts`
- file metadata is stored in `public.kitchen_request_review_files`
- `/admin/leads` displays metadata only
- Supabase remains the source of truth for leads
- files are stored in a private kitchen-specific bucket when configured

Admin-lite does not yet provide signed downloads, deletion buttons, retention state management or automated retention jobs.

## MVP Goal

The File Upload MVP is complete when Vincent can safely:

1. Receive a request-review lead with uploaded files.
2. See file metadata in `/admin/leads`.
3. Generate a short-lived signed download link for one file at a time.
4. Soft-delete or mark a file for deletion through an admin-only action.
5. Understand the retention state for each file.
6. Avoid public file URLs, browser-side Supabase writes and broad file access.

This is an admin operations layer only. It is not a customer portal.

## Non-Negotiable Boundaries

Do not expose:

- Supabase service role keys
- storage API keys
- public file URLs
- raw object paths to public pages
- supplier costs
- internal rates
- margin or markup logic
- lead score
- admin priority
- hidden pricing logic

Do not promise:

- final fixed quote from uploaded files
- legal approval
- compliance approval
- certified document review
- guaranteed savings
- instant ordering

## Phase 1: Signed Download Function

Create a Netlify Function only after approval:

```text
POST /.netlify/functions/kitchen-admin-file-download
```

Required request:

```json
{
  "fileId": "uuid"
}
```

Required auth:

- `x-operon-admin-token`
- compare server-side against `OPERON_KITCHENS_ADMIN_TOKEN`
- return `401` for missing or invalid token
- do not reveal whether a file exists when unauthorised

Server flow:

1. Validate admin token.
2. Validate `fileId` format.
3. Fetch metadata from `public.kitchen_request_review_files` by `id`.
4. Reject deleted files by default.
5. Confirm bucket and object path come from the metadata row, not the browser.
6. Create a Supabase Storage signed URL for that exact object path.
7. Return a short-lived URL.

Recommended signed URL lifetime:

```text
600 seconds
```

Safe response:

```json
{
  "ok": true,
  "fileId": "uuid",
  "downloadUrl": "short-lived signed URL",
  "expiresInSeconds": 600
}
```

Do not include service keys, unrelated file metadata, lead notes, pricing fields or raw error details.

## Phase 2: Admin Download UI

Update `/admin/leads` only after the function exists.

UI behaviour:

- show a `Download` button beside each active file metadata row
- require the existing admin token already entered on the page
- request a signed URL only when clicked
- open the signed URL in a new tab or trigger browser download
- show a clear expiry note: "Link expires shortly."
- show safe error states for expired, missing or deleted files

Do not show download links before click. Do not cache signed URLs in local storage.

## Phase 3: Deletion And Soft-Delete Function

Create a Netlify Function only after approval:

```text
POST /.netlify/functions/kitchen-admin-file-delete
```

Recommended MVP approach: soft-delete metadata first, then optionally remove the storage object.

Smallest safe deletion slice:

```text
delete function + tests only
```

Do not add a delete button until the function has local tests and Vincent approves the UI slice.

Required request:

```json
{
  "fileId": "uuid",
  "deleteReason": "customer_request | duplicate | irrelevant | unsafe | retention_cleanup | other"
}
```

Allowed delete reasons:

- `customer_request`
- `duplicate`
- `irrelevant`
- `unsafe`
- `retention_cleanup`
- `other`

Server flow:

1. Validate admin token.
2. Validate `fileId`.
3. Validate `deleteReason`.
4. Reject unsupported browser fields such as `bucket`, `object_path`, `email`, `leadScore`, `adminPriority`, `supplierCost`, `margin` or `serviceRoleKey`.
5. Fetch metadata from `public.kitchen_request_review_files`.
6. Reject missing or already deleted files with a safe status.
7. Update metadata with:
   - `retention_status = 'deleted'`
   - `deleted_at`
   - `deleted_by = 'admin-token'` or another safe non-secret operator label
   - `delete_reason`
8. Optionally delete the storage object after metadata update succeeds.
9. Return safe confirmation.

Recommended MVP response:

```json
{
  "ok": true,
  "fileId": "uuid",
  "deleted": true
}
```

Deletion must never accept arbitrary bucket names or object paths from the browser.

Safe error responses:

- `401`: unauthorised
- `400`: invalid file ID, invalid reason or unsupported fields
- `404`: file unavailable
- `409`: file already deleted
- `503`: file storage not configured
- `502`: delete temporarily unavailable

Do not return raw Supabase errors, service role keys, object contents, internal notes or pricing fields.

Recommended future endpoint tests:

- rejects non-POST requests
- rejects missing/invalid token
- rejects malformed file ID
- rejects unsupported delete reason
- rejects browser-supplied `bucket` and `object_path`
- rejects unsafe fields such as `leadScore`, `adminPriority`, `supplierCost`, `margin`, `serviceRoleKey`
- fetches metadata by `fileId`
- soft-deletes metadata with allowed reason
- does not delete arbitrary object paths supplied by the browser
- returns safe responses without raw Supabase errors or secrets

## Phase 4: Retention Metadata

Before deletion UI launches, apply an additive SQL migration in the kitchen Supabase project only.

Recommended columns:

```sql
alter table public.kitchen_request_review_files
  add column if not exists retention_status text not null default 'active'
    check (retention_status in (
      'active',
      'review_complete',
      'customer_requested_deletion',
      'deleted',
      'retained_for_business_record'
    )),
  add column if not exists review_completed_at timestamptz,
  add column if not exists delete_requested_at timestamptz,
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_by text,
  add column if not exists delete_reason text;

create index if not exists kitchen_request_review_files_retention_status_idx
  on public.kitchen_request_review_files (retention_status);

create index if not exists kitchen_request_review_files_deleted_at_idx
  on public.kitchen_request_review_files (deleted_at);
```

Do not apply this SQL to Operon Flooring, Oz Timber or any shared project.

## Phase 5: Retention Policy

Retention should be policy-led before it becomes automated.

MVP principles:

- active enquiry files stay available while the lead is being reviewed
- files can be marked for deletion when a customer asks, where legally and technically possible
- files connected to active project delivery may need separate business-record handling
- automated deletion should not launch until Vincent approves a retention period and Privacy wording

Suggested manual statuses:

- `active`: default for newly uploaded files
- `review_complete`: quote review has finished, but file is still retained
- `customer_requested_deletion`: customer asked for deletion; admin must review
- `deleted`: file has been deleted or hidden from default admin view
- `retained_for_business_record`: file retained because it is tied to an active project/business record

## Privacy And Terms Dependencies

Before signed downloads/deletion launch, review:

- `src/pages/privacy.tsx`
- `src/pages/terms.tsx`
- `src/components/PrivacyCollectionNotice.tsx`

Confirm they say:

- uploaded files may contain personal/property/third-party information
- users should upload only files they are authorised to share
- files support planning estimate and quote review guidance
- deletion can be requested where legally and technically possible
- reasonable security steps are used, not absolute security guarantees

Do not add fixed retention periods unless Vincent approves them.

## Admin UX Requirements

Admin file controls should be deliberately boring and safe:

- metadata first
- signed download only after click
- short-lived links
- clear deleted state
- no public URLs
- no bulk download in MVP
- no automatic file previews in MVP
- no customer-facing file access in MVP

Recommended copy:

```text
Files are private. Download links are generated on demand and expire shortly.
```

```text
Deleting a file may affect quote-review context. Use deletion for duplicates, irrelevant files, unsafe files or customer deletion requests.
```

## Tests To Add Before Runtime Work

Signed download function tests:

- rejects missing token
- rejects invalid token
- rejects malformed file ID
- returns 404-safe response for missing file metadata
- rejects deleted file metadata
- signs only metadata-owned object path
- response does not expose service keys or raw Supabase errors

Delete function tests:

- rejects missing token
- rejects invalid token
- rejects malformed file ID
- rejects unsafe client fields
- soft-deletes metadata with allowed delete reason
- does not accept browser-supplied bucket/object path
- response does not expose internal fields

Admin UI tests:

- file metadata renders
- download button requests signed URL with admin token
- deleted files are labelled or hidden according to chosen UI rule
- delete confirmation prevents accidental deletion
- no public header/footer links to admin file operations

Public copy tests:

- no final fixed quote wording
- no legal/compliance approval wording
- no public file URL wording
- no internal pricing/admin fields

## Release Gate

Before any approved File Upload MVP deploy:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Also confirm:

- Supabase bucket is private
- `OPERON_KITCHENS_UPLOAD_BUCKET` is set only in Netlify environment
- no secrets are committed
- `/admin/leads` remains noindex/nofollow
- admin file routes require `OPERON_KITCHENS_ADMIN_TOKEN`
- no production Supabase changes were made directly by Codex

## Recommended Implementation Order

1. Add retention metadata SQL to docs only.
2. Add shared server helper for admin token validation if not already reusable.
3. Add signed download function and tests.
4. Add admin download UI and tests.
5. Add soft-delete function and tests.
6. Add admin delete UI and tests.
7. Update Privacy/Terms wording if retention/deletion details change.
8. Run local gate.
9. Ask Vincent for one approved deploy only.
10. Run one controlled live upload/download/delete verification.

## Smallest First Implementation Slice

Based on the current runtime code, the smallest safe first slice is:

```text
admin signed download function + focused tests only
```

Do not add delete UI, retention automation or public customer file access in this slice.

Existing reusable pieces:

- `src/lib/kitchenAdminLeads.ts` already provides `getAdminAuthState`, `getHeader` and Supabase service-role REST patterns.
- `public.kitchen_request_review_files` already stores `id`, `lead_id`, `bucket`, `object_path`, `file_name`, `file_type`, `file_size` and `category`.
- `/admin/leads` already displays file metadata behind admin token access.
- `test/adminLeadOperations.test.tsx` already imports Netlify Function handlers directly and mocks `fetch`.

Recommended new files for the first slice:

- `src/lib/kitchenAdminFiles.ts`
- `netlify/functions/kitchen-admin-file-download.ts`
- `test/adminFileOperations.test.ts`

Recommended helper responsibilities in `src/lib/kitchenAdminFiles.ts`:

- validate UUID file IDs
- fetch file metadata by `id`
- reject missing or deleted file metadata
- build the Supabase signed URL endpoint using server env vars only
- call Supabase Storage `createSignedUrl` REST endpoint
- return only a safe signed-download result

Recommended endpoint shape:

```text
POST /.netlify/functions/kitchen-admin-file-download
```

Request:

```json
{
  "fileId": "1993f583-2d91-4d4c-bf3f-afd71d4ebb30"
}
```

Response:

```json
{
  "ok": true,
  "fileId": "1993f583-2d91-4d4c-bf3f-afd71d4ebb30",
  "fileName": "kitchen-quote.pdf",
  "downloadUrl": "short-lived Supabase signed URL",
  "expiresInSeconds": 600
}
```

Do not return:

- service role key
- bucket secrets
- unrelated file metadata
- lead internal notes
- supplier costs
- internal rates
- margins
- lead scores
- admin priority

First-slice tests:

- rejects non-POST requests with `405`
- rejects missing admin token with `401`
- rejects invalid admin token with `401`
- rejects malformed `fileId` with `400`
- returns a safe missing-file response without revealing whether other files exist
- fetches metadata from `public.kitchen_request_review_files`
- signs only the metadata-owned `bucket` and `object_path`
- returns `downloadUrl` and `expiresInSeconds` on success
- does not expose service keys, raw Supabase errors or forbidden internal fields

Why this slice is small:

- no `/admin/leads` UI change is required yet
- no deletion SQL is required yet
- no retention metadata migration is required yet
- no customer-facing route changes are required
- no browser-side Supabase access is introduced

## Deferred Beyond MVP

- customer file portal
- customer authentication
- direct customer downloads
- browser-side Supabase uploads
- bulk file download
- automated retention jobs
- virus scanning pipeline
- OCR/AI document extraction
- full CRM integration
- paid quote-review checkout
