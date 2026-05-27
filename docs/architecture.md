# Operon Kitchens Architecture

## Public Brand Separation

Operon Kitchens is a standalone customer-facing kitchen renovation brand. It is not a subpage, category, or content extension of Operon Flooring.

The public promise is practical clarity:

- estimate range before a site visit
- quote confidence score
- visible assumptions and exclusions
- scope transparency across cabinetry, benchtops, trades, approvals, access, and risk
- compliance-aware review prompts
- professional next step before any final quote

The website should not describe the customer experience as AI-first or software-first. Technology supports the backend workflow, but the public brand should feel like a professional kitchen renovation quoting and review service.

## Future Shared Backend Direction

Operon Kitchens is the second vertical proof layer for a future trade-focused operating system. The long-term platform may share infrastructure across verticals, but the current implementation must stay isolated.

Future shared infrastructure candidates:

- shared lead database pattern
- shared file upload system
- shared admin dashboard framework
- shared quote engine interface
- shared confidence scoring pattern
- shared CRM pipeline stages
- shared analytics event structure
- shared notification and follow-up framework

Required isolation rules:

- Kitchens data must be namespaced with `kitchen_`, `kitchens_`, `operon_kitchens_`, `vertical = "kitchens"`, or `project_type = "kitchens"`.
- Flooring and Oz Timber tables, functions, storage buckets, policies, migrations, and production data must not be changed from this project.
- Shared infrastructure changes must be additive and non-destructive.
- Production Supabase changes require explicit approval and should first be documented as kitchen-only migrations/configuration inside this repository.

## Kitchen Vertical Data Model

The kitchen vertical should model a renovation estimate as a structured planning record rather than a final fixed quote.

Core entities:

- `kitchen_leads`: customer enquiry and contact intent.
- `kitchen_quotes`: quote intake state, estimate result, confidence score, compliance flags, and status.
- `kitchen_quote_items`: visible customer-facing scope and allowance line items.
- `kitchen_quote_files`: uploaded photos, plans, existing quotes, and design-plan attachments.
- `kitchen_rate_cards`: kitchen-specific editable rate cards and calculation inputs.
- `kitchen_products`: product/category content for cabinetry, benchtops, splashbacks, hardware, and finishes.
- `kitchen_content_entries`: FAQ, glossary, guide, and location content if backed by a CMS.
- `kitchen_admin_notes`: manual review notes and internal follow-up comments.
- `kitchen_project_events`: quote lifecycle, review status, and CRM activity events.

Important data boundaries:

- Customer-facing output may show estimate ranges, visible allowances, assumptions, exclusions, and review flags.
- Customer-facing output must not expose supplier costs, internal rates, margin logic, or hidden calculation internals.
- Compliance data should use review language such as "requires confirmation" or "flagged for review", not legal advice.

## Quote Engine Pattern

The kitchen quote engine should return:

- estimate range
- confidence score and confidence level
- assumptions
- exclusions
- manual review flags
- compliance flags
- material compliance status
- deposit and HBC guidance
- next-step recommendations

The engine must avoid final fixed quote claims. A final kitchen quote requires site measure, confirmed selections, licensed trade review where relevant, compliance confirmation, and written approval.

## Roadmap

### Phase 1: Foundation

Goal: create a professional quote intake and review foundation.

Included:

- standalone Operon Kitchens web app
- homepage and conversion path
- kitchen quote wizard
- kitchen quote review page
- editable kitchen rate-card structure
- quote model and confidence scoring
- assumptions, exclusions, manual review flags, and compliance flags
- deposit/HBC and engineered-stone review prompts
- privacy collection notice and optional marketing consent
- kitchen-only admin/content foundations
- tests, lint, build, and CI checks

Excluded:

- payment system
- expanded customer login/authentication
- full production 3D planner
- live supplier API integrations
- production database changes
- final fixed quote claims

### Phase 2: Leverage

Goal: improve operational leverage while preserving kitchen isolation.

Potential work:

- apply kitchen-only database migrations after approval
- add secure kitchen-specific file upload flow
- improve admin review workflow and CRM stages
- add quote PDF/export templates
- add customer quote status links
- expand CMS-backed content operations
- introduce analytics events using `vertical = "kitchens"`
- improve quote review extraction and structured comparison readiness

Phase 2 may begin sharing backend patterns, but should still avoid modifying Flooring or Oz Timber production infrastructure without explicit approval.

### Phase 3: Scale

Goal: prepare Operon verticals for a shared trade operating system.

Potential work:

- shared multi-vertical admin framework
- shared lead and project pipeline with vertical-specific schemas
- shared quote engine contracts across Kitchens and Flooring
- shared file storage abstraction with vertical-specific buckets or policies
- supplier catalogue integrations after commercial approval
- approved AI assistance for staff-side review and customer guidance
- multi-language customer experience
- reporting dashboards across verticals

Phase 3 requires governance around production data, permissions, shared migrations, and brand separation.

## Safety Checklist

Before implementing any architecture change, confirm:

- Is every write inside `/Users/daibang/Documents/operon-kitchens`?
- Is the change kitchen-namespaced?
- Is it additive and reversible?
- Could it affect Operon Flooring or Oz Timber Floor?
- Could it affect shared production Supabase resources?
- Does it expose supplier costs, internal rates, or margins?
- Does it imply the online estimate is a final fixed quote?

If any answer is uncertain, stop and ask Vincent before proceeding.
