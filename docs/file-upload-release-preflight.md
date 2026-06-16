# File Upload Release Preflight

Last updated: 17 June 2026

Purpose: confirm readiness before Vincent approves any file-upload signed-download or soft-delete deploy.

Deployment status: not needed. This document is preflight only.

## Local Code Preflight

Confirm:

- `netlify/functions/kitchen-request-review.ts` stores leads and files through server-side functions.
- `netlify/functions/kitchen-admin-file-download.ts` exists.
- `netlify/functions/kitchen-admin-file-delete.ts` exists if soft-delete is included.
- `/admin/leads` is token-gated and not in public navigation.
- download buttons require the admin token.
- delete button is not visible unless separately approved.
- no browser-side Supabase write path exists.

## Environment Preflight

Required in Netlify before live file verification:

```text
OPERON_KITCHENS_SUPABASE_URL
OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY
OPERON_KITCHENS_ADMIN_TOKEN
OPERON_KITCHENS_UPLOAD_BUCKET
```

Do not expose these values in public code, browser responses, screenshots or chat.

## Supabase Preflight

Confirm manually in the kitchen Supabase project:

- `public.kitchen_request_reviews` exists.
- `public.kitchen_request_review_files` exists.
- bucket named by `OPERON_KITCHENS_UPLOAD_BUCKET` exists.
- bucket is private.
- RLS is enabled on public tables.
- no anonymous public read policy exists for leads or file metadata.
- retention metadata SQL is applied if soft-delete verification is included.

## Local Gate

Run:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

## Approved Live Verification

Use:

- [Signed download live verification checklist](./signed-download-live-verification-checklist.md)

Stop after one controlled test. Do not run repeated production verification loops.
