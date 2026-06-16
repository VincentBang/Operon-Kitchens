# Admin Operations Weekly Review

Last updated: 17 June 2026

Purpose: keep `/admin/leads` useful during controlled testing while email, full CRM and customer accounts remain deferred.

Deployment status: not needed. This is an internal operations document.

## Weekly Review Checklist

1. Fetch all `new` leads.
2. Fetch all `review_needed` leads.
3. Confirm every real lead has a status.
4. Confirm every real lead has a next action in internal notes.
5. Confirm internal notes are factual and safe.
6. Confirm UTM/source fields are useful where supplied.
7. Confirm uploaded file metadata appears where expected.
8. Confirm no browser response exposed service keys or internal pricing/admin fields.
9. Confirm no stale spam/test leads are sitting in `new`.
10. Confirm any tester confusion was recorded in the feedback scorecard.

## Status Review

Use statuses consistently:

- `new`: not yet triaged
- `review_needed`: needs scope/quote review before follow-up
- `contacted`: customer has been contacted
- `site_measure_offered`: site measure has been suggested
- `site_measure_booked`: site measure has been accepted or scheduled
- `quoted`: written quote/scope path has moved forward separately
- `won`: customer proceeded
- `lost`: customer did not proceed
- `spam`: no action needed

## Notes Review

Good notes:

- state what was checked
- state what is missing
- state the next safe action
- avoid legal/compliance conclusions
- avoid supplier/internal pricing language

Bad notes:

- final price promises
- compliance conclusions
- supplier cost comparisons
- margin comments
- vague reminders with no next step

## Weekly Output

At the end of each week, record:

- lead count
- real lead count
- test lead count
- status distribution
- unresolved blockers
- customer confusion points
- admin friction points
- next local-only improvement

