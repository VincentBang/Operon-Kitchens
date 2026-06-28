# Advanced Tool Phase 3 Spec — Allowance And Quote-Risk Engine

Last updated: 24 June 2026

Deployment status: not needed.

## Status

Phase 3 is implemented locally inside the disabled-by-default `/scope-builder` review step. It is waiting for local human review before any public exposure, persistence, admin integration or release.

## Purpose

Phase 3 adds a deterministic allowance and quote-risk layer to the kitchen scope builder. It helps a customer and operator see which parts of a kitchen scope may need clarification before relying on a quote total, requesting review or preparing for site measure.

This is not a final quote, legal advice, compliance certification or trade approval.

## Runtime Boundary

Implemented locally:

- `src/lib/allowanceRisk.ts`
- `evaluateAllowanceAndQuoteRisk(input)`
- `/scope-builder` review-step display
- analytics event property updates for local scope-builder events
- local tests

## Out Of Scope

Not implemented:

- Supabase persistence
- Netlify Function changes
- production migrations
- file upload expansion
- payment
- customer login
- full CRM
- supplier workflow
- AI summary generation
- public navigation, footer, chatbot or sitemap exposure

## Inputs

Phase 3 uses the existing Phase 2 `KitchenScopeInput` fields:

- layout and rough dimensions
- openings and fixed-site notes
- cabinet zones
- appliance positions
- benchtop and splashback scope
- demolition and removal
- make-good responsibilities
- service changes
- access constraints
- scope notes

## Outputs

The customer-safe output includes:

- overall risk label
- allowance and quote-risk flags
- missing inclusions to confirm
- customer questions
- recommended pathway
- human-review flags
- safety message

The allowed labels are:

- Lower review risk
- Moderate review risk
- Human review recommended

## Risk Categories

The local engine checks for:

- unclear appliance allowances
- unclear benchtop and splashback assumptions
- demolition, rubbish removal and protection gaps
- make-good responsibilities
- licensed plumbing, electrical, gas, ventilation or lighting review prompts
- apartment, strata, lift, parking, access or work-hour prompts
- incomplete site-condition detail
- site measure and written scope confirmation

## Recommended Pathways

The engine can route to:

- `/request-review` when human review is recommended
- `/quote/review` when allowance or exclusion questions need quote detail review
- `/site-measure` when the scope is clearer but still requires site measure and written scope confirmation

## Customer-Safe Wording

Use:

- planning guidance
- review prompt
- may require confirmation
- human review recommended
- licensed trade review may be needed
- site measure required
- written scope confirmation required
- not legal advice
- project-specific pricing

Do not use:

- final quote
- final price
- approved
- certified
- legally checked
- compliant
- guaranteed saving
- order instantly
- supplier cost
- internal rate
- margin
- lead score
- admin priority

## Safety Message

Phase 3 outputs must keep this message:

`Planning guidance only. Site measure and written scope confirmation are required before contract pricing. This is not legal advice.`

## Test Plan

Local tests should confirm:

- default incomplete scope produces `Human review recommended`
- service relocation and apartment/strata access create human-review flags
- detailed lower-risk scope routes toward site-measure preparation
- output does not include numeric score display such as `0/100`
- output does not include supplier costs, internal rates, lead scores or admin priority
- `/scope-builder` remains disabled by default
- `/scope-builder` is not linked from public layout navigation
- Phase 3 docs are linked from the docs index, task queue and decision log

## Human Review Gate

Before Phase 5 planning begins, Vincent should review `/scope-builder` locally with:

```bash
NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER=true npm run dev
```

Review the final step for:

- whether the allowance prompts are understandable
- whether the labels feel helpful rather than alarming
- whether customer questions are useful for real quote-review follow-up
- whether the recommended pathway feels commercially sensible
- whether the safety wording is clear

Do not expose this route publicly or persist its output until the human review is approved.
