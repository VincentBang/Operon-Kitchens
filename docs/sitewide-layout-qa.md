# Sitewide Layout QA

Last updated: 2026-06-12

## Status

Local-only QA note. No deployment was triggered for this pass.

## Issue Found

The `/kitchen-renovation-process` page uses the shared education/article page layout. Shared article headings had a negative bottom margin, which could make section headings and body content feel cramped or visually overlapped, especially on guide-style pages with long headings.

## Local Fix Applied

- Removed the negative shared article heading margin.
- Increased article body gap with responsive spacing.
- Added safer line-height and bottom spacing for shared article `h2` headings.
- Added zero top margin for content immediately after shared article headings.
- Increased guide summary card spacing and padding.
- Tightened FAQ stack spacing without making mobile cards feel crowded.
- Softened broad public CTA wording from upload-first language to review/details language where the page is not specifically the request-review attachment form.

## Pages to Check Locally

Use desktop and mobile widths before a release checkpoint:

- `/`
- `/quote`
- `/quote/review`
- `/request-review`
- `/quote-review-service`
- `/site-measure`
- `/design-specification-package`
- `/how-it-works`
- `/kitchen-renovation-process`
- `/faqs`
- `/areas`
- `/areas/mosman`
- `/privacy`
- `/terms`
- `/admin/leads` with a test token only

Recommended viewport widths:

- 1440px desktop
- 1280px desktop
- 768px tablet
- 390px mobile
- 360px mobile

## Visual Checks

- No heading/body overlap.
- No horizontal overflow.
- Header logo remains readable.
- Footer logo is compact and not clipped.
- Chatbot launcher does not cover important mobile CTAs or sample cards.
- Article cards stack cleanly on mobile.
- Buttons wrap without clipping.
- Footer columns remain scannable and do not include `/admin/leads`.

## Copy Checks

- Footer copy uses `brand. Planning guidance only.` with spacing after the period.
- Chatbot launcher uses `Need help with scope? Ask Operon`.
- Public pages avoid final-price, approval, certification and guaranteed-savings claims.
- Public pages avoid broad upload-first CTAs unless the page is specifically the request-review attachment form.
- Request-review attachment notices remain clear and permission-based because controlled attachment storage exists there.

## Deployment

Deployment is not needed for this local QA pass. Batch the layout and copy polish into the next approved release checkpoint.
