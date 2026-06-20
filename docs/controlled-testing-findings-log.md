# Controlled Testing Findings Log

Last updated: 20 June 2026

Purpose: record controlled tester findings, local fixes and release-bundle decisions in one place. This is not a deploy approval.

Deployment status: not needed. Keep fixes local until Vincent approves a release checkpoint.

## How To Use This Log

For each finding, record:

- date found
- route or flow
- device or viewport
- severity: blocker, high friction, wording polish or no action
- customer impact
- local fix status
- release bundle decision
- verification notes

Treat a finding as a blocker if it prevents form submission, hides a CTA, creates unsafe final-quote/legal/compliance expectations, exposes internal data or prevents admin lead recovery.

Do not record supplier costs, internal rates, margin logic, lead scores, admin priority, service keys or customer-private file contents.

## Current Open/Waiting Findings

### 2026-06-20: Homepage Final CTA Ghost Buttons Low Contrast

- route or flow: homepage final CTA above footer
- device or viewport: desktop visual smoke check after latest deploy
- severity: high friction
- customer impact: two CTA buttons could look empty because text inherited dark ink on a dark CTA band
- local fix status: fixed locally in `src/styles/globals.css`
- tests: covered by `test/visualSystem.test.ts`
- release bundle decision: include in next trust/visual polish release; do not deploy alone
- verification notes: local static export confirmed `Request review` and `Prepare for site measure` render with white text, subtle border and no horizontal overflow

## Capture Passes

### 2026-06-20: Local Controlled Tester Simulation

- routes checked: `/`, `/quote`, `/quote/review`, `/request-review`, `/admin/leads`
- viewports checked: desktop `1440x900`, mobile `390x844`
- result: no new blocker found
- route status: all checked routes returned `200` using a clean-URL-aware local static server against `out/`
- mobile layout: no horizontal overflow found on checked routes
- CTA visibility: homepage final CTA buttons were readable locally, including `Request review` and `Prepare for site measure`
- quote flow: `/quote` showed `Step 1 of 9`, Step 1 project capture and a visible `Next` control on mobile
- request-review flow: privacy policy link, Terms link, privacy/terms acknowledgement, optional file guidance and submit control were present
- admin flow: `/admin/leads` rendered the token field, status filter and internal lead-operations page without public header/footer leakage
- unsafe-copy scan: no `scope??Ask`, `brand.Planning`, final fixed quote, legal approval, compliance approval, guaranteed savings, service-role-key or instant-ordering wording found in checked rendered pages
- note: inline footer/text links can have smaller text-link dimensions than primary CTAs; this was not treated as a blocker because core action buttons remain visible and tappable
- release decision: keep the existing final CTA fix in the next trust/visual bundle; no standalone deploy needed

## Next Tester Capture Pass

Use one row per tester or test session.

| Date | Tester | Route/flow | Device | Severity | Finding | Local fix needed | Release bundle |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  | `/` |  |  |  |  |  |
|  |  | `/quote` |  |  |  |  |  |
|  |  | `/quote/review` |  |  |  |  |  |
|  |  | `/request-review` |  |  |  |  |  |
|  |  | `/admin/leads` |  |  |  |  |  |

## Weekly Decision

Before asking for any release, summarise:

- blockers found:
- high-friction items found:
- local fixes completed:
- fixes still pending:
- release required, optional or not needed:
- one-deploy smoke check needed:
