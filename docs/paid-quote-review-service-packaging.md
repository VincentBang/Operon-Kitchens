# Paid Quote Review Service Packaging

Last updated: 3 June 2026

Purpose: define the future paid detailed quote-review offer before adding payment, checkout, PDF automation, full CRM, customer accounts or broader file-management features.

## Status

This is a local planning document only.

Do not implement payment, checkout, automatic billing, public purchase buttons, customer accounts, full CRM workflows, PDF generation or live paid report delivery from this document without explicit Vincent approval.

Supabase leads and uploaded file metadata remain the source of truth. Email is notification only. The paid service should be packaged around a customer-safe review report, not around hidden pricing logic or automated approval claims.

## Positioning

Customer headline:

`Review your kitchen quote before comparing totals.`

Customer explanation:

`A lower kitchen quote can still become expensive if demolition, trades, appliances, benchtops, exclusions, access conditions or provisional allowances are unclear. A detailed quote review helps you understand what is clear, what needs written clarification and what should be checked before commitment.`

Safe positioning:

- detailed quote clarity review
- customer-ready questions before commitment
- general guidance only
- not legal advice
- not a final quote
- not compliance approval, HBC approval, strata approval or building certification
- site measure and written scope confirmation required before project-specific pricing

## Target Customer

Best suited for:

- Sydney homeowners with a kitchen quote in hand
- customers comparing two or more kitchen quotes
- apartment or strata customers with access, approval or work-hour concerns
- customers with PC sums, provisional sums or vague allowance wording
- customers close to commitment who need scope clarity before booking the next step

Not suited for:

- customers expecting instant contract pricing
- customers wanting legal advice or certification
- customers wanting full design/specification work before site measure
- customers wanting supplier procurement, ordering or installation booking from the review alone

## Required Inputs

Ask the customer to provide as much of the following as available:

- existing kitchen quote, screenshots or scope document
- photos, plans, drawings or measurements
- appliance list or appliance allowance notes
- benchtop and splashback notes
- property type, suburb and apartment/strata context
- access notes such as lift, parking, level and loading constraints
- current project stage and timing
- customer's main concern or comparison question

If inputs are incomplete, the review can still proceed only with a lower readiness label and clearer assumptions.

## Included In The Paid Detailed Review

The paid detailed review may include:

- scope clarity summary
- included, excluded and unclear items
- PC sum and provisional sum review prompts
- appliance allowance clarity
- benchtop and splashback clarity
- demolition, rubbish removal, delivery and final-clean review
- trade scope prompts for plumbing, electrical and gas
- access, lift, parking, strata and apartment review prompts
- written contract, deposit and HBC review prompts where project value suggests review may be needed
- engineered-stone restriction prompt where relevant
- older-property, asbestos or hazardous-material review prompt where relevant
- customer-ready questions to send to the contractor
- recommended next step, such as written clarification, upload more information, site measure or written scope confirmation

## Excluded From The Paid Detailed Review

The paid detailed review must not include or imply:

- final fixed quote or contract pricing
- guaranteed savings
- legal advice
- compliance approval
- HBC approval
- strata approval
- building certification
- approval or rejection of another contractor's quote
- licensed electrical, plumbing or gas inspection
- site measure unless separately agreed
- design/specification package unless separately agreed
- supplier ordering, procurement or installation booking
- full custom kitchen ordering before site measure and written scope confirmation
- public disclosure of supplier costs, internal rates, margins, markups, lead scores, admin priority, service keys or hidden pricing logic

## Customer-Safe Report Structure

Use the [Quote Review Report Template](./quote-review-report-template.md) as the base. A paid detailed review report should include:

1. Review summary
   - project context
   - readiness label
   - scope clarity label
   - allowance risk label
   - missing information label
   - recommended next step

2. Scope clarity
   - what appears included
   - what appears excluded
   - what is unclear
   - what should be confirmed in writing

3. Allowance risk
   - PC sums
   - provisional sums
   - appliance allowances
   - benchtop/splashback allowances
   - delivery, access and trade allowances

4. Missing or unclear information
   - missing documents
   - missing selections
   - missing measurements
   - service relocation unknowns
   - strata/access unknowns

5. Quote comparison notes
   - whether totals appear to describe the same scope
   - differences that may make quote totals hard to compare
   - items that should be clarified before accepting a quote

6. Compliance and risk prompts
   - written contract review over $5,000 including GST where relevant
   - deposit guidance, including 10% maximum deposit guidance
   - HBC review over $20,000 including GST where relevant
   - licensed plumbing, electrical and gas review
   - strata/apartment review
   - DBP/class 2 review where relevant
   - engineered-stone restriction
   - older-property/asbestos review
   - final site measure and written scope confirmation reminder

7. Customer-ready questions
   - clear questions the customer can send to the contractor or discuss with Operon Kitchens

8. Recommended next step
   - ask for written clarification
   - upload more photos/plans/selections
   - request professional review continuation
   - request site measure
   - pause commitment until scope is clearer

Required report footer:

`This review is general guidance for quote clarity. It is not a final quote, legal advice, compliance approval, HBC approval, strata approval or building certification. Project-specific pricing requires site measure, confirmed selections, licensed trade review where relevant and written scope confirmation.`

## Delivery Expectations

Future customer-facing delivery copy should be cautious until the operational process is proven.

Use:

- delivered after review of the provided documents
- may require additional information
- timeframes start after required documents are received
- complex apartment, strata, older-property or service-relocation projects may require site measure before useful comparison
- report delivery does not create contract pricing or project booking

Avoid:

- instant approval
- same-day guarantee unless operationally confirmed
- final price
- guaranteed savings
- legally checked
- compliance certified

## Refund And Cancellation Principles

These are draft principles for future service terms. They are not a live refund policy until paid services are approved and published.

Suggested principles:

- If the customer cancels before review work starts, a refund or cancellation may be available under the published paid-service terms.
- If review work has started, a partial refund or credit may depend on the work completed, the published terms and applicable law.
- If the report has been delivered, the service may not be refundable except where required by Australian Consumer Law or applicable law.
- If the supplied documents are too incomplete to prepare a useful review, Operon Kitchens may request more information, offer a credit, or cancel/refund according to the published terms.
- Nothing in the paid-service terms should exclude rights that cannot be excluded under Australian Consumer Law.
- Payment fees, cancellation windows, report scope, delivery timing and refund steps must be published before payment is enabled.

## Internal Packaging Notes

Internal operations may track:

- review readiness
- lead source
- uploaded file availability
- missing document themes
- follow-up status
- internal notes in admin-lite

Do not include internal lead score, admin priority, internal notes, supplier costs, internal rates, margins, markups or hidden pricing logic in customer reports, emails or browser responses.

## Launch Gate Before Payment

Before enabling paid quote review:

- run controlled unpaid/manual report trials
- confirm report template is practical
- confirm privacy and terms cover paid detailed review
- publish price, inclusions, exclusions, delivery timing and cancellation/refund principles
- decide whether PDF generation is manual or automated
- decide where completed reports are stored
- decide how customers receive completed reports
- confirm domain/email/Resend setup
- confirm admin file download and retention rules
- run local tests, lint, build and `git diff --check`
- get explicit Vincent approval for payment implementation and deployment

## Deferred

Do not build from this document yet:

- payment or checkout
- coupon/refund logic
- customer accounts
- customer report portal
- automated PDF generation
- full CRM
- public file download links
- automated document extraction
- supplier API
- final quote/order workflow
