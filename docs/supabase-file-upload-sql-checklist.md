# Supabase File Upload SQL Checklist

Last updated: 3 June 2026

Purpose: give Vincent a manual Supabase checklist for Operon Kitchens file upload metadata, private storage and future retention fields.

Do not apply this to Operon Flooring, Oz Timber or shared projects.

## Required Objects

Confirm in the kitchen Supabase project:

- `public.kitchen_request_reviews`
- `public.kitchen_request_review_files`
- private Storage bucket named by `OPERON_KITCHENS_UPLOAD_BUCKET`

Recommended bucket:

```text
<OPERON_KITCHENS_UPLOAD_BUCKET>
```

## File Metadata Table

The file metadata table should include:

- `id`
- `lead_id`
- `created_at`
- `bucket`
- `object_path`
- `file_name`
- `file_type`
- `file_size`
- `category`

Future retention/delete-ready fields:

- `retention_status`
- `review_completed_at`
- `delete_requested_at`
- `deleted_at`
- `deleted_by`
- `delete_reason`

## Retention Migration

Copy only the SQL block from [Supabase request-review storage notes](./supabase-kitchen-request-reviews.md) headed:

```text
If the file metadata table already exists without retention fields
```

Do not paste Markdown headings or `#` characters into the Supabase SQL editor.

## Bucket Posture

Confirm:

- bucket is private
- no public object reads
- no anonymous object uploads
- no browser-side Supabase writes
- service role is used only from Netlify Functions

## RLS Posture

Recommended controlled-testing posture:

- no public `select` on leads
- no public `select` on file metadata
- no browser-side `insert` into file metadata
- admin access is via Netlify Functions and admin token only

## Verification Query Examples

Use safe read checks in Supabase SQL editor:

```sql
select id, lead_id, file_name, file_type, file_size, category, retention_status, created_at
from public.kitchen_request_review_files
order by created_at desc
limit 10;
```

```sql
select status, count(*)
from public.kitchen_request_reviews
group by status
order by status;
```

## Do Not Do

- Do not make the bucket public.
- Do not create anonymous upload policies.
- Do not expose service role key to the browser.
- Do not paste documentation prose into SQL editor.
- Do not add retention automation until Vincent approves a retention period.
