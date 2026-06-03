# Operon Flooring UI Alignment Audit

Last updated: 3 June 2026

Purpose: record how Operon Kitchens should align with the Operon Flooring public UX while preserving the kitchen-specific quote clarity, quote review, site measure and staged-ordering model.

## Status

Local design alignment pass only.

Deployment not needed until Vincent approves a release checkpoint. Do not deploy, push to `main`, create deploy previews or perform production verification from this document.

## Flooring Patterns To Reuse

Observed reference patterns from Operon Flooring:

- calm sticky header with clear brand, quote path and secondary actions
- first-screen hero with concise eyebrow, headline, support copy, primary quote CTA and secondary quote-check CTA
- proof strip directly under hero
- "Start from where you are now" path cards
- project proof or example profiles after the path cards
- quote clarity section explaining how inputs become a clearer scope
- quote validation section for customers who already have a written quote
- product or service path cards
- project-fit cards by property/customer situation
- Sydney service area support
- FAQ block
- final CTA
- calm footer with quote tools, guides, locations and company/legal links

## Kitchens Pages And Components Aligned

- `src/pages/index.tsx`
  - Homepage section labels and order now follow the Flooring rhythm while using kitchen-specific language.
  - Hero headline is shorter and more responsive.
  - Quote validation section is framed around checking a written kitchen quote before deciding.
  - Example profiles remain clearly labelled as examples, not completed proof.

- `src/styles/globals.css`
  - Visual tokens were nudged toward the Operon family feel: deep charcoal, muted green, warm paper, restrained gold.
  - Hero typography and grid were tightened so the headline and sample estimate card fit desktop and mobile screens.
  - Content hero, CTA, card and request/review surfaces were made more consistent.
  - Mobile chatbot spacing was adjusted so it does not sit directly on top of the sticky CTA.

- `src/components/PublicLayout.tsx`
  - Existing navigation/footer already matches the Operon family structure and was preserved.

- `src/pages/quote/review.tsx`
  - Existing product-style quote-review flow already follows the Flooring quote-check pattern and was preserved.

- `src/pages/request-review.tsx`
  - Existing backend-backed intake was preserved. Styling now inherits the aligned surfaces and CTA treatment.

## What Stays Different For Kitchens

Kitchens has higher project uncertainty than flooring. It must keep stronger staged-ordering and risk language:

- planning estimate, not final quote
- site measure required
- written scope confirmation required
- licensed plumbing/electrical/gas review where relevant
- strata/apartment, HBC, deposit, engineered-stone and older-property/asbestos prompts
- quote review before comparing totals
- no online ordering of a full custom kitchen before site measure and written scope

## Guardrails Preserved

- No supplier costs, internal rates, margin logic, lead score, admin priority, service keys or hidden pricing logic were added to public surfaces.
- No payment, checkout, full CRM, customer login or supplier API was added.
- Existing request-review backend behaviour, Supabase storage, attribution tracking and admin-lite functionality were preserved.
- Operon Flooring files were not modified.

## Remaining Visual Risks

- A browser screenshot pass should be run before the next approved release to inspect desktop, tablet and mobile hero framing.
- `/quote` wizard remains a functional app flow and may need a separate design pass after the homepage and marketing pages are released.
- `/admin/leads` intentionally remains internal and functional rather than styled like a public marketing page.

## Suggested Next Local QA

Use [Request-review and admin mobile QA](./request-review-admin-mobile-qa.md) plus a homepage screenshot checklist before batching this into any future approved release.
