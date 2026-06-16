# Controlled Testing Feedback Scorecard

Last updated: 17 June 2026

Purpose: turn trusted tester feedback into a repeatable scorecard so only real blockers become release work.

Deployment status: not needed. This is a local testing document.

## Score Each Test

Use 1 to 5.

1. Blocker
2. High friction
3. Understandable with hesitation
4. Clear enough
5. Very clear

## Categories

### Estimate Clarity

Question: did the tester understand that the estimate is a planning range, not a final quote?

### Quote Review Clarity

Question: did the tester understand why comparing headline totals is risky before scope is clear?

### Request Review Completion

Question: could the tester complete the form without confusion?

### Mobile Friction

Question: did any field, CTA, attachment area, chatbot or sticky element block progress?

### Admin Handling

Question: could Vincent find the lead, status, notes, source and file metadata in `/admin/leads`?

### Trust And Safety Wording

Question: did the tester understand site measure, written scope and general guidance boundaries?

### File Metadata Readiness

Question: if files were attached, did metadata appear clearly enough for admin review?

### Next-Step Clarity

Question: did the tester know whether to estimate, review quote, request review or prepare site measure?

## Blocker Threshold

Treat as a blocker if:

- any category scores 1
- two or more testers score the same category 2
- a tester thinks they received a final quote
- a tester thinks the site gives legal/compliance approval
- a lead is not stored
- admin cannot safely recover the lead
- mobile layout prevents submission

## Weekly Summary

Record:

- number of testers
- routes tested
- average score per category
- blocker count
- top three confusion points
- recommended local-only fixes
- whether release is required, optional or not needed

