# Request Review And Admin Mobile QA Checklist

Last updated: 2 June 2026

Purpose: guide a local-only visual review of `/request-review` and `/admin/leads` before batching any controlled-testing fixes into an approved release.

Default rule: no deploy. Run this locally unless Vincent explicitly approves production verification.

## Local Setup

Use a local build or dev server only:

```bash
npm test -- --runInBand
npm run lint
npm run build
```

For a local visual pass, run the app locally and keep screenshots inside:

```text
docs/qa-screenshots/
```

Recommended artifact names:

- `request-review-mobile-390x844.png`
- `request-review-mobile-430x932.png`
- `request-review-tablet-768x1024.png`
- `request-review-desktop-1280x800.png`
- `admin-leads-mobile-390x844.png`
- `admin-leads-mobile-430x932.png`
- `admin-leads-tablet-768x1024.png`
- `admin-leads-desktop-1280x800.png`

If using a browser for screenshots, check at:

- 390 x 844 for common iPhone portrait
- 430 x 932 for larger iPhone portrait
- 768 x 1024 for tablet portrait
- 1280 x 800 for desktop baseline

## `/request-review` Mobile Review

Check:

- hero headline fits without awkward wrapping or horizontal scroll
- primary actions are visible and tappable
- required-field guidance is easy to understand
- "what happens after you submit" panel does not push the form too far down awkwardly
- fields have comfortable spacing and labels stay attached to inputs
- selects are easy to tap
- message textarea is not cramped
- optional attachments are clearly optional
- file limits and selected-file summary are readable
- privacy notice appears before submit
- marketing opt-in remains optional and unchecked by default
- terms acknowledgement is visible near submit
- disabled submit state is understandable
- success state explains site measure and written scope confirmation
- error state is visible without layout jump
- no copy promises a final fixed quote, legal approval, compliance approval or guaranteed savings

Suggested screenshots:

- top of page before typing
- middle of form with required fields visible
- attachments and privacy area
- disabled submit state
- success state after a local mocked/manual test where possible

## `/admin/leads` Mobile Review

Check:

- admin page remains visually internal-only
- token field is full width and easy to paste into
- status filter and fetch button are easy to use on phone
- daily-check guidance is visible but not overwhelming
- lead cards are readable in one column
- selected lead detail appears in a predictable place after choosing a lead
- contact details, property, stage and preferred step are easy to scan
- status update select is easy to tap
- internal notes textarea is large enough for follow-up notes
- file metadata section clearly says downloads/deletion/retention are deferred
- attribution fields truncate long URLs safely
- no service keys, supplier costs, internal rates, margins, lead scores, admin priority or hidden pricing logic are visible

Suggested screenshots:

- token/filter area before fetching
- empty state
- lead list with one selected lead
- selected lead detail
- status and internal notes area
- file metadata and attribution area

## Spacing Fix Triage

Only fix issues that affect controlled testing:

- horizontal overflow
- text clipped inside buttons, labels or cards
- submit/CTA blocked by sticky UI
- fields too close together for mobile input
- unclear required/optional distinction
- admin status or notes controls hard to use

Defer:

- full admin redesign
- signed file downloads
- deletion/retention runtime workflows
- CRM pipeline views
- payment or booking flows
- broad public SEO changes

## Current Local QA Notes

2 June 2026 local pass:

- `/request-review` checked at 390 x 844, 430 x 932, 768 x 1024 and 1280 x 800.
- `/admin/leads` checked at 390 x 844, 430 x 932, 768 x 1024 and 1280 x 800.
- No horizontal overflow was found.
- `/admin/leads` remained `noindex,nofollow`.
- `/request-review` sticky mobile CTA and chatbot were removed on the intake route because they could obstruct the form on small screens.
- `/admin/leads` empty/token state was readable on mobile.

## Reporting Format

After review, report:

1. Routes checked
2. Viewports checked
3. Screenshots taken, if any
4. Blockers found
5. Small fixes recommended
6. Deployment status: required, optional or not needed
7. Recommended next local-only task
