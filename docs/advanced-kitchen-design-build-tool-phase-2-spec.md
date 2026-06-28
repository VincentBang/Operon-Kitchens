# Phase 2 Spec: Kitchen Scope Builder

Last updated: 23 June 2026

Deployment status: not needed. Phase 2 is implemented locally and disabled by default.

## Stage Status

Status: local QA / human review.

Phase 2 was implemented after Vincent approved the next stage. The route is intentionally hidden and disabled by default until local human review approves the user experience.

## Route

Preferred route: `/scope-builder`.

Do not expose this route in the public header, footer, chatbot or sitemap while disabled or incomplete.

Runtime file: `src/pages/scope-builder.tsx`.

Feature flag: `NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER=true`.

Default state: disabled, with customer-safe links back to existing estimate, quote-review and request-review pathways.

## Purpose

The kitchen scope builder captures structured scope before quote review or site measure. It is not a CAD tool, design approval tool, final scope confirmation tool or ordering flow.

It helps capture:

- layout type
- rough room dimensions
- ceiling height where known
- wall run and opening notes
- cabinet and storage zones
- appliance position intentions
- benchtop and splashback scope
- demolition, rubbish removal and make-good prompts
- plumbing, electrical, gas, ventilation and lighting review prompts
- access and site-measure constraints

## Outputs

The local Phase 2 output includes:

- structured scope summary
- missing-scope checklist
- measurement preparation checklist
- site-measure preparation checklist
- review-readiness label
- recommended next step to quote review, request review or site measure

## Customer-Safe Wording

Required safety message:

> Site measure and written scope confirmation are required before contract pricing.

Legal prompt:

> Planning guidance only. This is not legal advice.

Do not say or imply:

- final quote
- final price
- approved quote
- certified quote
- legally checked
- compliant outcome
- construction-ready design
- order instantly

## Implementation Notes

- Deterministic logic lives in `src/lib/kitchenScope.ts`.
- The enabled route renders five sections: Layout, Cabinetry, Surfaces, Works and Review.
- The first version does not persist drafts, create Supabase rows, expand file upload, generate drawings or produce project documentation.
- Analytics event names were added to the existing analytics helper only; no new analytics vendor was introduced.
- Tests cover route gating, required validation, deterministic readiness, missing-scope grouping, next-step routing, public navigation hiding and copy guardrails.

## Out Of Scope

- file upload expansion
- Supabase migration
- browser/localStorage draft persistence
- AI generated scope
- drawings, CAD, AR, VR or construction-ready visuals
- payment
- customer accounts
- full CRM
- supplier ordering
- production deploy
- final pricing
- legal/compliance approval

## Phase 2 Test Plan

- scope builder route hidden from header/footer/chatbot by default
- all approved fields render when enabled locally
- required validation is accessible
- summary repeats entered scope facts only
- missing-scope checklist is deterministic
- service relocation or access risk routes toward request review
- detailed scope routes toward site measure
- no 0/100 empty state
- no forbidden public copy
- no service keys or internal fields in browser output
- `/quote`, `/quote/review`, `/request-review`, `/site-measure`, `/admin/leads`, chatbot and public copy guardrails still pass
