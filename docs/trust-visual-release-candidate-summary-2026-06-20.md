# Trust / Visual Release Candidate Summary

Last updated: 20 June 2026

Purpose: one-page summary for Vincent before approving one future trust/visual deploy.

Deployment status: optional, not approved by this document. Do not push or deploy unless Vincent explicitly approves the release.

## Recommendation

Approve this as the next trust/visual polish release when Vincent is ready to spend one Netlify deploy.

Keep file-upload backend operations, domain/email/Resend, paid quote review, customer accounts, payment and CRM work separate.

## Why This Release Is Worth One Deploy

- It improves controlled customer testing without adding risky backend scope.
- It fixes the homepage final CTA buttons that could look empty above the footer.
- It preserves the customer-safe quote/review positioning and staged site-measure pathway.
- It keeps Supabase, Netlify settings, file operations and payment untouched.

## Included In This Candidate

Customer-facing polish:

- compact Operon Kitchens visual system and header/footer polish already prepared locally
- rounded dark footer and white page/header chrome
- button colour consistency with the Operon family visual direction
- homepage final CTA ghost buttons fixed with visible white text and subtle borders
- controlled tester feedback capture updated to catch CTA visibility issues
- public copy guardrails retained for planning estimate, site measure and written scope language

Docs and tests:

- controlled-testing findings log
- tester feedback capture fields for CTA visibility
- feedback scorecard with CTA visibility as a blocker category
- release-bundle checklist carrying this fix into the trust/visual bundle
- visual-system and controlled-testing docs tests updated

## Excluded From This Candidate

- no file-upload signed-download release
- no soft-delete or visible delete button
- no production Supabase setting change
- no Netlify setting change
- no production verification loop
- no Resend/domain/email activation
- no paid quote-review checkout
- no customer login
- no CRM expansion
- no broad SEO rollout

## Local Verification Already Completed

Latest local gate passed:

- `npm test -- --runInBand`
- `npm run lint`
- `npm run build`
- `git diff --check`

Local controlled tester simulation checked:

- `/`
- `/quote`
- `/quote/review`
- `/request-review`
- `/admin/leads`

Result:

- all checked local static routes returned `200`
- no horizontal overflow at desktop `1440x900` or mobile `390x844`
- homepage final CTA buttons are readable locally
- `/quote` shows `Step 1 of 9` and a visible `Next` control on mobile
- `/request-review` shows privacy/terms path and submit flow
- no checked rendered page showed `scope??Ask`, `brand.Planning`, final fixed quote, legal/compliance approval, guaranteed savings, service-role-key wording or instant-ordering wording

## Approval Needed

Vincent should approve explicitly before Codex commits/pushes/deploys.

Suggested approval wording:

```text
Approve one trust/visual deploy for Operon Kitchens. Do not include file-upload backend changes.
```

## One-Deploy Smoke Check After Approval

After one approved deploy only:

1. Check `/` for header, hero, final CTA buttons, footer and chatbot.
2. Check `/quote` for the estimate entry and Step 1.
3. Check `/quote/review` for quote-review positioning.
4. Check `/request-review` for form, privacy/terms and submit path.
5. Check `/faqs` for static route health.
6. Check `/admin/leads` renders but remains token-protected.
7. Confirm public header/footer do not link to `/admin/leads`.
8. Stop after one smoke-check cycle.

## Stop Conditions

Do not deploy if:

- local tests, lint, build or `git diff --check` fail
- the release accidentally includes file-upload backend changes
- public copy implies a final fixed quote, legal advice, compliance approval, HBC approval, strata approval, guaranteed savings or instant ordering
- browser responses expose supplier costs, internal rates, margins, lead score, admin priority, internal notes, service keys or hidden pricing logic

