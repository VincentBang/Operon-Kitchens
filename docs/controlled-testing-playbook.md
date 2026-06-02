# Controlled Testing Playbook

Last updated: 2 June 2026

Purpose: guide Vincent through manual testing while Operon Kitchens remains in controlled launch.

## Who Should Test

Start with Vincent and 2-3 trusted people. Ask them to submit fake enquiries only.

Use clear test names such as:

- `Operon Test Lead`
- `Trusted Tester 1`
- `Apartment Quote Review Test`

## Test URLs

Use normal paths:

- `/`
- `/quote`
- `/quote/review`
- `/request-review`
- `/admin/leads`

Use a UTM test URL for attribution:

```text
https://operonkitchens.netlify.app/request-review?utm_source=trusted_test&utm_medium=manual&utm_campaign=controlled_testing&utm_content=request_review
```

## Request-Review Test

1. Open `/request-review`.
2. Complete contact and project fields.
3. Acknowledge privacy and terms.
4. Submit a fake enquiry.
5. Confirm the success state is clear.
6. Record any confusion points.

Do not promise customers final pricing, legal approval, compliance approval or guaranteed savings.

## Admin-Lite Test

While email is off, check `/admin/leads` daily during controlled testing.

1. Open `/admin/leads`.
2. Enter the admin token.
3. Fetch leads.
4. Confirm the new test lead appears.
5. Confirm source route, landing page and UTM fields if supplied.
6. Update status.
7. Add internal notes.
8. Confirm no supplier costs, internal rates, margins, lead scores, admin priority, service keys or hidden pricing logic are visible.

Suggested status flow:

- `new`
- `review_needed`
- `contacted`
- `site_measure_offered`
- `site_measure_booked`
- `quoted`
- `won`
- `lost`
- `spam`

## What To Record

For each tester, record:

- where they started
- what they expected
- where they hesitated
- whether the estimate/review promise was clear
- whether privacy/terms language felt trustworthy
- whether they understood site measure and written scope requirements
- whether mobile layout caused friction

## What To Fix During Controlled Testing

Fix only conversion or operational blockers:

- unclear CTA
- confusing form field
- broken local route
- admin readability problem
- mobile spacing issue
- unsafe or overpromising wording
- missing privacy/terms clarity

Avoid:

- broad SEO expansion
- payment
- full CRM
- customer login
- supplier API
- aggressive new pages
- repeated Netlify deploys

## Daily Manual Checklist

- Check `/admin/leads`.
- Update lead statuses.
- Add concise internal notes.
- Confirm no internal fields leak.
- Review any tester confusion.
- Batch fixes locally.
- Deploy only at an approved release checkpoint.
