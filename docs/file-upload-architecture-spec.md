# File Upload Architecture Spec

Last updated: 2 June 2026

Purpose: document the current and future Operon Kitchens file upload architecture without adding new runtime features.

## Status

This is a local architecture specification only.

Do not implement admin signed downloads, deletion, retention automation, full CRM, customer accounts, payment or broader file operations from this document without explicit Vincent approval.

## Product Context

Operon Kitchens may ask customers to prepare or upload:

- existing kitchen quotes
- kitchen photos
- floor plans
- drawings
- appliance lists
- other project documents relevant to quote review

Files support quote clarity and professional review. They do not replace site measure, licensed trade review, written scope confirmation or project-specific pricing.

## Current Storage Path

Current customer-facing forms:

- `/request-review`
- `/quote/review`

Current runtime endpoint:

```text
POST /.netlify/functions/kitchen-request-review
```

Current server flow:

1. Browser prepares safe file payloads after local size/type checks.
2. Browser posts customer-safe request-review payload to the Netlify Function.
3. `src/lib/requestReview.ts` validates:
   - allowed file count
   - allowed MIME type/extension
   - declared size matches decoded size
   - per-file and total file limits
   - unsupported internal fields are rejected
4. `netlify/functions/kitchen-request-review.ts` stores the lead first.
5. `src/lib/kitchenFileStorage.ts` stores file objects in Supabase Storage when configured.
6. Safe file metadata is inserted into `public.kitchen_request_review_files`.
7. Browser response reports safe delivery status only.

The browser must never receive Supabase service role keys, direct storage credentials, public object URLs, signed download links or internal file paths for unauthorised access.

## Current Limits

Current upload limits:

- maximum 6 files per request
- maximum 4MB per file
- maximum 10MB total per request
- allowed types: PDF, JPEG, PNG, WebP, HEIC and HEIF
- disallowed: SVG, scripts, executables, archives and unsupported file types

Current safe delivery fields:

- `delivery.filesStored`
- `delivery.fileDeliveryStatus`
- `delivery.fileDeliveryIssue`
- `delivery.fileDeliveryStatusCode`
- `delivery.fileCount`

These fields are diagnostics only. They must not expose secrets, file contents, supplier costs, internal rates, margins, lead scores, admin priority or internal notes.

## Private Bucket Posture

Recommended bucket:

```text
operon-kitchens-request-review-files
```

Bucket posture:

- private bucket
- no public object reads
- no anonymous browser uploads
- no browser-side Supabase writes
- server-mediated upload only
- service role key used only inside Netlify Functions
- upload bucket value stored in Netlify env var `OPERON_KITCHENS_UPLOAD_BUCKET`

Minimum required Supabase objects:

- Supabase Storage bucket
- `public.kitchen_request_review_files` metadata table
- service-role storage policies where required by the project

The bucket and metadata table must be kitchen-specific and must not be shared with Operon Flooring or Oz Timber.

## Metadata Table

Current metadata table:

```text
public.kitchen_request_review_files
```

Current metadata fields:

- `id`
- `lead_id`
- `created_at`
- `bucket`
- `object_path`
- `file_name`
- `file_type`
- `file_size`
- `category`

Admin-lite may display metadata only. Metadata display is useful for confirming that a customer attached a quote, photo, plan or appliance list.

Do not display:

- public download URLs
- signed URLs
- storage service keys
- raw file contents
- customer files to unauthorised users

## Admin Metadata Display

Current `/admin/leads` behaviour:

- admin token required
- lead list is hidden without valid token
- file metadata may show when present
- no signed download link yet
- no delete button yet
- no retention automation yet

Admin display should stay simple during controlled testing:

- file name
- category
- MIME type
- approximate file size
- object path for internal orientation only

Object paths are internal operational context and should remain behind admin token access.

## Future Signed Downloads

Signed downloads are deferred.

Future requirements:

- admin token required
- Netlify Function creates short-lived signed URL server-side
- function verifies lead/file metadata before creating a signed URL
- signed URL lifetime should be short, for example 5-15 minutes
- response must not expose service role key
- response must not expose unrelated files
- audit/log safe categories only

Possible future endpoint:

```text
POST /.netlify/functions/kitchen-admin-file-download
```

Suggested request:

```json
{
  "fileId": "uuid"
}
```

Suggested response:

```json
{
  "ok": true,
  "downloadUrl": "short-lived signed URL",
  "expiresInSeconds": 600
}
```

Security notes:

- require `x-operon-admin-token`
- reject missing/invalid token with `401`
- fetch metadata from `public.kitchen_request_review_files`
- sign only the exact object path tied to the requested metadata row
- do not support arbitrary object paths from the browser

## Future Deletion

Deletion is deferred.

Future deletion should be a two-step admin action:

1. delete file object from Supabase Storage
2. mark metadata as deleted or remove metadata depending on retention policy

Recommended approach:

- prefer soft-delete metadata first
- add fields such as `deleted_at`, `deleted_by`, `delete_reason`
- hide deleted files from default admin display
- keep a safe audit trail during early operations

Possible future endpoint:

```text
POST /.netlify/functions/kitchen-admin-file-delete
```

Deletion must:

- require admin token
- never accept arbitrary bucket/object path from browser without metadata lookup
- confirm file belongs to a kitchen request-review lead
- avoid deleting unrelated storage objects
- log safe categories only

## Retention Rules

Retention is deferred and should be approved before implementation.

Suggested retention principles:

- keep active enquiry files while review/site-measure discussion is active
- delete uploaded files on customer request where legally and technically possible
- retain business records where required for accounting, legal or operational reasons
- do not invent a fixed public retention period until Vincent approves it
- document retention in Privacy Policy before any automated retention workflow launches

Possible future retention states:

- `active`
- `review_complete`
- `customer_requested_deletion`
- `deleted`
- `retained_for_business_record`

Possible future metadata fields:

- `retention_status`
- `review_completed_at`
- `delete_requested_at`
- `deleted_at`
- `delete_reason`

## Customer-Safe Wording

Allowed:

- uploaded files help improve review confidence
- files support quote review and scope clarity
- site measure and written scope confirmation are still required
- upload only files you are authorised to share

Avoid:

- final quote from uploaded files
- legal approval
- compliance approval
- certified document review
- guaranteed savings
- instant ordering

## Failure Behaviour

If lead storage succeeds but files fail to store:

- response may still acknowledge the lead
- response must not pretend files were stored
- response should show safe delivery fields only
- admin follow-up can ask customer to resend files later

If neither lead storage nor notification succeeds:

- response must not fake success
- endpoint should return controlled service-unavailable response

## Implementation Boundaries

Do not add without explicit approval:

- public file URLs
- browser-side Supabase uploads
- admin file download
- admin file deletion
- retention automation
- customer file portal
- full CRM
- payment or paid review checkout

## Local QA Checklist For Future Upload Work

Before any future upload release:

- tests cover file validation
- tests cover unsafe/internal field rejection
- tests cover missing storage env behaviour
- tests cover successful lead storage with email disabled
- tests cover safe browser response
- lint passes
- build passes
- `git diff --check` passes
- no secrets committed
- deploy is explicitly approved

## Open Questions For Vincent

- What retention period should apply to quote/photos/plans during controlled testing?
- Should customers be able to request deletion through the request-review form or only by contact path?
- Should admin downloads be one-click signed links or require a separate confirmation step?
- Should deleted file metadata remain visible to admin for audit during the MVP?
- Should detailed paid quote review include file retention terms separate from free intake?
