# Signed Download One-Deploy Checklist

Last updated: 17 June 2026

Purpose: compact checklist for the next approved release that includes admin signed downloads. Use this only after Vincent approves one deploy.

Deployment status: required only after Vincent approves the signed-download release. Not needed for this local docs batch.

## Before The Deploy

Run locally:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Confirm:

- `netlify/functions/kitchen-admin-file-download.ts` is included in the release.
- `/admin/leads` shows file metadata and a `Download` button.
- `OPERON_KITCHENS_SUPABASE_URL` is configured in Netlify.
- `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY` is configured in Netlify.
- `OPERON_KITCHENS_ADMIN_TOKEN` is configured in Netlify.
- `OPERON_KITCHENS_UPLOAD_BUCKET` is configured in Netlify.
- Supabase bucket is private.
- `public.kitchen_request_review_files` contains metadata for the controlled test file.

## One Controlled Live Test

1. Submit one `/request-review` test lead with a small PDF or image.
2. Open `/admin/leads`.
3. Enter the admin token.
4. Select the test lead.
5. Confirm file name, category, type, size and retention status are visible.
6. Click `Download`.
7. Confirm a new tab opens and the file loads through a short-lived Supabase signed URL.

## Expected Responses

- missing token: `401`
- invalid token: `401`
- malformed file ID: `400`
- missing file metadata: safe `404`
- deleted file: safe conflict response
- valid file: `200` with `downloadUrl` and `expiresInSeconds`

## Safety Checks

The browser response must not include:

- service role key
- API keys
- raw Supabase error text
- supplier costs
- internal rates
- margin logic
- lead score
- admin priority
- internal notes

Stop after one controlled verification unless Vincent explicitly approves more production testing.

