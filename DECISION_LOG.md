# Operon Kitchens Decision Log

Last updated: 2 June 2026

## 2026-05-31: Operon Kitchens Is Separate From Operon Flooring

Decision: Operon Kitchens remains a separate Sydney kitchen renovation quote clarity and review platform.

Implication: All writes stay inside `/Users/daibang/Documents/operon-kitchens/**`. Operon Flooring and Oz Timber Floor are read-only references.

## 2026-05-31: Static Export Publishes From `out`

Decision: Netlify should publish `out`, not `.next`.

Implication: Public pages are static. Runtime backend work uses Netlify Functions under `netlify/functions`.

## 2026-05-31: Request Review Stores To Supabase

Decision: `/.netlify/functions/kitchen-request-review` stores durable leads in `public.kitchen_request_reviews`.

Implication: Supabase is the source of truth. Email notification is not the database.

## 2026-05-31: Admin-Lite Uses Token-Gated Functions

Decision: `/admin/leads` uses a simple admin token through Netlify Functions.

Implication: `OPERON_KITCHENS_ADMIN_TOKEN` must not be shared publicly or pasted into chat. Admin pages stay out of public navigation and sitemap.

## 2026-05-31: Email Notification Code Built, Resend/Domain Deferred

Decision: Resend notification logic exists, but branded domain and sender setup are deferred.

Implication: While email is off, Vincent checks `/admin/leads` manually during controlled testing.

## 2026-05-31: Attribution Tracking Built

Decision: Request-review captures simple source route, referrer and UTM fields without cookies.

Implication: Supports controlled testing without production analytics dependency or cookie-consent expansion.

## 2026-05-31: Customer-Safe Quote Projection Required

Decision: Customer-facing estimate summaries use customer-safe projection objects.

Implication: Raw pricing, internal cost, margin, lead score and admin fields must not reach browser-facing components.

## 2026-05-31: File Uploads Are Deferred Beyond Safe Scaffolding

Decision: File upload storage has been scaffolded and investigated, but broader file operations are deferred.

Implication: Admin signed downloads, deletion, retention workflows and full file management require explicit approval.

## 2026-06-02: Controlled Traffic Only Until Branded Domain/Email Are Ready

Decision: Operon Kitchens remains in controlled testing mode until domain/email/Resend readiness is complete.

Implication: Avoid aggressive public launch, broad SEO rollout and repeated Netlify deploys. Prioritise local hardening and manual playbooks.

## 2026-06-03: Admin Signed Downloads Prepared Locally

Decision: Admin signed file download function and `/admin/leads` download UI are prepared locally for the Operon Kitchens file upload MVP.

Implication: Signed downloads still require an approved push/deploy before live use. Delete buttons, delete function, retention automation and customer file portals remain deferred until separately approved.

## 2026-06-03: Signed Download URL Fix And Soft Delete Prepared Locally

Decision: A Supabase signed URL normalisation fix and token-gated soft-delete function are prepared locally after live testing showed signed URLs could open a `requested path is invalid` response.

Implication: The next approved file-upload release should include the signed URL fix, admin file status display and soft-delete function together. Delete buttons, physical object deletion and retention automation remain deferred.

## 2026-06-03: Paid Quote Review Packaging Documented Locally

Decision: The future paid detailed quote-review service is documented as a customer-safe packaging layer before any payment implementation.

Implication: The paid service should be based on scope clarity, allowance risk, missing information, customer questions, compliance prompts and recommended next step. Payment, checkout, PDF automation, customer accounts and full CRM remain deferred until explicitly approved.

## 2026-06-03: Operon Branch Logo Structure Prepared Locally

Decision: Operon Kitchens uses the master Operon emblem plus OPERON wordmark plus KITCHENS branch descriptor.

Implication: Future Operon Flooring and Operon System marks should use the same structure. Kitchens should not use disconnected kitchen-only icons or literal kitchen symbols. Final designer/vector refinement remains deferred until review.

## 2026-06-03: Header Compact Logo Variant Added Locally

Decision: The public header uses a dedicated compact SVG variant instead of the full horizontal lockup.

Implication: Desktop and mobile navigation get larger OPERON/KITCHENS text while preserving the master emblem and branch descriptor structure. The full horizontal lockup remains available for footer, document and larger brand placements.

## 2026-06-04: Inline Operon Kitchens Logo Applied Locally

