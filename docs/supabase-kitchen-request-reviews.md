# Supabase: Kitchen Request Review Leads

Last updated: 31 May 2026

This document describes the kitchen-namespaced durable storage table for the Operon Kitchens request-review intake flow.

The public form posts to:

```text
POST /.netlify/functions/kitchen-request-review
```

The function validates and sanitises the customer payload, creates server-side metadata, then inserts into `kitchen_request_reviews` using the Supabase service role key. Do not insert into this table directly from the browser.

## Required Netlify Environment Variables

```text
OPERON_KITCHENS_SUPABASE_URL
OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY
OPERON_KITCHENS_UPLOAD_BUCKET
```

Optional notification variables:

```text
OPERON_KITCHENS_RESEND_API_KEY
OPERON_KITCHENS_REQUEST_REVIEW_TO_EMAIL
OPERON_KITCHENS_REQUEST_REVIEW_FROM_EMAIL
OPERON_KITCHENS_IP_HASH_SALT
```

If Supabase storage is not configured but Resend is configured, the function can still notify by email. If neither durable storage nor email notification is configured, the endpoint returns a controlled service-unavailable response instead of pretending the lead was captured.

When diagnosing production failures, check the Netlify Function logs for these safe categories:

- `storage_env_missing` - one or both Supabase storage environment variables are not available to the deployed function runtime.
- `storage_insert_failed` - Supabase environment variables are present, but the REST insert failed. Check the table name, SQL migration, service role key and Supabase project URL.
- `email_env_missing` - Resend notification variables are not configured. This is acceptable while email is intentionally deferred if Supabase storage succeeds.
- `email_send_failed` - Resend variables are present, but Resend rejected or failed the send.
- `no_durable_path_available` - neither Supabase storage nor email notification succeeded, so the function correctly returned `503`.

These diagnostics must not include service keys, API keys, raw payloads, supplier costs, internal pricing, lead scores, admin priority or internal notes.

## SQL Migration

Apply this manually in the kitchen Supabase project only. Do not run it against Operon Flooring or Oz Timber projects.

```sql
create table if not exists public.kitchen_request_reviews (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  suburb text,
  property_type text not null check (property_type in ('house', 'townhouse', 'apartment', 'strataApartment', 'notSure')),
  project_stage text not null check (project_stage in ('planning', 'quoteInHand', 'readyForMeasure', 'urgent', 'notSure')),
  has_current_quote boolean,
  has_photos_or_plans boolean,
  budget_range text,
  preferred_next_step text not null check (preferred_next_step in ('planningEstimate', 'quoteReview', 'siteMeasure', 'scopeDiscussion')),
  message text not null,
  marketing_opt_in boolean not null default false,
  source_route text not null default '/request-review',
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,
  status text not null default 'new' check (status in (
    'new',
    'review_needed',
    'contacted',
    'site_measure_offered',
    'site_measure_booked',
    'quoted',
    'won',
    'lost',
    'spam'
  )),
  internal_notes text,
  user_agent text,
  ip_hash text
);

create table if not exists public.kitchen_request_review_files (
  id uuid primary key,
  lead_id uuid not null references public.kitchen_request_reviews(id) on delete cascade,
  created_at timestamptz not null default now(),
  bucket text not null,
  object_path text not null,
  file_name text not null,
  file_type text not null,
  file_size integer not null check (file_size > 0 and file_size <= 4194304),
  category text not null check (category in ('existingQuote', 'photo', 'plan', 'applianceList', 'other')),
  retention_status text not null default 'active' check (retention_status in (
    'active',
    'review_complete',
    'customer_requested_deletion',
    'deleted',
    'retained_for_business_record'
  )),
  review_completed_at timestamptz,
  delete_requested_at timestamptz,
  deleted_at timestamptz,
  deleted_by text,
  delete_reason text
);

create index if not exists kitchen_request_reviews_created_at_idx
  on public.kitchen_request_reviews (created_at desc);

create index if not exists kitchen_request_reviews_email_idx
  on public.kitchen_request_reviews (lower(email));

create index if not exists kitchen_request_reviews_status_idx
  on public.kitchen_request_reviews (status);

create index if not exists kitchen_request_review_files_lead_id_idx
  on public.kitchen_request_review_files (lead_id);

create index if not exists kitchen_request_review_files_created_at_idx
  on public.kitchen_request_review_files (created_at desc);

create index if not exists kitchen_request_review_files_retention_status_idx
  on public.kitchen_request_review_files (retention_status);

create index if not exists kitchen_request_review_files_deleted_at_idx
  on public.kitchen_request_review_files (deleted_at);

alter table public.kitchen_request_reviews enable row level security;
alter table public.kitchen_request_review_files enable row level security;
```

