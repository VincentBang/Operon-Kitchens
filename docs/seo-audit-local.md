# Local SEO Audit

Last updated: 11 June 2026

Deployment status: not deployed. This audit covers the local Operon Kitchens repo only.

## Pages Found

Foundation/conversion pages found:

- `/`
- `/quote`
- `/quote/review`
- `/request-review`
- `/site-measure`
- `/quote-review-service`
- `/faqs`
- `/areas`
- `/how-it-works`
- `/privacy`
- `/terms`

Money/guide pages found:

- `/kitchen-renovation-cost-sydney`
- `/kitchen-quote-sydney`
- `/kitchen-quote-review`
- `/apartment-kitchen-renovation-sydney`
- `/kitchen-benchtop-options-after-engineered-stone-ban`
- `/kitchen-renovation-process`
- `/kitchen-pc-sums-and-provisional-sums`
- `/pc-sums-vs-provisional-sums`
- `/kitchen-quote-vs-estimate`
- `/kitchen-renovation-quote-checklist`
- `/why-kitchen-quotes-vary`
- `/questions-before-accepting-kitchen-quote`
- service pages for full renovation, cabinetry/benchtop refresh, benchtop replacement, small, luxury and strata kitchen renovation.

Area pages found:

- `/areas`
- `/areas/[slug]` generated from `src/lib/areas`.

## Pages Missing Or Deferred

- `/kitchen-quote-exclusions` is not present.
- `/pc-sums-provisional-sums` exact URL is not present; closest pages are `/kitchen-pc-sums-and-provisional-sums` and `/pc-sums-vs-provisional-sums`.
- Future suburb URLs such as `/kitchen-renovation-mosman`, `/kitchen-renovation-vaucluse`, `/kitchen-renovation-double-bay`, `/kitchen-renovation-neutral-bay` and `/kitchen-renovation-manly` are not present and should stay deferred until unique content is approved.

## Metadata Findings

- Homepage has a unique title and description aligned to Sydney kitchen estimates and quote review.
- `/quote` has a unique title and description for Sydney kitchen renovation planning estimate.
- `/quote/review` has a unique title and description for kitchen quote review Sydney.
- `/request-review`, `/site-measure`, `/quote-review-service`, `/faqs` and `/areas` have route-specific titles and descriptions.
- Service and education template pages use data-driven title/description fields.

## H1 Findings

- Homepage uses: `Sydney kitchen renovation estimates and quote review before you commit.`
- `/quote` uses: `Start a Sydney kitchen renovation planning estimate`.
- `/quote/review` uses: `Kitchen quote review Sydney — check scope before comparing totals.`
- `/faqs` uses: `Kitchen renovation FAQs for Sydney quotes, scope and site measure`.
- `/areas` uses: `Sydney kitchen renovation service areas and quote review support.`

No current high-confidence one-H1 blocker was found in the audited foundation pages.

## Canonical Findings

- `src/components/PublicLayout.tsx` sets canonical URLs using `NEXT_PUBLIC_SITE_URL` or `https://operonkitchens.com.au`.
- Canonical path is derived from `router.asPath` without query strings.
- No per-page canonical overrides were found.

## Sitemap Findings

- `public/sitemap.xml` exists as a static file.
- `public/robots.txt` references `https://operonkitchens.com.au/sitemap.xml`.
- Admin surfaces are blocked by robots and `/admin/leads` should remain excluded from sitemap.
- Future generated sitemap automation is not present; static sitemap maintenance is required when new SEO pages are added.

## Schema Opportunities

- Homepage uses Organization and LocalBusiness schema.
- FAQ page uses visible FAQ content with FAQ schema.
- Service page template uses Service and FAQ schema.
- Avoid adding new LocalBusiness schema fields until business contact/domain data is final.
- Do not add schema that implies legal, compliance or pricing certainty.

## Internal Linking Gaps

Current internal links are strong across homepage, FAQ, areas, quote review and how-it-works.

Small improvement applied during this pass:

- `/site-measure` now links to `/quote/review` as well as `/quote` and `/request-review`.

Remaining opportunities:

- Add contextual links to future `/kitchen-quote-exclusions` only after the page exists.
- Decide whether an exact `/pc-sums-provisional-sums` URL is needed or whether existing pages are enough.
- Keep future suburb pages connected from `/areas`, not from an overstuffed footer.

## Unsafe Wording Found

No high-confidence unsafe SEO wording was found in the audited foundation pages:

- No final fixed quote claim.
- No legal approval claim.
- No compliance approval claim.
- No guaranteed savings claim.
- No instant custom kitchen ordering claim.
- No public internal pricing/admin field exposure found from local test coverage.

The existing copy uses safe language such as planning estimate, indicative range, review prompts, site measure and written scope confirmation.

## Upload Overpromise Found

The request-review and quote-review flows currently support controlled file preparation/storage pathways. The `/quote` planning estimate step uses safer wording:

- File upload is optional.
- File upload is not required to complete the planning estimate.
- Site measure and written scope confirmation are still required before project-specific pricing.

Continue avoiding “upload now” promises on pages that do not actually submit files.

## Duplicate / Thin Content Risk

- Area hub is positioned as a quote-risk hub, not a suburb link dump.
- Existing service/education pages are data-driven and generally useful, but future suburb pages must not be generated as thin doorway pages.
- Future SEO rollout should build fewer, richer pages with conversion CTAs.

## Phase 1 Foundation Fixes Applied Locally

- `/quote` hero and wizard labels refined with planning estimate, quote review, site measure and written scope journey language.
- `/quote` final summary CTAs refined into clear next-step cards.
- `/site-measure` internal links expanded to include quote review.
- SEO master plan and implementation tracker added.

## Deployment Status

Not deployed. Keep this work local until Vincent approves a release checkpoint.
