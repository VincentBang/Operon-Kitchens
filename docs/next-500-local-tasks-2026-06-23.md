# Next 500 Local Tasks

Last updated: 23 June 2026

Purpose: convert Vincent's "next 500 tasks" direction into a safe no-deploy execution map for Operon Kitchens.

Deployment status: not needed. This document does not approve deployment, push to `main`, Netlify changes, production Supabase changes, payment, customer accounts, full CRM or broad feature expansion.

## Operating Rule

Work in small local slices. Each slice should improve controlled testing, operator readiness, quote-review usefulness or release confidence without triggering Netlify.

Run the local gate after implementation work:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

## Block 1: Tasks 1-100 - Quote-Review Manual Trial Readiness

Goal: make the unpaid/manual quote-review trial commercially useful before payment or CRM.

1. Keep the report template customer-safe.
2. Keep the readiness checklist current.
3. Keep the manual trial worksheet easy to fill.
4. Add a filled fake no-customer-data example.
5. Use controlled leads only for real trials.
6. Copy only customer-safe details from `/admin/leads`.
7. Avoid internal notes in customer drafts.
8. Avoid supplier costs.
9. Avoid internal rates.
10. Avoid margin or markup logic.
11. Avoid lead score.
12. Avoid admin priority.
13. Avoid service keys.
14. Avoid final quote claims.
15. Avoid legal advice claims.
16. Avoid compliance approval claims.
17. Avoid HBC approval claims.
18. Avoid strata approval claims.
19. Use `Needs more detail` when inputs are weak.
20. Use `Basic review ready` when quote context exists but details are incomplete.
21. Use `Strong review ready` only with enough quote, photo, plan and selection detail.
22. Convert unclear scope into customer-ready questions.
23. Keep compliance items as general prompts.
24. Keep recommended next step to one clear action.
25. Track missing-information themes.
26. Track whether the worksheet is too slow.
27. Track whether customers understand the report.
28. Track whether `/request-review` needs field changes.
29. Track whether `/quote/review` needs copy changes.
30. Keep paid review deferred until several manual trials are useful.
31-100. Repeat controlled trials, refine copy and record lessons without adding payment, PDF automation, customer accounts or full CRM.

Current slices executed:

- first filled fake apartment/strata trial example added locally
- second filled fake house/full-renovation service-relocation example added locally
- worksheet comparison noted: service relocation may need separate plumbing, electrical, gas and make-good prompts after more controlled leads
- manual worksheet optional service-relocation prompts added locally for operator use only; public `/request-review` fields remain unchanged
- real controlled-lead trial log added locally to track whether service-relocation prompts were used before changing public intake copy
- service-relocation wording snippets added locally for manual reports without legal advice, compliance approval or final quote language
- manual quote-review response draft added locally for copy/paste use on the first real controlled lead

## Block 2: Tasks 101-200 - Controlled Testing Operations

Goal: make lead handling repeatable while email/domain work is still deferred.

101. Use the controlled testing handoff before daily checks.
102. Check `/admin/leads` daily while email is off.
103. Update status after first response.
104. Use safe internal notes.
105. Record confusion points in the findings log.
106. Check UTM/source attribution for test leads.
107. Confirm request-review submissions have enough context.
108. Confirm privacy/terms acknowledgements remain clear.
109. Confirm mobile form spacing remains usable.
110. Confirm admin status updates remain easy on mobile.
111-200. Fix only repeated blocker or high-friction issues; keep broad UI and feature changes batched for approved release checkpoints.

## Block 3: Tasks 201-300 - File Upload MVP Release Prep

Goal: prepare file operations without expanding runtime scope casually.

201. Keep private bucket posture documented.
202. Keep metadata table SQL documented.
203. Keep admin metadata display documented.
204. Keep signed-download checklist current.
205. Keep signed-download troubleshooting current.
206. Keep soft-delete preflight current.
207. Keep deletion UI design separate from runtime release.
208. Keep retention decision worksheet current.
209. Do not add physical deletion until approved.
210. Do not add customer file portal.
211-300. Prepare one approved file-operation release only if Vincent chooses it; otherwise leave local-only.

## Block 4: Tasks 301-400 - Domain, Email And Release Readiness

Goal: prepare professional controlled testing without wasting Netlify credits.

301. Keep domain/email checklist current.
302. Keep Resend as notification only.
303. Keep Supabase as source of truth.
304. Keep one-production-test lead flow documented for future approval.
305. Keep release smoke pack short.
306. Keep release decision notes clear.
307. Keep Netlify deploy minimisation in every report.
308. Keep local release bundle checklist current.
309. Avoid clear-cache deploys unless approved.
310. Avoid production verification loops unless approved.
311-400. Batch release candidates and stop after one smoke-check cycle when approved.

## Block 5: Tasks 401-500 - SEO And Public Content Rollout After Operations

Goal: expand acquisition only after controlled testing proves lead handling is stable.

401. Keep existing SEO pages deep rather than creating thin pages.
402. Prioritise quote-risk clusters.
403. Prioritise apartment/strata clusters.
404. Prioritise benchtop/materials clusters.
405. Prioritise area uniqueness without doorway pages.
406. Keep internal links toward `/quote`, `/quote/review`, `/request-review` and `/site-measure`.
407. Keep public copy guardrails.
408. Avoid fake proof.
409. Avoid final fixed quote language.
410. Avoid compliance certainty.
411-500. Expand only in measured batches after operational readiness, controlled tester feedback and release capacity are clear.

## Next Local Slice

Run two or three real controlled quote-review trials using the worksheet. If the same service-relocation gaps appear, then decide whether `/request-review` or `/quote/review` needs a small public intake-copy update.
