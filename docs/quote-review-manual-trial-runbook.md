# Quote Review Manual Trial Runbook

Last updated: 17 June 2026

Purpose: run unpaid manual quote-review trials from controlled leads before payment, PDF automation, customer accounts or CRM.

Deployment status: not needed. This is a local operations runbook.

## Inputs

Use:

- controlled tester lead details
- customer-provided quote notes
- uploaded file metadata
- manually reviewed quote excerpts
- customer questions

Do not use or expose:

- supplier costs
- internal rates
- margin logic
- lead score
- admin priority
- internal notes
- service keys
- hidden pricing logic

## Review Sections

### Scope Clarity

Check whether the quote clearly covers:

- cabinetry
- benchtop
- splashback
- demolition
- rubbish removal
- appliance handling
- electrical scope
- plumbing/gas scope
- site access
- strata constraints

### Allowance Risk

Check:

- PC sums
- provisional sums
- appliance allowances
- benchtop assumptions
- edge/cut-out/join details
- trade exclusions

### Missing Information

List missing items as customer-ready questions.

Use:

- `Please confirm whether...`
- `Ask the provider to clarify...`
- `This may require confirmation before comparing totals.`

Avoid:

- legal conclusions
- compliance conclusions
- claims that another quote is wrong
- final price comparisons

### Compliance Prompts

Use general prompts only:

- written contract review may be relevant depending on project value
- HBC review may be relevant depending on project value
- deposit terms should be reviewed against applicable NSW rules
- licensed trade review may be required for plumbing, electrical and gas work
- strata approval/access may require review
- engineered-stone/material restrictions may require supplier/trade confirmation

Always include:

```text
This is general guidance only and not legal advice. Site measure and written scope confirmation are required before project-specific pricing.
```

## Trial Output

Each manual trial should produce:

- readiness label
- scope clarity notes
- allowance risk notes
- missing information list
- customer questions
- general compliance prompts
- recommended next step
- operator lesson learned

## Stop Conditions

Stop and refine the workflow if:

- the review depends on unavailable documents
- the customer-facing wording sounds like legal advice
- the report implies guaranteed savings
- the report implies final project pricing
- the operator cannot explain the next step clearly

