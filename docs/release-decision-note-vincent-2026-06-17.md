# Release Decision Note For Vincent

Last updated: 17 June 2026

Purpose: choose the next approved Operon Kitchens release bundle without mixing low-risk public polish with backend file operations by accident.

Deployment status: not needed for this note. This document is local-only and does not approve a deploy, push, production Supabase change or production Netlify change.

## Short Recommendation

If Netlify credits are tight, release the trust/visual polish bundle first and keep the file-upload backend release for a separate approved checkpoint.

Reason: the trust/visual bundle is mostly public copy, layout and conversion polish. The file-upload bundle changes live backend behaviour and needs one controlled production verification with Supabase Storage, admin token auth and Netlify Functions.

## Option A: Trust And Visual Polish Only

Choose this when the priority is a safer public refresh for controlled testing.

Includes:

- homepage, header, footer and CTA polish
- quote/review, request-review and site-measure wording polish
- public trust copy and planning-guidance guardrails
- visual-system alignment with the Operon family
- local tests and static export checks

Does not include:

- live admin signed file downloads
- live metadata soft delete
- production Supabase Storage verification
- domain or Resend email setup
- paid quote review

Go criteria:

- public routes build cleanly
- no final fixed quote, legal approval, compliance approval, HBC approval, strata approval or guaranteed savings claim
- no supplier costs, internal rates, margins, lead scores, admin priority or service keys appear publicly
- Vincent approves one release checkpoint

Verification after one approved deploy:

- smoke check `/`, `/quote`, `/quote/review`, `/request-review`, `/site-measure`, `/faqs`, `/privacy` and `/terms`
- submit one controlled test lead only if Vincent approves
- confirm `/admin/leads` still requires the admin token

## Option B: File-Upload Backend Release

Choose this only when Vincent needs uploaded quote files downloadable by admin during controlled testing.

Includes:

- token-gated signed download function
- admin file download UI
- signed URL path normalisation
- token-gated metadata soft-delete function
- local tests for auth, unsafe mutation rejection and deleted-file handling

Does not include:

- visible delete button unless separately approved
- physical Storage object deletion
- retention automation
- public file URLs
- customer file portal
- browser-side Supabase writes

Required Netlify environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPERON_KITCHENS_ADMIN_TOKEN`
- `SUPABASE_REQUEST_REVIEW_BUCKET`

Required Supabase prerequisites:

- private request-review Storage bucket
- `public.kitchen_request_review_files` metadata table
- no anon `SELECT` on file metadata
- service-role access for admin functions only
- retention metadata columns applied only after Vincent approves the SQL checklist

Go criteria:

- file-upload release preflight is complete
- required env vars are confirmed by Vincent in Netlify, not pasted into chat
- private bucket and metadata table are confirmed in the approved Supabase project
- Vincent approves one deploy specifically for signed download and metadata soft delete

Verification after one approved deploy:

- submit one controlled request-review lead with a safe test file
- open `/admin/leads` with admin token
- generate one short-lived signed download link
- confirm download works without exposing a public file URL
- call the soft-delete function only on the controlled test file metadata
- confirm a deleted file cannot receive a new signed download link
- stop after one controlled verification

## Option C: Combined Trust/Visual Plus File Upload

Choose this only if Vincent wants to spend one larger approved release and accepts the wider blast radius.

Risk:

- visual/public issues and backend file-operation issues become harder to debug separately
- a failed file verification could delay otherwise clean public polish
- production smoke testing takes longer and uses more Netlify/Supabase attention

Use only when:

- Vincent has time for both public route smoke checks and one file-operation verification
- Netlify credits are acceptable
- the file-upload environment variables and Supabase prerequisites are ready before release

## Option D: Keep Local-Only

Choose this when deploy credits or live verification time are too constrained.

Includes:

- keep improving docs, tests and manual trial packs locally
- no public release
- no production Supabase verification
- no Netlify deploy

Best next local work:

- run manual unpaid quote-review trials from controlled leads
- refine report wording from real tester confusion
- keep file-upload release candidate parked until Vincent approves one backend release

## Stop Conditions

Stop before any release if public copy implies:

- final fixed quote
- legal advice
- compliance approval
- HBC approval
- strata approval
- guaranteed savings
- instant custom kitchen ordering

Stop before any file-upload release if:

- the bucket is public
- the metadata table is missing
- admin token auth is missing
- service role key is exposed to the browser
- signed download accepts browser object paths without safe normalisation
- raw Supabase errors are returned to customers
- a function physically deletes Storage objects before policy approval

## Decision Needed

Vincent should choose one:

1. Trust/visual polish only.
2. File-upload backend release only.
3. Combined trust/visual plus file upload.
4. Keep local-only and continue manual quote-review trials.

Default recommendation: choose 1 first, then 2 later if admin file downloads become necessary during controlled testing.
