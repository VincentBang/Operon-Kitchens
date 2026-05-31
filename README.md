# Operon Kitchens Web App

This repository contains **Operon Kitchens**, a Sydney-based kitchen renovation quoting and education platform. The goal of this project is to provide homeowners with a clear starting estimate range for their kitchen renovation, while making scope assumptions, exclusions and review flags explicit. It also includes product pages, a glossary, educational guides and a quote review tool.

## Agent policy

Codex and future agents must follow the strict isolation and autonomous execution rules in `AGENTS.md`. All write operations must stay inside `/Users/daibang/Documents/operon-kitchens`.

## Features

* Multi‑step quote wizard capturing property details, scope, cabinetry, benchtop, splashback and trade allowances.
* Planning estimate ranges using a TypeScript pricing engine and kitchen-only editable admin rate cards.
* Confidence scoring based on information completeness and risk factors.
* Quote review tool with checklist or file upload for analysing existing quotes.
* Product category pages explaining options and their impact on pricing.
* Kitchen glossary with common terms and definitions.
* Location pages targeting Sydney suburbs and highlighting access considerations.
* Guides covering cost, measurement and compliance topics.
* FAQ page for quote, scope and compliance questions.
* Secured admin dashboard for leads, quote status, active rate cards, product categories, glossary terms, guides and location pages.
* Kitchen-local CMS backed by editable database tables for products, glossary terms, guides, location pages and FAQs.

## Getting started

This project is built with [Next.js](https://nextjs.org/) and TypeScript. To run it locally you will need Node.js installed. Follow these steps:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

3. Build for production:

   ```bash
   npm run build
   npm start
   ```

## Estimate engine documentation

The estimate engine logic lives in `src/lib/pricing.ts`. It exports a `calculatePricing` function that accepts a `QuoteInput` object and returns a customer-facing estimate range, confidence score, assumptions, exclusions, manual review flags, compliance flags and a recommended next step. Kitchen-only admin rate cards drive the calculation, but customer pages must not expose commercial calculation inputs.

Key considerations:

* **Cabinetry**: base, overhead and tall cabinet scope affects the estimate range.
* **Finishes**: door, panel, hardware and accessory tiers change the planning allowance.
* **Benchtop and splashback**: material direction and measured length/area affect the estimate and compliance flags.
* **Installation and trades**: installation and licensed trade allowances are included when selected.
* **Access and risk**: stairs, lift access, parking, strata, structural work and older-property risk affect confidence.
* **Compliance prompts**: deposit, HBC, strata, licensed trades and engineered-stone review items are flagged without providing legal advice.

## Sample rate card

The sample rate card provided (`src/data/rateCard.json`) contains placeholder assumptions for demonstration. These values are **not representative of actual market rates** and must remain admin-only. Before using the system in production, replace the placeholders through a secure kitchen-only admin workflow and keep internal calculation inputs out of customer-facing pages and public APIs.

## Content management

Phase 1 uses an internal Operon Kitchens CMS rather than an external hosted CMS. The CMS is backed by kitchen-specific SQLite tables and seeded from `src/data/products.ts`, `src/data/glossary.ts`, `src/data/guides.ts`, `src/data/locations.ts` and `src/data/faqs.ts` on first run.

Editable admin areas:

* `/admin/products`
* `/admin/glossary`
* `/admin/guides`
* `/admin/locations`
* `/admin/faqs`

Public pages read published records from the CMS tables at request time, so admin edits can appear without code changes or redeploys. A later production version can swap this kitchen-local data layer to Supabase/Postgres, Sanity, Contentful or another hosted CMS while keeping the public page contracts similar.

## Request review intake

The public `/request-review` form posts to the kitchen-scoped Netlify Function `kitchen-request-review`. The endpoint validates a customer-safe payload, rejects unsupported internal fields, stores a durable lead record when Supabase environment variables are configured, and optionally sends an email notification.

Environment variables:

* `OPERON_KITCHENS_SUPABASE_URL` - required for durable lead storage.
* `OPERON_KITCHENS_SUPABASE_SERVICE_ROLE_KEY` - required for server-side insert into `kitchen_request_reviews`.
* `OPERON_KITCHENS_RESEND_API_KEY` - optional Resend API key for request notifications.
* `OPERON_KITCHENS_REQUEST_REVIEW_TO_EMAIL` - optional recipient for request-review notifications.
* `OPERON_KITCHENS_REQUEST_REVIEW_FROM_EMAIL` - optional sender address. Defaults to Resend onboarding sender if omitted.
* `OPERON_KITCHENS_IP_HASH_SALT` - optional salt for privacy-safer IP hashing.

If Supabase storage is absent but Resend is configured, the function can still notify by email. If neither durable storage nor email notification is configured, the function returns a controlled service-unavailable response instead of pretending the lead was captured.

For storage-only production testing, Supabase variables are enough. Resend variables can be left unset until a sending domain is ready; the function should still return success when the Supabase insert succeeds. If a valid request returns `503`, check Netlify Function logs for the safe diagnostic categories documented in `docs/supabase-kitchen-request-reviews.md`.

Supabase setup instructions and SQL are documented in `docs/supabase-kitchen-request-reviews.md`.

File uploads are not enabled in this form yet; customers are directed to the quote review pathway for upload guidance until secure kitchen-scoped storage is implemented.

This is request intake only. It is not a final quote, order submission, payment flow, legal advice, compliance approval or project acceptance.

## Further development

This Phase 1 application focuses on structure and core quote-review logic. To move towards a production-ready system the following should be addressed:

* **Database integration**: connect to a database such as Supabase/Postgres to persist leads, rate cards and admin data.
* **Authentication**: secure the admin dashboard with proper authentication and authorisation.
* **File uploads**: implement secure storage (e.g. S3 or Supabase Storage) with validation and size limits.
* **Dynamic content management**: product pages, glossary, guides, location pages and FAQs now read from kitchen CMS tables seeded from the static files. A future production CMS can replace the SQLite-backed admin layer.
* **Comprehensive testing**: build out unit and integration tests for the pricing engine and form flows using Jest and React Testing Library.
* **Responsive design**: refine mobile layouts and add visual polish consistent with a premium brand.
* **Compliance checks**: integrate real‑time checks against NSW Fair Trading, SafeWork NSW and Australian Consumer Law guidelines. Always confirm the availability and legality of materials such as engineered stone alternatives.

## License

This project is provided for demonstration purposes and does not include any proprietary content from third‑party sites. Use it as a starting point for your own kitchen renovation quoting platform.
