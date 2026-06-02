# Quote Review Report Template

Last updated: 2 June 2026

Purpose: define the customer-safe structure for a future Operon Kitchens quote review report before building paid review, PDF export, file download, full CRM or payment.

## Status

This is a local planning document only.

Do not implement live paid quote review, automated document review, file downloads, payment, customer login or CRM workflows from this spec without explicit Vincent approval.

## Positioning

Customer headline:

`Review your kitchen quote before comparing totals.`

Customer explanation:

`A lower total can still become expensive if demolition, trades, appliances, benchtops, exclusions, access conditions or provisional allowances are unclear. This report helps identify what is clear, what needs clarification and what should be confirmed before commitment.`

Safe wording:

- general guidance only
- not legal advice
- not a final quote
- does not approve, certify or reject another contractor's quote
- site measure and written scope confirmation required before project-specific pricing

## Report Summary

The report should open with a concise summary:

- project name or suburb
- date reviewed
- quote source or contractor name if supplied by customer
- review readiness label
- scope clarity label
- allowance risk label
- missing information label
- recommended next step

Recommended labels:

- `Needs more detail`
- `Basic review ready`
- `Strong review ready`

Avoid harsh primary score displays such as `0/100`. Numeric scores may be internal or secondary only.

## 1. Scope Clarity

Purpose: help the customer understand whether the quoted total has a clear scope behind it.

Review areas:

- demolition and removal
- cabinetry supply
- cabinetry installation
- benchtop supply and install
- splashback
- sink, tap and plumbing fit-off
- appliances
- electrical scope
- gas scope if relevant
- painting and plaster patching
- flooring touch-up or by others
- rubbish removal
- final clean
- delivery and access

Customer-facing output:

- what appears included
- what appears excluded
- what is unclear
- what should be clarified in writing

Example wording:

`The quote appears to include cabinetry and benchtop work, but rubbish removal, plaster patching and electrical relocation need written confirmation before comparing totals.`

## 2. Allowance Risk

Purpose: identify whether PC sums, provisional sums and allowances could change the final project cost.

Review areas:

- PC sums
- provisional sums
- appliance allowance
- benchtop allowance
- splashback allowance
- hardware allowance
- delivery allowance
- trade allowance
- site-specific contingency wording

Customer-facing output:

- clear allowances
- unclear allowances
- high-risk allowances
- questions to ask before accepting the quote

Safe wording:

`Allowance items may require confirmation. They are not necessarily wrong, but they should be clear before comparing quote totals.`

## 3. Missing Information

Purpose: identify missing details that reduce review confidence.

Common missing items:

- measurements
- layout or cabinet run
- photos
- floor plan
- appliance list
- finish tier
- benchtop/splashback material
- service relocation details
- strata/access details
- demolition scope
- waste/removal scope
- site measure confirmation

Customer-facing output:

- missing documents
- missing selections
- missing site details
- likely impact on confidence

Example wording:

`Photos, measurements and appliance selections would improve review confidence. Without them, service relocation and benchtop assumptions should be treated as provisional.`

## 4. Customer Questions

Purpose: give the homeowner clear next questions to send to the contractor or discuss with Operon Kitchens.

Default question set:

- Is demolition included?
- Is rubbish removal included?
- Are appliances included, excluded or listed as PC sums?
- Is electrical relocation included?
- Is plumbing relocation included?
- Is gas work involved?
- Is splashback included?
- Are benchtop cut-outs, joins and waterfalls included where relevant?
- Are delivery, access and parking allowances included?
- Are deposit and HBC items clear for the project value?
- Is final site measure required before written scope confirmation?

Customer-facing output should be practical and concise.

## 5. Compliance And Risk Prompts

Purpose: raise general review prompts without giving legal, building certification or compliance approval.

Possible prompts:

- written contract review may be required for residential building work over $5,000 including GST
- deposit guidance should be reviewed and should not suggest more than 10%
- HBC review may be required for projects over $20,000 including GST
- licensed plumbing, electrical and gas trades require review
- strata/apartment approval may require review
- DBP/class 2 screening may be needed for relevant apartment work
- engineered-stone restrictions may affect benchtop/splashback options
- older properties may require asbestos or hazardous material review
- final site measure required before written scope confirmation

Required disclaimer:

`These are general review prompts only and are not legal advice, compliance approval or building certification. Project-specific confirmation is required.`

## 6. Recommended Next Step

Purpose: guide the customer to the safest next action.

Possible outcomes:

- ask contractor for written clarification
- upload additional photos/plans/selections
- request Operon Kitchens professional review
- request site measure
- confirm selections before comparing totals
- pause commitment until exclusions and allowances are clearer

Example wording:

`Recommended next step: request written clarification on appliance allowance, electrical relocation and rubbish removal before comparing this total against another quote.`

## 7. Report Footer

Footer should always include:

- not a final quote
- not legal advice
- not compliance approval
- subject to site measure
- written scope confirmation required
- uploaded documents remain customer-provided information

Suggested footer:

`This review is general guidance for quote clarity. It does not approve, certify or reject another contractor's quote and is not legal advice. Final project-specific pricing requires site measure, confirmed selections, licensed trade review where relevant and written scope confirmation.`

## Internal Preparation Notes

Internal preparation may track:

- review readiness
- key risk themes
- missing documents
- follow-up recommendation

Do not show internal lead score, admin priority, hidden pricing logic, supplier costs, internal rates, margins or internal notes to the customer.

## Future Implementation Ideas

These are deferred until explicit approval:

- PDF report generation
- paid detailed quote review
- admin file download
- admin file deletion
- retention workflow
- customer account
- CRM pipeline
- payment or checkout
- automated document extraction

## Local QA Checklist

Before turning this spec into UI or reports:

- public copy avoids final quote promises
- public copy avoids legal/compliance approval claims
- no internal pricing fields are customer-visible
- report fields map to customer-safe review output
- quote review stays separate from payment and full CRM
- site measure and written scope confirmation remain clear
