# Next 30 Local Tasks: 17 June 2026

Purpose: define and execute the next controlled-testing tasks in order while Vincent is away.

Deployment status: not needed. Do not push, deploy, create previews or perform production verification from this list.

## Execution Rules

- Work only inside `/Users/daibang/Documents/operon-kitchens/**`.
- Do not touch Operon Flooring or Oz Timber Floor.
- Do not edit Netlify settings or production Supabase settings.
- Do not expose supplier costs, internal rates, margin logic, lead scores, admin priority, service keys or hidden pricing logic.
- Do not promise final fixed quote, legal approval, compliance approval, HBC approval, strata approval, guaranteed savings or instant custom kitchen ordering.

## Task Queue

### Release Discipline

1. Confirm working tree starts clean after the current-stage docs checkpoint.
2. Create this 30-task queue document.
3. Add the queue to the docs index.
4. Cross-link the queue from `CODEX_TASKS.md`.
5. Add a short decision-log entry for the controlled-testing execution order.
6. Add a release-bundle decision matrix for trust/visual/file-upload bundles.

### Controlled Testing Operations

7. Review the controlled-launch checklist for daily admin checks.
8. Add a tester feedback capture template.
9. Add a trusted-tester instructions page.
10. Add a no-email operating reminder for `/admin/leads`.
11. Add a lead triage script for first response.
12. Add a site-measure readiness checklist for operators.

### Request Review And Admin Hardening

13. Review `/request-review` form fields against the lead handling playbook.
14. Add/confirm tests for request-review privacy and terms acknowledgement.
15. Add/confirm tests for attribution fields.
16. Review `/admin/leads` noindex/no public nav guardrails.
17. Add an admin token handling note for operators.
18. Add a safe internal-notes style guide.

### File Upload MVP Prep

19. Add a file-upload release preflight checklist.
20. Add a signed-download operator troubleshooting guide.
21. Add a soft-delete release preflight note.
22. Add a retention decision worksheet.
23. Confirm docs do not imply public file URLs.
24. Confirm docs do not imply physical deletion is live.

### Quote Review Commercial Readiness

25. Add a manual quote-review trial log template.
26. Add example customer-safe quote-review wording snippets.
27. Add a paid-review launch blocker checklist.
28. Add a report delivery workflow draft without payment/PDF automation.

### Final Local Gate

29. Run local test/lint/build/diff checks.
30. Summarise what is complete, what remains deferred and the next recommended local-only task.

## Status

- Tasks 1-6: complete
- Tasks 7-12: complete
- Tasks 13-18: complete
- Tasks 19-24: complete
- Tasks 25-28: complete
- Tasks 29-30: complete

## Completion Summary

Completed locally on 17 June 2026.

Local gate passed:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

No deploy, no push and no production verification were performed.

Next recommended local-only task: review whether any of these docs should be condensed into a single operator handoff page before a future approved release.
