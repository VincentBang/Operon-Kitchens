# Phase 2 Viewport Review: Kitchen Scope Builder

Last updated: 24 June 2026

Deployment status: not needed.

## Scope

This local-only review checked the enabled `/scope-builder` route with:

`NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER=true`

No Netlify deploy, production verification, Supabase change, upload expansion, payment, CRM, supplier workflow or public navigation exposure was performed.

## Viewports Checked

The route was checked locally at:

- 1440 x 900
- 1280 x 900
- 768 x 1024
- 390 x 844
- 360 x 800

## Result

Automated browser metrics found:

- `/scope-builder` rendered locally with the enabled experience.
- The route had no horizontal overflow at the checked viewports.
- The H1 fit within the viewport at desktop, tablet and mobile widths.
- The wizard panel and step navigation fit within the viewport width.
- The mobile step navigation collapsed to compact numbered steps at 390px and 360px.
- The scope-builder route was not linked from the public header or footer.
- The chatbot remained compact and did not cover the H1 or visible form controls at initial mobile load.
- The route continued to use customer-safe wording: site measure and written scope confirmation required, planning guidance only, not legal advice.

## Noted Behaviour

On narrow mobile widths, the chatbot launcher uses the existing compact top-right placement introduced during earlier homepage mobile polish. On `/scope-builder`, this places the icon above the H1 rather than over the form fields. Keep this placement under human review because it is a global mobile chatbot behaviour, not a scope-builder-specific change.

## Remaining Human Review

Phase 2 still requires Vincent's visual/copy review before exposure or Phase 3 implementation.

Human review should check:

- whether the H1 and intro feel premium enough
- whether the five-step flow feels understandable on a phone
- whether the layout options are the right first screen
- whether the missing-scope checklist feels helpful rather than heavy
- whether the recommended next step is commercially useful
- whether the mobile chatbot top-right placement feels acceptable on this route

## Follow-Up Rule

Do not begin Phase 3 allowance and quote-risk implementation until Phase 2 is reviewed and either approved or adjusted.
