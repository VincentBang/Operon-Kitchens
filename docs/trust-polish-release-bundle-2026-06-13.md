# Trust Polish Release Bundle: 13 June 2026

Purpose: document the local trust-polish patch so it can be batched into one future approved release without reconstructing context from chat.

Deployment status: not needed now. This is a local release-candidate note only. Push/deploy/live verification should wait until Vincent approves a release checkpoint.

## Bundle Summary

This bundle tightens customer-facing trust language, chatbot presentation, route-layout consistency and public copy guardrails after Phase 1 conversion work was marked complete locally.

The patch is intended to make the existing public experience safer for controlled customer testing. It does not add payment, customer accounts, broad SEO expansion, production Supabase changes, Netlify setting changes, file deletion, retention automation or CRM features.

## Included Local Changes

- Chatbot launcher changed to a compact two-line version:
  - `Ask Operon`
  - `Kitchen scope guidance`
- Chatbot launcher now has an accessible label: `Ask Operon. Kitchen scope guidance`.
- Chatbot launcher CSS now targets the icon and text separately so copy does not collapse or inherit icon sizing.
- Quote-review copy no longer says `final price comparison`.
- How-it-works copy no longer says `guaranteed saving`.
- Service and education route fallback components no longer wrap themselves in `PublicLayout`; `_app` remains the single shared public layout path.
- Build-content verification now checks for the new chatbot marker and continues blocking stale footer/chatbot strings.
- Public copy tests now guard against unsafe terms such as `final price`, `MVP`, `structured review intake`, `legally checked` and `guaranteed saving`.

## Customer-Safe Guardrails Confirmed Locally

- No supplier costs, internal rates, margin logic, lead scores, admin priority, service keys or hidden pricing logic were introduced.
- No final fixed quote, legal approval, compliance approval or guaranteed savings claims were introduced.
- Quote review remains guidance only and points users toward review/site-measure pathways.
- Chatbot pathways stay customer-facing and do not link to `/admin/leads`.

## Local QA Completed

Commands run successfully:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Local exported-route visual/browser QA passed for the core route group at desktop and mobile widths, including `1440`, `1280`, `768`, `390` and `360`.

Checked route group:

- `/`
- `/quote`
- `/quote/review`
- `/areas`
- `/faqs`
- `/site-measure`
- `/kitchen-renovation-process`
- `/pc-sums-vs-provisional-sums`

Note: when serving `out/` with a raw static file server, clean URLs such as `/faqs` may need `.html` file paths locally. Netlify should serve the exported static route cleanly when publishing `out`.

## Future Approved Live Smoke Check

After Vincent approves one batched deploy, check only the affected public routes to conserve Netlify credits:

- `https://operonkitchens.netlify.app/`
- `https://operonkitchens.netlify.app/quote/review`
- `https://operonkitchens.netlify.app/faqs`
- `https://operonkitchens.netlify.app/request-review`

Smoke-check items:

- homepage loads and footer spacing remains clean
- quote-review page does not show `Phase 1`, `structured review intake`, `0/100` as the primary result or `final price comparison`
- FAQ route returns successfully
- request-review route still renders the form and privacy/terms acknowledgement
- chatbot launcher shows `Ask Operon` and `Kitchen scope guidance`
- chatbot quick prompts are separated and readable
- footer does not show `brand.Planning`
- no customer-facing internal pricing/admin fields appear
- no final fixed quote, legal approval, compliance approval or guaranteed savings claims appear

## Release Decision

This patch is suitable to include in the next controlled release batch. Deployment is optional until Vincent wants the trust-polish changes live.

Recommended batching: combine with any other already-tested local visual/copy fixes, then run one approved deploy and one focused live smoke check.

## Deferred

- production deploy
- production verification
- domain/email/Resend launch
- paid quote-review implementation
- customer accounts
- full CRM
- admin file deletion UI
- physical file deletion
- retention automation
