# Operon Kitchens Controlled Launch Checklist

Last updated: 2 June 2026

Use this checklist as the hub for controlled testing. Operon Kitchens is still in local-hardening / controlled-testing mode, not aggressive public launch.

## Related Playbooks

- [Controlled testing playbook](./controlled-testing-playbook.md)
- [Request-review and admin mobile QA checklist](./request-review-admin-mobile-qa.md)
- [Lead handling playbook](./lead-handling-playbook.md)
- [Quote review report template](./quote-review-report-template.md)
- [Quote review report readiness checklist](./quote-review-report-readiness-checklist.md)
- [File upload architecture spec](./file-upload-architecture-spec.md)
- [Domain and email launch checklist](./domain-email-launch-checklist.md)
- [Release checkpoints](./release-checkpoints.md)
- [Supabase request-review storage notes](./supabase-kitchen-request-reviews.md)

## Current Default

No deploy.

Do not push to `main`, trigger Netlify deploys, create deploy previews, run clear-cache deploys or perform production verification unless Vincent explicitly approves a release checkpoint.

Local work should use:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

## 1. Local Testing Checklist

Use this before any approved release.

- Check homepage copy and CTAs locally.
- Check `/quote` locally.
- Check `/quote/review` locally.
- Check `/request-review` locally.
- Check `/privacy` and `/terms` locally.
- Check `/admin/leads` static page locally, without expecting live function calls.
- Confirm mobile spacing is usable.
- For mobile screenshots and visual QA, use the [request-review and admin mobile QA checklist](./request-review-admin-mobile-qa.md).
- If manually trialling quote-review reports, use the [quote-review report readiness checklist](./quote-review-report-readiness-checklist.md).
- Confirm Privacy Policy and Terms links appear near forms.
- Confirm marketing opt-in is optional and unchecked by default.
- Confirm no public copy says final fixed quote, guaranteed savings, legal approval, compliance approval, certified/compliant outcome or instant custom kitchen ordering.
- Confirm public/customer-facing surfaces do not expose supplier costs, internal rates, margins, lead scores, admin priority, internal notes, service keys or hidden pricing logic.

## 2. Manual Supabase Checks

Only perform these when Vincent is deliberately checking the live storage setup. Do not change production Supabase directly from Codex.

Lead table:

- Confirm `public.kitchen_request_reviews` exists.
- Confirm valid request-review leads store durably.
- Confirm `status` defaults to `new`.
- Confirm attribution fields are present if the optional migration was applied.
- Confirm client payloads cannot control internal notes, admin priority, lead score, margin or supplier-cost fields.

File metadata table:

- Confirm `public.kitchen_request_review_files` exists before expecting admin file metadata.
- Confirm uploaded file metadata appears only when file object storage succeeds.
- Confirm metadata is kitchen-namespaced and tied to a request-review lead.

Storage bucket:

- Confirm the bucket exists in the same Supabase project used by `OPERON_KITCHENS_SUPABASE_URL`.
- Confirm bucket is private.
- Confirm no public object reads are enabled.
- Confirm no anonymous browser uploads are enabled.
- Confirm Netlify `OPERON_KITCHENS_UPLOAD_BUCKET` exactly matches the bucket id.

See [file upload architecture spec](./file-upload-architecture-spec.md) before expanding upload behaviour.

## 3. Manual Admin Checks

Use `/admin/leads` only with the admin token. Do not paste the token into chat.

- Confirm `/admin/leads` is not linked from the public header or footer.
- Confirm `/admin/leads` uses `noindex,nofollow`.
- Confirm `/admin` is blocked in `robots.txt`.
- Fetch leads with the admin token.
- Confirm test leads appear.
- Update status.
- Add concise internal notes.
- Refresh and confirm status/internal notes persist.
- Confirm source route, landing page and UTM fields display where available.
- Confirm uploaded file metadata displays where available.
- Confirm no service keys, supplier costs, internal rates, margins, lead scores, admin priority or hidden pricing fields are visible.

For status meanings and follow-up style, use the [lead handling playbook](./lead-handling-playbook.md).

## 4. Request-Review Controlled Test

Only run live request-review tests when production verification is explicitly approved.

Use a clearly labelled test lead.

Expected response:

- `ok: true`
- `delivery.stored: true`
- no service keys
- no internal notes
- no margin/supplier cost/internal rate
- no lead score/admin priority
- no final quote wording

If testing attribution:

- use a UTM test URL from the [controlled testing playbook](./controlled-testing-playbook.md)
- confirm Supabase and `/admin/leads` show source fields where available

If testing uploads:

- attach a real small PDF or image
- confirm `delivery.filesStored: true`
- confirm metadata appears in `public.kitchen_request_review_files`
- confirm `/admin/leads` shows metadata only
- do not expect signed downloads until that feature is explicitly approved

## 5. Logs And Runtime Checks

Only check live logs during an approved production test.

Expected:

- no `storage_env_missing`
- no `storage_insert_failed`
- no `no_durable_path_available`
- no service keys, API keys or raw secrets logged
- no raw sensitive payloads logged

File upload diagnostics:

- no `file_storage_env_missing` when upload storage is expected
- no `file_storage_failed` when files should store
- if failure occurs, use safe response fields: `fileDeliveryStatus`, `fileDeliveryIssue`, `fileDeliveryStatusCode`

Email:

- if email is disabled, `email_env_missing` is acceptable
- if email is enabled, confirm no Resend send errors
- email remains notification only; Supabase remains source of truth

## 6. Approved Release Checkpoints

Use [release checkpoints](./release-checkpoints.md). Batch fixes into approved releases to conserve Netlify credits.

Current checkpoint order:

1. Domain / Email / Resend setup
2. Controlled testing fixes
3. File upload MVP
4. Paid quote review / service packaging
5. Broader SEO / content rollout

Do not deploy checkpoint work until Vincent explicitly approves.

## 7. Daily Controlled-Testing Routine

While email is disabled:

- Check `/admin/leads` daily.
- Move obvious test/spam leads to `spam` or `lost`.
- Add concise internal notes after follow-up.
- Keep Supabase as the source of truth.
- Record recurring tester confusion.
- Batch local fixes.
- Avoid one-off deploys for minor edits.

## 8. Deferred Before Wider Launch

Deferred until explicit approval:

- custom domain and branded email activation
- Resend production notification verification
- admin signed file downloads
- file deletion and retention workflows
- proper authenticated admin system
- full CRM pipeline
- paid quote review
- site measure booking/payment
- production analytics integration
- broad SEO/content rollout

## 9. Safety Reminder

Operon Kitchens can provide planning estimates, quote clarity and staged next steps.

It must not promise final fixed quote, legal approval, compliance approval, HBC approval, strata approval, guaranteed savings or instant custom kitchen ordering before site measure and written scope confirmation.
