# Next 100 Local Tasks: Controlled Testing Readiness

Last updated: 17 June 2026

Purpose: execute the next no-deploy Operon Kitchens task batch according to the current master plan. This batch keeps work local, prepares release/readiness documents, and avoids new runtime features.

Deployment status: not needed. This document does not approve push, deploy, Netlify setting changes, production Supabase changes or production verification.

## Execution Boundary

- Work only inside `/Users/daibang/Documents/operon-kitchens/**`.
- Do not touch Operon Flooring or Oz Timber Floor.
- Do not expose supplier costs, internal rates, margin logic, lead scores, admin priority, service keys or hidden pricing logic.
- Do not promise final fixed quote, legal advice, compliance approval, HBC approval, strata approval, guaranteed savings or instant custom kitchen ordering.
- Do not add payment, full CRM, customer auth, public file URLs, physical file deletion, retention automation or broad SEO page expansion.

## Completed Task Queue

### A. Release Discipline

1. Re-read `AGENTS.md`.
2. Re-read `PROJECT_BRIEF.md`.
3. Re-read `CODEX_TASKS.md`.
4. Re-read `DEPLOYMENT_RULES.md`.
5. Re-read `DECISION_LOG.md`.
6. Re-read `docs/release-checkpoints.md`.
7. Confirm current branch and latest commit.
8. Confirm no uncommitted changes before the batch.
9. Confirm no Operon Flooring or Oz Timber edits are needed.
10. Keep the batch local-only.

### B. 100-Task Tracking

11. Create this 100-task queue.
12. Link it from the docs index.
13. Link it from `CODEX_TASKS.md`.
14. Add a decision-log entry for the 100-task local readiness batch.
15. Keep the task list grouped by release discipline, file upload, domain/email, quote review, admin ops, SEO and final gate.
16. Mark deployment as not needed.
17. State deferred runtime work clearly.
18. State safe wording boundaries clearly.
19. State internal-field boundaries clearly.
20. State production-system boundaries clearly.

### C. Release Gate Readiness

21. Create a combined release gate note for trust, visual and file-upload readiness.
22. Separate cosmetic release checks from backend file-operation checks.
23. Document when a deploy is required.
24. Document when a deploy is optional.
25. Document when a deploy is not needed.
26. Add a one-bundle smoke-check route list.
27. Add a stop-condition list for unsafe public copy.
28. Add a stop-condition list for secret/internal-field exposure.
29. Add a stop-condition list for file-operation failure.
30. Add a final approval checklist.

### D. File Upload Release Prep

31. Create a file-upload approved-release runbook.
32. Confirm private bucket posture is the expected posture.
33. Confirm server-side Netlify Functions remain the upload/download path.
34. Confirm no browser-side Supabase write path is approved.
35. Confirm signed downloads require admin token.
36. Confirm soft-delete remains metadata-only.
37. Confirm visible delete button remains deferred.
38. Confirm physical object deletion remains deferred.
39. Confirm retention automation remains deferred.
40. Confirm one controlled live test is enough after an approved deploy.

### E. Domain, Email And Resend Readiness

41. Create a domain/email/Resend verification runbook.
42. Keep Supabase as the source of truth.
43. Keep email as notification only.
44. Document env vars needed for email.
45. Document that branded domain/sender setup is manual.
46. Document one approved production lead test after email setup.
47. Document expected email content boundaries.
48. Document what not to log.
49. Document how to recover if email fails but storage succeeds.
50. Keep domain/email setup out of this local batch.

### F. Quote Review Manual Trial

51. Create a quote-review manual trial runbook.
52. Align it with the report template.
53. Align it with the manual worksheet.
54. Align it with wording snippets.
55. Align it with paid-service packaging.
56. Define scope clarity review.
57. Define allowance risk review.
58. Define missing information review.
59. Define customer-ready questions.
60. Define recommended next step.

### G. Controlled Testing Feedback

61. Create a controlled testing feedback scorecard.
62. Score estimate clarity.
63. Score quote-review clarity.
64. Score request-review completion.
65. Score mobile friction.
66. Score admin handling.
67. Score trust/safety wording.
68. Score file metadata readiness.
69. Score next-step clarity.
70. Define when feedback becomes a blocker.

### H. Admin Operations

71. Create a weekly admin operations review.
72. Include daily `/admin/leads` check discipline.
73. Include status update review.
74. Include internal notes review.
75. Include source/UTM review.
76. Include upload metadata review.
77. Include unsafe-field leak review.
78. Include no-email fallback review.
79. Include unresolved lead review.
80. Include next-week actions.

### I. SEO Controlled Rollout

81. Create an SEO controlled rollout backlog.
82. Keep suburb doorway pages deferred.
83. Prioritise existing page depth over new page sprawl.
84. Keep quote-review conversion as the SEO support goal.
85. Keep site-measure/written-scope wording on SEO pages.
86. Add internal-link checks.
87. Add FAQ/schema guardrails.
88. Add duplicate/thin-page guardrails.
89. Add public-copy safety guardrails.
90. Add a backlog order for the next SEO clusters.

### J. Risk Register And Verification

91. Create an operations risk register.
92. Cover Netlify credit risk.
93. Cover Supabase storage/config risk.
94. Cover admin token handling risk.
95. Cover file retention risk.
96. Cover paid-service expectation risk.
97. Add docs tests for the new runbooks.
98. Run `npm test -- --runInBand`.
99. Run `npm run lint`, `npm run build` and `git diff --check`.
100. Report deployment status and next recommended task.

## Completion Summary

Completed locally on 17 June 2026.

No deploy, no push, no production verification, no Netlify setting changes and no production Supabase changes were performed.

Next recommended local-only task: prepare one human-readable release decision note for Vincent choosing between trust/visual-only deploy and file-upload backend deploy.

