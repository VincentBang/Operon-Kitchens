# Next 100 Local Tasks: Viewport And Release Readiness Batch

Last updated: 17 June 2026

Purpose: complete the next no-deploy Operon Kitchens batch by reviewing the current release candidate at key local viewports, tightening customer-safe strata wording, and preparing a clearer release smoke-check pack before any approved deployment.

Deployment status: not needed. This batch does not approve a push, deploy, production verification, Netlify setting change or production Supabase change.

## Execution Boundary

- Work only inside `/Users/daibang/Documents/operon-kitchens/**`.
- Do not touch Operon Flooring or Oz Timber Floor.
- Do not expose supplier costs, internal rates, margin logic, lead scores, admin priority, service keys or hidden pricing logic.
- Do not promise final fixed quote, legal advice, compliance approval, HBC approval, strata approval, guaranteed savings or instant custom kitchen ordering.
- Do not add payment, CRM, customer auth, public file URLs, physical deletion or retention automation.

## Completed Task Queue

### A. Repo And Operating Context

1. Re-read `AGENTS.md`.
2. Re-read `PROJECT_BRIEF.md`.
3. Re-read `CODEX_TASKS.md`.
4. Re-read `DEPLOYMENT_RULES.md`.
5. Re-read `DECISION_LOG.md`.
6. Re-read `docs/release-checkpoints.md`.
7. Confirm the current branch.
8. Confirm the working tree before edits.
9. Confirm this is Operon Kitchens only.
10. Confirm deployment remains paused.

### B. Visual Review Scope

11. Use the previous visual batch as the starting point.
12. Select `/` for homepage proof hierarchy.
13. Select `/quote/review` for quote-review conversion.
14. Select `/request-review` for intake conversion.
15. Select `/site-measure` for staged-service positioning.
16. Select `/admin/leads` for internal operator readability.
17. Include 1440px desktop.
18. Include 1280px desktop.
19. Include 768px tablet.
20. Include 390px mobile.

### C. Mobile Coverage

21. Include 360px mobile.
22. Check document width against viewport width.
23. Check H1 count.
24. Check title/meta presence through rendered title.
25. Check public header presence on public pages.
26. Check public footer presence on public pages.
27. Check admin route intentionally omits public header.
28. Check admin route intentionally omits public footer.
29. Check CTA presence.
30. Check chatbot presence only where appropriate.

### D. Public Copy Safety

31. Scan rendered routes for `scope??Ask`.
32. Scan rendered routes for `brand.Planning`.
33. Scan rendered routes for final fixed quote claims.
34. Scan rendered routes for guaranteed savings claims.
35. Scan rendered routes for legal approval claims.
36. Scan rendered routes for compliance approval claims.
37. Scan rendered routes for service-key language.
38. Scan rendered routes for supplier-cost language.
39. Scan rendered routes for lead-score language.
40. Separate internal admin warning text from customer-facing copy checks.

### E. Customer-Safe Strata Wording

41. Review public uses of `strata approval`.
42. Preserve internal field names such as `strataApprovalRequired`.
43. Replace homepage sample exclusions with approval-or-notification review language.
44. Replace quote-review value-card language with owners-corporation approval review language.
45. Replace areas page copy with approval-review language.
46. Replace quote-review service limit copy with approval-review language.
47. Replace quote-review engine explanation language with approval-review language.
48. Replace customer-ready quote questions with owners-corporation review language.
49. Replace pricing risk reason language with approval-or-notification review language.
50. Replace pricing exclusions with approval-or-notification review language.

### F. SEO And Service Copy Alignment

51. Update area data quote risks.
52. Update service page strata exclusions.
53. Update education guide apartment prompts.
54. Update education guide apartment FAQ wording.
55. Update glossary wording.
56. Keep NSW strata/owners-corporation wording careful.
57. Avoid saying Operon grants approval.
58. Avoid saying a quote is approved.
59. Avoid saying a project is compliant.
60. Keep project-specific confirmation language.

### G. Local Viewport Result Record

61. Record routes checked.
62. Record viewports checked.
63. Record no-overflow result.
64. Record one-H1 result.
65. Record public header/footer result.
66. Record admin noindex result.
67. Record admin isolation result.
68. Record chatbot observations.
69. Record copy scanner observations.
70. Record false-positive internal-admin warnings separately.

### H. Release Smoke Pack

71. Define a one-approved-deploy smoke check.
72. Include homepage smoke check.
73. Include quote-review smoke check.
74. Include request-review smoke check.
75. Include site-measure smoke check.
76. Include admin-leads auth smoke check.
77. Include no public admin-link check.
78. Include no secrets/internal-pricing check.
79. Include upload signed-download check only if Vincent chooses the file bundle.
80. Include stop-after-one-deploy rule.

### I. Documentation Links

81. Add this task batch document.
82. Add the viewport review document.
83. Add the release smoke-check pack.
84. Link the new batch from `docs/README.md`.
85. Link the viewport review from `docs/README.md`.
86. Link the smoke-check pack from `docs/README.md`.
87. Link the new batch from `CODEX_TASKS.md`.
88. Update `DECISION_LOG.md`.
89. Add tests for the new docs.
90. Keep all docs local-only.

### J. Verification And Closeout

91. Run the viewport script locally.
92. Run `npm test -- --runInBand`.
93. Run `npm run lint`.
94. Run `npm run build`.
95. Run `git diff --check`.
96. Confirm no Operon Flooring files changed.
97. Confirm no Oz Timber files changed.
98. Confirm no deploy was triggered.
99. Create one local commit if useful.
100. Report deployment status and next recommended task.

## Completion Summary

Completed locally on 17 June 2026.

No deploy, no push, no production verification, no Netlify setting changes and no production Supabase changes were performed.

Next recommended local-only task: if Vincent wants to spend one deploy, use `docs/release-smoke-check-pack-2026-06-17.md`; otherwise continue local quote-review manual trial preparation and tester feedback capture.
