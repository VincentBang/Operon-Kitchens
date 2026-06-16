# Soft Delete Release Preflight

Last updated: 17 June 2026

Purpose: prepare admin-only file soft-delete verification without launching visible delete UI or physical object deletion.

Deployment status: not needed. Soft delete still requires explicit release approval.

## What Soft Delete Means

Soft delete means updating file metadata only:

```text
retention_status = deleted
deleted_at = timestamp
deleted_by = admin_token
delete_reason = selected reason
```

It does not physically remove the Supabase Storage object in this release.

## Required SQL

Retention fields must exist on `public.kitchen_request_review_files`.

Use:

- [Supabase request-review storage notes](./supabase-kitchen-request-reviews.md)
- [Supabase file upload SQL checklist](./supabase-file-upload-sql-checklist.md)

## Function Behaviour

Expected function:

```text
POST /.netlify/functions/kitchen-admin-file-delete
```

Expected rules:

- requires `x-operon-admin-token`
- validates file ID
- validates delete reason
- rejects unsafe browser-supplied fields
- does not accept bucket/object path from browser
- updates metadata only
- does not expose service role key or raw Supabase errors

## Deferred UI

Do not show a visible delete button until Vincent approves:

- retention wording
- operator confirmation copy
- recovery expectations
- whether physical deletion should ever occur

## Stop Conditions

Stop before release if:

- retention SQL is missing
- tests fail
- delete function accepts unsafe fields
- delete function physically deletes objects unexpectedly
- admin page exposes internal fields
