# Advanced Kitchen Design-Build Tool Master Plan

Last updated: 23 June 2026

Deployment status: not needed. This plan does not approve a deploy, push to `main`, production Supabase change, Netlify setting change, payment, supplier ordering, full CRM or customer account work.

## Executive Strategy

Operon Kitchens should become the kitchen vertical proof layer for the broader Operon System: a construction operating system that turns early customer intent into structured scope, quote-risk intelligence, site-measure readiness and human-review workflows.

The product is not a decorative kitchen planner. The highest-value wedge is operational clarity:

- capture better customer/project data before a site visit
- reduce low-quality enquiries and repeated clarification cycles
- improve scope completeness and quote comparability
- protect commercial assumptions by keeping internal pricing private
- standardise handoff into admin review and future delivery workflows
- create reusable infrastructure for future Operon branches without mixing those branches into Kitchens

## Operating Boundary

All implementation must stay inside `/Users/daibang/Documents/operon-kitchens/**`.

Do not modify Operon Flooring, Oz Timber, parent/root shared configs, production Supabase settings or Netlify site settings. Operon Flooring may be used only as a public visual/UX reference.

## Customer Journey

The safe customer journey remains:

1. Free planning estimate
2. Design brief and scope preparation
3. Quote detail preparation or quote review
4. Request review or site measure
5. Confirmed written scope
6. Project delivery
7. Staged ordering and operational workflow later

Customer-facing language must keep using planning guidance, indicative range, subject to site measure, written scope confirmation required, general guidance only and not legal advice.

## What The System Should Become

The advanced tool should become a staged system that helps customers and operators move from vague renovation intent to review-ready project data:

- structured design brief
- structured kitchen scope
- allowance and quote-risk review
- site-measure preparation
- admin-readable handoff
- controlled human-reviewed reports
- future ordering and delivery readiness

## What It Must Not Become

Do not build or imply:

- instant final quote or instant final pricing
- generic IKEA-style planner
- full CAD
- early photorealistic 3D, AR or VR
- supplier ordering
- payment processing
- product marketplace
- full CRM before workflow proof
- AI construction instructions
- AI final layouts
- legal, strata, HBC, building or compliance approval
- unrelated renovation categories
- bathrooms as an Operon Kitchens service

Visual tooling is subordinate to scope clarity and operational data.

## Roadmap Phases

### Phase 0 — Repository And Baseline Audit

Document the current framework, scripts, routes, `/quote`, `/quote/review`, `/request-review`, `/site-measure`, `/admin/leads`, Supabase service layer, Netlify Functions, chatbot, copy guardrails, tests, analytics, attribution, docs, constraints, captured data and gaps.

### Phase 1 — Structured Design Brief Assistant

Capture project context, property type, suburb/postcode, renovation stage, kitchen problems, style direction, budget range, must-have outcomes, existing quote status, whether photos/plans are available, and apartment/strata/access constraints.

Outputs:

- design brief summary
- missing-information checklist
- recommended pathway to `/quote`, `/quote/review`, `/request-review` or `/site-measure`
- admin-readable payload

### Phase 2 — Kitchen Scope Builder

Capture layout type, dimensions, ceiling height where relevant, openings, cabinet zones, appliance positions, benchtop, splashback, demolition, make-good, service changes and access constraints.

Outputs:

- structured scope summary
- missing-scope checklist
- measurement preparation checklist
- site-measure preparation checklist
- review-readiness status
- admin-review payload

### Phase 3 — Allowance And Quote-Risk Engine

Analyse PC sums, provisional sums, exclusions, unclear trades, demolition/waste, service uncertainty, benchtop/splashback assumptions, appliances, access, apartment/strata constraints, deposit/HBC prompts and material prompts.

Outputs:

- risk summary
- missing-inclusions list
- customer questions
- recommended review pathway
- human-review flags

### Phase 4 — Conceptual Visual Planning

Only after structured data and internal workflows are proven. Potential outputs include basic 2D diagrams, work-zone diagrams, simple SVG layouts, plan/photo annotations and curated mood boards.

Do not present visuals as final, construction-ready, compliant or accurately measured.

### Phase 5 — Internal Review Console Integration

Connect structured customer data with Supabase, request-review leads, admin-lite, statuses, internal notes, manual review, site-measure preparation, written-scope preparation, follow-up tasks and future analytics.

### Phase 6 — Controlled Report Generation

Generate human-reviewed design brief summaries, scope-readiness reports, quote-review reports, site-measure prep sheets, internal trade checklists and written-scope drafts.

Every customer-facing report requires human review before it can be treated as project documentation.

### Phase 7 — Staged Ordering And Delivery Operating System

Long-term only: confirmed selections, cabinet package readiness, benchtop readiness, appliance readiness, access readiness, delivery readiness, trade scheduling inputs, customer portal and later milestones.

## Recommended Execution Order

1. Phase 0 — baseline and architecture
2. Phase 1 — design brief
3. Phase 2 — scope builder
4. Phase 3 — allowance and risk engine
5. Phase 5 — admin integration
6. Phase 6 — report generation
7. Phase 4 — conceptual visual planning
8. Phase 7 — staged ordering and delivery

Admin integration and useful reports create more operational leverage than early visualisation.

## Stage-Gate Rules

- Never implement more than one major stage without explicit approval.
- After each stage, update the tracker, run local checks and stop for review.
- Future continuation prompts should read the tracker, identify the next incomplete approved stage, verify dependencies, implement only that stage, test and stop.
- Do not expose incomplete advanced-tool routes in public navigation, footer, chatbot or sitemap.

## Copy And Safety Constraints

Approved wording:

- planning guidance
- design brief
- scope preparation
- review prompt
- may require confirmation
- project-specific pricing
- site measure required
- written scope confirmation
- not legal advice
- human review recommended
- subject to site conditions
- conceptual only

Forbidden wording or implication:

- final quote
- final price
- approved
- certified
- legally checked
- compliant
- guaranteed saving
- order instantly
- construction-ready design
- accurate final dimensions
- AI-approved design

Required safety message for advanced-tool outputs:

> Site measure and written scope confirmation are required before contract pricing.

When legal or contract topics appear:

> Planning guidance only. This is not legal advice.

## Architecture Principles

- Structured data comes before AI or visuals.
- Deterministic logic comes before generative summarisation.
- Customer-facing summaries must use customer-safe projections.
- Service role keys, supplier costs, internal rates, margins, lead scores, admin priority and internal notes stay server-side/admin-only.
- Supabase remains the source of truth for request-review leads.
- Email is notification only.
- Static public pages must work with `next.config.js` `output: 'export'`.
- Runtime workflows must use Netlify Functions, not Next API routes, for production static export.
- Production database changes are documented first and applied manually only after approval.

## Key Success Metrics

Track future success by:

- design brief completion rate
- percentage of leads with suburb, property type, stage and quote status
- percentage of leads with access/strata/service-risk context
- quote-review requests with usable scope details
- site-measure readiness quality
- admin follow-up time saved
- fewer repeated clarification calls
- higher proportion of controlled leads moved to review or site measure
- fewer customer misunderstandings about final pricing or legal/compliance advice

## Deferred Features

Deferred until separately approved:

- Phase 2 scope builder runtime
- Phase 3 allowance/risk engine expansion
- conceptual visual planning
- report PDFs
- supplier ordering
- payment
- customer accounts
- full CRM
- production Supabase migrations
- production deploys or verification
