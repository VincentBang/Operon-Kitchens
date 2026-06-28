# Phase 3 Viewport Review: Allowance And Quote-Risk Prompts

Last updated: 24 June 2026

Deployment status: not needed.

## Scope

This local-only review checked the enabled `/scope-builder` route after the Phase 3 allowance and quote-risk engine was added.

The route was opened with:

`NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER=true`

No Netlify deploy, production verification, Supabase change, file-upload expansion, payment, CRM, supplier workflow or public navigation exposure was performed.

## Scenario Checked

The review used a deliberately higher-risk apartment scenario so the Phase 3 section rendered meaningful human-review prompts:

- galley kitchen
- rough room dimensions
- cabinet zones and appliances
- new benchtop with unclear splashback assumption
- demolition and make-good not clearly confirmed
- plumbing relocation likely
- electrical upgrade likely
- ventilation unknown
- apartment or strata review
- lift booking or restricted work hours

## Viewports Checked

The route was checked locally at:

- 1440 x 900
- 1280 x 800
- 768 x 900
- 390 x 844
- 360 x 800

## Result

Automated browser metrics found:

- `/scope-builder` rendered locally with the enabled Phase 3 experience.
- The review step included `Allowance and quote-risk prompts`.
- The review step included `Human review recommended`.
- The review step included `Customer questions`.
- The review step included `not legal advice`.
- No horizontal overflow was found at the checked viewports.
- No supplier cost or internal pricing wording appeared in the browser text checks.
- No final quote wording appeared in the browser text checks.

## Mobile Adjustment

The first mobile screenshot showed the global collapsed chatbot icon could visually sit over the risk cards on hidden advanced-tool review pages.

Because `/design-brief` and `/scope-builder` are hidden local-review routes, the local fix was to exclude both routes from the global chatbot shell. This keeps the advanced-tool review surfaces focused and avoids covering risk prompts on mobile.

The route remains hidden from public header, footer, chatbot and sitemap.

## Remaining Human Review

Phase 3 still requires Vincent's visual/copy review before Phase 5 planning.

Human review should check:

- whether `Human review recommended` feels helpful rather than alarming
- whether the missing inclusions are understandable
- whether the customer questions are useful for quote-review follow-up
- whether the recommended pathway to request review feels commercially sensible
- whether the page still feels calm enough on mobile with the sticky CTA

## Follow-Up Rule

Do not begin Phase 5 internal review-console planning until Phase 3 is reviewed and either approved or adjusted.
