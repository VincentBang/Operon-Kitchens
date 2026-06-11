# Operon System UI Alignment

Last updated: 8 June 2026

## Purpose

This note records the local-only Operon Kitchens UI/UX alignment pass against the future Operon System brand direction. Operon Flooring was used only as a public visual reference for rhythm, restraint, navigation discipline, footer structure, button tone and quote-first customer flow.

Deployment status: not deployed.

## Pages Reviewed

- `/`
- `/quote`
- `/quote/review`
- `/how-it-works`
- `/kitchen-renovation-process`
- `/areas`
- `/faqs`
- `/request-review`
- `/quote-review-service`
- `/site-measure`
- `/design-specification-package`
- `/privacy`
- `/terms`
- `/admin/leads`

## Components Reviewed

- `src/components/PublicLayout.tsx`
- `src/components/KitchenChatbot.tsx`
- `src/components/QuoteWizard.tsx`
- `src/components/steps/EstimateSummaryStep.tsx`
- `src/components/steps/UploadDocumentsStep.tsx`
- `src/styles/globals.css`

## Shared Design Problems Found

- Some quote surfaces still felt like internal wizard tooling rather than a guided consultation product.
- `/quote` metadata and wizard headline used generic wording.
- Step labels used internal/product wording such as `Uploads` and `Summary` instead of customer-friendly labels.
- The estimate summary needed a clearer path from planning estimate to request review, quote review and site-measure preparation.
- The How It Works page and kitchen renovation process guide were too close in positioning and needed clearer separation.

## Operon System Patterns Adopted

- White page/header chrome with compact navigation and restrained primary CTA.
- Deep navy / muted gold / warm white tone through existing design tokens.
- Compact footer structure with quote-first columns and limited Sydney area links.
- Quote-first customer journey: estimate, quote review, request review, site measure.
- Calm cards, restrained borders, low-height header and practical conversion links.
- Customer-safe planning language: planning estimate, review prompts, site measure required, written scope confirmation required.

## Pages Changed In This Pass

- `/quote`
  - Updated metadata to describe a Sydney kitchen renovation planning estimate.
  - Changed wizard H1 to `Start a Sydney kitchen renovation planning estimate`.
  - Added 3–5 minute reassurance and reward preview copy.
  - Renamed step labels to customer-friendly labels: Project, Property, Layout, Inclusions, Finishes, Services, Quote details, Contact, Estimate.
  - Reframed quote-details step away from upload-first language.
  - Added final summary CTAs to request review, review existing quote and prepare for site measure.

- `/how-it-works`
  - Repositioned as the trust bridge: how estimates and quote review work in Sydney.
  - Renamed the main process section to the five-step Operon Kitchens path.

- `/kitchen-renovation-process`
  - Reworked the education data into a ten-step Sydney kitchen renovation process guide from planning estimate to written scope.

## Already-Aligned Local Work Noted

- Homepage already follows a quote-first structure with estimate and quote-review CTAs.
- `/quote/review` already has product-style quote-review positioning, sample result and safer review-readiness copy.
- `/areas` already acts as a quote-risk hub rather than a suburb link index.
- `/faqs` already has grouped trust/objection-handling sections.
- Footer already uses four compact columns, corrected brand sentence spacing, copyright line and smaller logo sizing.
- Chatbot already uses safer copy, separate quick prompts and estimate/review/request/site-measure pathways.

## Remaining Visual Risks For Human Review

- Review the homepage hero, header logo size and CTA wrapping at 1440px, 1280px, 390px and 360px.
- Check that the chatbot does not cover the hero estimate card or sticky CTA on small mobile screens.
- Review `/quote` wizard spacing on mobile after the new reward copy.
- Review `/quote/review` file-selection area against the current file-upload readiness decision before release.
- Review admin lead cards on mobile for internal usability only.

## Deployment

Deployment is not needed for this local alignment pass. Batch these changes into a future approved release checkpoint after visual review.
