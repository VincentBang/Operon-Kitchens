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