Decision: Site brand assets now use the selected inline mark: Operon emblem, bold OPERON wordmark, slim muted-gold divider and inline KITCHENS descriptor.

Implication: Header and footer use the same branch-logo direction across the public site. The favicon remains emblem-led. Final designer outline/vector exports remain deferred until release review.

## 2026-06-04: Operon Flooring Footer Colour And White Chrome Applied Locally

Decision: Operon Kitchens now uses the live Operon Flooring footer ink colour `#142f38` for its rounded footer container and primary CTA surfaces, with white page/header chrome and white spacing around the footer.

Implication: The Kitchens visual system feels closer to the Operon family while remaining a separate kitchen renovation quote/review brand. This is local-only until Vincent approves a bundled release.

## 2026-06-04: Visual-System Regression Tests Added Locally

Decision: A local visual-system test protects the white page/header chrome, rounded dark footer, footer/button colour, shared brand assets and mobile sticky CTA guardrails.

Implication: Future local edits should fail tests if they accidentally drift away from the approved Operon-style visual direction.

## 2026-06-05: Approved Raster Logo Source Used Across Site Locally

Decision: The active header, footer, emblem and favicon assets now use PNG crops generated from Vincent's approved logo reference image.

Implication: The public site matches the supplied circular emblem exactly instead of using a hand-built SVG approximation. SVG files remain as editable reference drafts until a final designer vector master is produced.

## 2026-06-12: Phase 1 Public Conversion Experience Completed Locally

Decision: The conversion-grade public experience is considered complete locally for Phase 1.

Implication: Homepage, quote, quote review, request review, how-it-works, FAQ, areas, privacy/terms, shared header/footer and chatbot should now be maintained through targeted blocker fixes rather than broad Phase 1 reopening. The next master-plan work should focus on controlled testing, file-upload MVP release decisions, domain/email setup, quote-review packaging trials and SEO rollout.

## 2026-06-17: Controlled-Testing Execution Order Set Locally

Decision: The next stage is organised as trust polish, visual review, file-upload MVP release prep, domain/email readiness and manual quote-review trials.

Implication: Work should proceed one task at a time using local docs, tests and static-export checks. Netlify deploys, production verification and production Supabase changes remain paused unless Vincent explicitly approves a release checkpoint.

## 2026-06-28: Public Trust Gate And PC Sums Alias Added Locally

Decision: The public footer now uses four compact conversion/trust columns, and `/pc-sums-provisional-sums` is a short alias for the canonical `/kitchen-pc-sums-and-provisional-sums` guide.

Implication: The footer stays shorter without suburb link stuffing, the admin route remains hidden from public navigation, and the short allowance URL can resolve without creating a duplicate SEO page. Deployment remains paused until Vincent approves a release checkpoint.

## 2026-06-17: Controlled-Testing Handoff Added Locally

Decision: A single operator-facing handoff now condenses daily admin checks, trusted tester flow, promises boundary, site-measure triggers, file-upload status, quote-review manual trials and release checkpoints.

Implication: Future Codex runs and Vincent's manual testing can start from `docs/controlled-testing-handoff.md` before opening deeper playbooks. This is local documentation and does not approve deployment.

## 2026-06-17: Next 100 Local Readiness Tasks Completed

Decision: The next controlled-testing work was packaged into a local 100-task readiness batch covering release-gate discipline, file-upload release prep, domain/email readiness, quote-review manual trials, feedback scoring, admin operations, SEO rollout backlog and risk tracking.

Implication: The repo now has a stronger local operating system for deciding the next approved release without triggering Netlify or changing production Supabase settings. Runtime expansion, deploys and production verification remain approval-gated.

## 2026-06-17: Vincent Release Decision Note Added Locally

Decision: A human-readable release decision note now separates trust/visual-only, file-upload backend, combined and local-only next steps.

Implication: The default recommendation is to release trust/visual polish first when Netlify credits are tight, then run a separate approved file-upload backend release only if admin signed downloads are needed during controlled testing.

## 2026-06-17: Release Decision And Visual Polish Batch Completed Locally

Decision: A second local 100-task batch captured release-choice clarity, safer public wording, compact header/navigation changes, simplified footer links, homepage proof hierarchy and updated visual-system guardrails.

Implication: The next approved public release can be framed as a trust/visual polish release, separate from file-upload backend operations unless Vincent deliberately chooses a combined release.

