# Sitewide Professional Polish Audit

Last updated: 2026-06-12

## Status

Local-only audit. No deploy, no push, no Netlify preview and no production verification were performed.

## Scope

This pass checks the conversion-grade public experience before new SEO page expansion. The goal is to keep Operon Kitchens clean, premium, quote-first and customer-safe while preserving the existing controlled-launch infrastructure.

## Pages Checked

- `/`
- `/quote`
- `/quote/review`
- `/request-review`
- `/site-measure`
- `/quote-review-service`
- `/design-specification-package`
- `/how-it-works`
- `/kitchen-renovation-process`
- `/areas`
- `/areas/mosman`
- `/faqs`
- `/privacy`
- `/terms`
- `/admin/leads` for admin crawl/noindex posture only

## Issues Fixed Locally

### Shared Layout Spacing

- Fixed shared article heading spacing used by guide and education pages.
- Removed the negative article heading margin that could make `/kitchen-renovation-process` headings and content feel too close.
- Increased responsive gaps for article sections, guide summary cards and FAQ stacks.
- Added visual regression coverage so the negative heading margin does not return.

### Footer

- Footer is organised into four columns: Quote & review, Services, Guides, Areas & company.
- `Request review` sits under Quote & review.
- Visible suburb links are limited, with `View all areas` for the broader index.
- Footer logo uses `alt="Operon Kitchens logo"` and compact sizing rules.
- Footer copy uses: `Operon Kitchens is a separate customer-facing kitchen renovation brand. Planning guidance only. Site measure and written scope confirmation are required before contract pricing.`
- Copyright line is present: `© 2026 Operon Kitchens. All rights reserved.`
- Public footer does not link to `/admin/leads`.

### Chatbot

- Launcher text is `Need help with scope? Ask Operon`.
- Header is `Operon Kitchens Assistant`.
- Subtitle is `Scope, quote and site-measure guidance`.
- Opening copy says it does not provide final pricing or legal advice.
- Quick prompts are separate buttons.
- Chatbot routes users to estimate, quote review, request review and site measure paths.

### Upload Wording

- Broad public CTAs were softened from upload-first language to `prepare`, `add quote details`, `review existing quote` or `prepare photos, plans and written quote details`.
- The request-review and quote-review attachment notices remain because controlled attachment handling exists in the intake flow.
- Public copy still avoids implying that file upload is required to complete the planning estimate.

### Quote-First Conversion

- Homepage uses a quote-first hierarchy: start estimate, review existing quote, request review and prepare for site measure.
- `/quote` explains the 3–5 minute estimate flow and sets expectations for planning range, confidence, assumptions, exclusions and next step.
- `/quote/review` avoids prototype wording, avoids a harsh `0/100` first impression, and groups the checklist into customer-friendly quote-review categories.
- `/areas` functions as a quote-risk hub rather than only a suburb link index.
- `/faqs` is grouped around estimate, quote review, scope, site measure, apartment/strata, NSW prompts, materials and using Operon Kitchens.

### Technical Polish

- Dynamic `<title>` elements in shared dynamic page templates were converted to template strings to avoid multi-text-node title warnings during local rendering.
- Local build confirms `/faqs` and `/kitchen-renovation-process` are included in the static export route list.

## Issues Deferred

- No production verification until Vincent approves a release checkpoint.
- No Netlify deploy or push while credits are constrained.
- No broad SEO expansion until this polish batch is reviewed.
- File upload product expansion, admin deletion UI, retention automation, payment, full CRM and customer accounts remain deferred.
- Final designer/vector logo refinement remains separate from this polish pass.

## Visual QA Notes

Representative local browser checks should continue using:

- 1440px desktop
- 1280px desktop
- 768px tablet
- 390px mobile
- 360px mobile

Primary visual risks to watch before the next release:

- mobile sticky CTA over important lower-page cards
- chatbot launcher overlap on small screens
- long guide headings on 360px mobile
- footer logo sizing on narrow screens
- admin lead cards on phone widths

See also: [Sitewide layout QA](./sitewide-layout-qa.md).

## Deployment

Deployment not needed for this local pass. Bundle these changes into a future approved release checkpoint.
