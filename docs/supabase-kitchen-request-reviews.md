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

create index if not exists kitchen_request_reviews_created_at_idx
  on public.kitchen_request_reviews (created_at desc);

create index if not exists kitchen_request_reviews_email_idx
  on public.kitchen_request_reviews (lower(email));

create index if not exists kitchen_request_reviews_status_idx
  on public.kitchen_request_reviews (status);

alter table public.kitchen_request_reviews enable row level security;
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

## RLS Guidance

Use server-mediated inserts only.

Recommended policy posture for Phase 1:

- No public `select`.
- No browser-side `insert`.
- Netlify Function uses `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY`; service role bypasses RLS.
- Add admin read/update policies later only after kitchen authentication and admin roles are implemented.

Do not create policies that allow anonymous reads of leads, contact details, messages or operational notes.

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

The server creates:

- `id`
- `created_at`
- `status = 'new'`
- optional `user_agent`
- optional `ip_hash` when `OPERON_KITCHENS_IP_HASH_SALT` is configured

The browser must not send or receive supplier costs, internal rates, margin logic, lead scores, admin priority or internal notes.

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

## File Uploads

File uploads are not enabled in this intake endpoint. Customers should use the quote review pathway for upload guidance until kitchen-scoped storage, validation and retention rules are implemented.
