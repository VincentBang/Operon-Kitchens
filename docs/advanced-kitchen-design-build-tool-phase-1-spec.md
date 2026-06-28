# Phase 1 Spec: Structured Design Brief Assistant

Last updated: 23 June 2026

Deployment status: not needed. Phase 1 is implemented locally and disabled by default.

## Stage Status

Status: local QA / human review.

Phase 1 was implemented after Vincent approved the Phase 0 packet. The route is intentionally hidden and disabled by default until local human review approves the user experience.

## Route

Preferred route: `/design-brief`.

Do not expose this route in the public header, footer, chatbot or sitemap while disabled or incomplete.

Runtime file: `src/pages/design-brief.tsx`.

Feature flag: `NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_DESIGN_BRIEF=true`.

Default state: disabled, with customer-safe links back to existing estimate, quote-review and request-review pathways.

## User Stories

- As an early-stage homeowner, I want to describe my kitchen goal, property and timing so I know whether to start with an estimate, quote review or site measure.
- As a customer with one or more quotes, I want to record quote status and available documents so I know whether quote review is the right next step.
- As an apartment/strata customer, I want access and building constraints captured early so I understand why human review may be recommended.
- As an Operon operator, I want a structured summary that is easier to review than a vague enquiry message.

## Fields

### Required For First Useful Output

- suburb or postcode
- property type
- renovation stage
- existing quote status
- current kitchen problems or primary reason for renovating
- privacy acknowledgement if data is submitted to backend later

### Optional But Recommended

- occupant role
- timing range
- must-have outcomes
- preferred layout direction
- style direction
- storage priorities
- appliance intentions
- rough budget range
- measurements available
- rough plan available
- photos available
- written quote available
- appliance specifications available
- apartment/strata status
- lift access
- parking/access concerns
- restricted work hours
- known approval requirement
- known structural changes
- known service relocation

## Validation Rules

- Required fields must show accessible validation messages.
- Free-text fields should be trimmed and length-limited.
- Internal fields such as supplier costs, margin, lead score, admin priority and internal notes must be rejected if a backend submission is later added.
- Do not place sensitive values in URLs.
- Browser storage is not allowed by default for personal/property answers unless separately approved.

## Decision Routing

Decision logic must be deterministic and unit-tested.

- Existing written quote: primary `/quote/review`, secondary `/request-review`.
- No quote and early planning: primary `/quote`, secondary future scope builder when enabled.
- Complex apartment, strata, access, structural or service-relocation concern: primary `/request-review`.
- Measurements/scope substantially prepared and customer is ready for project-specific review: primary `/site-measure`.
- Conflicting or high-risk conditions: prioritise human review over automated routing.

Do not redirect immediately. Show the summary and explain the recommendation.

## Output: Design Brief Summary

The summary must repeat only what the customer entered.

Do not infer:

- final dimensions
- construction feasibility
- compliance status
- legal status
- final price
- supplier availability

## Output: Missing-Information Checklist

Group missing items under:

- property and access
- measurements and plans
- appliances and services
- scope and finishes
- quote and site-measure readiness

Each item needs a short reason and whether it is helpful, important or review recommended.

## Output: Readiness State

Avoid 0/100.

Use:

- Getting started
- Core context added
- More scope detail would help
- Ready for the next planning step

Numeric readiness can be considered later only with transparent calculation and enough data.

## UI States

- Intro state explaining what the design brief does and does not do.
- Progressive form sections.
- Back/next navigation.
- Review screen before completion.
- Result screen with summary, missing-info checklist and recommended pathway.
- Empty state for partial progress.
- Safe error state for validation or future save failure.

## Accessibility Requirements

- Semantic form labels.
- Fieldsets or grouped controls for card-style choices.
- Keyboard-accessible navigation.
- Clear focus handling between steps.
- Accessible validation messages.
- Buttons with descriptive names.
- No horizontal overflow at 360px/390px.

## Analytics Events

Define through existing analytics abstraction only. Do not introduce a new vendor.

Potential events:

- `design_brief_started`
- `design_brief_section_completed`
- `design_brief_review_viewed`
- `design_brief_completed`
- `design_brief_pathway_selected`
- `design_brief_abandoned`

Do not send sensitive free-text answers. Allowed analytics properties:

- step identifier
- pathway
- property category
- quote-status category
- completion state

## Acceptance Criteria

- Route is locally testable but hidden/disabled by default.
- Public navigation does not expose incomplete feature.
- All required fields render and validate.
- Optional fields remain optional.
- Review screen reflects entered data only.
- Missing-information checklist is deterministic.
- Pathway routing is deterministic.
- Empty state does not show 0/100.
- Safety message appears: site measure and written scope confirmation are required before contract pricing.
- Legal/contract prompts say planning guidance only and not legal advice.
- No misleading upload wording appears.
- No internal pricing/admin fields appear in customer-facing components or responses.
- `/quote`, `/quote/review`, `/request-review`, `/site-measure`, `/admin/leads`, chatbot and public copy guardrails still pass.

## Local Implementation Notes

- Deterministic logic lives in `src/lib/designBrief.ts`.
- The enabled route renders five sections: Context, Goals, Information, Access and Review.
- The review screen shows readiness, recommended pathway, entered-fact summary and missing-information checklist.
- The first version does not persist drafts, create Supabase rows, expand file upload, generate layouts or produce a quote.
- Analytics event names were added to the existing analytics helper only; no new analytics vendor was introduced.
- Tests cover route gating, required validation, deterministic routing, missing-information grouping, public navigation hiding and copy guardrails.

## Out Of Scope

- file upload expansion
- supplier ordering
- payment
- customer accounts
- production Supabase migration
- production deploy
- visual planning
- report PDFs
- AI summarisation
- final layouts
- final quote/pricing
- legal/compliance approval

## Phase 1 Test Plan

- design brief route hidden from header/footer/chatbot by default
- all approved fields render when enabled locally
- required validation is accessible
- back navigation preserves permitted draft state
- summary repeats entered data only
- missing-information groups are deterministic
- existing quote routes toward `/quote/review`
- early planning routes toward `/quote`
- complex strata/access/service risk routes toward `/request-review`
- prepared scope routes toward `/site-measure`
- high-risk conflicts prefer human review
- no 0/100 empty state
- no forbidden public copy
- no service keys or internal fields in browser output
