# Operon Kitchens Operational Readiness

This document records future operating-system work for Operon Kitchens. It is planning documentation only. No production database, payment, login, supplier API or booking service is connected by this repository change.

## Customer Journey To Preserve

1. Free planning estimate
2. Upload photos, plans or an existing quote
3. Basic quote review and readiness prompts
4. Professional review request
5. Site measure and scope review
6. Design/specification package, if needed
7. Written scope confirmation
8. Contract and project delivery decisions

Operon Kitchens must keep using planning ranges, confidence scoring, assumptions, exclusions, manual review flags and compliance prompts until site measure and written scope confirmation are complete.

## Future Kitchen-Namespace Data Model

Use kitchen-specific names for any future shared infrastructure:

- `kitchen_leads`
- `kitchen_quotes`
- `kitchen_quote_files`
- `kitchen_quote_reviews`
- `kitchen_rate_cards`
- `kitchen_admin_notes`
- `kitchen_project_events`
- `operon_kitchens_files` storage bucket

All migrations should be additive, kitchen-scoped and reviewed before being applied to production. Do not modify Flooring or Oz Timber tables, functions, buckets or policies.

## Manual Review Queue

Future admin workflow should support:

- quote review requests
- site measure requests
- uploaded quote/photos/plans
- confidence score and review risk
- customer-ready questions
- internal follow-up notes
- status stages such as `new`, `needs_files`, `reviewing`, `site_measure_requested`, `scope_ready`, `closed`

Lead quality and internal follow-up priority are internal-only and must not be returned to customer-facing components.

## File Storage

Future storage should:

- use a kitchen-namespaced bucket
- store quote PDFs, photos, plans and drawings
- restrict access by kitchen lead/quote ID
- retain files only as long as needed for quote review and project follow-up
- document deletion request handling

## Follow-Up And Reporting

Future workflow can add:

- email follow-up after estimate submission
- quote review summary email
- site measure request confirmation
- PDF planning report export
- PDF detailed review report
- admin note templates

Do not send emails from production until credentials, consent handling and sender domain settings are approved.

## Future Paid Products

Potential future offers:

- detailed quote review report
- site measure / professional scope review
- design/specification package
- project delivery booking
- customer account for saved estimates and reports

Do not add checkout, deposits, payment links or paid booking flows until Vincent explicitly approves payment implementation and the required legal/commercial review is complete.
