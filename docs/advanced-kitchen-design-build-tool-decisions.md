# Advanced Kitchen Design-Build Tool Decisions

Last updated: 23 June 2026

Deployment status: not needed.

## ADR 001 — Structured Data Comes Before AI

Decision: Phase 1 will use deterministic structured intake and pure functions before any AI-assisted summarisation.

Reason: predictable outputs, lower liability, easier testing, no hallucination risk and lower operating cost.

Implication: future AI can assist only after the data contract, missing-information logic and pathway routing are proven.

## ADR 002 — Visual Planning Is Deferred

Decision: conceptual visual planning is Phase 4, after design brief, scope builder, allowance/risk engine, admin integration and controlled report workflows.

Reason: diagrams and mood boards are useful only after the scope data model is strong. Early visuals can create false confidence if measurements, services and site constraints are incomplete.

Implication: do not build CAD-like, photorealistic, AR/VR or construction-ready visual tools in early stages.

## ADR 003 — Numeric Scores Are Gated

Decision: Phase 1 should prefer readiness labels over numeric scores.

Reason: an empty or early form should not show harsh 0/100-style feedback. Numeric readiness is allowed only after enough meaningful data exists and the calculation is transparent.

Implication: use states such as Getting started, Core context added, More scope detail would help and Ready for the next planning step.

## ADR 004 — Persistence Is Approval-Gated

Decision: Phase 1 should start with component state and pure logic. Production persistence requires a separate reviewed data contract and migration proposal.

Reason: design brief data may contain personal/property context. It must not be stored casually in browser storage, public URLs or unreviewed database structures.

Implication: if persistence is required, use a typed adapter interface and keep the public feature disabled until server-side storage is approved.

## ADR 005 — Feature Flag Defaults Off

Decision: incomplete advanced-tool routes should be disabled or hidden by default.

Reason: the route must be locally testable without exposing unfinished flows through public navigation, footer, chatbot or sitemap.

Implication: Phase 1 needs a feature-flag strategy before runtime implementation. If no existing pattern fits, add a small repository-local flag that defaults off.

## ADR 006 — Production Database Policy

Decision: do not apply production Supabase changes from Codex during this roadmap work.

Reason: Vincent must control production settings and the project is in controlled testing.

Implication: create local docs or migration proposals only. Do not run production SQL, alter RLS or modify environment variables.

## ADR 007 — Human Review Is Required For Reports

Decision: every customer-facing advanced-tool report requires human review before it is treated as project documentation.

Reason: kitchen renovation scope, access, services, strata and contract prompts are project-specific and cannot be approved by a form or generated text.

Implication: Phase 6 report generation should create drafts and internal review states, not automatic customer-ready approvals.

## ADR 008 — Privacy And Sensitive Data Handling

Decision: customer/property data must stay customer-safe and purpose-limited.

Reason: design briefs, quote details, photos/plans and access notes can include sensitive personal/property information.

Implication:

- no sensitive details in URLs
- no service-role credentials in browser code
- no internal pricing/admin fields in public responses
- no public file URLs
- no browser-side Supabase writes for lead/file flows
- no analytics payloads containing sensitive free-text answers

## ADR 009 — Existing Request-Review Storage Remains Source Of Truth

Decision: current request-review leads continue to use Supabase as source of truth.

Reason: the current production-ready path is already server-mediated and admin-visible.

Implication: Phase 1 may later attach to request-review records, but should not disturb existing lead storage, upload storage, attribution or admin operations.

## ADR 010 — Stage Gates Override Broad Continuation Prompts

Decision: broad prompts such as “keep working” should still honour the tracker and stage gates.

Reason: the advanced tool is a staged operating system, not one large uncontrolled feature.

Implication: complete one approved stage, update tracker, test and stop for review before starting the next major stage.

## ADR 011 — Projection Helpers Before Review-Console Persistence

Decision: Phase 5 starts with local-only customer-safe projection helpers before any server storage or admin UI.

Reason: the review console will eventually handle project context from design brief, scope and allowance-risk outputs. A pure projection layer lets the repo prove the data contract and internal-field boundary before adding Supabase writes, functions or admin screens.

Implication: future persistence and admin display work must consume the `AdvancedReviewConsolePayload` projection rather than raw advanced-tool inputs. Supabase migrations, Netlify Function changes and `/admin/leads` UI expansion remain separately approval-gated.

## ADR 012 — Advanced Review Storage Must Be Server-Mediated

Decision: future advanced review payload persistence should use a kitchen-only server-mediated path, not browser-side Supabase writes.

Reason: design brief, scope, allowance and site-measure prompts may contain customer/property context. The browser should submit only a bounded `AdvancedReviewConsolePayload`, while service-role credentials and storage writes stay behind Netlify Functions or a stronger future server boundary.

Implication: slice 2 remains a planning-only storage-adapter document until Vincent approves runtime work. The preferred future direction is a separate `kitchen_advanced_review_payloads` table and a narrow `kitchen-advanced-review-payload` function, subject to separate SQL, function and deploy approval.