If the table already exists with the earlier Phase 1 status check, apply this migration before using admin-lite lead status updates:

```sql
alter table public.kitchen_request_reviews
  drop constraint if exists kitchen_request_reviews_status_check;

alter table public.kitchen_request_reviews
  add constraint kitchen_request_reviews_status_check
  check (status in (
    'new',
    'review_needed',
    'contacted',
    'site_measure_offered',
    'site_measure_booked',
    'quoted',
    'won',
    'lost',
    'spam'
  ));
```

If the table already exists without attribution fields, apply this additive migration:

```sql
alter table public.kitchen_request_reviews
  add column if not exists referrer text,
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists landing_page text;

create index if not exists kitchen_request_reviews_utm_source_idx
  on public.kitchen_request_reviews (utm_source);

create index if not exists kitchen_request_reviews_utm_campaign_idx
  on public.kitchen_request_reviews (utm_campaign);
```

Until this optional attribution migration is applied, the live request-review function falls back to the legacy lead columns so valid leads are still stored. Apply the migration before expecting `/admin/leads` to show referrer, landing page or UTM details.

If the file metadata table already exists without retention fields, apply this additive migration before launching admin deletion controls:

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

Retention metadata is for admin-only file operations. It does not create public file access, customer file deletion controls, browser-side Supabase writes or automated retention jobs.

## RLS Guidance

Use server-mediated inserts only.

Recommended policy posture for Phase 1:

- No public `select`.
- No browser-side `insert`.
- Netlify Function uses `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`; service role bypasses RLS.
- Add admin read/update policies later only after kitchen authentication and admin roles are implemented.

Do not create policies that allow anonymous reads of leads, contact details, messages or operational notes.

## File Upload Storage

Request-review and quote-review uploads are stored through the server-side Netlify Function only. The browser sends validated file payloads to:

```text
POST /.netlify/functions/kitchen-request-review
```

The function:

- validates file count, type and size
- stores file objects in a kitchen-specific Supabase Storage bucket
- stores safe metadata in `public.kitchen_request_review_files`
- returns only safe acknowledgement data to the browser

Recommended bucket name:

```text
<UPLOAD_BUCKET_NAME>
```

Set Netlify:

```text
OPERON_KITCHENS_UPLOAD_BUCKET=<UPLOAD_BUCKET_NAME>
```

Apply this bucket setup manually in the kitchen Supabase project only:

```sql
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  '<UPLOAD_BUCKET_NAME>',
  '<UPLOAD_BUCKET_NAME>',
  false,
  4194304,
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
```

Recommended storage posture for Phase 1:

- Bucket is private.
- No public object reads.
- No anonymous object uploads.
- Netlify Function uses the service role key server-side.
- Admin-lite lists metadata only; it does not expose signed download URLs yet.

If file upload storage is not configured and a customer submits files, the response will show the request delivery state without pretending files were stored. Supabase lead storage remains the source of truth for the enquiry record.

For controlled upload verification, the safe browser response includes `delivery.fileDeliveryStatus`:

- `stored`: file objects and metadata were stored.
- `not_supplied`: no files were attached.
- `not_configured`: upload storage environment variables are missing.
- `object_upload_failed`: Supabase Storage object upload needs review.
- `metadata_insert_failed`: file metadata table insert needs review.

When a file is attached and storage fails, the response may also include `delivery.fileDeliveryIssue` with a safe category such as `bucket_check_required`, `permission_check_required`, `mime_type_check_required`, `file_size_check_required` or `metadata_schema_check_required`.
It may also include `delivery.fileDeliveryStatusCode`, the numeric HTTP status returned by Supabase Storage. This is safe to expose and helps distinguish missing bucket/project setup from permission or request-format issues.

