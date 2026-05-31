# Operon Kitchens Release Checkpoints

Last updated: 31 May 2026

Use this file before any controlled-launch release, push, or deploy.

## 1. Boundary Check

- All writes are inside `/Users/daibang/Documents/operon-kitchens/**`.
- No Operon Flooring files modified.
- No Oz Timber files modified.
- No parent/root shared config modified.
- No production Supabase settings changed directly.
- No Netlify UI/settings changed directly.
- No secrets committed.

Command:

```bash
git status --short
git diff --stat
```

## 2. Customer-Safe Copy Check

Confirm public pages do not introduce:

- final fixed quote claims
- guaranteed quote or guaranteed savings
- legal approval
- compliance approval
- certified/compliant claims
- order instantly / online custom kitchen ordering claims
- supplier costs
- internal rates
- margin or markup
- lead score or lead priority
- admin priority
- internal notes

Safe language:

- planning estimate
- indicative range
- requires review
- may require confirmation
- subject to site measure
- written scope confirmation required
- general guidance only
- not legal advice
- not a final quote

## 3. Runtime Path Check

Because the public site is a static export:

- Public pages must not depend on Next API routes for production behaviour.
- Runtime backend behaviour must use Netlify Functions under `netlify/functions`.
- `/request-review` should use `/.netlify/functions/kitchen-request-review`.
- `/admin/leads` should use `/.netlify/functions/kitchen-admin-leads` and `/.netlify/functions/kitchen-admin-lead-update`.

Static-export regression check:

- `/quote/review` should submit to `/.netlify/functions/kitchen-request-review`, not `/api/leads`.
- Saved-estimate lookup on `/quote/review` should not call `/api/quotes` in the public static export.

## 4. Local Verification Commands

Run:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Build must pass and `scripts/verify-build-content.js` must pass.

## 5. Static Export Check

After build, inspect key output files:

- `out/index.html`
- `out/quote.html`
- `out/quote/review.html`
- `out/request-review.html`
- `out/admin/leads.html`
- `out/deploy-check.html`

Recommended checks:

```bash
rg -n "final fixed quote|guaranteed savings|compliance approval|legal approval|supplier cost|internal rate|lead score|admin priority" out || true
rg -n "Need help with scope\\?\\?Ask|brand\\.Planning|Clear kitchen renovation estimates before you book a site visit" out || true
```

## 6. Controlled-Launch Live Check

Only after an approved deploy:

- `/deploy-check` shows the expected commit.
- `/request-review` returns 200.
- `POST /.netlify/functions/kitchen-request-review` returns `202` for valid payload.
- Response has `ok: true`.
- Response has `delivery.stored: true`.
- Supabase row appears in `public.kitchen_request_reviews`.
- Attribution fields store when UTM params are present.
- `/admin/leads` shows the lead after entering the token.
- Status update works.
- Internal note update works.
- No secrets or internal pricing fields appear in browser responses.

## 7. Netlify Deploy Rule

Deployment is not automatic for QA or documentation tasks.

Always report one of:

- Deployment required.
- Deployment optional.
- Deployment not needed.

Avoid repeated clear-cache deploys unless production/runtime behaviour must be verified.

## 8. Final Report Format

Every implementation report should include:

1. Files created.
2. Files modified.
3. Files deleted, if any.
4. Tests run.
5. Lint/build result.
6. Deployment status: required, optional, or not needed.
7. Supabase/database changes proposed or created.
8. Shared infrastructure touched.
9. Confirmation no Operon Flooring or Oz Timber files were modified.
10. Anything deferred.
11. Approval needed from Vincent, if any.
