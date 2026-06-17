# Local Viewport Review: 17 June 2026

Purpose: record a browser-backed local viewport check for the current Operon Kitchens release candidate before any approved deployment.

Deployment status: not needed. This was a local `next dev` review only.

## Routes Checked

- `/`
- `/quote/review`
- `/request-review`
- `/site-measure`
- `/admin/leads`

## Viewports Checked

- `1440 x 900`
- `1280 x 800`
- `768 x 1024`
- `390 x 844`
- `360 x 800`

## Result

No layout blocker was found in the checked route group.

Confirmed locally:

- all checked routes returned `200`
- no horizontal overflow at checked widths
- each checked route rendered one clear H1
- public pages rendered the public header and footer
- `/admin/leads` intentionally rendered without public header/footer
- `/admin/leads` included `noindex,nofollow`
- public pages did not link to `/admin/leads`
- checked public routes did not show `scope??Ask`
- checked public routes did not show `brand.Planning`
- checked public routes did not show final fixed quote, guaranteed savings, legal approval, compliance approval, service-key, supplier-cost, lead-score or admin-priority claims

## Copy Tightening Completed

The viewport scanner highlighted public `strata approval` wording that could read too certain. Customer-facing copy was tightened to use safer wording such as:

- `strata approval or notification review`
- `strata or owners corporation approval review`
- `Strata review likely`

Internal field names such as `strataApprovalRequired` remain unchanged because they are code model fields, not customer-facing claims.

## Admin Notes

`/admin/leads` includes warning text that says the admin page does not expose supplier costs or lead scores. That is acceptable internal protective copy and remains behind the admin route, which is `noindex,nofollow` and omitted from public navigation.

## Release Recommendation

The trust/visual polish bundle remains suitable for one future approved release.

If Vincent chooses to deploy, use `docs/release-smoke-check-pack-2026-06-17.md` and stop after one approved deploy/smoke-check cycle.

## Still Deferred

- production deploy
- production verification
- Netlify setting changes
- production Supabase changes
- file-upload signed-download live verification
- visible delete button
- physical file deletion
- retention automation
- payment
- customer auth
- full CRM