## 2026-06-17: Viewport And Release Readiness Batch Completed Locally

Decision: A third local 100-task batch checked the current release candidate at desktop, tablet and mobile widths, tightened public strata wording toward approval-review language, and prepared a one-approved-deploy smoke-check pack.

Implication: The release candidate has a documented local viewport baseline and a concise smoke-check sequence. Deployment, production verification, Netlify settings and production Supabase changes remain approval-gated.

## 2026-06-23: Advanced Design-Build Tool Roadmap Captured Locally

Decision: The advanced Operon Kitchens design-build operating-system roadmap is captured as local source-of-truth documentation before runtime implementation.

Implication: Phase 0 baseline audit and architecture controls must be reviewed before Phase 1. The structured design brief assistant is specified but not implemented, should be feature-flagged off by default when built, and must remain hidden from public navigation until acceptance tests and human review pass. Production Supabase changes, Netlify deploys, payment, full CRM, supplier ordering and AI-generated final design/quote claims remain approval-gated.

## 2026-06-23: Phase 1 Structured Design Brief Assistant Implemented Locally

Decision: The first advanced design-build runtime slice is a disabled-by-default `/design-brief` route with deterministic summary, missing-information checklist and pathway routing logic.

Implication: Phase 1 does not save to Supabase, localStorage or URL parameters, does not expand file uploads, does not use AI, and is not linked from public navigation, footer, chatbot or sitemap. The feature flag is `NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_DESIGN_BRIEF=true`. Vincent approved Phase 2 after local Phase 1 review.

## 2026-06-23: Phase 2 Kitchen Scope Builder Implemented Locally

Decision: The second advanced design-build runtime slice is a disabled-by-default `/scope-builder` route with deterministic kitchen scope summary, missing-scope checklist, measurement preparation, site-measure preparation and next-step routing logic.

Implication: Phase 2 does not save to Supabase, localStorage or URL parameters, does not expand file uploads, does not use AI, and is not linked from public navigation, footer, chatbot or sitemap. The feature flag is `NEXT_PUBLIC_OPERON_KITCHENS_ENABLE_SCOPE_BUILDER=true`. Phase 3 allowance and quote-risk work remains blocked until local human review approves Phase 2.

## 2026-06-24: Phase 2 Scope Builder Viewport Review Completed Locally

Decision: `/scope-builder` passed local browser metric checks at 1440, 1280, 768, 390 and 360 widths with the feature flag enabled.

Implication: No horizontal overflow was found, the route remains hidden from public header/footer navigation, and no deploy is needed. Phase 2 still requires Vincent's human visual/copy review before Phase 3 allowance or quote-risk implementation starts.

## 2026-06-24: Phase 3 Allowance And Quote-Risk Engine Implemented Locally

Decision: Phase 3 is a deterministic allowance and quote-risk engine in `src/lib/allowanceRisk.ts`, surfaced only inside the hidden `/scope-builder` review step.

Implication: The engine creates customer-safe risk labels, missing inclusions, customer questions, human-review flags and recommended pathways without persistence, Supabase changes, deploys, payment, AI, supplier workflow or CRM. Phase 5 internal review-console planning remains blocked until Phase 3 is locally reviewed and approved.

## 2026-06-24: Phase 3 Risk Prompt Viewport Review Completed Locally

Decision: The Phase 3 `/scope-builder` review step passed local viewport metrics at 1440, 1280, 768, 390 and 360 widths, and the hidden advanced-tool routes were excluded from the global chatbot shell during local review.

Implication: The allowance and quote-risk prompts are not covered by the chatbot on mobile, the route remains hidden from public navigation, and no deploy is needed. Phase 3 still requires Vincent's human visual/copy review before Phase 5 planning begins.

## 2026-06-24: Phase 3 Approved For Phase 5 Planning

Decision: Vincent approved moving from Phase 3 review into Phase 5 planning.

Implication: Phase 3 is complete for planning progression. `/design-brief` and `/scope-builder` still remain hidden and disabled by default. Public exposure, persistence and release are still separately gated.

## 2026-06-24: Phase 5 Internal Review Console Planning Spec Added Locally

Decision: Phase 5 starts as a planning spec only for connecting structured design brief, scope and allowance-risk data to the existing `/admin/leads` workflow later.

Implication: No admin runtime, Netlify Function, Supabase migration, payment, customer account, supplier workflow, full CRM or deploy was added. The first future runtime slice should be customer-safe projection helpers and tests before any persistence or UI expansion.

