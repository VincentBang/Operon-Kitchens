# Operon Kitchens Decision Log

Last updated: 31 May 2026

## 2026-05-31: Operon Kitchens Is Separate From Operon Flooring

Decision: Operon Kitchens remains a separate customer-facing kitchen renovation brand and app.

Rationale: It is the second vertical proof layer for future Operon OS, not a subpage of Operon Flooring.

Implication: All writes stay inside `/Users/daibang/Documents/operon-kitchens/**`. Operon Flooring and Oz Timber may be read only for reference.

## 2026-05-31: Static Export Deployment Uses `out`

Decision: Netlify should publish the static export folder `out`, not `.next`.

Rationale: `next.config.js` uses `output: 'export'`. Publishing `.next` caused stale/mismatched deploy behaviour and server/runtime issues.

Implication: Public pages are static. Next API routes are not available in production. Use Netlify Functions for runtime backend needs.

## 2026-05-31: Supabase Is Source Of Truth For Request-Review Leads

Decision: Request-review leads are durably stored in `public.kitchen_request_reviews`.

Rationale: Email notification alone is not recoverable enough for controlled customer testing.

Implication: `/.netlify/functions/kitchen-request-review` must return success when Supabase storage succeeds, even if email is disabled. It must not fake success if neither storage nor email works.

## 2026-05-31: Email Notification Is Optional Until Branded Sender Is Ready

Decision: Resend notification logic exists, but email can remain disabled until a verified branded sender/domain is ready.

Rationale: The site has no custom domain/branded sender yet.

Implication: While email is disabled, Vincent must check `/admin/leads` daily during controlled launch.

## 2026-05-31: Admin-Lite Uses Simple Token

Decision: `/admin/leads` uses `OPERON_KITCHENS_ADMIN_TOKEN`.

Rationale: It is sufficient for MVP admin-lite lead operations and avoids building full authentication too early.

Implication: The token must never be shared publicly or pasted into chat. `/admin/leads` is noindex, blocked from public navigation, and not included in sitemap.

## 2026-05-31: Attribution Tracking Is Cookie-Free

Decision: Request-review attribution captures simple URL/referrer fields only.

Fields: `source_route`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `landing_page`.

Rationale: This supports controlled launch without adding cookie consent complexity or production analytics service dependency.

Implication: Values are sanitised server-side. If optional Supabase attribution columns are absent, storage falls back to legacy columns so lead capture does not break.

## 2026-05-31: Customer-Safe Quote Projection Is Required

Decision: Customer-facing quote summaries must consume customer-safe projected data, not raw pricing/admin objects.

Rationale: Raw pricing structures can contain internal costs, margin logic or operational fields.

Implication: Use `src/lib/quotePresentation.ts` for customer quote summaries. Internal lead scoring and admin notes remain server/admin only.

## 2026-05-31: Quote Review Submit Path Uses Netlify Function

Decision: `/quote/review` must use the request-review Netlify Function for customer submission in static export.

Rationale: Production static export does not support Next API routes.

Implication: The local page now submits to `/.netlify/functions/kitchen-request-review` and saved-estimate lookup is static-safe. Do not add file upload storage as part of this small fix.
