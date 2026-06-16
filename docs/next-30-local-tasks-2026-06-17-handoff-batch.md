# Next 30 Local Tasks: Controlled Testing Handoff Batch

Last updated: 17 June 2026

Purpose: execute the second approved no-deploy batch for Operon Kitchens controlled testing. This batch turns the existing playbooks into a shorter operator handoff, verifies request-review/admin readiness, and prepares the next file-operation and quote-review trial materials.

Deployment status: not needed. Do not push, deploy, create previews, clear cache, edit Netlify settings, edit production Supabase settings or perform production verification from this list.

## Execution Rules

- Work only inside `/Users/daibang/Documents/operon-kitchens/**`.
- Do not touch Operon Flooring or Oz Timber Floor.
- Do not expose supplier costs, internal rates, margin logic, lead scores, admin priority, service keys or hidden pricing logic.
- Do not promise a final fixed quote, legal approval, compliance approval, HBC approval, strata approval, guaranteed savings or instant custom kitchen ordering.
- Use local tests, local lint, local build and `git diff --check`.

## Task Queue

### Operator Handoff

1. Create one `Controlled Testing Handoff` page that condenses operator docs.
2. Add that handoff page to `docs/README.md`.
3. Link the handoff page from `CODEX_TASKS.md`.
4. Add a daily `/admin/leads` routine summary to the handoff.
5. Add a trusted tester flow summary to the handoff.
6. Add a what-not-to-promise summary to the handoff.
7. Add a site-measure trigger summary to the handoff.
8. Add a file-upload status summary to the handoff.
9. Add a quote-review manual trial summary to the handoff.
10. Add a release checkpoint summary to the handoff.

### Request Review And Admin Review

11. Review `/request-review` against the handoff and note any copy or UX mismatch.
12. Review `/admin/leads` against the handoff and note any operator friction.
13. Add small local request-review copy fixes if needed.
14. Add small local admin-leads copy fixes if needed.
15. Confirm request-review privacy/terms acknowledgement tests still cover the form.
16. Confirm attribution/UTM tests still cover the form.
17. Confirm admin noindex/no public navigation tests still pass.
18. Confirm public copy guardrails still block unsafe wording.
19. Run a local visual spot check for `/request-review` and `/admin/leads`.
20. Document any remaining controlled-testing friction.

### File Operations

21. Prepare a short file-upload signed-download deploy checklist for one future approved deploy.
22. Prepare a soft-delete verification checklist for one future approved deploy.
23. Review signed-download function tests for missing cases.
24. Review soft-delete function tests for missing cases.
25. Add any missing file-operation tests.
26. Update file-upload docs if test gaps are found.

### Quote Review Manual Trial

27. Prepare quote-review manual trial pack with worksheet, snippets and trial log.
28. Add one fake/sample quote-review example using no real customer data.

### Final Local Gate

29. Run local test/lint/build/diff checks.
30. Make one local commit only if useful, with no push/deploy.

## Status

- Tasks 1-10: complete
- Tasks 11-20: complete
- Tasks 21-28: complete
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

Next recommended local-only task: prepare the next approved release-bundle note for signed download + soft-delete function readiness, without adding the visible delete button yet.