## 2026-06-24: Phase 5 Slice 1 Projection Helpers Implemented Locally

Decision: The first Phase 5 runtime slice is a pure local projection helper for `AdvancedReviewConsolePayload`.

Implication: `src/lib/advancedReviewConsole.ts` can compose design brief, scope and allowance-risk outputs into a customer-safe admin-handoff payload for tests and future server-mediated use. No Supabase persistence, Netlify Function change, `/admin/leads` UI change, public exposure, payment, CRM or deploy was added.

## 2026-06-24: Phase 5 Slice 2 Storage-Adapter Plan Added Locally

Decision: Slice 2 is documented as a server-mediated storage-adapter plan only.

Implication: The future storage path should use the customer-safe `AdvancedReviewConsolePayload`, a kitchen-only server function and a separately approved table strategy before any persistence is implemented. No storage adapter code, Supabase SQL, Netlify Function, `/admin/leads` UI change, production verification, deploy, payment or CRM work was added.

Related ADR: Advanced Review Storage Must Be Server-Mediated.

## 2026-06-24: Phase 5 Slice 2 Storage Interface Sketch Added Locally

Decision: Slice 2 now has a local-only storage adapter contract sketch in `src/lib/advancedReviewStorage.ts`.

Implication: The repo can validate projected advanced-review payloads, create a proposed table-record draft and type-check a future adapter contract without writing to Supabase or adding a Netlify Function. No production storage adapter, Supabase SQL, `/admin/leads` UI change, deploy, payment or CRM work was added.

## 2026-06-24: Phase 5 Slice 2 No-Write Mock Harness Added Locally

Decision: Slice 2 now has a test-only mock adapter harness for advanced-review storage outcomes.

Implication: Tests can simulate stored, invalid payload, missing environment, missing lead and insert-failed paths without Supabase writes, Netlify Functions, environment variables or admin UI. This does not approve production storage implementation, SQL, deploy, payment or CRM work.

## 2026-06-25: Phase 5 Netlify Function Contract Test Plan Added Locally

Decision: The future `kitchen-advanced-review-payload` Netlify Function now has a contract test plan before implementation.

Implication: Any future function work must prove method handling, JSON validation, `AdvancedReviewConsolePayload` boundaries, safe diagnostics, no fake success and no internal-field leakage before adding Supabase writes or admin UI. No function file, SQL, deploy, payment or CRM work was added.

## 2026-06-25: Phase 5 Function Contract Fixtures Added Locally

Decision: Request/response contract fixtures and a thin test helper now simulate the future `kitchen-advanced-review-payload` function boundary.

Implication: Tests can validate POST success, non-POST rejection, JSON validation, unsafe-field rejection, storage failure mapping and safe responses without creating a Netlify Function, Supabase adapter, SQL migration, admin UI or deployment.

## 2026-06-25: Phase 5 Thin Function Implementation Plan Added Locally

Decision: The future `kitchen-advanced-review-payload` wrapper now has a helper-first implementation plan before runtime coding.

Implication: Future work should first move the test-boundary behaviour into a local server helper with mock-adapter tests before creating a Netlify wrapper or Supabase adapter. No function file, SQL, deploy, admin UI, payment or CRM work was added.

## 2026-06-25: Phase 5 Helper-Only Function Boundary Added Locally

Decision: The future `kitchen-advanced-review-payload` behaviour now lives in `src/lib/advancedReviewPayloadFunction.ts` as a helper-only slice.

Implication: The helper maps method handling, JSON parsing, storage adapter diagnostics and safe response bodies with mock-adapter tests, but no Netlify wrapper, Supabase adapter, SQL migration, admin UI, deployment, payment or CRM work was added.

## 2026-06-25: Phase 5 Wrapper-Only Implementation Plan Added Locally

Decision: The future `netlify/functions/kitchen-advanced-review-payload.ts` wrapper now has a local implementation plan before any function file is created.

Implication: Any future wrapper should use modern Netlify default export syntax, call `handleAdvancedReviewPayloadFunctionRequest`, use only safe diagnostics and remain no-write until a separate storage adapter slice is approved. No wrapper file, Supabase adapter, SQL migration, admin UI, deployment, payment or CRM work was added.

## 2026-06-25: Phase 5 Wrapper Contract Tests Added Locally

