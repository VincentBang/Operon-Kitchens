# Soft Delete One-Deploy Checklist

Last updated: 17 June 2026

Purpose: compact checklist for the next approved release that includes the admin-only metadata soft-delete function. This does not approve a visible delete button.

Deployment status: required only after Vincent approves the soft-delete function release. Not needed for this local docs batch.

## Before The Deploy

Run locally:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Confirm:

- `netlify/functions/kitchen-admin-file-delete.ts` is included in the release.
- retention metadata SQL has been applied to `public.kitchen_request_review_files`.
- `/admin/leads` does not show a visible delete button.
- delete requests require `x-operon-admin-token`.
- the function validates file ID and delete reason.
- the function rejects browser-supplied bucket names, object paths and unsafe internal fields.
- the function updates metadata only.
- physical object deletion remains deferred.

## Manual Function Test

Use one controlled test file only.

Expected request shape:

```json
{
  "fileId": "uuid",
  "deleteReason": "duplicate"
}
```

Allowed reasons:

- `customer_request`
- `duplicate`
- `irrelevant`
- `unsafe`
- `retention_cleanup`
- `other`

Expected result:

- response indicates `deleted: true`
- `retention_status` becomes `deleted`
- `deleted_at` is populated
- `deleted_by` is server-side/admin
- `delete_reason` is stored
- subsequent signed download request is blocked for that file

## Safety Checks

The function must not accept or expose:

- bucket names from the browser
- object paths from the browser
- service role key
- raw Supabase error text
- supplier costs
- internal rates
- margin logic
- lead score
- admin priority
- internal notes

Stop if the function physically deletes Storage objects or exposes raw error details.

