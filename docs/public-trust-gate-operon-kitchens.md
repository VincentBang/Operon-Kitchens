# Public Trust Gate: Operon Kitchens

Last updated: 28 June 2026

Deployment status: not deployed. This is a local verification record only.

## Purpose

This gate keeps the public Operon Kitchens experience consistent before the next approved release checkpoint. It covers the shared header, footer, chatbot, upload wording, public links, SEO-route hygiene and customer-safe promises.

## Brand And Layout

- Header and footer use the approved Operon Kitchens PNG logo assets from `public/brand`.
- Footer logo alt text is `Operon Kitchens logo`.
- Footer is intentionally compact and grouped into four public columns: Quote & review, Services, Guides, and Areas & company.
- Public navigation does not link to `/admin/leads`, `/design-brief` or `/scope-builder`.
- The footer uses the exact trust sentence: Operon Kitchens is a separate customer-facing kitchen renovation brand. Planning guidance only. Site measure and written scope confirmation are required before contract pricing.
- Footer copyright line is present: © 2026 Operon Kitchens. All rights reserved.

## Chatbot

- Launcher uses the two-line safe label: Ask Operon / Kitchen scope guidance.
- Header reads: Operon Kitchens Assistant.
- Subtitle reads: Scope, quote and site-measure guidance.
- Opening message says the assistant does not provide final pricing or legal advice.
- Quick prompts are separate buttons, not concatenated text.
- Helpful pathways link only to customer-safe public routes: `/quote`, `/quote/review`, `/request-review` and `/site-measure`.

## Link Hygiene

- `/pc-sums-provisional-sums` is a short public alias for the existing canonical guide `/kitchen-pc-sums-and-provisional-sums`.
- Canonical output for the short alias resolves to `/kitchen-pc-sums-and-provisional-sums`.
- `/kitchen-quote-exclusions` remains a planned guide only and is not linked from the public footer until approved and built.
- Area links in the footer are deliberately limited to high-value Sydney examples plus `View all areas`.

## Upload Wording

Request-review file wording is acceptable locally because the repo includes a server-mediated Netlify Function, Supabase lead storage adapter and kitchen file storage adapter. Production upload verification remains an approved-release task and is not part of this local trust gate.

Pages that do not submit files should continue using preparation language rather than promising upload completion.

## Customer-Safe Copy

Public copy must not promise:

- final fixed quotes
- guaranteed savings
- legal approval
- compliance approval
- strata approval
- HBC approval
- instant custom kitchen ordering

Use planning estimate, indicative range, review prompts, site measure, written scope confirmation and not legal advice language instead.

## Remaining Gate

Before the next approved deploy, run the local baseline:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Then use `docs/release-smoke-check-pack-2026-06-17.md` for one batched smoke check only after Vincent approves a release.
