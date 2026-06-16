# Release Bundle Decision Matrix

Last updated: 17 June 2026

Purpose: decide what is worth one approved Netlify deploy during controlled testing.

Deployment status: not needed. This document does not approve a deploy.

## Bundle Options

| Bundle | Release value | Risk | Deploy need | Recommendation |
| --- | --- | --- | --- | --- |
| Trust polish | safer public wording, chatbot marker, quote-review trust fixes | low | optional | bundle with visual polish |
| Visual polish | header/logo/footer/button polish for customer trust | low-medium | optional | release before broader tester traffic |
| File-upload signed downloads | lets Vincent download uploaded files from `/admin/leads` | medium | required for live use | separate checkpoint unless deliberately bundled |
| Soft delete function | admin-only metadata soft-delete path | medium | required for live use | deploy with file signed-download release, but keep visible delete button deferred |
| Domain/email/Resend | professional sender and email alerts | medium external setup | required after env changes | separate release after domain/sender is verified |
| Quote-review service packaging | commercial clarity docs/copy | low | optional | can stay local until paid service copy is approved |

## Recommended Release Order

1. Trust + visual polish.
2. File upload signed-download + soft-delete backend.
3. Domain/email/Resend.
4. Quote-review service packaging.

## Do Not Bundle

Avoid bundling these unless there is a clear reason:

- production Supabase SQL changes with public visual fixes
- file operations with broad SEO expansion
- payment with quote-review report copy
- customer auth with controlled-testing fixes

## Before Any Bundle Deploy

Run:

```bash
npm test -- --runInBand
npm run lint
npm run build
git diff --check
```

Confirm:

- no secrets
- no public internal pricing fields
- no final quote/legal/compliance approval claims
- no Operon Flooring or Oz Timber changes
- manual live smoke-check steps are written before deploy
