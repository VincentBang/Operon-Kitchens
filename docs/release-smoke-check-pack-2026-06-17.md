# Release Smoke Check Pack: 17 June 2026

Purpose: provide the shortest safe smoke-check sequence for the next approved Operon Kitchens release. Use only after Vincent explicitly approves one push/deploy.

Deployment status: optional, not approved by this document.

## Before Approval

Run locally:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Confirm:

- no files outside `/Users/daibang/Documents/operon-kitchens/**` changed
- no Operon Flooring or Oz Timber files changed
- no secrets are committed
- no supplier costs, internal rates, margins, lead scores, admin priority, internal notes or service keys are public
- no final fixed quote, legal approval, compliance approval, HBC approval, strata approval, guaranteed savings or instant custom kitchen ordering claims were introduced

## One-Deploy Smoke Check

After one approved deploy only, check:

1. `/` renders the refreshed homepage, compact header, footer and planning-range proof.
2. `/quote/review` renders the quote-review product page and request-review path.
3. `/request-review` renders the intake form with privacy/terms acknowledgement.
4. `/site-measure` renders the site-measure/service pathway page.
5. `/faqs` renders without a server error.
6. `/admin/leads` renders `noindex,nofollow` and requires the admin token for lead data.
7. Public header/footer do not link to `/admin/leads`.
8. Chatbot text does not show `scope??Ask`.
9. Footer text does not show `brand.Planning`.
10. Browser/network responses do not expose service keys, supplier costs, internal rates, margins, lead scores, admin priority, internal notes or hidden pricing logic.

## If The File-Upload Bundle Is Included

Only if Vincent explicitly chooses the file-upload backend bundle in the same release:

1. Submit one controlled `/request-review` test with a small PNG or PDF.
2. Confirm the Supabase lead row is created.
3. Confirm uploaded file metadata appears in `/admin/leads`.
4. Click the admin `Download` control.
5. Confirm the signed URL opens the file.
6. Confirm no public file URL, service key or raw storage path is exposed to public users.

## Stop Conditions

Stop after one smoke-check cycle if:

- the deployed commit hash is wrong
- any checked route returns a server error
- a public page links to `/admin/leads`
- any secret or internal pricing/admin field appears in a browser response
- upload verification fails in a way that needs production log review
- Netlify credits are at risk

Do not run repeated clear-cache deploys without a confirmed production artifact/runtime reason and Vincent approval.
