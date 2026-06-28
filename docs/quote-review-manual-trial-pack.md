# Quote Review Manual Trial Pack

Last updated: 17 June 2026

Purpose: one-page operator pack for running unpaid, controlled quote-review report trials before payment, PDF automation, customer accounts or CRM expansion.

Deployment status: not needed. This is a local operations document only.

## Trial Inputs

Use customer-safe information from controlled leads only:

- customer name and suburb
- property type
- project stage
- whether a current quote exists
- whether photos/plans exist
- message and scope notes
- uploaded file metadata, not public file URLs
- any customer-provided quote details

Do not copy supplier costs, internal rates, margin logic, lead score, admin priority, service keys or internal notes into customer-facing drafts.

## Documents To Use

1. [Quote review manual trial worksheet](./quote-review-manual-trial-worksheet.md)
2. [Quote review wording snippets](./quote-review-wording-snippets.md), including service-relocation wording for plumbing, electrical, gas, make-good and older-property review prompts
3. [Quote review manual response draft](./quote-review-manual-response-draft.md)
4. [Quote review trial log](./quote-review-trial-log.md)
5. [Quote review sample trial](./quote-review-sample-trial.md)
6. [Paid quote review service packaging](./paid-quote-review-service-packaging.md)

## Trial Steps

1. Pick one controlled lead from `/admin/leads`.
2. Confirm the lead is suitable for manual review.
3. Fill the worksheet with only customer-safe facts.
4. Score scope clarity, allowance risk and missing information qualitatively.
5. Choose one readiness label: `Needs more detail`, `Basic review ready` or `Strong review ready`.
6. Add customer-ready questions.
7. Add general compliance prompts where relevant.
8. Add a recommended next step.
9. Put the customer-safe version into the manual response draft.
10. Log what was confusing, what was missing and what should be improved before a paid service.

## Customer-Safe Closing

Use wording like:

```text
This review is general guidance for quote clarity. It does not approve, certify or reject another contractor's quote and is not legal advice. Project-specific pricing requires site measure, confirmed selections, licensed trade review where relevant and written scope confirmation.
```

## Stop Conditions

Stop and refine the template if:

- the report feels like legal/compliance advice
- the report implies a final fixed price
- the report needs data that the intake form does not collect
- the report cannot explain PC sums, provisional sums or exclusions clearly
- the report cannot explain service relocation without sounding like trade inspection, legal advice or a final quote
- the report cannot produce a useful recommended next step
