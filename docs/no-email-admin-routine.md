# No-Email Admin Routine

Last updated: 17 June 2026

Purpose: keep lead handling safe while Resend/domain email remains deferred.

## Daily Routine

While email notifications are off:

1. Open `/admin/leads`.
2. Enter the admin token locally in the page.
3. Fetch latest leads.
4. Filter for `new`.
5. Check any leads from trusted testers or customer traffic.
6. Add a short internal note.
7. Move the lead to the next useful status.

## Suggested Cadence

- controlled testing: check once daily
- active tester day: check morning and evening
- after a known form test: check immediately

## Status Defaults

- `new`: no operator action yet
- `review_needed`: needs quote/scope review
- `contacted`: customer has been contacted
- `site_measure_offered`: site measure suggested
- `site_measure_booked`: site measure arranged outside the app
- `quoted`: written quote path has progressed
- `won`: project won
- `lost`: project not proceeding
- `spam`: invalid or junk submission

## Internal Note Style

Write short, factual notes:

```text
17 Jun: Controlled tester. Asked for quote-review path feedback. Needs follow-up on missing appliance allowance.
```

Do not write:

- supplier costs
- internal rates
- margin or markup
- lead score
- admin priority
- emotional commentary
- legal/compliance conclusions

## When Email Is Enabled Later

Email remains notification only. Keep Supabase and `/admin/leads` as the source of truth.
