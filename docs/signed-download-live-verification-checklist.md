# Signed Download Live Verification Checklist

Last updated: 3 June 2026

Purpose: verify admin signed file downloads after Vincent approves one deploy. Do not use this checklist to trigger a deploy by itself.

Default rule: no deploy. Use only after an approved release.

## Preconditions

Confirm manually:

- Netlify deployed the intended commit.
- `OPERON_KITCHENS_ADMIN_TOKEN` is configured.
- `OPERON_KITCHENS_SUPABASE_URL` is configured.
- `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY` is configured.
- `OPERON_KITCHENS_UPLOAD_BUCKET` is configured.
- Supabase bucket is private.
- `public.kitchen_request_review_files` contains metadata for the test lead.

## Test Lead

Submit a controlled request-review lead with:

- small PDF or image
- safe test name
- safe test email
- message: `Signed download verification test.`
- UTM: `utm_source=test&utm_medium=manual&utm_campaign=signed_download_verification`

## Admin Verification

Open:

```text
https://operonkitchens.netlify.app/admin/leads
```

Steps:

1. Enter admin token.
2. Fetch leads.
3. Select the test lead.
4. Confirm uploaded file metadata appears.
5. Confirm file category, size and MIME type are readable.
6. Click `Download`.
7. Confirm a new tab opens.
8. Confirm the file loads from a short-lived Supabase signed URL.
9. Confirm the admin page shows that the link expires shortly.

## Function Verification

Expected endpoint:

```text
POST /.netlify/functions/kitchen-admin-file-download
```

Expected behaviours:

- missing token returns `401`
- invalid token returns `401`
- malformed file ID returns `400`
- valid token + valid file ID returns `200`
- response includes `downloadUrl`
- response includes `expiresInSeconds`
- response does not include service role key, raw Supabase error, supplier costs, internal rates, margins, lead score, admin priority or internal notes

## Logs

Check Netlify Function logs for:

- no service keys
- no raw file contents
- no broad payload dumps
- no repeated Supabase failures
- safe diagnostic categories only

## Stop Conditions

Stop testing and report if:

- file metadata is missing
- signed URL generation fails
- browser response exposes any secret
- wrong file is downloaded
- signed URL appears public/permanent
- function logs raw secrets or raw file contents

## Deferred

Do not verify:

- delete button
- retention automation
- customer file portal
- bulk download
- file preview

Those are not part of this release candidate.

