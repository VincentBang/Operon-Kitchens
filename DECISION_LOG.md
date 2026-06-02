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
