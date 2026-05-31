# Operon Kitchens Controlled Launch Checklist

Last updated: 31 May 2026

Use this checklist before sending real traffic to Operon Kitchens. This is a controlled customer-testing launch, not an aggressive public launch.

## Request-review Intake

- Submit a labelled test lead through `/request-review`.
- Confirm the browser response returns `ok: true`.
- Confirm the response includes `delivery.stored: true`.
- Confirm the response does not include service keys, internal notes, margin, supplier costs, internal rates, lead score or admin priority.
- Confirm a row appears in `public.kitchen_request_reviews`.
- Confirm `status` defaults to `new`.
- Confirm `source_route`, `landing_page`, `referrer` and UTM fields are stored when available.
- Confirm the row does not contain client-controlled internal notes, admin priority, lead score, margin or supplier-cost fields.
- If testing uploads, attach a small PDF or image and confirm `delivery.filesStored: true`.
- Confirm a matching row appears in `public.kitchen_request_review_files`.

## Admin-lite Operations

- Open `/admin/leads`.
- Confirm the page is not linked from the public header or footer.
- Confirm the page has `noindex,nofollow`.
- Confirm `/admin` is disallowed in `robots.txt`.
- Fetch leads with the admin token.
- Confirm the test lead appears.
- Update status.
- Add an internal note.
- Refresh and confirm status/internal notes persist.
- Confirm source route, landing page and UTM information display where available.
- Confirm uploaded file metadata displays where available.

## Logs And Security

- Check Netlify Function logs after test submissions.
- Confirm no `storage_env_missing`.
- Confirm no `storage_insert_failed`.
- Confirm no `file_storage_env_missing` when files are attached and storage is expected.
- Confirm no `file_storage_failed` when files are attached.
- Confirm no `no_durable_path_available`.
- Confirm no service keys, API keys or raw secrets are logged.
- Confirm no raw sensitive payloads are logged.
- If email is still disabled, `email_env_missing` is acceptable.
- If email is enabled, confirm no Resend send errors.

## Mobile And Public UX

- Check homepage on mobile.
- Check `/request-review` on mobile.
- Check `/quote` on mobile.
- Check `/quote/review` on mobile.
- Confirm sticky CTAs do not block form fields.
- Confirm chatbot does not block form submission.
- Confirm Privacy Policy and Terms links work from forms.

## Privacy And Terms

- Confirm `/privacy` renders.
- Confirm `/terms` renders.
- Confirm request-review form includes collection notice.
- Confirm marketing opt-in is optional and unchecked by default.
- Confirm no final fixed quote, legal approval, compliance approval or guaranteed savings claims appear.

## Daily Controlled-Launch Routine

- Check `/admin/leads` at least once per day while email is disabled.
- Move obvious test/spam leads to `spam` or `lost`.
- Add internal notes after follow-up.
- Keep Supabase as the source of truth.
- Export or review leads manually if needed before a full CRM is implemented.

## Deferred Before Wider Launch

- Custom domain.
- Verified branded email sender/domain for Resend.
- File retention rules, deletion handling and admin download/review workflow.
- Proper authenticated admin system.
- Full CRM pipeline.
- Paid quote review and site measure booking.
- Production analytics integration.