Decision: Wrapper contract tests now protect the future `kitchen-advanced-review-payload` Netlify boundary before real storage is approved.

Implication: The contract proves helper delegation, safe diagnostics, no fake success and no internal-field leakage without Supabase writes, admin UI, browser submission wiring, payment, CRM or deployment.

## 2026-06-25: Phase 5 Disabled Wrapper Added Locally

Decision: The disabled/no-write `netlify/functions/kitchen-advanced-review-payload.ts` wrapper is implemented locally.

Implication: The wrapper uses modern default export syntax and delegates to `handleAdvancedReviewPayloadFunctionRequest` with a disabled adapter that returns safe `503` storage-unavailable responses. No real Supabase adapter, SQL migration, admin UI, browser submission wiring, deployment, payment or CRM work was added.

## 2026-06-25: Phase 5 Disabled Wrapper Creation Plan Added Locally

Decision: The future disabled/no-write `netlify/functions/kitchen-advanced-review-payload.ts` runtime slice now has a creation plan.

Implication: The plan established the safety contract before the wrapper file existed. The wrapper has since been added locally as disabled/no-write only; real Supabase adapter, SQL migration, admin UI, browser submission wiring, deployment, payment and CRM work remain deferred.

## 2026-06-26: Phase 5 Real Supabase Adapter Plan Added Locally

Decision: The future real Supabase adapter for `public.kitchen_advanced_review_payloads` is documented as a planning spec only.

Implication: The approved next implementation shape is server-mediated through Netlify Functions, service-role-only, RLS-enabled, and based on customer-safe `AdvancedReviewConsolePayload` records. No Supabase adapter code, SQL application, admin UI, browser submission wiring, deployment, payment or CRM work was added.

## 2026-06-26: Phase 5 Mocked Supabase Adapter Contract Tests Added Locally

Decision: The future real Supabase adapter now has mocked contract tests that simulate storage configuration, lead lookup, insert failure and insert success.

Implication: The tests prove the expected adapter behaviour without importing Supabase, creating `src/lib/advancedReviewSupabaseStorage.ts`, replacing the disabled wrapper, applying SQL, changing admin UI, wiring browser submissions, deploying, adding payment or expanding CRM.

## 2026-06-26: Phase 5 Real Adapter Implementation Plan Added Locally

Decision: The future real adapter implementation now has a file-level plan naming `src/lib/advancedReviewSupabaseStorage.ts`, REST/fetch as the first dependency strategy, server-only env access and mocked test changes.

Implication: The next approved implementation slice can be small and test-first, but this plan still does not create the adapter, replace the disabled wrapper, apply SQL, change admin UI, wire browser submissions, deploy, add payment or expand CRM.

## 2026-06-26: Phase 5 Real Supabase Adapter Implemented Locally

Decision: `src/lib/advancedReviewSupabaseStorage.ts` now implements the server-only advanced-review Supabase REST adapter with mocked-fetch tests in `test/advancedReviewSupabaseStorage.test.ts`.

Implication: The adapter can validate customer-safe `AdvancedReviewConsolePayload`, check the linked request-review lead and prepare an insert to `kitchen_advanced_review_payloads`, but it is not active because the disabled wrapper was not replaced. No SQL was applied, no admin UI changed, no browser submission wiring was added, no deploy occurred, and payment/CRM remain deferred.

## 2026-06-27: Phase 5 Wrapper Replacement Contract Tests And Plan Added Locally

Decision: The future replacement of `netlify/functions/kitchen-advanced-review-payload.ts` is now covered by a local plan and mocked Supabase contract tests.

Implication: `test/advancedReviewPayloadWrapperReplacementContract.test.ts` proves the future active wrapper path can use `createAdvancedReviewSupabaseStorageAdapter` for stored, missing-env, missing-lead, insert-failed and validation-failure outcomes, while the actual wrapper remains disabled/no-write. No SQL was applied, no wrapper file was replaced, no admin UI changed, no browser submission wiring was added, no deploy occurred, and payment/CRM remain deferred.

## 2026-06-27: Phase 5 Activation Checklists Added Locally

Decision: SQL migration readiness and wrapper replacement readiness are now documented side by side before any production activation.

