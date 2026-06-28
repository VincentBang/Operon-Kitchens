# Quote Review First Manual Trial Prep

Last updated: 21 June 2026

Purpose: prepare the first unpaid Operon Kitchens quote-review trial from a controlled lead before building payment, PDF automation, customer accounts, CRM or automated document review.

Deployment status: not needed. This is a local operations document only.

## Trial Goal

Use one controlled lead to practise a customer-safe quote-review report that answers:

- what scope appears clear
- which allowances or provisional items need review
- what information is missing
- what customer-ready questions should be asked
- which general compliance/risk prompts apply
- what the safest recommended next step is

Do not send this as a paid product. Do not describe it as legal advice, compliance approval, HBC approval, strata approval, building certification, guaranteed savings or a final quote.

## Lead Selection Criteria

Choose one controlled-test lead from `/admin/leads` that has at least three of:

- existing quote details or a quote file
- photos, plans or appliance information
- suburb and property type
- project stage
- customer concern/message
- site-measure or quote-review intent
- strata/access or service-relocation context

If fewer than three inputs exist, use the lead only as a `Needs more detail` practice case.

## Input Copy Rules

Copy into the worksheet:

- customer name or initials
- suburb
- property type
- project stage
- quote/photos/plans availability
- customer concern/message
- uploaded file names/categories only
- source/UTM only if useful for the trial

Do not copy into a customer-facing draft:

- internal notes
- supplier costs
- internal rates
- margin or markup logic
- lead score
- admin priority
- service keys
- hidden pricing logic
- raw private file contents beyond the quote details being reviewed

## Trial Steps

1. Open `/admin/leads` with the admin token.
2. Select one controlled-test lead.
3. Copy customer-safe details into [Quote Review Manual Trial Worksheet](./quote-review-manual-trial-worksheet.md).
4. Choose a readiness label:
   - `Needs more detail`
   - `Basic review ready`
   - `Strong review ready`
5. Complete scope clarity notes.
6. Complete allowance risk notes.
7. List missing information.
8. Draft customer-ready questions.
9. Add only relevant general compliance/risk prompts.
10. Write one recommended next step.
11. Run the safety check in [Quote Review Report Readiness Checklist](./quote-review-report-readiness-checklist.md).
12. Record lessons in [Quote Review Trial Log](./quote-review-trial-log.md).

## Customer-Safe Mini Report Shape

Use this order for the first trial:

1. Review readiness label
2. Short context summary
3. Scope clarity
4. Allowance risk
5. Missing information
6. Customer-ready questions
7. General compliance/risk prompts
8. Recommended next step
9. Site measure and written scope reminder

Required footer:

```text
This review is general guidance for quote clarity. It does not approve, certify or reject another contractor's quote and is not legal advice. Project-specific pricing requires site measure, confirmed selections, licensed trade review where relevant and written scope confirmation.
```

## First Trial Quality Gate

Before calling the trial useful, confirm:

- readiness label matches the evidence supplied
- the report avoids final price comparison claims
- every unclear item becomes a customer question
- every compliance item is framed as a general prompt
- the recommended next step is one action, not a sales pitch
- no internal fields or pricing logic appear in the draft
- site measure and written scope confirmation remain clear

## Trial Outcome Decision

After the first trial, choose one:

- continue manual trials unchanged
- refine the worksheet
- refine `/request-review` fields
- refine `/quote/review` intake copy
- pause quote-review packaging until better lead inputs exist

Keep payment, checkout, PDF automation, customer login, full CRM and automated document review deferred until Vincent explicitly approves.

