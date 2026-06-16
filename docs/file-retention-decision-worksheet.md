# File Retention Decision Worksheet

Last updated: 17 June 2026

Purpose: decide future retention rules for uploaded quotes, photos, plans and appliance lists.

Deployment status: not needed. Do not implement retention automation from this worksheet.

## Decisions Needed

1. How long should free request-review uploads be retained?
2. Should files be deleted after review completion?
3. Should files tied to future paid detailed review be retained longer?
4. What should happen when a customer requests deletion?
5. Who can approve deletion?
6. Should physical Storage object deletion happen, or metadata-only soft delete first?
7. What business/accounting/legal record reasons require retention?
8. What wording should appear in Privacy Policy before automation launches?

## Current Safe Default

During controlled testing:

- keep files private
- show metadata only to token-gated admin
- use short-lived signed downloads only after admin click
- allow metadata soft-delete only after approved release
- do not run retention automation
- do not publish a fixed retention period until Vincent approves it

## Future Retention States

- `active`
- `review_complete`
- `customer_requested_deletion`
- `deleted`
- `retained_for_business_record`

## Privacy Wording To Confirm Later

Before automation launches, Privacy should explain:

- uploaded files may contain property/personal information
- files are used for estimate/review/site-measure follow-up
- files may be deleted on request where legally and technically possible
- some records may be retained for reasonable business, accounting or legal reasons

## Do Not Implement Yet

- automatic deletion jobs
- customer self-service deletion
- public file download links
- permanent signed URLs
- physical deletion without operator approval flow