Implication: `docs/advanced-kitchen-design-build-tool-phase-5-activation-checklists.md` separates the future Supabase SQL gate from the future Netlify wrapper replacement gate, including RLS/grant posture, server-only env handling, safe diagnostics and one-deploy verification notes. No SQL was applied, no wrapper file was replaced, no admin UI changed, no browser submission wiring was added, no deploy occurred, and payment/CRM remain deferred.

## 2026-06-27: Phase 5 SQL Approval Packet Prepared Locally

Decision: The future `public.kitchen_advanced_review_payloads` migration now has an exact SQL-only approval packet.

Implication: `docs/advanced-kitchen-design-build-tool-phase-5-sql-approval-packet.sql` is copy-paste-safe for a later manually approved Supabase SQL task and avoids Markdown heading markers. It creates only the kitchen advanced-review payload table, RLS/grant posture, indexes, a table-specific updated-at trigger and verification queries. No SQL was applied, no disabled wrapper was replaced, no admin UI changed, no browser submission wiring was added, no deploy occurred, and payment/CRM remain deferred.

## 2026-06-27: Phase 5 Wrapper Replacement Implementation Checklist Added Locally

Decision: The future active `kitchen-advanced-review-payload` wrapper replacement now has an implementation checklist before runtime changes.

Implication: `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-implementation-checklist.md` defines approval gates, allowed runtime scope, `Netlify.env.get` usage, response contracts, safety checks, test updates and rollback steps. No SQL was applied, no disabled wrapper was replaced, no admin UI changed, no browser submission wiring was added, no deploy occurred, and payment/CRM remain deferred.

## 2026-06-28: Phase 5 Wrapper Replacement Patch Plan Added Locally

Decision: The future active `kitchen-advanced-review-payload` wrapper replacement now has a patch plan before runtime changes.

Implication: `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-replacement-patch-plan.md` documents the intended future diff shape, allowed files, test update order, safe rollback and runtime gates. No SQL was applied, no disabled wrapper was replaced, no admin UI changed, no browser submission wiring was added, no deploy occurred, and payment/CRM remain deferred.

## 2026-06-28: Phase 5 Active Wrapper Contract Tests Added Locally

Decision: The planned active `kitchen-advanced-review-payload` Netlify wrapper surface now has tests before runtime replacement.

Implication: `test/advancedReviewPayloadActiveWrapperContract.test.ts` proves the future `Netlify.env.get` wrapper path, JSON/no-store response headers, mocked Supabase success and safe failure outcomes while confirming the actual wrapper remains disabled/no-write. No SQL was applied, no disabled wrapper was replaced, no admin UI changed, no browser submission wiring was added, no deploy occurred, and payment/CRM remain deferred.

## 2026-06-28: Phase 5 Wrapper Activation Readiness Review Added Locally

Decision: The future active `kitchen-advanced-review-payload` wrapper now has a go/no-go readiness review before runtime replacement.

Implication: `docs/advanced-kitchen-design-build-tool-phase-5-wrapper-activation-readiness-review.md` lists the exact approval, SQL, Supabase RLS/grant, Netlify environment, wrapper shape, response contract, safety boundary, product exposure, test and rollback gates. No SQL was applied, no disabled wrapper was replaced, no admin UI changed, no browser submission wiring was added, no deploy occurred, and payment/CRM remain deferred.

## 2026-06-28: Phase 5 Local Active Wrapper Replacement Added

Decision: `netlify/functions/kitchen-advanced-review-payload.ts` now uses the server-only advanced-review Supabase adapter path locally.

Implication: The wrapper reads `OPERON_KITCHENS_SUPABASE_URL` and `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY` through `Netlify.env.get`, delegates validation and response mapping to `handleAdvancedReviewPayloadFunctionRequest`, and is covered by mocked Supabase tests. No SQL was applied, no production Supabase setting changed, no `/admin/leads` UI changed, no browser submission wiring was added, no push/deploy occurred, and payment/CRM remain deferred.

## 2026-06-28: Operon System Visual Alignment Audit Added Locally

Decision: The public Operon Kitchens shell has a current local visual-alignment audit against the public Operon Flooring standard.

Implication: `docs/operon-system-visual-alignment-audit.md` documents the reference notes, Kitchens-specific differences, locally applied alignment, routes to review and viewport checklist. Theme aliases were added for the Operon System palette, the footer company column now includes `Projects/examples`, and the chatbot shell has a more branded navy/gold treatment. No deploy, push, production verification, Netlify setting change, Supabase change, advanced-tool exposure, payment or CRM work was added.