These statuses are diagnostic categories only. They do not expose service keys, bucket secrets, file contents, supplier costs, lead scores, internal notes or admin priority.

## Admin-lite Lead Operations

The internal `/admin/leads` page uses Netlify Functions and a simple admin token to list and update request-review leads.

Required Netlify environment variable:

```text
OPERON_KITCHENS_ADMIN_TOKEN
```

The browser sends the token only in the `x-operon-admin-token` request header. Netlify Functions compare it server-side. If the token is missing or incorrect, the functions return `401` and do not reveal whether leads exist.

Functions:

- `GET /.netlify/functions/kitchen-admin-leads`
- `POST /.netlify/functions/kitchen-admin-lead-update`

Allowed status values:

- `new`
- `review_needed`
- `contacted`
- `site_measure_offered`
- `site_measure_booked`
- `quoted`
- `won`
- `lost`
- `spam`

Admin-lite updates are limited to `status` and `internal_notes`. The functions reject attempts to update contact details, created dates, pricing, supplier costs, lead scores, admin priority or other unsupported fields.

## Storage Boundary

The public form sends only customer-safe fields:

- contact details
- project details
- quote/photo/plan availability answers
- preferred next step
- message
- privacy and terms acknowledgements
- simple attribution fields from the current URL/referrer when available
- optional uploaded quote/photo/plan/appliance files after browser-side size checks

The server creates:

- `id`
- `created_at`
- `status = 'new'`
- optional `user_agent`
- optional `ip_hash` when `OPERON_KITCHENS_IP_HASH_SALT` is configured

Attribution fields are optional and customer-safe:

- `source_route`
- `referrer`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `landing_page`

The browser must not send or receive supplier costs, internal rates, margin logic, lead scores, admin priority or internal notes.

File upload limits:

- up to 6 files per request
- 4MB maximum per file
- 10MB total per request
- PDF, JPEG, PNG, WebP, HEIC and HEIF only
- SVG, scripts, executables and archives are not accepted

## Production 503 Checklist

If the function is live but returns `503` to a valid POST:

1. Confirm Netlify has redeployed after environment variable changes.
2. Confirm `OPERON_KITCHENS_SUPABASE_URL` is the Supabase project URL, not the dashboard URL.
3. Confirm `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY` is the service role key, not the anon key.
4. Confirm the SQL in this document has been applied to the same Supabase project referenced by the URL.
5. Confirm the table exists at `public.kitchen_request_reviews`.
6. Confirm Netlify Function logs do not show `storage_env_missing`.
7. If logs show `storage_insert_failed`, read the safe status/detail to identify missing table, column mismatch, invalid key or project mismatch.
8. If email is intentionally deferred, `email_env_missing` is expected and should not block success when Supabase storage works.

## Upload Troubleshooting

If lead storage succeeds but files are not stored:

1. Confirm `OPERON_KITCHENS_UPLOAD_BUCKET` exists in Netlify and the site has redeployed.
2. Confirm the bucket exists in the same Supabase project referenced by `OPERON_KITCHENS_SUPABASE_URL`.
3. Confirm `public.kitchen_request_review_files` exists.
4. Confirm the browser response does not show `delivery.fileDeliveryStatus: "not_configured"`.
5. Confirm Netlify Function logs do not show `file_storage_env_missing`.
6. If the response shows `object_upload_failed`, check bucket name, bucket creation, MIME type restrictions and file size limit.
7. If the response shows `metadata_insert_failed`, check `public.kitchen_request_review_files` columns, constraints and RLS/service-role access.

If the response shows `fileDeliveryIssue: "bucket_check_required"`, confirm the bucket exists and exactly matches the Netlify `OPERON_KITCHENS_UPLOAD_BUCKET` value:

```sql
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = '<UPLOAD_BUCKET_NAME>';
```

If the bucket row is missing, rerun the bucket setup SQL in the File Upload Storage section with `<UPLOAD_BUCKET_NAME>` replaced by the exact Netlify bucket value.
